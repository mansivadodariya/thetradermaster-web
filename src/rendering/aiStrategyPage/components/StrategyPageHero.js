'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { authNavigate } from '@/lib/authRedirect';
import styles from '../aiStrategyPage.module.scss';

export default function StrategyPageHero({
    router,
    scrollToDemo,
    valueBadges
}) {
    const { t } = useLanguage();

    return (
        <section className={styles.heroSection}>
            <div className="container">
                <div className={styles.heroCenterWrapper}>
                    {/* Uniform Section Header */}
                    <SectionHeader
                        as="h1"
                        badge={t('strategyPage.heroBadge', 'INSTITUTIONAL QUANTITATIVE FEED')}
                        title1={t('strategyPage.heroTitle1', 'AI Strategy Analysis &')}
                        title2={t('strategyPage.heroTitle2', 'Multi-Pillar Market Intelligence')}
                        description={t('strategyPage.heroSubtitle', 'Transform complex cross-asset market flow into actionable algorithmic execution setups. Powered by real-time indicator confluence and strict mathematical risk models.')}
                        align="center"
                    />

                    {/* Hero CTAs */}
                    <motion.div
                        className={styles.heroCtaGroup}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                    >
                        <button
                            type="button"
                            onClick={() => authNavigate(router, '/market-assistant')}
                            className={styles.heroPrimaryBtn}
                        >
                            <span>{t('aiStrategy.launchLiveFeed', 'LAUNCH LIVE ANALYSIS FEED')}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={scrollToDemo}
                            className={styles.heroSecondaryBtn}
                        >
                            <span>{t('aiStrategy.explore100Pt', 'EXPLORE 100-POINT SCORING')}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M19 12l-7 7-7-7" />
                            </svg>
                        </button>
                    </motion.div>

                    {/* Value Proposition Badges */}
                    <motion.div
                        className={styles.highlightsGrid}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {valueBadges.map((badge, idx) => (
                            <div key={idx} className={styles.highlightCard}>
                                <div className={`${styles.highlightIconBox} ${styles[badge.colorClass || badge.iconStyle] || ''}`}>
                                    {badge.icon}
                                </div>
                                <div className={styles.highlightContent}>
                                    <h4>{badge.title}</h4>
                                    <p>{badge.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
