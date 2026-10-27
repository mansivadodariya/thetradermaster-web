'use client';

import React from 'react';
import Image from 'next/image';
import { SAMPLE_TRADES } from '../constants/sampleTrades';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../aiPastTradeAnalyzer.module.scss';

export default function CockpitStage({ selectedTrade, onSelectPreset }) {
    const { t } = useLanguage();

    return (
        <div className={styles.cockpitFrame}>
            <div className={styles.cockpitTopGlow} />

            {/* Cockpit Header Bar */}
            <div className={styles.cockpitNavHeader}>
                <div className={styles.cockpitBrand}>
                    <span className={styles.cockpitDotGreen} />
                    <span className={styles.cockpitTitleText}>{t('aiPastTradeAnalyzer.cockpit.title', 'TRADERMASTER // NEURAL AUDITOR COCKPIT')}</span>
                </div>

                {/* Quick Preset Selector */}
                <div className={styles.cockpitPresetTabs}>
                    {SAMPLE_TRADES.map((trade) => (
                        <button
                            key={trade.id}
                            type="button"
                            onClick={() => onSelectPreset(trade)}
                            className={`${styles.tabBtn} ${selectedTrade.id === trade.id ? styles.tabBtnActive : ''}`}
                        >
                            {trade.pair}
                        </button>
                    ))}
                </div>

                <div className={styles.cockpitTelemetryBadge}>
                    <span>{t('aiPastTradeAnalyzer.cockpit.speed', 'SPEED:')} <strong>1.2s</strong></span>
                    <span className={styles.telemetryDivider}>|</span>
                    <span>{t('aiPastTradeAnalyzer.cockpit.accuracy', 'ACCURACY:')} <strong>99.4%</strong></span>
                </div>
            </div>

            {/* Cockpit Interactive 3-Column Display */}
            <div className={styles.cockpitBodyGrid}>
                {/* 1. Left Telemetry Column */}
                <div className={styles.telemetryColLeft}>
                    <div className={styles.telemetryCard}>
                        <span className={styles.telemetryLabel}>{t('aiPastTradeAnalyzer.cockpit.tradeOutcome', 'TRADE OUTCOME')}</span>
                        <div className={selectedTrade.result.includes('WIN') ? styles.winBig : styles.lossBig}>
                            {selectedTrade.result}
                        </div>
                        <div className={styles.lossPct}>{selectedTrade.percent}</div>
                    </div>

                    <div className={styles.telemetryCard}>
                        <span className={styles.telemetryLabel}>{t('aiPastTradeAnalyzer.cockpit.executionScore', 'EXECUTION SCORE')}</span>
                        <div className={styles.scoreRow}>
                            <span className={styles.scoreBig}>{selectedTrade.score}</span>
                            <span className={styles.scoreMax}>/ 100</span>
                        </div>
                        <div className={styles.scoreStatusPill}>
                            {selectedTrade.score >= 70 ? 'Grade: Solid' : 'Grade: Needs Improvement'}
                        </div>
                    </div>

                    <div className={styles.telemetryCard}>
                        <span className={styles.telemetryLabel}>{t('aiPastTradeAnalyzer.cockpit.riskRewardRatio', 'RISK REWARD RATIO')}</span>
                        <div className={styles.rrVal}>{selectedTrade.rr}</div>
                    </div>
                </div>

                {/* 2. Center: 3D Holographic AI Brain Pedestal with Laser Scan */}
                <div className={styles.hologramCenterCol}>
                    <div className={styles.hologramVisualWrap}>
                        <Image
                            src="/assets/images/ai-past-trade-analyzer/brain-pedestal.jpg"
                            alt="AI Holographic Trade Pedestal"
                            width={480}
                            height={480}
                            priority
                            className={styles.brainImg}
                        />
                        <div className={styles.hologramLaser} />
                        <div className={styles.hologramVignette} />

                        {/* Floating Interactive Callout Badges */}
                        <div className={styles.pinWrongEntry}>
                            <span className={styles.pinDotRed} />
                            <span>{t('aiPastTradeAnalyzer.interactive.wrongEntry', 'Wrong Entry')}: {selectedTrade.wrongEntryPrice}</span>
                        </div>

                        <div className={styles.pinBetterEntry}>
                            <span className={styles.pinDotGreen} />
                            <span>{t('aiPastTradeAnalyzer.interactive.betterEntry', 'Better Entry')}: {selectedTrade.betterEntryPrice}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Right: Diagnostic Findings & Action Plan */}
                <div className={styles.diagnosticColRight}>
                    <div className={styles.diagHeader}>
                        <span className={styles.diagBadge}>{t('aiPastTradeAnalyzer.cockpit.diagnosticFindings', 'AI DIAGNOSTIC FINDINGS')}</span>
                    </div>

                    <p className={styles.verdictText}>
                        “{selectedTrade.verdict}”
                    </p>

                    {/* Primary Mistake Item */}
                    <div className={styles.mistakeHighlightBox}>
                        <div className={styles.boxTitleRow}>
                            <span className={styles.boxDotRed}>✕</span>
                            <h5>{t('aiPastTradeAnalyzer.cockpit.primaryFlaw', 'PRIMARY EXECUTION FLAW')}</h5>
                        </div>
                        <p>{selectedTrade.mistakes[0]}</p>
                    </div>

                    {/* Primary Improvement Item */}
                    <div className={styles.improveHighlightBox}>
                        <div className={styles.boxTitleRow}>
                            <span className={styles.boxDotGreen}>✓</span>
                            <h5>{t('aiPastTradeAnalyzer.cockpit.actionableFix', 'ACTIONABLE FIX')}</h5>
                        </div>
                        <p>{selectedTrade.improvements[0]}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
