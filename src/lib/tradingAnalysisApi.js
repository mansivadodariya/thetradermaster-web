import { tryRefreshToken } from '@/lib/api';

const BASE_URL = `${(process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/+$/, '')}/api/v1`;

function getAuthHeaders() {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            return {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            };
        }
    }
    return {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };
}

/**
 * Trading Profile Analysis API Client
 */
export const tradingAnalysisApi = {
    /**
     * Retrieve trading profile state and preferences
     * GET /api/v1/profile/trading-analysis
     */
    getTradingAnalysis: async () => {
        try {
            const res = await fetch(`${BASE_URL}/profile/trading-analysis`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (res.status === 401) {
                const refreshed = await tryRefreshToken();
                if (refreshed) {
                    const retryRes = await fetch(`${BASE_URL}/profile/trading-analysis`, {
                        method: 'GET',
                        headers: {
                            ...getAuthHeaders(),
                            Authorization: `Bearer ${refreshed}`
                        },
                    });
                    if (retryRes.ok) {
                        return await retryRes.json();
                    }
                }
            }

            if (res.ok) {
                return await res.json();
            }
            const errJson = await res.json().catch(() => null);
            return {
                status: 'error',
                success: false,
                message: errJson?.message || errJson?.detail || 'Failed to fetch trading profile analysis',
                data: null
            };
        } catch (err) {
            console.warn('[tradingAnalysisApi] Error fetching trading profile analysis:', err.message);
            return {
                status: 'error',
                success: false,
                message: err.message,
                data: null
            };
        }
    },

    /**
     * Save trading preferences and generate AI trading analysis
     * POST /api/v1/profile/trading-analysis
     */
    saveAndAnalyzeTradingProfile: async (payload) => {
        try {
            const body = JSON.stringify(payload);
            const res = await fetch(`${BASE_URL}/profile/trading-analysis`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body,
            });

            if (res.status === 401) {
                const refreshed = await tryRefreshToken();
                if (refreshed) {
                    const retryRes = await fetch(`${BASE_URL}/profile/trading-analysis`, {
                        method: 'POST',
                        headers: {
                            ...getAuthHeaders(),
                            Authorization: `Bearer ${refreshed}`
                        },
                        body,
                    });
                    if (retryRes.ok) {
                        return await retryRes.json();
                    }
                }
            }

            if (res.ok) {
                return await res.json();
            }

            const errJson = await res.json().catch(() => null);
            return {
                status: 'error',
                success: false,
                message: errJson?.message || errJson?.detail || 'Failed to submit trading profile analysis',
                data: null
            };
        } catch (err) {
            console.error('[tradingAnalysisApi] Error saving trading profile analysis:', err);
            return {
                status: 'error',
                success: false,
                message: err.message || 'Network error occurred',
                data: null
            };
        }
    }
};
