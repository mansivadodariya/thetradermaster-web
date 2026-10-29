import { unifiedSocket } from './unifiedSocket';

/**
 * Global Chart Store & Service Manager
 * Handles single API hit deduplication for HTTP candle fetches and WebSocket live connections per pair/timeframe.
 */

// Dynamic Symbol Precision Utility
export function getSymbolPrecision(symbol) {
    const sym = (symbol || '').replace('/', '').toUpperCase();
    if (sym.includes('JPY')) {
        return { precision: 3, minMove: 0.001 };      // Yen Pairs (3 Decimals: USDJPY, GBPJPY)
    } else if (sym.includes('XAU') || sym.includes('BTC') || sym.includes('GOLD') || sym.includes('ETH')) {
        return { precision: 2, minMove: 0.01 };       // Gold / Commodities (2 Decimals: XAUUSD)
    } else {
        return { precision: 5, minMove: 0.00001 };    // Standard Forex (5 Decimals: EURUSD, NZDUSD, GBPUSD, AUDUSD, USDCAD, USDCHF)
    }
}

export function applySymbolPrecision(series, symbol) {
    if (!series || !symbol) return;
    const sym = symbol.replace('/', '').toUpperCase();
    const precision = sym.includes('JPY') ? 3 : ((sym.includes('XAU') || sym.includes('BTC')) ? 2 : 5);
    const minMove = sym.includes('JPY') ? 0.001 : ((sym.includes('XAU') || sym.includes('BTC')) ? 0.01 : 0.00001);
    series.applyOptions({ priceFormat: { type: 'price', precision, minMove } });
}

// Robust Universal UTC Candle Timestamp Normalizer
export function parseCandleTimestamp(rawTime) {
    if (!rawTime) return Math.floor(Date.now() / 1000);
    if (typeof rawTime === 'number') {
        return rawTime > 1e11 ? Math.floor(rawTime / 1000) : rawTime;
    }
    const str = String(rawTime).trim();
    if (!isNaN(Number(str))) {
        const num = Number(str);
        return num > 1e11 ? Math.floor(num / 1000) : num;
    }
    let iso = str.replace(' ', 'T');
    if (!iso.endsWith('Z') && !iso.includes('+') && (iso.length === 19 || (iso.includes('T') && iso.split('T')[1]?.length === 8))) {
        iso = `${iso}Z`;
    }
    const parsed = Math.floor(new Date(iso).getTime() / 1000);
    return isNaN(parsed) ? Math.floor(Date.now() / 1000) : parsed;
}

// 1. Single HTTP REST API Fetch Cache & Deduplication
const activeFetches = new Map();

export async function fetchChartCandlesOnce(symbol, timeframe = '15m', strategyId = '3e8d2b78-0e86-4fdf-9759-338276db1742') {
    const cleanSymbol = (symbol || 'XAUUSD').replace('/', '').toUpperCase();
    const key = `${cleanSymbol}:${timeframe}:${strategyId}`;

    if (activeFetches.has(key)) {
        return activeFetches.get(key);
    }

    const fetchPromise = (async () => {
        const candidateEndpoints = [];

        // 1. Configured Backend URL from ENV
        const envBackend = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/+$/, '');
        const ts = Date.now();
        if (envBackend) {
            candidateEndpoints.push(`${envBackend}/api/v1/chart/candles?symbol=${cleanSymbol}&timeframe=${timeframe}&strategy_id=${strategyId}&_t=${ts}`);
        }

        // 2. Internal Next.js API route (Proxies to Backend / Supabase)
        if (typeof window !== 'undefined') {
            candidateEndpoints.push(`/api/v1/chart/candles?symbol=${cleanSymbol}&timeframe=${timeframe}&strategy_id=${strategyId}&_t=${ts}`);
        }

        // Try candidates sequentially
        for (const url of candidateEndpoints) {
            try {
                const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                const timeoutId = controller ? setTimeout(() => controller.abort(), 7000) : null;

                const res = await fetch(url, {
                    cache: 'no-store',
                    headers: {
                        'accept': 'application/json',
                        'cache-control': 'no-cache, no-store, must-revalidate',
                        'pragma': 'no-cache',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    signal: controller ? controller.signal : undefined
                });

                if (timeoutId) clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    const rawCandles = Array.isArray(data) ? data : (data?.candles || data?.data || []);
                    if (Array.isArray(rawCandles) && rawCandles.length > 0) {
                        return data;
                    }
                }
            } catch (_) {
                // Try next endpoint
            }
        }

        return { candles: [] };
    })()
    .then((data) => {
        setTimeout(() => {
            activeFetches.delete(key);
        }, 500);
        return data;
    })
    .catch((err) => {
        activeFetches.delete(key);
        return { candles: [] };
    });

    activeFetches.set(key, fetchPromise);
    return fetchPromise;
}

// 2. Shared Singleton WebSocket Manager (Powered by Unified MT5 Live WebSocket)
export function subscribeLiveCandles(symbol, timeframe, onCandleUpdate) {
    return unifiedSocket.subscribeCandles(onCandleUpdate, symbol, timeframe);
}

