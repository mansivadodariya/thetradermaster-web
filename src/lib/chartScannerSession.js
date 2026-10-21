/**
 * Manages the current analysis session state for Chart Scanner (TradeSnap).
 * Keeps an in-memory cache to guarantee persistence across client-side page
 * navigations in Next.js SPA without hitting storage quotas, and mirrors to
 * sessionStorage for cross-reload persistence when space allows.
 */

const SESSION_STORAGE_KEY = 'tm_chart_scanner_session';

let inMemorySession = {
    activeTab: 'single',
    capturedImage: null,
    showSnapshot: false,
    capturedImage1: null,
    capturedImage2: null,
    showSnapshot1: false,
    showSnapshot2: false,
    tfLower: '5m',
    tfHigher: '1h',
    allAnalyses: [],
    showAnalysis: false,
};

export function getChartScannerSession() {
    if (typeof window === 'undefined') {
        return { ...inMemorySession };
    }

    try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            inMemorySession = {
                ...inMemorySession,
                ...parsed,
                capturedImage: inMemorySession.capturedImage || parsed.capturedImage || null,
                capturedImage1: inMemorySession.capturedImage1 || parsed.capturedImage1 || null,
                capturedImage2: inMemorySession.capturedImage2 || parsed.capturedImage2 || null,
            };
        }
    } catch (e) {
        // Fallback to in-memory cache
    }

    return { ...inMemorySession };
}

export function saveChartScannerSession(partialData) {
    if (!partialData || typeof partialData !== 'object') {
        return inMemorySession;
    }

    inMemorySession = {
        ...inMemorySession,
        ...partialData,
    };

    if (typeof window !== 'undefined') {
        try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(inMemorySession));
        } catch (err) {
            // If quota exceeded due to large base64 screenshot, try writing without the heaviest payload
            try {
                const fallback = {
                    ...inMemorySession,
                    capturedImage: null,
                    capturedImage1: null,
                    capturedImage2: null,
                };
                sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fallback));
            } catch (_) {
                // Ignore storage failures
            }
        }
    }

    return { ...inMemorySession };
}

export function clearSingleTimeframeSession() {
    return saveChartScannerSession({
        capturedImage: null,
        showSnapshot: false,
        allAnalyses: [],
        showAnalysis: false,
    });
}

export function clearMultiTimeframeSession() {
    return saveChartScannerSession({
        capturedImage1: null,
        capturedImage2: null,
        showSnapshot1: false,
        showSnapshot2: false,
        allAnalyses: [],
        showAnalysis: false,
    });
}

export function clearAllChartScannerSession() {
    inMemorySession = {
        activeTab: 'single',
        capturedImage: null,
        showSnapshot: false,
        capturedImage1: null,
        capturedImage2: null,
        showSnapshot1: false,
        showSnapshot2: false,
        tfLower: '5m',
        tfHigher: '1h',
        allAnalyses: [],
        showAnalysis: false,
    };

    if (typeof window !== 'undefined') {
        try {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
        } catch (_) {}
    }

    return { ...inMemorySession };
}
