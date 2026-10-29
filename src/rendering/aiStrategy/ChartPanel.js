'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import styles from './aiStrategy.module.scss';
import { useTheme } from '@/context/ThemeContext';
import { parseCandleTimestamp, applySymbolPrecision } from '@/lib/chartStore';
import { unifiedSocket, cleanPairSymbol } from '@/lib/unifiedSocket';

import { 
    getMsUntilNextHourOOne, 
    formatPairCurrency, 
    generateFallbackCandles, 
    calculateLiveCandleUpdate,
    getChartConfig,
    handleCrosshairMove,
    createWheelZoomHandler
} from './utils/chartHelpers';
import ChartLegend from './components/ChartLegend';

export default function ChartPanel({ symbol, strategyId, timeframe = '1H', nearestSupport, nearestResistance, onRefreshNeeded, livePriceInfo }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme !== 'light';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [priceInfo, setPriceInfo] = useState(null);
    const prevPriceRef = useRef(0);
    const [tickClass, setTickClass] = useState('normal');

    // Safety Watchdog: Never let chart overlay get stuck for more than 2.5s
    useEffect(() => {
        if (loading) {
            const safetyTimer = setTimeout(() => {
                setLoading(false);
            }, 2500);
            return () => clearTimeout(safetyTimer);
        }
    }, [loading]);

    const [hoveredData, setHoveredData] = useState(null);
    const [dotPositions, setDotPositions] = useState(null);
    const [visibleIndicators, setVisibleIndicators] = useState({
        ema20: true,
        ema50: true,
        supertrend: true
    });

    const toggleIndicator = (key) => {
        setVisibleIndicators(prev => {
            const nextState = !prev[key];
            const series = chartRef.current?.series?.[key];
            if (series) {
                series.applyOptions({ visible: nextState });
            }
            return { ...prev, [key]: nextState };
        });
    };

    const chartDataRef = useRef({
        candles: [],
        ema20Map: new Map(),
        ema50Map: new Map(),
        supertrendMap: new Map()
    });

    const refreshTimeoutRef = useRef(null);

    // Fetch and populate chart data
    const fetchAndPlotData = async () => {
        if (!symbol) return;
        setLoading(true);
        setError(null);

        const cleanSymbol = symbol.replace('/', '').replace(' ', '').toUpperCase();
        const effectiveStrategyId = strategyId || '3e8d2b78-0e86-4fdf-9759-338276db1742';

        // Multi-candidate resilient endpoint list:
        // 1. Internal Next.js proxy route (queries backend + Supabase with full indicator pipeline)
        // 2. Configured NEXT_PUBLIC_BACKEND_URL
        // 3. Direct Production API (https://api.thetradermaster.com)
        const candidateUrls = [];
        if (typeof window !== 'undefined') {
            candidateUrls.push(`/api/v1/chart/candles?symbol=${cleanSymbol}&timeframe=${timeframe}&strategy_id=${effectiveStrategyId}`);
        }
        const envBackend = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/+$/, '');
        if (envBackend && !candidateUrls.some(u => u.startsWith(envBackend))) {
            candidateUrls.push(`${envBackend}/api/v1/chart/candles?symbol=${cleanSymbol}&timeframe=${timeframe}&strategy_id=${effectiveStrategyId}`);
        }
        const prodBackend = 'https://api.thetradermaster.com';
        if (!candidateUrls.some(u => u.startsWith(prodBackend))) {
            candidateUrls.push(`${prodBackend}/api/v1/chart/candles?symbol=${cleanSymbol}&timeframe=${timeframe}&strategy_id=${effectiveStrategyId}`);
        }

        let candlesList = [];

        for (const url of candidateUrls) {
            try {
                const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

                const res = await fetch(url, {
                    headers: {
                        'accept': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    signal: controller?.signal
                });

                if (timeoutId) clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    const list = Array.isArray(data?.candles) ? data.candles : (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
                    if (list.length > 0) {
                        candlesList = list;
                        break;
                    }
                }
            } catch (err) {
                // Silently try next candidate
            }
        }

        if (candlesList.length === 0) {
            const anchor = unifiedSocket.getKnownPrice(cleanSymbol) || (livePriceInfo?.price ? Number(livePriceInfo.price) : null);
            if (anchor && !isNaN(anchor) && Number(anchor) > 0) {
                candlesList = generateFallbackCandles(cleanSymbol, timeframe, anchor);
            }
        }

        try {
            if (!chartRef.current || !containerRef.current) {
                setLoading(false);
                return;
            }

            const chart = chartRef.current.chart;
            const series = chartRef.current.series;

            // Format candles for Lightweight Charts (AI Chat Palette: Bullish #26a69a, Bearish #ef5350)
            const candleData = [];
            const volumeData = [];
            const ema20Data = [];
            const ema50Data = [];
            const supertrendData = [];

            candlesList.forEach((c) => {
                const ts = parseCandleTimestamp(c.time || c.timestamp);

                const o = parseFloat(c.open);
                const h = parseFloat(c.high);
                const l = parseFloat(c.low);
                const cl = parseFloat(c.close);
                const vol = parseInt(c.tick_volume || 0);

                candleData.push({ time: ts, open: o, high: h, low: l, close: cl, tick_volume: vol });

                volumeData.push({
                    time: ts,
                    value: vol,
                    color: cl >= o ? 'rgba(38, 166, 154, 0.35)' : 'rgba(239, 83, 80, 0.35)',
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
                        color: c.supertrend_direction === 1 ? '#26a69a' : '#ef5350',
                    });
                }
            });

            // If real live price or scanner price is known, synchronize the forming candle with the active market price
            const activeLivePrice = (livePriceInfo?.price && !isNaN(livePriceInfo.price) && Number(livePriceInfo.price) > 0)
                ? Number(livePriceInfo.price)
                : (unifiedSocket.getKnownPrice(cleanSymbol) || null);

            if (activeLivePrice && candleData.length > 0) {
                const last = candleData[candleData.length - 1];
                const ratio = activeLivePrice / (last.close || activeLivePrice);
                // Only synchronize forming candle if price is within safe 3% threshold of genuine historical close
                if (ratio >= 0.97 && ratio <= 1.03) {
                    last.close = activeLivePrice;
                    last.high = Math.max(last.high, activeLivePrice);
                    const safeLow = Math.min(last.low || last.open, activeLivePrice);
                    last.low = safeLow > 0 ? safeLow : Math.min(last.open, activeLivePrice);
                }
            }

            // Set data into series
            applySymbolPrecision(series.candle, symbol);
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

            const numSupport = Number(nearestSupport);
            if (nearestSupport !== undefined && nearestSupport !== null && !isNaN(numSupport) && isFinite(numSupport)) {
                const sLine = series.candle.createPriceLine({
                    price: numSupport,
                    color: 'rgba(38, 166, 154, 0.8)',
                    lineWidth: 1,
                    lineStyle: 2,
                    title: `S: ${numSupport.toFixed(4)}`,
                });
                chartRef.current.priceLines.push(sLine);
            }

            const numResistance = Number(nearestResistance);
            if (nearestResistance !== undefined && nearestResistance !== null && !isNaN(numResistance) && isFinite(numResistance)) {
                const rLine = series.candle.createPriceLine({
                    price: numResistance,
                    color: 'rgba(239, 83, 80, 0.8)',
                    lineWidth: 1,
                    lineStyle: 2,
                    title: `R: ${numResistance.toFixed(4)}`,
                });
                chartRef.current.priceLines.push(rLine);
            }

            if (containerRef.current) {
                const r = containerRef.current.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) {
                    chart.applyOptions({ width: r.width, height: r.height });
                }
            }

            // Set default initial zoom to zoomed out view with right offset space (matching Image 2)
            const totalBars = candleData.length;
            if (totalBars > 0) {
                const visibleBars = Math.min(totalBars, 110);
                chart.timeScale().applyOptions({
                    barSpacing: 6.5,
                    rightOffset: 20,
                });
                chart.timeScale().setVisibleLogicalRange({
                    from: totalBars - visibleBars,
                    to: totalBars + 20,
                });
            } else {
                chart.timeScale().fitContent();
            }

        } catch (err) {
            console.error('Error rendering candles:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initialize Chart (Matching AI Chat Dark Background & Theme)
    useEffect(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const initialHeight = rect.height > 100 ? rect.height : (containerRef.current.clientHeight || 480);
        const initialWidth = rect.width > 100 ? rect.width : (containerRef.current.clientWidth || 600);

        const isLight = theme === 'light';
        const chart = createChart(containerRef.current, getChartConfig(initialWidth, initialHeight, isLight, isDark));

        // Add series with AI Chat color palette (#26a69a / #ef5350)
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderUpColor: '#26a69a',
            borderDownColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            priceLineVisible: true,
            lastValueVisible: true,
        });
        applySymbolPrecision(candleSeries, symbol);

        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
            priceLineVisible: false,
            lastValueVisible: false,
        });
        chart.priceScale('volume').applyOptions({
            scaleMargins: { top: 0.82, bottom: 0 },
            visible: false,
        });

        const ema20Series = chart.addSeries(LineSeries, {
            color: '#60A5FA',
            lineWidth: 1.5,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
        });

        const ema50Series = chart.addSeries(LineSeries, {
            color: '#F59E0B',
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

        // Crosshair move subscription
        chart.subscribeCrosshairMove((param) => {
            handleCrosshairMove(param, chartRef, chartDataRef, setHoveredData, setDotPositions);
        });

        const containerEl = containerRef.current;
        const handleWheelZoom = createWheelZoomHandler(chartRef);

        if (containerEl) {
            containerEl.addEventListener('wheel', handleWheelZoom, { passive: false });
        }

        fetchAndPlotData();

        return () => {
            if (containerEl) {
                containerEl.removeEventListener('wheel', handleWheelZoom);
            }
            if (resizeObserver) resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartRef.current = null;
        };
    }, [symbol, timeframe, theme, isDark]);

    useEffect(() => {
        if (chartRef.current) {
            fetchAndPlotData();
        }
    }, [strategyId, nearestSupport, nearestResistance]);

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

    const tickTimerRef = useRef(null);
    const lastResyncRef = useRef(0);

    // Apply live price tick to Lightweight Charts CandlestickSeries & OHLC state
    const applyLivePriceTick = (newPrice, meta = {}) => {
        if (!newPrice || isNaN(newPrice) || newPrice <= 0) return;
        const series = chartRef.current?.series;
        if (!series?.candle) return;

        const result = calculateLiveCandleUpdate(chartDataRef.current.candles, newPrice, timeframe, meta);
        if (!result) return;

        if (result.needsResync) {
            const now = Date.now();
            if (now - lastResyncRef.current > 4000) {
                lastResyncRef.current = now;
                console.warn('[ChartPanel] Price deviation detected, resyncing genuine chart data...');
                fetchAndPlotData();
            }
            return;
        }

        const { updatedBar, change, changePct } = result;
        if (!updatedBar) return;

        try {
            series.candle.update(updatedBar);
        } catch (e) {
            console.warn('[ChartPanel] series.candle.update error:', e);
        }

        if (series.volume) {
            try {
                series.volume.update({
                    time: updatedBar.time,
                    value: updatedBar.tick_volume || 1500,
                    color: updatedBar.close >= updatedBar.open ? 'rgba(38, 166, 154, 0.35)' : 'rgba(239, 83, 80, 0.35)',
                });
            } catch (_) {}
        }

        const prevPrice = prevPriceRef.current;
        if (prevPrice > 0 && newPrice !== prevPrice) {
            setTickClass(newPrice > prevPrice ? 'upTick' : 'downTick');
            if (tickTimerRef.current) clearTimeout(tickTimerRef.current);
            tickTimerRef.current = setTimeout(() => setTickClass('normal'), 600);
        }
        prevPriceRef.current = newPrice;

        setPriceInfo(prev => ({
            ...(prev || {}),
            open: updatedBar.open,
            high: updatedBar.high,
            low: updatedBar.low,
            close: updatedBar.close,
            price: newPrice,
            change,
            changePct,
        }));
    };

    // Unified WebSocket subscription for real-time live price & candle streaming
    useEffect(() => {
        if (!symbol) return;
        const cleanSym = cleanPairSymbol(symbol);
        unifiedSocket.switchSubscription({ symbol: cleanSym, timeframe });

        const unsubPrice = unifiedSocket.subscribePrice((priceObj) => {
            if (!priceObj) return;
            const newPrice = parseFloat(priceObj.price ?? priceObj.close ?? priceObj.last);
            if (!isNaN(newPrice) && newPrice > 0) {
                applyLivePriceTick(newPrice, priceObj);
            }
        }, cleanSym);

        const candleSubFn = unifiedSocket.subscribeCandles || unifiedSocket.subscribeCandle;
        const unsubCandle = typeof candleSubFn === 'function' ? candleSubFn.call(unifiedSocket, (candleObj) => {
            if (!candleObj) return;
            const close = parseFloat(candleObj.close ?? candleObj.c ?? candleObj.price);
            if (!isNaN(close) && close > 0) {
                applyLivePriceTick(close, candleObj);
            }
        }, cleanSym, timeframe) : () => {};

        return () => {
            unsubPrice();
            if (typeof unsubCandle === 'function') unsubCandle();
            if (tickTimerRef.current) clearTimeout(tickTimerRef.current);
        };
    }, [symbol, timeframe]);

    // External livePriceInfo synchronization (e.g. from WatchlistPanel)
    useEffect(() => {
        if (!livePriceInfo) return;
        const infoSym = cleanPairSymbol(livePriceInfo.symbol);
        const currentSym = cleanPairSymbol(symbol);
        if (infoSym && currentSym && infoSym !== currentSym) return;

        const newPrice = parseFloat(livePriceInfo.price ?? livePriceInfo.close);
        if (!isNaN(newPrice) && newPrice > 0) {
            applyLivePriceTick(newPrice, livePriceInfo);
        }
    }, [livePriceInfo, symbol, timeframe]);

    useEffect(() => {
        prevPriceRef.current = 0;
        setTickClass('normal');
        setHoveredData(null);
        setDotPositions(null);
    }, [symbol]);

    const activePrice = (livePriceInfo && cleanPairSymbol(livePriceInfo.symbol) === cleanPairSymbol(symbol))
        ? livePriceInfo
        : priceInfo;

    const displayOpen = hoveredData ? hoveredData.open : activePrice?.open;
    const displayHigh = hoveredData ? hoveredData.high : activePrice?.high;
    const displayLow = hoveredData ? hoveredData.low : activePrice?.low;
    const displayClose = hoveredData ? hoveredData.close : (activePrice?.close || activePrice?.price);
    const displayChange = hoveredData ? hoveredData.change : activePrice?.change;
    const displayChangePct = hoveredData ? hoveredData.changePct : activePrice?.changePct;

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
                    <div
                        className={styles.chartFeedBadge}
                        title="Institutional tick bridge. Quotes update dynamically (standard 15m indicative delay may apply during low-liquidity periods)."
                    >
                        <span className={styles.chartFeedDot} />
                        <span className={styles.chartFeedLabel}>LIVE FEED</span>
                    </div>
                </div>

                {loading && !activePrice ? (
                    <div className={styles.chartHeaderOHLCSkeleton}>
                        <div className={`${styles.skeletonPulse} ${styles.ohlcSkelBox}`} />
                        <div className={`${styles.skeletonPulse} ${styles.ohlcSkelBox}`} />
                        <div className={`${styles.skeletonPulse} ${styles.ohlcSkelBox}`} />
                        <div className={`${styles.skeletonPulse} ${styles.ohlcSkelBox}`} />
                    </div>
                ) : activePrice ? (
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
                ) : null}
            </div>

            <div className={styles.chartCanvasContainer} style={{ cursor: 'crosshair' }}>
                {loading && (
                    <div className={styles.chartOverlay}>
                        <div className={styles.chartSpinner} />
                        <span>Loading chart data...</span>
                    </div>
                )}
                {error && (
                    <div className={styles.chartOverlay}>
                        <span className={styles.chartErrorText}>Error: {error}</span>
                        <button onClick={fetchAndPlotData} className={styles.chartRetryBtn}>Retry</button>
                    </div>
                )}
                <div ref={containerRef} className={styles.chartCanvas} style={{ cursor: 'crosshair' }} />

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

            {/* Custom Chart Legend with Interactive Eye Visibility Toggles */}
            <ChartLegend visibleIndicators={visibleIndicators} toggleIndicator={toggleIndicator} />
        </div>
    );
}
