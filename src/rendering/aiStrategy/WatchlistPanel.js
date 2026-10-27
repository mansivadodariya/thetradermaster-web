'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import styles from './aiStrategy.module.scss';
import { SearchIcon } from '@/icons/aiStrategyIcons';
import { useLanguage } from '@/context/LanguageContext';
import { unifiedSocket, cleanPairSymbol } from '@/lib/unifiedSocket';

const PAIRS = [
    "XAU/USD",
    "EUR/USD",
    "GBP/USD",
    "GBP/JPY",
    "EUR/JPY",
    "USD/CAD"
];

function getBidAskPrices(candle, symbol) {
    if (!candle || candle.close === undefined || candle.close === null) {
        return { bid: '-', ask: '-' };
    }
    const close = Number(candle.close);
    if (isNaN(close)) return { bid: '-', ask: '-' };

    if (candle.bid !== undefined && candle.bid !== null && !isNaN(candle.bid)) {
        const bidNum = Number(candle.bid);
        const askNum = candle.ask !== undefined && candle.ask !== null && !isNaN(candle.ask) ? Number(candle.ask) : bidNum;
        const decimals = bidNum < 10 ? 5 : (bidNum < 1000 ? 3 : 2);
        return {
            bid: bidNum.toFixed(decimals),
            ask: askNum.toFixed(decimals)
        };
    }

    const symUpper = (symbol || '').toUpperCase().replace('/', '').replace(' ', '');
    let spread = 0.00001;
    let decimals = 5;

    if (symUpper === 'EURUSD') {
        spread = 0.00001;
        decimals = 5;
    } else if (symUpper === 'GBPUSD') {
        spread = 0.00004;
        decimals = 5;
    } else if (symUpper.endsWith('JPY')) {
        spread = 0.003;
        decimals = 3;
    } else if (symUpper.includes('XAU') || symUpper.includes('GOLD')) {
        spread = 0.25;
        decimals = 2;
    } else if (symUpper.includes('BTC')) {
        spread = 5.00;
        decimals = 2;
    } else if (symUpper.includes('NIFTY')) {
        spread = 0.05;
        decimals = 2;
    } else if (symUpper.length === 6) {
        spread = 0.00002;
        decimals = 5;
    } else {
        spread = 0.01;
        decimals = 2;
    }

    const bid = close;
    const ask = close + spread;

    return {
        bid: bid.toFixed(decimals),
        ask: ask.toFixed(decimals)
    };
}

const WATCHLIST_BASE_PRICES = {
    XAUUSD: { price: 4015.09, changePct: 0.37 },
    EURUSD: { price: 1.12111, changePct: 0.02 },
    GBPUSD: { price: 1.33483, changePct: -0.18 },
    GBPJPY: { price: 209.939, changePct: 0.06 },
    EURJPY: { price: 176.323, changePct: 0.27 },
    USDCAD: { price: 1.40110, changePct: -0.03 },
};

function getInitialPairCandles(pair) {
    const sym = cleanPairSymbol(pair);
    const known = unifiedSocket.getKnownPrice(sym);
    const info = WATCHLIST_BASE_PRICES[sym] || { price: 1.0000, changePct: 0.00 };
    const price = known || info.price;
    const nowSec = Math.floor(Date.now() / 1000);
    const durations = ["5m", "15m", "1h", "1d"];
    const map = {};
    durations.forEach(tf => {
        map[tf] = {
            time: nowSec,
            open: price,
            high: price,
            low: price,
            close: price,
            tick_volume: 100,
            changePct: info.changePct
        };
    });
    return map;
}

// Separate component for watchlist list item
const WatchlistItem = memo(({ pair, isActive, globalTimeframe, addLog, onClick, onPriceUpdate }) => {
    const [liveData, setLiveData] = useState(() => getInitialPairCandles(pair));
    const [wsStatus, setWsStatus] = useState('disconnected');
    const [tickClass, setTickClass] = useState('normal');

    const lastWsTickTime = useRef(0);
    const prevPriceRef = useRef(0);

    // Unified WebSocket Subscription - real-time live ticks only
    useEffect(() => {
        const pairClean = cleanPairSymbol(pair);

        if (isActive) {
            unifiedSocket.switchSubscription({ symbol: pairClean, timeframe: globalTimeframe });
        }

        const unsubStatus = unifiedSocket.subscribeStatus((status) => {
            setWsStatus(status);
        });

        const handlePriceObj = (priceObj) => {
            if (!priceObj) return;
            const newPrice = parseFloat(priceObj.price ?? priceObj.close ?? priceObj.last);
            if (isNaN(newPrice) || newPrice <= 0) return;

            lastWsTickTime.current = Date.now();

            setLiveData((prev) => {
                const durations = ["5m", "15m", "1h", "1d"];
                const next = { ...(prev || {}) };
                const nowSec = Math.floor(Date.now() / 1000);
                const openVal = (priceObj.open !== undefined && !isNaN(priceObj.open)) ? parseFloat(priceObj.open) : newPrice;
                const highVal = (priceObj.high !== undefined && !isNaN(priceObj.high)) ? parseFloat(priceObj.high) : newPrice;
                const lowVal = (priceObj.low !== undefined && !isNaN(priceObj.low)) ? parseFloat(priceObj.low) : newPrice;
                const bidVal = (priceObj.bid !== undefined && !isNaN(priceObj.bid)) ? parseFloat(priceObj.bid) : newPrice;
                const askVal = (priceObj.ask !== undefined && !isNaN(priceObj.ask)) ? parseFloat(priceObj.ask) : newPrice;
                const changePct = (priceObj.change_percent !== undefined && !isNaN(priceObj.change_percent))
                    ? parseFloat(priceObj.change_percent)
                    : (priceObj.changePercent !== undefined && !isNaN(priceObj.changePercent))
                    ? parseFloat(priceObj.changePercent)
                    : null;

                durations.forEach((tf) => {
                    const oldC = next[tf] || {
                        time: nowSec,
                        open: openVal,
                        high: Math.max(openVal, highVal),
                        low: Math.min(openVal, lowVal),
                        close: newPrice,
                        tick_volume: 0,
                        bid: bidVal,
                        ask: askVal,
                        changePct: changePct
                    };
                    next[tf] = {
                        ...oldC,
                        close: newPrice,
                        high: Math.max(oldC.high || newPrice, newPrice),
                        low: Math.min(oldC.low || newPrice, newPrice),
                        tick_volume: (oldC.tick_volume || 0) + 1,
                        bid: bidVal !== undefined ? bidVal : oldC.bid,
                        ask: askVal !== undefined ? askVal : oldC.ask,
                        changePct: changePct !== null ? changePct : oldC.changePct
                    };
                });
                return next;
            });
        };

        const unsubPrice = unifiedSocket.subscribePrice(handlePriceObj, pairClean);

        const onLivePriceCustom = (evt) => {
            if (evt?.detail && cleanPairSymbol(evt.detail.symbol) === pairClean) {
                handlePriceObj(evt.detail);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('livePriceUpdate', onLivePriceCustom);
        }

        return () => {
            unsubPrice();
            unsubStatus();
            if (typeof window !== 'undefined') {
                window.removeEventListener('livePriceUpdate', onLivePriceCustom);
            }
        };
    }, [pair, isActive, globalTimeframe]);

    // Rollover active candle interval when timeframe advances
    useEffect(() => {
        const rolloverCheck = () => {
            const now = Date.now();
            setLiveData(prevData => {
                if (!prevData) return prevData;

                const nowSec = Math.floor(now / 1000);
                const durations = { "5m": 300, "15m": 900, "1h": 3600, "1d": 86400 };
                let hasChanges = false;
                const nextData = { ...prevData };

                for (const tf in durations) {
                    const dur = durations[tf];
                    const candle = nextData[tf];
                    if (!candle) continue;

                    const currentCandleStart = nowSec - (nowSec % dur);
                    if (candle.time < currentCandleStart) {
                        hasChanges = true;
                        const lastClose = candle.close;
                        nextData[tf] = {
                            ...candle,
                            time: currentCandleStart,
                            open: lastClose,
                            high: lastClose,
                            low: lastClose,
                            close: lastClose,
                            tick_volume: 0
                        };
                    }
                }
                return hasChanges ? nextData : prevData;
            });
        };

        const timer = setInterval(rolloverCheck, 1000);
        return () => clearInterval(timer);
    }, []);

    // Flash animation on ticks
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

    useEffect(() => {
        if (isActive && onPriceUpdate && candle) {
            const parsedClose = Number(candle.close);
            const parsedOpen = Number(candle.open);
            const parsedHigh = Number(candle.high);
            const parsedLow = Number(candle.low);
            const parsedChangePct = candle.changePct !== undefined && candle.changePct !== null
                ? Number(candle.changePct)
                : (parsedOpen > 0 ? ((parsedClose - parsedOpen) / parsedOpen) * 100 : 0);

            onPriceUpdate({
                symbol: pair,
                price: parsedClose,
                open: parsedOpen,
                high: parsedHigh,
                low: parsedLow,
                close: parsedClose,
                change: parsedClose - parsedOpen,
                changePct: parsedChangePct
            });
        }
    }, [isActive, onPriceUpdate, candle, pair]);

    // Render skeleton until real WebSocket data arrives for this pair
    if (!candle) {
        return (
            <div
                onClick={onClick}
                className={`${styles.quoteWatchlistItem} ${styles.watchlistSkeletonItem} ${isActive ? styles.quoteActiveItem : ''}`}
            >
                <div className={styles.quoteItemLeft}>
                    <span className={styles.quoteSymbolName}>{pair}</span>
                </div>
                <div className={styles.quoteItemRight}>
                    <div className={`${styles.skeletonPulse} ${styles.skelPrice}`} />
                    <div className={`${styles.skeletonPulse} ${styles.skelPct}`} />
                </div>
            </div>
        );
    }

    const changePct = candle.changePct !== undefined && candle.changePct !== null
        ? Number(candle.changePct)
        : (candle.open > 0 ? ((candle.close - candle.open) / candle.open) * 100 : 0);
    const isPositive = changePct >= 0;
    const isNegative = changePct < 0;

    const { bid, ask } = getBidAskPrices(candle, pair);
    const isNifty = pair.includes('NIFTY');

    const pctClass = isNifty 
        ? styles.pctRef 
        : isNegative 
        ? styles.pctDown 
        : styles.pctUp;

    const priceClass = isNifty
        ? styles.priceRef
        : isNegative
        ? styles.priceDown
        : styles.priceUp;

    const rowToneClass = isNifty
        ? styles.rowNeutral
        : isNegative
        ? styles.rowBearish
        : styles.rowBullish;

    return (
        <div
            onClick={onClick}
            className={`${styles.quoteWatchlistItem} ${rowToneClass} ${isActive ? styles.quoteActiveItem : ''} ${tickClass === 'upTick' ? styles.itemUpTick : tickClass === 'downTick' ? styles.itemDownTick : ''}`}
        >
            <div className={styles.quoteItemLeft}>
                <span className={styles.quoteSymbolName}>{pair}</span>
            </div>

            <div className={styles.quoteItemRight}>
                <span className={`${styles.quotePrice} ${priceClass}`}>{bid}</span>
                <span className={`${styles.quoteChangePct} ${pctClass}`}>
                    {isNifty ? 'REF' : `${isPositive ? '+' : ''}${changePct.toFixed(2)}%`}
                </span>
            </div>
        </div>
    );
});

WatchlistItem.displayName = 'WatchlistItem';

export default function WatchlistPanel({ selectedSymbol, onSelectSymbol, globalTimeframe, addLog, activeAnalysis, onActivePriceUpdate }) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [wsStatus, setWsStatus] = useState(unifiedSocket.getStatus());

    // Listen to real-time socket connection & fallback status
    useEffect(() => {
        unifiedSocket.ensureConnected();
        return unifiedSocket.subscribeStatus((status) => {
            setWsStatus(status);
        });
    }, []);

    const filteredPairs = PAIRS.filter(pair =>
        pair.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.watchlistPanel}>
            {/* Watchlist Header */}
            <div className={styles.watchlistHeader}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <h3>{t('aiStrategy.watchlistTitle', 'Watchlist')}</h3>
                    <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: wsStatus === 'connected' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: wsStatus === 'connected' ? '#10b981' : '#f59e0b',
                        border: `1px solid ${wsStatus === 'connected' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`
                    }}>
                        <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: wsStatus === 'connected' ? '#10b981' : '#f59e0b',
                            boxShadow: wsStatus === 'connected' ? '0 0 6px #10b981' : '0 0 6px #f59e0b'
                        }} />
                        {wsStatus === 'connected' ? 'Live Stream' : 'DB Feed (3s Retry)'}
                    </span>
                </div>
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

            {/* Quote Columns Header */}
            <div className={styles.quoteColumnHeader}>
                <div className={styles.colHeaderLeft}>
                    <span>{t('aiStrategy.colSymbol', 'Symbol')}</span>
                </div>
                <div className={styles.colHeaderRight}>
                    <span className={styles.colHeaderPrice}>{t('aiStrategy.colPrice', 'Price')}</span>
                </div>
            </div>

            {/* Pairs Quote List */}
            <div className={styles.watchlistItemsList}>
                {filteredPairs.length > 0 ? (
                    filteredPairs.map(pair => {
                        const isSelected = selectedSymbol
                            ? pair.replace('/', '').replace(' ', '').toUpperCase() === selectedSymbol.replace('/', '').replace(' ', '').toUpperCase()
                            : false;

                        return (
                            <WatchlistItem
                                key={pair}
                                pair={pair}
                                isActive={isSelected}
                                globalTimeframe={globalTimeframe}
                                addLog={addLog}
                                onClick={() => onSelectSymbol(pair)}
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
