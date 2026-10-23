'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import styles from './aiStrategy.module.scss';
import { SearchIcon } from './icons';
import { useLanguage } from '@/context/LanguageContext';

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
    let symUpper = (symbol || '').toUpperCase().replace("/", "");
    if (symUpper.endsWith("JPY")) return val.toFixed(3);
    if (symUpper.includes("XAU") || symUpper.includes("GOLD") || symUpper.includes("XAG")) return val.toFixed(2);
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
    if (explicitLabel) return explicitLabel;
    if (score === null || score === undefined) return '';
    if (score >= 70) return 'Bullish';
    if (score >= 45) return 'Neutral';
    return 'Bearish';
}

// Separate component for watchlist list item
const WatchlistItem = memo(({ pair, isActive, globalTimeframe, addLog, onClick, scoreData, onPriceUpdate }) => {
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
            const tf = globalTimeframe === '1h' ? '1H' : globalTimeframe;
            try {
                const res = await fetch(`${baseUrl}/api/v1/chart/candles?symbol=${pairClean}&timeframe=${tf}&strategy_id=3e8d2b78-0e86-4fdf-9759-338276db1742`, {
                    headers: { 'accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
                });
                if (res.ok && active) {
                    const data = await res.json();
                    if (Array.isArray(data?.candles) && data.candles.length > 0) {
                        const last = data.candles[data.candles.length - 1];
                        const ts = typeof last.time === 'number' ? last.time : Math.floor(new Date(last.time).getTime() / 1000);
                        setLiveData(prev => {
                            // Only set if socket has not already set candle
                            if (prev && prev[globalTimeframe]) return prev;
                            return {
                                ...prev,
                                [globalTimeframe]: {
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
    }, [pair, globalTimeframe]);

    // WebSocket connection for live market data
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
                    console.error(`WS error for ${pair}:`, err);
                }
            };

            ws.onerror = () => { };

            ws.onclose = () => {
                if (!active) return;
                reconnectTimerRef.current = setTimeout(connect, 3000);
            };
        };

        connect();

        return () => {
            active = false;
            if (wsRef.current) wsRef.current.close();
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        };
    }, [pair]);

    // Flash animation on real ticks
    const candle = liveData ? liveData[globalTimeframe] : null;
    const currentPrice = candle?.close || 0;

    useEffect(() => {
        if (!currentPrice) return;
        const prevPrice = prevPriceRef.current;
        if (prevPrice > 0 && currentPrice !== prevPrice) {
            setTickClass(currentPrice > prevPrice ? 'upTick' : 'downTick');
            const timer = setTimeout(() => setTickClass('normal'), 600);
            return () => clearTimeout(timer);
        }
        prevPriceRef.current = currentPrice;
    }, [currentPrice]);

    // Forward real live price to parent if active
    useEffect(() => {
        if (isActive && onPriceUpdate && candle) {
            const parsedClose = Number(candle.close);
            const parsedOpen = Number(candle.open);
            const parsedHigh = Number(candle.high);
            const parsedLow = Number(candle.low);
            const parsedTime = Number(candle.time);
            onPriceUpdate({
                symbol: pair,
                price: parsedClose,
                open: parsedOpen,
                high: parsedHigh,
                low: parsedLow,
                close: parsedClose,
                time: parsedTime,
                tick_volume: candle.tick_volume,
                change: parsedClose - parsedOpen,
                changePct: parsedOpen > 0 ? ((parsedClose - parsedOpen) / parsedOpen) * 100 : 0
            });
        }
    }, [isActive, onPriceUpdate, candle, pair]);

    const changeVal = candle ? candle.close - candle.open : 0;
    const changePct = candle && candle.open > 0 ? (changeVal / candle.open) * 100 : 0;
    const isBullish = changeVal >= 0;

    const score = scoreData?.score;
    const scoreLabel = scoreData?.label || (score !== undefined && score !== null ? getScoreLabel(score) : '');
    const scoreClass = getScoreSeverityClass(score);

    const isPriceLoaded = candle !== null && candle !== undefined;
    const isScoreLoaded = score !== null && score !== undefined;

    return (
        <div
            onClick={onClick}
            className={`${styles.watchlistItem} ${isActive ? styles.activeItem : ''} ${tickClass === 'upTick' ? styles.itemUpTick : tickClass === 'downTick' ? styles.itemDownTick : ''}`}
        >
            <div className={styles.itemLeft}>
                {/* Technical Score Badge / Skeleton */}
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

export default function WatchlistPanel({ selectedSymbol, onSelectSymbol, globalTimeframe, addLog, activeAnalysis, onActivePriceUpdate }) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [scoresMap, setScoresMap] = useState({});

    // When the currently active symbol analysis loads, record its real score
    useEffect(() => {
        if (activeAnalysis?.symbol && activeAnalysis?.technical_score) {
            const symKey = activeAnalysis.symbol.replace('/', '').toUpperCase();
            setScoresMap(prev => ({
                ...prev,
                [symKey]: {
                    score: activeAnalysis.technical_score.total,
                    label: activeAnalysis.technical_score.label
                }
            }));
        }
    }, [activeAnalysis]);

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
        pair.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.watchlistPanel}>
            <div className={styles.watchlistHeader}>
                <h3>{t('aiStrategy.watchlistTitle', 'Watchlist')}</h3>
                <span className={styles.watchlistCount}>{PAIRS.length} pairs</span>
            </div>

            {/* Search Box */}
            <div className={styles.watchlistSearchContainer}>
                <SearchIcon className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder={t('aiStrategy.searchPairs', 'Search pairs...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.watchlistSearchInput}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className={styles.searchClearBtn}>×</button>
                )}
            </div>

            {/* Pairs List */}
            <div className={styles.watchlistItemsList}>
                {filteredPairs.length > 0 ? (
                    filteredPairs.map(pair => {
                        const cleanPair = pair.replace('/', '').toUpperCase();
                        const isSelected = cleanPair === selectedSymbol.replace('/', '').toUpperCase();
                        const scoreInfo = scoresMap[cleanPair] || null;

                        return (
                            <WatchlistItem
                                key={pair}
                                pair={pair}
                                isActive={isSelected}
                                globalTimeframe={globalTimeframe}
                                addLog={addLog}
                                onClick={() => onSelectSymbol(pair)}
                                scoreData={scoreInfo}
                                onPriceUpdate={isSelected ? onActivePriceUpdate : null}
                            />
                        );
                    })
                ) : (
                    <div className={styles.noPairsFound}>No pairs match "{searchQuery}"</div>
                )}
            </div>
        </div>
    );
}

