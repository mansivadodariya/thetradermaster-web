'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { authNavigate } from '@/lib/authRedirect';
import styles from '../aiStrategyPage.module.scss';

export default function StrategySimulatorSection({
    demoRef,
    strategies,
    selectedStrategy,
    handleSelectStrategy,
    pairsData,
    selectedPair,
    handleSelectPair,
    isRecomputing,
    handleCopyScore,
    router
}) {
    const { t } = useLanguage();

    return (
        <section ref={demoRef} id="live-scoring" className={styles.feedDemoSection}>
            <div className="container">
                <SectionHeader
                    badge={t('strategyPage.simulatorBadge', 'QUANTITATIVE COCKPIT PREVIEW')}
                    title1={t('strategyPage.simulatorTitle1', 'LIVE 100-POINT')}
                    title2={t('strategyPage.simulatorTitle2', 'TECHNICAL SCORE FEED')}
                    description={t('strategyPage.simulatorSubtitle', 'Select any Forex major or strategy model to inspect live aggregate scores, 4-pillar breakdowns, and market biases in real time.')}
                    align="center"
                />

                <div className={styles.feedCockpit}>
                    {/* Top Bar: Controls & Strategy Dropdown */}
                    <div className={styles.cockpitNavHeader}>
                        <div className={styles.cockpitBrand}>
                            <span className={`${styles.dot} ${styles.dotRed}`} />
                            <span className={`${styles.dot} ${styles.dotYellow}`} />
                            <span className={`${styles.dot} ${styles.dotGreen}`} />
                            <span className={styles.brandTitle}>TRADERMASTER // 100-PT QUANT ENGINE</span>
                        </div>

                        {/* Active Strategy Selector */}
                        <div className={styles.strategySelectorBar}>
                            <span className={styles.stratLabel}>STRATEGY:</span>
                            <div className={styles.stratPills}>
                                {strategies.map((strat) => (
                                    <button
                                        key={strat}
                                        type="button"
                                        onClick={() => handleSelectStrategy(strat)}
                                        className={`${styles.stratBtn} ${selectedStrategy === strat ? styles.stratBtnActive : ''}`}
                                    >
                                        {strat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Feed Status Pill */}
                        <div className={styles.liveTelemetryTag}>
                            <span className={styles.pulsingDot} />
                            <span>WS STREAM ACTIVE</span>
                        </div>
                    </div>

                    {/* Cockpit Main Grid: Watchlist on Left, Live Scorecard on Right */}
                    <div className={styles.cockpitBodyGrid}>
                        {/* Left: 6-Pair Interactive Watchlist */}
                        <div className={styles.watchlistPane}>
                            <div className={styles.paneHeader}>
                                <span>SELECT ACTIVE ASSET</span>
                                <span className={styles.paneCount}>6 Pairs Live</span>
                            </div>

                            <div className={styles.pairsList}>
                                {pairsData.map((pair) => {
                                    const isSelected = selectedPair.id === pair.id;
                                    return (
                                        <button
                                            key={pair.id}
                                            type="button"
                                            onClick={() => handleSelectPair(pair)}
                                            className={`${styles.pairItemBtn} ${isSelected ? styles.pairItemActive : ''}`}
                                        >
                                            <div className={styles.pairLeft}>
                                                <span className={styles.pairSymbol}>{pair.symbol}</span>
                                                <span className={styles.pairName}>{pair.name}</span>
                                            </div>

                                            <div className={styles.pairRight}>
                                                <span className={styles.pairPrice}>{pair.price}</span>
                                                <span className={`${styles.scoreTag} ${styles[pair.biasType]}`}>
                                                    {pair.score}/100
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className={styles.deskHintBanner}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                <span>Feed streams 600+ ticks/min via MT5 Bridge</span>
                            </div>
                        </div>

                        {/* Right: Detailed Quantitative Audit Panel */}
                        <div className={styles.scorecardPane}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedPair.id + selectedStrategy}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}
                                    className={styles.scorecardContent}
                                >
                                    {/* Top Scorecard Meta Banner */}
                                    <div className={styles.scorecardHeroBar}>
                                        <div className={styles.assetMeta}>
                                            <div className={styles.assetSymbolRow}>
                                                <h3>{selectedPair.symbol}</h3>
                                                <span className={`${styles.biasBadge} ${styles[selectedPair.biasType]}`}>
                                                    {selectedPair.bias}
                                                </span>
                                            </div>
                                            <p className={styles.assetSubTitle}>
                                                {selectedPair.name} • Active Model: <strong>{selectedStrategy}</strong>
                                            </p>
                                        </div>

                                        {/* Total Score Radar Gauge */}
                                        <div className={styles.aggregateScoreBox}>
                                            <div className={styles.scoreCircle}>
                                                <span className={styles.scoreNumber}>{selectedPair.score}</span>
                                                <span className={styles.scoreDenominator}>/100</span>
                                            </div>
                                            <span className={styles.confidenceLabel}>
                                                Confidence: {selectedPair.confidence}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 4 Pillars Breakdown Grid (25 Pts Each) */}
                                    <div className={styles.pillarsGrid}>
                                        <div className={styles.pillarCard}>
                                            <div className={styles.pillarHeader}>
                                                <span>1. TREND ALIGNMENT</span>
                                                <strong className={styles.pillarScore}>
                                                    {selectedPair.pillars.trend.score} / 25
                                                </strong>
                                            </div>
                                            <div className={styles.pillarProgressBar}>
                                                <div
                                                    className={styles.pillarProgressFill}
                                                    style={{ width: `${(selectedPair.pillars.trend.score / 25) * 100}%` }}
                                                />
                                            </div>
                                            <p className={styles.pillarNote}>{selectedPair.pillars.trend.note}</p>
                                        </div>

                                        <div className={styles.pillarCard}>
                                            <div className={styles.pillarHeader}>
                                                <span>2. MOMENTUM EXPANSION</span>
                                                <strong className={styles.pillarScore}>
                                                    {selectedPair.pillars.momentum.score} / 25
                                                </strong>
                                            </div>
                                            <div className={styles.pillarProgressBar}>
                                                <div
                                                    className={styles.pillarProgressFill}
                                                    style={{ width: `${(selectedPair.pillars.momentum.score / 25) * 100}%` }}
                                                />
                                            </div>
                                            <p className={styles.pillarNote}>{selectedPair.pillars.momentum.note}</p>
                                        </div>

                                        <div className={styles.pillarCard}>
                                            <div className={styles.pillarHeader}>
                                                <span>3. VOLUME SURGE DELTA</span>
                                                <strong className={styles.pillarScore}>
                                                    {selectedPair.pillars.volume.score} / 25
                                                </strong>
                                            </div>
                                            <div className={styles.pillarProgressBar}>
                                                <div
                                                    className={styles.pillarProgressFill}
                                                    style={{ width: `${(selectedPair.pillars.volume.score / 25) * 100}%` }}
                                                />
                                            </div>
                                            <p className={styles.pillarNote}>{selectedPair.pillars.volume.note}</p>
                                        </div>

                                        <div className={styles.pillarCard}>
                                            <div className={styles.pillarHeader}>
                                                <span>4. MARKET STRUCTURE</span>
                                                <strong className={styles.pillarScore}>
                                                    {selectedPair.pillars.structure.score} / 25
                                                </strong>
                                            </div>
                                            <div className={styles.pillarProgressBar}>
                                                <div
                                                    className={styles.pillarProgressFill}
                                                    style={{ width: `${(selectedPair.pillars.structure.score / 25) * 100}%` }}
                                                />
                                            </div>
                                            <p className={styles.pillarNote}>{selectedPair.pillars.structure.note}</p>
                                        </div>
                                    </div>

                                    {/* Active Indicators Overlay State */}
                                    <div className={styles.activeIndicatorsRow}>
                                        <span className={styles.indicatorsTitle}>Active Strategy Overlays:</span>
                                        <div className={styles.indicatorTags}>
                                            {selectedPair.indicators.map((ind, i) => (
                                                <div key={i} className={`${styles.indicatorTag} ${styles[ind.state]}`}>
                                                    <span className={styles.indName}>{ind.name}:</span>
                                                    <span className={styles.indVal}>{ind.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Cockpit Footer Action Row */}
                            <div className={styles.cockpitFooter}>
                                <div className={styles.evidenceSummary}>
                                    <div className={styles.evidenceTitle}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        <span>AI CONFLUENCE SUMMARY</span>
                                    </div>
                                    <p>{selectedPair.summary}</p>
                                </div>

                                {/* Open Desk Button */}
                                <button
                                    type="button"
                                    onClick={() => authNavigate(router, '/signal-terminal')}
                                    className={styles.launchDeskActionBtn}
                                >
                                    <span>Open in Live Strategy Desk</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
