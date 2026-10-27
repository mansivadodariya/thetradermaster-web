'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMPLE_TRADES } from '../constants/sampleTrades';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../aiPastTradeAnalyzer.module.scss';

export default function InteractiveAuditSection({
    selectedTrade,
    onSelectPreset,
    isScanning,
    scanProgress
}) {
    const { t } = useLanguage();

    return (
        <section className={styles.auditSection}>
            <div className="container">
                <div className={styles.auditLayout}>
                    {/* LEFT COLUMN: WHAT YOU'LL GET PILLARS */}
                    <div className={styles.pillarsCol}>
                        <div className={styles.sectionBadge}>
                            <span>{t('aiAuditPillars.badge', '✦ VALUE DRIVERS')}</span>
                        </div>
                        <h2 className={styles.columnTitle}>{t('aiAuditPillars.title', "WHAT YOU'LL GET")}</h2>
                        <p className={styles.columnSubtitle}>
                            {t('aiAuditPillars.subtitle', 'Stop guessing why you lost. Discover exactly what ChronosX analyzes on your chart:')}
                        </p>

                        <div className={styles.pillarsList}>
                            {/* Pillar 1 */}
                            <div className={styles.pillarItem}>
                                <div className={styles.itemIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 3v18h18" />
                                        <path d="m19 9-5 5-4-4-3 3" />
                                    </svg>
                                </div>
                                <div className={styles.itemBody}>
                                    <h4>{t('aiAuditPillars.pillar1Title', 'Trade Breakdown')}</h4>
                                    <p>{t('aiAuditPillars.pillar1Desc', 'Entry, exit, position size, RR, and outcome metrics.')}</p>
                                </div>
                            </div>

                            {/* Pillar 2 */}
                            <div className={styles.pillarItem}>
                                <div className={styles.itemIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                                <div className={styles.itemBody}>
                                    <h4>{t('aiAuditPillars.pillar2Title', 'Mistake Identification')}</h4>
                                    <p>{t('aiAuditPillars.pillar2Desc', 'AI highlights what went wrong and why instead of just seeing WIN or LOSS.')}</p>
                                </div>
                            </div>

                            {/* Pillar 3 */}
                            <div className={styles.pillarItem}>
                                <div className={styles.itemIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                </div>
                                <div className={styles.itemBody}>
                                    <h4>{t('aiAuditPillars.pillar3Title', 'Market Context Review')}</h4>
                                    <p>{t('aiAuditPillars.pillar3Desc', 'Understand market conditions, trends, and support/resistance during your trade.')}</p>
                                </div>
                            </div>

                            {/* Pillar 4 */}
                            <div className={styles.pillarItem}>
                                <div className={styles.itemIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <div className={styles.itemBody}>
                                    <h4>{t('aiAuditPillars.pillar4Title', 'Risk Management Check')}</h4>
                                    <p>{t('aiAuditPillars.pillar4Desc', 'Evaluate your risk, lot size, and stop-loss placement.')}</p>
                                </div>
                            </div>

                            {/* Pillar 5 */}
                            <div className={styles.pillarItem}>
                                <div className={styles.itemIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                </div>
                                <div className={styles.itemBody}>
                                    <h4>{t('aiAuditPillars.pillar5Title', 'Improvement Tips')}</h4>
                                    <p>{t('aiAuditPillars.pillar5Desc', 'Actionable suggestions to improve your execution on future trades.')}</p>
                                </div>
                            </div>

                            {/* Pillar 6 */}
                            <div className={styles.pillarItem}>
                                <div className={styles.itemIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <circle cx="12" cy="12" r="6" />
                                        <circle cx="12" cy="12" r="2" />
                                    </svg>
                                </div>
                                <div className={styles.itemBody}>
                                    <h4>{t('aiAuditPillars.pillar6Title', 'Confidence Rating')}</h4>
                                    <p>{t('aiAuditPillars.pillar6Desc', 'Know if you followed your plan or traded out of emotion.')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: LIVE INTERACTIVE AUDIT RESULT */}
                    <div className={styles.auditResultCol}>
                        {/* Preset Selector Tabs */}
                        <div className={styles.presetTabsWrap}>
                            <span className={styles.presetLabel}>{t('aiAuditPillars.sampleAudits', 'TRY SAMPLE AUDITS:')}</span>
                            <div className={styles.presetTabs}>
                                {SAMPLE_TRADES.map((trade) => (
                                    <button
                                        key={trade.id}
                                        type="button"
                                        onClick={() => onSelectPreset(trade)}
                                        className={`${styles.presetBtn} ${selectedTrade.id === trade.id ? styles.presetBtnActive : ''}`}
                                    >
                                        {trade.pair}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Audit Glass Card */}
                        <div className={styles.auditCard}>
                            <div className={styles.cardGlowBorder} />

                            {/* Header */}
                            <div className={styles.auditCardHeader}>
                                <div className={styles.auditCardTitleGroup}>
                                    <span className={styles.auditHeaderTag}>{t('aiAuditPillars.resultTag', 'ANALYSIS RESULT')}</span>
                                    <h3 className={styles.auditPairTitle}>
                                        {selectedTrade.title} <span className={styles.tfBadge}>{selectedTrade.timeframe}</span>
                                    </h3>
                                </div>
                                <div className={styles.liveIndicator}>
                                    <span className={styles.pulseDot} />
                                    <span>AI AUDIT V3.2</span>
                                </div>
                            </div>

                            {/* Scanning Overlay */}
                            <AnimatePresence>
                                {isScanning && (
                                    <motion.div
                                        className={styles.scanningOverlay}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className={styles.scannerAnimationBox}>
                                            <div className={styles.scanSpinner} />
                                            <h4>{t('aiAuditPillars.scanningTitle', 'AI NEURAL AUDIT IN PROGRESS')}</h4>
                                            <p>{t('aiAuditPillars.scanningDesc', 'Analyzing candlestick wicks, order blocks & risk-to-reward ratio...')}</p>
                                            <div className={styles.scanProgressBar}>
                                                <div
                                                    className={styles.scanProgressFill}
                                                    style={{ width: `${scanProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Visual Annotated Chart Simulation Box */}
                            <div className={styles.chartVisualStage}>
                                {/* Candlestick SVG Simulation */}
                                <svg className={styles.candlestickSvg} viewBox="0 0 600 240" fill="none">
                                    {/* Grid Lines */}
                                    <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                                    <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                                    <line x1="0" y1="180" x2="600" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                                    {/* Stop Loss Red Zone */}
                                    <rect x="360" y="50" width="180" height="45" fill="rgba(239, 68, 68, 0.12)" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="4 4" rx="4" />
                                    <text x="370" y="75" fill="#EF4444" fontSize="10.5" fontWeight="700">STOP LOSS TRIGGERED</text>

                                    {/* Better Take Profit Green Zone */}
                                    <rect x="360" y="140" width="180" height="70" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.4)" strokeDasharray="4 4" rx="4" />
                                    <text x="370" y="175" fill="#10B981" fontSize="10.5" fontWeight="700">OPTIMAL TARGET ZONE</text>

                                    {/* Candlesticks sequence */}
                                    <line x1="40" y1="140" x2="40" y2="200" stroke="#10B981" strokeWidth="2" />
                                    <rect x="34" y="150" width="12" height="35" fill="#10B981" rx="1" />

                                    <line x1="75" y1="120" x2="75" y2="180" stroke="#10B981" strokeWidth="2" />
                                    <rect x="69" y="130" width="12" height="40" fill="#10B981" rx="1" />

                                    <line x1="110" y1="90" x2="110" y2="160" stroke="#10B981" strokeWidth="2" />
                                    <rect x="104" y="100" width="12" height="45" fill="#10B981" rx="1" />

                                    <line x1="145" y1="100" x2="145" y2="170" stroke="#EF4444" strokeWidth="2" />
                                    <rect x="139" y="110" width="12" height="45" fill="#EF4444" rx="1" />

                                    <line x1="180" y1="130" x2="180" y2="195" stroke="#EF4444" strokeWidth="2" />
                                    <rect x="174" y="145" width="12" height="35" fill="#EF4444" rx="1" />

                                    <line x1="215" y1="110" x2="215" y2="185" stroke="#10B981" strokeWidth="2" />
                                    <rect x="209" y="125" width="12" height="40" fill="#10B981" rx="1" />

                                    <line x1="250" y1="80" x2="250" y2="155" stroke="#10B981" strokeWidth="2" />
                                    <rect x="244" y="95" width="12" height="45" fill="#10B981" rx="1" />

                                    <line x1="285" y1="90" x2="285" y2="175" stroke="#EF4444" strokeWidth="2" />
                                    <rect x="279" y="105" width="12" height="50" fill="#EF4444" rx="1" />

                                    <line x1="320" y1="130" x2="320" y2="210" stroke="#EF4444" strokeWidth="2" />
                                    <rect x="314" y="145" width="12" height="50" fill="#EF4444" rx="1" />

                                    <line x1="355" y1="65" x2="355" y2="170" stroke="#EF4444" strokeWidth="2.5" />
                                    <rect x="349" y="80" width="12" height="40" fill="#EF4444" rx="1" />

                                    <line x1="390" y1="110" x2="390" y2="190" stroke="#EF4444" strokeWidth="2" />
                                    <rect x="384" y="125" width="12" height="50" fill="#EF4444" rx="1" />

                                    <line x1="425" y1="140" x2="425" y2="220" stroke="#10B981" strokeWidth="2" />
                                    <rect x="419" y="155" width="12" height="45" fill="#10B981" rx="1" />
                                </svg>

                                {/* Annotated Badge: Wrong Entry */}
                                <div className={styles.wrongEntryCallout}>
                                    <div className={styles.calloutPillRed}>
                                        <span>{t('aiAuditPillars.wrongEntry', 'Wrong Entry')}</span>
                                    </div>
                                    <div className={styles.calloutPointerRed} />
                                </div>

                                {/* Annotated Badge: Better Entry */}
                                <div className={styles.betterEntryCallout}>
                                    <div className={styles.calloutPointerGreen} />
                                    <div className={styles.calloutPillGreen}>
                                        <span>{t('aiAuditPillars.betterEntry', 'Better Entry')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quantitative Score & Metrics Bar */}
                            <div className={styles.metricsBar}>
                                {/* Metric 1 */}
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>{t('aiAuditPillars.resultLabel', 'RESULT')}</span>
                                    <span className={selectedTrade.result.includes('WIN') ? styles.winResult : styles.lossResult}>
                                        {selectedTrade.result} ({selectedTrade.percent})
                                    </span>
                                </div>

                                <div className={styles.metricDivider} />

                                {/* Metric 2 */}
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>{t('aiAuditPillars.riskRewardLabel', 'RISK REWARD')}</span>
                                    <span className={styles.metricVal}>{selectedTrade.rr}</span>
                                </div>

                                <div className={styles.metricDivider} />

                                {/* Metric 3 */}
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>{t('aiAuditPillars.scoreLabel', 'SCORE')}</span>
                                    <div className={styles.scoreWrap}>
                                        <span className={styles.scoreNumber}>{selectedTrade.score}</span>
                                        <span className={styles.scoreOutOf}>/ 100</span>
                                        <span className={styles.scoreTag}>
                                            {selectedTrade.score >= 70 ? t('aiAuditPillars.scoreGood', 'Good') : t('aiAuditPillars.scoreAvg', 'Average')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bento Breakdown: What Went Wrong vs How to Improve */}
                            <div className={styles.auditBentoGrid}>
                                {/* 1. What Went Wrong */}
                                <div className={styles.bentoCardWrong}>
                                    <div className={styles.bentoHeader}>
                                        <span className={styles.bentoIconRed}>✕</span>
                                        <h4>{t('aiAuditPillars.whatWentWrong', 'WHAT WENT WRONG')}</h4>
                                    </div>
                                    <ul className={styles.bentoList}>
                                        {selectedTrade.mistakes.map((item, idx) => (
                                            <li key={idx}>
                                                <span className={styles.bulletRed}>✗</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 2. How To Improve */}
                                <div className={styles.bentoCardImprove}>
                                    <div className={styles.bentoHeader}>
                                        <span className={styles.bentoIconGreen}>✓</span>
                                        <h4>{t('aiAuditPillars.howToImprove', 'HOW TO IMPROVE')}</h4>
                                    </div>
                                    <ul className={styles.bentoList}>
                                        {selectedTrade.improvements.map((item, idx) => (
                                            <li key={idx}>
                                                <span className={styles.bulletGreen}>✓</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Coach Philosophy Note */}
                            <div className={styles.auditFooterNote}>
                                <span className={styles.goldQuoteIcon}>“</span>
                                <p>{t('aiAuditPillars.philosophyNote', "The goal isn't to blame the trader. It's to make the next trade better.")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
