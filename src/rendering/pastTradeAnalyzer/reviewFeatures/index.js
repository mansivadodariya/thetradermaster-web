'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LineText from '@/components/lineText';
import styles from './reviewFeatures.module.scss';

const EntryExitIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const StructureIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);

const RiskIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const QualityIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const BugIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="6" width="8" height="14" rx="4"></rect>
        <path d="M6 18h12M6 14h12M6 10h12M12 2v4"></path>
    </svg>
);

const BulbIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4M15.09 14A6 6 0 0 0 18 9 6 6 0 0 0 6 9a6 6 0 0 0 2.91 5"></path>
    </svg>
);

export default function ReviewFeatures() {
    const { t } = useLanguage();

    const reviewFeatures = [
        {
            icon: <EntryExitIcon />,
            title: t('pastTrade.f1Title', 'Entry & Exit Analysis'),
            desc: t('pastTrade.f1Desc', 'Review where you entered and exited the trade and whether those decisions aligned with the visible market structure and setup.'),
        },
        {
            icon: <StructureIcon />,
            title: t('pastTrade.f2Title', 'Market Structure'),
            desc: t('pastTrade.f2Desc', 'Understand the market environment surrounding your trade, including trend direction, price structure, and important levels.'),
        },
        {
            icon: <RiskIcon />,
            title: t('pastTrade.f3Title', 'Risk Management'),
            desc: t('pastTrade.f3Desc', 'Review your stop-loss, target, position size, and risk/reward relationship to identify potential risk-management issues.'),
        },
        {
            icon: <QualityIcon />,
            title: t('pastTrade.f4Title', 'Execution Quality'),
            desc: t('pastTrade.f4Desc', 'Find execution problems such as premature entries, late entries, weak confirmations, poor exits, or trades taken against the broader setup.'),
        },
        {
            icon: <BugIcon />,
            title: t('pastTrade.f5Title', 'Mistake Detection'),
            desc: t('pastTrade.f5Desc', 'Instead of simply telling you WIN or LOSS, AI identifies potential mistakes that may have influenced the result.'),
        },
        {
            icon: <BulbIcon />,
            title: t('pastTrade.f6Title', 'Improvement Suggestions'),
            desc: t('pastTrade.f6Desc', 'Get specific suggestions that can help you approach similar setups differently in future trades.'),
        },
    ];

    return (
        <section className={styles.reviewFeatures} id="review-features">
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text={t('pastTradeFeatures.badge', 'Comprehensive Features')} />
                    <h2>
                        {t('pastTradeFeatures.titlePart1', 'What Does Past Trade Analyzer')} <span className={styles.neonText}>{t('pastTradeFeatures.titlePart2', 'Review?')}</span>
                    </h2>
                    <p>
                        {t('pastTradeFeatures.subtitle', 'Deep institutional-grade analysis of every completed execution.')}
                    </p>
                </div>

                <div className={styles.featuresGrid}>
                    {reviewFeatures.map((feat, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.featureCard}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                        >
                            <div className={styles.cardIcon}>{feat.icon}</div>
                            <h3>{feat.title}</h3>
                            <p>{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
