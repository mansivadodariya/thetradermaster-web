import { supabase } from '@/lib/supabaseClient';

export const DEFAULT_INDICATOR_DEFINITIONS = {
    ema_crossover: {
        id: 'ema_crossover',
        name: 'EMA Crossover',
        desc: 'Exponential Moving Average crossover — trend direction signals',
        category: 'Trend',
        conditions: [
            'Golden Cross (Fast > Slow)',
            'Death Cross (Fast < Slow)',
            'Price Above EMA',
            'Price Below EMA'
        ],
        fields: [
            { key: 'fastPeriod', label: 'Fast Period', type: 'number', default: 9, min: 1, max: 500, step: 1 },
            { key: 'slowPeriod', label: 'Slow Period', type: 'number', default: 21, min: 2, max: 1000, step: 1 }
        ],
        defaultParams: {
            fastPeriod: 9,
            slowPeriod: 21
        },
        paramLabels: {
            fastPeriod: 'Fast Period',
            slowPeriod: 'Slow Period'
        }
    },
    rsi: {
        id: 'rsi',
        name: 'Relative Strength Index (RSI)',
        desc: 'Measures momentum and overbought / oversold market extremes',
        category: 'Momentum',
        conditions: [
            'Crosses Above Oversold (Bullish)',
            'Crosses Below Overbought (Bearish)',
            'RSI Greater Than 50 (Uptrend)',
            'RSI Less Than 50 (Downtrend)',
            'Bullish Divergence',
            'Bearish Divergence'
        ],
        fields: [
            { key: 'period', label: 'RSI Period', type: 'number', default: 14, min: 2, max: 100, step: 1 },
            { key: 'overbought', label: 'Overbought Level', type: 'number', default: 70, min: 50, max: 95, step: 1 },
            { key: 'oversold', label: 'Oversold Level', type: 'number', default: 30, min: 5, max: 50, step: 1 }
        ],
        defaultParams: {
            period: 14,
            overbought: 70,
            oversold: 30
        },
        paramLabels: {
            period: 'RSI Period',
            overbought: 'Overbought Level',
            oversold: 'Oversold Level'
        }
    },
    macd: {
        id: 'macd',
        name: 'MACD',
        desc: 'Moving Average Convergence Divergence momentum and trend signals',
        category: 'Momentum',
        conditions: [
            'MACD Line Crosses Above Signal (Bullish)',
            'MACD Line Crosses Below Signal (Bearish)',
            'MACD Histogram Turns Positive',
            'MACD Histogram Turns Negative',
            'MACD Crosses Above Zero',
            'MACD Crosses Below Zero'
        ],
        fields: [
            { key: 'fastEma', label: 'Fast EMA', type: 'number', default: 12, min: 1, max: 200, step: 1 },
            { key: 'slowEma', label: 'Slow EMA', type: 'number', default: 26, min: 2, max: 500, step: 1 },
            { key: 'signalPeriod', label: 'Signal Smoothing', type: 'number', default: 9, min: 1, max: 100, step: 1 }
        ],
        defaultParams: {
            fastEma: 12,
            slowEma: 26,
            signalPeriod: 9
        },
        paramLabels: {
            fastEma: 'Fast EMA',
            slowEma: 'Slow EMA',
            signalPeriod: 'Signal Smoothing'
        }
    },
    bollinger_bands: {
        id: 'bollinger_bands',
        name: 'Bollinger Bands',
        desc: 'Volatility bands indicating dynamic support, resistance, and squeeze breakouts',
        category: 'Volatility',
        conditions: [
            'Price Closes Below Lower Band (Oversold Bounce)',
            'Price Closes Above Upper Band (Overbought Pullback)',
            'Bollinger Band Squeeze Breakout (Bullish)',
            'Bollinger Band Squeeze Breakout (Bearish)',
            'Price Crosses Middle SMA Line'
        ],
        fields: [
            { key: 'period', label: 'SMA Period', type: 'number', default: 20, min: 2, max: 200, step: 1 },
            { key: 'stdDev', label: 'Std Deviation', type: 'number', default: 2.0, min: 0.5, max: 5.0, step: 0.1 }
        ],
        defaultParams: {
            period: 20,
            stdDev: 2.0
        },
        paramLabels: {
            period: 'SMA Period',
            stdDev: 'Std Deviation'
        }
    },
    supertrend: {
        id: 'supertrend',
        name: 'Supertrend',
        desc: 'ATR-based trend identifier for precise direction flips and trailing stops',
        category: 'Trend',
        conditions: [
            'Supertrend Flips Green (Bullish Entry)',
            'Supertrend Flips Red (Bearish Entry)',
            'Price Above Supertrend',
            'Price Below Supertrend'
        ],
        fields: [
            { key: 'atrPeriod', label: 'ATR Period', type: 'number', default: 10, min: 1, max: 100, step: 1 },
            { key: 'multiplier', label: 'Multiplier', type: 'number', default: 3.0, min: 0.5, max: 10.0, step: 0.1 }
        ],
        defaultParams: {
            atrPeriod: 10,
            multiplier: 3.0
        },
        paramLabels: {
            atrPeriod: 'ATR Period',
            multiplier: 'Multiplier'
        }
    },
    stochastic: {
        id: 'stochastic',
        name: 'Stochastic Oscillator',
        desc: 'Momentum oscillator comparing closing price to range of prices over time',
        category: 'Momentum',
        conditions: [
            '%K Crosses Above %D in Oversold Zone',
            '%K Crosses Below %D in Overbought Zone',
            '%K Greater Than 80 (Overbought)',
            '%K Less Than 20 (Oversold)'
        ],
        fields: [
            { key: 'kPeriod', label: '%K Period', type: 'number', default: 14, min: 1, max: 100, step: 1 },
            { key: 'dPeriod', label: '%D Period', type: 'number', default: 3, min: 1, max: 50, step: 1 },
            { key: 'slowing', label: 'Slowing', type: 'number', default: 3, min: 1, max: 50, step: 1 }
        ],
        defaultParams: {
            kPeriod: 14,
            dPeriod: 3,
            slowing: 3
        },
        paramLabels: {
            kPeriod: '%K Period',
            dPeriod: '%D Period',
            slowing: 'Slowing'
        }
    },
    atr: {
        id: 'atr',
        name: 'Average True Range (ATR)',
        desc: 'Measures market volatility for stop losses and breakout validation',
        category: 'Volatility',
        conditions: [
            'ATR Above Volatility Filter',
            'ATR Below Volatility Filter',
            'ATR Rising (Expanding Volatility)',
            'ATR Falling (Compressing Volatility)'
        ],
        fields: [
            { key: 'period', label: 'ATR Period', type: 'number', default: 14, min: 1, max: 100, step: 1 },
            { key: 'multiplier', label: 'Stop Multiplier', type: 'number', default: 1.5, min: 0.5, max: 10.0, step: 0.1 }
        ],
        defaultParams: {
            period: 14,
            multiplier: 1.5
        },
        paramLabels: {
            period: 'ATR Period',
            multiplier: 'Stop Multiplier'
        }
    }
};

/**
 * Safely parses stringified JSON or returns the original object/array
 */
function safeJsonParse(value, fallback) {
    if (!value) return fallback;
    if (typeof value === 'object') return value;
    try {
        return JSON.parse(value);
    } catch (_) {
        return fallback;
    }
}

/**
 * Extracts standard canonical key from indicator name or record
 */
export function getCanonicalKey(row) {
    if (!row) return '';
    const name = String(row.name || row.title || '').toLowerCase();
    if (name.includes('ema') || name.includes('exponential moving')) return 'ema_crossover';
    if (name.includes('rsi') || name.includes('relative strength')) return 'rsi';
    if (name.includes('macd')) return 'macd';
    if (name.includes('bollinger')) return 'bollinger_bands';
    if (name.includes('supertrend')) return 'supertrend';
    if (name.includes('stochastic')) return 'stochastic';
    if (name.includes('atr') || name.includes('average true range')) return 'atr';
    const rawKey = row.key || row.indicator_key || row.code || row.slug;
    if (rawKey && !String(rawKey).includes('-')) return String(rawKey).toLowerCase().replace(/\s+/g, '_');
    return name.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || String(row.id || '').toLowerCase();
}

/**
 * Checks if a Supabase indicator record is active/enabled
 */
export function isIndicatorRowActive(row) {
    if (!row) return false;
    if (row.is_active === false || row.active === false || row.enabled === false) return false;
    const statusVal = String(row.status || '').toLowerCase().trim();
    if (statusVal === 'inactive' || statusVal === 'disabled' || statusVal === 'hidden' || statusVal === 'false' || statusVal === 'off') {
        return false;
    }
    if (row.is_active === true || row.active === true || row.enabled === true || statusVal === 'active' || statusVal === 'enabled' || statusVal === 'true') {
        return true;
    }
    return true;
}

/**
 * Normalizes an indicator row from Supabase into our standard dictionary structure
 */
function normalizeIndicatorRow(row) {
    const key = getCanonicalKey(row);
    if (!key) return null;

    const conditions = safeJsonParse(row.conditions, []);
    const fields = safeJsonParse(row.parameters_schema?.fields || row.fields, []);
    const defaultParams = safeJsonParse(row.default_payload || row.default_params || row.defaultParams, {});
    const paramLabels = safeJsonParse(row.param_labels || row.paramLabels, {});
    const isActive = isIndicatorRowActive(row);

    return {
        id: key,
        key,
        name: row.name || row.title || key.toUpperCase(),
        desc: row.description || row.desc || '',
        category: row.category || 'Technical',
        conditions: Array.isArray(conditions) && conditions.length > 0 ? conditions : ['Standard Signal'],
        fields: Array.isArray(fields) ? fields : [],
        defaultParams: defaultParams || {},
        paramLabels: paramLabels || {},
        displayOrder: row.sort_order ?? row.display_order ?? row.order ?? 999,
        isActive,
        status: isActive ? 'active' : 'disabled'
    };
}

let cachedIndicators = null;

/**
 * Fetches technical indicators from Supabase table ('bot_indicators' or 'indicators')
 * Filters out disabled/inactive indicators so only active bots appear in app.
 * Falls back to DEFAULT_INDICATOR_DEFINITIONS if Supabase is unavailable.
 */
export async function fetchIndicatorsFromSupabase(forceRefresh = false) {
    if (cachedIndicators && !forceRefresh) {
        return cachedIndicators;
    }

    if (!supabase) {
        cachedIndicators = DEFAULT_INDICATOR_DEFINITIONS;
        return DEFAULT_INDICATOR_DEFINITIONS;
    }

    try {
        // Query 'bot_indicators' table first (primary Supabase table)
        let { data, error } = await supabase
            .from('bot_indicators')
            .select('*')
            .order('sort_order', { ascending: true, nullsFirst: false });

        // Fallback to 'indicators' table if needed
        if (error || !data || data.length === 0) {
            const fallbackResult = await supabase
                .from('indicators')
                .select('*')
                .order('display_order', { ascending: true, nullsFirst: false });
            if (!fallbackResult.error && fallbackResult.data && fallbackResult.data.length > 0) {
                data = fallbackResult.data;
                error = null;
            }
        }

        if (error || !data || data.length === 0) {
            cachedIndicators = DEFAULT_INDICATOR_DEFINITIONS;
            return DEFAULT_INDICATOR_DEFINITIONS;
        }

        const activeDictionary = {};

        data.forEach((row) => {
            if (!isIndicatorRowActive(row)) return;
            const normalized = normalizeIndicatorRow(row);
            if (normalized) {
                const defaultDef = DEFAULT_INDICATOR_DEFINITIONS[normalized.id] || {};
                activeDictionary[normalized.id] = {
                    ...defaultDef,
                    ...normalized,
                    isActive: true
                };
            }
        });

        // Use active indicators from Supabase
        cachedIndicators = activeDictionary;
        return activeDictionary;
    } catch (err) {
        console.warn('[indicatorsData] Failed to fetch indicators from Supabase:', err?.message);
        cachedIndicators = DEFAULT_INDICATOR_DEFINITIONS;
        return DEFAULT_INDICATOR_DEFINITIONS;
    }
}

/**
 * Returns dynamic explore/chat suggestion templates based on available active indicators.
 * For each active bot/indicator, generates 2 distinct strategy suggestion variations.
 */
export function getStrategyExploreSuggestions(indicators = DEFAULT_INDICATOR_DEFINITIONS) {
    const list = Object.values(indicators || {}).filter((ind) => ind && ind.isActive !== false);

    if (list.length === 0) {
        return [
            'Build a conservative risk EUR/USD swing strategy',
            'Build a Gold (XAU/USD) 15-minute scalping strategy'
        ];
    }

    const suggestions = [];
    const activeIds = new Set(list.map((ind) => String(ind.id || '').toLowerCase()));

    list.forEach((ind) => {
        const id = String(ind.id || '').toLowerCase();
        const name = ind.name || ind.id;

        if (id === 'ema_crossover' || id.includes('ema')) {
            suggestions.push('Build an EMA crossover strategy');
            suggestions.push('Build a 9/21 EMA trend-following strategy');
        } else if (id === 'rsi' || id.includes('rsi')) {
            suggestions.push('Build an RSI momentum strategy');
            suggestions.push('Build an RSI oversold rebound strategy');
        } else if (id === 'macd' || id.includes('macd')) {
            suggestions.push('Build a MACD divergence strategy');
            suggestions.push('Build a MACD zero-line crossover strategy');
        } else if (id === 'bollinger_bands' || id.includes('bollinger')) {
            suggestions.push('Build a Bollinger Bands squeeze breakout strategy');
            suggestions.push('Build a Bollinger Bands mean-reversion strategy');
        } else if (id === 'supertrend' || id.includes('supertrend')) {
            suggestions.push('Build a Supertrend trend-following strategy');
            suggestions.push('Build a Supertrend multi-timeframe breakout strategy');
        } else if (id === 'stochastic' || id.includes('stochastic')) {
            suggestions.push('Build a Stochastic oscillator scalping strategy');
            suggestions.push('Build a Stochastic oversold reversal strategy');
        } else if (id === 'atr' || id.includes('atr')) {
            suggestions.push('Build an ATR volatility breakout strategy');
            suggestions.push('Build an ATR dynamic trailing-stop strategy');
        } else {
            suggestions.push(`Build a ${name} momentum strategy`);
            suggestions.push(`Build a ${name} trend-following strategy`);
        }
    });

    // Only add multi-indicator suggestions if BOTH relevant indicators are active in Supabase
    if (activeIds.has('ema_crossover') && activeIds.has('rsi')) {
        suggestions.push('Build a multi-indicator EMA & RSI momentum strategy');
    }
    if (activeIds.has('macd') && activeIds.has('rsi')) {
        suggestions.push('Build a MACD & RSI multi-timeframe strategy');
    }

    return Array.from(new Set(suggestions));
}

