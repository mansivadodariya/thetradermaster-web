'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import styles from './aiStrategyPage.module.scss';
import LineText from '@/components/lineText';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';

const ArrowIcon = '/assets/icons/arrow.svg';
const RoundImage = '/assets/images/round-vec.svg';
const StratagyImage = '/assets/images/stratagyimage-new.png';

export default function AiStrategyPage() {
    const router = useRouter();
    const { t } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className={styles.aiStrategyPage}>
            <div className='container-xs'>
                <motion.div 
                    className={styles.titleWrapper}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <LineText text={t('nav.aiStrategy', 'AI-Powered Technical Analysis & Strategy Engine')} />
                    <div className={styles.title}>
                        <h1>
                            {t('aiStrategy.titlePart1', 'REAL-TIME FOREX & GOLD')}{' '}
                            <span className={styles.neonText}>{t('aiStrategy.titlePart2', 'TECHNICAL INTELLIGENCE')}</span>
                        </h1>
                        <p>
                            {t('aiStrategy.subtitle', 'Scan currency pairs and spot metals with automated multi-timeframe indicator confluence, quantitative technical scoring, and structured AI signal reasoning.')}
                        </p>
                    </div>
                </motion.div>

                <div className={styles.promptWrapper}>
                    {/* Hero Banner Showcase */}
                    <motion.div
                        className={styles.bannerBox}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.boxContent}>
                            <LineText text={t('nav.aiStrategy', 'AI Strategy Builder')} start />
                            <h3>{t('aiStrategy.builderTitle', 'Turn Market Concepts into Executable Trading Strategies')}</h3>
                            <p>
                                {t('aiStrategy.builderDesc', 'Describe your rules, technical indicators, or risk parameters. Get automated strategy signals, backtest reports, and direct MT5 integration.')}
                            </p>
                            <Button icon={ArrowIcon} text={t('aiStrategy.generateBtn', 'Try AI Strategy Now')} onClick={() => authNavigate(router, '/dashboard')} />
                        </div>
                        <div className={styles.boxImage}>
                            <img src={StratagyImage} alt="Strategy Builder Showcase" />
                        </div>
                        <div className={styles.roundVec}>
                            <img src={RoundImage} alt="Vector decoration" />
                        </div>
                    </motion.div>

                    {/* Features Cards Grid */}
                    <motion.div 
                        className={styles.cardsGrid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div
                            className={styles.card}
                            variants={itemVariants}
                            onClick={() => authNavigate(router, '/dashboard')}
                            role="button"
                            tabIndex={0}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                                <h3>{t('aiStrategy.liveAnalysisTitle', 'Multi-Pair Live Watchlist')}</h3>
                            </div>
                            <p>{t('aiStrategy.liveAnalysisSubtitle', 'Track real-time prices, pip changes, and active strategy signals across 28 currency pairs and spot metals.')}</p>
                            <div className={styles.arrowLink}>
                                <span>{t('common.explore', 'Explore Watchlist')}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                        </motion.div>

                        <motion.div
                            className={styles.card}
                            variants={itemVariants}
                            onClick={() => authNavigate(router, '/dashboard')}
                            role="button"
                            tabIndex={0}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                    </svg>
                                </div>
                                <h3>{t('tradeSnap.confidenceScore', 'Quantitative Technical Score')}</h3>
                            </div>
                            <p>{t('aiStrategy.quantScoreDesc', 'Get a weighted 0-100 score analyzing Trend, Momentum, Volume pressure, and Pivots across multiple timeframes.')}</p>
                            <div className={styles.arrowLink}>
                                <span>{t('common.viewScore', 'View Tech Score')}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                        </motion.div>

                        <motion.div
                            className={styles.card}
                            variants={itemVariants}
                            onClick={() => authNavigate(router, '/dashboard')}
                            role="button"
                            tabIndex={0}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="3" y1="9" x2="21" y2="9"></line>
                                        <line x1="9" y1="21" x2="9" y2="9"></line>
                                    </svg>
                                </div>
                                <h3>{t('aiStrategy.strategyResults', 'AI Confluence & Evidence')}</h3>
                            </div>
                            <p>{t('tradeSnap.analysisResult', 'Inspect structured bullish and bearish evidence bullets with detailed indicator actions, MACD, ADX, and pivot levels.')}</p>
                            <div className={styles.arrowLink}>
                                <span>{t('common.inspectConfluence', 'Inspect Confluence')}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* NEW SECTION 1: How AI Strategy Works (4-Step Workflow Grid) */}
                    <motion.div 
                        className={styles.workflowSection}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.sectionHeader}>
                            <h2>
                                {t('aiStrategy.workflowTitlePart1', 'How AI Strategy')}{' '}
                                <span className={styles.neonText}>{t('aiStrategy.workflowTitlePart2', 'Generation Works')}</span>
                            </h2>
                            <p>{t('aiStrategy.workflowSubtitle', 'Transform raw trading ideas into backtested, quantitative strategies in 4 simple steps.')}</p>
                        </div>

                        <div className={styles.workflowGrid}>
                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>01</div>
                                <h3>{t('aiStrategy.step1Title', 'Define Rules & Indicators')}</h3>
                                <p>{t('aiStrategy.step1Desc', 'Specify your indicators (RSI, EMA, MACD, SMC), entry triggers, and stop-loss/take-profit parameters.')}</p>
                            </div>

                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>02</div>
                                <h3>{t('aiStrategy.step2Title', 'Automated Confluence Scan')}</h3>
                                <p>{t('aiStrategy.step2Desc', 'Trader Master AI scans 28 currency pairs and spot metals for technical alignment across H1, H4, and Daily.')}</p>
                            </div>

                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>03</div>
                                <h3>{t('aiStrategy.step3Title', 'Backtest & Risk Metrics')}</h3>
                                <p>{t('aiStrategy.step3Desc', 'Review historical Win Rate, Profit Factor, Max Drawdown, and Risk-to-Reward ratio breakdown.')}</p>
                            </div>

                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>04</div>
                                <h3>{t('aiStrategy.step4Title', 'MT5 Direct Execution')}</h3>
                                <p>{t('aiStrategy.step4Desc', 'Connect strategy signals directly to your MetaTrader 5 account context for real-time trade alerts.')}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* NEW SECTION 2: Sample Strategy Performance Card */}
                    <motion.div 
                        className={styles.sampleStrategySection}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.sectionHeader}>
                            <h2>
                                {t('aiStrategy.sampleTitlePart1', 'Generated Strategy')}{' '}
                                <span className={styles.neonText}>{t('aiStrategy.sampleTitlePart2', 'Performance Metrics')}</span>
                            </h2>
                            <p>{t('aiStrategy.sampleSubtitle', 'Example quantitative breakdown generated by Trader Master AI for EUR/USD.')}</p>
                        </div>

                        <div className={styles.strategyMetricsCard}>
                            <div className={styles.cardTopRow}>
                                <div>
                                    <span className={styles.pairBadge}>EUR/USD • H4 Timeframe</span>
                                    <h3>MACD + SMC Order Block Breakout</h3>
                                </div>
                                <div className={styles.scorePill}>
                                    <span className={styles.scoreVal}>84/100</span>
                                    <span className={styles.scoreLabel}>High Confluence</span>
                                </div>
                            </div>

                            <div className={styles.metricsGrid}>
                                <div className={styles.metricItem}>
                                    <span className={styles.mLabel}>Win Rate</span>
                                    <span className={`${styles.mVal} ${styles.green}`}>78.4%</span>
                                </div>
                                <div className={styles.metricItem}>
                                    <span className={styles.mLabel}>Profit Factor</span>
                                    <span className={`${styles.mVal} ${styles.green}`}>2.85</span>
                                </div>
                                <div className={styles.metricItem}>
                                    <span className={styles.mLabel}>Max Drawdown</span>
                                    <span className={styles.mVal}>4.2%</span>
                                </div>
                                <div className={styles.metricItem}>
                                    <span className={styles.mLabel}>Avg Risk / Reward</span>
                                    <span className={`${styles.mVal} ${styles.green}`}>1 : 3.2</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* NEW SECTION 3: CTA Section */}
                    <motion.div 
                        className={styles.ctaCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.ctaContent}>
                            <h2>{t('aiStrategy.ctaTitle', 'Build Your Custom AI Strategy Today')}</h2>
                            <p>{t('aiStrategy.ctaDesc', 'Empower your trading with automated quantitative rules, technical confluence, and live signal tracking.')}</p>
                            <button 
                                className={styles.ctaBtn} 
                                onClick={() => authNavigate(router, '/dashboard')}
                            >
                                <span>{t('aiStrategy.startBuildingNow', 'Generate Strategy Now')}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#04100B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

