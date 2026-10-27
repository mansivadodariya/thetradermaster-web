'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import Step from './step';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import Stepthree from './stepthree';
import styles from './onboarding.module.scss';
import {
    getStoredUserId,
    getStoredUser,
    fetchUserOnboardingStatus,
    setOnboardingCompletedInSession
} from '@/lib/authSession';
import { supabase } from '@/lib/supabaseClient';
import PointerGlow from '@/components/pointerGlow';
import { useLanguage } from '@/context/LanguageContext';

// SVG Icons for Header & Footer
const SkipIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 4L13 12L5 20V4Z" fill="#18C98B" />
        <path d="M13 4L21 12L13 20V4Z" fill="#18C98B" />
    </svg>
);

const ShieldCheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Onboarding() {
    const router = useRouter();
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [checkingStatus, setCheckingStatus] = useState(true);

    // If user has already completed onboarding, immediately bounce them to /dashboard
    useEffect(() => {
        const checkAlreadyCompleted = async () => {
            const storedUser = getStoredUser();
            const uid = getStoredUserId() || storedUser?.id || '';
            const email = storedUser?.email ? String(storedUser.email).trim().toLowerCase() : '';
            const localFlag = typeof window !== 'undefined' ? localStorage.getItem('has_completed_onboarding') : null;

            // If already completed in local session, redirect to dashboard immediately
            if (localFlag === 'true' || storedUser?.onboarding_completed === true) {
                window.location.replace('/dashboard');
                return;
            }

            if (uid || email) {
                try {
                    const status = await fetchUserOnboardingStatus(uid, email);

                    if (status.exists && status.onboarding_completed) {
                        setOnboardingCompletedInSession();
                        window.location.replace('/dashboard');
                        return;
                    }
                } catch (e) {
                    console.warn('Onboarding mount check error:', e);
                }
            }

            // User has NOT completed onboarding: allow questionnaire to render
            setCheckingStatus(false);
        };

        checkAlreadyCompleted();
    }, [router]);

    // Persisted form state across steps (NO default selections)
    const [experience, setExperience] = useState('');
    const [tradingStyles, setTradingStyles] = useState([]);
    const [helpGoals, setHelpGoals] = useState([]);
    const [markets, setMarkets] = useState([]);

    const isCurrentStepValid = React.useMemo(() => {
        switch (currentStep) {
            case 1:
                return Boolean(experience);
            case 2:
                return Array.isArray(tradingStyles) && tradingStyles.length > 0;
            case 3:
                return Array.isArray(helpGoals) && helpGoals.length > 0;
            case 4:
                return Array.isArray(markets) && markets.length > 0;
            default:
                return false;
        }
    }, [currentStep, experience, tradingStyles, helpGoals, markets]);

    const toggleTradingStyle = (id) => {
        setTradingStyles((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleHelpGoal = (id) => {
        setHelpGoals((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleMarket = (id) => {
        setMarkets((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const saveOnboardingPreferences = async (completed = true) => {
        const onboardingData = {
            experience,
            tradingStyles,
            helpGoals,
            markets,
            completed,
            completedAt: new Date().toISOString(),
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem('chronosx_onboarding', JSON.stringify(onboardingData));
            setOnboardingCompletedInSession();
        }

        const storedUser = getStoredUser();
        const userId = getStoredUserId() || storedUser?.id || '';
        const email = storedUser?.email ? String(storedUser.email).trim().toLowerCase() : '';

        if (supabase && (userId || email)) {
            try {
                let query = supabase.from('users').update({
                    experience_level: experience,
                    trading_styles: tradingStyles,
                    help_goals: helpGoals,
                    preferred_markets: markets,
                    onboarding_completed: true,
                    onboarding_completed_at: new Date().toISOString(),
                });
                if (userId && email) {
                    query = query.or(`id.eq.${userId},email.eq.${email}`);
                } else if (userId) {
                    query = query.eq('id', userId);
                } else {
                    query = query.eq('email', email);
                }
                await query;
            } catch (err) {
                console.warn('Could not save onboarding preferences to Supabase:', err);
            }
        }
    };

    const handleNext = async () => {
        if (!isCurrentStepValid) return;

        if (currentStep < 4) {
            setCurrentStep((prev) => prev + 1);
        } else {
            await saveOnboardingPreferences(true);
            window.location.replace('/dashboard');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        } else {
            router.push('/login');
        }
    };

    const handleSkip = async () => {
        await saveOnboardingPreferences(false);
        window.location.replace('/dashboard');
    };

    if (checkingStatus) {
        return (
            <div className={styles.onboardingPage} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh', display: 'flex' }}>
                <div className={styles.ambientGlowTop} aria-hidden="true" />
                <div className={styles.ambientGlowBottom} aria-hidden="true" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 10 }}>
                    <div style={{ width: '40px', height: '40px', border: '3.5px solid rgba(24, 201, 139, 0.2)', borderTopColor: '#18C98B', borderRadius: '50%', animation: 'spin 0.85s linear infinite' }} />
                    <p style={{ color: '#A0AEC0', fontSize: '13.5px', margin: 0, fontWeight: 600, letterSpacing: '0.3px' }}>
                        {t('onboarding.verifying', 'Verifying profile status...')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.onboardingPage}>
            {/* Interactive Mouse Move Emerald Glow Follower */}
            <PointerGlow color="rgba(24, 201, 139, 0.35)" size={260} />

            {/* Background Glow Overlays */}
            <div className={styles.ambientGlowTop} aria-hidden="true" />
            <div className={styles.ambientGlowBottom} aria-hidden="true" />

            {/* Common Fixed Top Header */}
            <div className={styles.topHeader}>
                <button type="button" className={styles.skipBtn} onClick={handleSkip}>
                    <SkipIcon />
                    <span>{t('onboarding.skip', 'Skip for now')}</span>
                </button>

                <div className={styles.stepperContainer}>
                    {/* Step 1 */}
                    <div
                        className={classNames(
                            styles.stepCircle,
                            currentStep > 1 && styles.completed,
                            currentStep === 1 && styles.active
                        )}
                        onClick={() => setCurrentStep(1)}
                        role="button"
                        tabIndex={0}
                    >
                        {currentStep > 1 ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : currentStep === 1 ? (
                            <div className={styles.activeCore} />
                        ) : null}
                    </div>

                    {/* Line 1 -> 2 */}
                    <div className={classNames(styles.stepLine, currentStep >= 2 && styles.activeLine)} />

                    {/* Step 2 */}
                    <div
                        className={classNames(
                            styles.stepCircle,
                            currentStep > 2 && styles.completed,
                            currentStep === 2 && styles.active
                        )}
                        onClick={() => setCurrentStep(2)}
                        role="button"
                        tabIndex={0}
                    >
                        {currentStep > 2 ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : currentStep === 2 ? (
                            <div className={styles.activeCore} />
                        ) : null}
                    </div>

                    {/* Line 2 -> 3 */}
                    <div className={classNames(styles.stepLine, currentStep >= 3 && styles.activeLine)} />

                    {/* Step 3 */}
                    <div
                        className={classNames(
                            styles.stepCircle,
                            currentStep > 3 && styles.completed,
                            currentStep === 3 && styles.active
                        )}
                        onClick={() => setCurrentStep(3)}
                        role="button"
                        tabIndex={0}
                    >
                        {currentStep > 3 ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : currentStep === 3 ? (
                            <div className={styles.activeCore} />
                        ) : null}
                    </div>

                    {/* Line 3 -> 4 */}
                    <div className={classNames(styles.stepLine, currentStep >= 4 && styles.activeLine)} />

                    {/* Step 4 */}
                    <div
                        className={classNames(
                            styles.stepCircle,
                            currentStep === 4 && styles.active
                        )}
                        onClick={() => setCurrentStep(4)}
                        role="button"
                        tabIndex={0}
                    >
                        {currentStep === 4 && <div className={styles.activeCore} />}
                    </div>
                </div>

                <div className={styles.stepCount}>
                    <span>{t('onboarding.stepCount', 'Step {{current}} of {{total}}', { current: currentStep, total: 4 })}</span>
                </div>
            </div>

            {/* Dynamic Center Step Content */}
            <div className={styles.stepContentArea}>
                {currentStep === 1 && (
                    <Step
                        selectedLevel={experience}
                        onSelectLevel={setExperience}
                    />
                )}
                {currentStep === 2 && (
                    <StepOne
                        selectedOptions={tradingStyles}
                        onToggleOption={toggleTradingStyle}
                    />
                )}
                {currentStep === 3 && (
                    <StepTwo
                        selectedOptions={helpGoals}
                        onToggleOption={toggleHelpGoal}
                    />
                )}
                {currentStep === 4 && (
                    <Stepthree
                        selectedOptions={markets}
                        onToggleOption={toggleMarket}
                    />
                )}
            </div>

            {/* Common Fixed Bottom Footer */}
            <div className={styles.bottomFooter}>
                <div className={styles.footerLeft}>
                    {currentStep === 1 ? (
                        <div className={styles.securityNotice}>
                            <ShieldCheckIcon />
                            <span>{t('onboarding.securityNotice', 'Your answers are private and secure')}</span>
                        </div>
                    ) : (
                        <button type="button" className={styles.backBtn} onClick={handleBack}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{t('onboarding.back', 'Back')}</span>
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className={classNames(styles.nextBtn, !isCurrentStepValid && styles.disabledBtn)}
                    onClick={handleNext}
                    disabled={!isCurrentStepValid}
                    aria-disabled={!isCurrentStepValid}
                >
                    <span>{currentStep === 4 ? t('onboarding.getStarted', 'Get Started') : t('onboarding.next', 'Next')}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#0A0807" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
