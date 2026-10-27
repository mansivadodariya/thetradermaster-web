'use client';

import React, { useMemo } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import {
    CpuChipIcon,
    EditPencilIcon,
    RocketRunIcon,
    ShieldCheckIcon,
    ClockIntervalIcon,
    CoinsCapitalIcon,
    CalendarDateIcon,
    SparklesMiniIcon,
} from './StudioIcons';

function formatIndicator(ind) {
    if (!ind) return '—';
    if (typeof ind === 'string' || typeof ind === 'number') return String(ind);
    if (ind.value !== undefined) return `Value: ${ind.value}`;
    const name = (ind.name || 'Indicator').toUpperCase();
    if (ind.parameters && Object.keys(ind.parameters).length > 0) {
        const paramStr = Object.entries(ind.parameters)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
        return { name, paramStr };
    }
    return { name, paramStr: '' };
}

function formatOperator(op) {
    if (!op) return 'MATCHES';
    const clean = String(op).toLowerCase().trim();
    const map = {
        crossover: 'Crosses Above',
        crossunder: 'Crosses Below',
        '>': 'Greater Than (>)',
        '<': 'Less Than (<)',
        '>=': 'Greater / Equal (>=)',
        '<=': 'Less / Equal (<=)',
        '==': 'Equals (==)',
        '!=': 'Not Equal (!=)',
    };
    return map[clean] || op.toUpperCase();
}

export default function StrategySpecCard({
    strategy = {},
    summary = null,
    onOpenModifyForm,
    onRunBacktest,
    busy = false,
    isFormOpen = false,
}) {
    const title = strategy?.strategy_name || summary?.title || 'Configured Strategy';
    const symbol = (Array.isArray(strategy?.stock_name) ? strategy.stock_name[0] : strategy?.stock_name) || summary?.market?.pair || 'XAUUSD';
    const timeframe = strategy?.interval || strategy?.timeframe || summary?.market?.timeframe || '15min';
    const capital = strategy?.inital_capital || strategy?.capital || 10000;
    const quantity = strategy?.quantity || 0.01;
    const sizingMode = strategy?.sizing_mode || 'lots';
    const isMis = Boolean(strategy?.is_mis);
    const dataProvider = strategy?.data_provider || 'DB';

    const fromDate = strategy?.from_date || '2026-04-25';
    const toDate = strategy?.to_date || '2026-10-21';

    const entryConditions = strategy?.entry_conditions || {};
    const rules = Array.isArray(entryConditions.rules) ? entryConditions.rules : [];
    const conditionType = entryConditions.condition_type || 'all';
    const windowStart = entryConditions.entry_start_time || '00:00';
    const windowEnd = entryConditions.entry_end_time || '23:59';

    const exitConditions = strategy?.exit_conditions || {};
    const stoploss = exitConditions.stoploss ?? (summary?.risk?.stop_loss || 20);
    const stoplossType = exitConditions.stoploss_type || 'points';
    const target = exitConditions.target ?? (summary?.risk?.take_profit || 40);
    const targetType = exitConditions.target_type || 'points';
    const trailingSl = Boolean(exitConditions.trailing_stoploss);

    // Direction label
    const directionLabel = useMemo(() => {
        if (strategy?.entry_type === 1) return 'Long Only';
        if (strategy?.entry_type === 2) return 'Short Only';
        return 'Long & Short';
    }, [strategy?.entry_type]);

    return (
        <div className={styles.strategySpecCard}>
            {/* Header: Title, Metadata, and Primary Action Buttons */}
            <div className={styles.strategySpecHeader}>
                <div className={styles.strategySpecHeaderLeft}>
                    <div className={styles.strategySpecIcon}>
                        <CpuChipIcon size={20} color="#18c98b" />
                    </div>
                    <div className={styles.strategySpecTitleWrap}>
                        <div className={styles.strategySpecTitle}>{title}</div>
                        <div className={styles.strategySpecMeta}>
                            <span>{symbol}</span>
                            <span>•</span>
                            <span>{timeframe}</span>
                            <span>•</span>
                            <span className={styles.strategySpecReadyBadge}>
                                <span className={styles.strategySpecPulseDot} />
                                Ready to Run
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.strategySpecActions}>
                    <button
                        type="button"
                        className={styles.btnGhostAction}
                        style={{ padding: '7px 14px', fontSize: '12.5px' }}
                        onClick={() => onOpenModifyForm?.()}
                        title="Open strategy modification side-by-side with chat"
                    >
                        <EditPencilIcon size={14} color="currentColor" />
                        <span>{isFormOpen ? 'Modify Strategy (Active)' : 'Modify Strategy'}</span>
                    </button>

                    <button
                        type="button"
                        className={styles.btnPrimaryAction}
                        style={{ padding: '7px 16px', fontSize: '12.5px' }}
                        onClick={() => onRunBacktest?.()}
                        disabled={busy}
                    >
                        <RocketRunIcon size={14} color="currentColor" />
                        <span>Run Backtest</span>
                    </button>
                </div>
            </div>

            {/* 4-Column Key Metrics / Parameters Grid */}
            <div className={styles.specOverviewGrid}>
                {/* 1. Target Market */}
                <div className={styles.specMetricCard}>
                    <div className={styles.specMetricTop}>
                        <span className={styles.specMetricLabel}>Target Market</span>
                        <CpuChipIcon size={13} color="#18c98b" />
                    </div>
                    <div className={styles.specMetricValue}>{symbol}</div>
                    <div className={styles.specMetricSub}>
                        <span>{dataProvider} Feed</span>
                        <span>•</span>
                        <span>{isMis ? 'Intraday (MIS)' : 'Positional'}</span>
                    </div>
                </div>

                {/* 2. Timeframe & Interval */}
                <div className={styles.specMetricCard}>
                    <div className={styles.specMetricTop}>
                        <span className={styles.specMetricLabel}>Timeframe</span>
                        <ClockIntervalIcon size={13} color="#18c98b" />
                    </div>
                    <div className={styles.specMetricValue}>{timeframe}</div>
                    <div className={styles.specMetricSub}>
                        <span>Window: {windowStart}–{windowEnd}</span>
                    </div>
                </div>

                {/* 3. Capital & Lot Size */}
                <div className={styles.specMetricCard}>
                    <div className={styles.specMetricTop}>
                        <span className={styles.specMetricLabel}>Capital & Sizing</span>
                        <CoinsCapitalIcon size={13} color="#18c98b" />
                    </div>
                    <div className={styles.specMetricValue}>
                        ${Number(capital).toLocaleString()}
                    </div>
                    <div className={styles.specMetricSub}>
                        <span>{quantity} {sizingMode}</span>
                        <span>•</span>
                        <span>{directionLabel}</span>
                    </div>
                </div>

                {/* 4. Backtest Period */}
                <div className={styles.specMetricCard}>
                    <div className={styles.specMetricTop}>
                        <span className={styles.specMetricLabel}>Date Window</span>
                        <CalendarDateIcon size={13} color="#18c98b" />
                    </div>
                    <div className={styles.specMetricValue} style={{ fontSize: '13px' }}>
                        {fromDate}
                    </div>
                    <div className={styles.specMetricSub}>
                        <span>Until {toDate}</span>
                    </div>
                </div>
            </div>

            {/* Section: Entry Trigger Conditions & Rules Flow */}
            <div className={styles.specSectionBlock}>
                <div className={styles.specSectionHeader}>
                    <div className={styles.specSectionTitleWrap}>
                        <SparklesMiniIcon size={14} color="#18c98b" />
                        <span className={styles.specSectionTitle}>Entry Conditions & Triggers</span>
                    </div>
                    <span className={styles.specLogicBadge}>
                        Logic: {conditionType === 'all' ? 'Match ALL Conditions (AND)' : 'Match ANY Condition (OR)'}
                    </span>
                </div>

                <div className={styles.specRulesList}>
                    {rules.length > 0 ? (
                        rules.map((r, i) => {
                            const ind1 = formatIndicator(r.indicator1);
                            const ind2 = formatIndicator(r.indicator2);
                            const opText = formatOperator(r.operator);

                            return (
                                <div key={i} className={styles.specRuleFlowCard}>
                                    <div className={styles.specRuleFlowLeft}>
                                        {/* Left Indicator */}
                                        <div className={styles.specIndicatorPill}>
                                            <span>{typeof ind1 === 'string' ? ind1 : ind1.name}</span>
                                            {typeof ind1 === 'object' && ind1.paramStr && (
                                                <span className={styles.paramSub}>({ind1.paramStr})</span>
                                            )}
                                        </div>

                                        {/* Operator Badge */}
                                        <div className={styles.specOperatorBadge}>
                                            <span>{opText}</span>
                                        </div>

                                        {/* Right Indicator / Value */}
                                        <div className={styles.specIndicatorPill}>
                                            <span>{typeof ind2 === 'string' ? ind2 : ind2.name}</span>
                                            {typeof ind2 === 'object' && ind2.paramStr && (
                                                <span className={styles.paramSub}>({ind2.paramStr})</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.specRuleEditBtn}
                                        onClick={() => onOpenModifyForm?.()}
                                        title="Edit rule parameters in form"
                                    >
                                        <EditPencilIcon size={11} color="currentColor" />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Momentum trigger configured from prompt exploration.</span>
                            <button
                                type="button"
                                className={styles.specRuleEditBtn}
                                onClick={() => onOpenModifyForm?.()}
                            >
                                + Add Rule
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Section: Risk & Exit Safeguards (Stop Loss & Take Profit) */}
            <div className={styles.specRiskGrid}>
                {/* Stop Loss Card */}
                <div className={`${styles.specRiskCard} ${styles.riskSlCard}`}>
                    <div className={styles.specRiskHeader}>
                        <div className={styles.specRiskTitle}>
                            <ShieldCheckIcon size={14} color="#f59e0b" />
                            <span>Stop Loss Protection</span>
                        </div>
                        <span style={{ fontSize: '10.5px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>
                            Risk Limit
                        </span>
                    </div>
                    <div className={styles.specRiskValue}>
                        {stoploss} {stoplossType}
                    </div>
                    <div className={styles.specRiskDesc}>
                        {trailingSl ? 'Dynamic trailing stop loss active' : 'Fixed stop loss protection per trade'}
                    </div>
                </div>

                {/* Take Profit Target Card */}
                <div className={`${styles.specRiskCard} ${styles.riskTpCard}`}>
                    <div className={styles.specRiskHeader}>
                        <div className={styles.specRiskTitle}>
                            <RocketRunIcon size={14} color="#18c98b" />
                            <span>Take Profit Target</span>
                        </div>
                        <span style={{ fontSize: '10.5px', color: '#18c98b', fontWeight: 700, textTransform: 'uppercase' }}>
                            Target Exit
                        </span>
                    </div>
                    <div className={styles.specRiskValue}>
                        {target} {targetType}
                    </div>
                    <div className={styles.specRiskDesc}>
                        {stoploss && target && !isNaN(Number(target)) && !isNaN(Number(stoploss)) && Number(stoploss) > 0 ? (
                            <span>Expected Reward-to-Risk: 1 : {(Number(target) / Number(stoploss)).toFixed(1)} R:R</span>
                        ) : (
                            <span>Automated take-profit objective</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Utility Status Bar */}
            <div className={styles.specBottomActions}>
                <span style={{ fontSize: '11.5px', color: '#18c98b', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <SparklesMiniIcon size={13} color="#18c98b" />
                    <span>Strategy ready for backtesting simulation</span>
                </span>

                <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Click &quot;Run Backtest&quot; to simulate performance
                </span>
            </div>
        </div>
    );
}
