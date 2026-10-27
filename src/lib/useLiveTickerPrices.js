'use client';

import { useState, useEffect, useRef } from 'react';
import { cleanPairSymbol } from './unifiedSocket';

/**
 * Calculates a realistic fractional pip delta for live micro-ticks
 */
function getRealisticPipDelta(sym, currentPrice) {
    const direction = Math.random() > 0.48 ? 1 : -1;

    if (sym === 'XAUUSD' || sym.includes('GOLD')) {
        const delta = (Math.random() * 0.35 + 0.08) * direction;
        return Number((currentPrice + delta).toFixed(2));
    }
    if (sym.includes('JPY')) {
        const delta = (Math.random() * 0.016 + 0.004) * direction;
        return Number((currentPrice + delta).toFixed(3));
    }
    // 4 to 5 decimal Forex pairs (EUR/USD, GBP/USD, AUD/USD, USD/CAD, USD/CHF, NZD/USD)
    const delta = (Math.random() * 0.00022 + 0.00005) * direction;
    return Number((currentPrice + delta).toFixed(4));
}

/**
 * Parses a display price string into a float
 */
function parsePriceFloat(str) {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    const clean = String(str).replace(/[^0-9.-]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
}

/**
 * Formats a numeric price to standard ticker string
 */
function formatDisplayPrice(sym, num) {
    if (sym === 'XAUUSD' || sym.includes('GOLD')) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (sym.includes('JPY')) {
        return num.toFixed(3);
    }
    return num.toFixed(4);
}

/**
 * Hook for live real-time market prices across ticker marquees and asset strips.
 * Combines:
 *  1. TradingView scanner real-time quotes via /api/v1/market/tickers
 *  2. Real-time WebSocket ticks & global livePriceUpdate events
 *  3. Dynamic sub-second pip animations with green/red tick flashes
 */
export function useLiveTickerPrices(initialAssets = []) {
    const [assets, setAssets] = useState(initialAssets);
    const [flashMap, setFlashMap] = useState({});
    const flashTimersRef = useRef({});
    const assetsRef = useRef(assets);
    assetsRef.current = assets;

    // Helper to flash an asset's price
    const triggerFlash = (symClean, direction) => {
        if (!direction) return;
        setFlashMap(prev => ({ ...prev, [symClean]: direction }));
        if (flashTimersRef.current[symClean]) {
            clearTimeout(flashTimersRef.current[symClean]);
        }
        flashTimersRef.current[symClean] = setTimeout(() => {
            setFlashMap(prev => ({ ...prev, [symClean]: null }));
        }, 650);
    };

    useEffect(() => {
        let isMounted = true;

        // 1. Fetch live TradingView scanner data from internal API
        const fetchTradingViewData = async () => {
            try {
                const res = await fetch('/api/v1/market/tickers');
                if (!res.ok) return;
                const json = await res.json();
                if (!json?.success || !json?.data || !isMounted) return;

                const liveData = json.data;

                setAssets(prev =>
                    prev.map(asset => {
                        const symClean = cleanPairSymbol(asset.symbol);
                        const live = liveData[symClean];
                        if (!live) return asset;

                        const oldNum = parsePriceFloat(asset.price);
                        const newNum = typeof live.rawPrice === 'number' ? live.rawPrice : parsePriceFloat(live.price);

                        if (oldNum > 0 && newNum > 0 && Math.abs(newNum - oldNum) > 0.000001) {
                            triggerFlash(symClean, newNum > oldNum ? 'up' : 'down');
                        }

                        return {
                            ...asset,
                            price: live.price || asset.price,
                            change: live.change || asset.change,
                            isUp: live.isUp !== undefined ? live.isUp : asset.isUp,
                            signal: live.signal || asset.signal
                        };
                    })
                );
            } catch {
                // Fail gracefully
            }
        };

        // Initial fetch
        fetchTradingViewData();

        // 2. Poll TradingView quotes every 10 seconds for continuous live refresh
        const tvInterval = setInterval(fetchTradingViewData, 10000);

        // 3. Listen for window livePriceUpdate events (from MT5 WebSocket / cockpit stream)
        const handleGlobalPrice = (e) => {
            if (!isMounted) return;
            const detail = e?.detail;
            if (!detail || !detail.symbol || detail.price === undefined) return;
            const symClean = cleanPairSymbol(detail.symbol);
            const newPriceNum = parseFloat(detail.price);
            if (isNaN(newPriceNum) || newPriceNum <= 0) return;

            setAssets(prev =>
                prev.map(asset => {
                    if (cleanPairSymbol(asset.symbol) !== symClean) return asset;
                    const oldNum = parsePriceFloat(asset.price);
                    triggerFlash(symClean, newPriceNum > oldNum ? 'up' : 'down');

                    const isUp = detail.change_percent !== undefined
                        ? detail.change_percent >= 0
                        : (detail.changePercent !== undefined ? detail.changePercent >= 0 : asset.isUp);

                    const changeStr = detail.change_percent !== undefined
                        ? `${detail.change_percent >= 0 ? '+' : ''}${detail.change_percent.toFixed(2)}%`
                        : asset.change;

                    return {
                        ...asset,
                        price: formatDisplayPrice(symClean, newPriceNum),
                        change: changeStr,
                        isUp
                    };
                })
            );
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('livePriceUpdate', handleGlobalPrice);
        }

        // 4. Realistic Pip Micro-Movement Engine
        // Periodically updates 1-2 random pairs with authentic micro pip fluctuations
        const microTickInterval = setInterval(() => {
            if (!isMounted) return;
            const currentList = assetsRef.current;
            if (!Array.isArray(currentList) || currentList.length === 0) return;

            // Pick 1 or 2 random assets
            const count = Math.random() > 0.5 ? 2 : 1;
            const shuffled = [...currentList].sort(() => 0.5 - Math.random());
            const targets = shuffled.slice(0, count);

            setAssets(prev =>
                prev.map(item => {
                    const matched = targets.find(t => cleanPairSymbol(t.symbol) === cleanPairSymbol(item.symbol));
                    if (!matched) return item;

                    const symClean = cleanPairSymbol(item.symbol);
                    const oldNum = parsePriceFloat(item.price);
                    if (oldNum <= 0) return item;

                    const newNum = getRealisticPipDelta(symClean, oldNum);
                    const dir = newNum > oldNum ? 'up' : 'down';
                    triggerFlash(symClean, dir);

                    // Adjust change slightly
                    const currentPct = parseFloat(item.change) || 0;
                    const pipPctDelta = dir === 'up' ? 0.01 : -0.01;
                    const newPct = Number((currentPct + (Math.random() * 0.02 * (dir === 'up' ? 1 : -1))).toFixed(2));
                    const isUp = newPct >= 0;
                    const formattedChange = `${isUp ? '+' : ''}${newPct.toFixed(2)}%`;

                    return {
                        ...item,
                        price: formatDisplayPrice(symClean, newNum),
                        change: formattedChange,
                        isUp
                    };
                })
            );
        }, 2200);

        return () => {
            isMounted = false;
            clearInterval(tvInterval);
            clearInterval(microTickInterval);
            if (typeof window !== 'undefined') {
                window.removeEventListener('livePriceUpdate', handleGlobalPrice);
            }
            Object.values(flashTimersRef.current).forEach(t => clearTimeout(t));
        };
    }, []);

    return { assets, flashMap };
}
