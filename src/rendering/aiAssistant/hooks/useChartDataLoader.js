'use client';

import { useEffect, useRef, useState } from 'react';
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
    const lastWsCandleTimeRef = useRef(0);
    const serverTimeOffsetRef = useRef(0);

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
        let unsubscribeWS = null;
        let mockCleanup = null;
        let syncInterval = null;
        let secondTimer = null;

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

                // Anchor initial latest candle close only if it is within a tight micro-pip range (never distort historical bars)
                const initialLive = (livePrice && !isNaN(livePrice) && Number(livePrice) > 0)
                    ? Number(livePrice)
                    : null;

                if (initialLive && formattedCandles.length > 0) {
                    const lastIdx = formattedCandles.length - 1;
                    const c = formattedCandles[lastIdx];
                    const numLive = Number(Number(initialLive).toFixed(precision));
                    const isGold = activeSymbolClean.includes('XAU') || activeSymbolClean.includes('GOLD');
                    const maxSyncDiff = isGold ? 0.60 : c.close * 0.001;
                    if (Math.abs(numLive - c.close) <= maxSyncDiff) {
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
                    const interval = (typeof getTimeframeInterval === 'function' ? getTimeframeInterval(currentTimeframe) : 60) || 60;
                    const nowSec = Math.floor(Date.now() / 1000);
                    serverTimeOffsetRef.current = last.time - Math.floor(nowSec / interval) * interval;
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

            try {
                unsubscribeWS = subscribeLiveCandles(activeSymbolClean, currentTimeframe, (bar) => {
                    if (!isMounted || !bar) return;
                    setLoading(false);
                    lastWsCandleTimeRef.current = Date.now();

                    const rawClose = bar.close !== undefined ? bar.close : (bar.price !== undefined ? bar.price : (bar.last !== undefined ? bar.last : bar.c));
                    const closePrice = parseFloat(rawClose);
                    if (isNaN(closePrice) || closePrice <= 0) return;

                    const timeVal = parseCandleTimestamp(bar.time || bar.timestamp);
                    if (isNaN(timeVal) || timeVal <= 0) return;

                    const interval = (typeof getTimeframeInterval === 'function' ? getTimeframeInterval(currentTimeframe) : 900) || 900;
                    const bucketTime = Math.floor(timeVal / interval) * interval;

                    const rawOpen = parseFloat(bar.open);
                    const openPrice = (!isNaN(rawOpen) && rawOpen > 0) ? rawOpen : closePrice;

                    const rawHigh = parseFloat(bar.high);
                    const highPrice = (!isNaN(rawHigh) && rawHigh > 0) ? Math.max(openPrice, closePrice, rawHigh) : Math.max(openPrice, closePrice);

                    const rawLow = parseFloat(bar.low);
                    const lowPrice = (!isNaN(rawLow) && rawLow > 0) ? Math.min(openPrice, closePrice, rawLow) : Math.min(openPrice, closePrice);

                    const volumeVal = parseFloat(bar.volume || bar.tick_volume || bar.vol || 0);

                    let updatedBar;

                    if (candlesDataRef.current && candlesDataRef.current.length > 0) {
                        const lastIndex = candlesDataRef.current.length - 1;
                        const lastCandle = candlesDataRef.current[lastIndex];

                        // A new candle period is ONLY started if timeVal has truly elapsed past the current candle interval
                        const isNewPeriod = timeVal >= (lastCandle.time + interval);

                        if (!isNewPeriod) {
                            // Updating current forming candle in place
                            const validHigh = Math.max(lastCandle.high || 0, highPrice, closePrice);
                            const rawValidLow = Math.min(lastCandle.low || openPrice, lowPrice, closePrice);
                            const validLow = rawValidLow > 0 ? rawValidLow : Math.min(lastCandle.open, closePrice);
                            updatedBar = {
                                time: lastCandle.time,
                                open: lastCandle.open,
                                high: validHigh,
                                low: validLow,
                                close: closePrice,
                                value: closePrice,
                            };
                            candlesDataRef.current[lastIndex] = updatedBar;
                        } else {
                            // Timeframe elapsed: start immediate next candle period strictly aligned to timeframe
                            const newCandleTime = lastCandle.time + interval;
                            const validOpen = openPrice > 0 ? openPrice : closePrice;
                            const validHigh = Math.max(validOpen, closePrice, highPrice);
                            const rawValidLow = Math.min(validOpen, closePrice, lowPrice);
                            const validLow = rawValidLow > 0 ? rawValidLow : Math.min(validOpen, closePrice);
                            updatedBar = {
                                time: newCandleTime,
                                open: validOpen,
                                high: validHigh,
                                low: validLow,
                                close: closePrice,
                                value: closePrice,
                            };
                            candlesDataRef.current.push(updatedBar);
                        }
                    } else {
                        updatedBar = {
                            time: bucketTime,
                            open: openPrice,
                            high: highPrice,
                            low: lowPrice,
                            close: closePrice,
                            value: closePrice,
                        };
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

            // TradingView Continuous Background Candle Sync:
            // Syncs newest authoritative MT5 bars every 3 seconds so the chart never deviates from reload state
            let isSyncing = false;
            syncInterval = setInterval(async () => {
                if (!isMounted || isSyncing || !chartRef.current || !seriesRef.current) return;
                if (typeof document !== 'undefined' && document.hidden) return;

                isSyncing = true;
                try {
                    const json = await fetchChartCandlesOnce(activeSymbolClean, currentTimeframe);
                    const serverCandles = json?.candles || json?.data || json || [];
                    if (!Array.isArray(serverCandles) || serverCandles.length === 0 || !isMounted) {
                        return;
                    }

                    const currentCandles = candlesDataRef.current;
                    if (!currentCandles || currentCandles.length === 0) return;

                    const formattedServer = serverCandles
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
                        .filter((c) => !isNaN(c.time) && !isNaN(c.close) && c.close > 0)
                        .sort((a, b) => a.time - b.time);

                    if (formattedServer.length === 0) return;

                    const lastLocal = currentCandles[currentCandles.length - 1];
                    const lastServer = formattedServer[formattedServer.length - 1];
                    const interval = (typeof getTimeframeInterval === 'function' ? getTimeframeInterval(currentTimeframe) : 60) || 60;

                    // Incrementally update or append the latest 5 bars
                    let candlesChanged = false;
                    for (const serverBar of formattedServer.slice(-5)) {
                        const existingIdx = currentCandles.findIndex((c) => c.time === serverBar.time);
                        if (existingIdx !== -1) {
                            const existing = currentCandles[existingIdx];
                            const safeHigh = Math.max(existing.high || 0, serverBar.high || 0);
                            const safeLow = (existing.low > 0 && serverBar.low > 0) ? Math.min(existing.low, serverBar.low) : (serverBar.low || existing.low || serverBar.open);
                            const updated = {
                                ...serverBar,
                                high: safeHigh,
                                low: safeLow,
                            };
                            currentCandles[existingIdx] = updated;
                            seriesRef.current.update(updated);
                            candlesChanged = true;
                        } else if (serverBar.time > currentCandles[currentCandles.length - 1].time) {
                            currentCandles.push(serverBar);
                            seriesRef.current.update(serverBar);
                            candlesChanged = true;
                        }
                    }

                    if (candlesChanged) {
                        const updatedLast = currentCandles[currentCandles.length - 1];
                        setLatestCandle(updatedLast);
                        if (updateIndicatorsRef.current) {
                            try { updateIndicatorsRef.current(currentCandles); } catch (_) {}
                        }
                    }
                } catch (e) {
                    console.warn('[ChartDataLoader] Sync notice:', e);
                } finally {
                    isSyncing = false;
                }
            }, 3000);

            // Second-level rollover check: If time crosses :00 boundary even before the next tick arrives,
            // immediately open the new candle bar with the last known price
            secondTimer = setInterval(() => {
                if (!isMounted || !seriesRef.current || !candlesDataRef.current || candlesDataRef.current.length === 0) return;
                const candles = candlesDataRef.current;
                const lastCandle = candles[candles.length - 1];
                if (!lastCandle) return;

                const interval = (typeof getTimeframeInterval === 'function' ? getTimeframeInterval(currentTimeframe) : 60) || 60;
                const nowSec = Math.floor(Date.now() / 1000);
                const expectedBucket = Math.floor((nowSec + serverTimeOffsetRef.current) / interval) * interval;

                if (expectedBucket > lastCandle.time) {
                    const price = lastCandle.close;
                    const newBar = {
                        time: expectedBucket,
                        open: price,
                        high: price,
                        low: price,
                        close: price,
                        value: price,
                        volume: 10,
                        volumeColor: 'rgba(38, 166, 154, 0.7)',
                    };
                    candles.push(newBar);
                    try {
                        seriesRef.current.update(newBar);
                        if (volumeSeriesRef.current) {
                            volumeSeriesRef.current.update({
                                time: newBar.time,
                                value: 10,
                                color: newBar.volumeColor,
                            });
                        }
                    } catch (_) {}
                    setLatestCandle(newBar);
                }
            }, 1000);
        }

        loadChartData();

        return () => {
            isMounted = false;
            if (syncInterval) clearInterval(syncInterval);
            if (secondTimer) clearInterval(secondTimer);
            if (unsubscribeWS) unsubscribeWS();
            if (mockCleanup) mockCleanup();
        };
    }, [activeSymbolClean, currentTimeframe, chartType]);

    // Update forming candle and chart series in real-time on live price ticks
    useEffect(() => {
        if (!livePrice || isNaN(livePrice) || Number(livePrice) <= 0) return;
        if (!seriesRef.current || !candlesDataRef.current || candlesDataRef.current.length === 0) return;

        // If WebSocket candle_update was received recently (< 2000ms), let the direct candle stream manage forming bars
        const nowMs = Date.now();
        if (nowMs - lastWsCandleTimeRef.current < 2000) return;

        const { precision } = getSymbolPrecision(activeSymbolClean);
        const price = Number(Number(livePrice).toFixed(precision));
        if (isNaN(price) || price <= 0) return;

        const candles = candlesDataRef.current;
        const lastIdx = candles.length - 1;
        const lastCandle = candles[lastIdx];
        if (!lastCandle) return;

        const interval = (typeof getTimeframeInterval === 'function' ? getTimeframeInterval(currentTimeframe) : 60) || 60;
        const nowSec = Math.floor(Date.now() / 1000);
        const expectedBucket = Math.floor((nowSec + serverTimeOffsetRef.current) / interval) * interval;

        let updatedBar;
        if (expectedBucket > lastCandle.time) {
            // Real-time rollover at :00: Start new candle cleanly aligned to MT5 timeframe bucket!
            const open = lastCandle.close || price;
            const high = Math.max(open, price);
            const rawLow = Math.min(open, price);
            const low = rawLow > 0 ? rawLow : Math.min(open, price);
            updatedBar = {
                time: expectedBucket,
                open,
                high,
                low,
                close: price,
                value: price,
                volume: 50,
                volumeColor: price >= open ? 'rgba(38, 166, 154, 0.7)' : 'rgba(239, 83, 80, 0.7)',
            };
            candles.push(updatedBar);
        } else {
            // Update current forming candle in place
            const open = lastCandle.open;
            const high = Math.max(lastCandle.high, price);
            const rawLow = Math.min(lastCandle.low, price);
            const low = rawLow > 0 ? rawLow : Math.min(open, price);
            updatedBar = {
                ...lastCandle,
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
