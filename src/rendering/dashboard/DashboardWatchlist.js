'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.scss';

const PAIRS = [
    "XAU/USD",
    "EUR/USD",
    "GBP/USD",
    "GBP/JPY",
    "EUR/JPY",
    "USD/CAD"
];

// Presets matching target AI Strategy watchlist scores
const PRESET_SCORES = {
    "XAU/USD": 50,
    "EUR/USD": 49,
    "GBP/USD": 30,
    "GBP/JPY": 37,
    "EUR/JPY": 56,
    "USD/CAD": 63
};

function formatPairCurrency(val, symbol) {
    if (typeof val !== 'number' || isNaN(val)) return '-';
    const symUpper = (symbol || '').toUpperCase().replace("/", "");
    if (symUpper.endsWith("JPY")) return val.toFixed(3);
    if (symUpper.includes("XAU") || symUpper.includes("GOLD") || symUpper.includes("XAG")) return val.toFixed(2);
    if (symUpper.includes("BTC") || symUpper.includes("ETH") || symUpper.includes("SOL")) return val.toFixed(2);
    if (symUpper.length === 6) return val.toFixed(5);
    return val.toFixed(2);
}

function getMockInitialData(pair) {
    const symUpper = pair.toUpperCase().replace("/", "");
    let basePrice = 1.25000;
    if (symUpper.endsWith("JPY")) basePrice = 195.450;
    else if (symUpper.includes("XAU") || symUpper.includes("GOLD")) basePrice = 2658.40;
    else if (symUpper === "EURUSD") basePrice = 1.08420;
    else if (symUpper === "GBPUSD") basePrice = 1.31280;
    else if (symUpper === "EURJPY") basePrice = 162.300;
    else if (symUpper === "USDCAD") basePrice = 1.36500;
    else if (symUpper === "AUDUSD") basePrice = 0.65940;

    const multiplier = symUpper.endsWith("JPY") ? 100 : (symUpper.includes("XAU") || symUpper.includes("GOLD")) ? 1000 : 1;
    const now = Math.floor(Date.now() / 1000);
    return {
        "15m": {
            time: now - 340,
            open: basePrice - 0.0015 * multiplier,
            high: basePrice + 0.004 * multiplier,
            low: basePrice - 0.003 * multiplier,
            close: basePrice,
            tick_volume: 1250
        }
    };
}

function getHashedScore(pair) {
    if (PRESET_SCORES[pair] !== undefined) {
        return PRESET_SCORES[pair];
    }
    const hash = pair.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 50) + 30;
}

function getScoreSeverityClass(score) {
    if (score >= 70) return styles.scoreBullish;
    if (score >= 45) return styles.scoreNeutral;
    return styles.scoreBearish;
}

function getScoreLabel(score) {
    if (score >= 70) return 'BULLISH';
    if (score >= 45) return 'NEUTRAL';
    return 'BEARISH';
}

const WatchlistItem = memo(({ pair, onClick }) => {
    const [liveData, setLiveData] = useState(null);
    const [tickClass, setTickClass] = useState('normal');

    const wsRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const lastWsTickTime = useRef(0);
    const prevPriceRef = useRef(0);

    // Initial Mock Seed
    useEffect(() => {
        setLiveData(getMockInitialData(pair));
    }, [pair]);

    // WebSocket connection with live fallback
    useEffect(() => {
        let active = true;

        const connect = () => {
            if (!active) return;
            const pairClean = pair.replace("/", "").toUpperCase();

            let base = process.env.NEXT_PUBLIC_WS_LIVE_URL;
            if (!base || base.includes('localhost') || base.includes('127.0.0.1')) {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
                if (backendUrl) {
                    const protocol = backendUrl.startsWith('https://') ? 'wss://' : 'ws://';
                    const host = backendUrl.replace(/^(https?:\/\/)/, '');
                    base = `${protocol}${host}/api/v1/ws/live`;
                } else {
                    base = 'wss://thirsty-spoiler-cartel.ngrok-free.dev/api/v1/ws/live';
                }
            }
            const wsUrl = `${base}?symbol=${pairClean}`;

            try {
                const ws = new WebSocket(wsUrl);
                wsRef.current = ws;

                ws.onmessage = (event) => {
                    if (!active) return;
                    try {
                        const payload = JSON.parse(event.data);
                        if (payload.type === 'initial_state' || payload.type === 'candle_update') {
                            lastWsTickTime.current = Date.now();
                            const parsedData = {};
                            if (payload.data) {
                                for (const tf in payload.data) {
                                    const c = payload.data[tf];
                                    if (c) {
                                        parsedData[tf] = {
                                            ...c,
                                            time: Number(c.time),
                                            open: Number(c.open),
                                            high: Number(c.high),
                                            low: Number(c.low),
                                            close: Number(c.close),
                                            tick_volume: Number(c.tick_volume || 0)
                                        };
                                    }
                                }
                            }
                            setLiveData(parsedData);
                        }
                    } catch (err) {
                        // ignore JSON parse error
                    }
                };

                ws.onerror = () => {};

                ws.onclose = () => {
                    if (!active) return;
                    reconnectTimerRef.current = setTimeout(connect, 4000);
                };
            } catch (e) {
                // Ignore WebSocket init error
            }
        };

        connect();

        return () => {
            active = false;
            if (wsRef.current) wsRef.current.close();
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        };
    }, [pair]);

    // Local price simulator fallback if live websocket is not sending ticks
    useEffect(() => {
        const checkAndSimulate = () => {
            const now = Date.now();
            setLiveData((prevData) => {
                if (!prevData) return prevData;

                const lastTick = lastWsTickTime.current || 0;
                if (now - lastTick > 1500) {
                    const candle = prevData["15m"];
                    if (candle) {
                        const symUpper = pair.toUpperCase().replace("/", "");
                        const tickSize = symUpper.endsWith("JPY") ? 0.001 : (symUpper.includes("XAU") || symUpper.includes("GOLD")) ? 0.02 : 0.00001;
                        const moveTicks = Math.floor(Math.random() * 5) - 2;
                        if (moveTicks !== 0) {
                            const change = moveTicks * tickSize;
                            const newClose = Number(candle.close) + change;
                            return {
                                ...prevData,
                                "15m": {
                                    ...candle,
                                    close: newClose,
                                    high: newClose > Number(candle.high) ? newClose : Number(candle.high),
                                    low: newClose < Number(candle.low) ? newClose : Number(candle.low)
                                }
                            };
                        }
                    }
                }
                return prevData;
            });
        };

        const timer = setInterval(checkAndSimulate, 1200);
        return () => clearInterval(timer);
    }, [pair]);

    const candle = liveData ? liveData["15m"] : null;
    const currentPrice = candle?.close || 0;

    useEffect(() => {
        if (!currentPrice) return;
        const prevPrice = prevPriceRef.current;
        if (prevPrice > 0 && currentPrice !== prevPrice) {
            setTickClass(currentPrice > prevPrice ? 'upTick' : 'downTick');
            const timer = setTimeout(() => setTickClass('normal'), 650);
            return () => clearTimeout(timer);
        }
        prevPriceRef.current = currentPrice;
    }, [currentPrice]);

    const changeVal = candle ? candle.close - candle.open : 0;
    const changePct = candle && candle.open > 0 ? (changeVal / candle.open) * 100 : 0;
    const isBullish = changeVal >= 0;

    const score = getHashedScore(pair);
    const scoreClass = getScoreSeverityClass(score);
    const scoreLabel = getScoreLabel(score);

    return (
        <div
            onClick={onClick}
            className={`${styles.watchlistItem} ${tickClass === 'upTick' ? styles.itemUpTick : tickClass === 'downTick' ? styles.itemDownTick : ''}`}
            title={`View ${pair} in AI Strategy Live Feed`}
        >
            <div className={styles.itemLeft}>
                <div className={`${styles.itemScoreBadge} ${scoreClass}`}>
                    {score}
                </div>
                <div className={styles.itemSymbolMeta}>
                    <span className={styles.itemSymbolName}>{pair}</span>
                    <span className={styles.itemSymbolLabel}>{scoreLabel}</span>
                </div>
            </div>

            <div className={styles.itemRight}>
                <span className={`${styles.itemPrice} ${isBullish ? styles.itemBullish : styles.itemBearish}`}>
                    {candle ? formatPairCurrency(candle.close, pair) : '-'}
                </span>
                <span className={`${styles.itemChangePct} ${isBullish ? styles.itemBullish : styles.itemBearish}`}>
                    {isBullish ? '+' : ''}{changePct.toFixed(2)}%
                </span>
            </div>
        </div>
    );
});

WatchlistItem.displayName = 'WatchlistItem';

export default function DashboardWatchlist() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPairs = PAIRS.filter(pair =>
        pair.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    const handleSelectPair = (pair) => {
        const cleanSym = pair.replace('/', '').toUpperCase();
        router.push(`/ai-strategy/live?symbol=${cleanSym}`);
    };

    return (
        <div className={styles.watchlistCard}>
            {/* Search Input Box */}
            <div className={styles.watchlistSearchContainer}>
                <svg
                    className={styles.watchlistSearchIcon}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Search pairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.watchlistSearchInput}
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className={styles.watchlistSearchClearBtn}
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* List of Watchlist Items */}
            <div className={styles.watchlistItemsList}>
                {filteredPairs.length > 0 ? (
                    filteredPairs.map((pair) => (
                        <WatchlistItem
                            key={pair}
                            pair={pair}
                            onClick={() => handleSelectPair(pair)}
                        />
                    ))
                ) : (
                    <div className={styles.noPairsFound}>
                        No pairs match "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}
