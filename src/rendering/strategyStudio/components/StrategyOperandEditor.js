'use client';

import React from 'react';
import styles from '../styles/strategyStudio.module.scss';
import CustomSelect from './CustomSelect';

// Fallback parameter specs for common indicators when metadata index is loading
const FALLBACK_SPECS = {
    close: { params: [], hint: 'Bar close price' },
    open: { params: [], hint: 'Bar open price' },
    high: { params: [], hint: 'Bar high price' },
    low: { params: [], hint: 'Bar low price' },
    volume: { params: [], hint: 'Bar volume' },
    number: {
        params: [{ name: 'value', label: 'Value', type: 'float', default: 0 }],
        hint: 'Constant number value',
    },
    sma: {
        params: [{ name: 'timeperiod', label: 'Period', type: 'int', default: 14, min: 1 }],
        hint: 'Simple Moving Average',
    },
    ema: {
        params: [{ name: 'timeperiod', label: 'Period', type: 'int', default: 14, min: 1 }],
        hint: 'Exponential Moving Average',
    },
    wma: {
        params: [{ name: 'timeperiod', label: 'Period', type: 'int', default: 14, min: 1 }],
        hint: 'Weighted Moving Average',
    },
    dema: {
        params: [{ name: 'timeperiod', label: 'Period', type: 'int', default: 14, min: 1 }],
        hint: 'Double Exponential Moving Average',
    },
    rsi: {
        params: [{ name: 'timeperiod', label: 'Period', type: 'int', default: 14, min: 1, max: 100 }],
        hint: 'Relative Strength Index',
    },
    atr: {
        params: [{ name: 'timeperiod', label: 'Period', type: 'int', default: 14, min: 1 }],
        hint: 'Average True Range',
    },
    macd: {
        params: [
            { name: 'fastperiod', label: 'Fast Period', type: 'int', default: 12, min: 1 },
            { name: 'slowperiod', label: 'Slow Period', type: 'int', default: 26, min: 1 },
            { name: 'signalperiod', label: 'Signal Period', type: 'int', default: 9, min: 1 },
        ],
        hint: 'MACD line',
    },
    bbands: {
        params: [
            { name: 'timeperiod', label: 'Period', type: 'int', default: 20, min: 1 },
            { name: 'nbdevup', label: 'Std Dev Up', type: 'float', default: 2 },
            { name: 'nbdevdn', label: 'Std Dev Down', type: 'float', default: 2 },
        ],
        hint: 'Bollinger Bands',
    },
    stoch: {
        params: [
            { name: 'fastk_period', label: '%K Period', type: 'int', default: 14, min: 1 },
            { name: 'slowk_period', label: 'Slow %K', type: 'int', default: 3, min: 1 },
            { name: 'slowd_period', label: 'Slow %D', type: 'int', default: 3, min: 1 },
        ],
        hint: 'Stochastic Oscillator',
    },
};

const DEFAULT_INDICATOR_GROUPS = [
    {
        group: 'Price',
        indicators: [
            { name: 'close', label: 'Close Price' },
            { name: 'open', label: 'Open Price' },
            { name: 'high', label: 'High Price' },
            { name: 'low', label: 'Low Price' },
            { name: 'volume', label: 'Volume' },
            { name: 'number', label: 'Constant Number' },
        ],
    },
    {
        group: 'Moving Averages & Trend',
        indicators: [
            { name: 'sma', label: 'SMA (Simple Moving Average)' },
            { name: 'ema', label: 'EMA (Exponential Moving Average)' },
            { name: 'wma', label: 'WMA (Weighted Moving Average)' },
            { name: 'dema', label: 'DEMA (Double Exponential Moving Average)' },
            { name: 'macd', label: 'MACD' },
        ],
    },
    {
        group: 'Momentum & Oscillators',
        indicators: [
            { name: 'rsi', label: 'RSI (Relative Strength Index)' },
            { name: 'stoch', label: 'Stochastic Oscillator' },
        ],
    },
    {
        group: 'Volatility & Bands',
        indicators: [
            { name: 'atr', label: 'ATR (Average True Range)' },
            { name: 'bbands', label: 'Bollinger Bands' },
        ],
    },
];

export function getDefaultParamsForIndicator(indicatorSpec) {
    const params = {};
    if (!indicatorSpec?.params) return params;
    indicatorSpec.params.forEach((p) => {
        params[p.name] = p.default;
    });
    return params;
}

export default function StrategyOperandEditor({
    operand,
    indicatorGroups = [],
    indIndex = {},
    onChange,
}) {
    if (!operand) return null;

    const currentName = operand.name || 'close';
    const spec = indIndex[currentName] || FALLBACK_SPECS[currentName] || { params: [], hint: '' };
    const currentParams = operand.parameters || {};

    // Build effective groups (from metadata or default catalog)
    let effectiveGroups = indicatorGroups && indicatorGroups.length > 0
        ? indicatorGroups
        : DEFAULT_INDICATOR_GROUPS;

    // Ensure the current indicator is present in the options
    const allKnownNames = effectiveGroups.flatMap((g) => (g.indicators || []).map((i) => i.name));
    if (!allKnownNames.includes(currentName)) {
        effectiveGroups = [
            {
                group: 'Current Selection',
                indicators: [{ name: currentName, label: currentName.toUpperCase() }],
            },
            ...effectiveGroups,
        ];
    }

    const handleIndicatorChange = (e) => {
        const nextName = e.target.value;
        const nextSpec = indIndex[nextName] || FALLBACK_SPECS[nextName];
        const nextParams = getDefaultParamsForIndicator(nextSpec);
        onChange({
            ...operand,
            name: nextName,
            parameters: nextParams,
        });
    };

    const handleParamChange = (pName, pType, pDefault, rawValue) => {
        let val = rawValue;
        if (pType === 'int') {
            val = parseInt(rawValue, 10);
            if (isNaN(val)) val = pDefault ?? 0;
        } else if (pType === 'float') {
            val = parseFloat(rawValue);
            if (isNaN(val)) val = pDefault ?? 0;
        } else if (pType === 'select') {
            val = /^-?\d+$/.test(rawValue) ? parseInt(rawValue, 10) : rawValue;
        }

        onChange({
            ...operand,
            parameters: {
                ...currentParams,
                [pName]: val,
            },
        });
    };

    // Combine spec params + any extra custom keys in currentParams
    const specParamNames = (spec.params || []).map((p) => p.name);
    const extraParamKeys = Object.keys(currentParams).filter((k) => !specParamNames.includes(k));

    return (
        <div className={styles.operandWrap}>
            {/* Grouped Indicator Select */}
            <div style={{ marginBottom: '8px' }}>
                <CustomSelect
                    value={currentName}
                    onChange={(val) => {
                        const nextSpec = indIndex[val] || FALLBACK_SPECS[val];
                        const nextParams = getDefaultParamsForIndicator(nextSpec);
                        onChange({
                            ...operand,
                            name: val,
                            parameters: nextParams,
                        });
                    }}
                    groups={effectiveGroups}
                    searchable={true}
                    width="100%"
                />
            </div>

            {/* Dynamic Params Based on Indicator Spec */}
            {((spec.params && spec.params.length > 0) || extraParamKeys.length > 0) && (
                <div className={styles.paramsRow}>
                    {spec.params?.map((p) => {
                        const val = currentParams[p.name] ?? p.default;
                        if (p.type === 'select') {
                            const options = (p.options || []).map((o) =>
                                typeof o === 'object' ? o : { value: o, label: String(o) }
                            );
                            return (
                                <label key={p.name}>
                                    <span>{p.label || p.name}</span>
                                    <CustomSelect
                                        value={val ?? ''}
                                        onChange={(selectedVal) =>
                                            handleParamChange(p.name, p.type, p.default, selectedVal)
                                        }
                                        options={options}
                                        width="120px"
                                    />
                                </label>
                            );
                        }

                        const step = p.type === 'int' ? '1' : 'any';
                        return (
                            <label key={p.name}>
                                <span>{p.label || p.name}</span>
                                <input
                                    type="number"
                                    step="any"
                                    min={p.min}
                                    max={p.max}
                                    value={val ?? ''}
                                    onChange={(e) =>
                                        handleParamChange(p.name, p.type, p.default, e.target.value)
                                    }
                                />
                            </label>
                        );
                    })}

                    {/* Any extra custom parameters from strategy */}
                    {extraParamKeys.map((k) => (
                        <label key={k}>
                            <span>{k}</span>
                            <input
                                type={typeof currentParams[k] === 'number' ? 'number' : 'text'}
                                step="any"
                                value={currentParams[k] ?? ''}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    const isNum = typeof currentParams[k] === 'number' || !isNaN(Number(raw));
                                    handleParamChange(k, isNum ? 'float' : 'string', 0, raw);
                                }}
                            />
                        </label>
                    ))}
                </div>
            )}

            {spec.hint ? <div className={styles.fieldHint}>{spec.hint}</div> : null}
        </div>
    );
}
