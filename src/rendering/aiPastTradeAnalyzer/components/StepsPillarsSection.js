'use client';

import React from 'react';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../aiPastTradeAnalyzer.module.scss';

export default function StepsPillarsSection() {
    const { t } = useLanguage();

    return (
        <>
            {/* 1.7 3 Value Pillar Bento Cards (Below Cockpit) */}
            <div className={styles.heroBentoRow}>
                <div className={styles.heroBentoCard}>
                    <div className={styles.bentoIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                    </div>
                    <div className={styles.bentoContent}>
                        <h4>{t('aiPastTradeAnalyzer.steps.instantAnalysis', 'Instant AI Analysis')}</h4>
                        <p>{t('aiPastTradeAnalyzer.steps.instantAnalysisDesc', 'Get detailed execution and risk feedback in seconds.')}</p>
                    </div>
                </div>

                <div className={styles.heroBentoCard}>
                    <div className={styles.bentoIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <div className={styles.bentoContent}>
                        <h4>{t('aiPastTradeAnalyzer.steps.spotMistakes', 'Spot Critical Mistakes')}</h4>
                        <p>{t('aiPastTradeAnalyzer.steps.spotMistakesDesc', 'Identify timing errors, stop-loss flaws & FOMO entries.')}</p>
                    </div>
                </div>

                <div className={styles.heroBentoCard}>
                    <div className={styles.bentoIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    </div>
                    <div className={styles.bentoContent}>
                        <h4>{t('aiPastTradeAnalyzer.steps.improveGrow', 'Improve & Grow')}</h4>
                        <p>{t('aiPastTradeAnalyzer.steps.improveGrowDesc', 'Actionable insights to level up your trading consistency.')}</p>
                    </div>
                </div>
            </div>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 2. 3 SIMPLE STEPS */}
            <section className={styles.stepsSection}>
                <div className="container">
                    <SectionHeader
                        badge={t('tradeAudit.howItWorksBadge', 'HOW IT WORKS')}
                        title1={t('tradeAudit.howItWorksTitle1', '3 SIMPLE')}
                        title2={t('tradeAudit.howItWorksTitle2', 'STEPS')}
                        description={t('tradeAudit.howItWorksSubtitle', 'How ChronosX AI Past Trade Analyzer reviews and upgrades your execution.')}
                        align="center"
                    />

                    <div className={styles.stepsGrid}>
                        {/* Step 1 */}
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumBadge}>01</div>
                            <div className={styles.stepIconBox}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <h3 className={styles.stepTitle}>{t('aiPastTradeAnalyzer.steps.uploadScreenshot', 'UPLOAD TRADE SCREENSHOT')}</h3>
                            <p className={styles.stepDesc}>
                                {t('aiPastTradeAnalyzer.steps.uploadScreenshotDesc', 'Upload a screenshot of your closed trade from any preferred platform. Your chart. Your execution.')}
                            </p>
                        </div>

                        {/* Step Connector 1 */}
                        <div className={styles.stepConnector}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>

                        {/* Step 2 */}
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumBadge}>02</div>
                            <div className={styles.stepIconBox}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                            <h3 className={styles.stepTitle}>{t('aiPastTradeAnalyzer.steps.analyzesTrade', 'AI ANALYZES YOUR TRADE')}</h3>
                            <p className={styles.stepDesc}>
                                {t('aiPastTradeAnalyzer.steps.analyzesTradeDesc', 'Our AI scans your entry, exit, risk management, market structure, and surrounding price context in seconds.')}
                            </p>
                        </div>

                        {/* Step Connector 2 */}
                        <div className={styles.stepConnector}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>

                        {/* Step 3 */}
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumBadge}>03</div>
                            <div className={styles.stepIconBox}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <h3 className={styles.stepTitle}>{t('aiPastTradeAnalyzer.steps.getFeedback', 'GET DETAILED FEEDBACK')}</h3>
                            <p className={styles.stepDesc}>
                                {t('aiPastTradeAnalyzer.steps.getFeedbackDesc', 'Receive a complete breakdown with identified execution mistakes, actionable improvements, and tips.')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
