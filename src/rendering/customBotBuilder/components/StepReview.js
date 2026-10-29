import React from 'react';
import styles from '../customBotBuilder.module.scss';
import { INDICATOR_DEFINITIONS, RISK_LEVELS } from '../constants';

export default function StepReview({
    data,
    onEditStep
}) {
    const {
        botName,
        description,
        tradingPair,
        timeframe,
        triggerMode,
        entryConditions,
        takeProfitPips,
        stopLossPips,
        trailingStop,
        trailingDistance,
        riskLevel,
        lotSize,
        maxOpenPositions,
        riskPerTrade,
        maxDailyLoss
    } = data;

    const currentRiskPreset = RISK_LEVELS.find(r => r.id === riskLevel) || RISK_LEVELS[1];

    return (
        <div className={styles.stepContentWrapper}>
            {/* Top Review Grid */}
            <div className={styles.reviewGrid}>
                {/* 1. Bot Identity & Market */}
                <div className={styles.reviewCard}>
                    <div className={styles.reviewCardHeader}>
                        <div className={styles.headerTitleWrap}>
                            <span className={styles.reviewStepBadge}>1</span>
                            <h4>Bot Identity & Asset</h4>
                        </div>
                        <button
                            type="button"
                            className={styles.editStepLink}
                            onClick={() => onEditStep(1)}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.reviewContent}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Bot Name</span>
                            <span className={styles.reviewValHighlight}>{botName || 'Custom Bot'}</span>
                        </div>
                        {description && (
                            <div className={styles.reviewItem}>
                                <span className={styles.reviewLabel}>Description</span>
                                <span className={styles.reviewValText}>{description}</span>
                            </div>
                        )}
                        <div className={styles.reviewBadgesRow}>
                            <span className={styles.badgePair}>{tradingPair || 'EUR/USD'}</span>
                            <span className={styles.badgeTimeframe}>{(timeframe || '15m').toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Entry Rules */}
                <div className={styles.reviewCard}>
                    <div className={styles.reviewCardHeader}>
                        <div className={styles.headerTitleWrap}>
                            <span className={styles.reviewStepBadge}>2</span>
                            <h4>Entry Strategy ({triggerMode === 'ALL' ? 'All Met' : 'Any Met'})</h4>
                        </div>
                        <button
                            type="button"
                            className={styles.editStepLink}
                            onClick={() => onEditStep(2)}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.reviewContent}>
                        <div className={styles.reviewCondsList}>
                            {entryConditions && entryConditions.length > 0 ? (
                                entryConditions.map((cond, idx) => {
                                    const def = INDICATOR_DEFINITIONS[cond.indicatorKey] || INDICATOR_DEFINITIONS.ema_crossover;
                                    const paramEntries = Object.entries(cond.params || {});
                                    const paramSummary = paramEntries.length > 0
                                        ? `(${paramEntries.map(([k, v]) => `${def?.paramLabels?.[k] || k}: ${v}`).join(', ')})`
                                        : '';
                                    return (
                                        <div key={cond.id || idx} className={styles.reviewCondRow}>
                                            <span className={styles.condPillNum}>{idx + 1}</span>
                                            <div className={styles.condPillDetails}>
                                                <span className={styles.condPillName}>{def?.name || cond.indicatorKey}</span>
                                                <span className={styles.condPillRule}>
                                                    {cond.condition} {paramSummary}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={styles.reviewCondRow}>
                                    <div className={styles.condPillDetails}>
                                        <span className={styles.condPillRule} style={{ color: '#94A3B8' }}>
                                            No entry conditions configured
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Exit Targets */}
                <div className={styles.reviewCard}>
                    <div className={styles.reviewCardHeader}>
                        <div className={styles.headerTitleWrap}>
                            <span className={styles.reviewStepBadge}>3</span>
                            <h4>Exit Targets & SL</h4>
                        </div>
                        <button
                            type="button"
                            className={styles.editStepLink}
                            onClick={() => onEditStep(3)}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.reviewContent}>
                        <div className={styles.reviewMetricsGrid}>
                            <div className={styles.metricBlockGreen}>
                                <span className={styles.metricLabel}>Take Profit</span>
                                <span className={styles.metricValue}>+{Number(takeProfitPips || 0).toLocaleString()} Pips</span>
                            </div>
                            <div className={styles.metricBlockRed}>
                                <span className={styles.metricLabel}>Stop Loss</span>
                                <span className={styles.metricValue}>-{Number(stopLossPips || 0).toLocaleString()} Pips</span>
                            </div>
                        </div>
                        <div className={styles.trailingStatusRow}>
                            <span className={styles.trailingStatusDot} data-active={trailingStop ? 'true' : 'false'} />
                            <span className={styles.trailingStatusText}>
                                Trailing Stop: {trailingStop ? `Enabled (${Number(trailingDistance || 0).toLocaleString()} pips)` : 'Disabled'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. Risk Controls */}
                <div className={styles.reviewCard}>
                    <div className={styles.reviewCardHeader}>
                        <div className={styles.headerTitleWrap}>
                            <span className={styles.reviewStepBadge}>4</span>
                            <h4>Risk Profile ({currentRiskPreset.title})</h4>
                        </div>
                        <button
                            type="button"
                            className={styles.editStepLink}
                            onClick={() => onEditStep(4)}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.reviewContent}>
                        <div className={styles.riskSummaryGrid}>
                            <div className={styles.riskSumItem}>
                                <span className={styles.riskSumLabel}>Lot Size</span>
                                <span className={styles.riskSumVal}>{lotSize || 0.1} Lots</span>
                            </div>
                            <div className={styles.riskSumItem}>
                                <span className={styles.riskSumLabel}>Risk / Trade</span>
                                <span className={styles.riskSumVal}>{riskPerTrade || 2}%</span>
                            </div>
                            <div className={styles.riskSumItem}>
                                <span className={styles.riskSumLabel}>Max Open</span>
                                <span className={styles.riskSumVal}>{maxOpenPositions || 3} Trades</span>
                            </div>
                            <div className={styles.riskSumItem}>
                                <span className={styles.riskSumLabel}>Daily Loss Limit</span>
                                <span className={styles.riskSumVal}>{maxDailyLoss || 5}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
