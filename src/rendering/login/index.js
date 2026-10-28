'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.scss';
import Input from '@/components/input';
import ContinueWithGoogle from '@/components/continueWithGoogle';
import { authApi, profileApi } from '@/lib/api';
import {
    persistAuthSession,
    getAuthRedirectTarget,
    getStoredUser,
    getStoredUserId,
    clearAuthSession,
    setOnboardingCompletedInSession,
    clearOnboardingInSession,
    fetchUserOnboardingStatus,
    isUserOnboardingCompleted
} from '@/lib/authSession';
import { validateLogin } from '@/lib/validation';
import { fetchBrokerLotData } from '@/lib/brokerLotApi';
import { toast } from '@/components/toast';
import PhoneInput from '@/components/phoneInput';
import PointerGlow from '@/components/pointerGlow';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

import { getHeroFeatures } from '@/lib/authHeroFeatures';

const DarkLogo = "/assets/logo/logoWhite.svg";
const LightLogo = "/assets/logo/logo.svg";
const UserIcon = '/assets/icons/user.svg';
const Lock = '/assets/icons/lock.svg';

const Login = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const { theme } = useTheme();
    const Logo = theme === 'light' ? LightLogo : DarkLogo;
    const heroFeatures = React.useMemo(() => getHeroFeatures(t), [t]);
    const redirectTo = getAuthRedirectTarget(searchParams);
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Security: purge credentials from URL searchParams/address bar immediately on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const url = new URL(window.location.href);
            const hasPassword = url.searchParams.has('password') || url.searchParams.has('pwd');
            const hasEmail = url.searchParams.has('email');

            if (hasPassword || hasEmail) {
                const emailParam = url.searchParams.get('email');
                const passwordParam = url.searchParams.get('password') || url.searchParams.get('pwd');

                if (emailParam || passwordParam) {
                    setForm((prev) => ({
                        ...prev,
                        email: prev.email || emailParam || '',
                        password: prev.password || passwordParam || '',
                    }));
                }

                url.searchParams.delete('password');
                url.searchParams.delete('pwd');
                url.searchParams.delete('email');

                const newSearch = url.searchParams.toString();
                const cleanHref = url.pathname + (newSearch ? `?${newSearch}` : '') + url.hash;
                window.history.replaceState(null, '', cleanHref);
            }
        } catch {
            // Safe fallback
        }
    }, []);

    // Auto-cycling active feature highlight animation
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveFeatureIndex((prev) => (prev + 1) % heroFeatures.length);
        }, 2800);
        return () => clearInterval(timer);
    }, [heroFeatures.length]);

    // States for phone step after Google Sign-in / unverified phone
    const [pendingPhoneUserId, setPendingPhoneUserId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [savingPhone, setSavingPhone] = useState(false);
    const onboardingCompletedRef = React.useRef(null);

    const resolvePostAuthTarget = (preferredTarget = redirectTo) => {
        let isDone = onboardingCompletedRef.current;
        if (isDone === null || isDone === undefined) {
            isDone = isUserOnboardingCompleted();
        }

        if (!isDone) {
            return '/onboarding';
        }

        let destination = preferredTarget || '/dashboard';
        if (!destination || destination === '/onboarding' || destination === '/steper' || destination.startsWith('/onboarding') || destination.startsWith('/steper')) {
            destination = '/dashboard';
        }
        return destination;
    };

    useEffect(() => {
        const checkSession = async () => {
            const uid = getStoredUserId();
            const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            const hasCookie = typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('auth_token='));
            if (uid && token && hasCookie) {
                try {
                    const user = getStoredUser();
                    const status = await fetchUserOnboardingStatus(uid, user?.email);

                    if (status.exists && !status.is_active) {
                        clearAuthSession();
                        toast.error('Your account is inactive. Please contact admin.');
                        return;
                    }

                    const isOnboardingDone = Boolean(status.onboarding_completed);
                    onboardingCompletedRef.current = isOnboardingDone;
                    if (isOnboardingDone) {
                        setOnboardingCompletedInSession();
                    } else {
                        clearOnboardingInSession();
                    }

                    const isPhoneVerified = status.is_phone_verified === true || status.user?.is_phone_verified === true;
                    if (status.user && !isPhoneVerified) {
                        setPendingPhoneUserId(status.user.id || uid);
                        setPhoneNumber(status.user.phone_number || '');
                        return;
                    }

                    window.location.assign(resolvePostAuthTarget());
                } catch (e) {
                    console.error('Error fetching user status in checkSession', e);
                }
            }
        };

        checkSession();
    }, [searchParams, redirectTo]);

    const set = (field) => (e) => {
        const val = e.target.value.trimStart();
        setForm((f) => ({ ...f, [field]: val }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        const fieldErrors = validateLogin(form);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }
        setLoading(true);
        try {
            const data = await authApi.login(form.email, form.password);
            const sessionUser = persistAuthSession(data);
            const uid = sessionUser?.id || getStoredUserId();
            const cleanEmail = form.email.trim().toLowerCase();

            try {
                await fetchBrokerLotData(cleanEmail);
            } catch (_) {}

            // Fetch authenticated user's onboarding status
            const status = await fetchUserOnboardingStatus(uid, cleanEmail);

            if (status.user?.id && sessionUser) {
                sessionUser.id = status.user.id;
                sessionUser.user_id = status.user.id;
                localStorage.setItem('user_id', status.user.id);
            }

            if (status.exists && !status.is_active) {
                clearAuthSession();
                toast.error('Your account is inactive. Please contact admin.');
                return;
            }

            const isOnboardingDone = Boolean(status.onboarding_completed);
            onboardingCompletedRef.current = isOnboardingDone;
            if (isOnboardingDone) {
                setOnboardingCompletedInSession();
            } else {
                clearOnboardingInSession();
            }

            const isPhoneVerified = status.is_phone_verified === true || status.user?.is_phone_verified === true;
            if (status.user && !isPhoneVerified) {
                setPendingPhoneUserId(status.user.id || uid);
                setPhoneNumber(status.user.phone_number || '');
                return;
            }

            window.location.assign(resolvePostAuthTarget());
        } catch (err) {
            toast.dismiss();
            const status = err?.status;
            const rawMsg = typeof err.message === 'string' ? err.message : '';
            const lowerMsg = rawMsg.toLowerCase();

            // Only redirect to maintenance if server indicates maintenance or backend outage (503, 502, 504, or explicit maintenance error)
            const isMaintenanceOrServerDown =
                err?.isMaintenance ||
                status === 503 ||
                status === 502 ||
                status === 504 ||
                err?.data?.status === 'maintenance' ||
                lowerMsg.includes('maintenance') ||
                lowerMsg.includes('service temporarily unavailable');

            if (isMaintenanceOrServerDown) {
                router.push('/maintenance?from=/login');
                return;
            }

            let msg = rawMsg || 'Something went wrong. Please try again.';
            if (
                lowerMsg.includes('account is not active') ||
                lowerMsg.includes('account is inactive') ||
                lowerMsg.includes('account not active')
            ) {
                msg = 'Account is not active. Please contact admin.';
            }
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePhoneNumber = async (e) => {
        if (e) e.preventDefault();

        if (!phoneNumber) {
            setPhoneError('Phone number is required.');
            return;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            setPhoneError('Please enter a valid phone number with country code.');
            return;
        }

        const activeUid = pendingPhoneUserId || getStoredUserId();
        if (!activeUid) {
            toast.error('Session expired. Please log in again.');
            clearAuthSession();
            setPendingPhoneUserId('');
            return;
        }

        setPhoneError('');
        setSavingPhone(true);
        try {
            let apiRes = null;
            try {
                apiRes = await profileApi.updateProfile({
                    phone_number: phoneNumber,
                });
            } catch (apiErr) {
                console.warn("profileApi.updateProfile fallback to direct update:", apiErr);
            }

            if (supabase && activeUid) {
                try {
                    await supabase
                        .from('users')
                        .update({
                            phone_number: phoneNumber,
                        })
                        .eq('id', activeUid);
                } catch (dbErr) {
                    console.warn("Supabase direct phone verification update error:", dbErr);
                }
            }

            if (typeof window !== 'undefined') {
                const parsed = JSON.parse(localStorage.getItem('user') || '{}');
                parsed.phone_number = phoneNumber;
                localStorage.setItem('user', JSON.stringify(parsed));
                document.cookie = 'has_phone=true; path=/; SameSite=Lax';
                sessionStorage.removeItem('skipPhoneVerification');
                window.dispatchEvent(new CustomEvent('user:updated'));
            }

            toast.success(apiRes?.message || 'Phone number saved!');
            window.location.assign(resolvePostAuthTarget());
        } catch (err) {
            console.error('Failed to save phone number:', err);
            const msg = String(err.message || '');
            let userFriendlyMsg = 'Failed to save phone number.';
            if (msg.includes('unique constraint') || msg.includes('duplicate key') || msg.includes('already exists') || msg.includes('already in use')) {
                userFriendlyMsg = 'This phone number is already in use.';
            } else if (msg) {
                userFriendlyMsg = msg;
            }
            setPhoneError(userFriendlyMsg);
            toast.error(userFriendlyMsg);
        } finally {
            setSavingPhone(false);
        }
    };

    const handleSkipPhone = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('skipPhoneVerification');
            window.location.assign(resolvePostAuthTarget());
        }
    };

    return (
        <div className={styles.loginpage}>
            {/* Interactive Mouse Move Emerald Glow Follower */}
            <PointerGlow color="rgba(24, 201, 139, 0.35)" size={250} />

            {/* Ambient Background Glows */}
            <div className={styles.ambientGlowTop} aria-hidden="true" />
            <div className={styles.ambientGlowBottom} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            <div className={styles.authContainer}>
                <div className={styles.splitAuthCard}>

                    {/* ════════════ LEFT HERO PANEL (MATCHING REFERENCE DESIGN) ════════════ */}
                    <div className={styles.leftStepperPanel}>
                        <div className={styles.auroraGlow} aria-hidden="true" />

                        <div className={styles.leftContentWrapper}>
                            {/* Top Aura Area */}
                            <div className={styles.topAuraSpacer} aria-hidden="true" />

                            {/* Center/Bottom Info Stack */}
                            <div className={styles.leftMainBlock}>
                                {/* Brand Logo */}
                                <Link href="/" className={styles.brandHeaderLink} title="TraderMaster Home">
                                    <img src={Logo} alt="TraderMaster" className={styles.leftLogoImg} />
                                </Link>

                                {/* Header & Subtitle (Aligned with Landing Page) */}
                                <div className={styles.leftTextGroup}>
                                    <h2 className={styles.leftTitle}>
                                        {t('auth.hero.titleLine1', 'Trade Smarter with')} <br />
                                        <span className={styles.highlightText}>{t('auth.hero.titleHighlight', 'AI That Never Sleeps')}</span>
                                    </h2>
                                    <p className={styles.leftSubtitle}>
                                        {t('auth.hero.subtitle', 'Get real-time AI trading signals, market insights, and trade recommendations across Forex, Stocks, and Global Markets.')}
                                    </p>
                                </div>

                                {/* 5 Feature Highlight Pills with Auto-Cycling Animation */}
                                <div className={styles.featurePillList}>
                                    {heroFeatures.map((feat, idx) => {
                                        const isActive = activeFeatureIndex === idx;
                                        return (
                                            <div
                                                key={feat.title}
                                                className={`${styles.featurePill} ${isActive ? styles.activePill : ''}`}
                                                onMouseEnter={() => setActiveFeatureIndex(idx)}
                                            >
                                                <div className={styles.featureIconBox}>
                                                    {feat.icon}
                                                </div>
                                                <div className={styles.featureContent}>
                                                    <span className={styles.featurePillText}>{feat.title}</span>
                                                    <span className={styles.featurePillDesc}>{feat.desc}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Clean SVG Vector Assurance Badge */}
                            <div className={styles.leftFooterNotice}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>{t('auth.hero.securityNotice', '256-Bit Encrypted & Non-Custodial')}</span>
                            </div>
                        </div>
                    </div>

                    {/* ════════════ RIGHT FORM PANEL ════════════ */}
                    <div className={styles.rightFormPanel}>
                        <div className={styles.formInnerContainer}>
                            {/* Mobile Brand Logo (Visible only on mobile/tablet) */}
                            <div className={styles.mobileLogoWrapper}>
                                <Link href="/" className={styles.mobileLogoLink} title="TraderMaster Home">
                                    <img src={Logo} alt="TraderMaster" className={styles.mobileLogoImg} />
                                </Link>
                            </div>

                            {pendingPhoneUserId ? (
                                <>
                                    <div className={styles.formHeader}>
                                        <h1 className={styles.formTitle}>{t('auth.completeProfile', 'Complete Your Profile')}</h1>
                                        <p className={styles.formSubtitle}>{t('auth.enterPhoneDesc', 'Please enter your phone number to continue.')}</p>
                                    </div>
                                    <form
                                        method="post"
                                        action="javascript:void(0);"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSavePhoneNumber(e);
                                        }}
                                        noValidate
                                    >
                                        <div className={styles.spacingGrid}>
                                            <PhoneInput
                                                label={t('profile.phoneLabel', 'Phone Number')}
                                                value={phoneNumber}
                                                onChange={(val) => {
                                                    setPhoneNumber(val || '');
                                                    setPhoneError('');
                                                }}
                                                placeholder={t('profile.phoneLabel', 'Phone number')}
                                                error={phoneError}
                                                defaultCountry="AE"
                                            />
                                            <button
                                                type="submit"
                                                className={styles.submitBtn}
                                                disabled={savingPhone}
                                            >
                                                {savingPhone ? t('auth.saving', 'Saving...') : t('auth.continue', 'Continue')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSkipPhone}
                                                className={styles.skipBtn}
                                            >
                                                {t('auth.skipForNow', 'Skip for now')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    clearAuthSession();
                                                    window.location.assign('/');
                                                }}
                                                className={styles.backBtn}
                                            >
                                                {t('auth.backToHome', 'Back to Home')}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <div className={styles.formHeader}>
                                        <h1 className={styles.formTitle}>{t('auth.login.title', 'Log In Account')}</h1>
                                        <p className={styles.formSubtitle}>{t('auth.login.subtitle', 'Enter your credentials to access your account.')}</p>
                                    </div>


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
                                                label={t('auth.login.emailOrUsername', 'Email or Username')}
                                                icon={UserIcon}
                                                placeholder={t('auth.login.emailPlaceholder', 'eg. johndoe@gmail.com')}
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={set('email')}
                                                error={errors.email}
                                                maxLength={100}
                                                autoComplete="username"
                                            />

                                            <div>
                                                <Input
                                                    label={t('auth.login.passwordLabel', 'Password')}
                                                    icon={Lock}
                                                    placeholder={t('auth.login.passwordPlaceholder', 'Enter your password')}
                                                    type="password"
                                                    name="password"
                                                    value={form.password}
                                                    onChange={set('password')}
                                                    error={errors.password}
                                                    maxLength={50}
                                                    autoComplete="current-password"
                                                />
                                                <div className={styles.forgotRow}>
                                                    <Link href="/forgot-password">{t('auth.login.forgotPassword', 'Forgot password?')}</Link>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className={styles.submitBtn}
                                                disabled={loading}
                                            >
                                                {loading ? t('auth.login.loggingIn', 'Logging in...') : t('auth.login.submitBtn', 'Log In')}
                                            </button>
                                        </div>
                                    </form>

                                    <div className={styles.orDivider}>
                                        <span>{t('auth.login.or', 'Or')}</span>
                                    </div>

                                    {/* Social Login Header Row */}
                                    <div className={styles.socialRow}>
                                        <div className={styles.googleButtonWrapper}>
                                            <ContinueWithGoogle
                                                redirectTo={redirectTo}
                                                onPendingPhone={(uid, phone) => {
                                                    setPendingPhoneUserId(uid);
                                                    if (phone) setPhoneNumber(phone);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.accountBottomLink}>
                                        <p>
                                            {t('auth.login.noAccount', "Don't have an account?")} <Link href="/signup">{t('auth.login.signUpLink', 'Sign Up')}</Link>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;