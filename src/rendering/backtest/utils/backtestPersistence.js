'use client';

const LATEST_BACKTEST_KEY = 'chronosx_backtest_latest_session';
const STRAT_BACKTEST_PREFIX = 'chronosx_backtest_strat_';
const LEGACY_STORAGE_PREFIX = 'backtest_result_';

/**
 * Safely parse JSON from storage
 */
const safeParse = (str) => {
    if (!str || typeof str !== 'string') return null;
    try {
        const parsed = JSON.parse(str);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
};

/**
 * Persist active backtest response and executed parameters across browser tabs and refreshes
 */
export function saveBacktestResponse(payload) {
    if (typeof window === 'undefined' || !payload) return;
    try {
        const {
            strategy_id = null,
            source = '',
            strategyName = '',
            activeStrategyInfo = null,
            results = null,
            roundTrips = [],
            executedParams = null,
            symbol = 'XAUUSD',
            interval = '15min',
            capital = 10000,
            quantity = 0.01,
            fromDate = '',
            toDate = ''
        } = payload;

        if (!results) return;

        const dataToSave = {
            strategy_id,
            source,
            strategyName,
            activeStrategyInfo,
            results,
            roundTrips: Array.isArray(roundTrips) ? roundTrips : [],
            executedParams,
            symbol,
            interval,
            capital,
            quantity,
            fromDate,
            toDate,
            timestamp: Date.now()
        };

        const serialized = JSON.stringify(dataToSave);

        // Store latest backtest state in both localStorage and sessionStorage
        try {
            localStorage.setItem(LATEST_BACKTEST_KEY, serialized);
        } catch (_) {}
        try {
            sessionStorage.setItem(LATEST_BACKTEST_KEY, serialized);
        } catch (_) {}

        // If associated with a specific strategy_id, also store under strategy ID key
        if (strategy_id) {
            try {
                localStorage.setItem(`${STRAT_BACKTEST_PREFIX}${strategy_id}`, serialized);
                sessionStorage.setItem(`${STRAT_BACKTEST_PREFIX}${strategy_id}`, serialized);
                // Also update legacy key for backward compatibility
                sessionStorage.setItem(`${LEGACY_STORAGE_PREFIX}${strategy_id}`, serialized);
            } catch (_) {}
        }
    } catch (err) {
        console.warn('Could not save backtest response to storage:', err);
    }
}

/**
 * Load backtest response from storage (checks sessionStorage first, falls back to localStorage)
 * If strategyId is provided, looks for that specific strategy's results.
 * If not provided, retrieves the latest active session.
 */
export function loadBacktestResponse(strategyId = null) {
    if (typeof window === 'undefined') return null;
    try {
        if (strategyId) {
            const rawStrat =
                sessionStorage.getItem(`${STRAT_BACKTEST_PREFIX}${strategyId}`) ||
                localStorage.getItem(`${STRAT_BACKTEST_PREFIX}${strategyId}`) ||
                sessionStorage.getItem(`${LEGACY_STORAGE_PREFIX}${strategyId}`) ||
                localStorage.getItem(`${LEGACY_STORAGE_PREFIX}${strategyId}`);
            const parsed = safeParse(rawStrat);
            if (parsed && parsed.results) return parsed;
        }

        const rawLatest =
            sessionStorage.getItem(LATEST_BACKTEST_KEY) ||
            localStorage.getItem(LATEST_BACKTEST_KEY);
        const parsedLatest = safeParse(rawLatest);
        if (parsedLatest && parsedLatest.results) {
            if (!strategyId || parsedLatest.strategy_id === strategyId) {
                return parsedLatest;
            }
        }
    } catch (err) {
        console.warn('Could not load backtest response from storage:', err);
    }
    return null;
}

/**
 * Clear cached backtest response
 */
export function clearBacktestResponse(strategyId = null) {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.removeItem(LATEST_BACKTEST_KEY);
        localStorage.removeItem(LATEST_BACKTEST_KEY);
        if (strategyId) {
            sessionStorage.removeItem(`${STRAT_BACKTEST_PREFIX}${strategyId}`);
            localStorage.removeItem(`${STRAT_BACKTEST_PREFIX}${strategyId}`);
            sessionStorage.removeItem(`${LEGACY_STORAGE_PREFIX}${strategyId}`);
        }
    } catch (_) {}
}

export { LATEST_BACKTEST_KEY, STRAT_BACKTEST_PREFIX };
