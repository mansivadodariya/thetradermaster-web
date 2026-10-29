'use client';

/**
 * Socket Helper Utilities
 * URL normalization, candidate endpoints, and symbol sanitization.
 */

export function cleanPairSymbol(symbol) {
    if (!symbol) return 'XAUUSD';
    return String(symbol).replace(/[^A-Z0-9]/gi, '').toUpperCase();
}

export function normalizeTimeframe(tf) {
    if (!tf) return '1h';
    const s = String(tf).trim();
    const upper = s.toUpperCase();
    if (upper === '1' || upper === '1M' || upper === 'M1') return '1m';
    if (upper === '5' || upper === '5M' || upper === 'M5') return '5m';
    if (upper === '15' || upper === '15M' || upper === 'M15') return '15m';
    if (upper === '30' || upper === '30M' || upper === 'M30') return '30m';
    if (upper === '60' || upper === '1H' || upper === 'H1') return '1h';
    if (upper === '240' || upper === '4H' || upper === 'H4') return '4h';
    if (upper === 'D' || upper === '1D' || upper === 'D1') return '1d';
    return s.toLowerCase();
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

    // 1. Primary: Strictly configured WS URL from Environment
    if (envWs) {
        let cleanBase = normalizeWsBase(envWs);
        if (isHttps && cleanBase.startsWith('ws://')) {
            cleanBase = cleanBase.replace(/^ws:\/\//, 'wss://');
        }
        candidates.push(`${cleanBase}/${ep}${qs}`);
    }

    // 2. Secondary: Derived WS URL from configured Backend URL in Environment
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
        const host = backendUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
        const proto = (isHttps || backendUrl.startsWith('https://')) ? 'wss' : 'ws';
        candidates.push(`${proto}://${host}/api/v1/ws/${ep}${qs}`);
    }

    const unique = Array.from(new Set(candidates));
    if (isHttps) {
        return unique.filter((u) => u.startsWith('wss://'));
    }
    return unique;
}

export function getWsEndpointUrl(symbol = 'XAUUSD', timeframe = 'H1', strategyId = 'default', endpoint = 'live') {
    const ep = endpoint === 'strategy' ? 'strategy' : 'live';
    const list = getWsCandidateUrls(symbol, timeframe, strategyId, ep);
    return list[0] || '';
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
