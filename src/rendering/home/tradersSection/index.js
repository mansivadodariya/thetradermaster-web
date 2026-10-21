'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './tradersSection.module.scss'
import LineText from '@/components/lineText'
import BorderGlow from '@/components/borderGlow'
import { useLanguage } from '@/context/LanguageContext'
import TradeIcon from '@/icons/tradeIcon'
import AssistantIcon from '@/icons/assistantIcon'
import AiIcon from '@/icons/aiIcon'
import DashboardIcon from '@/icons/dashboardIcon'

const TradeVisual = '/assets/images/new-ai-trade.png';
const ChartVisual = '/assets/images/snap-image.png';
const RobotVisual = '/assets/images/fx-guru-new.png';
const StrategyVisual = '/assets/images/stratagyimage-new.png';

const MotionBorderGlow = motion(BorderGlow);

export default function TradersSection() {
    const { t } = useLanguage()

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    }

    return (
        <div className={styles.tradersSection}>
            <div className="container-xs">
                <LineText text={t('home.lineText', 'AI For MT5 Traders')} />

                <div className={styles.title}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {t('home.tradersTitlePart1', 'Built For Every Part Of Your')}{' '}
                        <span className={styles.neonText}>
                            {t('home.tradersTitlePart2', 'Trading Workflow')}
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {t(
                            'home.tradersSubtitle',
                            'From single-chart questions to full strategy generation each module shares the same credit pool and your linked MT5 context.'
                        )}
                    </motion.p>
                </div>

                {/* 4-Card Bento Grid Layout with Border Glow */}
                <motion.div
                    className={styles.bentoGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ staggerChildren: 0.15 }}
                >
                    {/* CARD 1: AI Trade (Tall Left Card) */}
                    <MotionBorderGlow
                        className={`${styles.bentoCard} ${styles.cardAiTrade}`}
                        variants={cardVariants}
                        edgeSensitivity={30}
                        glowColor="#00FF88"
                        colors={['#00FF88', '#00F0FF', '#10b981']}
                        backgroundColor="#050d09"
                        borderRadius={24}
                        glowRadius={180}
                        glowIntensity={1}
                        coneSpread={30}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.iconBox}><TradeIcon /></div>
                            <h3>{t('nav.aiTrade', 'AI Trade Scanner')}</h3>
                            <p>{t('home.aiTradeBentoDesc', 'Drag in a screenshot from MT5 or TradingView. Trader Master identifies structure, key levels, and gives you a graded setup with risk/reward.')}</p>
                            <Link href="/tradesnap" className={styles.exploreBtn}>
                                <span>{t('home.explore', 'Explore')}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                        </div>
                        <div className={styles.cardVisualArea}>
                            <img src={TradeVisual} alt="AI Trade Graphic" className={styles.bgGraphic} loading="lazy" decoding="async" />
                            <div className={styles.chartFrame}>
                                <img src={ChartVisual} alt="Chart Preview" loading="lazy" decoding="async" />
                            </div>
                        </div>
                    </MotionBorderGlow>

                    {/* CARD 2: AI Chat (Top Middle Card) */}
                    <MotionBorderGlow
                        className={`${styles.bentoCard} ${styles.cardAiChat}`}
                        variants={cardVariants}
                        edgeSensitivity={30}
                        glowColor="#00FF88"
                        colors={['#00FF88', '#00F0FF', '#10b981']}
                        backgroundColor="#050d09"
                        borderRadius={24}
                        glowRadius={180}
                        glowIntensity={1}
                        coneSpread={30}
                    >
                        <div className={styles.cardInfo}>
                            <div className={styles.iconBox}><AssistantIcon /></div>
                            <h3>{t('nav.aiChat', 'AI Trade Assistant')}</h3>
                            <p>{t('home.aiChatBentoDesc', 'Ask anything — pair commentary, session news interpretation. Every prompt uses just one credit.')}</p>
                            <Link href="/ai-chat" className={styles.exploreBtn}>
                                <span>{t('home.explore', 'Explore')}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                        </div>
                        <div className={styles.robotGraphicBox}>
                            <img src={RobotVisual} alt="AI Assistant Robot" className={styles.robotImg} loading="lazy" decoding="async" />
                        </div>
                    </MotionBorderGlow>

                    {/* CARD 3: AI Strategy (Top Right Card) */}
                    <MotionBorderGlow
                        className={`${styles.bentoCard} ${styles.cardAiStrategy}`}
                        variants={cardVariants}
                        edgeSensitivity={30}
                        glowColor="#00FF88"
                        colors={['#00FF88', '#00F0FF', '#10b981']}
                        backgroundColor="#050d09"
                        borderRadius={24}
                        glowRadius={180}
                        glowIntensity={1}
                        coneSpread={30}
                    >
                        <div className={styles.cardInfo}>
                            <div className={styles.iconBox}><AiIcon /></div>
                            <h3>{t('nav.aiStrategy', 'AI Strategy')}</h3>
                            <p>{t('home.aiStrategyBentoDesc', 'Describe your trading style, get a complete strategy with entry rules, with entry, SL, TP, and a backtest report.')}</p>
                            <Link href="/ai-strategy" className={styles.exploreBtn}>
                                <span>{t('home.explore', 'Explore')}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                        </div>
                        <div className={styles.strategyGraphicBox}>
                            <img src={StrategyVisual} alt="AI Strategy Stack" className={styles.strategyImg} loading="lazy" decoding="async" />
                        </div>
                    </MotionBorderGlow>

                    {/* CARD 4: Cross-Module Insights Dashboard (Bottom Wide Card) */}
                    <MotionBorderGlow
                        className={`${styles.bentoCard} ${styles.cardDashboard}`}
                        variants={cardVariants}
                        edgeSensitivity={30}
                        glowColor="#00FF88"
                        colors={['#00FF88', '#00F0FF', '#10b981']}
                        backgroundColor="#050d09"
                        borderRadius={24}
                        glowRadius={180}
                        glowIntensity={1}
                        coneSpread={30}
                    >
                        <div className={styles.dashboardInfo}>
                            <div className={styles.iconBox}><DashboardIcon /></div>
                            <h3>{t('home.dashboardTitle', 'AI Past Trade Analyzer')}</h3>
                            <p>{t('home.dashboardDesc', 'Turn past mistakes into your greatest edge')}</p>
                            <Link href="/past-trade-analyzer" className={styles.exploreBtn}>
                                <span>{t('home.explore', 'Explore')}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                        </div>

                        <div className={styles.dashboardVisualGrid}>
                            <div className={styles.chartWidget}>
                                <div className={styles.miniChartHeader}>
                                    <span>Performance Overview</span>
                                </div>
                                <div className={styles.miniChartBody}>
                                    <svg viewBox="0 0 200 80" className={styles.chartSvg}>
                                        <defs>
                                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#00FF88" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 60 Q 30 50, 60 30 T 120 40 T 180 15 L 200 20 L 200 80 L 0 80 Z" fill="url(#chartGrad)" />
                                        <path d="M0 60 Q 30 50, 60 30 T 120 40 T 180 15 L 200 20" fill="none" stroke="#00FF88" strokeWidth="2.5" />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.metricsRow}>
                                <div className={styles.metricChip}>
                                    <div className={styles.metricLabel}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>
                                        <span>Win Rate</span>
                                    </div>
                                    <div className={styles.metricData}>
                                        <div className={styles.metricValue}>82.2%</div>
                                        <div className={styles.metricTrend}>↑ +6.5%</div>
                                    </div>
                                </div>

                                <div className={styles.metricChip}>
                                    <div className={styles.metricLabel}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                                        <span>Total Trades</span>
                                    </div>
                                    <div className={styles.metricData}>
                                        <div className={styles.metricValue}>19</div>
                                        <div className={styles.metricTrend}>↑ +3.5%</div>
                                    </div>
                                </div>

                                <div className={styles.metricChip}>
                                    <div className={styles.metricLabel}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                        <span>Strategy</span>
                                    </div>
                                    <div className={styles.metricData}>
                                        <div className={styles.metricValue}>23</div>
                                        <div className={styles.metricSub}>Analyzed</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MotionBorderGlow>
                </motion.div>
            </div>
        </div>
    )
}