'use client';

import React, { useState, useMemo } from 'react';
import styles from '../customBotBuilder.module.scss';
import { INDICATOR_DEFINITIONS, RISK_LEVELS } from '../constants';
import { formatBotStrategyPayload, validateStrategyJson } from '@/lib/botBuilderApi';
import { toast } from '@/components/toast';

export default function StepReview({
    data,
    onEditStep,
    onRunBacktest,
    onDeployBot,
    isDeploying = false,
    isSimulating = false,
    simulationResult = null,
    onOpenBacktest = null
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

    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [copied, setCopied] = useState(false);

    const currentRiskPreset = RISK_LEVELS.find(r => r.id === riskLevel) || RISK_LEVELS[1];

    // Compute canonical JSON payload and validation status
    const generatedPayload = useMemo(() => {
        try {
            return formatBotStrategyPayload(data);
        } catch (e) {
            return { error: e.message };
        }
    }, [data]);

    const jsonValidation = useMemo(() => {
        return validateStrategyJson(generatedPayload);
    }, [generatedPayload]);

    const handleCopyJson = (e) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(JSON.stringify(generatedPayload, null, 2));
            setCopied(true);
            toast.success('Strategy JSON copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (_) {
            toast.error('Failed to copy to clipboard');
        }
    };

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

            {/* Backtest Simulation Banner */}
            <div className={styles.simulationBanner}>
                <div className={styles.simBannerLeft}>
                    <div className={styles.simIconGlow}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </div>
                    <div>
                        <h4 className={styles.simTitle}>Direct Backtest Simulation</h4>
                        <p className={styles.simSub}>
                            {simulationResult
                                ? 'Simulation verified directly against historical tick data engine'
                                : 'Execute backtest engine before deployment to verify performance stats'}
                        </p>
                    </div>
                </div>

                {simulationResult ? (
                    <div className={styles.simMetricsRow}>
                        <div className={styles.simStat}>
                            <span className={styles.simStatLabel}>Win Rate</span>
                            <span className={Number(simulationResult.winRate) >= 50 ? styles.simStatValGreen : styles.simStatValRed}>
                                {Number(simulationResult.winRate).toFixed(1)}%
                            </span>
                        </div>
                        <div className={styles.simStat}>
                            <span className={styles.simStatLabel}>Total Trades</span>
                            <span className={styles.simStatVal}>{simulationResult.trades}</span>
                        </div>
                        <div className={styles.simStat}>
                            <span className={styles.simStatLabel}>Estimated PnL</span>
                            <span className={Number(simulationResult.pnl) >= 0 ? styles.simStatValGreen : styles.simStatValRed}>
                                {Number(simulationResult.pnl) >= 0 ? '+' : ''}${Number(simulationResult.pnl).toFixed(2)}
                            </span>
                        </div>
                        {onOpenBacktest && (
                            <button
                                type="button"
                                className={styles.openStudioBtn}
                                onClick={onOpenBacktest}
                            >
                                <span>Open Full Chart</span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </button>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        className={styles.backtestBtn}
                        style={{ maxWidth: '240px' }}
                        onClick={onRunBacktest}
                        disabled={isSimulating || isDeploying}
                    >
                        {isSimulating ? (
                            <span>Simulating...</span>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                <span>Run Backtest</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Strategy JSON Inspector Drawer */}
            <div className={styles.jsonInspectCard}>
                <div
                    className={styles.jsonInspectHeader}
                    onClick={() => setShowJsonPreview(prev => !prev)}
                >
                    <div className={styles.jsonHeaderTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                        <h4>Backend Strategy JSON</h4>
                        {jsonValidation.isValid ? (
                            <span className={styles.jsonBadgeValid}>Valid Contract</span>
                        ) : (
                            <span className={styles.jsonBadgeInvalid}>Validation Issues ({jsonValidation.errors.length})</span>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {showJsonPreview && (
                            <button
                                type="button"
                                className={styles.copyCodeBtn}
                                onClick={handleCopyJson}
                            >
                                {copied ? 'Copied!' : 'Copy JSON'}
                            </button>
                        )}
                        <button type="button" className={styles.jsonToggleBtn}>
                            <span>{showJsonPreview ? 'Hide Details' : 'Inspect JSON'}</span>
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                style={{ transform: showJsonPreview ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </div>

                {showJsonPreview && (
                    <div className={styles.jsonCodeContainer}>
                        <div className={styles.jsonCodeHeader}>
                            <span>Endpoint: POST /api/v1/bot-builder/strategies & Backtest Engine Payload</span>
                            <span>{jsonValidation.isValid ? 'Schema Verified' : jsonValidation.errors[0]}</span>
                        </div>
                        <pre className={styles.jsonPre}>
                            {JSON.stringify(generatedPayload, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Bottom Actions Row */}
            <div className={styles.reviewActionsRow}>
                <button
                    type="button"
                    className={styles.backtestBtn}
                    onClick={onRunBacktest}
                    disabled={isSimulating || isDeploying}
                >
                    {isSimulating ? (
                        <span>Simulating Historical Performance...</span>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <span>Run Backtest Simulation</span>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className={styles.deployBotBtn}
                    onClick={onDeployBot}
                    disabled={isDeploying || isSimulating || !jsonValidation.isValid}
                >
                    {isDeploying ? (
                        <span>Deploying to Database & Engine...</span>
                    ) : (
                        <>
                            <span>Save & Deploy Bot Strategy</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
