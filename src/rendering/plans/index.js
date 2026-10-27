'use client';

import SectionHeader from '@/components/sectionHeader';
import CommonSectionHeader from '@/components/CommonSectionHeader';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './plans.module.scss';
import { fetchSubscriptionPlans, defaultSubscriptionPlans } from '@/lib/plansData';
import { subscriptionApi } from '@/lib/subscriptionApi';
import { useSubscription } from '@/context/SubscriptionContext';
import { getStoredUser, getStoredUserId } from '@/lib/authSession';
import { refreshCreditsFromServer } from '@/lib/credits';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/components/toast';
import CommonCta from '@/components/commonCta';
import { useTabPermission } from '@/lib/useTabPermission';

import ActiveSubscriptionCard from './components/ActiveSubscriptionCard';
import PaymentSummaryModal from './components/PaymentSummaryModal';
import PaymentSuccessModal from './components/PaymentSuccessModal';
import PaymentFailedModal from './components/PaymentFailedModal';

import { HexGiftBoxIcon } from '@/icons/giftBoxIcon';

const GoldenCheckCircleIcon = () => (
    <div className={styles.goldenCheckCircle}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    </div>
);

const ZapIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const ShieldCheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);

const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const CpuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
);

const ArrowUpRightIcon = () => (
    <svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: 'auto' }}>
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const faqs = [
    {
        q: "How do ChronosX AI Credits work?",
        a: "Credits power high-compute neural model inferences on the ChronosX platform. For example, an automated Chart Pattern Vision Scan consumes 10 credits, a deep Conversational Market Query consumes 15 credits, and an in-depth AI Past Trade Audit consumes 50 credits. Credits refresh automatically with your active subscription."
    },
    {
        q: "Can I upgrade or renew my plan at any time?",
        a: "Yes. You can upgrade to a higher tier anytime. Unused credits from your previous cycle roll over into your new tier allocation, and your priority execution bandwidth is immediately upgraded."
    },
    {
        q: "Which financial markets and instruments can I analyze?",
        a: "ChronosX supports multi-asset analysis across major & minor Forex pairs (EUR/USD, GBP/USD, USD/JPY), Global Indices (US30, NAS100, SPX500), and Commodities (Gold/XAUUSD, Crude Oil)."
    },
    {
        q: "What payment methods are supported for checkout?",
        a: "We support instant decentralized deposits (USDT, USDC, SOL, BTC) as well as international card gateways. All transactions are securely processed with 256-bit institutional encryption and immediate autonomous activation."
    }
];

export default function SubscriptionPlansView() {
    const router = useRouter();
    const pathname = usePathname();
    const isDashboard = Boolean(pathname?.includes('subscription-plans'));
    const isOutside = !isDashboard;
    const { t, language } = useLanguage();
    const hasPlansPermission = useTabPermission('Subscription Plans');

    useEffect(() => {
        if (hasPlansPermission === false && isOutside) {
            router.replace('/');
        }
    }, [hasPlansPermission, isOutside, router]);

    const { subscription, hasActivePlan, evaluatePlanAction, refreshSubscription } = useSubscription();

    const [plans, setPlans] = useState(defaultSubscriptionPlans);
    const [loading, setLoading] = useState(true);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [submittingPlanId, setSubmittingPlanId] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);

    // Modal states
    const [summaryModalOpen, setSummaryModalOpen] = useState(false);
    const [summaryPlan, setSummaryPlan] = useState(null);
    const [summaryActionType, setSummaryActionType] = useState('SUBSCRIBE');

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successPlan, setSuccessPlan] = useState(null);
    const [successOrderId, setSuccessOrderId] = useState(null);

    const [failedModalOpen, setFailedModalOpen] = useState(false);
    const [failedReason, setFailedReason] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function loadPlans() {
            try {
                const data = await fetchSubscriptionPlans();
                if (isMounted && data && data.length > 0) {
                    setPlans(data);
                }
            } catch (_) {
                if (isMounted) setPlans(defaultSubscriptionPlans);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        loadPlans();
        return () => { isMounted = false; };
    }, []);

    // Handle return payment status if user was redirected back from payment gateway
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment_status');
        const isPayment = params.get('isPayment');
        const planId = params.get('plan_id') || params.get('planId');
        const orderId = params.get('order_id') || params.get('orderId');
        const reason = params.get('reason') || params.get('error');

        if (paymentStatus === 'success' || isPayment === 'true') {
            const matchingPlan = plans.find(p => p.id === planId) || defaultSubscriptionPlans.find(p => p.id === planId) || plans[1] || defaultSubscriptionPlans[1];
            setSuccessPlan(matchingPlan);
            setSuccessOrderId(orderId);
            setSuccessModalOpen(true);
            if (orderId) {
                subscriptionApi.verifyPaymentReturn(orderId, 'success');
            }
            refreshSubscription();
            refreshCreditsFromServer();
            toast.success(t('plans.paymentSuccess', 'Payment completed successfully! Subscription is active.'));

            const cleanUrl = new URL(window.location.href);
            cleanUrl.searchParams.delete('isPayment');
            cleanUrl.searchParams.delete('payment_status');
            cleanUrl.searchParams.delete('planId');
            cleanUrl.searchParams.delete('plan_id');
            cleanUrl.searchParams.delete('order_id');
            window.history.replaceState({}, '', cleanUrl.toString());
        } else if (paymentStatus === 'failed' || isPayment === 'false') {
            if (orderId) {
                subscriptionApi.verifyPaymentReturn(orderId, 'failed', reason || 'cancelled');
            }
            setFailedReason(reason);
            setFailedModalOpen(true);
            toast.error(t('plans.paymentCancelled', 'Payment was cancelled or incomplete. Your active plan is safe.'));

            const cleanUrl = new URL(window.location.href);
            cleanUrl.searchParams.delete('isPayment');
            cleanUrl.searchParams.delete('payment_status');
            cleanUrl.searchParams.delete('planId');
            cleanUrl.searchParams.delete('plan_id');
            cleanUrl.searchParams.delete('order_id');
            cleanUrl.searchParams.delete('reason');
            window.history.replaceState({}, '', cleanUrl.toString());
        }
    }, [plans, refreshSubscription, t]);

    const handleSelectPlan = async (plan) => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('access_token');
        const user = getStoredUser();
        const userId = getStoredUserId();

        if (!token || (!user && !userId)) {
            let redirectPath = '/plans';
            if (window.location.pathname === '/' || window.location.pathname === '') {
                redirectPath = '/#pricing';
            } else if (window.location.pathname === '/plans') {
                redirectPath = '/plans';
            } else {
                const hash = window.location.hash || (document.getElementById('pricing') ? '#pricing' : '');
                redirectPath = `${window.location.pathname}${window.location.search || ''}${hash}`;
            }
            router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
            return;
        }

        const priceVal = Number(plan.price);
        const isPlanFree = !isNaN(priceVal) ? priceVal === 0 : (String(plan.price || '').toLowerCase() === 'free');

        if (isPlanFree) {
            toast.success(t('plans.freePlanActive', 'You already have full access to Starter AI!'));
            router.push('/dashboard');
            return;
        }

        const actionMeta = evaluatePlanAction(plan, t);
        let resolvedAction = actionMeta.action;

        // Check backend plan eligibility: POST /api/v1/subscription/check-eligibility
        try {
            const eligibility = await subscriptionApi.checkEligibility(plan.id);
            if (eligibility) {
                if (eligibility.allowed === false) {
                    toast.error(eligibility.message || 'You cannot select this plan at this time.');
                    return;
                }
                if (eligibility.action_type) {
                    resolvedAction = eligibility.action_type;
                }
            }
        } catch (err) {
            console.warn('[plans] Eligibility check note:', err);
        }

        setSummaryPlan(plan);
        setSummaryActionType(resolvedAction);
        setSelectedPlanId(plan.id);
        setSummaryModalOpen(true);
    };

    const handleProceedPayment = async ({ plan, amount }) => {
        setSelectedPlanId(plan.id);
        setSubmittingPlanId(plan.id);
        try {
            // Direct Instant Crypto (Cregis Gateway)
            const res = await subscriptionApi.createCryptoDeposit({
                amount: Number(amount ?? plan.price),
                plan_id: plan.id,
                currency: 'USDT',
                chain: 'TRON',
            });

            const checkoutUrl = subscriptionApi.extractCheckoutUrl(res);

            if (checkoutUrl) {
                toast.success(t('plans.redirecting', 'Redirecting to secure payment...'));
                setSummaryModalOpen(false);
                window.location.href = checkoutUrl;
            } else {
                setSummaryModalOpen(false);
                const orderId = res?.order_id || res?.data?.order_id || res?.data?.deposit_id || `ORD-${Date.now()}`;
                setSuccessPlan(plan);
                setSuccessOrderId(orderId);
                setSuccessModalOpen(true);
                await refreshSubscription();
                await refreshCreditsFromServer();
                toast.success(t('plans.upgradeSuccess', 'Subscription activated successfully!'));
            }
        } catch (err) {
            toast.error(err?.message || t('common.somethingWentWrong', 'Failed to initialize payment session.'));
            throw err;
        } finally {
            setSubmittingPlanId(null);
        }
    };

    const handleRenewActivePlan = () => {
        if (!subscription) return;
        const currentPlanObj = plans.find(p => p.id === subscription.plan_id) || defaultSubscriptionPlans.find(p => p.id === subscription.plan_id) || plans[0];
        setSummaryPlan(currentPlanObj);
        setSummaryActionType('RENEW');
        setSummaryModalOpen(true);
    };

    const toggleFaq = (idx) => {
        setOpenFaq(prev => (prev === idx ? null : idx));
    };

    if (hasPlansPermission === false && isOutside) {
        return null;
    }

    return (
        <div className={`${styles.plansPage} ${isDashboard ? styles.dashboardPlansPage : styles.outsidePage} ${styles[`lang_${language}`] || ''}`}>
            {/* Ambient Background Aura Lights */}
            <div className={styles.ambientGoldTop} aria-hidden="true" />
            <div className={styles.ambientGlowCenter} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            <div className="container">
                {/* 1. Header Section */}
                {isDashboard ? (
                    <CommonSectionHeader
                        as="h1"
                        badge={t('plans.pricingTiersBadge', 'CHRONOSX PRICING TIERS')}
                        badgeIcon={
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        }
                        title={t('nav.plans', 'Subscription Plans')}
                        highlightText={t('plans.highlightText', '& AI Credits')}
                        subtitle={t('plans.subtitle', 'Unlock sub-second AI pattern recognition, live multi-timeframe scans, and automated quant strategy backtesting.')}
                        isCard={true}
                    />
                ) : (
                    <SectionHeader
                        as="h1"
                        badge={t('plans.pricingTiersBadge', 'CHRONOSX PRICING TIERS')}
                        title1={t('plans.heroTitle1', 'Institutional AI Power,')}
                        title2={t('plans.heroTitle2', 'Tailored For Your Edge')}
                        breakLine={false}
                        description={t('plans.subtitle', 'Unlock sub-second AI pattern recognition, live multi-timeframe scans, and automated quant strategy backtesting.')}
                        align="center"
                    />
                )}

                {/* 2. Active Subscription Banner (Dashboard View) */}
                {isDashboard && hasActivePlan && subscription && (
                    <ActiveSubscriptionCard
                        subscription={subscription}
                        onRenewClick={handleRenewActivePlan}
                    />
                )}

                {/* 3. Pricing Plans Grid */}
                {loading ? (
                    <div className={styles.loadingGrid}>
                        <div className={styles.skeletonCard} />
                        <div className={styles.skeletonCard} />
                        <div className={styles.skeletonCard} />
                    </div>
                ) : (
                    <motion.div 
                        className={styles.plansGrid}
                        initial={{ opacity: 0, y: 35 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {plans.map((plan) => {
                            const isArabic = language === 'ar';
                            const isFilipino = language === 'ph';
                            const defaultPlan = defaultSubscriptionPlans.find(d => d.id === plan.id) || {};

                            const isBestValue = Boolean(
                                plan.is_best_value ||
                                plan.best_value ||
                                plan.is_featured ||
                                plan.is_popular ||
                                plan.id === 'standard'
                            );

                            let badgeText = isFilipino
                                ? (plan.badge_ph || plan.badge)
                                : isArabic
                                ? (plan.badge_ar || plan.badge)
                                : plan.badge;

                            if (!badgeText && isBestValue) {
                                badgeText = isFilipino ? 'PINAKAMAHUSAY NA HALAGA' : isArabic ? 'الأكثر شعبية' : 'MOST POPULAR';
                            }

                            if (!badgeText && defaultPlan.badge) {
                                badgeText = isFilipino
                                    ? (defaultPlan.badge_ph || defaultPlan.badge)
                                    : isArabic
                                    ? (defaultPlan.badge_ar || defaultPlan.badge)
                                    : defaultPlan.badge;
                            }

                            const isFeatured = isBestValue || plan.id === 'standard' || plan.id === 'growth';
                            const isPremium = plan.id === 'premium' || plan.id === 'pro';
                            const priceNum = Number(plan.price);
                            const isFree = !isNaN(priceNum) ? priceNum === 0 : (String(plan.price || '').toLowerCase() === 'free');
                            const isBasic = plan.id === 'basic' || (plan.name || '').toLowerCase().includes('basic') || (plan.name || '').toLowerCase().includes('starter');
                            const isSelected = selectedPlanId === plan.id;

                            const name = isFilipino
                                ? (plan.name_ph || defaultPlan.name_ph || plan.name)
                                : isArabic
                                ? (plan.name_ar || defaultPlan.name_ar || plan.name)
                                : (plan.name || defaultPlan.name);

                            const description = isFilipino
                                ? (plan.description_ph || defaultPlan.description_ph || plan.description)
                                : isArabic
                                ? (plan.description_ar || defaultPlan.description_ar || plan.description)
                                : (plan.description || defaultPlan.description);

                            const validity = isFilipino
                                ? (plan.validity_ph || defaultPlan.validity_ph || plan.validity)
                                : isArabic
                                ? (plan.validity_ar || defaultPlan.validity_ar || plan.validity)
                                : (plan.validity || defaultPlan.validity);

                            const actionMeta = evaluatePlanAction(plan, t);
                            const ctaText = isFree
                                ? t('plans.getStartedFree', 'Get Started Free')
                                : actionMeta.label;

                            const featuresList = (isFilipino && plan.features_ph?.length)
                                ? plan.features_ph
                                : (isArabic && plan.features_ar?.length)
                                ? plan.features_ar
                                : (plan.features?.length ? plan.features : defaultPlan.features || []);

                            return (
                                <div
                                    key={plan.id}
                                    className={`${styles.planCard} ${isFeatured ? styles.featuredCard : isPremium ? styles.premiumCard : styles.basicCard} ${isSelected ? styles.selectedCard : ''}`}
                                >
                                    {/* Ambient card top shimmer */}
                                    <div className={styles.cardGlowTop} />

                                    {/* Most Popular / Best Value Badge */}
                                    {badgeText ? (
                                        <div className={styles.tierBadge}>
                                            <ZapIcon />
                                            <span>{badgeText}</span>
                                        </div>
                                    ) : null}

                                    {/* Card Header Content */}
                                    <div className={styles.cardHeader}>
                                        <div className={styles.tierCategoryRow}>
                                            <div className={styles.tierCategoryGroup}>
                                                <HexGiftBoxIcon />
                                                <span className={styles.tierCategory}>
                                                    {plan.tier_category || plan.category || plan.tier || (isFree ? 'FREE TIER' : isFeatured ? 'QUANT TIER' : isPremium ? 'INSTITUTIONAL TIER' : isBasic ? 'STARTER TIER' : `${(name || '').toUpperCase()} TIER`)}
                                                </span>
                                            </div>
                                            {(plan.credits || plan.credits_label) && (
                                                <span className={styles.creditsTag}>
                                                    {plan.credits ? `${plan.credits.toLocaleString()} AI Credits` : plan.credits_label}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className={styles.planName}>{name}</h3>
                                        <p className={styles.planDesc}>{description}</p>

                                        {/* Pricing Block */}
                                        <div className={styles.priceContainer}>
                                            <div className={styles.priceRow}>
                                                {plan.originalPrice ? (
                                                    <span className={styles.originalPrice}>
                                                        {plan.currency || '$'}{plan.originalPrice}
                                                    </span>
                                                ) : null}
                                                {isFree ? (
                                                    <span className={styles.amount}>Free</span>
                                                ) : (
                                                    <>
                                                        <span className={styles.currency}>{plan.currency || '$'}</span>
                                                        <span className={styles.amount}>{plan.price}</span>
                                                    </>
                                                )}
                                                <span className={styles.validityLabel}>/ {validity.replace(/^Free For /i, 'Valid ').replace(/^مجاناً لمدة /i, 'صالح لمدة ')}</span>
                                            </div>
                                            {plan.originalPrice && Number(plan.originalPrice) > Number(plan.price) ? (
                                                <div className={styles.savingsBadge}>
                                                    Save ${(Number(plan.originalPrice) - Number(plan.price))} on this tier
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            type="button"
                                            className={`${styles.buyBtn} ${isFeatured ? styles.featuredBuyBtn : isPremium ? styles.premiumBuyBtn : styles.basicBuyBtn}`}
                                            onClick={() => handleSelectPlan(plan)}
                                            disabled={submittingPlanId === plan.id}
                                        >
                                            <span>
                                                {submittingPlanId === plan.id ? t('common.loading', 'Processing...') : ctaText}
                                            </span>
                                            <div className={styles.btnIconBox}>
                                                <ArrowUpRightIcon />
                                            </div>
                                        </button>

                                        <p className={styles.subCtaNote}>
                                            {plan.subCtaText || (isFree ? 'No credit card required' : 'Instant activation')}
                                        </p>
                                    </div>

                                    {/* Bottom Features Box */}
                                    <div className={styles.cardFeaturesBox}>
                                        <div className={styles.featuresLeftContent}>
                                            <div className={styles.featuresHeader}>
                                                <span className={styles.headerAccentBar} />
                                                <span>{plan.featuresHeader || 'WHAT YOU RECEIVE:'}</span>
                                            </div>
                                            <ul className={styles.featuresList}>
                                                {featuresList.map((feat, idx) => (
                                                    <li key={idx}>
                                                        <GoldenCheckCircleIcon />
                                                        <span>{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* 4. Trust & Security Strip */}
                <motion.div 
                    className={styles.trustStrip}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.trustItem}>
                        <div className={styles.trustIcon}><ShieldCheckIcon /></div>
                        <div>
                            <h4>Instant Autonomous Activation</h4>
                            <p>Immediate credit provisioning & access</p>
                        </div>
                    </div>
                    <div className={styles.trustDivider} />
                    <div className={styles.trustItem}>
                        <div className={styles.trustIcon}><LockIcon /></div>
                        <div>
                            <h4>256-Bit Encrypted Payments</h4>
                            <p>Decentralized & secure gateways</p>
                        </div>
                    </div>
                    <div className={styles.trustDivider} />
                    <div className={styles.trustItem}>
                        <div className={styles.trustIcon}><CpuIcon /></div>
                        <div>
                            <h4>Sub-Second Neural Inference</h4>
                            <p>High-availability GPU cloud infrastructure</p>
                        </div>
                    </div>
                </motion.div>

                {/* 5. Frequently Asked Questions Section */}
                <div className={styles.faqSection}>
                    <SectionHeader
                        badge={t('plans.faqBadge', 'GOT QUESTIONS?')}
                        title1={t('plans.faqTitle1', 'Frequently Asked')}
                        title2={t('plans.faqTitle2', 'Questions')}
                        breakLine={false}
                        description={t('plans.faqSubtitle', 'Everything you need to know about ChronosX subscription tiers and AI compute allocation.')}
                        align="center"
                    />

                    <div className={styles.faqList}>
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div 
                                    key={idx} 
                                    className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ''}`}
                                    onClick={() => toggleFaq(idx)}
                                >
                                    <div className={styles.faqQuestionRow}>
                                        <h3>{faq.q}</h3>
                                        <div className={`${styles.faqChevron} ${isOpen ? styles.faqChevronRotated : ''}`}>
                                            <ChevronDownIcon />
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div 
                                                className={styles.faqAnswer}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <p>{faq.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 6. Bottom Conversion CTA & Disclaimer (Outside site) */}
            {isOutside && (
                <>
                    <CommonCta
                        badge={t('plans.ctaBadge', 'UNLIMITED INSTITUTIONAL POTENTIAL')}
                        title1={t('plans.ctaTitle1', 'Upgrade Your Trading Desk with')}
                        title2={t('plans.ctaTitle2', 'Next-Gen AI Intelligence')}
                        description={t('plans.ctaDesc', 'Get higher compute limits, custom MT5 indicators, real-time chart OCR scans, and dedicated quant support.')}
                        primaryBtnText={t('plans.ctaBtn', 'CHOOSE YOUR PLAN')}
                        primaryBtnAction={() => {
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                    />

                    <div className="container" style={{ paddingBottom: 60 }}>
                        <div className={styles.disclaimerBox}>
                            <p>
                                {t('plans.disclaimer', 'ChronosX provides software, technical tools, and market intelligence algorithms for educational and research purposes only. Subscription fees cover cloud server infrastructure and AI compute processing. Past performance in backtests or simulations is not indicative of future market results.')}
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* 7. Payment Lifecycle Modals */}
            <PaymentSummaryModal
                isOpen={summaryModalOpen}
                onClose={() => setSummaryModalOpen(false)}
                plan={summaryPlan}
                currentSubscription={subscription}
                actionType={summaryActionType}
                onProceed={handleProceedPayment}
            />

            <PaymentSuccessModal
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                plan={successPlan}
                orderId={successOrderId}
            />

            <PaymentFailedModal
                isOpen={failedModalOpen}
                onClose={() => setFailedModalOpen(false)}
                onRetry={() => {
                    setFailedModalOpen(false);
                    if (summaryPlan) setSummaryModalOpen(true);
                }}
                reason={failedReason}
            />
        </div>
    );
}
