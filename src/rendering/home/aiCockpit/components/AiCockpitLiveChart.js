'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import styles from '../aiCockpit.module.scss';
import { fetchGoldCandles } from '../utils/goldCandles';
import { unifiedSocket, cleanPairSymbol } from '@/lib/unifiedSocket';
import { parseCandleTimestamp } from '@/lib/chartStore';

const SYMBOL = 'XAUUSD';
const TIMEFRAME = 'H1';

export default function AiCockpitLiveChart({ livePrice = 4308.18, isPositiveChange = true }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const [candlesData, setCandlesData] = useState([]);
  const [activeCandle, setActiveCandle] = useState(null);
  const livePriceRef = useRef(livePrice);
  const candlesDataRef = useRef([]);
  const dataLoadedRef = useRef(false);

  // Keep refs in sync to avoid stale closures
  useEffect(() => {
    livePriceRef.current = livePrice;
  }, [livePrice]);

  useEffect(() => {
    candlesDataRef.current = candlesData;
  }, [candlesData]);

  // Initialize and render the TradingView Lightweight Chart
  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous chart instance if present
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 420;

    // Create institutional dark-themed Lightweight Chart
    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#64748B',
        fontSize: 11,
        fontFamily: "'Euclid-Medium', monospace, sans-serif",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)', style: 2 },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)', style: 2 },
      },
      crosshair: {
        vertLine: {
          color: 'rgba(24, 201, 139, 0.65)',
          width: 1,
          style: 3,
          labelBackgroundColor: '#18C98B',
        },
        horzLine: {
          color: 'rgba(24, 201, 139, 0.65)',
          width: 1,
          style: 3,
          labelBackgroundColor: '#18C98B',
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
        axisDoubleClickReset: true,
        mouseWheel: true,
        pinch: true,
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 10,
        rightOffset: 8,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        scaleMargins: { top: 0.08, bottom: 0.22 },
        alignLabels: true,
      },
    });

    // Candlestick Series (ChronosX Emerald / Rose Palette)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#F43F5E',
      borderUpColor: '#10B981',
      borderDownColor: '#F43F5E',
      wickUpColor: '#10B981',
      wickDownColor: '#F43F5E',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    // Volume Histogram Series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Crosshair move handler for live OHLC HUD
    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData && param.seriesData.has(candleSeries)) {
        const data = param.seriesData.get(candleSeries);
        setActiveCandle(data);
      } else {
        setActiveCandle(null);
      }
    });

    // Auto-resizing with ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0 || !chartRef.current) return;
      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;
      if (newWidth > 0 && newHeight > 0) {
        chartRef.current.applyOptions({ width: newWidth, height: newHeight });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  // Helper: normalize a timestamp to seconds
  const normalizeTime = useCallback((rawTime) => {
    return parseCandleTimestamp(rawTime);
  }, []);

  // Helper: apply candle + volume data to the chart series
  const applyDataToChart = useCallback((data) => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !data.length) return;

    const formattedCandles = data.map((c) => ({
      time: normalizeTime(c.time),
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const formattedVolumes = data.map((c) => ({
      time: normalizeTime(c.time),
      value: c.volume || 1000,
      color: c.close >= c.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)',
    }));

    candleSeriesRef.current.setData(formattedCandles);
    volumeSeriesRef.current.setData(formattedVolumes);
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [normalizeTime]);

  // Fetch and populate initial candles — use live price as base for fallback
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // Use the current live price (from socket/prop) as fallback base
      // so generated candles match the actual market price range
      const basePrice = livePriceRef.current && livePriceRef.current > 0
        ? livePriceRef.current
        : 4308.18;

      const data = await fetchGoldCandles(60, basePrice);
      if (!isMounted) return;

      setCandlesData(data);
      dataLoadedRef.current = true;
      applyDataToChart(data);

      // Seed the socket's known price with the last candle close
      // so fallback/continuous stream uses real price when backend sends no messages
      const lastCandle = data[data.length - 1];
      if (lastCandle && lastCandle.close > 0) {
        unifiedSocket.setKnownPrice(SYMBOL, lastCandle.close);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Subscribe to WebSocket candle_update events for real-time forming candle
  useEffect(() => {
    const unsubscribe = unifiedSocket.subscribeCandles(
      (candleData, fullPayload) => {
        if (!candleData || !candleSeriesRef.current) return;

        const time = normalizeTime(
          candleData.time || candleData.t || fullPayload?.timestamp
        );
        const open = parseFloat(candleData.open || candleData.o);
        const high = parseFloat(candleData.high || candleData.h);
        const low = parseFloat(candleData.low || candleData.l);
        const close = parseFloat(candleData.close || candleData.c);
        const volume = parseFloat(candleData.volume || candleData.v || candleData.tick_volume || 0);

        if (isNaN(open) || isNaN(close) || isNaN(time)) return;

        const updatedCandle = {
          time,
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
          close: Number(close.toFixed(2)),
        };

        try {
          candleSeriesRef.current.update(updatedCandle);
        } catch (_) {}

        if (volumeSeriesRef.current && !isNaN(volume)) {
          try {
            volumeSeriesRef.current.update({
              time,
              value: volume || 1000,
              color: close >= open
                ? 'rgba(16, 185, 129, 0.35)'
                : 'rgba(244, 63, 94, 0.35)',
            });
          } catch (_) {}
        }

        // Update local candles state: append or update last candle
        setCandlesData((prev) => {
          const newData = [...prev];
          const lastIdx = newData.length - 1;
          const newCandle = {
            time,
            open: updatedCandle.open,
            high: updatedCandle.high,
            low: updatedCandle.low,
            close: updatedCandle.close,
            volume: volume || 1000,
            isBullish: updatedCandle.close >= updatedCandle.open,
          };

          if (lastIdx >= 0 && normalizeTime(newData[lastIdx].time) === time) {
            // Update existing candle
            newData[lastIdx] = newCandle;
          } else {
            // New candle period
            newData.push(newCandle);
          }
          return newData;
        });
      },
      SYMBOL,
      TIMEFRAME
    );

    return () => {
      unsubscribe();
    };
  }, [normalizeTime]);

  // Update latest forming candle on live price ticks (from prop)
  useEffect(() => {
    if (!livePrice || !candleSeriesRef.current || candlesData.length === 0) return;

    const lastCandle = candlesData[candlesData.length - 1];
    if (!lastCandle) return;

    const formattedTime = normalizeTime(lastCandle.time);
    const price = parseFloat(livePrice);
    if (isNaN(price) || price <= 0) return;

    // Sanity check: discard anomalous spikes / cross-symbol price mismatches (> 1.2% gap)
    const deviation = Math.abs(price - lastCandle.close) / (lastCandle.close || 1);
    if (deviation > 0.012) return;

    const updatedCandle = {
      time: formattedTime,
      open: lastCandle.open,
      high: Math.max(lastCandle.high, price),
      low: Math.min(lastCandle.low, price),
      close: price,
    };

    try {
      candleSeriesRef.current.update(updatedCandle);
    } catch (_) {}
  }, [livePrice, candlesData, normalizeTime]);

  // Display Candle Info for HUD
  const displayCandle = activeCandle || (candlesData.length > 0 ? candlesData[candlesData.length - 1] : null);

  return (
    <div className={styles.lightweightChartWrapper}>
      {/* Top Floating Live Candle HUD */}
      {displayCandle && (
        <div className={styles.chartOhlcHud}>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>O</span>
            <span className={styles.hudVal}>{displayCandle.open?.toFixed(2)}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>H</span>
            <span className={styles.hudVal}>{displayCandle.high?.toFixed(2)}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>L</span>
            <span className={styles.hudVal}>{displayCandle.low?.toFixed(2)}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>C</span>
            <span className={`${styles.hudVal} ${(displayCandle.close >= displayCandle.open) ? styles.bullish : styles.bearish}`}>
              {displayCandle.close?.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Lightweight Charts Canvas Mount */}
      <div ref={containerRef} className={styles.chartCanvasMount} />
    </div>
  );
}
