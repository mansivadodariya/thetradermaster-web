/**
 * Service to fetch pre-configured and live chart strategies
 */

const FALLBACK_STRATEGIES = [
    { id: '3e8d2b78-0e86-4fdf-9759-338276db1742', name: 'EMA Pullback', description: 'Trend Following EMA Pullback' }
];

function getBackendBase() {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, '');
    }
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WS_LIVE_URL;
    if (wsUrl) {
        try {
            const parsed = new URL(wsUrl);
            const proto = parsed.protocol === 'wss:' ? 'https:' : 'http:';
            return `${proto}//${parsed.host}`;
        } catch (_) {}
    }
    return '';
}

function getWsHttpBase() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WS_LIVE_URL;
    if (wsUrl) {
        try {
            const parsed = new URL(wsUrl);
            const proto = parsed.protocol === 'wss:' ? 'https:' : 'http:';
            return `${proto}//${parsed.host}`;
        } catch (_) {}
    }
    return null;
}

export async function fetchChartStrategies() {
    try {
        const primaryBase = getBackendBase();
        const fallbackBase = getWsHttpBase() || primaryBase;
        let res;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            res = await fetch(`${primaryBase}/api/v1/chart/strategies`, {
                signal: controller.signal,
                headers: {
                    'accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (e) {
            try {
                res = await fetch('/api/v1/chart/strategies');
                if (!res.ok) throw new Error('Proxy failed');
            } catch (err2) {
                res = await fetch(`${fallbackBase}/api/v1/chart/strategies`, {
                    headers: {
                        'accept': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
            }
        }

        if (!res.ok) throw new Error('Failed to fetch strategies');
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.strategies || data.data || []);
        const pullbackList = list.filter(st => {
            const text = `${st.name || ''} ${st.title || ''} ${st.strategy_name || ''} ${st.description || ''}`.toLowerCase();
            return (text.includes('pullback') || text.includes('ema pullback')) && !text.includes('eurusd');
        });

        return pullbackList.length > 0 ? pullbackList : FALLBACK_STRATEGIES;
    } catch (err) {
        return FALLBACK_STRATEGIES;
    }
}
