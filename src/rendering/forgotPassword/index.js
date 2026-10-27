'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './forgotPassword.module.scss';
import Input from '@/components/input';
import Button from '@/components/button';
import { authApi } from '@/lib/api';
import { validateForgotPassword } from '@/lib/validation';
import { toast } from '@/components/toast';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const DarkLogo = '/assets/logo/logo.png';
const LightLogo = '/assets/logo/darklogo.png';
const EmailIcon = '/assets/icons/sms.svg';
const ArrowIcon = '/assets/icons/arrow.svg';

const ForgotPassword = () => {
    const router = useRouter();
    const { t } = useLanguage();
    const { theme } = useTheme();
    const Logo = theme === 'light' ? LightLogo : DarkLogo;
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleEmailChange = (e) => {
        const val = e.target.value.trimStart();
        setEmail(val);
        if (emailError) setEmailError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        const fieldError = validateForgotPassword(email);
        if (fieldError) {
            setEmailError(fieldError);
            return;
        }

        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSent(true);
        } catch (err) {
            toast.dismiss();
            toast.error(typeof err.message === 'string' ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            {/* Ambient Background Glows */}
            <div className={styles.ambientGlowTop} aria-hidden="true" />
            <div className={styles.ambientGlowBottom} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    {/* Redesigned Logo */}
                    <div className={styles.logoWrapper}>
                        <Link href="/" className={styles.logoLink} title="ChronosX Home">
                            <img src={Logo} alt="ChronosX Logo" className={styles.logoImg} />
                        </Link>
                    </div>

                    <div className={styles.text}>
                        <h2>{t('auth.forgotPasswordTitle', 'Forgot Password')}</h2>
                        <p>{t('auth.forgotPasswordDesc', "Enter your email and we'll send you a link to reset your password. Please check your spam folder as well.")}</p>
                    </div>
                    {sent ? (
                        <div className={styles.success} role="status">
                            <p>{t('auth.checkResetEmail', "Check your email for a reset link. Please check your spam folder if you don't see it in your inbox.")}</p>
                            <div className={styles.accountText}>
                                <p><Link href="/login">{t('auth.backToLogin', 'Back to Log in')}</Link></p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <form
                                method="post"
                                action="javascript:void(0);"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }}
                                noValidate
                            >
                                <div className={styles.spacingGrid}>
                                    <Input
                                        label={t('auth.emailLabel', 'EMAIL')}
                                        icon={EmailIcon}
                                        placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        error={emailError}
                                        maxLength={100}
                                        autoComplete="email"
                                    />
                                    <Button
                                        type="submit"
                                        text={loading ? t('auth.sending', 'Sending...') : t('auth.sendResetBtn', 'Send Reset Link')}
                                        icon={ArrowIcon}
                                        disabled={loading}
                                    />
                                </div>
                            </form>
                            <div className={styles.accountText}>
                                <p><Link href="/login">{t('auth.backToLogin', 'Back to Log in')}</Link></p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
