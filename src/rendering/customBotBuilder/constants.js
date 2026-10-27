export const getSteps = (t) => [
    { id: 1, label: t ? t('botBuilder.steps.basics', 'Basics') : 'Basics', icon: 'sliders' },
    { id: 2, label: t ? t('botBuilder.steps.entryRules', 'Entry Rules') : 'Entry Rules', icon: 'pulse' },
    { id: 3, label: t ? t('botBuilder.steps.exitRules', 'Exit Rules') : 'Exit Rules', icon: 'target' },
    { id: 4, label: t ? t('botBuilder.steps.risk', 'Risk') : 'Risk', icon: 'shield' },
    { id: 5, label: t ? t('botBuilder.steps.review', 'Review') : 'Review', icon: 'eye' }
];

export const STEPS = getSteps(null);

export const TRADING_PAIRS = [
    { value: 'XAU/USD', label: 'XAU/USD (Gold)', category: 'Commodities' },
    { value: 'EUR/USD', label: 'EUR/USD', category: 'Forex' },
    { value: 'GBP/USD', label: 'GBP/USD', category: 'Forex' },
    { value: 'GBP/JPY', label: 'GBP/JPY', category: 'Forex' },
    { value: 'EUR/JPY', label: 'EUR/JPY', category: 'Forex' },
    { value: 'USD/CAD', label: 'USD/CAD', category: 'Forex' }
];

export const getTimeframes = (t) => [
    { value: '5m', label: t ? t('botBuilder.timeframes.m5', '5 Minutes (M5)') : '5 Minutes (M5)' },
    { value: '15m', label: t ? t('botBuilder.timeframes.m15', '15 Minutes (M15)') : '15 Minutes (M15)' },
    { value: '1h', label: t ? t('botBuilder.timeframes.h1', '1 Hour (H1)') : '1 Hour (H1)' },
    { value: '1d', label: t ? t('botBuilder.timeframes.d1', '1 Day (D1)') : '1 Day (D1)' }
];

export const TIMEFRAMES = getTimeframes(null);

import { DEFAULT_INDICATOR_DEFINITIONS } from '@/lib/indicatorsData';

export const INDICATOR_DEFINITIONS = DEFAULT_INDICATOR_DEFINITIONS;

export const STANDARD_EMA_PAIRS = [
    { fastPeriod: 9, slowPeriod: 21 },
    { fastPeriod: 50, slowPeriod: 200 },
    { fastPeriod: 20, slowPeriod: 50 },
    { fastPeriod: 12, slowPeriod: 26 }
];

export const STANDARD_SINGLE_EMA_PERIODS = [20, 50, 200, 100];

export function getNextEmaDefaults(existingConditions = [], excludeIndex = -1, isSingleEma = false) {
    if (isSingleEma) {
        const usedPeriods = new Set(
            existingConditions
                .filter((c, idx) => idx !== excludeIndex && c.indicatorKey === 'ema_crossover' && (c.condition?.includes('Price Above') || c.condition?.includes('Price Below')))
                .map(c => Number(c.params?.fastPeriod))
                .filter(Boolean)
        );
        const nextPeriod = STANDARD_SINGLE_EMA_PERIODS.find(p => !usedPeriods.has(p)) || 20;
        return { fastPeriod: nextPeriod };
    }

    const otherEmaConditions = existingConditions.filter((c, idx) => {
        if (idx === excludeIndex) return false;
        if (c.indicatorKey !== 'ema_crossover') return false;
        return !c.condition?.includes('Price Above') && !c.condition?.includes('Price Below');
    });

    const usedPairs = new Set(
        otherEmaConditions.map(c => `${Number(c.params?.fastPeriod)}_${Number(c.params?.slowPeriod)}`)
    );

    const nextPair = STANDARD_EMA_PAIRS.find(p => !usedPairs.has(`${p.fastPeriod}_${p.slowPeriod}`)) 
        || STANDARD_EMA_PAIRS[otherEmaConditions.length % STANDARD_EMA_PAIRS.length] 
        || { fastPeriod: 50, slowPeriod: 200 };

    return {
        fastPeriod: nextPair.fastPeriod,
        slowPeriod: nextPair.slowPeriod
    };
}

export function getConditionParams(indicatorKey = 'ema_crossover', condition = '', existingConditions = [], excludeIndex = -1) {
    const def = INDICATOR_DEFINITIONS[indicatorKey] || INDICATOR_DEFINITIONS.ema_crossover;
    const isSingleEma = indicatorKey === 'ema_crossover' && (condition?.includes('Price Above') || condition?.includes('Price Below'));

    if (isSingleEma) {
        const defaults = getNextEmaDefaults(existingConditions, excludeIndex, true);
        return {
            fields: [
                { key: 'fastPeriod', label: 'EMA Period', type: 'number', default: defaults.fastPeriod, min: 1, max: 1000, step: 1 }
            ],
            defaultParams: defaults,
            paramLabels: { fastPeriod: 'EMA Period' }
        };
    }

    if (indicatorKey === 'ema_crossover') {
        const defaults = getNextEmaDefaults(existingConditions, excludeIndex, false);
        return {
            fields: [
                { key: 'fastPeriod', label: 'Fast Period', type: 'number', default: defaults.fastPeriod, min: 1, max: 500, step: 1 },
                { key: 'slowPeriod', label: 'Slow Period', type: 'number', default: defaults.slowPeriod, min: 2, max: 1000, step: 1 }
            ],
            defaultParams: defaults,
            paramLabels: {
                fastPeriod: 'Fast Period',
                slowPeriod: 'Slow Period'
            }
        };
    }

    return {
        fields: def.fields || [],
        defaultParams: { ...(def.defaultParams || {}) },
        paramLabels: { ...(def.paramLabels || {}) }
    };
}

export function validateEntryCondition(cond, allConditions = [], currentIndex = -1, t = null) {
    if (!cond) return null;
    const { indicatorKey = 'ema_crossover', condition, params = {} } = cond;

    if (indicatorKey === 'ema_crossover') {
        const isSingle = condition?.includes('Price Above') || condition?.includes('Price Below');
        const fast = Number(params.fastPeriod);
        const slow = Number(params.slowPeriod);

        if (isSingle) {
            if (!params.fastPeriod || isNaN(fast) || fast < 1) return t ? t('botBuilder.validation.emaMin', 'EMA Period must be at least 1') : 'EMA Period must be at least 1';
            if (fast > 1000) return t ? t('botBuilder.validation.emaMax', 'EMA Period cannot exceed 1000') : 'EMA Period cannot exceed 1000';
            return null;
        }

        if (!params.fastPeriod || isNaN(fast) || fast < 1) return t ? t('botBuilder.validation.fastMin', 'Fast Period must be at least 1') : 'Fast Period must be at least 1';
        if (fast > 500) return t ? t('botBuilder.validation.fastMax', 'Fast Period cannot exceed 500') : 'Fast Period cannot exceed 500';
        if (!params.slowPeriod || isNaN(slow) || slow < 2) return t ? t('botBuilder.validation.slowMin', 'Slow Period must be at least 2') : 'Slow Period must be at least 2';
        if (slow > 1000) return t ? t('botBuilder.validation.slowMax', 'Slow Period cannot exceed 1000') : 'Slow Period cannot exceed 1000';
        if (fast >= slow) return t ? t('botBuilder.validation.fastLessThanSlow', 'Fast Period ({{fast}}) must be less than Slow Period ({{slow}})', { fast, slow }) : `Fast Period (${fast}) must be less than Slow Period (${slow})`;

        // Check duplicate EMA crossover periods across other conditions
        if (Array.isArray(allConditions) && allConditions.length > 1) {
            const hasDuplicate = allConditions.some((other, idx) => {
                if (idx === currentIndex || !other || other.indicatorKey !== 'ema_crossover') return false;
                const otherIsSingle = other.condition?.includes('Price Above') || other.condition?.includes('Price Below');
                if (otherIsSingle) return false;
                return Number(other.params?.fastPeriod) === fast && Number(other.params?.slowPeriod) === slow;
            });
            if (hasDuplicate) {
                return t ? t('botBuilder.validation.duplicateEma', 'Duplicate EMA ({{fast}}/{{slow}}). Use distinct periods (e.g. 9/21, 50/200, 20/50)', { fast, slow }) : `Duplicate EMA (${fast}/${slow}). Use distinct periods (e.g. 9/21, 50/200, 20/50)`;
            }
        }
        return null;
    }

    return null;
}

export const getRiskLevels = (t) => [
    {
        id: 'low',
        title: t ? t('botBuilder.risk.low.title', 'Low') : 'Low',
        subtitle: t ? t('botBuilder.risk.low.sub', 'Conservative') : 'Conservative',
        lotSize: 0.05,
        maxOpen: 2,
        riskPerTrade: 1,
        maxDailyLoss: 3
    },
    {
        id: 'medium',
        title: t ? t('botBuilder.risk.medium.title', 'Medium') : 'Medium',
        subtitle: t ? t('botBuilder.risk.medium.sub', 'Balanced') : 'Balanced',
        lotSize: 0.1,
        maxOpen: 3,
        riskPerTrade: 2,
        maxDailyLoss: 5
    },
    {
        id: 'high',
        title: t ? t('botBuilder.risk.high.title', 'High') : 'High',
        subtitle: t ? t('botBuilder.risk.high.sub', 'Aggressive') : 'Aggressive',
        lotSize: 0.5,
        maxOpen: 5,
        riskPerTrade: 4,
        maxDailyLoss: 10
    },
    {
        id: 'aggressive',
        title: t ? t('botBuilder.risk.aggressive.title', 'Aggressive') : 'Aggressive',
        subtitle: t ? t('botBuilder.risk.aggressive.sub', 'Most open to trade') : 'Most open to trade',
        lotSize: 1.0,
        maxOpen: 8,
        riskPerTrade: 6,
        maxDailyLoss: 15
    }
];

export const RISK_LEVELS = getRiskLevels(null);
