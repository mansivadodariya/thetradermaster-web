'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import SupportTicketForm from '@/components/supportTicketForm';
import CommonCta from '@/components/commonCta';
import CommonSectionHeader from '@/components/CommonSectionHeader';
import { SupportTicketIcon } from '@/icons/sidebarIcons';
import styles from './CustomerSupportView.module.scss';

const FEATURES = [
    {
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        labelKey: 'technicalSupport.featureFastLabel',
        labelFallback: 'Fast Response',
        descKey: 'technicalSupport.featureFastDesc',
        descFallback: 'Avg. reply under 2 hours',
    },
    {
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        ),
        labelKey: 'technicalSupport.featureSecureLabel',
        labelFallback: 'Encrypted & Secure',
        descKey: 'technicalSupport.featureSecureDesc',
        descFallback: 'End-to-end query privacy',
    },
    {
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        labelKey: 'technicalSupport.featureExpertLabel',
        labelFallback: 'Expert Engineers',
        descKey: 'technicalSupport.featureExpertDesc',
        descFallback: 'Dedicated quant dev team',
    },
    {
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
        labelKey: 'technicalSupport.featureTrackLabel',
        labelFallback: 'Query Tracking',
        descKey: 'technicalSupport.featureTrackDesc',
        descFallback: 'Full status updates via email',
    },
];

const WORKFLOW_STEPS = [
    {
        number: '01',
        titleKey: 'technicalSupport.step1Title',
        titleFallback: 'Submit Query',
        descKey: 'technicalSupport.step1Desc',
        descFallback: 'Provide problem details and attach optional screenshots.',
    },
    {
        number: '02',
        titleKey: 'technicalSupport.step2Title',
        titleFallback: 'Desk Review',
        descKey: 'technicalSupport.step2Desc',
        descFallback: 'Our quant & dev team analyzes logs and isolates the issue.',
    },
    {
        number: '03',
        titleKey: 'technicalSupport.step3Title',
        titleFallback: 'Fast Resolution',
        descKey: 'technicalSupport.step3Desc',
        descFallback: 'Receive status updates and a complete solution via email.',
    },
];

export default function CustomerSupportView({ isDashboard = false }) {
    const { t } = useLanguage();

    const supportBadgeIcon = (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );

    const contentGrid = (
        <div className={styles.contentLayout}>
            {/* Left Column: Info, Workflow Steps, SLA & Features */}
            <motion.div
                className={styles.infoColumn}
                initial={{ opacity: 0, x: isDashboard ? -20 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.48, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className={styles.infoCard}>
                    <div className={styles.cardGlow} aria-hidden="true" />
                    <h2 className={styles.infoTitle}>
                        {t('technicalSupport.infoCardTitle', 'How It Works')}
                    </h2>
                    <p className={styles.infoDescription}>
                        {t(
                            'technicalSupport.infoCardDesc',
                            'Submit a query with your contact details and a description of the issue. Our dedicated customer support team reviews every submission and responds via email within a few hours during business days.'
                        )}
                    </p>

                    <div className={styles.stepsList}>
                        {WORKFLOW_STEPS.map((step, idx) => (
                            <div className={styles.stepItem} key={idx}>
                                <div className={styles.stepNumberBadge}>
                                    <span>{step.number}</span>
                                </div>
                                <div className={styles.stepContent}>
                                    <h3 className={styles.stepTitle}>
                                        {t(step.titleKey, step.titleFallback)}
                                    </h3>
                                    <p className={styles.stepDesc}>
                                        {t(step.descKey, step.descFallback)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className={styles.deskStatusPill}>
                        <span className={styles.statusDot} />
                        <span className={styles.statusText}>
                            {t('technicalSupport.deskOnline', 'Customer Desk Active · Reply within a few hours')}
                        </span>
                    </div>
                </div>

                <div className={styles.featureGrid}>
                    {FEATURES.map((feat, i) => (
                        <div className={styles.featureItem} key={i}>
                            <div className={styles.featureIcon}>{feat.icon}</div>
                            <div className={styles.featureMeta}>
                                <span className={styles.featureLabel}>
                                    {t(feat.labelKey, feat.labelFallback)}
                                </span>
                                <span className={styles.featureDesc}>
                                    {t(feat.descKey, feat.descFallback)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Right Column: Support Ticket Form */}
            <motion.div
                className={styles.formColumn}
                initial={{ opacity: 0, x: isDashboard ? 20 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.48, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className={styles.formCard}>
                    <div className={styles.cardGlow} aria-hidden="true" />
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>
                            {t('technicalSupport.formTitle', 'Submit Your Query')}
                        </h2>
                        <p className={styles.formSubtitle}>
                            {t(
                                'technicalSupport.formSubtitle',
                                'Fill in the details below. All fields marked with * are required.'
                            )}
                        </p>
                    </div>
                    <SupportTicketForm />
                </div>
            </motion.div>
        </div>
    );

    if (isDashboard) {
        return (
            <div className={`${styles.page} ${styles.dashboardPage}`}>
                <CommonSectionHeader
                    badge={t('technicalSupport.badge', 'CUSTOMER SUPPORT')}
                    badgeIcon={supportBadgeIcon}
                    icon={<SupportTicketIcon width={26} height={26} />}
                    title1={t('technicalSupport.title', 'Raise a')}
                    title2={t('technicalSupport.titleAccent', 'Support Query')}
                    subtitle={t(
                        'technicalSupport.subtitle',
                        'Describe the issue you are facing. Attach a screenshot if it helps our customer support desk diagnose faster.'
                    )}
                    isCard={true}
                    as="h2"
                />
                {contentGrid}
            </div>
        );
    }

    return (
        <div className={`${styles.page} ${styles.publicPage}`}>
            {/* Ambient glows */}
            <div className={styles.ambientGlowTop} aria-hidden="true" />
            <div className={styles.ambientGlowLeft} aria-hidden="true" />
            <div className={styles.ambientGlowRight} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            <motion.div
                className={styles.headerWrap}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <CommonSectionHeader
                    badge={t('technicalSupport.publicBadge', 'CUSTOMER SUPPORT')}
                    badgeIcon={supportBadgeIcon}
                    title1={t('technicalSupport.publicTitle', 'Need Help? Contact')}
                    title2={t('technicalSupport.publicTitleAccent', 'Customer Support')}
                    subtitle={t(
                        'technicalSupport.publicSubtitle',
                        'Describe your issue with as much detail as possible. Attach screenshots to help our customer support team diagnose and resolve faster.'
                    )}
                    isCard={true}
                    as="h1"
                />
            </motion.div>

            <section className={styles.mainSection}>
                {contentGrid}
            </section>

            <CommonCta
                badge={t('technicalSupport.ctaBadge', 'NEED FASTER RESOLUTION?')}
                title1={t('technicalSupport.ctaTitle1', 'Start Trading with')}
                title2={t('technicalSupport.ctaTitle2', 'ChronosX AI Intelligence')}
                description={t(
                    'technicalSupport.ctaDesc',
                    'Join thousands of elite traders leveraging real-time neural vision, algorithmic signals, and institutional-grade execution.'
                )}
                primaryBtnText={t('technicalSupport.ctaBtn', 'GET STARTED NOW')}
                primaryBtnAction="/signup"
            />
        </div>
    );
}
