'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { authNavigate } from '@/lib/authRedirect';
import styles from '../aiChat.module.scss';

export default function ChatHeroSection() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <section className={styles.heroSection}>
            <div className="container">
                <div className={styles.heroCenterWrapper}>
                    {/* Uniform Section Header */}
                    <SectionHeader
                        as="h1"
                        badge={t('aiChat.heroBadge', 'INSTITUTIONAL AI TRADING DESK')}
                        title1={t('aiChat.heroTitle1', 'Your 24/7 AI-Powered')}
                        title2={t('aiChat.heroTitle2', 'Institutional Forex & Trading Copilot')}
                        description={t('aiChat.heroSubtitle', 'Ask questions, analyze real-time market trends, calculate precise risk management parameters, and receive instant data-driven trade setups powered by live MetaTrader 5 (MT5) market feeds.')}
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
                            <span>{t('aiChat.hero.launchBtn', 'LAUNCH AI CHAT NOW')}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </motion.div>

                    {/* 2. TOP BANNER / VALUE PROPOSITION BADGES (3 CARDS) */}
                    <motion.div
                        className={styles.valueBadgesRow}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {/* Card 1: Institutional Technical Analysis */}
                        <div className={styles.valueBadgeCard}>
                            <div className={styles.badgeIconWrap}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="6" r="6" />
                                    <circle cx="12" cy="2" r="2" />
                                    <line x1="12" y1="2" x2="12" y2="4" />
                                    <line x1="12" y1="20" x2="12" y2="22" />
                                    <line x1="2" y1="12" x2="4" y2="12" />
                                    <line x1="20" y1="12" x2="22" y2="12" />
                                </svg>
                            </div>
                            <div className={styles.badgeContent}>
                                <h4>{t('aiChat.hero.techAnalysis', 'Institutional Technical Analysis')}</h4>
                                <p>{t('aiChat.hero.techAnalysisDesc', 'EMAs, SuperTrend & Pivot Point engines')}</p>
                            </div>
                        </div>

                        {/* Card 2: Automated Risk & Position Sizing */}
                        <div className={styles.valueBadgeCard}>
                            <div className={`${styles.badgeIconWrap} ${styles.iconGreen}`}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <polyline points="9 12 11 14 15 10" />
                                </svg>
                            </div>
                            <div className={styles.badgeContent}>
                                <h4>{t('aiChat.hero.riskSizing', 'Automated Risk & Position Sizing')}</h4>
                                <p>{t('aiChat.hero.riskSizingDesc', 'Capital preservation & strict RRR logic')}</p>
                            </div>
                        </div>

                        {/* Card 3: Multi-Timeframe Trend Insights */}
                        <div className={styles.valueBadgeCard}>
                            <div className={`${styles.badgeIconWrap} ${styles.iconAmber}`}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                    <path d="M4 8l4-4 4 3 6-5" />
                                </svg>
                            </div>
                            <div className={styles.badgeContent}>
                                <h4>{t('aiChat.hero.trendInsights', 'Multi-Timeframe Trend Insights')}</h4>
                                <p>{t('aiChat.hero.trendInsightsDesc', 'From M1/M15 scalps to H4/Daily swing models')}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
