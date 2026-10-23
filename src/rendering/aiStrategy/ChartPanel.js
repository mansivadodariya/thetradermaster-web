'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import styles from './aiStrategy.module.scss';
import { useTheme } from '@/context/ThemeContext';

// Helper to calculate milliseconds until the next HH:01:00
function getMsUntilNextHourOOne() {
    const now = new Date();
    const next = new Date(now);

    next.setMinutes(1);
    next.setSeconds(0);
    next.setMilliseconds(0);

    // If we are already past the 1st minute of this hour, schedule for the next hour
    if (now.getMinutes() >= 1) {
        next.setHours(now.getHours() + 1);
    }

    const diff = next.getTime() - now.getTime();
    // Fallback safety (if diff is negative or 0, set to 1 hour)
    return diff > 0 ? diff : 3600000;
}

function formatPairCurrency(val, symbol) {
    if (typeof val !== 'number' || isNaN(val)) return '-';
    let symUpper = (symbol || '').toUpperCase().replace("/", "");
    if (symUpper.endsWith("JPY")) return val.toFixed(3);
    if (symUpper.includes("XAU") || symUpper.includes("GOLD") || symUpper.includes("XAG")) return val.toFixed(2);
    if (symUpper.length === 6) return val.toFixed(5);
    return val.toFixed(2);
}

export default function ChartPanel({ symbol, strategyId, timeframe = '1H', nearestSupport, nearestResistance, onRefreshNeeded, livePriceInfo }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [priceInfo, setPriceInfo] = useState(null);
    const prevPriceRef = useRef(0);
    const [tickClass, setTickClass] = useState('normal');

    const [hoveredData, setHoveredData] = useState(null);
    const [dotPositions, setDotPositions] = useState(null);
    const chartDataRef = useRef({
        candles: [],
        ema20Map: new Map(),
        ema50Map: new Map(),
        supertrendMap: new Map()
    });

    const refreshTimeoutRef = useRef(null);

    // Live update function: updates Lightweight Charts series and priceInfo dynamically
    const handleLiveCandleUpdate = useCallback((update) => {
        if (!update || !chartRef.current) return;
        const symClean = (symbol || '').replace('/', '').toUpperCase();
        const updateSymClean = (update.symbol || '').replace('/', '').toUpperCase();
        if (updateSymClean && symClean !== updateSymClean) return;

        const series = chartRef.current.series;
        if (!series?.candle) return;

        const currentCandles = chartDataRef.current?.candles;
        if (!currentCandles || currentCandles.length === 0) return;

        const lastCandle = currentCandles[currentCandles.length - 1];
        const newClose = Number(update.close ?? update.price);
        if (isNaN(newClose) || newClose <= 0) return;

        const newHigh = Math.max(lastCandle.high, Number(update.high ?? newClose), newClose);
        const newLow = Math.min(lastCandle.low, Number(update.low ?? newClose), newClose);

        const incomingTime = update.time ? Number(update.time) : null;
        const candleTime = (incomingTime && incomingTime >= lastCandle.time) ? incomingTime : lastCandle.time;

        if (candleTime === lastCandle.time) {
            const updatedCandle = {
                time: lastCandle.time,
                open: lastCandle.open,
                high: newHigh,
                low: newLow,
                close: newClose
            };

            series.candle.update(updatedCandle);
            currentCandles[currentCandles.length - 1] = updatedCandle;

            if (series.volume && update.tick_volume !== undefined) {
                series.volume.update({
                    time: lastCandle.time,
                    value: Number(update.tick_volume),
                    color: newClose >= lastCandle.open ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'
                });
            }

            setPriceInfo(prev => {
                const prevCandle = currentCandles.length > 1 ? currentCandles[currentCandles.length - 2] : updatedCandle;
                const change = newClose - prevCandle.close;
                const changePct = prevCandle.close > 0 ? (change / prevCandle.close) * 100 : 0;
                return {
                    ...prev,
                    open: updatedCandle.open,
                    high: updatedCandle.high,
                    low: updatedCandle.low,
                    close: newClose,
                    price: newClose,
                    change,
                    changePct
                };
            });
        } else if (candleTime > lastCandle.time) {
            const newOpen = Number(update.open ?? newClose);
            const newCandle = {
                time: candleTime,
                open: newOpen,
                high: Math.max(newOpen, Number(update.high ?? newClose), newClose),
                low: Math.min(newOpen, Number(update.low ?? newClose), newClose),
                close: newClose
            };

            series.candle.update(newCandle);
            currentCandles.push(newCandle);

            if (series.volume && update.tick_volume !== undefined) {
                series.volume.update({
                    time: candleTime,
                    value: Number(update.tick_volume),
                    color: newClose >= newOpen ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'
                });
            }

            setPriceInfo(prev => {
                const change = newClose - lastCandle.close;
                const changePct = lastCandle.close > 0 ? (change / lastCandle.close) * 100 : 0;
                return {
                    ...prev,
                    open: newCandle.open,
                    high: newCandle.high,
                    low: newCandle.low,
                    close: newClose,
                    price: newClose,
                    change,
                    changePct
                };
            });
        }
    }, [symbol]);

    // Apply live price updates from parent prop
    useEffect(() => {
        if (livePriceInfo) {
            handleLiveCandleUpdate(livePriceInfo);
        }
    }, [livePriceInfo, handleLiveCandleUpdate]);

    // Direct WebSocket connection for charted symbol to stream real-time price updates
    useEffect(() => {
        if (!symbol) return;
        let active = true;
        const cleanSymbol = symbol.replace('/', '').toUpperCase();

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
        const wsUrl = `${base}?symbol=${cleanSymbol}`;

        let ws = null;
        let reconnectTimer = null;

        const connect = () => {
            if (!active) return;
            try {
                ws = new WebSocket(wsUrl);

                ws.onmessage = (event) => {
                    if (!active) return;
                    try {
                        const payload = JSON.parse(event.data);
                        if (payload.type === 'initial_state' || payload.type === 'candle_update') {
                            const tfKey = (timeframe || '1h').toLowerCase();
                            const c = payload.data ? payload.data[tfKey] : null;
                            if (c) {
                                handleLiveCandleUpdate({
                                    symbol,
                                    time: Number(c.time),
                                    open: Number(c.open),
                                    high: Number(c.high),
                                    low: Number(c.low),
                                    close: Number(c.close),
                                    tick_volume: Number(c.tick_volume || 0)
                                });
                            }
                        }
                    } catch (err) {
                        console.error('Error handling chart WS message:', err);
                    }
                };

                ws.onclose = () => {
                    if (!active) return;
                    reconnectTimer = setTimeout(connect, 3000);
                };
            } catch (e) {
                console.error('Chart WS connection error:', e);
            }
        };

        connect();

        return () => {
            active = false;
            if (ws) ws.close();
            if (reconnectTimer) clearTimeout(reconnectTimer);
        };
    }, [symbol, timeframe, handleLiveCandleUpdate]);

    // Fetch and populate chart data
    const fetchAndPlotData = async () => {
        if (!symbol) return;
        setLoading(true);
        setError(null);

        const cleanSymbol = symbol.replace('/', '').toUpperCase();
        const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/+$/, '');
        const effectiveStrategyId = strategyId || '3e8d2b78-0e86-4fdf-9759-338276db1742';
        let url = `${baseUrl}/api/v1/chart/candles?symbol=${cleanSymbol}&timeframe=${timeframe}&strategy_id=${effectiveStrategyId}`;

        let candlesList = [];

        try {
            const res = await fetch(url, {
                headers: {
                    'accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            if (res.ok) {
                const data = await res.json();
                candlesList = Array.isArray(data?.candles) ? data.candles : [];
            }
        } catch (err) {
            console.error('Error fetching candles from API:', err);
        }

        try {
            if (candlesList.length === 0) {
                setError('No candle data returned');
                setLoading(false);
                return;
            }

            if (!chartRef.current || !containerRef.current) {
                setLoading(false);
                return;
            }

            const chart = chartRef.current.chart;
            const series = chartRef.current.series;

            // Format candles for Lightweight Charts
            const candleData = [];
            const volumeData = [];
            const ema20Data = [];
            const ema50Data = [];
            const supertrendData = [];

            candlesList.forEach((c) => {
                let ts;
                if (typeof c.time === 'number') {
                    ts = c.time;
                } else {
                    ts = Math.floor(new Date(c.time).getTime() / 1000);
                }

                const o = parseFloat(c.open);
                const h = parseFloat(c.high);
                const l = parseFloat(c.low);
                const cl = parseFloat(c.close);
                const vol = parseInt(c.tick_volume || 0);

                candleData.push({ time: ts, open: o, high: h, low: l, close: cl });

                volumeData.push({
                    time: ts,
                    value: vol,
                    color: cl >= o ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                });

                if (c.ema20 !== null && c.ema20 !== undefined) {
                    ema20Data.push({ time: ts, value: c.ema20 });
                }
                if (c.ema50 !== null && c.ema50 !== undefined) {
                    ema50Data.push({ time: ts, value: c.ema50 });
                }
                if (c.supertrend_value !== null && c.supertrend_value !== undefined) {
                    supertrendData.push({
                        time: ts,
                        value: c.supertrend_value,
                        color: c.supertrend_direction === 1 ? '#10b981' : '#ef4444',
                    });
                }
            });

            // Set data into series
            series.candle.setData(candleData);
            series.volume.setData(volumeData);
            series.ema20.setData(ema20Data);
            series.ema50.setData(ema50Data);
            series.supertrend.setData(supertrendData);

            const ema20Map = new Map();
            const ema50Map = new Map();
            const supertrendMap = new Map();

            ema20Data.forEach(d => ema20Map.set(d.time, d.value));
            ema50Data.forEach(d => ema50Map.set(d.time, d.value));
            supertrendData.forEach(d => supertrendMap.set(d.time, d));

            chartDataRef.current = {
                candles: candleData,
                ema20Map,
                ema50Map,
                supertrendMap
            };

            if (candleData.length > 0) {
                const lastCandle = candleData[candleData.length - 1];
                const prevCandle = candleData.length > 1 ? candleData[candleData.length - 2] : lastCandle;
                const price = lastCandle.close;
                const change = price - prevCandle.close;
                const changePct = prevCandle.close > 0 ? (change / prevCandle.close) * 100 : 0;

                const t = lastCandle.time;
                const lastEma20 = ema20Map.get(t);
                const lastEma50 = ema50Map.get(t);
                const lastSupertrend = supertrendMap.get(t);

                setPriceInfo({
                    open: lastCandle.open,
                    high: lastCandle.high,
                    low: lastCandle.low,
                    close: lastCandle.close,
                    price,
                    change,
                    changePct,
                    ema20: lastEma20,
                    ema50: lastEma50,
                    supertrend: lastSupertrend?.value,
                    supertrendColor: lastSupertrend?.color
                });
            } else {
                setPriceInfo(null);
            }

            // S/R price lines
            if (chartRef.current.priceLines) {
                chartRef.current.priceLines.forEach(pl => {
                    try { series.candle.removePriceLine(pl); } catch (e) { }
                });
            }
            chartRef.current.priceLines = [];

            if (nearestSupport !== undefined && nearestSupport !== null) {
                const sLine = series.candle.createPriceLine({
                    price: nearestSupport,
                    color: 'rgba(16, 185, 129, 0.6)',
                    lineWidth: 1,
                    lineStyle: 2, // dashed
                    title: `S: ${nearestSupport.toFixed(4)}`,
                });
                chartRef.current.priceLines.push(sLine);
            }

            if (nearestResistance !== undefined && nearestResistance !== null) {
                const rLine = series.candle.createPriceLine({
                    price: nearestResistance,
                    color: 'rgba(239, 68, 68, 0.6)',
                    lineWidth: 1,
                    lineStyle: 2, // dashed
                    title: `R: ${nearestResistance.toFixed(4)}`,
                });
                chartRef.current.priceLines.push(rLine);
            }

            chart.timeScale().fitContent();

        } catch (err) {
            console.error('Error fetching candles:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initialize Chart
    useEffect(() => {
        if (!containerRef.current) return;

        const isDark = theme === 'dark';
        const rect = containerRef.current.getBoundingClientRect();
        const chart = createChart(containerRef.current, {
            width: rect.width || 600,
            height: rect.height || 450,
            layout: {
                background: { type: 'solid', color: isDark ? '#020B07' : '#ffffff' },
                textColor: isDark ? 'rgba(255, 255, 255, 0.7)' : '#475569',
                fontSize: 11,
                fontFamily: "'Outfit', sans-serif",
                attributionLogo: false,
            },
            grid: {
                vertLines: { color: isDark ? 'rgba(0, 255, 136, 0.06)' : '#e2e8f0' },
                horzLines: { color: isDark ? 'rgba(0, 255, 136, 0.06)' : '#e2e8f0' },
            },
            crosshair: {
                vertLine: { color: isDark ? 'rgba(0, 255, 136, 0.3)' : '#cbd5e1', width: 1 },
                horzLine: { color: isDark ? 'rgba(0, 255, 136, 0.3)' : '#cbd5e1', width: 1 },
            },
            timeScale: {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0',
                timeVisible: true,
                secondsVisible: false,
                rightOffset: 10,
                barSpacing: 8,
            },
            rightPriceScale: {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0',
                scaleMargins: { top: 0.05, bottom: 0.04 },
            },
        });

        // Add series
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderUpColor: '#10b981',
            borderDownColor: '#ef4444',
            wickUpColor: '#10b98180',
            wickDownColor: '#ef444480',
        });

        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
        });
        chart.priceScale('volume').applyOptions({
            scaleMargins: { top: 0.82, bottom: 0 },
        });

        const ema20Series = chart.addSeries(LineSeries, {
            color: '#f59e0b',
            lineWidth: 1.5,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
        });

        const ema50Series = chart.addSeries(LineSeries, {
            color: '#10B981',
            lineWidth: 1.5,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
        });

        const supertrendSeries = chart.addSeries(LineSeries, {
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
        });

        chartRef.current = {
            chart,
            series: {
                candle: candleSeries,
                volume: volumeSeries,
                ema20: ema20Series,
                ema50: ema50Series,
                supertrend: supertrendSeries,
            },
            priceLines: [],
        };

        const handleResize = () => {
            if (containerRef.current && chartRef.current?.chart) {
                const r = containerRef.current.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) {
                    chartRef.current.chart.applyOptions({ width: r.width, height: r.height });
                }
            }
        };
        window.addEventListener('resize', handleResize);

        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Subscribe to crosshair hover moves to dynamically show OHLC
        chart.subscribeCrosshairMove((param) => {
            if (!param.time) {
                setHoveredData(null);
                setDotPositions(null);
                return;
            }

            const t = param.time;
            const data = chartDataRef.current;
            if (!data.candles || data.candles.length === 0) return;

            const idx = data.candles.findIndex(c => c.time === t);
            if (idx !== -1) {
                const hoveredCandle = data.candles[idx];
                const prevCandle = idx > 0 ? data.candles[idx - 1] : hoveredCandle;

                const open = hoveredCandle.open;
                const high = hoveredCandle.high;
                const low = hoveredCandle.low;
                const close = hoveredCandle.close;

                const change = close - prevCandle.close;
                const changePct = prevCandle.close > 0 ? (change / prevCandle.close) * 100 : 0;

                const ema20 = data.ema20Map.get(t);
                const ema50 = data.ema50Map.get(t);
                const supertrendObj = data.supertrendMap.get(t);

                setHoveredData({
                    open,
                    high,
                    low,
                    close,
                    change,
                    changePct,
                    isBullish: close >= open,
                    ema20,
                    ema50,
                    supertrend: supertrendObj?.value,
                    supertrendColor: supertrendObj?.color
                });

                // Calculate pixel coordinates for the dots overlay
                const chartInstance = chartRef.current?.chart;
                const seriesInstance = chartRef.current?.series;
                if (!chartInstance || !seriesInstance) return;

                const timeScale = chartInstance.timeScale();
                const x = timeScale.timeToCoordinate(t);
                const positions = {};
                if (x !== null) {
                    if (ema20 !== undefined && ema20 !== null) {
                        const y = seriesInstance.ema20.priceToCoordinate(ema20);
                        if (y !== null) positions.ema20 = { x, y, color: '#f59e0b' };
                    }
                    if (ema50 !== undefined && ema50 !== null) {
                        const y = seriesInstance.ema50.priceToCoordinate(ema50);
                        if (y !== null) positions.ema50 = { x, y, color: '#10B981' };
                    }
                    if (supertrendObj?.value !== undefined && supertrendObj?.value !== null) {
                        const y = seriesInstance.supertrend.priceToCoordinate(supertrendObj.value);
                        if (y !== null) positions.supertrend = { x, y, color: supertrendObj.color };
                    }
                }
                setDotPositions(positions);
            } else {
                setHoveredData(null);
                setDotPositions(null);
            }
        });

        // Fetch data initially
        fetchAndPlotData();

        return () => {
            if (resizeObserver) resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartRef.current = null;
        };
    }, [symbol, timeframe, theme]);

    // Update support & resistance lines smoothly without refetching all candles
    useEffect(() => {
        if (!chartRef.current?.series?.candle) return;
        const series = chartRef.current.series;

        if (chartRef.current.priceLines) {
            chartRef.current.priceLines.forEach(pl => {
                try { series.candle.removePriceLine(pl); } catch (e) { }
            });
        }
        chartRef.current.priceLines = [];

        if (nearestSupport !== undefined && nearestSupport !== null) {
            const sLine = series.candle.createPriceLine({
                price: nearestSupport,
                color: 'rgba(16, 185, 129, 0.6)',
                lineWidth: 1,
                lineStyle: 2,
                title: `S: ${nearestSupport.toFixed(4)}`,
            });
            chartRef.current.priceLines.push(sLine);
        }

        if (nearestResistance !== undefined && nearestResistance !== null) {
            const rLine = series.candle.createPriceLine({
                price: nearestResistance,
                color: 'rgba(239, 68, 68, 0.6)',
                lineWidth: 1,
                lineStyle: 2,
                title: `R: ${nearestResistance.toFixed(4)}`,
            });
            chartRef.current.priceLines.push(rLine);
        }
    }, [nearestSupport, nearestResistance]);

    // Refetch when strategy changes
    useEffect(() => {
        if (chartRef.current && strategyId) {
            fetchAndPlotData();
        }
    }, [strategyId]);

    // Handle dynamic next-hour timeout refresh
    useEffect(() => {
        const scheduleNextRefresh = () => {
            const delay = getMsUntilNextHourOOne();

            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }

            refreshTimeoutRef.current = setTimeout(() => {
                if (onRefreshNeeded) {
                    onRefreshNeeded();
                }
                scheduleNextRefresh();
            }, delay);
        };

        scheduleNextRefresh();

        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, [symbol, strategyId, timeframe, onRefreshNeeded]);

    useEffect(() => {
        prevPriceRef.current = 0;
        setTickClass('normal');
        setHoveredData(null);
        setDotPositions(null);
    }, [symbol]);

    useEffect(() => {
        if (!priceInfo) return;
        const currentPrice = priceInfo.price;
        const prevPrice = prevPriceRef.current;
        if (prevPrice > 0 && currentPrice !== prevPrice) {
            setTickClass(currentPrice > prevPrice ? 'upTick' : 'downTick');
            const timer = setTimeout(() => setTickClass('normal'), 600);
            return () => clearTimeout(timer);
        }
        prevPriceRef.current = currentPrice;
    }, [priceInfo]);

    const displayOpen = hoveredData ? hoveredData.open : priceInfo?.open;
    const displayHigh = hoveredData ? hoveredData.high : priceInfo?.high;
    const displayLow = hoveredData ? hoveredData.low : priceInfo?.low;
    const displayClose = hoveredData ? hoveredData.close : (priceInfo?.close || priceInfo?.price);
    const displayChange = hoveredData ? hoveredData.change : priceInfo?.change;
    const displayChangePct = hoveredData ? hoveredData.changePct : priceInfo?.changePct;

    const isBullish = hoveredData
        ? hoveredData.isBullish
        : (displayChange !== undefined ? displayChange >= 0 : true);

    const colorClass = isBullish ? styles.itemBullish : styles.itemBearish;

    return (
        <div className={styles.chartPanel}>
            <div className={styles.chartPanelHeader}>
                <div className={styles.chartTitleArea}>
                    <h3>{symbol}</h3>
                    <span className={styles.chartTimeframeBadge}>{timeframe}</span>
                    {priceInfo ? (
                        <div className={styles.chartHeaderOHLCInfo}>
                            <div className={styles.ohlcItem}>
                                <span className={styles.ohlcLabel}>O</span>
                                <span className={`${styles.ohlcValue} ${colorClass}`}>
                                    {formatPairCurrency(displayOpen, symbol)}
                                </span>
                            </div>
                            <div className={styles.ohlcItem}>
                                <span className={styles.ohlcLabel}>H</span>
                                <span className={`${styles.ohlcValue} ${colorClass}`}>
                                    {formatPairCurrency(displayHigh, symbol)}
                                </span>
                            </div>
                            <div className={styles.ohlcItem}>
                                <span className={styles.ohlcLabel}>L</span>
                                <span className={`${styles.ohlcValue} ${colorClass}`}>
                                    {formatPairCurrency(displayLow, symbol)}
                                </span>
                            </div>
                            <div className={styles.ohlcItem}>
                                <span className={styles.ohlcLabel}>C</span>
                                <span className={`${styles.ohlcValue} ${colorClass}`}>
                                    {formatPairCurrency(displayClose, symbol)}
                                </span>
                            </div>
                            {displayChange !== undefined && displayChangePct !== undefined && (
                                <div className={styles.ohlcItem}>
                                    <span className={`${styles.ohlcValue} ${colorClass}`}>
                                        {displayChange >= 0 ? '+' : ''}{formatPairCurrency(displayChange, symbol)} ({displayChange >= 0 ? '+' : ''}{displayChangePct.toFixed(2)}%)
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.chartHeaderOHLCSkeleton}>
                            <div className={styles.skeletonOhlcItem} />
                            <div className={styles.skeletonOhlcItem} />
                            <div className={styles.skeletonOhlcItem} />
                            <div className={styles.skeletonOhlcItem} />
                            <div className={styles.skeletonOhlcItemWide} />
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.chartCanvasContainer}>
                {loading && (
                    <div className={styles.chartOverlay}>
                        <div className={styles.chartSpinner} />
                        <span>Loading chart...</span>
                    </div>
                )}
                {error && (
                    <div className={styles.chartOverlay}>
                        <span className={styles.chartErrorText}>Error: {error}</span>
                        <button onClick={fetchAndPlotData} className={styles.chartRetryBtn}>Retry</button>
                    </div>
                )}
                <div ref={containerRef} className={styles.chartCanvas} />

                {/* Render Indicator Dots Overlay tracking the crosshair */}
                {dotPositions && (
                    <div className={styles.chartDotsOverlay}>
                        {Object.entries(dotPositions).map(([key, pos]) => (
                            <div
                                key={key}
                                className={styles.chartIndicatorDot}
                                style={{
                                    left: `${pos.x}px`,
                                    top: `${pos.y}px`,
                                    backgroundColor: pos.color
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Chart Legend moved to the end of the chart */}
            <div className={styles.chartLegendContainer}>
                <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                        <span className={`${styles.legendColor} ${styles.ema20}`} />
                        <span>EMA 20 </span>
                    </div>
                    <div className={styles.legendItem}>
                        <span className={`${styles.legendColor} ${styles.ema50}`} />
                        <span>EMA 50 </span>
                    </div>
                    <div className={styles.legendItem}>
                        <span className={`${styles.legendColor} ${styles.supertrend}`} />
                        <span>SuperTrend </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

