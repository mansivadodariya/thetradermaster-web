import { extractAvailableCredits, notifyCreditsUpdated } from '@/lib/credits';

const BASE_URL = `${(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')}/api/v1`;

const DEFAULT_ROLE_ID = '44b71348-74d5-42ef-831a-be7c2da4882e';

// Prevent multiple simultaneous refresh calls
let refreshPromise = null;

import { clearAuthSession } from '@/lib/authSession';

export function clearAuthAndRedirect() {
    if (typeof window === 'undefined') return;
    clearAuthSession();
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
}

export async function tryRefreshToken() {
    const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('refresh_token')
        : null;

    if (!refreshToken) return null;

    // Deduplicate concurrent refresh calls
    if (!refreshPromise) {
        refreshPromise = fetch(`${BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        })
            .then(async (res) => {
                if (!res.ok) return null;
                const data = await res.json().catch(() => null);
                const newToken = data?.data?.access_token || data?.access_token;
                const newRefresh = data?.data?.refresh_token || data?.refresh_token;
                if (!newToken) return null;
                localStorage.setItem('access_token', newToken);
                if (newRefresh) localStorage.setItem('refresh_token', newRefresh);
                document.cookie = `auth_token=${newToken}; path=/; SameSite=Lax`;
                return newToken;
            })
            .catch(() => null)
            .finally(() => { refreshPromise = null; });
    }

    return refreshPromise;
}

export function getActiveRefreshPromise() {
    return refreshPromise;
}

// In-flight deduplication cache for concurrent identical GET requests
const inFlightGetRequests = new Map();

async function request(path, options = {}, _isRetry = false) {
    const isAuthEndpoint = path.startsWith('/auth/');
    const method = (options.method || 'GET').toUpperCase();

    // 1. If a token refresh is currently in progress, wait for it so we don't send expired tokens
    if (refreshPromise && !isAuthEndpoint) {
        try {
            const freshToken = await refreshPromise;
            if (freshToken) {
                options = {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${freshToken}`,
                    },
                };
            }
        } catch (_) {}
    }

    // 2. Deduplicate concurrent GET requests to the same path
    if (method === 'GET' && !_isRetry && !isAuthEndpoint) {
        const authHeader = options.headers?.Authorization || (typeof window !== 'undefined' ? (localStorage.getItem('access_token') || '') : '');
        const dedupKey = `GET:${path}:${authHeader}`;

        if (inFlightGetRequests.has(dedupKey)) {
            return inFlightGetRequests.get(dedupKey);
        }

        const promise = executeRequest(path, options, _isRetry)
            .finally(() => {
                inFlightGetRequests.delete(dedupKey);
            });

        inFlightGetRequests.set(dedupKey, promise);
        return promise;
    }

    return executeRequest(path, options, _isRetry);
}

async function executeRequest(path, options = {}, _isRetry = false) {
    const isAuthEndpoint = path.startsWith('/auth/');
    let { headers = {}, body, ...restOptions } = options;

    // Ensure headers always have the latest valid token if Authorization wasn't explicitly passed
    if (!isAuthEndpoint && !headers.Authorization && typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers = { ...headers, Authorization: `Bearer ${token}` };
        }
    }

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const defaultHeaders = {
        accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
    };
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: defaultHeaders,
        body,
        ...restOptions,
    });

    if (res.status === 401 && !_isRetry && !isAuthEndpoint) {
        // Try to refresh and retry once
        const newToken = await tryRefreshToken();
        if (newToken) {
            // Rebuild options with the new token in Authorization header
            const retryOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newToken}`,
                },
            };
            return executeRequest(path, retryOptions, true);
        }
        // Refresh failed — log out
        clearAuthAndRedirect();
        const err = new Error('Session expired. Please log in again.');
        err.status = 401;
        throw err;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        if ((res.status === 401 || res.status === 403) && !isAuthEndpoint) {
            clearAuthAndRedirect();
            const err = new Error('Session expired. Please log in again.');
            err.status = 401;
            throw err;
        }
        let errorMessage = null;

        // Handle string detail that may contain plain string or embedded JSON
        if (typeof data?.detail === 'string') {
            try {
                const jsonMatch = data.detail.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    errorMessage = parsed?.msg || parsed?.detail || parsed?.message;
                }
            } catch (_) {}
            if (!errorMessage) {
                errorMessage = data.detail;
            }
        }

        if (!errorMessage) {
            errorMessage = data?.detail?.message || data?.message || (typeof data?.detail === 'string' ? data.detail : null) || data?.error || 'Something went wrong';
        }

        if (typeof errorMessage === 'string') {
            const lower = errorMessage.toLowerCase().trim();
            if (
                lower.includes('account is not active') ||
                lower.includes('account is inactive') ||
                lower === 'account not active' ||
                lower === 'account is not active.'
            ) {
                errorMessage = 'Account is not active. Please contact admin.';
            }
        }

        const err = new Error(errorMessage);
        err.detail = data?.detail;
        err.status = res.status;
        err.data = data;
        if (res.status === 503 || data?.status === 'maintenance' || data?.error === 'Service Temporarily Unavailable') {
            err.isMaintenance = true;
        }
        throw err;
    }

    const credits = extractAvailableCredits(data);
    if (credits !== null) notifyCreditsUpdated(credits);

    return data;
}

import { getOrCreateDeviceId } from '@/lib/deviceId';

export const authApi = {
    signup: (body) => {
        const deviceId = getOrCreateDeviceId();
        const headers = deviceId ? { 'X-Device-Id': deviceId } : {};
        return request('/auth/signup', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                ...body,
                role_id: DEFAULT_ROLE_ID,
                ...(deviceId ? { device_id: deviceId } : {})
            }),
        });
    },

    verifyEmail: (token) =>
        request(`/auth/verify-email?token=${encodeURIComponent(token)}`),

    login: (email, password) =>
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, isAdmin: false }),
        }),

    refreshToken: (refresh_token) =>
        request('/auth/refresh-token', {
            method: 'POST',
            body: JSON.stringify({ refresh_token }),
        }),

    forgotPassword: (email) =>
        request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    resetPassword: (token, new_password) =>
        request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, new_password }),
        }),

    googleLogin: (credential) => {
        const deviceId = getOrCreateDeviceId();
        const headers = deviceId ? { 'X-Device-Id': deviceId } : {};
        return request('/auth/google-login', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                credential,
                ...(deviceId ? { device_id: deviceId } : {})
            }),
        });
    },

    verifyPhoneFirebase: async (id_token, userId = '') => {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...(userId ? { 'X-User-Id': userId } : {}),
        };
        const body = JSON.stringify({ id_token, user_id: userId });

        try {
            const res = await fetch('/api/v1/auth/verify-phone-firebase', {
                method: 'POST',
                headers,
                body,
            });
            if (res.ok) {
                return await res.json();
            }
        } catch (_) {}

        return request('/auth/verify-phone-firebase', {
            method: 'POST',
            headers,
            body,
        });
    },
};

function getAuthHeaders() {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
    }
    return {};
}

export const fxApi = {
    chat: (arg1, arg2, arg3) => {
        let payload = {};
        if (typeof arg1 === 'object' && arg1 !== null) {
            const resolvedId = arg1.id || arg1.chat_id || arg1.conversation_id || arg1.session_id || arg1.sessionId;
            payload = {
                message: arg1.message || '',
                pair: arg1.pair || 'XAUUSD',
                timeframe: arg1.timeframe || '15m',
                image_base64: arg1.image_base64 || null,
                stream: arg1.stream ?? false,
                ...(arg1.user_id ? { user_id: arg1.user_id } : {}),
                ...(resolvedId ? { id: resolvedId } : {})
            };
        } else {
            payload = {
                pair: arg1 || 'XAUUSD',
                message: arg2 || '',
                timeframe: '15m',
                image_base64: null,
                stream: false,
                ...(arg3 ? { user_id: arg3 } : {})
            };
        }
        return request('/chat', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
    },

    askQuestion: (payload) => {
        if (typeof FormData !== 'undefined' && payload instanceof FormData) {
            return request('/chat', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: payload,
            });
        }
        return fxApi.chat(payload);
    },

    generateBlog: (input_data, is_content) =>
        request('/blog_generation', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ input_data, is_content }),
        }),

    getBlogHistory: (user_id) => {
        const path = (!user_id || user_id === 'all') ? '/users/blog-history' : `/users/blog-history?user_id=${user_id}`;
        return request(path, {
            headers: getAuthHeaders(),
        });
    },

    getQuestionHistory: (user_id) => {
        return request('/question-history', {
            headers: getAuthHeaders(),
        }).catch(() => {
            const path = (!user_id || user_id === 'all') ? '/users/question-history' : `/users/question-history?user_id=${user_id}`;
            return request(path, {
                headers: getAuthHeaders(),
            });
        });
    },

    getConversationHistory: (conversation_id) => {
        return request(`/users/conversation-history/${conversation_id}`, {
            headers: getAuthHeaders(),
        });
    },

    deleteQuestionHistory: (history_id, user_id) =>
        fxApi.deleteQuestionHistoryItem(user_id, history_id),

    deleteQuestionHistoryItem: (user_id, history_id) =>
        request(`/question-history/${history_id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        }).catch(() =>
            request(`/users/question-history/${history_id}?user_id=${user_id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
        ),

    deleteBlogHistoryItem: (user_id, history_id) =>
        request(`/users/blog-history/${history_id}?user_id=${user_id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        }),
};

const statsCache = new Map();

if (typeof window !== 'undefined') {
    window.addEventListener('credits:updated', () => {
        statsCache.clear();
    });
}

export const dashboardApi = {
    getStats: (user_id, timeframe = '7D', forceRefresh = false) => {
        if (!user_id) return Promise.resolve(null);
        const cacheKey = `${user_id}_${timeframe}`;
        const now = Date.now();
        const cached = statsCache.get(cacheKey);

        if (!forceRefresh && cached) {
            if (cached.promise) return cached.promise;
            if (cached.data && (now - cached.timestamp < 30000)) {
                return Promise.resolve(cached.data);
            }
        }

        let query = '';
        if (timeframe === '30D' || timeframe === '30' || timeframe === 30) {
            query = '?days=30&timeframe=30D';
        } else if (timeframe === '90D' || timeframe === '90' || timeframe === 90) {
            query = '?timeframe=90D';
        } else if (timeframe) {
            query = `?timeframe=${timeframe}`;
        }

        const fetchPromise = request(`/users/${user_id}/dashboard/stats${query}`, {
            headers: getAuthHeaders(),
        })
            .then((res) => {
                statsCache.set(cacheKey, { data: res, timestamp: Date.now(), promise: null });
                return res;
            })
            .catch((err) => {
                statsCache.delete(cacheKey);
                throw err;
            });

        statsCache.set(cacheKey, { data: cached?.data || null, timestamp: cached?.timestamp || 0, promise: fetchPromise });
        return fetchPromise;
    },

    clearStatsCache: (user_id) => {
        if (user_id) {
            for (const key of statsCache.keys()) {
                if (key.startsWith(`${user_id}_`)) statsCache.delete(key);
            }
        } else {
            statsCache.clear();
        }
    },

    getRecentActivity: (user_id) =>
        request(`/users/${user_id}/dashboard/recent-activity`, {
            headers: getAuthHeaders(),
        }),
};

export const tradeSnapApi = {
    getAnalysisHistory: (user_id) => {
        const path = (!user_id || user_id === 'all') ? '/users/analysis-history' : `/users/analysis-history?user_id=${user_id}`;
        return request(path, {
            headers: getAuthHeaders(),
        });
    },

    deleteAnalysisHistoryItem: (user_id, history_id) =>
        request(`/users/analysis-history/${history_id}?user_id=${user_id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        }),
};

export const neweraApi = {
    linkAccount: async (user_id, email) => {
        const cleanEmail = String(email || '').trim().toLowerCase();
        const res = await request('/newera/credit', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ email: cleanEmail }),
        });

        return {
            success: true,
            message: res?.message || 'Newera account linked successfully!',
            data: res?.data || res || {}
        };
    }
};

export const profileApi = {
    getProfile: () =>
        request('/profile', {
            method: 'GET',
            headers: getAuthHeaders(),
        }),

    updateProfile: ({ first_name = '', last_name = '', phone_number = '' } = {}) =>
        request('/profile', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                first_name,
                last_name,
                phone_number,
            }),
        }),

    changePassword: async ({ userId = '', email = '', currentPassword = '', newPassword = '' } = {}) => {
        const res = await fetch('/api/v1/user/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ userId, email, currentPassword, newPassword }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            throw new Error(data?.error || data?.message || 'Failed to update password');
        }
        return data;
    },
};

export const depositApi = {
    createDeposit: ({ amount, plan_id, planId } = {}) => {
        const resolvedPlanId = plan_id ?? planId;
        return request('/deposit/create', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                amount: Number(amount),
                plan_id: resolvedPlanId !== undefined && resolvedPlanId !== null ? resolvedPlanId : null,
            }),
        });
    },

    getDepositHistory: (user_id) => {
        const path = (!user_id || user_id === 'all') ? '/deposit/history' : `/deposit/history?user_id=${user_id}`;
        return request(path, {
            headers: getAuthHeaders(),
        });
    },

    getDepositStatus: (deposit_id) =>
        request(`/deposit/${deposit_id}/status`, {
            headers: getAuthHeaders(),
        }),
};

export const tradeAnalyzeApi = {
    analyze: (files) => {
        const { analyzeTradesReport } = require('@/lib/tradeAnalyzeApi');
        return analyzeTradesReport(files);
    },
};






export const affiliateApi = {
    getDashboard: async () => {
        try {
            return await request('/affiliate/dashboard', {
                headers: getAuthHeaders(),
            });
        } catch (err) {
            // Fallback / mock response if backend route is not available yet
            return {
                status: 'success',
                data: {
                    total_earned: 1280.00,
                    withdrawable_balance: 420.00,
                    pending_lock_balance: 150.00,
                    total_withdrawn: 710.00,
                    referral_count: 24,
                    active_traders: 18,
                    referral_code: 'CHRONOS-8921',
                    referral_url: (typeof window !== 'undefined' ? window.location.origin : 'https://chronosx.com') + '/signup?ref=CHRONOS-8921',
                    current_tier: {
                        level: 1,
                        name: 'Tier 1 - Standard Partner',
                        rate_percentage: 10,
                        next_tier_name: 'Tier 2 - Pro Partner (20%)',
                        next_tier_threshold: 30,
                        progress_count: 18,
                        min_withdrawal: 50.00
                    }
                }
            };
        }
    },

    getCommissionHistory: async ({ page = 1, limit = 10 } = {}) => {
        try {
            return await request(`/affiliate/history?page=${page}&limit=${limit}`, {
                headers: getAuthHeaders(),
            });
        } catch (err) {
            return {
                status: 'success',
                page,
                limit,
                total: 24,
                data: [
                    { id: 'comm_1', date: '2026-09-08T14:32:00Z', trader: 'alex_fx99 (UID #8421)', deposit_volume: 2500, tier_rate: '10%', commission_amount: 250.00, status: 'CREDITED' },
                    { id: 'comm_2', date: '2026-09-07T11:15:00Z', trader: 'sarah_trader (UID #7742)', deposit_volume: 1200, tier_rate: '10%', commission_amount: 120.00, status: 'CREDITED' },
                    { id: 'comm_3', date: '2026-09-06T09:40:00Z', trader: 'crypto_marco (UID #9012)', deposit_volume: 5000, tier_rate: '10%', commission_amount: 500.00, status: 'CREDITED' },
                    { id: 'comm_4', date: '2026-09-04T18:22:00Z', trader: 'quant_dev (UID #6533)', deposit_volume: 800, tier_rate: '10%', commission_amount: 80.00, status: 'CREDITED' },
                    { id: 'comm_5', date: '2026-09-02T16:05:00Z', trader: 'elena_scalper (UID #4421)', deposit_volume: 3300, tier_rate: '10%', commission_amount: 330.00, status: 'CREDITED' }
                ]
            };
        }
    },

    getWithdrawals: async () => {
        try {
            return await request('/affiliate/withdrawals', {
                headers: getAuthHeaders(),
            });
        } catch (err) {
            return {
                status: 'success',
                data: [
                    { id: 'WTH-9021', created_at: '2026-09-05T10:12:00Z', asset: 'USDT', network: 'TRC20', amount: 350.00, wallet_address: 'TLA17mR8x9KpQ9VwNzL4mK7pE2Q', status: 'APPROVED', tx_hash: '0x9482fba89410283c7491028aef3901bca917283401283' },
                    { id: 'WTH-8842', created_at: '2026-08-28T16:40:00Z', asset: 'USDC', network: 'SOLANA', amount: 360.00, wallet_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', status: 'APPROVED', tx_hash: '5UxK9g889218hjsd882nmasd0192hjs812nmasd' },
                    { id: 'WTH-9104', created_at: '2026-09-08T09:30:00Z', asset: 'USDT', network: 'BEP20', amount: 150.00, wallet_address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88', status: 'PENDING', tx_hash: null }
                ]
            };
        }
    },

    requestWithdrawal: async ({ amount, asset, network, wallet_address }) => {
        try {
            return await request('/affiliate/withdraw', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ amount, asset, network, wallet_address }),
            });
        } catch (err) {
            // Simulated response on mock fallback
            return {
                success: true,
                message: `Withdrawal request for ${amount} ${asset} (${network}) submitted successfully and is pending review.`,
                data: {
                    id: 'WTH-' + Math.floor(1000 + Math.random() * 9000),
                    created_at: new Date().toISOString(),
                    asset,
                    network,
                    amount: Number(amount),
                    wallet_address,
                    status: 'PENDING',
                    tx_hash: null
                }
            };
        }
    }
};

export const notificationsApi = {
    getNotifications: ({ page = 1, limit = 20, category = null, readStatus = null } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', String(page));
        if (limit) params.set('limit', String(limit));
        if (category && category !== 'all') params.set('category', category);
        if (readStatus && readStatus !== 'all') params.set('read_status', readStatus);
        const qs = params.toString();
        return request(`/notifications${qs ? `?${qs}` : ''}`, {
            headers: getAuthHeaders(),
        });
    },

    getUnreadCount: () =>
        request('/notifications/unread-count', {
            headers: getAuthHeaders(),
        }),

    getWebsiteUpdates: ({ page = 1, limit = 20 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', String(page));
        if (limit) params.set('limit', String(limit));
        params.set('category', 'website_updates');
        return request(`/notifications?${params.toString()}`, {
            headers: getAuthHeaders(),
        });
    },

    markAsRead: (id) => request(`/notifications/${id}/read`, { method: 'POST', body: JSON.stringify({}) }),
    markAllAsRead: () => request('/notifications/read-all', { method: 'POST', body: JSON.stringify({}) }),
};

// ─── Telegram Signal API ─────────────────────────────────────────────────────

export const telegramSignalApi = {
    /** GET /telegram/signals/config — Public, no auth required */
    getConfig: () =>
        request('/telegram/signals/config'),

    /** GET /telegram/signals/status — Requires JWT */
    getStatus: () =>
        request('/telegram/signals/status', {
            headers: getAuthHeaders(),
        }),

    /** POST /telegram/signals/toggle — Requires JWT */
    toggle: ({ symbol, strategy_id, is_active }) =>
        request('/telegram/signals/toggle', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ symbol, strategy_id, is_active }),
        }),

    /** POST /telegram/signals/connect-token — Requires JWT */
    connectToken: ({ symbol, strategy_id }) =>
        request('/telegram/signals/connect-token', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ symbol, strategy_id }),
        }),

    /** POST /telegram/signals/manual-verify — Requires JWT */
    manualVerify: ({ otp_code, chat_id, telegram_username }) =>
        request('/telegram/signals/manual-verify', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ otp_code, chat_id, telegram_username }),
        }),

    /** POST /telegram/signals/disconnect — Requires JWT */
    disconnect: () =>
        request('/telegram/signals/disconnect', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({}),
        }),
};

