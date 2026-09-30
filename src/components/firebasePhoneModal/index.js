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
import Button from '@/components/button';

const LineImage = '/assets/images/line.png';
const AuthIcon = '/assets/icons/auth.svg';
const ArrowIcon = '/assets/icons/arrow.svg';

export default function FirebasePhoneModal({
    isOpen,
    phoneNumber: initialPhoneNumber = '',
    onClose,
    onSuccess,
    autoTriggerSend = true,
    isPhoneReadOnly = false,
}) {
    const { t } = useLanguage();
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

    // Disabled for now
    return null;
    /*
    return (
        <AnimatePresence>
            ...
        </AnimatePresence>
    );
    */
}
