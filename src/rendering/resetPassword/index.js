'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './resetPassword.module.scss';
import Input from '@/components/input';
import Button from '@/components/button';
import { authApi } from '@/lib/api';
import { validateResetPassword } from '@/lib/validation';
import { toast } from '@/components/toast';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const DarkLogo = "/assets/logo/logoWhite.svg";
const LightLogo = "/assets/logo/logo.svg";
const Lock = '/assets/icons/lock.svg';
const ArrowIcon = '/assets/icons/arrow.svg';

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const { theme } = useTheme();
    const Logo = theme === 'light' ? LightLogo : DarkLogo;
    const token = searchParams.get('token') || '';

    const [form, setForm] = useState({ new_password: '', confirm_password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    // Security: sanitize any sensitive credentials from URL query/header
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const url = new URL(window.location.href);
            if (
                url.searchParams.has('password') ||
                url.searchParams.has('new_password') ||
                url.searchParams.has('confirm_password') ||
                url.searchParams.has('pwd')
            ) {
                url.searchParams.delete('password');
                url.searchParams.delete('new_password');
                url.searchParams.delete('confirm_password');
                url.searchParams.delete('pwd');
                const newSearch = url.searchParams.toString();
                const cleanHref = url.pathname + (newSearch ? `?${newSearch}` : '') + url.hash;
                window.history.replaceState(null, '', cleanHref);
            }
        } catch {
            // Safe fallback
        }
    }, []);

    const set = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!token) {
            toast.error('Reset token is missing or invalid.');
            return;
        }

        const fieldErrors = validateResetPassword(form);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);
        try {
            await authApi.resetPassword(token, form.new_password);
            setDone(true);
        } catch (err) {
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
                        <Link href="/" className={styles.logoLink} title="TraderMaster Home">
                            <img src={Logo} alt="TraderMaster Logo" className={styles.logoImg} />
                        </Link>
                    </div>

                    <div className={styles.text}>
                        <h2>{t('auth.resetPasswordHeader', 'Reset Password')}</h2>
                        <p>{t('auth.resetPasswordDesc', 'Enter your new password below.')}</p>
                    </div>
                    {done ? (
                        <div className={styles.success} role="status">
                            <p>{t('auth.resetPasswordSuccess', 'Password reset successfully.')}</p>
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
                                        label={t('auth.newPasswordLabel', 'NEW PASSWORD')}
                                        icon={Lock}
                                        placeholder={t('auth.newPasswordPlaceholder', 'Enter new password')}
                                        type="password"
                                        name="new_password"
                                        value={form.new_password}
                                        onChange={set('new_password')}
                                        error={errors.new_password}
                                        maxLength={50}
                                        autoComplete="new-password"
                                    />
                                    <Input
                                        label={t('auth.confirmPasswordLabel', 'CONFIRM PASSWORD')}
                                        icon={Lock}
                                        placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm new password')}
                                        type="password"
                                        name="confirm_password"
                                        value={form.confirm_password}
                                        onChange={set('confirm_password')}
                                        error={errors.confirm_password}
                                        maxLength={50}
                                        autoComplete="new-password"
                                    />
                                    <Button
                                        type="submit"
                                        text={loading ? t('auth.resettingPasswordBtn', 'Resetting...') : t('auth.resetPasswordHeader', 'Reset Password')}
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

export default ResetPassword;
