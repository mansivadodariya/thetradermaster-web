'use client';

import { getStoredUser, getStoredUserId } from '@/lib/authSession';

const BASE_URL = `${(process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/+$/, '')}/api/v1`;

function getAuthHeaders() {
    let token = '';
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('access_token');
        if (!token && typeof document !== 'undefined') {
            const match = document.cookie.match(/(?:^|;\s*)(?:auth_token|access_token)=([^;]*)/);
            if (match) token = decodeURIComponent(match[1]);
        }
    }
    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };
}

export const PLAN_TIERS = {
    free: 0,
    starter: 1,
    growth: 2,
    pro: 3,
};

export const subscriptionApi = {
    /**
     * 1. GET /api/v1/subscription/current
     * Fetches real active subscription details for current logged-in user
     */
    getCurrentSubscription: async () => {
        try {
            const res = await fetch(`${BASE_URL}/subscription/current`, {
                headers: getAuthHeaders(),
                cache: 'no-store',
            });
            if (res.ok) {
                const json = await res.json();
                return json?.data || json;
            }
        } catch (err) {
            console.warn('[subscriptionApi] Failed to fetch current subscription:', err);
        }

        return {
            has_active_plan: false,
            active_subscription: null,
        };
    },

    /**
     * 2. POST /api/v1/subscription/check-eligibility
     * Check plan eligibility for upgrade, downgrade, or renewal
     */
    checkEligibility: async (targetPlanId) => {
        try {
            const res = await fetch(`${BASE_URL}/subscription/check-eligibility`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ target_plan_id: String(targetPlanId) }),
            });
            if (res.ok) {
                const json = await res.json();
                return json?.data || json;
            }
            const errJson = await res.json().catch(() => ({}));
            return {
                allowed: true,
                action_type: 'SUBSCRIBE',
                message: errJson?.detail || '',
            };
        } catch (err) {
            console.warn('[subscriptionApi] Eligibility check failed:', err);
            return {
                allowed: true,
                action_type: 'SUBSCRIBE',
                message: '',
            };
        }
    },

    /**
     * 3. POST /api/v1/payments/validate-coupon
     * Validates discount coupon against target plan directly via backend
     */
    validateCoupon: async (code, planId) => {
        const cleanCode = String(code || '').trim().toUpperCase();
        if (!cleanCode) {
            throw new Error('Please enter a coupon code.');
        }

        const res = await fetch(`${BASE_URL}/payments/validate-coupon`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                code: cleanCode,
                plan_id: String(planId),
            }),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            const errorMsg = json?.detail || json?.message || 'Invalid or expired coupon code.';
            throw new Error(errorMsg);
        }

        return json?.data || json;
    },

    /**
     * 4. POST /api/v1/payments/calculate-summary
     * Calculates itemized financial breakdown directly with backend
     */
    calculateSummary: async ({ planId, plan, couponCode = null, coupon = null }) => {
        const effectivePlanId = planId || plan?.id;
        const effectiveCouponCode = couponCode || coupon?.code || (typeof coupon === 'string' ? coupon : null);

        if (!effectivePlanId) {
            throw new Error('Plan ID is required to calculate summary.');
        }

        const res = await fetch(`${BASE_URL}/payments/calculate-summary`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                plan_id: String(effectivePlanId),
                coupon_code: effectiveCouponCode ? String(effectiveCouponCode).trim() : null,
            }),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            const errorMsg = json?.detail || json?.message || 'Failed to calculate payment summary.';
            throw new Error(errorMsg);
        }

        const data = json?.data || json;
        return {
            plan_id: data.plan_id || effectivePlanId,
            plan_name: data.plan_name || plan?.name || '',
            base_price: Number(data.subtotal ?? data.original_price ?? data.base_price ?? data.price ?? plan?.price ?? 0),
            discount_amount: Number(data.discount_amount ?? data.discount ?? 0),
            tax_rate: Number(data.tax_rate ?? 0),
            tax_amount: Number(data.tax_amount ?? data.tax ?? 0),
            final_amount: Number(data.final_amount ?? data.total_amount ?? data.total ?? data.final_price ?? data.net_payable ?? plan?.price ?? 0),
            currency: data.currency || plan?.currency || 'USDT',
            coupon: data.coupon || null,
        };
    },

    /**
     * 5. POST /api/v1/payments/create-session
     * Creates checkout session with backend ledger entry
     */
    createPaymentSession: async ({ planId, plan, couponCode = null, gateway = 'STRIPE' }) => {
        const effectivePlanId = planId || plan?.id;
        const origin = typeof window !== 'undefined' ? window.location.origin : '';

        // Normalize gateway to STRIPE or CREGIS / CRYPTO
        const effectiveGateway = (gateway === 'CARD' || gateway === 'STRIPE') ? 'STRIPE' : 'CREGIS';

        const payload = {
            plan_id: String(effectivePlanId),
            coupon_code: couponCode ? String(couponCode).trim() : null,
            gateway: effectiveGateway,
            success_url: `${origin}/subscription-plans?payment_status=success&plan_id=${effectivePlanId}`,
            cancel_url: `${origin}/subscription-plans?payment_status=failed&plan_id=${effectivePlanId}&reason=payment_cancelled`,
        };

        const res = await fetch(`${BASE_URL}/payments/create-session`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            const errorMsg = json?.detail || json?.message || 'Failed to initialize payment session.';
            throw new Error(errorMsg);
        }

        return json?.data || json;
    },

    /**
     * 6. GET /api/v1/payments/history
     * Get real payment transaction history for current logged-in user
     */
    getPaymentHistory: async () => {
        try {
            const res = await fetch(`${BASE_URL}/payments/history`, {
                headers: getAuthHeaders(),
                cache: 'no-store',
            });
            if (res.ok) {
                const json = await res.json();
                const history = json?.data || json;
                if (Array.isArray(history)) return history;
            }
        } catch (err) {
            console.warn('[subscriptionApi] Failed to fetch payment history:', err);
        }

        return [];
    },

    /**
     * 7. GET /api/v1/payments/invoices/{invoice_number}/download
     * Download or retrieve invoice details for a payment
     */
    downloadInvoice: async (invoiceNumber) => {
        if (!invoiceNumber) {
            throw new Error('Invoice number is required.');
        }

        const res = await fetch(`${BASE_URL}/payments/invoices/${encodeURIComponent(invoiceNumber)}/download`, {
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            throw new Error(json?.detail || 'Failed to download invoice PDF.');
        }

        const contentType = (res.headers.get('content-type') || '').toLowerCase();
        const contentDisposition = (res.headers.get('content-disposition') || '').toLowerCase();

        // Helper to trigger direct browser file download
        const triggerBlobDownload = (blob, filename) => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename || `Invoice-${invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        };

        // 1. Binary stream / PDF / Octet / Attachment
        if (
            contentType.includes('pdf') ||
            contentType.includes('octet-stream') ||
            contentDisposition.includes('attachment') ||
            contentDisposition.includes('filename') ||
            (!contentType.includes('json') && !contentType.includes('text'))
        ) {
            const blob = await res.blob();
            if (blob && blob.size > 0) {
                const pdfBlob = blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' });
                triggerBlobDownload(pdfBlob, `Invoice-${invoiceNumber}.pdf`);
                return { downloaded: true };
            }
        }

        // 2. If response is JSON containing a file download URL or base64
        const json = await res.json().catch(() => ({}));

        const fileUrl =
            (typeof json === 'string' && json.startsWith('http') ? json : null) ||
            (typeof json?.data === 'string' && json.data.startsWith('http') ? json.data : null) ||
            json?.download_url ||
            json?.data?.download_url ||
            json?.url ||
            json?.data?.url ||
            json?.pdf_url ||
            json?.data?.pdf_url ||
            json?.invoice_url ||
            json?.data?.invoice_url ||
            json?.file_url ||
            json?.data?.file_url ||
            json?.receipt_url ||
            json?.data?.receipt_url;

        if (fileUrl) {
            try {
                const fileFetch = await fetch(fileUrl);
                if (fileFetch.ok) {
                    const blob = await fileFetch.blob();
                    triggerBlobDownload(blob, `Invoice-${invoiceNumber}.pdf`);
                    return { downloaded: true, url: fileUrl };
                }
            } catch (_) {}

            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = `Invoice-${invoiceNumber}.pdf`;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return { downloaded: true, url: fileUrl };
        }

        const base64 =
            json?.base64 ||
            json?.pdf_base64 ||
            json?.pdf ||
            json?.data?.base64 ||
            json?.data?.pdf_base64 ||
            json?.data?.pdf;

        if (base64 && typeof base64 === 'string') {
            try {
                const clean = base64.replace(/^data:application\/pdf;base64,/, '').trim();
                const binaryString = window.atob(clean);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: 'application/pdf' });
                triggerBlobDownload(blob, `Invoice-${invoiceNumber}.pdf`);
                return { downloaded: true };
            } catch (b64Err) {
                console.warn('[subscriptionApi] Failed to decode base64 invoice:', b64Err);
            }
        }

        return { downloaded: false, data: json };
    },

    /**
     * 8. GET /api/v1/payments/return
     * Query return verification from backend
     */
    verifyPaymentReturn: async (orderId, statusParam = 'success', reason = '') => {
        try {
            const query = new URLSearchParams({
                order_id: String(orderId),
                status_param: String(statusParam),
            });
            if (reason) query.set('reason', String(reason));

            const res = await fetch(`${BASE_URL}/payments/return?${query.toString()}`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const json = await res.json().catch(() => ({}));
                return json?.data || json;
            }
        } catch (err) {
            console.warn('[subscriptionApi] Return verification warning:', err);
        }
        return null;
    },

    /**
     * 9. POST /api/v1/deposit/create (Cregis Crypto Deposit)
     * Cregis / Crypto deposit creation
     */
    createCryptoDeposit: async ({ amount, planId, plan_id, currency = 'USDT', chain = 'TRON' }) => {
        const resolvedPlanId = planId ?? plan_id;
        const payload = {
            amount: Number(amount),
            currency: currency || 'USDT',
            chain: chain || 'TRON',
            plan_id: resolvedPlanId !== undefined && resolvedPlanId !== null ? String(resolvedPlanId) : null,
        };

        // Attempt live Cregis endpoint /deposit/create first
        let res = await fetch(`${BASE_URL}/deposit/create`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        // Fallback to /deposit/cregis/create-request if /deposit/create returns 404
        if (res.status === 404) {
            res = await fetch(`${BASE_URL}/deposit/cregis/create-request`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
        }

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(json?.detail || json?.message || 'Failed to create crypto deposit.');
        }
        if (json && typeof json === 'object' && json.data && typeof json.data === 'object' && !Array.isArray(json.data)) {
            return { ...json, ...json.data, data: json.data };
        }
        return json?.data || json;
    },

    /**
     * Helper to safely extract redirect checkout URL from gateway response
     */
    extractCheckoutUrl: (res) => {
        if (!res) return null;
        if (typeof res === 'string' && (res.startsWith('http://') || res.startsWith('https://'))) {
            return res;
        }
        const candidate =
            res.checkout_url ||
            res.data?.checkout_url ||
            res.payment_url ||
            res.data?.payment_url ||
            res.pay_url ||
            res.data?.pay_url ||
            res.redirect_url ||
            res.data?.redirect_url ||
            res.web_url ||
            res.data?.web_url ||
            res.url ||
            res.data?.url ||
            res.payment_info?.data?.checkout_url ||
            res.payment_info?.checkout_url ||
            res.data?.payment_info?.data?.checkout_url ||
            res.data?.payment_info?.checkout_url ||
            res.payment_info?.url;
        return typeof candidate === 'string' ? candidate : null;
    },
};

