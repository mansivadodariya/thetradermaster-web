'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './signup.module.scss';
import Input from '@/components/input';
import PhoneInput from '@/components/phoneInput';
import FirebasePhoneModal from '@/components/firebasePhoneModal';
import PointerGlow from '@/components/pointerGlow';
import ContinueWithGoogle from '@/components/continueWithGoogle';
import {
    getAuthRedirectTarget,
    getStoredUser,
    getStoredUserId,
    clearAuthSession,
    fetchUserOnboardingStatus,
    setOnboardingCompletedInSession,
    clearOnboardingInSession,
    isUserOnboardingCompleted
} from '@/lib/authSession';
import { authApi, profileApi } from '@/lib/api';
import { trackUserSignup } from '@/lib/gtag';
import { validateSignup } from '@/lib/validation';
import { toast } from '@/components/toast';
import { supabase } from '@/lib/supabaseClient';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { getUtmParameters } from '@/lib/utm';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

import { getHeroFeatures } from '@/lib/authHeroFeatures';

const DarkLogo = "/assets/logo/logoWhite.svg";
const LightLogo = "/assets/logo/logo.svg";
const UserIcon = '/assets/icons/user.svg';
const EmailIcon = '/assets/icons/sms.svg';
const Lock = '/assets/icons/lock.svg';

const Signup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const { theme } = useTheme();
    const Logo = theme === 'light' ? LightLogo : DarkLogo;
    const heroFeatures = React.useMemo(() => getHeroFeatures(t), [t]);
    const codeFromQuery = searchParams.get('ref') || searchParams.get('code') || searchParams.get('referral_code') || '';
    const redirectTo = getAuthRedirectTarget(searchParams);

    // Auto-cycling active feature highlight animation
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveFeatureIndex((prev) => (prev + 1) % heroFeatures.length);
        }, 2800);
        return () => clearInterval(timer);
    }, [heroFeatures.length]);


    // Capture and persist referral code for 30 days
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const paramRef = searchParams.get('ref') || searchParams.get('code') || searchParams.get('referral_code');
        const now = Date.now();
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

        if (paramRef) {
            const item = { code: paramRef.trim(), expiry: now + THIRTY_DAYS_MS };
            try {
                localStorage.setItem('tradermaster_referral_code', JSON.stringify(item));
            } catch (e) { /* ignore */ }
            setForm(f => ({ ...f, referral_code: paramRef.trim() }));
        } else {
            try {
                const storedRaw = localStorage.getItem('tradermaster_referral_code');
                if (storedRaw) {
                    const parsed = JSON.parse(storedRaw);
                    if (parsed && parsed.code && parsed.expiry > now) {
                        setForm(f => f.referral_code ? f : ({ ...f, referral_code: parsed.code }));
                    } else {
                        localStorage.removeItem('tradermaster_referral_code');
                    }
                }
            } catch (e) { /* ignore */ }
        }
    }, [searchParams]);

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: '',
        referral_code: codeFromQuery
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Security: purge credentials from URL searchParams/address bar immediately on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const url = new URL(window.location.href);
            const hasPassword = url.searchParams.has('password') || url.searchParams.has('confirmPassword') || url.searchParams.has('pwd');
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
                url.searchParams.delete('confirmPassword');
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

    // States for phone step after Google Sign-in
    const [pendingPhoneUserId, setPendingPhoneUserId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [savingPhone, setSavingPhone] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
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
                        setShowOtpModal(true);
                        return;
                    }

                    window.location.assign(resolvePostAuthTarget(redirectTo));
                } catch (e) {
                    console.error('Error fetching user status in signup checkSession', e);
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

    const setPhone = (val) => {
        setForm((f) => ({ ...f, phone_number: val || '' }));
        if (errors.phone_number) setErrors((prev) => ({ ...prev, phone_number: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        const fieldErrors = validateSignup(form);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }
        setLoading(true);
        try {
            const utm = getUtmParameters();
            const signupPayload = { ...form, ...utm };
            await authApi.signup(signupPayload);
            trackUserSignup('email', { email: form.email, name: form.name });
            setSuccess(true);
        } catch (err) {
            toast.dismiss();
            toast.error(typeof err.message === 'string' ? err.message : 'Something went wrong. Please try again.');
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
        setShowOtpModal(true);
    };

    const handleOtpSuccess = async () => {
        setSavingPhone(true);
        const activeUid = pendingPhoneUserId || getStoredUserId();
        try {
            let apiRes = null;
            try {
                apiRes = await profileApi.updateProfile({
                    phone_number: phoneNumber,
                    is_phone_verified: true
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
                            is_phone_verified: true
                        })
                        .eq('id', activeUid);
                } catch (dbErr) {
                    console.warn("Supabase direct phone verification update error:", dbErr);
                }
            }

            let isOnboardingDone = localStorage.getItem('has_completed_onboarding') === 'true';
            if (typeof window !== 'undefined') {
                const parsed = JSON.parse(localStorage.getItem('user') || '{}');
                parsed.phone_number = phoneNumber;
                parsed.is_phone_verified = true;
                if (parsed.onboarding_completed) isOnboardingDone = true;
                localStorage.setItem('user', JSON.stringify(parsed));
                document.cookie = 'has_phone=true; path=/; SameSite=Lax';
                window.dispatchEvent(new CustomEvent('user:updated'));
            }

            toast.success(apiRes?.message || 'Phone number verified and saved!');
            let destination = redirectTo;
            if (!destination || destination === '/onboarding' || destination === '/steper' || destination.startsWith('/onboarding') || destination.startsWith('/steper')) {
                destination = '/dashboard';
            }
            if (!isOnboardingDone) {
                window.location.assign('/onboarding');
            } else {
                window.location.assign(destination);
            }
        } catch (err) {
            console.error('Failed to save phone number after verification:', err);
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
            setShowOtpModal(false);
        }
    };

    if (success) {
        return (
            <div className={styles.signuppage}>
                <div className={styles.ambientGlowTop} aria-hidden="true" />
                <div className={styles.ambientGlowBottom} aria-hidden="true" />
                <div className={styles.gridOverlay} aria-hidden="true" />

                <div className={styles.authContainer}>
                    <div className={styles.authCardSingle}>
                        <div className={styles.logoWrapper}>
                            <Link href="/" className={styles.logoLink} title="TraderMaster Home">
                                <img src={Logo} alt="TraderMaster Logo" className={styles.logoImg} />
                            </Link>
                        </div>
                        <div className={styles.text}>
                            <h2>{t('auth.checkEmail', 'Check your email')}</h2>
                            <p>{t('auth.verificationSent', `We sent a verification link to ${form.email}. Click the link to activate your account.`)}</p>
                            <p className={styles.note}>
                                {t('auth.spamNote', "Note: If you don't find the email in your inbox, please check your spam folder.")}
                            </p>
                        </div>
                        <div className={styles.accountText}>
                            <p><Link href="/login">{t('auth.backToLogin', 'Back to Log in')}</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.signuppage}>
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
                            {/* Mobile Brand Logo */}
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
                                                onClick={() => {
                                                    if (typeof window !== 'undefined') {
                                                        sessionStorage.setItem('skipPhoneVerification', 'true');
                                                        window.location.assign(resolvePostAuthTarget());
                                                    }
                                                }}
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
                                        <h1 className={styles.formTitle}>{t('auth.signup.title', 'Sign Up Account')}</h1>
                                        <p className={styles.formSubtitle}>{t('auth.signup.subtitle', 'Enter your personal data to create your account.')}</p>
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
                                            {/* First Name & Last Name in 2 columns */}
                                            <div className={styles.twoCol}>
                                                <Input
                                                    label={t('auth.signup.firstName', 'First Name')}
                                                    icon={UserIcon}
                                                    placeholder={t('auth.signup.firstNamePlaceholder', 'eg. John')}
                                                    name="first_name"
                                                    value={form.first_name}
                                                    onChange={set('first_name')}
                                                    error={errors.first_name}
                                                    maxLength={50}
                                                    autoComplete="given-name"
                                                />
                                                <Input
                                                    label={t('auth.signup.lastName', 'Last Name')}
                                                    icon={UserIcon}
                                                    placeholder={t('auth.signup.lastNamePlaceholder', 'eg. Francisco')}
                                                    name="last_name"
                                                    value={form.last_name}
                                                    onChange={set('last_name')}
                                                    error={errors.last_name}
                                                    maxLength={50}
                                                    autoComplete="family-name"
                                                />
                                            </div>

                                            <Input
                                                label={t('auth.signup.email', 'Email')}
                                                icon={EmailIcon}
                                                placeholder={t('auth.login.emailPlaceholder', 'eg. johndoe@gmail.com')}
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={set('email')}
                                                error={errors.email}
                                                maxLength={100}
                                                autoComplete="email"
                                            />

                                            <PhoneInput
                                                label={t('auth.signup.phone', 'Phone Number')}
                                                placeholder={t('auth.signup.phonePlaceholder', 'eg. +1 234 567 890')}
                                                value={form.phone_number}
                                                onChange={setPhone}
                                                error={errors.phone_number}
                                                defaultCountry="AE"
                                            />

                                            <div className={styles.twoCol}>
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
                                                        autoComplete="new-password"
                                                    />
                                                    <span className={styles.fieldHint}>{t('auth.signup.passwordHint', 'Must be at least 8 characters')}</span>
                                                </div>

                                                <Input
                                                    label={t('auth.signup.confirmPassword', 'Confirm Password')}
                                                    icon={Lock}
                                                    placeholder={t('auth.signup.confirmPasswordPlaceholder', 'Confirm your password')}
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={form.confirmPassword}
                                                    onChange={set('confirmPassword')}
                                                    error={errors.confirmPassword}
                                                    maxLength={50}
                                                    autoComplete="new-password"
                                                />
                                            </div>

                                            <Input
                                                label={t('auth.signup.referralCode', 'Referral Code (Optional)')}
                                                icon={UserIcon}
                                                placeholder={t('auth.signup.referralPlaceholder', 'Enter referral code')}
                                                name="referral_code"
                                                value={form.referral_code}
                                                onChange={set('referral_code')}
                                                error={errors.referral_code}
                                                maxLength={50}
                                                autoComplete="off"
                                            />

                                            <button
                                                type="submit"
                                                className={styles.submitBtn}
                                                disabled={loading}
                                            >
                                                {loading ? t('auth.signup.creatingAccount', 'Creating account...') : t('auth.signup.submitBtn', 'Sign Up')}
                                            </button>
                                        </div>
                                    </form>

                                    <div className={styles.orDivider}>
                                        <span>{t('auth.login.or', 'Or')}</span>
                                    </div>

                                    {/* Social Login Button Row */}
                                    <div className={styles.socialRow}>
                                        <div className={styles.googleButtonWrapper}>
                                            <ContinueWithGoogle redirectTo={redirectTo} onPendingPhone={setPendingPhoneUserId} />
                                        </div>
                                    </div>

                                    <div className={styles.accountBottomLink}>
                                        <p>
                                            {t('auth.signup.alreadyHaveAccount', 'Already have an account?')} <Link href="/login">{t('auth.signup.logInLink', 'Log In')}</Link>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <FirebasePhoneModal
                isOpen={showOtpModal}
                phoneNumber={phoneNumber}
                onClose={() => {
                    setShowOtpModal(false);
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('skipPhoneVerification', 'true');
                        window.location.assign(resolvePostAuthTarget());
                    }
                }}
                onSkip={() => {
                    setShowOtpModal(false);
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('skipPhoneVerification', 'true');
                        window.location.assign(resolvePostAuthTarget());
                    }
                }}
                onSuccess={handleOtpSuccess}
            />
        </div>
    );
};

export default Signup;
