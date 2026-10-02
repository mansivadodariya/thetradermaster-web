'use client';

import React from 'react';
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
                {/* Header Title Section */}
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
                            {t('aiStrategy.subtitleExpanded', 'Architect institutional-grade quantitative strategies for Forex, Spot Gold (XAUUSD), Indices, and Crypto. Combine multi-timeframe EMA trend filters, Smart Money Concepts (SMC) order blocks, RSI/MACD momentum alignment, and automated risk parameters into executable backtested signals.')}
                        </p>
                    </div>
                </motion.div>

                <div className={styles.promptWrapper}>
                    {/* Hero Showcase Banner */}
                    <motion.div
                        className={styles.bannerBox}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.boxContent}>
                            <LineText text={t('nav.aiStrategy', 'AI Strategy Builder Engine')} start />
                            <h3>{t('aiStrategy.builderTitleExpanded', 'Turn Market Concepts & Technical Indicators into Executable Trading Strategies')}</h3>
                            <p>
                                {t('aiStrategy.builderDescExpanded', 'Transform discretionary rules, technical setups, or risk parameters into automated quantitative algorithms. Trader Master AI generates precise entry/exit logic, multi-timeframe confluence scoring, backtest expectancy metrics, and direct MetaTrader 5 (MT5) execution signals.')}
                            </p>
                            
                            <Button 
                                icon={ArrowIcon} 
                               text={t('aiStrategy.generateBtn', 'Try AI Strategy Builder Now')} 
                                onClick={() => authNavigate(router, '/dashboard')} 
                            />
                        </div>
                        <div className={styles.boxImage}>
                            <img src={StratagyImage} alt="Strategy Builder Showcase" />
                        </div>
                        <div className={styles.roundVec}>
                            <img src={RoundImage} alt="Vector decoration" />
                        </div>
                    </motion.div>

                    {/* Features Cards Grid (6 Cards) */}
                    <motion.div 
                        className={styles.cardsGrid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                    >
                        {/* Card 1 */}
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
                            <p>{t('aiStrategy.liveAnalysisSubtitleExpanded', 'Track real-time prices, pip shifts, and active AI strategy signals across 28 Forex currency pairs, Spot Gold (XAUUSD), Silver, and Major Crypto pairs.')}</p>
                           
                        </motion.div>

                        {/* Card 2 */}
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
                            <p>{t('aiStrategy.quantScoreDescExpanded', 'Instantly evaluate weighted technical health scores (0-100) analyzing Trend, Momentum, Volume pressure, Pivots, and Volatility across M15, H1, H4, and Daily timeframes.')}</p>
                            
                        </motion.div>

                        {/* Card 3 */}
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
                            <p>{t('aiStrategy.confluenceDescExpanded', 'Inspect structured bullish and bearish evidence bullets with detailed indicator actions, MACD histogram shifts, ADX trend strength, and pivot levels.')}</p>
                          
                        </motion.div>

                        {/* Card 4: Smart Money Concepts */}
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
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                    </svg>
                                </div>
                                <h3>{t('aiStrategy.smcTitle', 'SMC & Order Block Detection')}</h3>
                            </div>
                            <p>{t('aiStrategy.smcDesc', 'Automatically detect institutional order blocks, liquidity sweeps, fair value gaps (FVG), and break of structure (BOS) for high-probability precision entries.')}</p>
                           
                        </motion.div>

                        {/* Card 5: Backtest Expectancy */}
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
                                        <line x1="18" y1="20" x2="18" y2="10"></line>
                                        <line x1="12" y1="20" x2="12" y2="4"></line>
                                        <line x1="6" y1="20" x2="6" y2="14"></line>
                                    </svg>
                                </div>
                                <h3>{t('aiStrategy.backtestTitle', 'Backtest Expectancy Reports')}</h3>
                            </div>
                            <p>{t('aiStrategy.backtestDesc', 'Review historical Win Rate %, Profit Factor, Max Drawdown curves, Sharpe Ratio, and Risk-to-Reward asymmetry tailored to your custom trading rules.')}</p>
                           
                        </motion.div>

                        {/* Card 6: MT5 & Webhook Distribution */}
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
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                    </svg>
                                </div>
                                <h3>{t('aiStrategy.mt5Title', 'MT5 & Real-Time Alerts')}</h3>
                            </div>
                            <p>{t('aiStrategy.mt5Desc', 'Receive real-time push notifications, webhook signals, and direct MetaTrader 5 (MT5) order execution alerts the instant setup parameters align.')}</p>
                          
                        </motion.div>
                    </motion.div>

                    {/* SECTION 1: How AI Strategy Works (4-Step Workflow Grid) */}
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
                            <p>{t('aiStrategy.workflowSubtitleExpanded', 'Transform raw trading ideas and discretionary rules into backtested, quantitative strategies in 4 simple steps.')}</p>
                        </div>

                        <div className={styles.workflowGrid}>
                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>01</div>
                                <h3>{t('aiStrategy.step1TitleExpanded', 'Define Rules & Indicators')}</h3>
                                <p>{t('aiStrategy.step1DescExpanded', 'Specify custom indicator parameters (EMA 20/50/200, RSI 14 divergence, MACD crossovers, SMC Order Blocks), entry triggers, and fixed/dynamic Stop-Loss and Take-Profit ratios.')}</p>
                            </div>

                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>02</div>
                                <h3>{t('aiStrategy.step2TitleExpanded', 'Automated Confluence Scan')}</h3>
                                <p>{t('aiStrategy.step2DescExpanded', 'Trader Master AI continuously monitors 28 currency pairs, Spot Gold (XAUUSD), and major assets for multi-timeframe alignment across M15, H1, H4, and Daily charts.')}</p>
                            </div>

                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>03</div>
                                <h3>{t('aiStrategy.step3TitleExpanded', 'Backtest & Risk Metrics')}</h3>
                                <p>{t('aiStrategy.step3DescExpanded', 'Instantly view comprehensive performance analytics including historical Win Rate %, Profit Factor (PF), Maximum Drawdown (DD), Profit Expectancy per trade, and Kelly Criterion lot scaling.')}</p>
                            </div>

                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>04</div>
                                <h3>{t('aiStrategy.step4TitleExpanded', 'MT5 Direct Execution')}</h3>
                                <p>{t('aiStrategy.step4DescExpanded', 'Connect your generated strategy directly to MetaTrader 5 (MT5) for real-time webhooks, live signal alerts, and instant execution notifications whenever market setups occur.')}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* SECTION 2: Sample Strategy Performance Cards (2 Cards) */}
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
                            <p>{t('aiStrategy.sampleSubtitleExpanded', 'Example quantitative breakdowns generated by Trader Master AI for active market pairs.')}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Strategy Card 1 */}
                            <div className={styles.strategyMetricsCard}>
                                <div className={styles.cardTopRow}>
                                    <div>
                                        <span className={styles.pairBadge}>EUR/USD • H4 Timeframe</span>
                                        <h3>MACD + SMC Order Block Breakout</h3>
                                    </div>
                                    <div className={styles.scorePill}>
                                        <span className={styles.scoreVal}>88/100</span>
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

                            {/* Strategy Card 2 */}
                            <div className={styles.strategyMetricsCard}>
                                <div className={styles.cardTopRow}>
                                    <div>
                                        <span className={styles.pairBadge}>XAU/USD (Gold) • H1 Timeframe</span>
                                        <h3>EMA Pullback & Volatility Expansion</h3>
                                    </div>
                                    <div className={styles.scorePill}>
                                        <span className={styles.scoreVal}>92/100</span>
                                        <span className={styles.scoreLabel}>Top Rated</span>
                                    </div>
                                </div>

                                <div className={styles.metricsGrid}>
                                    <div className={styles.metricItem}>
                                        <span className={styles.mLabel}>Win Rate</span>
                                        <span className={`${styles.mVal} ${styles.green}`}>74.1%</span>
                                    </div>
                                    <div className={styles.metricItem}>
                                        <span className={styles.mLabel}>Profit Factor</span>
                                        <span className={`${styles.mVal} ${styles.green}`}>2.62</span>
                                    </div>
                                    <div className={styles.metricItem}>
                                        <span className={styles.mLabel}>Max Drawdown</span>
                                        <span className={styles.mVal}>5.1%</span>
                                    </div>
                                    <div className={styles.metricItem}>
                                        <span className={styles.mLabel}>Avg Risk / Reward</span>
                                        <span className={`${styles.mVal} ${styles.green}`}>1 : 2.8</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* SECTION 3: CTA Section */}
                    <motion.div 
                        className={styles.ctaCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.ctaContent}>
                            <h2>{t('aiStrategy.ctaTitleExpanded', 'Build & Deploy Your Custom AI Strategy Engine Today')}</h2>
                            <p>{t('aiStrategy.ctaDescExpanded', 'Empower your trading with automated quantitative rules, institutional confluence scoring, and live MT5 signal alerts.')}</p>
                            <Button 
                                icon={ArrowIcon}
                                text={t('aiStrategy.startBuildingNow', ' AI Strategy Now')}
                                onClick={() => authNavigate(router, '/dashboard')}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
