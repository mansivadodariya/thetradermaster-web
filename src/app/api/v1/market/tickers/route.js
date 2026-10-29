import { NextResponse } from 'next/server';
import { serverFetch } from '@/lib/serverFetch';

// In-memory cache for 2 seconds (near real-time)
let cacheData = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 2000;

async function fetchScannerSafe(url, symbols, signal) {
    try {
        const res = await serverFetch(url, {
            method: 'POST',
            timeoutMs: 5000,
            clientSignal: signal,
            closeConnection: true,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TraderMasterApp'
            },
            body: JSON.stringify({
                symbols: { tickers: symbols },
                columns: ['close', 'change', 'Recommend.All']
            }),
            cache: 'no-store'
        });

        if (res.ok) {
            return await res.json();
        }
        await res.body?.cancel().catch(() => {});
        return { data: [] };
    } catch {
        return { data: [] };
    }
}

export async function GET(request) {
    const now = Date.now();
    if (cacheData && now - lastFetchTime < CACHE_TTL_MS) {
        return NextResponse.json({ success: true, data: cacheData, cached: true });
    }

    try {
        const forexSymbols = [
            'FX:EURUSD',
            'FX:GBPUSD',
            'FX:USDJPY',
            'FX:AUDUSD',
            'FX:USDCHF',
            'FX:USDCAD',
            'FX:NZDUSD',
            'FX:GBPJPY',
            'FX:EURJPY',
            'FX:EURGBP',
            'FX:AUDJPY',
            'FX:EURAUD',
            'FX:CADJPY',
            'FX:GBPAUD',
            'FX:EURCAD'
        ];

        const cfdSymbols = [
            'OANDA:XAUUSD',
            'TVC:GOLD',
            'TVC:SILVER',
            'TVC:USOIL'
        ];

        const clientSignal = request?.signal;
        const [forexRes, cfdRes] = await Promise.all([
            fetchScannerSafe('https://scanner.tradingview.com/forex/scan', forexSymbols, clientSignal),
            fetchScannerSafe('https://scanner.tradingview.com/cfd/scan', cfdSymbols, clientSignal)
        ]);

        const resultMap = {};

        const processItems = (items = []) => {
            items.forEach((item) => {
                if (!item || !item.s || !Array.isArray(item.d)) return;
                const rawSymbol = item.s;
                const cleanKey = rawSymbol.split(':').pop().toUpperCase();
                const [close, changePct, score] = item.d;

                if (close === undefined || close === null) return;

                let signal = 'BULLISH';
                if (cleanKey === 'XAUUSD' || cleanKey === 'GOLD') {
                    signal = (changePct ?? 0) >= 0 ? 'STRONG BUY' : 'PULLBACK';
                } else if (score > 0.5) {
                    signal = 'STRONG BUY';
                } else if (score > 0.1) {
                    signal = 'BULLISH';
                } else if (score < -0.5) {
                    signal = 'STRONG SELL';
                } else if (score < -0.1) {
                    signal = 'BEARISH';
                } else {
                    signal = 'CONFLUENCE';
                }

                const isUp = (changePct ?? 0) >= 0;
                const formattedChange = `${isUp ? '+' : ''}${(changePct ?? 0).toFixed(2)}%`;

                // Format price appropriately
                let formattedPrice = '';
                if (cleanKey === 'XAUUSD' || cleanKey === 'GOLD') {
                    formattedPrice = Number(close).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else if (cleanKey.includes('JPY')) {
                    formattedPrice = Number(close).toFixed(3);
                } else if (cleanKey === 'SILVER' || cleanKey === 'XAGUSD') {
                    formattedPrice = Number(close).toFixed(2);
                } else if (cleanKey === 'USOIL') {
                    formattedPrice = Number(close).toFixed(2);
                } else {
                    formattedPrice = Number(close).toFixed(4);
                }

                resultMap[cleanKey] = {
                    price: formattedPrice,
                    rawPrice: close,
                    change: formattedChange,
                    rawChange: changePct,
                    isUp,
                    signal
                };

                if (cleanKey === 'GOLD' && !resultMap['XAUUSD']) {
                    resultMap['XAUUSD'] = resultMap['GOLD'];
                }
                if (cleanKey === 'SILVER' && !resultMap['XAGUSD']) {
                    resultMap['XAGUSD'] = resultMap['SILVER'];
                }
            });
        };

        processItems(forexRes?.data);
        processItems(cfdRes?.data);

        cacheData = resultMap;
        lastFetchTime = now;

        return NextResponse.json({ success: true, data: resultMap });
    } catch (err) {
        console.error('TradingView scanner fetch error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
