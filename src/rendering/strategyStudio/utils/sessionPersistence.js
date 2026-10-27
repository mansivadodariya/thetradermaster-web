'use client';

const BOT_SESSION_STORAGE_KEY = 'chronosx_ai_bot_studio_session';

/**
 * Save active Bot Builder session state into localStorage
 */
export function saveStudioSession(sessionState) {
    if (typeof window === 'undefined' || !sessionState) return;
    try {
        const {
            sessionId,
            messages = [],
            currentDraft = null,
            currentStrategy = null,
            results = null,
            roundTrips = [],
            executedParams = null,
            symbol = 'XAUUSD',
            interval = '15min',
            fromDate = '',
            toDate = '',
            capital = 10000,
            quantity = 0.01,
            marketMode = 'Forex',
            isBacktestPanelOpen = false
        } = sessionState;

        // Only persist if there is meaningful data to save
        if (messages.length === 0 && !currentDraft && !currentStrategy && !results) {
            return;
        }

        const payload = {
            sessionId,
            messages,
            currentDraft,
            currentStrategy,
            results,
            roundTrips,
            executedParams,
            symbol,
            interval,
            fromDate,
            toDate,
            capital,
            quantity,
            marketMode,
            isBacktestPanelOpen,
            timestamp: Date.now()
        };

        localStorage.setItem(BOT_SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
        console.warn('Could not save Bot Studio session to localStorage:', err);
    }
}

/**
 * Load active Bot Builder session state from localStorage
 */
export function loadStudioSession() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(BOT_SESSION_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
            return parsed;
        }
    } catch (err) {
        console.warn('Could not load Bot Studio session from localStorage:', err);
    }
    return null;
}

/**
 * Clear the persisted Bot Builder session state from localStorage
 */
export function clearStudioSession() {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(BOT_SESSION_STORAGE_KEY);
    } catch (err) {
        console.warn('Could not clear Bot Studio session from localStorage:', err);
    }
}
