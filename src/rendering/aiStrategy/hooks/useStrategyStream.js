'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { unifiedSocket, getWsEndpointUrl } from '@/lib/unifiedSocket';

// Pair Metadata Registry
export const PAIR_METADATA_MAP = {
    'EUR/USD': { fullName: 'Euro/US Dollar', short: 'EUR/USD', market: 'Forex' },
    'GBP/USD': { fullName: 'British Pound/US Dollar', short: 'GBP/USD', market: 'Forex' },
    'XAU/USD': { fullName: 'Gold/US Dollar', short: 'XAU/USD', market: 'Commodities' },
    'USD/CAD': { fullName: 'US Dollar/Canadian Dollar', short: 'USD/CAD', market: 'Forex' },
    'GBP/JPY': { fullName: 'British Pound/Japanese Yen', short: 'GBP/JPY', market: 'Forex' },
    'EUR/JPY': { fullName: 'Euro/Japanese Yen', short: 'EUR/JPY', market: 'Forex' },
    'USD/JPY': { fullName: 'US Dollar/Japanese Yen', short: 'USD/JPY', market: 'Forex' },
    'AUD/USD': { fullName: 'Australian Dollar/US Dollar', short: 'AUD/USD', market: 'Forex' },
    'NZD/USD': { fullName: 'New Zealand Dollar/US Dollar', short: 'NZD/USD', market: 'Forex' },
    'USD/CHF': { fullName: 'US Dollar/Swiss Franc', short: 'USD/CHF', market: 'Forex' },
};

// Robust normalizer for incoming WebSocket symbols (e.g. "EURO / US DOLLAR" -> "EUR/USD")
export const normalizePairInfo = (rawSymbol = '', rawDisplayName = '') => {
    const raw = (rawDisplayName || rawSymbol || '').trim();
    const upper = raw.toUpperCase();

    // 1. Direct short code matches first
    if (upper === 'EURUSD' || upper === 'EUR/USD') return PAIR_METADATA_MAP['EUR/USD'];
    if (upper === 'GBPUSD' || upper === 'GBP/USD') return PAIR_METADATA_MAP['GBP/USD'];
    if (upper === 'XAUUSD' || upper === 'XAU/USD' || upper === 'GOLD') return PAIR_METADATA_MAP['XAU/USD'];
    if (upper === 'USDCAD' || upper === 'USD/CAD') return PAIR_METADATA_MAP['USD/CAD'];
    if (upper === 'GBPJPY' || upper === 'GBP/JPY') return PAIR_METADATA_MAP['GBP/JPY'];
    if (upper === 'EURJPY' || upper === 'EUR/JPY') return PAIR_METADATA_MAP['EUR/JPY'];
    if (upper === 'USDJPY' || upper === 'USD/JPY') return PAIR_METADATA_MAP['USD/JPY'];
    if (upper === 'AUDUSD' || upper === 'AUD/USD') return PAIR_METADATA_MAP['AUD/USD'];
    if (upper === 'NZDUSD' || upper === 'NZD/USD') return PAIR_METADATA_MAP['NZD/USD'];
    if (upper === 'USDCHF' || upper === 'USD/CHF') return PAIR_METADATA_MAP['USD/CHF'];

    // 2. Specific composite currency name matchers (check JPY pairs before USD pairs)
    if (upper.includes('GOLD') || upper.includes('XAU')) return PAIR_METADATA_MAP['XAU/USD'];
    if ((upper.includes('GBP') || upper.includes('BRITISH') || upper.includes('POUND')) && (upper.includes('JPY') || upper.includes('YEN') || upper.includes('JAPANESE'))) return PAIR_METADATA_MAP['GBP/JPY'];
    if ((upper.includes('EUR') || upper.includes('EURO')) && (upper.includes('JPY') || upper.includes('YEN') || upper.includes('JAPANESE'))) return PAIR_METADATA_MAP['EUR/JPY'];
    if ((upper.includes('USD') || upper.includes('DOLLAR')) && (upper.includes('JPY') || upper.includes('YEN') || upper.includes('JAPANESE'))) return PAIR_METADATA_MAP['USD/JPY'];
    if ((upper.includes('CAD') || upper.includes('CANADIAN')) && (upper.includes('USD') || upper.includes('DOLLAR'))) return PAIR_METADATA_MAP['USD/CAD'];
    if ((upper.includes('CHF') || upper.includes('SWISS') || upper.includes('FRANC')) && (upper.includes('USD') || upper.includes('DOLLAR'))) return PAIR_METADATA_MAP['USD/CHF'];
    if ((upper.includes('AUD') || upper.includes('AUSTRALIAN')) && (upper.includes('USD') || upper.includes('DOLLAR'))) return PAIR_METADATA_MAP['AUD/USD'];
    if ((upper.includes('NZD') || upper.includes('NEW ZEALAND')) && (upper.includes('USD') || upper.includes('DOLLAR'))) return PAIR_METADATA_MAP['NZD/USD'];
    if ((upper.includes('EUR') || upper.includes('EURO')) && (upper.includes('USD') || upper.includes('DOLLAR'))) return PAIR_METADATA_MAP['EUR/USD'];
    if ((upper.includes('GBP') || upper.includes('BRITISH') || upper.includes('POUND')) && (upper.includes('USD') || upper.includes('DOLLAR'))) return PAIR_METADATA_MAP['GBP/USD'];

    // Standard 6 character currency tickers (e.g., "EURUSD")
    const cleanLetters = raw.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (cleanLetters.length === 6) {
        const short = `${cleanLetters.slice(0, 3)}/${cleanLetters.slice(3)}`;
        if (PAIR_METADATA_MAP[short]) return PAIR_METADATA_MAP[short];
        return { fullName: short, short, market: 'Forex' };
    }

    if (raw.includes('/')) {
        const short = raw.replace(/\s+/g, '').toUpperCase();
        if (PAIR_METADATA_MAP[short]) return PAIR_METADATA_MAP[short];
        return { fullName: short, short, market: 'Forex' };
    }

    return {
        fullName: raw || 'Forex Pair',
        short: raw || 'PAIR',
        market: 'Forex',
    };
};

export const formatShortPair = (sym = '') => {
    return normalizePairInfo(sym).short;
};

// Format currency price with proper decimals and optional prefix
export const formatDisplayValue = (val, shortPair = '') => {
    if (val === undefined || val === null || val === '') return '-';
    let str = String(val).trim();
    if (str.startsWith('$')) return str;
    const num = Number(str.replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return `$${str}`;

    const s = String(shortPair).toUpperCase();
    if (s.includes('JPY')) {
        return `$${num.toFixed(3)}`;
    }
    if (s.includes('XAU') || s.includes('GOLD')) {
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (num < 10) {
        return `$${num.toFixed(5)}`;
    }
    return `$${num.toFixed(2)}`;
};

// Generate realistic starter candles for fallback / initial state
export function createSampleCandles(basePrice, direction, count = 25) {
    const isUp = direction === 'BUY';
    const candles = [];
    const now = Math.floor(Date.now() / 1000) - count * 180;
    let curr = basePrice;
    const stepSize = basePrice > 100 ? 0.8 : 0.0004;

    for (let i = 0; i < count; i++) {
        const delta = (Math.random() - (isUp ? 0.42 : 0.58)) * stepSize;
        const open = curr;
        const close = open + delta;
        const high = Math.max(open, close) + Math.random() * (stepSize * 0.6);
        const low = Math.min(open, close) - Math.random() * (stepSize * 0.6);
        curr = close;
        candles.push({
            time: now + i * 180,
            open: parseFloat(open.toFixed(basePrice > 100 ? 2 : 5)),
            high: parseFloat(high.toFixed(basePrice > 100 ? 2 : 5)),
            low: parseFloat(low.toFixed(basePrice > 100 ? 2 : 5)),
            close: parseFloat(close.toFixed(basePrice > 100 ? 2 : 5)),
        });
    }
    return candles;
}

export const STRATEGY_PAIRS = [
    'XAU/USD',
    'EUR/USD',
    'GBP/USD',
    'USD/CAD',
    'GBP/JPY',
    'EUR/JPY'
];

export const DEFAULT_SETUPS_LIST = [];

// Helper to convert any setup item into standard normalized structure
export const normalizeSetupItem = (item) => {
    if (!item) return null;
    const meta = normalizePairInfo(item.symbol, item.display_name);
    const sig = item.signal || item;
    const direction = (sig.direction || item.direction || 'BUY').toUpperCase();
    const strategyName = item.strategy_name || 'EMA Pullback';

    const entry = sig.entry_price ?? sig.entry_target ?? sig.entry ?? 0;
    const sl = sig.stop_loss ?? sig.sl ?? 0;
    const tp = sig.take_profit ?? sig.take_profit_1 ?? sig.tp_1 ?? sig.tp ?? 0;

    const entryDisplay = formatDisplayValue(sig.entry_display || entry, meta.short);
    const slDisplay = formatDisplayValue(sig.sl_display || sl, meta.short);
    const tpDisplay = formatDisplayValue(sig.tp_display || tp, meta.short);

    const timeAgo = sig.time_ago || sig.status_label || (sig.timestamp ? `${Math.max(1, Math.round((Date.now()/1000 - sig.timestamp)/60))}m ago` : 'Live Trigger');
    const riskReward = sig.risk_reward || sig.rr || sig.confluence?.risk_reward || '1:3.0';
    const volumeStrength = sig.confluence?.volume_strength || sig.volume_strength || (sig.indicators?.rvol ? (sig.indicators.rvol >= 1.2 ? 'STRONG' : 'MODERATE') : 'MODERATE');
    const tags = Array.isArray(sig.tags) && sig.tags.length > 0
        ? sig.tags
        : [strategyName, direction === 'BUY' ? 'UPTREND' : 'DOWNTREND'];

    const miniCandles = Array.isArray(sig.mini_candles) && sig.mini_candles.length > 0
        ? sig.mini_candles
        : (Array.isArray(item.candles) ? item.candles.slice(-25) : createSampleCandles(entry || 1.15, direction, 25));

    return {
        symbol: item.symbol || meta.short,
        display_name: item.display_name || meta.fullName,
        pair_id: item.pair_id || meta.short.toLowerCase().replace('/', ''),
        strategy_id: item.strategy_id || '',
        strategy_name: strategyName,
        meta,
        signal: {
            active: sig.active !== false,
            status: sig.status || 'RECENT',
            status_label: sig.status_label || timeAgo,
            direction,
            direction_display: sig.direction_display || (direction === 'BUY' ? '↑ BUY' : '↓ SELL'),
            entry,
            entry_display: entryDisplay,
            sl,
            sl_display: slDisplay,
            tp,
            tp_display: tpDisplay,
            time_ago: timeAgo,
            risk_reward: riskReward,
            rr: sig.rr || `R:R ${String(riskReward).replace('1:', '')}`,
            confluence: {
                volume_strength: volumeStrength,
                risk_reward: sig.confluence?.risk_reward || `Risk Reward: ${riskReward}`,
                risk_level: sig.confluence?.risk_level || 'LOW',
            },
            indicators: sig.indicators || { rsi: 60, rvol: 1.2 },
            tags,
            mini_candles: miniCandles,
            sparkline: Array.isArray(sig.sparkline) ? sig.sparkline : [],
        },
    };
};

export function createSetupFromRealCandles(symbol, candleData) {
    const meta = normalizePairInfo(symbol);
    const candles = Array.isArray(candleData?.candles)
        ? candleData.candles
        : Array.isArray(candleData?.data)
            ? candleData.data
            : Array.isArray(candleData)
                ? candleData
                : [];

    if (candles.length === 0) {
        return null;
    }

    const last = candles[candles.length - 1];
    const prev = candles.length > 6 ? candles[candles.length - 7] : candles[0];
    const entry = Number(last.close || last.open || 0);
    const isUp = entry >= Number(prev.close || prev.open || entry);
    const direction = isUp ? 'BUY' : 'SELL';

    // Estimate ATR from last 14 candles
    const recent = candles.slice(-14);
    let totalRange = 0;
    recent.forEach((c) => {
        totalRange += (Number(c.high || c.close) - Number(c.low || c.open));
    });
    const atr = recent.length > 0 ? (totalRange / recent.length) : (entry * 0.002);

    const sl = direction === 'BUY'
        ? +(entry - atr * 1.5).toFixed(entry > 100 ? 2 : 5)
        : +(entry + atr * 1.5).toFixed(entry > 100 ? 2 : 5);

    const tp = direction === 'BUY'
        ? +(entry + atr * 4.5).toFixed(entry > 100 ? 2 : 5)
        : +(entry - atr * 4.5).toFixed(entry > 100 ? 2 : 5);

    return {
        symbol: meta.short,
        display_name: meta.fullName,
        pair_id: meta.short.toLowerCase().replace('/', ''),
        strategy_name: 'EMA Pullback',
        direction,
        signal: {
            direction,
            entry,
            entry_display: formatDisplayValue(entry, meta.short),
            sl,
            sl_display: formatDisplayValue(sl, meta.short),
            tp,
            tp_display: formatDisplayValue(tp, meta.short),
            time_ago: 'Live Trigger',
            risk_reward: '1:3.0',
            rr: '1:3.0',
            confluence: {
                volume_strength: 'MODERATE',
                risk_reward: '1:3.0',
                risk_level: 'LOW'
            },
            tags: ['EMA Pullback', direction === 'BUY' ? 'UPTREND' : 'DOWNTREND'],
            mini_candles: candles.slice(-25)
        }
    };
}

export const getStrategyWebSocketUrl = (symbol = 'EURUSD', timeframe = '1h', strategyId = 'default') => {
    return getWsEndpointUrl(symbol, timeframe, strategyId, 'strategy');
};

export function useStrategyStream() {
    const [loading, setLoading] = useState(true);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const initialLoadedRef = useRef(false);
    const [setupsList, setSetupsList] = useState([]);
    const [setups, setSetups] = useState({});
    const [wsStatus, setWsStatus] = useState(() => (typeof window !== 'undefined' ? unifiedSocket.getStatus() : 'connecting'));
    const isUnmountingRef = useRef(false);

    const handleIncomingSetups = useCallback((rawSetups) => {
        if (!rawSetups) return;

        const incomingArray = Array.isArray(rawSetups)
            ? rawSetups
            : typeof rawSetups === 'object'
                ? Object.values(rawSetups)
                : [];

        if (incomingArray.length === 0) return;

        const normalizedItems = incomingArray.map(normalizeSetupItem).filter(Boolean);
        if (normalizedItems.length === 0) return;

        // Prevent a single lone socket event from prematurely rendering 1 card before all pair setups arrive
        if (!initialLoadedRef.current && incomingArray.length < 2) {
            setSetups((prevDict) => {
                const updated = { ...prevDict };
                normalizedItems.forEach((it) => {
                    const existing = updated[it.meta.short] || {};
                    updated[it.meta.short] = { ...existing, ...it };
                });
                return updated;
            });
            return;
        }

        setSetupsList((prevList) => {
            const listMap = new Map();
            prevList.forEach((it) => listMap.set(it.meta.short, it));
            normalizedItems.forEach((it) => {
                const existing = listMap.get(it.meta.short);
                if (existing) {
                    listMap.set(it.meta.short, {
                        ...existing,
                        ...it,
                        signal: {
                            ...existing.signal,
                            ...it.signal,
                        }
                    });
                } else {
                    listMap.set(it.meta.short, it);
                }
            });
            return Array.from(listMap.values());
        });

        setSetups((prevDict) => {
            const updated = { ...prevDict };
            normalizedItems.forEach((it) => {
                const existing = updated[it.meta.short] || {};
                const merged = {
                    ...existing,
                    ...it,
                    signal: {
                        ...(existing.signal || {}),
                        ...it.signal,
                    }
                };
                updated[it.meta.short] = merged;
                updated[it.symbol] = merged;
                if (it.display_name) updated[it.display_name] = merged;
            });
            return updated;
        });

        if (initialLoadedRef.current || incomingArray.length >= 2) {
            setLoading(false);
        }
    }, []);

    // Load real live candle data for all 6 pairs dynamically on mount
    useEffect(() => {
        let isCancelled = false;

        async function fetchAllPairSetups() {
            try {
                const results = await Promise.all(
                    STRATEGY_PAIRS.map(async (pair) => {
                        const cleanSym = pair.replace(/[^A-Z0-9]/gi, '');
                        try {
                            const res = await fetch(`/api/v1/chart/candles?symbol=${cleanSym}&timeframe=1h&limit=30`);
                            if (res.ok) {
                                const data = await res.json();
                                return createSetupFromRealCandles(pair, data);
                            }
                        } catch (err) {
                            console.warn(`[StrategyStream] Failed to fetch candles for ${pair}:`, err);
                        }
                        return null;
                    })
                );

                const validSetups = results.filter(Boolean);
                if (!isCancelled && validSetups.length > 0) {
                    initialLoadedRef.current = true;
                    setInitialLoaded(true);
                    handleIncomingSetups(validSetups);
                }
            } catch (err) {
                console.error('[StrategyStream] Error loading live pair setups:', err);
            } finally {
                if (!isCancelled) {
                    initialLoadedRef.current = true;
                    setInitialLoaded(true);
                    setLoading(false);
                }
            }
        }

        fetchAllPairSetups();

        return () => {
            isCancelled = true;
        };
    }, [handleIncomingSetups]);

    const processRawMessage = useCallback((data) => {
        if (!data) return;

        // 1. Nested candle_update strategy object: data.data.strategy or data.strategy
        const stratObj = data.data?.strategy || data.strategy;
        if (stratObj && typeof stratObj === 'object' && (stratObj.name || stratObj.signal || stratObj.direction || stratObj.id)) {
            const sym = data.symbol || data.data?.symbol || 'XAUUSD';
            const numEntry = Number(stratObj.entry_price || stratObj.entry || data.data?.close || data.data?.open || 0);
            const dir = (stratObj.signal || stratObj.direction || 'BUY').toUpperCase();
            const isBuy = dir === 'BUY';
            const cleanStratName = String(stratObj.name || 'EMA Pullback').replace(/^Default\s+/i, '');

            const diffUnit = numEntry > 100 ? (numEntry * 0.002) : (numEntry * 0.0015);
            const numSl = Number(stratObj.stop_loss || stratObj.sl || data.data?.support || 0) || (isBuy ? +(numEntry - diffUnit).toFixed(numEntry > 100 ? 2 : 5) : +(numEntry + diffUnit).toFixed(numEntry > 100 ? 2 : 5));
            const numTp = Number(stratObj.take_profit || stratObj.tp || data.data?.resistance || 0) || (isBuy ? +(numEntry + diffUnit * 3).toFixed(numEntry > 100 ? 2 : 5) : +(numEntry - diffUnit * 3).toFixed(numEntry > 100 ? 2 : 5));

            const setupItem = {
                symbol: sym,
                strategy_id: stratObj.id || '',
                strategy_name: cleanStratName,
                signal: {
                    direction: dir,
                    entry: numEntry,
                    sl: numSl,
                    tp: numTp,
                    risk_reward: stratObj.risk_reward || '1:3.0',
                    status: stratObj.status || 'ACTIVE',
                    time_ago: 'Live Trigger',
                    confluence: {
                        volume_strength: 'MODERATE',
                        risk_reward: stratObj.risk_reward || '1:3.0',
                        risk_level: 'LOW'
                    }
                }
            };
            handleIncomingSetups([setupItem]);
            return;
        }

        // 2. Price update or candle update: update candle/price for matching pair
        if (data.type === 'candle_update' && data.symbol && data.data) {
            const sym = data.symbol;
            const closePrice = data.data.close || data.data.price;
            if (closePrice) {
                setSetupsList((prevList) => {
                    return prevList.map((item) => {
                        if (item.symbol === sym || item.meta?.short === sym || normalizePairInfo(sym).short === item.meta?.short) {
                            const oldCandles = item.signal?.mini_candles || [];
                            const updatedCandles = [...oldCandles];
                            if (updatedCandles.length > 0) {
                                const last = { ...updatedCandles[updatedCandles.length - 1], close: closePrice };
                                updatedCandles[updatedCandles.length - 1] = last;
                            }
                            return {
                                ...item,
                                signal: {
                                    ...item.signal,
                                    mini_candles: updatedCandles,
                                }
                            };
                        }
                        return item;
                    });
                });
            }
        }

        // 3. Bulk setups array: active_setups, setups, strategy_signals, signals
        const payloadSetups =
            data.active_setups ||
            data.setups ||
            data.strategy_signals ||
            data.signals;

        if (payloadSetups && Array.isArray(payloadSetups)) {
            handleIncomingSetups(payloadSetups);
        } else if (data.signal || (data.symbol && (data.direction || data.entry))) {
            handleIncomingSetups([data]);
        }
    }, [handleIncomingSetups]);

    useEffect(() => {
        isUnmountingRef.current = false;

        // Subscribe to unified socket status & strategy streams
        const unsubStatus = unifiedSocket.subscribeStatus((status) => {
            if (!isUnmountingRef.current) {
                setWsStatus(status);
            }
        });

        const unsubStrategy = unifiedSocket.subscribeStrategy((data) => {
            if (!isUnmountingRef.current) {
                processRawMessage(data);
            }
        });

        const onLiveCandleEvent = (e) => {
            if (!isUnmountingRef.current && e?.detail) {
                processRawMessage(e.detail);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('liveCandleUpdate', onLiveCandleEvent);
        }

        unifiedSocket.ensureConnected('strategy');

        return () => {
            isUnmountingRef.current = true;
            unsubStatus();
            unsubStrategy();
            if (typeof window !== 'undefined') {
                window.removeEventListener('liveCandleUpdate', onLiveCandleEvent);
            }
        };
    }, [processRawMessage]);

    return {
        setups,
        setupsList,
        wsStatus,
        loading,
        initialLoaded,
    };
}
