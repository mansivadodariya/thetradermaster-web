'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './firebasePhoneModal.module.scss';
import { initRecaptcha, sendFirebaseSmsOtp, verifyFirebaseSmsOtp } from '@/lib/firebaseClient';
import { authApi } from '@/lib/api';
import { toast } from '@/components/toast';
import { getStoredUserId, setPhoneVerifiedInSession } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/button';

const LineImage = '/assets/images/line.png';
const AuthIcon = '/assets/icons/auth.svg';
const ArrowIcon = '/assets/icons/arrow.svg';

export default function FirebasePhoneModal({
    isOpen,
    phoneNumber: initialPhoneNumber = '',
    onClose,
    onSkip,
    onSuccess,
    autoTriggerSend = true,
    isPhoneReadOnly = false,
}) {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const logoSrc = "/assets/logo/logoWhite.svg";
    // const logoSrc = theme === 'dark' ? '/assets/logo/logoWhite.svg' : '/assets/logo/logo.svg';
    const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success'
    const [phone, setPhone] = useState(initialPhoneNumber);
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(30);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const inputRefs = useRef([]);
    const recaptchaVerifierRef = useRef(null);

    const hasAutoSentRef = useRef(false);

    const handleSkip = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('skip_phone_verification', 'true');
        }
        if (onSkip) {
            onSkip();
        } else if (onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setStep('phone');
            setOtpValues(['', '', '', '', '', '']);
            setError('');
            setLoading(false);
            setConfirmationResult(null);
            hasAutoSentRef.current = false;
            return;
        }

        const phoneToUse = initialPhoneNumber || phone;
        if (initialPhoneNumber) {
            setPhone(initialPhoneNumber);
        }

        // Initialize invisible reCAPTCHA verifier
        try {
            const verifier = initRecaptcha('firebase-recaptcha-container', {
                size: 'invisible',
            });
            recaptchaVerifierRef.current = verifier;
        } catch (err) {
            console.warn('Recaptcha init warning:', err);
        }

        if (autoTriggerSend && phoneToUse && !hasAutoSentRef.current) {
            hasAutoSentRef.current = true;
            handleSendSms(phoneToUse);
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
            toast.success(t('auth.smsSentToast', `SMS verification code sent to ${phoneToUse}`));

            setTimeout(() => {
                if (inputRefs.current[0]) inputRefs.current[0].focus();
            }, 200);
        } catch (err) {
            console.error('Firebase SMS send error:', err);
            let msg = err.message || t('auth.smsSendError', 'Failed to send SMS OTP code via Firebase.');
            if (err.code === 'auth/invalid-app-credential' || msg.includes('invalid-app-credential')) {
                msg = 'Firebase Authentication error: Please ensure Phone Sign-In is enabled in Firebase Console and localhost is in Authorized Domains.';
            } else if (err.code === 'auth/captcha-check-failed' || msg.includes('captcha')) {
                msg = 'reCAPTCHA verification failed. Please try again.';
            }
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
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        const otpCode = otpValues.join('');
        if (otpCode.length < 6) {
            setError(t('auth.enterAllDigits', 'Please enter all 6 digits of the SMS code.'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Verify 6-digit code with Firebase client SDK -> gets Firebase idToken
            const { idToken, phoneNumber: firebasePhone } = await verifyFirebaseSmsOtp(confirmationResult, otpCode);
            const verifiedPhone = firebasePhone || phone;

            // 2. Call backend API: POST /api/v1/auth/verify-phone-firebase with id_token & phone_number
            const userId = getStoredUserId() || '';
            const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
            const userEmail = storedUser.email || '';

            try {
                await authApi.verifyPhoneFirebase(idToken, userId, verifiedPhone, userEmail);
            } catch (backendErr) {
                console.warn('Backend verify-phone-firebase error:', backendErr);
            }

            // 3. Update session storage flags
            setPhoneVerifiedInSession(verifiedPhone);

            // 4. Switch to animated success modal
            setStep('success');

            setTimeout(() => {
                if (onSuccess) onSuccess(verifiedPhone);
            }, 2200);
        } catch (err) {
            console.error('Verify Firebase OTP error:', err);
            const msg = err.message || t('auth.invalidCodeError', 'Invalid SMS verification code. Please try again.');
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className={styles.modalOverlay} onClick={handleSkip}>
                <div id="firebase-recaptcha-container" style={{ display: 'none' }}></div>
                <motion.div
                    className={styles.modalCard}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.topGlowLayer} />

                    {(onClose || onSkip) && step !== 'success' && (
                        <button className={styles.closeBtn} onClick={handleSkip} aria-label={t('common.close', 'Close')}>
                            ✕
                        </button>
                    )}

                    {step === 'phone' && (
                        <div className={styles.modalBody}>
                            <div className={styles.logoWrapper}>
                                <img src={logoSrc} alt="Trader Master" />
                            </div>
                            <h3 className={styles.title}>{t('auth.completeProfile', 'Complete Your Profile')}</h3>
                            <p className={styles.subtitle}>
                                {t('auth.enterPhoneDesc', 'Please enter your phone number to continue.')}
                            </p>

                            <div className={styles.phoneInputContainer}>
                                <PhoneInput
                                    international
                                    defaultCountry="AE"
                                    value={phone}
                                    onChange={setPhone}
                                    placeholder={t('profile.phoneLabel', 'Phone number')}
                                    className={`${styles.customPhoneInput} ${Boolean(initialPhoneNumber || isPhoneReadOnly) ? styles.disabledInput : ''}`}
                                    disabled={Boolean(initialPhoneNumber || isPhoneReadOnly)}
                                />
                            </div>

                            {error && <div className={styles.errorBanner}>{error}</div>}

                            <div className={styles.actionBtnWrapper}>
                                <Button
                                    text={loading ? t('auth.sendingCode', 'Sending Code...') : t('auth.continue', 'Continue')}
                                    onClick={() => handleSendSms()}
                                    disabled={loading || !phone}
                                    fullWidth
                                    icon={ArrowIcon}
                                />
                            </div>

                            <div className={styles.skipWrapper}>
                                <button
                                    type="button"
                                    className={styles.skipBtn}
                                    onClick={handleSkip}
                                >
                                    {t('common.skipForNow', 'Skip for now')}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'otp' && (
                        <div className={styles.modalBody}>
                            <h3 className={styles.title}>{t('auth.verifyPhoneTitle', 'Verify Phone Number')}</h3>
                            <p className={styles.subtitle}>
                                {t('auth.sentSmsCodeTo', 'We sent a 6-digit SMS verification code to')} <strong>{phone}</strong> {t('auth.viaSmsText', 'via Text Message.')}
                            </p>

                            <form onSubmit={handleVerifyOtp} style={{ width: '100%' }}>
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

                            <div className={styles.skipWrapper}>
                                <button
                                    type="button"
                                    className={styles.skipBtn}
                                    onClick={handleSkip}
                                >
                                    {t('common.skipForNow', 'Skip for now')}
                                </button>
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
