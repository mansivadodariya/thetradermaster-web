'use client';

import { useEffect, useRef } from 'react';
import { CandlestickSeries, LineSeries, AreaSeries, HistogramSeries } from 'lightweight-charts';
import { fetchChartCandlesOnce, subscribeLiveCandles, parseCandleTimestamp } from '@/lib/chartStore';
import { unifiedSocket } from '@/lib/unifiedSocket';
import { generateMockCandles, getSymbolPrecision, getDefaultSymbolBasePrice, getTimeframeInterval } from '../utils/indicatorCalculations';

export default function useChartDataLoader({
    chartRef,
    seriesRef,
    volumeSeriesRef,
    candlesDataRef,
    activeSymbolClean,
    currentTimeframe,
    chartType,
    currentChartTypeRef,
    bullishColor,
    bearishColor,
    livePrice,
    setLoading,
    setLatestCandle,
    updateIndicators
}) {
    const wsRef = useRef(null);
    const updateIndicatorsRef = useRef(updateIndicators);
    const lastIndicatorUpdateRef = useRef(0);

    useEffect(() => {
        updateIndicatorsRef.current = updateIndicators;
    }, [updateIndicators]);

    // Fallback real-time tick simulator if WS endpoint offline
    const startMockTickSimulator = (isMounted) => {
        const interval = setInterval(() => {
            if (!isMounted || !seriesRef.current) return;
            setLatestCandle((prev) => {
                if (!prev) return prev;
                const priceDelta = (Math.random() - 0.495) * (prev.close * 0.0008);
                const newClose = Number((prev.close + priceDelta).toFixed(2));
                const newHigh = Math.max(prev.high, newClose);
                const newLow = Math.min(prev.low, newClose);
                const newVol = Math.floor(Math.random() * 2000) + 500;
                const updated = {
                    ...prev,
                    high: newHigh,
                    low: newLow,
                    close: newClose,
                    value: newClose,
                };
                try {
                    seriesRef.current.update(updated);
                    if (volumeSeriesRef.current) {
                        volumeSeriesRef.current.update({
                            time: prev.time,
                            value: newVol,
                            color: newClose >= prev.open ? 'rgba(38, 166, 154, 0.7)' : 'rgba(239, 83, 80, 0.7)',
                        });
                    }
                } catch {}
                return updated;
            });
        }, 1000);
        return () => clearInterval(interval);
    };

    useEffect(() => {
        let isMounted = true;

        async function loadChartData() {
            setLoading(true);
            // Do NOT wipe past candles or call setData([]) so past chart remains rendered under backdrop blur!

            if (!chartRef.current) {
                await new Promise((r) => setTimeout(r, 60));
                if (!chartRef.current || !isMounted) {
                    if (isMounted) setLoading(false);
                    return;
                }
            }

            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }

            try {
                let rawCandles = [];
                try {
                    const json = await fetchChartCandlesOnce(activeSymbolClean, currentTimeframe);
                    rawCandles = json.candles || json.data || json || [];
                } catch (err) {
                    console.warn('REST candles fetch notice:', err.message);
                }

                if (!Array.isArray(rawCandles) || rawCandles.length === 0) {
                    const known = unifiedSocket?.getKnownPrice ? unifiedSocket.getKnownPrice(activeSymbolClean) : null;
                    const baseVal = (livePrice && !isNaN(livePrice) && Number(livePrice) > 0)
                        ? Number(livePrice)
                        : (known && !isNaN(known) && Number(known) > 0 ? Number(known) : getDefaultSymbolBasePrice(activeSymbolClean));
                    rawCandles = generateMockCandles(600, baseVal, currentTimeframe, activeSymbolClean);
                }

                const formattedCandles = rawCandles
                    .map((c) => {
                        const timeVal = parseCandleTimestamp(c.time || c.timestamp);
                        const openPrice = parseFloat(c.open);
                        const highPrice = parseFloat(c.high);
                        const lowPrice = parseFloat(c.low);
                        const closePrice = parseFloat(c.close);
                        const volumeVal = parseFloat(c.volume || c.tick_volume || c.vol || 0);

                        return {
                            time: timeVal,
                            open: openPrice,
                            high: highPrice,
                            low: lowPrice,
                            close: closePrice,
                            value: closePrice,
                            volume: volumeVal,
                            volumeColor: closePrice >= openPrice ? 'rgba(38, 166, 154, 0.7)' : 'rgba(239, 83, 80, 0.7)',
                        };
                    })
                    .filter((c) => !isNaN(c.time) && !isNaN(c.close) && c.close > 0);

                formattedCandles.sort((a, b) => a.time - b.time);
                candlesDataRef.current = formattedCandles;

                if (!isMounted || !chartRef.current) {
                    if (isMounted) setLoading(false);
                    return;
                }

                if (!volumeSeriesRef.current) {
                    const volumeSeries = chartRef.current.addSeries(HistogramSeries, {
                        priceFormat: { type: 'volume' },
                        priceScaleId: 'volume',
                    });
                    chartRef.current.priceScale('volume').applyOptions({
                        scaleMargins: {
                            top: 0.8,
                            bottom: 0,
                        },
                    });
                    volumeSeriesRef.current = volumeSeries;
                }

                if (!seriesRef.current || currentChartTypeRef.current !== chartType) {
                    if (seriesRef.current) {
                        try { chartRef.current.removeSeries(seriesRef.current); } catch {}
                    }
                    if (chartType === 'line') {
                        seriesRef.current = chartRef.current.addSeries(LineSeries, {
                            color: '#18C98B',
                            lineWidth: 2,
                            priceLineVisible: true,
                            lastValueVisible: true,
                        });
                    } else if (chartType === 'area') {
                        seriesRef.current = chartRef.current.addSeries(AreaSeries, {
                            topColor: 'rgba(24, 201, 139, 0.46)',
                            bottomColor: 'rgba(24, 201, 139, 0.0)',
                            lineColor: '#18C98B',
                            lineWidth: 2,
                            priceLineVisible: true,
                            lastValueVisible: true,
                        });
                    } else {
                        seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
                            upColor: bullishColor,
                            borderUpColor: bullishColor,
                            wickUpColor: bullishColor,
                            downColor: bearishColor,
                            borderDownColor: bearishColor,
                            wickDownColor: bearishColor,
                            priceLineVisible: true,
                            lastValueVisible: true,
                        });
                    }
                    currentChartTypeRef.current = chartType;
                }

                const { precision, minMove } = getSymbolPrecision(activeSymbolClean);
                seriesRef.current.applyOptions({
                    priceFormat: {
                        type: 'price',
                        precision: precision,
                        minMove: minMove,
                    },
                    priceLineVisible: true,
                    lastValueVisible: true,
                });

                // Anchor initial latest candle close only if a live prop is explicitly provided
                const initialLive = (livePrice && !isNaN(livePrice) && Number(livePrice) > 0)
                    ? Number(livePrice)
                    : null;

                if (initialLive && formattedCandles.length > 0) {
                    const lastIdx = formattedCandles.length - 1;
                    const c = formattedCandles[lastIdx];
                    const numLive = Number(Number(initialLive).toFixed(precision));
                    const ratio = numLive / c.close;
                    if (ratio <= 1.012 && ratio >= 0.988) {
                        formattedCandles[lastIdx] = {
                            ...c,
                            high: Math.max(c.high, numLive),
                            low: Math.min(c.low, numLive),
                            close: numLive,
                            value: numLive,
                            volumeColor: numLive >= c.open ? 'rgba(38, 166, 154, 0.7)' : 'rgba(239, 83, 80, 0.7)',
                        };
                    }
                }

                seriesRef.current.setData(formattedCandles);
                try {
                    chartRef.current.timeScale().fitContent();
                } catch {}
                if (isMounted) setLoading(false);

                if (volumeSeriesRef.current) {
                    try {
                        volumeSeriesRef.current.setData(
                            formattedCandles.map((c) => ({
                                time: c.time,
                                value: c.volume || Math.floor(Math.random() * 2500) + 400,
                                color: c.volumeColor,
                            }))
                        );
                    } catch (e) {
                        console.warn('Volume series non-critical notice:', e);
                    }
                }
                if (updateIndicators) {
                    try {
                        updateIndicators(formattedCandles);
                    } catch (e) {
                        console.warn('Indicator update non-critical notice:', e);
                    }
                }
                const last = formattedCandles[formattedCandles.length - 1];
                if (last) {
                    setLatestCandle(last);
                    unifiedSocket.setKnownPrice(activeSymbolClean, last.close);
                }
                try {
                    chartRef.current.timeScale().applyOptions({
                        barSpacing: 5.5,
                        rightOffset: 16,
                        rightBarStaysOnScroll: true,
                    });
                    chartRef.current.timeScale().scrollToRealtime();
                } catch (e) {}
            } catch (err) {
                console.error('Error rendering chart data:', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }

            let unsubscribeWS = null;
            let mockCleanup = null;
            try {
                unsubscribeWS = subscribeLiveCandles(activeSymbolClean, currentTimeframe, (bar) => {
                    if (!isMounted) return;
                    setLoading(false);
                    const timeVal = parseCandleTimestamp(bar.time || bar.timestamp);
                    const rawClose = bar.close !== undefined ? bar.close : (bar.price !== undefined ? bar.price : (bar.last !== undefined ? bar.last : bar.c));
                    const closePrice = parseFloat(rawClose);

                    const interval = (typeof getTimeframeInterval === 'function' ? getTimeframeInterval(currentTimeframe) : 60) || 60;
                    const bucketTime = Math.floor(timeVal / interval) * interval;

                    const openPrice = !isNaN(parseFloat(bar.open)) && parseFloat(bar.open) > 0 ? parseFloat(bar.open) : closePrice;
                    const highPrice = !isNaN(parseFloat(bar.high)) ? Math.max(openPrice, closePrice, parseFloat(bar.high)) : Math.max(openPrice, closePrice);
                    const lowPrice = !isNaN(parseFloat(bar.low)) ? Math.min(openPrice, closePrice, parseFloat(bar.low)) : Math.min(openPrice, closePrice);
                    const volumeVal = parseFloat(bar.volume || bar.tick_volume || bar.vol || 0);

                    let updatedBar = {
                        time: bucketTime,
                        open: openPrice,
                        high: highPrice,
                        low: lowPrice,
                        close: closePrice,
                        value: closePrice,
                    };

                    if (candlesDataRef.current && candlesDataRef.current.length > 0) {
                        const lastIndex = candlesDataRef.current.length - 1;
                        const lastCandle = candlesDataRef.current[lastIndex];

                        // Prevent cross-symbol price distortion or sudden giant spikes (> 1.2% single-tick gap)
                        const lastClose = lastCandle.close;
                        const ratio = closePrice / lastClose;
                        if (ratio > 1.012 || ratio < 0.988) {
                            return;
                        }

                        if (bucketTime <= lastCandle.time) {
                            // Updating current forming candle
                            updatedBar = {
                                time: lastCandle.time,
                                open: lastCandle.open,
                                high: Math.max(lastCandle.high, highPrice, closePrice),
                                low: Math.min(lastCandle.low, lowPrice, closePrice),
                                close: closePrice,
                                value: closePrice,
                            };
                            candlesDataRef.current[lastIndex] = updatedBar;
                        } else {
                            // New candle period started
                            updatedBar = {
                                time: bucketTime,
                                open: Math.abs(openPrice - lastCandle.close) < (lastCandle.close * 0.02) ? openPrice : lastCandle.close,
                                high: Math.max(openPrice, closePrice, highPrice),
                                low: Math.min(openPrice, closePrice, lowPrice),
                                close: closePrice,
                                value: closePrice,
                            };
                            candlesDataRef.current.push(updatedBar);
                        }
                    } else {
                        candlesDataRef.current = [updatedBar];
                    }

                    unifiedSocket.setKnownPrice(activeSymbolClean, closePrice);

                    try {
                        if (seriesRef.current) {
                            seriesRef.current.update(updatedBar);
                        }
                    } catch (err) {
                        console.warn('Series update warning:', err);
                    }

                    try {
                        if (volumeSeriesRef.current) {
                            volumeSeriesRef.current.update({
                                time: updatedBar.time,
                                value: volumeVal || Math.floor(Math.random() * 2000) + 500,
                                color: closePrice >= updatedBar.open ? 'rgba(38, 166, 154, 0.7)' : 'rgba(239, 83, 80, 0.7)',
                            });
                        }
                    } catch {}

                    setLatestCandle(updatedBar);
                });
            } catch {
                if (isMounted) setLoading(false);
                mockCleanup = startMockTickSimulator(isMounted);
            }

            return () => {
                if (unsubscribeWS) unsubscribeWS();
                if (mockCleanup) mockCleanup();
            };
        }

        loadChartData();

        return () => {
            isMounted = false;
        };
    }, [activeSymbolClean, currentTimeframe, chartType]);

    // Update forming candle and chart series in real-time on live price ticks
    useEffect(() => {
        if (!livePrice || isNaN(livePrice) || Number(livePrice) <= 0) return;
        if (!seriesRef.current || !candlesDataRef.current || candlesDataRef.current.length === 0) return;

        const { precision } = getSymbolPrecision(activeSymbolClean);
        const price = Number(Number(livePrice).toFixed(precision));
        if (isNaN(price) || price <= 0) return;

        const candles = candlesDataRef.current;
        const lastIdx = candles.length - 1;
        const lastCandle = candles[lastIdx];
        if (!lastCandle) return;

        // Prevent cross-symbol price distortion or sudden giant spikes (> 25% single-tick gap)
        const lastClose = lastCandle.close;
        const ratio = price / lastClose;
        if (ratio > 1.25 || ratio < 0.75) return;

        const interval = (typeof getTimeframeInterval === 'function' ? getTimeframeInterval(currentTimeframe) : 900) || 900;
        const nowSec = Math.floor(Date.now() / 1000);
        const bucketTime = Math.floor(nowSec / interval) * interval;

        let updatedBar;
        // If bucketTime has advanced into the immediate next timeframe period (within 2 intervals)
        if (bucketTime > lastCandle.time && (bucketTime - lastCandle.time) <= interval * 2) {
            const open = lastCandle.close;
            updatedBar = {
                time: bucketTime,
                open: open,
                high: Math.max(open, price),
                low: Math.min(open, price),
                close: price,
                value: price,
                volume: 500,
                volumeColor: price >= open ? 'rgba(38, 166, 154, 0.7)' : 'rgba(239, 83, 80, 0.7)',
            };
            candles.push(updatedBar);
        } else {
            // Update current forming candle in place
            const open = lastCandle.open;
            const high = Math.max(lastCandle.high, price);
            const low = Math.min(lastCandle.low, price);
            updatedBar = {
                ...lastCandle,
                time: lastCandle.time,
                open,
                high,
                low,
                close: price,
                value: price,
                volumeColor: price >= open ? 'rgba(38, 166, 154, 0.7)' : 'rgba(239, 83, 80, 0.7)',
            };
            candles[lastIdx] = updatedBar;
        }

        unifiedSocket.setKnownPrice(activeSymbolClean, price);

        try {
            seriesRef.current.update(updatedBar);
        } catch (err) {
            console.warn('Series livePrice update notice:', err);
        }

        if (volumeSeriesRef.current) {
            try {
                volumeSeriesRef.current.update({
                    time: updatedBar.time,
                    value: updatedBar.volume || 1000,
                    color: updatedBar.volumeColor,
                });
            } catch {}
        }

        setLatestCandle(updatedBar);

        if (updateIndicatorsRef.current) {
            const now = Date.now();
            if (now - lastIndicatorUpdateRef.current > 1500) {
                lastIndicatorUpdateRef.current = now;
                try {
                    updateIndicatorsRef.current(candles);
                } catch {}
            }
        }
    }, [livePrice, activeSymbolClean, currentTimeframe]);
}
