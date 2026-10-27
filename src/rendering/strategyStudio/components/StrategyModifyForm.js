'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import StrategyRulesEditor from './StrategyRulesEditor';
import CustomSelect from './CustomSelect';
import { UploadFileIcon } from './StudioIcons';

// Date helpers to enforce max 1-year range
function addOneYear(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!y || !m || !d) return '';
    const targetDay = (m === 2 && d === 29) ? 28 : d;
    const nextYear = y + 1;
    return `${nextYear}-${String(m).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
}

function subtractOneYear(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!y || !m || !d) return '';
    const targetDay = (m === 2 && d === 29) ? 28 : d;
    const prevYear = y - 1;
    return `${prevYear}-${String(m).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
}

function getDaysDiff(fromStr, toStr) {
    if (!fromStr || !toStr) return 0;
    const [y1, m1, d1] = fromStr.split('-').map(Number);
    const [y2, m2, d2] = toStr.split('-').map(Number);
    if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 0;
    const from = Date.UTC(y1, m1 - 1, d1);
    const to = Date.UTC(y2, m2 - 1, d2);
    return (to - from) / (1000 * 60 * 60 * 24);
}

export default function StrategyModifyForm({
    initialStrategy,
    metadata,
    indIndex = {},
    formErrors = [],
    busy = false,
    onSave,
    onCancel,
}) {
    const [dateError, setDateError] = useState('');
    const [draft, setDraft] = useState(() => {
        const base = structuredClone(initialStrategy || {});
        if (!base.entry_conditions) {
            base.entry_conditions = {
                entry_start_time: '00:00',
                entry_end_time: '23:59',
                condition_type: 'all',
                rules: [],
            };
        }
        if (!base.exit_conditions) {
            base.exit_conditions = {
                target: null,
                target_type: 'points',
                stoploss: null,
                stoploss_type: 'points',
                atr_length: 14,
                trailing_stoploss: false,
                condition_type: 'any',
                rules: [],
            };
        }
        return base;
    });

    useEffect(() => {
        if (initialStrategy && Object.keys(initialStrategy).length > 0) {
            const base = structuredClone(initialStrategy);
            if (!base.entry_conditions) {
                base.entry_conditions = {
                    entry_start_time: '00:00',
                    entry_end_time: '23:59',
                    condition_type: 'all',
                    rules: [],
                };
            }
            if (!base.exit_conditions) {
                base.exit_conditions = {
                    target: null,
                    target_type: 'points',
                    stoploss: null,
                    stoploss_type: 'points',
                    atr_length: 14,
                    trailing_stoploss: false,
                    condition_type: 'any',
                    rules: [],
                };
            }
            setDraft(base);
        }
    }, [initialStrategy]);

    // Resolve metadata - handle different API response shapes with complete fallbacks
    const rawMeta = metadata || {};
    const defaultPairs = [
        { symbol: 'EURUSD', label: 'EUR/USD' },
        { symbol: 'GBPUSD', label: 'GBP/USD' },
        { symbol: 'EURJPY', label: 'EUR/JPY' },
        { symbol: 'GBPJPY', label: 'GBP/JPY' },
        { symbol: 'USDCAD', label: 'USD/CAD' },
        { symbol: 'XAUUSD', label: 'XAU/USD (Gold)' },
    ];
    const defaultTfs = ['1min', '5min', '15min', '30min', '60min', '1day'];
    const defaultDirs = [
        { value: 0, label: 'Long / Buy' },
        { value: 1, label: 'Short / Sell' },
    ];
    const defaultExitTypes = [
        { value: 'points', label: 'Points (broker points)' },
        { value: 'pips', label: 'Pips' },
        { value: 'percent', label: '% of entry price' },
        { value: 'atr', label: 'x ATR (multiple of ATR)' },
        { value: 'dollar', label: '$ per lot' },
    ];
    const defaultCondTypes = [
        { value: 'all', label: 'ALL rules must be true (AND)' },
        { value: 'any', label: 'ANY rule can be true (OR)' },
    ];
    const defaultOps = [
        { value: 'crossover', label: 'crosses above' },
        { value: 'crossdown', label: 'crosses below' },
        { value: '>', label: 'is greater than (>)' },
        { value: '>=', label: 'is greater than or equal to (>=)' },
        { value: '<', label: 'is less than (<)' },
        { value: '<=', label: 'is less than or equal to (<=)' },
        { value: '==', label: 'equals (==)' },
    ];

    const m = {
        pairs: (rawMeta.pairs?.length ? rawMeta.pairs : rawMeta.data?.pairs) || defaultPairs,
        timeframes: (rawMeta.timeframes?.length ? rawMeta.timeframes : rawMeta.data?.timeframes) || defaultTfs,
        directions: (rawMeta.directions?.length ? rawMeta.directions : rawMeta.data?.directions) || defaultDirs,
        exit_value_types: (rawMeta.exit_value_types?.length ? rawMeta.exit_value_types : rawMeta.data?.exit_value_types) || defaultExitTypes,
        condition_types: (rawMeta.condition_types?.length ? rawMeta.condition_types : rawMeta.data?.condition_types) || defaultCondTypes,
        operators: (rawMeta.operators?.length ? rawMeta.operators : rawMeta.data?.operators) || defaultOps,
        indicator_groups: rawMeta.indicator_groups || rawMeta.data?.indicator_groups || [],
    };

    const en = draft.entry_conditions;
    const ex = draft.exit_conditions;

    const pairOpts = (m.pairs || []).map((p) => ({ value: p.symbol, label: p.label || p.symbol }));
    const tfOpts = (m.timeframes || []).map((t) => ({ value: t, label: t }));

    // Extract current pair safely (string or array)
    const currentPair = Array.isArray(draft.stock_name)
        ? (draft.stock_name[0] || '')
        : (draft.stock_name || draft.symbol || draft.instrument || '');
    const hasPairInOpts = !currentPair || pairOpts.some((p) => p.value === currentPair);
    if (!hasPairInOpts) {
        pairOpts.unshift({ value: currentPair, label: currentPair });
    }

    const currentTf = draft.interval || draft.timeframe || '';
    const hasTfInOpts = !currentTf || tfOpts.some((t) => t.value === currentTf);
    if (!hasTfInOpts) {
        tfOpts.unshift({ value: currentTf, label: currentTf });
    }

    const directionOpts = [...(m.directions || [])];
    let currentDir = draft.entry_type;
    if (typeof currentDir === 'string') {
        const lower = currentDir.toLowerCase();
        if (lower === 'buy' || lower === 'long' || lower === '0') currentDir = 0;
        else if (lower === 'sell' || lower === 'short' || lower === '1') currentDir = 1;
    }
    const hasDirInOpts = currentDir == null || directionOpts.some((d) => String(d.value) === String(currentDir));
    if (!hasDirInOpts) {
        const dirLabel = currentDir === 0 ? 'Long / Buy' : currentDir === 1 ? 'Short / Sell' : `Direction ${currentDir}`;
        directionOpts.unshift({ value: currentDir, label: dirLabel });
    }

    const handleFieldChange = (key, val) => {
        setDraft((prev) => ({
            ...prev,
            [key]: val,
        }));
    };

    const handleFromDateChange = (newVal) => {
        const fromVal = newVal || null;
        let toVal = draft.to_date;
        if (fromVal && toVal) {
            const diff = getDaysDiff(fromVal, toVal);
            if (diff < 0) {
                // If From Date is after To Date, move To Date to 1 year ahead
                toVal = addOneYear(fromVal);
            } else if (diff > 366) {
                // Maximum range is 1 year -> clamp To Date
                toVal = addOneYear(fromVal);
            }
        }
        setDateError('');
        setDraft((prev) => ({
            ...prev,
            from_date: fromVal,
            to_date: toVal,
        }));
    };

    const handleToDateChange = (newVal) => {
        const toVal = newVal || null;
        let fromVal = draft.from_date;
        if (toVal && fromVal) {
            const diff = getDaysDiff(fromVal, toVal);
            if (diff < 0) {
                // If To Date is before From Date, move From Date to 1 year before
                fromVal = subtractOneYear(toVal);
            } else if (diff > 366) {
                // Maximum range is 1 year -> clamp From Date
                fromVal = subtractOneYear(toVal);
            }
        }
        setDateError('');
        setDraft((prev) => ({
            ...prev,
            from_date: fromVal,
            to_date: toVal,
        }));
    };

    const handleEntryChange = (updatedEntry) => {
        setDraft((prev) => ({
            ...prev,
            entry_conditions: updatedEntry,
        }));
    };

    const handleExitChange = (updatedExit) => {
        setDraft((prev) => ({
            ...prev,
            exit_conditions: updatedExit,
        }));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        if (draft.from_date && draft.to_date) {
            const diff = getDaysDiff(draft.from_date, draft.to_date);
            if (diff < 0) {
                setDateError('To Date cannot be earlier than From Date.');
                return;
            }
            if (diff > 366) {
                setDateError('Date range cannot exceed 1 year (max 366 days).');
                return;
            }
        }
        setDateError('');
        const cleanedExit = {
            ...(draft.exit_conditions || {}),
            atr_length: (draft.exit_conditions?.atr_length !== '' && draft.exit_conditions?.atr_length != null && !isNaN(Number(draft.exit_conditions?.atr_length)))
                ? Number(draft.exit_conditions.atr_length)
                : 14,
        };
        const cleanedDraft = {
            ...draft,
            exit_conditions: cleanedExit,
            inital_capital: (draft.inital_capital !== '' && draft.inital_capital != null && !isNaN(Number(draft.inital_capital)))
                ? Number(draft.inital_capital)
                : 10000,
            quantity: (draft.quantity !== '' && draft.quantity != null && !isNaN(Number(draft.quantity)))
                ? Number(draft.quantity)
                : 0.01,
        };
        onSave(cleanedDraft);
    };

    return (
        <form className={styles.copilotCard} onSubmit={handleSubmit} noValidate>
            <div className={styles.cardHeaderRow}>
                <h2 className={styles.cardTitle}>Modify Strategy</h2>
            </div>

            {/* General & Market Parameters */}
            <div className={styles.formGrid}>
                <div className={styles.formField} style={{ gridColumn: '1 / -1' }}>
                    <label>Strategy Name</label>
                    <input
                        type="text"
                        value={draft.strategy_name || ''}
                        onChange={(e) => handleFieldChange('strategy_name', e.target.value || null)}
                        placeholder="My Momentum Strategy"
                    />
                </div>

                <div className={styles.formField}>
                    <label>Pair</label>
                    <CustomSelect
                        value={currentPair}
                        onChange={(val) =>
                            handleFieldChange('stock_name', val ? [val] : null)
                        }
                        options={pairOpts}
                        placeholder="Select pair"
                        width="100%"
                    />
                </div>

                <div className={styles.formField}>
                    <label>Timeframe</label>
                    <CustomSelect
                        value={currentTf}
                        onChange={(val) => handleFieldChange('interval', val || null)}
                        options={tfOpts}
                        placeholder="Select timeframe"
                        width="100%"
                    />
                </div>

                <div className={styles.formField}>
                    <label>From Date</label>
                    <input
                        type="date"
                        value={draft.from_date || ''}
                        min={draft.to_date ? subtractOneYear(draft.to_date) : undefined}
                        max={draft.to_date || undefined}
                        onChange={(e) => handleFromDateChange(e.target.value)}
                    />
                </div>

                <div className={styles.formField}>
                    <label>To Date</label>
                    <input
                        type="date"
                        value={draft.to_date || ''}
                        min={draft.from_date || undefined}
                        max={draft.from_date ? addOneYear(draft.from_date) : undefined}
                        onChange={(e) => handleToDateChange(e.target.value)}
                    />
                </div>

                {dateError && (
                    <div style={{ gridColumn: '1 / -1', color: '#ef4444', fontSize: '12px', fontWeight: 600, marginTop: '-4px' }}>
                        {dateError}
                    </div>
                )}

                <div className={styles.formField}>
                    <label>Direction</label>
                    <CustomSelect
                        value={currentDir != null ? currentDir : ''}
                        onChange={(val) =>
                            handleFieldChange(
                                'entry_type',
                                val === '' ? null : parseInt(val, 10)
                            )
                        }
                        options={directionOpts}
                        placeholder="Select direction"
                        width="100%"
                    />
                </div>

                <div className={styles.formField}>
                    <label>Lots (Quantity)</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.01"
                        value={draft.quantity ?? ''}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            handleFieldChange('quantity', val === '' ? '' : val);
                        }}
                    />
                </div>

                <div className={styles.formField}>
                    <label>Initial Capital ($)</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        placeholder="10000"
                        value={draft.inital_capital ?? ''}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            handleFieldChange('inital_capital', val === '' ? '' : val);
                        }}
                    />
                </div>

                <div className={styles.formField}>
                    <label>Close At Day End</label>
                    <CustomSelect
                        value={draft.is_mis ? 'true' : 'false'}
                        onChange={(val) => handleFieldChange('is_mis', val === 'true')}
                        options={[
                            { value: 'false', label: 'No' },
                            { value: 'true', label: 'Yes' },
                        ]}
                        width="100%"
                    />
                </div>

                <div className={styles.formField}>
                    <label>Entry Window Start</label>
                    <input
                        type="time"
                        value={en?.entry_start_time || '00:00'}
                        onChange={(e) =>
                            handleEntryChange({ ...en, entry_start_time: e.target.value })
                        }
                    />
                </div>

                <div className={styles.formField}>
                    <label>Entry Window End</label>
                    <input
                        type="time"
                        value={en?.entry_end_time || '23:59'}
                        onChange={(e) =>
                            handleEntryChange({ ...en, entry_end_time: e.target.value })
                        }
                    />
                </div>
            </div>

            {/* Entry Rules Section */}
            <StrategyRulesEditor
                title="Entry Rules"
                conditions={en}
                isExit={false}
                conditionTypes={m.condition_types}
                operators={m.operators}
                indicatorGroups={m.indicator_groups}
                indIndex={indIndex}
                onChange={handleEntryChange}
            />

            {/* Exit Section: TP / SL / ATR / Trailing */}
            <div className={styles.sectionSubheader} style={{ marginTop: '20px' }}>Exit Safeguards — Take Profit & Stop Loss</div>
            <div className={styles.formGrid}>
                <div className={styles.formField}>
                    <label>Take Profit (blank = off)</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Off"
                        value={ex?.target ?? ''}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            handleExitChange({
                                ...ex,
                                target: val === '' ? null : parseFloat(val),
                            });
                        }}
                    />
                </div>

                <div className={styles.formField}>
                    <label>TP Unit</label>
                    <CustomSelect
                        value={ex?.target_type || 'points'}
                        onChange={(val) => handleExitChange({ ...ex, target_type: val })}
                        options={m.exit_value_types}
                        width="100%"
                    />
                </div>

                <div className={styles.formField}>
                    <label>Stop Loss (blank = off)</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Off"
                        value={ex?.stoploss ?? ''}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            handleExitChange({
                                ...ex,
                                stoploss: val === '' ? null : parseFloat(val),
                            });
                        }}
                    />
                </div>

                <div className={styles.formField}>
                    <label>SL Unit</label>
                    <CustomSelect
                        value={ex?.stoploss_type || 'points'}
                        onChange={(val) => handleExitChange({ ...ex, stoploss_type: val })}
                        options={m.exit_value_types}
                        width="100%"
                    />
                </div>

                <div className={styles.formField}>
                    <label>ATR Length (for ATR units)</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="14"
                        value={ex?.atr_length ?? 14}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            handleExitChange({
                                ...ex,
                                atr_length: val === '' ? '' : parseInt(val, 10),
                            });
                        }}
                    />
                </div>

                <div className={styles.formField}>
                    <label>Trailing Stop</label>
                    <CustomSelect
                        value={ex?.trailing_stoploss ? 'true' : 'false'}
                        onChange={(val) =>
                            handleExitChange({
                                ...ex,
                                trailing_stoploss: val === 'true',
                            })
                        }
                        options={[
                            { value: 'false', label: 'No' },
                            { value: 'true', label: 'Yes' },
                        ]}
                        width="100%"
                    />
                </div>
            </div>

            {/* Exit Indicator Rules Section */}
            <StrategyRulesEditor
                title="Indicator Exit Rules (Optional)"
                conditions={ex}
                isExit={true}
                target={ex?.target}
                targetType={ex?.target_type}
                stoploss={ex?.stoploss}
                stoplossType={ex?.stoploss_type}
                conditionTypes={m.condition_types}
                operators={m.operators}
                indicatorGroups={m.indicator_groups}
                indIndex={indIndex}
                onChange={handleExitChange}
            />

            {/* Form Validation Errors */}
            {formErrors && formErrors.length > 0 && (
                <div className={styles.validationErrors}>
                    <strong>Please fix the following:</strong>
                    <ul>
                        {formErrors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div className={styles.cardActions}>
                <button
                    type="submit"
                    className={styles.btnPrimaryAction}
                    disabled={busy}
                >
                    {busy ? (
                        <span>Saving…</span>
                    ) : (
                        <>
                            <UploadFileIcon size={14} color="#ffffff" />
                            <span>Save strategy</span>
                        </>
                    )}
                </button>
                <button
                    type="button"
                    className={styles.btnGhostAction}
                    onClick={onCancel}
                    disabled={busy}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
