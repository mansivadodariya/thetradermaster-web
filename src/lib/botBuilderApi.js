import { tryRefreshToken } from '@/lib/api';
import { getStoredUserId } from '@/lib/authSession';
import { INDICATOR_DEFINITIONS } from '@/rendering/customBotBuilder/constants';

/**
 * Resolves the Bot Builder API base URL dynamically from environment variables.
 * Priority:
 * 1. process.env.NEXT_PUBLIC_BACKEND_URL (e.g. http://192.168.0.153:8000)
 * 2. process.env.NEXT_PUBLIC_API_URL
 * 3. Fallback: http://192.168.0.153:8000/api/v1
 */
export const getBotBuilderApiBase = () => {
    const raw = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.153:8000').replace(/\/+$/, '');
    if (!raw) return '/api/v1';
    return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
};

/**
 * Resolves the Backend Root URL without trailing slash.
 */
export const getBackendRootUrl = () => {
    return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://192.168.0.153:8000').replace(/\/+$/, '');
};

/**
 * Construct authorization and content headers
 */
function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
}

/**
 * Canonical timeframe normalizer (aligns frontend inputs to backend VALID_TIMEFRAMES)
 */
export function normalizeTimeframe(tf) {
    if (!tf) return '15min';
    const raw = String(tf).trim().toLowerCase();
    if (['1m', '1min', 'm1'].includes(raw)) return '5min';
    if (['5m', '5min', 'm5'].includes(raw)) return '5min';
    if (['15m', '15min', 'm15'].includes(raw)) return '15min';
    if (['30m', '30min', 'm30'].includes(raw)) return '30min';
    if (['1h', '60m', '60min', '1hour', 'h1'].includes(raw)) return '60min';
    if (['2h', '2hour', '2hours'].includes(raw)) return '2hours';
    if (['4h', '4hour', '4hours'].includes(raw)) return '4hours';
    if (['1d', '1day', 'daily', 'd1'].includes(raw)) return '1day';
    return raw;
}

/**
 * Normalizes trading asset symbol
 */
export function normalizeSymbol(sym) {
    if (!sym) return 'EURUSD';
    const clean = String(sym).toUpperCase().replace(/[\/\-_]/g, '').trim();
    return clean || 'EURUSD';
}

/**
 * Converts high-level UI indicator conditions to the canonical engine rules
 * format (indicator1, operator, indicator2) expected by the Backtest Engine.
 */
export function buildCanonicalEngineRules(entryRules) {
    const canonical = [];

    for (const r of entryRules || []) {
        const indName = String(r.indicator_name || r.name || r.indicatorKey || '').toLowerCase();
        const cond = String(r.condition || '').toLowerCase();
        const params = r.parameters || r.params || {};

        if (indName.includes('ema') || indName.includes('moving average')) {
            const fast = Number(params.fastPeriod || params.fast_period || params.fastEma || params.fast || 9);
            const slow = Number(params.slowPeriod || params.slow_period || params.slowEma || params.slow || 21);
            if (cond.includes('price')) {
                const isAbove = cond.includes('above') || cond.includes('>');
                canonical.push({
                    indicator1: { name: 'close', parameters: {} },
                    operator: isAbove ? 'greater_than' : 'less_than',
                    indicator2: { name: 'ema', parameters: { length: fast, offset: 0 } }
                });
            } else {
                const isBearish = cond.includes('death') || cond.includes('bearish') || cond.includes('below') || cond.includes('<') || cond.includes('crossdown');
                canonical.push({
                    indicator1: { name: 'ema', parameters: { length: fast, offset: 0 } },
                    operator: isBearish ? 'crossdown' : 'crossover',
                    indicator2: { name: 'ema', parameters: { length: slow, offset: 0 } }
                });
            }
        } else if (indName.includes('rsi') || indName.includes('relative strength')) {
            const length = Number(params.period || params.length || 14);
            const oversold = Number(params.oversold || 30);
            const overbought = Number(params.overbought || 70);
            if (cond.includes('overbought') || cond.includes('bearish')) {
                canonical.push({
                    indicator1: { name: 'rsi', parameters: { length } },
                    operator: 'crossdown',
                    indicator2: { name: 'constant', parameters: { value: overbought } }
                });
            } else if (cond.includes('50')) {
                const isAbove = cond.includes('greater') || cond.includes('above') || cond.includes('uptrend');
                canonical.push({
                    indicator1: { name: 'rsi', parameters: { length } },
                    operator: isAbove ? 'greater_than' : 'less_than',
                    indicator2: { name: 'constant', parameters: { value: 50.0 } }
                });
            } else {
                canonical.push({
                    indicator1: { name: 'rsi', parameters: { length } },
                    operator: 'crossover',
                    indicator2: { name: 'constant', parameters: { value: oversold } }
                });
            }
        } else if (indName.includes('macd')) {
            const fast = Number(params.fastEma || params.fast_ema || 12);
            const slow = Number(params.slowEma || params.slow_ema || 26);
            const sig = Number(params.signalPeriod || params.signal_period || 9);
            if (cond.includes('zero')) {
                canonical.push({
                    indicator1: { name: 'macd', parameters: { fast, slow, signal: sig } },
                    operator: 'crossover',
                    indicator2: { name: 'constant', parameters: { value: 0.0 } }
                });
            } else {
                const isBearish = cond.includes('below') || cond.includes('bearish') || cond.includes('negative');
                canonical.push({
                    indicator1: { name: 'macd', parameters: { fast, slow, signal: sig } },
                    operator: isBearish ? 'crossdown' : 'crossover',
                    indicator2: { name: 'macd_signal', parameters: { fast, slow, signal: sig } }
                });
            }
        } else if (indName.includes('bollinger') || indName.includes('bb')) {
            const length = Number(params.period || params.length || 20);
            const std = Number(params.stdDev || params.std_dev || 2.0);
            if (cond.includes('upper') || cond.includes('overbought')) {
                canonical.push({
                    indicator1: { name: 'close', parameters: {} },
                    operator: 'greater_than',
                    indicator2: { name: 'bb_upper', parameters: { length, std } }
                });
            } else if (cond.includes('middle') || cond.includes('sma')) {
                canonical.push({
                    indicator1: { name: 'close', parameters: {} },
                    operator: 'crossover',
                    indicator2: { name: 'sma', parameters: { length } }
                });
            } else {
                canonical.push({
                    indicator1: { name: 'close', parameters: {} },
                    operator: 'less_than',
                    indicator2: { name: 'bb_lower', parameters: { length, std } }
                });
            }
        } else {
            canonical.push({
                indicator1: { name: 'ema', parameters: { length: 9, offset: 0 } },
                operator: 'crossover',
                indicator2: { name: 'ema', parameters: { length: 21, offset: 0 } }
            });
        }
    }

    if (canonical.length === 0) {
        canonical.push({
            indicator1: { name: 'ema', parameters: { length: 9, offset: 0 } },
            operator: 'crossover',
            indicator2: { name: 'ema', parameters: { length: 21, offset: 0 } }
        });
    }

    return canonical;
}

/**
 * Formats custom bot form state into standard backend strategy JSON matching BotStrategyCreate schema
 */
export function formatBotStrategyPayload(formData, userId) {
    const rawPair = formData.tradingPair || 'EUR/USD';
    const cleanSymbol = normalizeSymbol(rawPair);
    const normTimeframe = normalizeTimeframe(formData.timeframe);

    const slPips = Math.max(0.1, Number(formData.stopLossPips) || 25);
    const tpPips = Math.max(0.1, Number(formData.takeProfitPips) || 50);
    const lotSize = Math.max(0.01, Number(formData.lotSize) || 0.1);
    const initialCapital = Math.max(100, Number(formData.initialCapital) || 10000.0);
    const maxOpen = Math.max(1, Number(formData.maxOpenPositions) || 3);
    const riskPerTrade = Math.max(0.1, Number(formData.riskPerTrade) || 2.0);
    const maxDailyLoss = Math.max(0.5, Number(formData.maxDailyLoss) || 5.0);
    const direction = formData.direction || 'both';

    const trailingSlSetting = formData.trailingStop
        ? `Enabled (${Number(formData.trailingDistance) || 15} pips)`
        : 'Disabled';

    // 1. Format entry_rules array matching RuleIndicatorItem schema
    const entryRules = (formData.entryConditions || []).map((cond, idx) => {
        const def = INDICATOR_DEFINITIONS[cond.indicatorKey] || {};
        const indName = def.name || cond.indicatorKey || 'EMA Crossover';

        const sanitizedParams = {};
        if (cond.params && typeof cond.params === 'object') {
            for (const [pk, pv] of Object.entries(cond.params)) {
                const num = Number(pv);
                sanitizedParams[pk] = !isNaN(num) && pv !== '' && pv !== null ? num : pv;
            }
        }

        return {
            indicator_id: cond.id || def.id || cond.indicatorKey || `ind_${idx + 1}`,
            indicator_name: indName,
            condition: cond.condition || 'Signal Trigger',
            parameters: sanitizedParams
        };
    });

    // 2. Format exit_rules dict
    const exitRules = {
        stoploss_pips: slPips,
        target_pips: tpPips,
        stoploss: slPips,
        target: tpPips,
        trailing_sl: trailingSlSetting,
        trailing_stop: Boolean(formData.trailingStop),
        trailing_distance: formData.trailingStop ? (Number(formData.trailingDistance) || 0) : 0,
        trailing_step: formData.trailingStop ? (Number(formData.trailingStep) || 0) : 0,
        max_daily_loss: maxDailyLoss
    };

    // 3. Compile clean config object
    const config = {
        symbol: cleanSymbol,
        timeframe: normTimeframe,
        direction: direction,
        lots: lotSize,
        quantity: lotSize,
        sizing_mode: 'lots',
        initial_capital: initialCapital,
        is_mis: true,
        session: 'All Day',
        risk_per_trade: riskPerTrade,
        max_open_positions: maxOpen,
        max_daily_loss: maxDailyLoss,
        stoploss: slPips,
        target: tpPips,
        risk_reward: `1:${(tpPips / Math.max(slPips, 1.0)).toFixed(1)}`,
        trailing_sl: trailingSlSetting,
        trigger_mode: (formData.triggerMode || 'ALL').toLowerCase(),
        entry_conditions: {
            rules: entryRules,
            condition_type: (formData.triggerMode || 'ALL').toLowerCase(),
            entry_start_time: '00:00',
            entry_end_time: '23:55'
        },
        exit_conditions: {
            rules: [],
            target: tpPips,
            stoploss: slPips,
            target_type: 'points',
            stoploss_type: 'points',
            condition_type: 'all'
        }
    };

    // Flatten any custom indicator parameters directly into config for engine ease
    entryRules.forEach(rule => {
        if (rule.parameters) {
            for (const [k, v] of Object.entries(rule.parameters)) {
                if (!(k in config)) {
                    config[k] = v;
                }
            }
        }
    });

    // 4. Construct direct backtest engine payload (strategy_json)
    const now = new Date();
    const toDate = now.toISOString().slice(0, 10);
    const fromDateObj = new Date();
    fromDateObj.setDate(now.getDate() - 90);
    const fromDate = fromDateObj.toISOString().slice(0, 10);

    const canonicalRules = buildCanonicalEngineRules(entryRules);

    const strategyJson = {
        stock_name: [cleanSymbol],
        interval: normTimeframe,
        from_date: fromDate,
        to_date: toDate,
        entry_type: direction.toLowerCase().includes('short') || direction.toLowerCase().includes('sell') ? 1 : 0,
        inital_capital: initialCapital,
        quantity: lotSize,
        sizing_mode: 'lots',
        data_provider: 'DB',
        is_mis: true,
        entry_conditions: {
            rules: canonicalRules,
            condition_type: (formData.triggerMode || 'ALL').toLowerCase(),
            entry_start_time: '00:00',
            entry_end_time: '23:55'
        },
        exit_conditions: {
            rules: [],
            target: tpPips,
            stoploss: slPips,
            target_type: 'points',
            stoploss_type: 'points',
            condition_type: 'all'
        }
    };

    // 5. Final BotStrategyCreate schema
    return {
        user_id: userId || undefined,
        strategy_name: (formData.botName || 'Custom Algo Bot').trim(),
        description: formData.description ? formData.description.trim() : `Custom algorithmic bot for ${cleanSymbol} (${normTimeframe})`,
        symbol: cleanSymbol,
        timeframe: normTimeframe,
        direction: direction,
        creation_type: 'custom',
        quantity: lotSize,
        initial_capital: initialCapital,
        session: 'All Day',
        risk_per_trade: riskPerTrade,
        max_open_positions: maxOpen,
        max_daily_loss: maxDailyLoss,
        entry_rules: entryRules,
        exit_rules: exitRules,
        config: config,
        strategy_json: strategyJson,
        from_date: fromDate,
        to_date: toDate
    };
}

/**
 * Validates the strategy payload against backend requirements before dispatching.
 */
export function validateStrategyJson(payload) {
    const errors = [];

    if (!payload || typeof payload !== 'object') {
        return { isValid: false, errors: ['Strategy payload must be a valid JSON object'] };
    }

    if (!payload.strategy_name || typeof payload.strategy_name !== 'string' || !payload.strategy_name.trim()) {
        errors.push('Strategy name is required');
    } else if (payload.strategy_name.trim().length < 3) {
        errors.push('Strategy name must be at least 3 characters');
    } else if (payload.strategy_name.trim().length > 50) {
        errors.push('Strategy name cannot exceed 50 characters');
    }

    if (!payload.symbol || typeof payload.symbol !== 'string' || !payload.symbol.trim()) {
        errors.push('Trading pair / symbol is required');
    }

    if (!payload.timeframe || typeof payload.timeframe !== 'string' || !payload.timeframe.trim()) {
        errors.push('Timeframe is required');
    }

    const qty = Number(payload.quantity);
    if (isNaN(qty) || qty <= 0) {
        errors.push('Lot size (quantity) must be a numeric value greater than 0');
    } else if (qty > 100) {
        errors.push('Lot size cannot exceed 100 lots');
    }

    const cap = Number(payload.initial_capital);
    if (isNaN(cap) || cap <= 0) {
        errors.push('Initial capital must be a numeric value greater than $0');
    }

    const riskTrade = Number(payload.risk_per_trade);
    if (isNaN(riskTrade) || riskTrade <= 0 || riskTrade > 100) {
        errors.push('Risk per trade must be between 0.1% and 100%');
    }

    const maxLoss = Number(payload.max_daily_loss);
    if (isNaN(maxLoss) || maxLoss <= 0 || maxLoss > 100) {
        errors.push('Max daily loss must be between 0.5% and 100%');
    }

    const maxOpen = Number(payload.max_open_positions);
    if (isNaN(maxOpen) || maxOpen < 1 || maxOpen > 50) {
        errors.push('Max open positions must be between 1 and 50');
    }

    if (!Array.isArray(payload.entry_rules) || payload.entry_rules.length === 0) {
        errors.push('Please configure at least one entry rule');
    } else {
        payload.entry_rules.forEach((rule, idx) => {
            if (!rule.indicator_name) {
                errors.push(`Rule #${idx + 1}: Indicator name is missing`);
            }
            if (!rule.condition) {
                errors.push(`Rule #${idx + 1}: Condition is missing`);
            }
            if (rule.parameters && typeof rule.parameters === 'object') {
                for (const [pk, pv] of Object.entries(rule.parameters)) {
                    if (typeof pv === 'number' && isNaN(pv)) {
                        errors.push(`Rule #${idx + 1}: Parameter "${pk}" has an invalid NaN value`);
                    }
                }
            }
        });
    }

    const exitRules = payload.exit_rules || {};
    const sl = Number(exitRules.stoploss_pips ?? exitRules.stoploss);
    const tp = Number(exitRules.target_pips ?? exitRules.target);
    if (isNaN(sl) || sl <= 0) {
        errors.push('Stop Loss must be greater than 0 pips');
    }
    if (isNaN(tp) || tp <= 0) {
        errors.push('Take Profit must be greater than 0 pips');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Bot Builder Strategy API Client
 */
export const botBuilderApi = {
    /**
     * Create/Save Strategy via POST /api/v1/bot-builder/strategies
     */
    createStrategy: async (formData) => {
        const userId = typeof window !== 'undefined' ? getStoredUserId() : null;
        const payload = formatBotStrategyPayload(formData, userId);

        // Pre-submission client-side validation
        const validation = validateStrategyJson(payload);
        if (!validation.isValid) {
            return {
                success: false,
                error: validation.errors[0] || 'Validation error',
                validationErrors: validation.errors,
                payload
            };
        }

        const apiBase = getBotBuilderApiBase();
        const primaryUrl = `${apiBase}/bot-builder/strategies`;
        const headers = getAuthHeaders();

        try {
            let res = await fetch(primaryUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            // Handle 401 Unauthorized via token refresh
            if (res.status === 401) {
                const refreshed = await tryRefreshToken();
                if (refreshed) {
                    res = await fetch(primaryUrl, {
                        method: 'POST',
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${refreshed}`
                        },
                        body: JSON.stringify(payload)
                    });
                }
            }

            if (res.ok) {
                const json = await res.json();
                const stratData = json?.data || json;
                const strategyId = stratData?.strategy_id || stratData?.id;
                return {
                    success: true,
                    strategyId: strategyId,
                    strategy_id: strategyId,
                    data: stratData,
                    raw: json,
                    payload
                };
            }

            // Extract rich backend error details
            const errData = await res.json().catch(() => null);
            let errMsg = `Request failed with status ${res.status}`;
            if (errData) {
                if (typeof errData.detail === 'string') {
                    errMsg = errData.detail;
                } else if (errData.detail && typeof errData.detail.message === 'string') {
                    errMsg = errData.detail.message;
                } else if (errData.message) {
                    errMsg = errData.message;
                } else if (errData.error) {
                    errMsg = typeof errData.error === 'string' ? errData.error : JSON.stringify(errData.error);
                }
            }
            return { success: false, error: errMsg, status: res.status, payload };
        } catch (err) {
            console.warn('[botBuilderApi] Backend strategy request failed:', err.message);
            return { success: false, error: err.message || 'Network connection failed', payload };
        }
    },

    /**
     * Executes direct backtest simulation on the saved strategy
     * Endpoint: POST /api/v1/backtest/run-by-id (or /api/v1/backtest/interactive-run)
     */
    runBacktest: async (strategyIdOrPayload) => {
        const backendRoot = getBackendRootUrl();
        const headers = getAuthHeaders();

        let requestBody = {};
        let endpoint = `${backendRoot}/api/v1/backtest/run-by-id`;

        if (typeof strategyIdOrPayload === 'string') {
            requestBody = { strategy_id: strategyIdOrPayload };
        } else if (strategyIdOrPayload && strategyIdOrPayload.strategy_id) {
            requestBody = { ...strategyIdOrPayload };
        } else if (strategyIdOrPayload && typeof strategyIdOrPayload === 'object') {
            endpoint = `${backendRoot}/api/v1/backtest/interactive-run`;
            requestBody = { strategy_json: strategyIdOrPayload };
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody)
            });

            if (res.ok) {
                const json = await res.json();
                return {
                    success: true,
                    data: json?.data || json,
                    winRate: Number(json?.win_rate ?? json?.win_rate_percentage ?? 0),
                    trades: Number(json?.trades ?? json?.total_trades ?? 0),
                    pnl: Number(json?.pnl ?? json?.net_profit ?? 0),
                    profitFactor: Number(json?.profit_factor ?? 0),
                    maxDrawdown: Number(json?.max_drawdown ?? 0),
                    stats: json?.stats || {},
                    raw: json
                };
            }

            const errData = await res.json().catch(() => null);
            const errMsg = errData?.message || errData?.detail || `Backtest failed with status ${res.status}`;
            return { success: false, error: errMsg };
        } catch (err) {
            console.warn('[botBuilderApi] Backtest run failed:', err.message);
            return { success: false, error: err.message || 'Failed to connect to backtest engine' };
        }
    },

    /**
     * Fetch user strategies via GET /api/v1/bot-builder/strategies
     */
    getStrategies: async (userId) => {
        const uid = userId || (typeof window !== 'undefined' ? getStoredUserId() : '');
        const apiBase = getBotBuilderApiBase();
        const url = uid ? `${apiBase}/bot-builder/strategies?user_id=${encodeURIComponent(uid)}` : `${apiBase}/bot-builder/strategies`;
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const json = await res.json();
                return { success: true, data: json?.data || json?.strategies || json };
            }
        } catch (err) {
            console.warn('[botBuilderApi] Get strategies failed:', err.message);
        }
        return { success: false, data: [] };
    }
};
