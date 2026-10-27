/**
 * ChronosX Affiliate Service
 * Integration client for connecting to FastAPI / Next.js backend affiliate endpoints.
 */

const getApiBaseUrl = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    return `${backendUrl.replace(/\/+$/, '')}/api/v1`;
};

const getAuthHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };

    if (typeof window !== 'undefined') {
        let token = localStorage.getItem('access_token');
        if (!token && typeof document !== 'undefined') {
            const match = document.cookie.match(/(?:^|;\s*)(?:auth_token|access_token)=([^;]*)/);
            if (match) token = decodeURIComponent(match[1]);
        }
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }
    return headers;
};

const handleResponse = async (res) => {
    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
        const message = data?.detail || data?.message || data?.error || `HTTP error ${res.status}`;
        throw new Error(message);
    }
    return data;
};

const toNum = (val, def = 0) => {
    if (val === undefined || val === null || val === '') return def;
    const n = Number(val);
    return isNaN(n) ? def : n;
};

export const affiliateService = {
    /**
     * Fetch aggregate dashboard metrics, tier status, and referral links
     * GET /api/v1/affiliate/dashboard
     */
    getDashboard: async () => {
        try {
            const url = `${getApiBaseUrl()}/affiliate/dashboard`;
            const res = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result = await handleResponse(res);
            const raw = result?.data || result || {};

            // Normalize nested balance / wallet balances if present
            const bal = (typeof raw.balance === 'object' && raw.balance !== null) ? raw.balance : {};
            const wb = (typeof raw.wallet_balances === 'object' && raw.wallet_balances !== null)
                ? raw.wallet_balances
                : ((typeof raw.wallets === 'object' && raw.wallets !== null)
                    ? raw.wallets
                    : ((typeof raw.balances === 'object' && raw.balances !== null)
                        ? raw.balances
                        : bal));

            const totalEarned = toNum(
                raw.total_earned ?? raw.total_earnings ?? raw.earnings ?? bal.total_earned ?? bal.total_earnings ?? bal.earned ?? bal.earnings ?? wb.total_earned ?? wb.total_earnings ?? wb.earned ?? wb.earnings,
                0
            );
            const withdrawableBalance = toNum(
                raw.withdrawable_balance ?? raw.withdrawable ?? bal.withdrawable_balance ?? bal.withdrawable ?? bal.balance ?? wb.withdrawable_balance ?? wb.withdrawable ?? wb.available_balance ?? wb.available ?? wb.balance,
                0
            );
            const pendingLockBalance = toNum(
                raw.pending_lock_balance ?? raw.pending_withdrawal ?? raw.pending_balance ?? raw.pending ?? bal.pending_lock_balance ?? bal.pending_withdrawal ?? bal.pending_balance ?? bal.pending ?? bal.locked ?? wb.pending_lock_balance ?? wb.pending_withdrawal ?? wb.pending_balance ?? wb.pending ?? wb.locked,
                0
            );
            const totalWithdrawn = toNum(
                raw.total_withdrawn ?? raw.withdrawn ?? bal.total_withdrawn ?? bal.withdrawn ?? wb.total_withdrawn ?? wb.withdrawn,
                0
            );
            const referralCount = toNum(
                raw.total_referrals ?? raw.total_referrals_count ?? raw.referral_count ?? raw.referrals ?? raw.referrals_count,
                0
            );
            const activeTraders = toNum(
                raw.active_traders ?? raw.active_referrals ?? raw.active_users,
                referralCount
            );
            const referralCode = raw.referral_code || raw.code || '';
            const referralLink = raw.referral_link || raw.referral_url || raw.link || raw.url || '';
            const activeRate = toNum(raw.active_commission_rate ?? raw.commission_rate ?? raw.rate, 10);

            // Normalize current tier
            const tierRaw = raw.current_tier || raw.tier;
            let currentTier;
            if (typeof tierRaw === 'object' && tierRaw !== null) {
                currentTier = {
                    level: toNum(tierRaw.level, 1),
                    name: tierRaw.name || (tierRaw.level === 2 ? 'Tier 2 - Pro Partner' : 'Tier 1 - Standard Partner'),
                    rate_percentage: toNum(tierRaw.rate_percentage ?? tierRaw.rate ?? activeRate, activeRate || 10),
                    next_tier_name: tierRaw.next_tier_name || 'Tier 2 - Pro Partner (20%)',
                    next_tier_threshold: toNum(tierRaw.next_tier_threshold, 30),
                    progress_count: toNum(tierRaw.progress_count ?? activeTraders, activeTraders),
                    min_withdrawal: toNum(tierRaw.min_withdrawal, 50)
                };
            } else {
                const tierStr = String(tierRaw || '').toLowerCase();
                const isPro = tierStr.includes('pro') || tierStr.includes('premium') || tierStr === '2';
                currentTier = {
                    level: isPro ? 2 : 1,
                    name: isPro ? 'Tier 2 - Pro Partner' : 'Tier 1 - Standard Partner',
                    rate_percentage: activeRate || (isPro ? 20 : 10),
                    next_tier_name: 'Tier 2 - Pro Partner (20%)',
                    next_tier_threshold: 30,
                    progress_count: activeTraders,
                    min_withdrawal: 50
                };
            }

            return {
                status: 'success',
                data: {
                    total_earned: totalEarned,
                    withdrawable_balance: withdrawableBalance,
                    pending_lock_balance: pendingLockBalance,
                    total_withdrawn: totalWithdrawn,
                    referral_count: referralCount,
                    active_traders: activeTraders,
                    referral_code: referralCode,
                    referral_link: referralLink,
                    active_commission_rate: activeRate,
                    current_tier: currentTier
                }
            };
        } catch (err) {
            console.warn('[affiliateService] getDashboard error:', err?.message);
            return {
                status: 'error',
                message: err?.message || 'Failed to load affiliate dashboard',
                data: {
                    total_earned: 0,
                    withdrawable_balance: 0,
                    pending_lock_balance: 0,
                    total_withdrawn: 0,
                    referral_count: 0,
                    active_traders: 0,
                    referral_code: '',
                    referral_link: '',
                    active_commission_rate: 10,
                    current_tier: {
                        level: 1,
                        name: 'Tier 1 - Standard Partner',
                        rate_percentage: 10,
                        next_tier_name: 'Tier 2 - Pro Partner (20%)',
                        next_tier_threshold: 30,
                        progress_count: 0,
                        min_withdrawal: 50.00
                    }
                }
            };
        }
    },

    /**
     * Fetch paginated commission ledger history
     * GET /api/v1/affiliate/history?page=1&limit=20
     */
    getCommissionHistory: async ({ page = 1, limit = 20 } = {}) => {
        try {
            const url = `${getApiBaseUrl()}/affiliate/history?page=${page}&limit=${limit}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result = await handleResponse(res);
            const rawData = result?.data || result?.items || result?.commissions || result?.history || result;
            const items = Array.isArray(rawData) ? rawData : [];

            const normalizedItems = items.map((item, idx) => ({
                id: item.id || item._id || item.commission_id || item.reference || `comm_${idx + 1}`,
                date: item.date || item.created_at || item.created_time || item.timestamp || item.time || new Date().toISOString(),
                trader: item.trader || item.referred_user_email || item.masked_referee_email || item.referred_user_name || item.referred_user_id || item.user_email || item.user_id || 'Referred Trader',
                deposit_volume: toNum(item.deposit_volume ?? item.order_amount ?? item.base_amount ?? item.amount ?? item.volume, 0),
                tier_rate: item.tier_rate || (item.commission_rate ? `${item.commission_rate}%` : (item.rate_percent ? `${item.rate_percent}%` : '10%')),
                commission_amount: toNum(item.commission_amount ?? item.commission ?? item.amount ?? item.earned_amount, 0),
                status: String(item.status || 'CREDITED').toUpperCase()
            }));

            return {
                status: 'success',
                page,
                limit,
                total: toNum(result?.total ?? result?.count, normalizedItems.length),
                data: normalizedItems
            };
        } catch (err) {
            console.warn('[affiliateService] getCommissionHistory error:', err?.message);
            return {
                status: 'error',
                message: err?.message || 'Failed to load commission history',
                page,
                limit,
                total: 0,
                data: []
            };
        }
    },

    /**
     * Fetch paginated crypto withdrawal history
     * GET /api/v1/affiliate/withdrawals?page=1&limit=20
     */
    getWithdrawalHistory: async ({ page = 1, limit = 20 } = {}) => {
        try {
            const url = `${getApiBaseUrl()}/affiliate/withdrawals?page=${page}&limit=${limit}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result = await handleResponse(res);
            const rawData = result?.data || result?.items || result?.withdrawals || result?.history || result;
            const items = Array.isArray(rawData) ? rawData : [];

            const normalizedItems = items.map((item, idx) => {
                const coin = (item.crypto_currency || item.currency || item.asset || item.coin || 'USDT').toUpperCase();
                return {
                    id: item.id || item._id || item.withdrawal_id || item.reference || `WTH-${9000 + idx}`,
                    created_at: item.created_at || item.date || item.created_time || item.timestamp || new Date().toISOString(),
                    asset: coin,
                    crypto_currency: coin,
                    network: String(item.network || item.chain || 'TRC20').toUpperCase(),
                    amount: toNum(item.amount ?? item.usd_amount ?? item.crypto_amount, 0),
                    wallet_address: item.wallet_address || item.destination_address || item.to_address || item.address || '',
                    status: String(item.status || 'PENDING').toUpperCase(),
                    tx_hash: item.tx_hash || item.transaction_hash || item.hash || null
                };
            });

            return {
                status: 'success',
                page,
                limit,
                total: toNum(result?.total ?? result?.count, normalizedItems.length),
                data: normalizedItems
            };
        } catch (err) {
            console.warn('[affiliateService] getWithdrawalHistory error:', err?.message);
            return {
                status: 'error',
                message: err?.message || 'Failed to load withdrawal history',
                page,
                limit,
                total: 0,
                data: []
            };
        }
    },

    /**
     * Submit new crypto withdrawal request
     * POST /api/v1/affiliate/withdraw
     * Body: { amount, crypto_currency, network, wallet_address }
     */
    requestWithdrawal: async ({ amount, crypto_currency, asset, network, wallet_address }) => {
        const coin = (crypto_currency || asset || 'USDT').toUpperCase();
        const url = `${getApiBaseUrl()}/affiliate/withdraw`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                amount: Number(amount),
                crypto_currency: coin,
                network: String(network || 'TRC20').toUpperCase(),
                wallet_address: String(wallet_address || '').trim()
            }),
        });
        const result = await handleResponse(res);
        return result;
    },

    /**
     * Simulate Purchase Commission Webhook (Testing & Webhook trigger)
     * POST /api/v1/affiliate/purchase-webhook
     * Body: { referred_user_id, plan_name, order_reference, order_amount }
     */
    simulatePurchaseWebhook: async ({ referred_user_id, plan_name, order_reference, order_amount }) => {
        const url = `${getApiBaseUrl()}/affiliate/purchase-webhook`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                referred_user_id,
                plan_name: plan_name || 'Pro',
                order_reference: order_reference || `ORD-${Date.now()}`,
                order_amount: Number(order_amount || 0)
            }),
        });
        const result = await handleResponse(res);
        return result;
    }
};
