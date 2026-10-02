'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from './tradingPatterns.module.scss';

const RightArrowIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export default function TradingPatterns() {
    const { t } = useLanguage();
    const patternList = [
        t('tradingPatterns.p1', "Entering too early"),
        t('tradingPatterns.p2', "Chasing breakouts"),
        t('tradingPatterns.p3', "Moving stop-losses"),
        t('tradingPatterns.p4', "Taking trades without confirmation"),
        t('tradingPatterns.p5', "Ignoring higher-timeframe structure"),
        t('tradingPatterns.p6', "Using inconsistent risk"),
        t('tradingPatterns.p7', "Exiting winning trades too early"),
    ];

    const cycleSteps = [
        {
            stepNum: '01',
            title: t('tradingPatterns.step1Title', 'TRADE'),
            subtitle: t('tradingPatterns.step1Sub', 'Strategy Execution'),
            desc: t('tradingPatterns.step1Desc', 'Execute trades strictly according to your defined setup and risk plan.')
        },
        {
            stepNum: '02',
            title: t('tradingPatterns.step2Title', 'REVIEW'),
            subtitle: t('tradingPatterns.step2Sub', 'Analyze Execution'),
            desc: t('tradingPatterns.step2Desc', 'Upload your chart & log parameters to inspect entry and exit mechanics.')
        },
        {
            stepNum: '03',
            title: t('tradingPatterns.step3Title', 'IDENTIFY'),
            subtitle: t('tradingPatterns.step3Sub', 'Find Habits & Mistakes'),
            desc: t('tradingPatterns.step3Desc', 'Spot recurring behavioral flaws, timing issues, and win factors.')
        },
        {
            stepNum: '04',
            title: t('tradingPatterns.step4Title', 'ADJUST'),
            subtitle: t('tradingPatterns.step4Sub', 'Refine Process'),
            desc: t('tradingPatterns.step4Desc', 'Modify position sizing, entry triggers, or stop-loss rules accordingly.')
        },
        {
            stepNum: '05',
            title: t('tradingPatterns.step5Title', 'REPEAT'),
            subtitle: t('tradingPatterns.step5Sub', 'Apply & Compound'),
            desc: t('tradingPatterns.step5Desc', 'Compound consistency by applying key lessons to your future trades.')
        }
    ];

    return (
        <section className={styles.tradingPatterns}>
            <div className="container-xs">
                {/* Section 1: Discover Your Trading Patterns */}
                <div className={styles.patternsBox}>
                    <h3 className={styles.patternsTitle}>{t('tradingPatterns.patternsTitle', 'Discover Your Trading Patterns')}</h3>
                    <p className={styles.patternsSub}>
                        {t('tradingPatterns.patternsSub', 'One trade can teach you something. A collection of trades can reveal your habits. As you review more trades, you can start identifying patterns such as:')}
                    </p>
                    <div className={styles.patternPills}>
                        {patternList.map((pat, idx) => (
                            <motion.div
                                key={idx}
                                className={styles.pill}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                            >
                                <span>⚡</span> {pat}
                            </motion.div>
                        ))}
                    </div>
                    <div className={styles.patternGoalNote}>
                        {t('tradingPatterns.goalNote', 'The goal is not to judge the trader. The goal is to identify patterns that can help improve the trader.')}
                    </div>
                </div>

                {/* Section 2: Build a Better Trading Process */}
                <div className={styles.cycleBox}>
                    <div className={styles.cycleHeader}>
                        <h3>{t('tradingPatterns.cycleTitle', 'Build a Better Trading Process')}</h3>
                        <p>
                            {t('tradingPatterns.cycleSub', 'Successful trading is not only about finding the next setup. It is also about improving the process behind every decision. Past Trade Analyzer helps you create a repeatable review cycle:')}
                        </p>
                    </div>

                    <div className={styles.cycleGrid}>
                        {cycleSteps.map((step, idx) => (
                            <React.Fragment key={idx}>
                                <motion.div 
                                    className={styles.cycleCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                                >
                                    <div className={styles.cardHeaderRow}>
                                        <span className={styles.stepBadge}>{step.stepNum}</span>
                                        <span className={styles.stepTitle}>{step.title}</span>
                                    </div>
                                    <h4 className={styles.stepSubtitle}>{step.subtitle}</h4>
                                    <p className={styles.stepDesc}>{step.desc}</p>
                                </motion.div>
                                {idx < cycleSteps.length - 1 && (
                                    <div className={styles.stepArrow}>
                                        <RightArrowIcon />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className={styles.cycleFormulaWrapper}>
                        <div className={styles.cycleFormula}>
                            <span className={styles.formulaIcon}>⚡</span>
                            <span>{t('tradingPatterns.formula', 'Trade → Review → Learn → Improve')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
