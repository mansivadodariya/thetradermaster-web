'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './firebasePhoneModal.module.scss';
import { initRecaptcha, sendFirebaseSmsOtp, verifyFirebaseSmsOtp } from '@/lib/firebaseClient';
import { authApi } from '@/lib/api';
import { toast } from '@/components/toast';
import { getStoredUserId, setPhoneVerifiedInSession } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/button';
import { supabase } from '@/lib/supabaseClient';

const LineImage = '/assets/images/line.png';
const DarkLogo = '/assets/logo/logo.png';
const LightLogo = '/assets/logo/darklogo.png';
const AuthIcon = '/assets/icons/auth.svg';
const ArrowIcon = '/assets/icons/arrow.svg';

export default function FirebasePhoneModal({
    isOpen,
    phoneNumber: initialPhoneNumber = '',
    title,
    subtitle,
    onClose,
    onSkip,
    onSuccess,
    autoTriggerSend = true,
}) {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const logoSrc = theme === 'light' ? LightLogo : DarkLogo;
    const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success'
    const [phone, setPhone] = useState(initialPhoneNumber);
    const [hasTyped, setHasTyped] = useState(false);
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(30);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const inputRefs = useRef([]);
    const recaptchaVerifierRef = useRef(null);

    const isPhoneValid = Boolean(phone && isValidPhoneNumber(phone));

    useEffect(() => {
        if (!isOpen) {
            setStep('phone');
            setOtpValues(['', '', '', '', '', '']);
            setError('');
            setLoading(false);
            setConfirmationResult(null);
            return;
        }

        setPhone(initialPhoneNumber);

        // Initialize invisible reCAPTCHA verifier
        try {
            const verifier = initRecaptcha('firebase-recaptcha-container', {
                size: 'invisible',
            });
            recaptchaVerifierRef.current = verifier;
        } catch (err) {
            console.warn('Recaptcha init warning:', err);
        }

        if (autoTriggerSend && initialPhoneNumber) {
            handleSendSms(initialPhoneNumber);
        }
    }, [isOpen, initialPhoneNumber]);

    // Resend cooldown timer
    useEffect(() => {
        if (!isOpen || resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [isOpen, resendCooldown]);

    const handleSendSms = async (targetPhone) => {
        const phoneToUse = targetPhone || phone;
        if (!phoneToUse) {
            setError(t('auth.validPhoneRequired', 'Please enter a valid phone number.'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (!recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = initRecaptcha('firebase-recaptcha-container', { size: 'invisible' });
            }

            const result = await sendFirebaseSmsOtp(phoneToUse, recaptchaVerifierRef.current);
            setConfirmationResult(result);
            setStep('otp');
            setResendCooldown(30);
            toast.success(t('auth.smsSentToast', 'SMS verification code sent to {{phone}}', { phone: phoneToUse }));

            setTimeout(() => {
                if (inputRefs.current[0]) inputRefs.current[0].focus();
            }, 200);
        } catch (err) {
            console.error('Firebase SMS send error:', err);
            let msg = err.message || t('auth.smsSendError', 'Failed to send SMS OTP code via Firebase.');
            const raw = String(err?.message || '');
            const code = err?.code || '';
            if (code === 'auth/operation-not-allowed' || raw.includes('operation-not-allowed') || raw.includes('region enabled')) {
                msg = t('auth.smsRegionNotAllowed', 'SMS sending is not enabled for this region in your Firebase Console. Please enable this country under Firebase Authentication > Settings > SMS Region Policy, or add this number as a test phone number.');
            } else if (code === 'auth/too-many-requests' || raw.includes('too-many-requests')) {
                msg = t('auth.tooManyRequests', 'Too many requests. Please wait a few minutes and try again.');
            } else if (code === 'auth/quota-exceeded' || raw.includes('quota-exceeded')) {
                msg = t('auth.quotaExceeded', 'SMS quota exceeded for Firebase project. Please try again later.');
            }
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };


    const executeVerification = async (codeToVerify) => {
        const otpCode = codeToVerify || otpValues.join('');
        if (otpCode.length < 6) {
            setError(t('auth.enterAllDigits', 'Please enter all 6 digits of the SMS code.'));
            return;
        }

        if (loading) return;
        setLoading(true);
        setError('');

        try {
            // 1. Verify 6-digit code with Firebase client SDK -> gets Firebase idToken
            const { idToken, phoneNumber: verifiedPhone } = await verifyFirebaseSmsOtp(confirmationResult, otpCode);

            const finalPhone = verifiedPhone || phone;
            const userId = getStoredUserId() || '';

            // 2. Call backend API: POST /api/v1/auth/verify-phone-firebase with id_token
            try {
                if (idToken) {
                    await authApi.verifyPhoneFirebase(idToken, userId);
                }
            } catch (apiErr) {
                console.warn('Backend verify-phone-firebase API notification:', apiErr);
            }

            // 3. Fallback direct update in Supabase if user ID is known
            if (supabase && userId) {
                try {
                    await supabase
                        .from('users')
                        .update({
                            phone_number: finalPhone,
                            is_phone_verified: true
                        })
                        .eq('id', userId);
                } catch (dbErr) {
                    console.warn('Supabase direct phone status update warning:', dbErr);
                }
            }

            // 4. Update session storage & cookies & broadcast event
            setPhoneVerifiedInSession(finalPhone);

            // 5. Switch to animated success modal
            setStep('success');

            setTimeout(() => {
                if (onSuccess) onSuccess(finalPhone);
            }, 1800);
        } catch (err) {
            console.error('Verify Firebase OTP error:', err);
            const msg = err.message || t('auth.invalidCodeError', 'Invalid SMS verification code. Please try again.');
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otpValues];
            digits.forEach((d, i) => {
                newOtp[i] = d;
            });
            setOtpValues(newOtp);
            setError('');
            const nextFocus = Math.min(digits.length, 5);
            if (inputRefs.current[nextFocus]) {
                inputRefs.current[nextFocus].focus();
            }
            if (digits.length === 6) {
                executeVerification(newOtp.join(''));
            }
            return;
        }

        const digit = value.replace(/\D/g, '');
        const newOtp = [...otpValues];
        newOtp[index] = digit;
        setOtpValues(newOtp);
        setError('');

        if (digit && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }

        if (digit && index === 5) {
            const fullCode = newOtp.join('');
            if (fullCode.length === 6) {
                executeVerification(fullCode);
            }
        }
    };

    const handlePhoneSubmit = (e) => {
        if (e) e.preventDefault();
        if (!isPhoneValid || loading) return;
        handleSendSms();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const otpCode = otpValues.join('');
            if (otpCode.length === 6 && !loading) {
                executeVerification(otpCode);
            }
            return;
        }
        if (e.key === 'Backspace' && !otpValues[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        executeVerification();
    };

    const handleSkip = () => {
        if (typeof onSkip === 'function') {
            onSkip();
        } else if (typeof onClose === 'function') {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('skipPhoneVerification', 'true');
                if (window.location.pathname !== '/dashboard') {
                    window.location.assign('/dashboard');
                }
            }
            onClose();
        } else if (typeof window !== 'undefined') {
            sessionStorage.setItem('skipPhoneVerification', 'true');
            window.location.assign('/dashboard');
        }
    };

    const handleClose = () => {
        if (typeof onClose === 'function') {
            onClose();
        } else {
            handleSkip();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className={styles.modalOverlay} data-theme={theme} onClick={handleClose}>
                <div id="firebase-recaptcha-container"></div>
                <motion.div
                    className={styles.modalCard}
                    data-theme={theme}
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.topGlowLayer} />

                    {(onClose || onSkip) && step !== 'success' && (
                        <button className={styles.closeBtn} onClick={handleClose} aria-label={t('common.close', 'Close')}>
                            ✕
                        </button>
                    )}

                    <div className={styles.brandLogoHeader}>
                        <img src={logoSrc} alt="ChronosX" className={styles.brandLogoImg} />
                    </div>

                    {step === 'phone' && (
                        <div className={styles.modalBody}>
                            <h3 className={styles.title}>{title || t('auth.completeProfile', 'Complete Your Profile')}</h3>
                            {subtitle ? (
                                <p className={styles.subtitle}>{subtitle}</p>
                            ) : (
                                <p className={styles.subtitle}>
                                    <span className={styles.verifyFirstNotice}>{t('auth.verifyNumberFirst', 'Verify your number first.')}</span>
                                    <span className={styles.enterPhoneLine}>{t('auth.enterPhoneDesc', 'Please enter your phone number to continue.')}</span>
                                </p>
                            )}

                            <form
                                method="post"
                                action="javascript:void(0);"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handlePhoneSubmit(e);
                                }}
                                className={styles.phoneForm}
                            >
                                <div className={styles.phoneInputContainer}>
                                    <PhoneInput
                                        international
                                        limitMaxLength
                                        defaultCountry="AE"
                                        value={phone}
                                        onChange={(val) => {
                                            setPhone(val || '');
                                            setHasTyped(true);
                                            if (error) setError('');
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handlePhoneSubmit(e);
                                            }
                                        }}
                                        placeholder={t('profile.phoneLabel', 'Enter phone number')}
                                        numberInputProps={{
                                            maxLength: 20
                                        }}
                                        className={`${styles.customPhoneInput} ${hasTyped && phone ? (isPhoneValid ? styles.isValid : styles.isInvalid) : ''}`}
                                    />
                                </div>

                                {hasTyped && phone && !isPhoneValid && (
                                    <div className={styles.phoneHintError}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <span>{t('auth.invalidPhoneCountryFormat', 'Please enter a valid phone number for the selected country.')}</span>
                                    </div>
                                )}

                                {error && <div className={styles.errorBanner}>{error}</div>}

                                <div className={styles.actionBtnWrapper}>
                                    <Button
                                        type="submit"
                                        text={loading ? t('auth.sendingCode', 'Sending Code...') : t('auth.sendSmsCode', 'Send SMS Verification Code')}
                                        disabled={loading || !isPhoneValid}
                                        fullWidth
                                        icon={ArrowIcon}
                                    />
                                    {(onClose || onSkip) && (
                                        <button
                                            type="button"
                                            className={styles.skipBtn}
                                            onClick={handleSkip}
                                            disabled={loading}
                                        >
                                            {t('auth.skipForNow', 'Skip for now')}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 'otp' && (
                        <div className={styles.modalBody}>
                            <h3 className={styles.title}>{t('auth.verifyPhoneTitle', 'Verify Phone Number')}</h3>
                            <p className={styles.subtitle}>
                                {t('auth.sentSmsCodeTo', 'We sent a 6-digit SMS verification code to')} <strong>{phone}</strong>{' '}
                                <button
                                    type="button"
                                    className={styles.changePhoneLink}
                                    onClick={() => {
                                        setStep('phone');
                                        setError('');
                                    }}
                                >
                                    ({t('auth.editNumber', 'Edit')})
                                </button>
                            </p>

                            <form
                                method="post"
                                action="javascript:void(0);"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleVerifyOtp(e);
                                }}
                                className={styles.phoneForm}
                            >
                                <div className={styles.otpInputsRow}>
                                    {otpValues.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            ref={(el) => (inputRefs.current[idx] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(idx, e)}
                                            className={`${styles.otpBox} ${digit ? styles.filled : ''}`}
                                            disabled={loading}
                                        />
                                    ))}
                                </div>

                                {error && <div className={styles.errorBanner}>{error}</div>}

                                <div className={styles.actionBtnWrapper}>
                                    <Button
                                        type="submit"
                                        text={loading ? t('auth.verifying', 'Verifying...') : t('auth.verifyCodeContinue', 'Verify Code & Continue')}
                                        disabled={loading || otpValues.join('').length < 6}
                                        fullWidth
                                        icon={ArrowIcon}
                                    />
                                    {(onClose || onSkip) && (
                                        <button
                                            type="button"
                                            className={styles.skipBtn}
                                            onClick={handleSkip}
                                            disabled={loading}
                                        >
                                            {t('auth.skipForNow', 'Skip for now')}
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className={styles.resendRow}>
                                {resendCooldown > 0 ? (
                                    <span>{t('auth.resendCooldownPrefix', 'Resend SMS code in')} <strong>{resendCooldown}s</strong></span>
                                ) : (
                                    <button
                                        type="button"
                                        className={styles.resendBtn}
                                        onClick={() => handleSendSms()}
                                        disabled={loading}
                                    >
                                        {t('auth.resendSmsOtp', 'Resend SMS OTP')}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className={styles.modalBody}>
                            <motion.div
                                className={styles.successIconWrapper}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, 10, 0] }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            >
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </motion.div>
                            <h3 className={styles.title}>{t('auth.phoneVerifiedTitle', 'Phone Verified!')}</h3>
                            <p className={styles.subtitle}>
                                {t('auth.phoneVerifiedDesc', 'Your mobile number has been authenticately verified with Firebase and saved to your profile.')}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
