'use client';

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/strategyStudio.module.scss';
import { useTheme } from '@/context/ThemeContext';
import ChartSkeletonLoader from './ChartSkeletonLoader';
import {
    parseTimestamp,
    formatCategoryDate,
    buildCandlestickData,
    BUY_ARROW_SVG,
    SELL_ARROW_SVG,
    renderCandleTooltip
} from '../utils/candlestickUtils';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <ChartSkeletonLoader type="candlestick" />
});

export default function BacktestCandlestickChart({
    results,
    roundTrips = [],
    symbol = 'EURUSD',
    interval = '15min',
    quantity = 0.01,
    capital = 10000
}) {
    const { theme } = useTheme();
    const isDark = theme !== 'light';
    const [mounted, setMounted] = useState(false);

    // Range state for zoom & pan (start and end indices into candleData)
    const [range, setRange] = useState({ start: 0, end: 60 });
    const rangeRef = useRef(range);
    rangeRef.current = range;

    const canvasWrapRef = useRef(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startRangeRef = useRef({ start: 0, end: 60 });
    const [isPanning, setIsPanning] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Build Candlestick Series (Continuous without weekend/calendar dead spaces)
    const candleData = useMemo(() => {
        return buildCandlestickData(results, roundTrips, symbol, interval);
    }, [results, roundTrips, symbol, interval]);

    const candleDataRef = useRef(candleData);
    candleDataRef.current = candleData;

    // Reset range whenever candleData changes (default to latest 60 bars)
    useEffect(() => {
        if (candleData && candleData.length > 0) {
            const total = candleData.length;
            const defaultWindow = Math.min(total, 60);
            const initial = {
                start: Math.max(0, total - defaultWindow),
                end: total
            };
            setRange(initial);
            rangeRef.current = initial;
        }
    }, [candleData]);

    // Pre-index trades with parsed timestamps for lookup
    const parsedTrips = useMemo(() => {
        const safeTrips = Array.isArray(roundTrips) ? roundTrips : [];
        return safeTrips.map((t, idx) => ({
            ...t,
            index: idx + 1,
            entryTs: t.entryDate ? parseTimestamp(t.entryDate) : null,
            exitTs: t.exitDate ? parseTimestamp(t.exitDate) : null,
            pnlNum: Number(t.pnl) || 0
        }));
    }, [roundTrips]);

    // Active visible window of candles
    const visibleCandles = useMemo(() => {
        if (!candleData || candleData.length === 0) return [];
        const s = Math.max(0, Math.min(candleData.length - 1, range.start));
        const e = Math.max(s + 5, Math.min(candleData.length, range.end));
        return candleData.slice(s, e);
    }, [candleData, range]);


    // Wheel zoom handler: cursor-centered zoom in / out
    useEffect(() => {
        const el = canvasWrapRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            const data = candleDataRef.current;
            if (!data || data.length <= 10) return;

            e.preventDefault();
            e.stopPropagation();

            const total = data.length;
            const cur = rangeRef.current;
            const curLen = cur.end - cur.start;

            // Anchor ratio from mouse X coordinate relative to chart element
            const rect = el.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, mouseX / rect.width));

            // Zoom in: deltaY < 0 (fewer bars), Zoom out: deltaY > 0 (more bars)
            const zoomFactor = e.deltaY < 0 ? 0.8 : 1.25;
            const MIN_CANDLES = 12;
            const MAX_CANDLES = total;

            let newLen = Math.round(curLen * zoomFactor);
            if (newLen < MIN_CANDLES) newLen = MIN_CANDLES;
            if (newLen > MAX_CANDLES) newLen = MAX_CANDLES;

            if (newLen === curLen && (curLen === MIN_CANDLES || curLen === MAX_CANDLES)) {
                return;
            }

            // Keep anchor index stationary under cursor
            const anchorIdx = cur.start + ratio * curLen;
            let newStart = Math.round(anchorIdx - ratio * newLen);
            let newEnd = newStart + newLen;

            if (newStart < 0) {
                newStart = 0;
                newEnd = Math.min(total, newStart + newLen);
            }
            if (newEnd > total) {
                newEnd = total;
                newStart = Math.max(0, newEnd - newLen);
            }

            const next = { start: newStart, end: newEnd };
            rangeRef.current = next;
            setRange(next);
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            el.removeEventListener('wheel', handleWheel);
        };
    }, []);

    // Global mouseup / mousemove listener for smooth panning
    useEffect(() => {
        const onGlobalMouseMove = (e) => {
            if (!isDraggingRef.current || !canvasWrapRef.current) return;
            const data = candleDataRef.current;
            if (!data || data.length <= 0) return;

            const dx = e.clientX - startXRef.current;
            const total = data.length;
            const curLen = startRangeRef.current.end - startRangeRef.current.start;
            const rect = canvasWrapRef.current.getBoundingClientRect();
            const candlePxWidth = Math.max(1, rect.width / curLen);
            const candleShift = Math.round(-dx / candlePxWidth);

            let newStart = startRangeRef.current.start + candleShift;
            if (newStart < 0) newStart = 0;
            if (newStart + curLen > total) newStart = total - curLen;

            const next = { start: newStart, end: newStart + curLen };
            rangeRef.current = next;
            setRange(next);
        };

        const onGlobalMouseUp = () => {
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                setIsPanning(false);
            }
        };

        window.addEventListener('mousemove', onGlobalMouseMove);
        window.addEventListener('mouseup', onGlobalMouseUp);
        return () => {
            window.removeEventListener('mousemove', onGlobalMouseMove);
            window.removeEventListener('mouseup', onGlobalMouseUp);
        };
    }, []);

    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        if (!candleData || candleData.length === 0) return;
        isDraggingRef.current = true;
        startXRef.current = e.clientX;
        startRangeRef.current = { ...rangeRef.current };
        setIsPanning(true);
    };

    const handleTouchStart = (e) => {
        if (!candleData || candleData.length === 0 || e.touches.length !== 1) return;
        isDraggingRef.current = true;
        startXRef.current = e.touches[0].clientX;
        startRangeRef.current = { ...rangeRef.current };
        setIsPanning(true);
    };

    const handleTouchMove = (e) => {
        if (!isDraggingRef.current || !canvasWrapRef.current || e.touches.length !== 1) return;
        const data = candleDataRef.current;
        if (!data || data.length <= 0) return;

        const dx = e.touches[0].clientX - startXRef.current;
        const total = data.length;
        const curLen = startRangeRef.current.end - startRangeRef.current.start;
        const rect = canvasWrapRef.current.getBoundingClientRect();
        const candlePxWidth = Math.max(1, rect.width / curLen);
        const candleShift = Math.round(-dx / candlePxWidth);

        let newStart = startRangeRef.current.start + candleShift;
        if (newStart < 0) newStart = 0;
        if (newStart + curLen > total) newStart = total - curLen;

        const next = { start: newStart, end: newStart + curLen };
        rangeRef.current = next;
        setRange(next);
    };

    const handleTouchEnd = () => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsPanning(false);
        }
    };

    // Zoom button controls
    const handleZoomIn = useCallback(() => {
        const data = candleDataRef.current;
        if (!data || data.length === 0) return;
        const total = data.length;
        const cur = rangeRef.current;
        const curLen = cur.end - cur.start;
        const newLen = Math.max(12, Math.round(curLen * 0.75));
        const mid = (cur.start + cur.end) / 2;
        let newStart = Math.max(0, Math.round(mid - newLen / 2));
        let newEnd = newStart + newLen;
        if (newEnd > total) {
            newEnd = total;
            newStart = Math.max(0, newEnd - newLen);
        }
        const next = { start: newStart, end: newEnd };
        rangeRef.current = next;
        setRange(next);
    }, []);

    const handleZoomOut = useCallback(() => {
        const data = candleDataRef.current;
        if (!data || data.length === 0) return;
        const total = data.length;
        const cur = rangeRef.current;
        const curLen = cur.end - cur.start;
        const newLen = Math.min(total, Math.round(curLen * 1.35));
        const mid = (cur.start + cur.end) / 2;
        let newStart = Math.max(0, Math.round(mid - newLen / 2));
        let newEnd = newStart + newLen;
        if (newStart < 0) {
            newStart = 0;
            newEnd = Math.min(total, newStart + newLen);
        }
        if (newEnd > total) {
            newEnd = total;
            newStart = Math.max(0, newEnd - newLen);
        }
        const next = { start: newStart, end: newEnd };
        rangeRef.current = next;
        setRange(next);
    }, []);

    const handleResetZoom = useCallback(() => {
        const data = candleDataRef.current;
        if (!data || data.length === 0) return;
        const total = data.length;
        const defaultWindow = Math.min(total, 60);
        const next = {
            start: Math.max(0, total - defaultWindow),
            end: total
        };
        rangeRef.current = next;
        setRange(next);
    }, []);

    const setBarWindow = useCallback((count) => {
        const data = candleDataRef.current;
        if (!data || data.length === 0) return;
        const total = data.length;
        const len = count === 'all' ? total : Math.min(total, parseInt(count, 10) || 60);
        const next = {
            start: Math.max(0, total - len),
            end: total
        };
        rangeRef.current = next;
        setRange(next);
    }, []);

    const intervalMs = useMemo(() => {
        const intvClean = (interval || '').toLowerCase().trim();
        if (intvClean === '1min' || intvClean === '1m') return 60 * 1000;
        if (intvClean === '5min' || intvClean === '5m') return 5 * 60 * 1000;
        if (intvClean === '15min' || intvClean === '15m') return 15 * 60 * 1000;
        if (intvClean === '30min' || intvClean === '30m') return 30 * 60 * 1000;
        if (intvClean === '60min' || intvClean === '1h' || intvClean === '1hour') return 60 * 60 * 1000;
        if (intvClean === '4h' || intvClean === '4hour') return 4 * 3600 * 1000;
        if (intvClean === '1d' || intvClean === '1day' || intvClean === 'day') return 24 * 3600 * 1000;
        return 30 * 60 * 1000;
    }, [interval]);

    // Fast binary search to find closest candle within visible range
    const findClosestInVisible = useCallback((targetTs) => {
        if (!visibleCandles || visibleCandles.length === 0) return null;
        let low = 0;
        let high = visibleCandles.length - 1;
        while (low <= high) {
            const mid = (low + high) >> 1;
            const midTs = visibleCandles[mid].ts;
            if (midTs === targetTs) return visibleCandles[mid];
            if (midTs < targetTs) low = mid + 1;
            else high = mid - 1;
        }
        const c1 = visibleCandles[Math.max(0, high)];
        const c2 = visibleCandles[Math.min(visibleCandles.length - 1, low)];
        if (!c1) return c2;
        if (!c2) return c1;
        return Math.abs(c1.ts - targetTs) <= Math.abs(c2.ts - targetTs) ? c1 : c2;
    }, [visibleCandles]);

    // Build Annotations (Clean entry/exit markers)
    const annotations = useMemo(() => {
        const points = [];
        const xaxis = [];
        if (!visibleCandles || visibleCandles.length === 0) return { points, xaxis };

        const seenEntryCategories = new Set();
        const seenExitCategories = new Set();
        const firstVisibleTs = visibleCandles[0].ts - intervalMs;
        const lastVisibleTs = visibleCandles[visibleCandles.length - 1].ts + intervalMs;

        const visibleTrips = parsedTrips.filter(t => 
            (t.entryTs && t.entryTs >= firstVisibleTs && t.entryTs <= lastVisibleTs) ||
            (t.exitTs && t.exitTs >= firstVisibleTs && t.exitTs <= lastVisibleTs)
        );

        for (let i = 0; i < visibleTrips.length; i++) {
            const t = visibleTrips[i];
            if (t.entryTs && t.entryPrice) {
                const closest = findClosestInVisible(t.entryTs);
                if (closest && Math.abs(closest.ts - t.entryTs) <= intervalMs * 2 && !seenEntryCategories.has(closest.x)) {
                    seenEntryCategories.add(closest.x);
                    const candleLow = Array.isArray(closest.y) ? closest.y[2] : Number(t.entryPrice);
                    points.push({
                        x: closest.x,
                        y: candleLow,
                        marker: { size: 0 },
                        image: {
                            path: BUY_ARROW_SVG,
                            width: 11,
                            height: 15,
                            offsetX: 0,
                            offsetY: 18
                        }
                    });
                }
            }

            if (t.exitTs && t.exitPrice) {
                const closest = findClosestInVisible(t.exitTs);
                if (closest && Math.abs(closest.ts - t.exitTs) <= intervalMs * 2 && !seenExitCategories.has(closest.x)) {
                    seenExitCategories.add(closest.x);
                    const candleHigh = Array.isArray(closest.y) ? closest.y[1] : Number(t.exitPrice);
                    points.push({
                        x: closest.x,
                        y: candleHigh,
                        marker: { size: 0 },
                        image: {
                            path: SELL_ARROW_SVG,
                            width: 11,
                            height: 15,
                            offsetX: 0,
                            offsetY: -18
                        }
                    });
                }
            }
        }

        return { points, xaxis };
    }, [parsedTrips, visibleCandles, intervalMs, findClosestInVisible]);

    const chartOptions = useMemo(() => ({
        chart: {
            type: 'candlestick',
            height: 380,
            background: 'transparent',
            autoScaleYaxis: true,
            zoom: {
                enabled: false // Managed custom range for high responsiveness & precision
            },
            toolbar: {
                show: false
            },
            animations: {
                enabled: false
            }
        },
        legend: {
            show: false
        },
        theme: {
            mode: isDark ? 'dark' : 'light'
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#10B981',
                    downward: '#EF4444'
                },
                wick: {
                    useFillColor: true
                }
            }
        },
        xaxis: {
            type: 'category',
            tickPlacement: 'on',
            tickAmount: 8,
            crosshairs: {
                show: true,
                width: 1,
                position: 'back',
                opacity: 0.85,
                stroke: {
                    color: isDark ? 'rgba(24, 201, 139, 0.45)' : 'rgba(0, 0, 0, 0.3)',
                    width: 1,
                    dashArray: 3
                }
            },
            labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                showDuplicates: false,
                style: {
                    colors: isDark ? '#94A3B8' : '#334155',
                    fontSize: '10px',
                    fontWeight: 600
                },
                formatter: (val, timestamp, opts) => {
                    if (!val) return '';
                    const total = visibleCandles.length;
                    if (total <= 12) return val;
                    const step = Math.max(1, Math.floor(total / 8));
                    const idx = opts?.i != null ? opts.i : -1;
                    if (idx >= 0 && idx % step !== 0 && idx !== total - 1) {
                        return '';
                    }
                    return val;
                }
            },
            axisBorder: {
                show: true,
                color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            crosshairs: {
                show: true,
                position: 'back',
                stroke: {
                    color: isDark ? 'rgba(24, 201, 139, 0.45)' : 'rgba(0, 0, 0, 0.3)',
                    width: 1,
                    dashArray: 3
                }
            },
            labels: {
                style: {
                    colors: isDark ? '#94A3B8' : '#334155',
                    fontSize: '10px',
                    fontWeight: 600
                },
                formatter: (val) => {
                    if (typeof val !== 'number' || isNaN(val)) return '';
                    return val >= 100 ? val.toFixed(2) : val.toFixed(5);
                }
            }
        },
        grid: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
            strokeDashArray: 3
        },
        annotations: annotations,
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            custom: function ({ seriesIndex, dataPointIndex, w }) {
                return renderCandleTooltip({
                    seriesIndex,
                    dataPointIndex,
                    w,
                    isDark,
                    visibleCandles,
                    parsedTrips,
                    intervalMs
                });
            }
        }
    }), [isDark, visibleCandles, annotations, parsedTrips, intervalMs]);

    const series = useMemo(() => [
        {
            name: `${symbol} Price`,
            data: visibleCandles
        }
    ], [symbol, visibleCandles]);

    // Compute Position Sizing Metrics dynamically
    const assumptions = results?.stats?.backtest_assumptions || {};
    const symUpper = (symbol || 'EURUSD').toUpperCase();
    const isGold = symUpper.includes('XAU');
    const isJpy = symUpper.includes('JPY');
    const baseCurr = symUpper.slice(0, 3) || (isGold ? 'XAU' : 'EUR');
    const quoteCurr = symUpper.length >= 6 ? symUpper.slice(3, 6) : 'USD';

    const lotUnits = Number(assumptions.contract_size || (isGold ? 100 : 100000));
    const positionUnits = Number(quantity) * lotUnits;
    const unitLabel = isGold ? 'oz' : baseCurr;

    const tpPts = Number(
        results?.stats?.target_points ??
        results?.exit_conditions?.target ??
        results?.stats?.backtest_assumptions?.tp_points ??
        results?.executed_payload?.exit_conditions?.target ??
        500
    );
    const slPts = Number(
        results?.stats?.stoploss_points ??
        results?.exit_conditions?.stoploss ??
        results?.stats?.backtest_assumptions?.sl_points ??
        results?.executed_payload?.exit_conditions?.stoploss ??
        250
    );
    const pipFactor = isJpy ? 100 : 10;
    const tpPips = (tpPts / pipFactor).toFixed(isGold ? 0 : 1).replace('.0', '');
    const slPips = (slPts / pipFactor).toFixed(isGold ? 0 : 1).replace('.0', '');

    const lastPrice = candleData && candleData.length > 0 ? candleData[candleData.length - 1].y[3] : (isGold ? 2300 : 1.08);
    const nominalValue = positionUnits * (isGold ? lastPrice : 1);
    const leverage = ((nominalValue) / (Number(capital) || 10000)).toFixed(2);

    return (
        <div className={styles.candlestickChartCard}>
            {/* Top Position Sizing Summary Banner */}
            <div className={styles.positionSizingRibbon}>
                <div className={styles.sizingTag}>
                    <span className={styles.sizingDot} />
                    <span>POSITION SIZING</span>
                </div>
                <div className={styles.sizingItem}>
                    <span className={styles.badgeSymbolSmall}>{symbol}</span>
                </div>
                <div className={styles.sizingItem}>
                    <strong>{quantity} Lots</strong> ({positionUnits.toLocaleString(undefined, { maximumFractionDigits: 2 })} {unitLabel})
                </div>
                <div className={styles.sizingDivider} />
                <div className={styles.sizingItem}>
                    1 Lot = {lotUnits.toLocaleString()} {unitLabel}
                </div>
                <div className={styles.sizingDivider} />
                <div className={styles.sizingItem}>
                    Lev: <strong style={{ color: '#10B981' }}>{leverage}x</strong>
                </div>
                <div className={styles.sizingDivider} />
                <div className={styles.sizingItem}>
                    TP: <strong style={{ color: '#10B981' }}>{tpPts} pts ({tpPips} pips)</strong>
                </div>
                <div className={styles.sizingDivider} />
                <div className={styles.sizingItem}>
                    SL: <strong style={{ color: '#EF4444' }}>{slPts} pts ({slPips} pips)</strong>
                </div>
                <div className={styles.sizingDivider} />
                <div className={styles.sizingItem}>
                    P&L: <strong>{quoteCurr}</strong>
                </div>
            </div>

            {/* Candlestick Chart Header */}
            <div className={styles.chartCardHeaderRow}>
                <div className={styles.chartTitleGroup}>
                    <div className={styles.liveIndicatorPulse} />
                    <h3>Market Data & Executions</h3>
                    <span className={styles.chartSubBadge}>Candlestick Chart with Entry/Exit Markers</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>

                    {/* Window presets */}
                    {candleData && candleData.length > 100 && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)', borderRadius: '6px', padding: '2px 4px' }}>
                            {['60', '150', 'all'].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setBarWindow(opt)}
                                    style={{
                                        background: 'transparent',
                                        color: isDark ? '#94A3B8' : '#64748B',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '2px 6px',
                                        fontSize: '10.5px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {opt === 'all' ? 'All' : `${opt}b`}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Interactive Zoom & Pan Controls */}
                    <div className={styles.chartZoomControls}>
                        <span className={styles.zoomLevelBadge} title="Visible Candlesticks">
                            {visibleCandles.length} bars
                        </span>
                        <button
                            type="button"
                            className={styles.chartZoomBtn}
                            onClick={handleZoomIn}
                            title="Zoom In (Scroll Up)"
                            aria-label="Zoom in"
                        >
                            +
                        </button>
                        <button
                            type="button"
                            className={styles.chartZoomBtn}
                            onClick={handleZoomOut}
                            title="Zoom Out (Scroll Down)"
                            aria-label="Zoom out"
                        >
                            &minus;
                        </button>
                        <button
                            type="button"
                            className={styles.chartZoomBtn}
                            onClick={handleResetZoom}
                            title="Reset Zoom View"
                            aria-label="Reset zoom"
                        >
                            &#x21BA;
                        </button>
                    </div>
                </div>
            </div>

            {/* ApexCharts Candlestick Stage with Crosshair & Drag-to-Pan */}
            <div 
                ref={canvasWrapRef}
                className={`${styles.candlestickCanvasWrap} ${isPanning ? styles.isPanning : ''}`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {!mounted || !candleData || candleData.length === 0 ? (
                    <ChartSkeletonLoader
                        type="candlestick"
                        symbol={symbol}
                        interval={interval}
                    />
                ) : (
                    <ReactApexChart
                        key={`${symbol}_${interval}_${theme}`}
                        options={chartOptions}
                        series={series}
                        type="candlestick"
                        height={360}
                    />
                )}
            </div>
        </div>
    );
}
