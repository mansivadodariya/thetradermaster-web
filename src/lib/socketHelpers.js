'use client';

/**
 * Socket Helpers and Utilities
 */

export const BASE_FALLBACK_PRICES = {
    XAUUSD: 4015.00,
    EURUSD: 1.12110,
    GBPUSD: 1.33480,
    USDJPY: 154.200,
    GBPJPY: 209.940,
    EURJPY: 176.320,
    AUDUSD: 0.65400,
    USDCAD: 1.40110,
    USDCHF: 0.88400,
    NZDUSD: 0.59800,
    BTCUSD: 88500.00,
    ETHUSD: 2650.00
};

export function cleanPairSymbol(symbol) {
    if (!symbol) return 'XAUUSD';
    return String(symbol).replace(/[^A-Z0-9]/gi, '').toUpperCase();
}

export function normalizeTimeframe(tf) {
    if (!tf) return 'H1';
    const s = String(tf).trim();
    const upper = s.toUpperCase();
    if (upper === '1' || upper === '1M' || upper === 'M1') return '1m';
    if (upper === '5' || upper === '5M' || upper === 'M5') return '5m';
    if (upper === '15' || upper === '15M' || upper === 'M15') return '15m';
    if (upper === '30' || upper === '30M' || upper === 'M30') return '30m';
    if (upper === '60' || upper === '1H' || upper === 'H1') return 'H1';
    if (upper === '240' || upper === '4H' || upper === 'H4') return 'H4';
    if (upper === 'D' || upper === '1D' || upper === 'D1') return 'D1';
    return s;
}

export function normalizeWsBase(url = '') {
    if (!url) return '';
    let u = url.split('?')[0].replace(/\/+$/, '');
    u = u.replace(/\/live$/, '').replace(/\/strategy$/, '');
    return u;
}

export function getWsCandidateUrls(symbol = 'XAUUSD', timeframe = 'H1', strategyId = 'default', endpoint = 'live') {
    const cleanSym = cleanPairSymbol(symbol);
    const normTf = normalizeTimeframe(timeframe);
    const stratId = strategyId || 'default';
    const qs = `?symbol=${cleanSym}&timeframe=${normTf}&strategy_id=${stratId}`;
    const ep = endpoint === 'strategy' ? 'strategy' : 'live';

    const isHttps = typeof window !== 'undefined' && window.location?.protocol === 'https:';
    const candidates = [];
    const envWs = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WS_LIVE_URL;

    const isPublicHost = (url = '') => {
        const u = url.toLowerCase();
        return u.includes('chronosx.com') || u.includes('thetradermaster.com') ||
               (!u.includes('localhost') && !u.includes('127.0.0.1') && !u.includes('192.168.') && !u.includes('10.'));
    };

    if (envWs) {
        let cleanBase = normalizeWsBase(envWs);
        if (isPublicHost(cleanBase) || isHttps) {
            cleanBase = cleanBase.replace(/^ws:\/\//, 'wss://');
            candidates.push(`${cleanBase}/${ep}${qs}`);
        } else {
            candidates.push(`${cleanBase}/${ep}${qs}`);
            if (cleanBase.startsWith('ws://')) {
                candidates.push(`${cleanBase.replace(/^ws:\/\//, 'wss://')}/${ep}${qs}`);
            }
        }
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
        const isHttp = backendUrl.startsWith('http://');
        const host = backendUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
        if (isPublicHost(host) || isHttps || !isHttp) {
            candidates.push(`wss://${host}/api/v1/ws/${ep}${qs}`);
        } else {
            candidates.push(`ws://${host}/api/v1/ws/${ep}${qs}`);
            candidates.push(`wss://${host}/api/v1/ws/${ep}${qs}`);
        }
    }

    if (!isHttps) {
        if (typeof window !== 'undefined' && window.location) {
            const host = window.location.hostname;
            if (host && (host.includes('localhost') || host.includes('127.0.0.1'))) {
                candidates.push(`ws://${host}:8000/api/v1/ws/${ep}${qs}`);
                candidates.push(`wss://${host}:8000/api/v1/ws/${ep}${qs}`);
            }
        }
    } else if (typeof window !== 'undefined' && window.location) {
        const host = window.location.host;
        candidates.push(`wss://${host}/api/v1/ws/${ep}${qs}`);
    }

    // Remove duplicates while preserving order
    const unique = Array.from(new Set(candidates));
    if (isHttps) {
        // Strict HTTPS protection: filter out any insecure ws:// to avoid mixed content errors
        return unique.filter((u) => u.startsWith('wss://'));
    }
    return unique;
}

export function getWsEndpointUrl(symbol = 'XAUUSD', timeframe = 'H1', strategyId = 'default', endpoint = 'live') {
    const ep = endpoint === 'strategy' ? 'strategy' : 'live';
    const list = getWsCandidateUrls(symbol, timeframe, strategyId, ep);
    return list[0];
}

export function safeCloseSocket(ws) {
    if (!ws) return;
    try {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        } else if (ws.readyState === WebSocket.CONNECTING) {
            ws.onopen = () => {
                try { ws.close(); } catch (_) {}
            };
            ws.onmessage = null;
            ws.onerror = null;
        }
    } catch (_) {}
}
