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

function formatPairCurrency(val, symbol) {
    if (typeof val !== 'number' || isNaN(val)) return '-';
    const symUpper = (symbol || '').toUpperCase().replace("/", "");
    if (symUpper.endsWith("JPY")) return val.toFixed(3);
    if (symUpper.includes("XAU") || symUpper.includes("GOLD") || symUpper.includes("XAG")) return val.toFixed(2);
    if (symUpper.includes("BTC") || symUpper.includes("ETH") || symUpper.includes("SOL")) return val.toFixed(2);
    if (symUpper.length === 6) return val.toFixed(5);
    return val.toFixed(2);
}

function getScoreSeverityClass(score) {
    if (score === null || score === undefined) return '';
    if (score >= 70) return styles.scoreBullish;
    if (score >= 45) return styles.scoreNeutral;
    return styles.scoreBearish;
}

function getScoreLabel(score, explicitLabel) {
    if (explicitLabel) return explicitLabel.toUpperCase();
    if (score === null || score === undefined) return '';
    if (score >= 70) return 'BULLISH';
    if (score >= 45) return 'NEUTRAL';
    return 'BEARISH';
}

const WatchlistItem = memo(({ pair, onClick, scoreData }) => {
    // Starts as null so skeletons display until REAL data arrives from API or WebSocket
    const [liveData, setLiveData] = useState(null);
    const [tickClass, setTickClass] = useState('normal');

    const wsRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const prevPriceRef = useRef(0);

    // Initial real candle fetch from REST so real price shows even before socket handshake
    useEffect(() => {
        let active = true;
        const fetchInitialCandle = async () => {
            const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.thetradermaster.com').replace(/\/+$/, '');
            const pairClean = pair.replace("/", "").toUpperCase();
            try {
                const res = await fetch(`${baseUrl}/api/v1/chart/candles?symbol=${pairClean}&timeframe=15M&strategy_id=3e8d2b78-0e86-4fdf-9759-338276db1742`, {
                    headers: { 'accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
                });
                if (res.ok && active) {
                    const data = await res.json();
                    if (Array.isArray(data?.candles) && data.candles.length > 0) {
                        const last = data.candles[data.candles.length - 1];
                        const ts = typeof last.time === 'number' ? last.time : Math.floor(new Date(last.time).getTime() / 1000);
                        setLiveData(prev => {
                            if (prev && prev["15m"]) return prev;
                            return {
                                ...prev,
                                "15m": {
                                    time: ts,
                                    open: Number(last.open),
                                    high: Number(last.high),
                                    low: Number(last.low),
                                    close: Number(last.close),
                                    tick_volume: Number(last.tick_volume || 0)
                                }
                            };
                        });
                    }
                }
            } catch (err) {
                // Ignore fallback error; socket will provide data
            }
        };

        fetchInitialCandle();
        return () => { active = false; };
    }, [pair]);

    // WebSocket connection with real live feed
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
                    base = 'wss://api.thetradermaster.com/api/v1/ws/live';
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

    const candle = liveData ? liveData["15m"] || liveData["1h"] || Object.values(liveData)[0] : null;
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

    const score = scoreData?.score;
    const scoreLabel = scoreData?.label ? getScoreLabel(score, scoreData.label) : (score !== undefined && score !== null ? getScoreLabel(score) : '');
    const scoreClass = getScoreSeverityClass(score);

    const isPriceLoaded = candle !== null && candle !== undefined;
    const isScoreLoaded = score !== null && score !== undefined;

    return (
        <div
            onClick={onClick}
            className={`${styles.watchlistItem} ${tickClass === 'upTick' ? styles.itemUpTick : tickClass === 'downTick' ? styles.itemDownTick : ''}`}
            title={`View ${pair} in AI Strategy Live Feed`}
        >
            <div className={styles.itemLeft}>
                {isScoreLoaded ? (
                    <div className={`${styles.itemScoreBadge} ${scoreClass}`}>
                        {score}
                    </div>
                ) : (
                    <div className={styles.skeletonScoreBadge} />
                )}
                <div className={styles.itemSymbolMeta}>
                    <span className={styles.itemSymbolName}>{pair}</span>
                    {isScoreLoaded ? (
                        <span className={styles.itemSymbolLabel}>{scoreLabel}</span>
                    ) : (
                        <div className={styles.skeletonScoreLabel} />
                    )}
                </div>
            </div>

            <div className={styles.itemRight}>
                {isPriceLoaded ? (
                    <>
                        <span className={`${styles.itemPrice} ${isBullish ? styles.itemBullish : styles.itemBearish}`}>
                            {formatPairCurrency(candle.close, pair)}
                        </span>
                        <span className={`${styles.itemChangePct} ${isBullish ? styles.itemBullish : styles.itemBearish}`}>
                            {isBullish ? '+' : ''}{changePct.toFixed(2)}%
                        </span>
                    </>
                ) : (
                    <>
                        <div className={styles.skeletonItemPrice} />
                        <div className={styles.skeletonItemChange} />
                    </>
                )}
            </div>
        </div>
    );
});

WatchlistItem.displayName = 'WatchlistItem';

export default function DashboardWatchlist() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [scoresMap, setScoresMap] = useState({});

    // Fetch real technical scores for all watchlist pairs concurrently
    useEffect(() => {
        let active = true;
        const fetchAllScores = async () => {
            const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.thetradermaster.com').replace(/\/+$/, '');
            await Promise.allSettled(
                PAIRS.map(async (pair) => {
                    const symClean = pair.replace('/', '').toUpperCase();
                    try {
                        const res = await fetch(`${baseUrl}/api/v1/chart/analysis?symbol=${symClean}`, {
                            headers: {
                                'accept': 'application/json',
                                'ngrok-skip-browser-warning': 'true'
                            }
                        });
                        if (res.ok && active) {
                            const data = await res.json();
                            if (data?.analysis?.technical_score) {
                                setScoresMap(prev => ({
                                    ...prev,
                                    [symClean]: {
                                        score: data.analysis.technical_score.total,
                                        label: data.analysis.technical_score.label
                                    }
                                }));
                            }
                        }
                    } catch (e) {
                        // Ignore individual analysis fetch errors
                    }
                })
            );
        };

        fetchAllScores();
        return () => { active = false; };
    }, []);

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
                    filteredPairs.map((pair) => {
                        const cleanPair = pair.replace('/', '').toUpperCase();
                        const scoreInfo = scoresMap[cleanPair] || null;

                        return (
                            <WatchlistItem
                                key={pair}
                                pair={pair}
                                onClick={() => handleSelectPair(pair)}
                                scoreData={scoreInfo}
                            />
                        );
                    })
                ) : (
                    <div className={styles.noPairsFound}>
                        No pairs match "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}

