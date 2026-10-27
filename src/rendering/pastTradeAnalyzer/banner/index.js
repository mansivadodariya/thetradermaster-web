'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';
import LineText from '@/components/lineText';
import Button from '@/components/button';
import styles from './banner.module.scss';

const UploadIcon = '/assets/icons/upload-xs.svg';

export default function Banner() {
    const router = useRouter();
    const { t } = useLanguage();

    const handleUploadClick = () => {
        authNavigate(router, '/trade-snap');
    };

    const handleLearnMoreClick = () => {
        const el = document.getElementById('review-features');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.bannerSection}>
            <div className="container-xs">
                <div className={styles.heroGrid}>
                    <motion.div
                        className={styles.heroContent}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <LineText text={t('nav.pastTradeAnalyzer', 'PAST TRADE ANALYZER')} start />
                        <h1>
                            {t('pastTrade.bannerTitle1', 'Learn From Every Trade')} <span className={styles.neonText}>{t('pastTrade.bannerTitle2', 'You Take')}</span>
                        </h1>
                        <div className={styles.heroSub}>
                            {t('pastTrade.bannerSub', 'Every trade contains information.')}
                        </div>
                        <div className={styles.heroDesc}>
                            <p>{t('pastTrade.bannerDesc1', 'A winning trade can reveal what worked. A losing trade can reveal what needs to change.')}</p>
                            <p>
                                {t('pastTrade.bannerDesc2', 'Past Trade Analyzer helps you turn your completed trades into structured insights by analyzing your trade history, chart screenshots, and execution details.')}
                            </p>
                            <p>
                                {t('pastTrade.bannerDesc3', 'Upload a completed trade and let AI break down what happened—from your entry and exit to market structure, risk management, and execution.')}
                            </p>
                        </div>

                        <div className={styles.flowPill}>
                            <div className={styles.flowTitle}>{t('pastTrade.flowTitle', "Don't Just Track Your Trades. Understand Them.")}</div>
                            <span className={styles.flowStep}>{t('pastTrade.flowStep1', 'Upload Trade')}</span>
                            <span className={styles.flowArrow}>→</span>
                            <span className={styles.flowStep}>{t('pastTrade.flowStep2', 'Analyze')}</span>
                            <span className={styles.flowArrow}>→</span>
                            <span className={styles.flowStep}>{t('pastTrade.flowStep3', 'Find Mistakes')}</span>
                            <span className={styles.flowArrow}>→</span>
                            <span className={styles.flowStep}>{t('pastTrade.flowStep4', 'Improve')}</span>
                        </div>

                        <div className={styles.heroActions}>
                            <Button text={t('pastTrade.btnUpload', 'Upload Trade For Analysis')} icon={UploadIcon} onClick={handleUploadClick} />
                            <Button outline text={t('pastTrade.btnExplore', 'Explore Features')} onClick={handleLearnMoreClick} />
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.heroVisual}
                        initial={{ opacity: 0, x: 30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.glassCard}>
                            <div className={styles.cardTopBar}>
                                <div className={styles.dotGroup}>
                                    <span className={styles.red}></span>
                                    <span className={styles.yellow}></span>
                                    <span className={styles.green}></span>
                                </div>
                                <span className={styles.barTitle}>{t('pastTrade.mockReportTitle', 'Past Trade AI Report')}</span>
                            </div>
                            <div className={styles.visualMock}>
                                <div className={styles.mockHeader}>
                                    <span className={styles.pair}>EUR/USD — 15M Execution</span>
                                    <span className={styles.resultBadge}>{t('pastTrade.mockScore', 'Score: 88/100')}</span>
                                </div>
                                <div className={styles.metricsGrid}>
                                    <div className={styles.metricBox}>
                                        <span className={styles.lbl}>{t('pastTrade.mockLabel1', 'Entry Timing')}</span>
                                        <span className={styles.val}>{t('pastTrade.mockVal1', 'Optimal')}</span>
                                    </div>
                                    <div className={styles.metricBox}>
                                        <span className={styles.lbl}>{t('pastTrade.mockLabel2', 'Risk/Reward')}</span>
                                        <span className={styles.val}>1 : 3.2</span>
                                    </div>
                                    <div className={styles.metricBox}>
                                        <span className={styles.lbl}>{t('pastTrade.mockLabel3', 'SL Placement')}</span>
                                        <span className={styles.val}>{t('pastTrade.mockVal3', 'Logical')}</span>
                                    </div>
                                </div>
                                <div className={styles.insightPill}>
                                    <strong>{t('pastTrade.mockInsightLabel', 'AI Breakdown:')}</strong> {t('pastTrade.mockInsightText', 'Trade was executed in alignment with 1H bullish market structure after liquidity sweep. Exit was executed prior to major resistance.')}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
