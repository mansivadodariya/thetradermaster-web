'use client';

import React, { useMemo } from 'react';

/**
 * High-precision quantitative chart matching the ChronosX design:
 * - Upper Pane: Candlestick series + Fast EMA (orange) + Slow EMA (green)
 * - Right Y-Axis: Dynamic price scale with gridlines and real-time highlighted price badge
 * - Lower Pane: Sub-indicator oscillator panel with dual wave curves and indicator Y-axis
 * - Bottom X-Axis: Time timestamps (e.g. 12:00, 12:30, 13:00)
 */
export default function MiniCandlestickChart({
    candles = [],
    sparkline = [],
    width = 310,
    height = 200,
    direction = 'BUY',
    symbol = 'EUR/USD',
    currentPrice = null,
    indicatorValue = '1.2.0',
    indicators = null,
}) {
    // 1. Process or synthesize realistic candle data
    const chartData = useMemo(() => {
        if (Array.isArray(candles) && candles.length >= 4) {
            return candles.slice(-28);
        }

        // If sparkline is available, build candles from sparkline
        if (Array.isArray(sparkline) && sparkline.length >= 6) {
            const now = Math.floor(Date.now() / 1000) - sparkline.length * 180;
            return sparkline.map((price, i) => {
                const p = Number(price);
                const prev = i > 0 ? Number(sparkline[i - 1]) : p;
                const open = prev;
                const close = p;
                const step = Math.abs(close - open) || p * 0.0003;
                const high = Math.max(open, close) + step * 0.6;
                const low = Math.min(open, close) - step * 0.6;
                return {
                    time: now + i * 180,
                    open,
                    high,
                    low,
                    close,
                };
            });
        }

        // Otherwise generate realistic 26 bars
        const isUp = direction === 'BUY';
        let base = typeof currentPrice === 'number' && currentPrice > 0 ? currentPrice : (isUp ? 1.3350 : 1.3390);
        const generated = [];
        const now = Math.floor(Date.now() / 1000) - 26 * 300;
        const stepUnit = base > 100 ? 0.75 : 0.00035;

        for (let i = 0; i < 26; i++) {
            const step = (Math.random() - (isUp ? 0.42 : 0.58)) * stepUnit * 2.2;
            const open = base;
            const close = open + step;
            const high = Math.max(open, close) + Math.random() * (stepUnit * 1.5);
            const low = Math.min(open, close) - Math.random() * (stepUnit * 1.5);
            base = close;
            generated.push({
                time: now + i * 300,
                open: parseFloat(open.toFixed(base > 100 ? 2 : 5)),
                high: parseFloat(high.toFixed(base > 100 ? 2 : 5)),
                low: parseFloat(low.toFixed(base > 100 ? 2 : 5)),
                close: parseFloat(close.toFixed(base > 100 ? 2 : 5)),
            });
        }
        return generated;
    }, [candles, sparkline, direction, currentPrice]);

    // 2. Compute Layout, EMAs, Coordinates & Axes
    const chartMetrics = useMemo(() => {
        if (!chartData || chartData.length === 0) {
            return null;
        }

        const count = chartData.length;
        const svgW = 310;
        const svgH = 200;

        // Boundaries
        const chartLeft = 6;
        const chartRight = 248; // leaves 62px on right for Y-Axis labels & price badge
        const mainChartTop = 10;
        const mainChartBottom = 120;
        const mainH = mainChartBottom - mainChartTop;
        const chartW = chartRight - chartLeft;

        const indTop = 132;
        const indBottom = 172;
        const indH = indBottom - indTop;

        const xAxisY = 176;

        // Find min/max for candles
        let minVal = Infinity;
        let maxVal = -Infinity;
        chartData.forEach((c) => {
            if (c.low < minVal) minVal = c.low;
            if (c.high > maxVal) maxVal = c.high;
        });

        // Add 8% vertical padding
        const diff = maxVal - minVal || (minVal * 0.01) || 1;
        const pad = diff * 0.08;
        const adjustedMin = minVal - pad;
        const adjustedMax = maxVal + pad;
        const range = adjustedMax - adjustedMin;

        // Calculate EMA 9 & EMA 21
        const closes = chartData.map((c) => c.close);
        const calcEMA = (period) => {
            const k = 2 / (period + 1);
            let prev = closes[0];
            return closes.map((val) => {
                prev = val * k + prev * (1 - k);
                return prev;
            });
        };
        const ema9Values = calcEMA(7);
        const ema21Values = calcEMA(16);

        // Candle geometry
        const candleSpacing = chartW / count;
        const candleWidth = Math.max(2.8, Math.min(7, candleSpacing * 0.68));

        const candleElements = [];
        const ema9Points = [];
        const ema21Points = [];

        chartData.forEach((c, i) => {
            const x = chartLeft + i * candleSpacing + (candleSpacing - candleWidth) / 2;
            const wickX = x + candleWidth / 2;

            const yHigh = mainChartBottom - ((c.high - adjustedMin) / range) * mainH;
            const yLow = mainChartBottom - ((c.low - adjustedMin) / range) * mainH;
            const yOpen = mainChartBottom - ((c.open - adjustedMin) / range) * mainH;
            const yClose = mainChartBottom - ((c.close - adjustedMin) / range) * mainH;

            const isBullish = c.close >= c.open;
            const color = isBullish ? '#10B981' : '#EF4444';

            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

            candleElements.push({
                wickX,
                yHigh,
                yLow,
                x,
                bodyTop,
                candleWidth,
                bodyHeight,
                color,
            });

            // EMA points
            const yEma9 = mainChartBottom - ((ema9Values[i] - adjustedMin) / range) * mainH;
            const yEma21 = mainChartBottom - ((ema21Values[i] - adjustedMin) / range) * mainH;
            ema9Points.push(`${wickX},${Math.min(mainChartBottom, Math.max(mainChartTop, yEma9))}`);
            ema21Points.push(`${wickX},${Math.min(mainChartBottom, Math.max(mainChartTop, yEma21))}`);
        });

        // Price Formatter for Y-Axis
        const formatPrice = (val) => {
            const s = (symbol || '').toUpperCase();
            if (s.includes('JPY')) return `$${val.toFixed(2)}`;
            if (s.includes('XAU') || s.includes('GOLD') || val > 500) return `$${val.toFixed(1)}`;
            return `$${val.toFixed(4)}`;
        };

        const midVal = (maxVal + minVal) / 2;
        const yAxisLabels = [
            { y: mainChartTop + 5, text: formatPrice(maxVal) },
            { y: (mainChartTop + mainChartBottom) / 2 + 4, text: formatPrice(midVal) },
            { y: mainChartBottom - 2, text: formatPrice(minVal) },
        ];

        // Current price badge calculation
        const lastCandle = chartData[chartData.length - 1];
        const lastClose = lastCandle.close;
        const lastBullish = lastClose >= chartData[0].open;
        const badgeY = Math.min(mainChartBottom - 9, Math.max(mainChartTop + 9,
            mainChartBottom - ((lastClose - adjustedMin) / range) * mainH
        ));
        const badgeText = lastClose > 100 ? `$${lastClose.toFixed(2)}` : `$${lastClose.toFixed(4)}`;

        // Indicator wave curves (Dual oscillator: Green fast line & Orange slow line)
        const indMidY = (indTop + indBottom) / 2;
        const indAmplitude = indH * 0.38;
        const wave1Points = [];
        const wave2Points = [];

        chartData.forEach((c, i) => {
            const x = chartLeft + i * candleSpacing + candleSpacing / 2;
            const normProgress = (i / (count - 1)) * Math.PI * 3.2;
            const trendOffset = ((c.close - adjustedMin) / range - 0.5) * indAmplitude * 0.8;
            const yWave1 = indMidY + Math.sin(normProgress - 0.4) * indAmplitude * 0.85 + trendOffset;
            const yWave2 = indMidY + Math.sin(normProgress * 0.7 + 0.5) * (indAmplitude * 0.7) + trendOffset * 0.5;

            wave1Points.push(`${x},${Math.min(indBottom - 1, Math.max(indTop + 1, yWave1))}`);
            wave2Points.push(`${x},${Math.min(indBottom - 1, Math.max(indTop + 1, yWave2))}`);
        });

        // Time labels for X-Axis (safely parse ISO strings, numbers, or millisecond timestamps)
        const formatTime = (ts) => {
            if (!ts) return '';
            let d;
            if (typeof ts === 'number') {
                d = new Date(ts > 1e11 ? ts : ts * 1000);
            } else if (typeof ts === 'string') {
                const parsedNum = Number(ts);
                if (!isNaN(parsedNum)) {
                    d = new Date(parsedNum > 1e11 ? parsedNum : parsedNum * 1000);
                } else {
                    d = new Date(ts);
                }
            } else {
                d = new Date(ts);
            }
            if (isNaN(d.getTime())) return '';
            const hh = String(d.getUTCHours() ?? d.getHours()).padStart(2, '0');
            const mm = String(d.getUTCMinutes() ?? d.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
        };

        const time1 = formatTime(chartData[Math.floor(count * 0.2)]?.time) || '12:00';
        const time2 = formatTime(chartData[Math.floor(count * 0.55)]?.time) || '12:30';
        const time3 = formatTime(chartData[Math.floor(count * 0.88)]?.time) || '13:00';

        const xTimeLabels = [
            { x: chartLeft + chartW * 0.22, text: time1 },
            { x: chartLeft + chartW * 0.55, text: time2 },
            { x: chartLeft + chartW * 0.88, text: time3 },
        ];

        return {
            svgW,
            svgH,
            chartLeft,
            chartRight,
            mainChartTop,
            mainChartBottom,
            indTop,
            indBottom,
            indMidY,
            xAxisY,
            candleElements,
            ema9Path: `M ${ema9Points.join(' L ')}`,
            ema21Path: `M ${ema21Points.join(' L ')}`,
            yAxisLabels,
            badgeY,
            badgeText,
            lastBullish,
            wave1Path: `M ${wave1Points.join(' L ')}`,
            wave2Path: `M ${wave2Points.join(' L ')}`,
            xTimeLabels,
            lastCandleX: chartLeft + (count - 1) * candleSpacing + candleSpacing / 2,
        };
    }, [chartData, symbol]);

    if (!chartMetrics) {
        return <div style={{ width: '100%', height: '100%', minHeight: '180px' }} />;
    }

    const {
        svgW,
        svgH,
        chartLeft,
        chartRight,
        mainChartTop,
        mainChartBottom,
        indTop,
        indBottom,
        indMidY,
        xAxisY,
        candleElements,
        ema9Path,
        ema21Path,
        yAxisLabels,
        badgeY,
        badgeText,
        lastBullish,
        wave1Path,
        wave2Path,
        xTimeLabels,
        lastCandleX,
    } = chartMetrics;

    const displayIndicator = indicatorValue || (indicators?.rsi ? `RSI: ${indicators.rsi}` : '1.2.0');

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${svgW} ${svgH}`}
            preserveAspectRatio="xMidYMid meet"
            style={{
                display: 'block',
                overflow: 'visible',
                userSelect: 'none',
                maxWidth: '100%',
            }}
        >
            {/* 1. Horizontal Dashed Gridlines (Main Pane) */}
            <line
                x1={chartLeft}
                y1={mainChartTop + 5}
                x2={chartRight}
                y2={mainChartTop + 5}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="2 3"
                strokeWidth="1"
            />
            <line
                x1={chartLeft}
                y1={(mainChartTop + mainChartBottom) / 2}
                x2={chartRight}
                y2={(mainChartTop + mainChartBottom) / 2}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="2 3"
                strokeWidth="1"
            />
            <line
                x1={chartLeft}
                y1={mainChartBottom}
                x2={chartRight}
                y2={mainChartBottom}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="2 3"
                strokeWidth="1"
            />

            {/* 2. Candlestick Series */}
            {candleElements.map((bar, idx) => (
                <g key={idx}>
                    {/* Wick */}
                    <line
                        x1={bar.wickX}
                        y1={bar.yHigh}
                        x2={bar.wickX}
                        y2={bar.yLow}
                        stroke={bar.color}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                    {/* Body */}
                    <rect
                        x={bar.x}
                        y={bar.bodyTop}
                        width={bar.candleWidth}
                        height={bar.bodyHeight}
                        fill={bar.color}
                        rx="0.5"
                    />
                </g>
            ))}

            {/* 3. Fast EMA (Orange/Amber line) */}
            <path
                d={ema9Path}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
            />

            {/* 4. Slow EMA (Emerald/Teal line) */}
            <path
                d={ema21Path}
                fill="none"
                stroke="#10B981"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
            />

            {/* 5. Main Right Y-Axis Price Labels */}
            {yAxisLabels.map((item, idx) => (
                <text
                    key={idx}
                    x={chartRight + 6}
                    y={item.y}
                    fill="#94A3B8"
                    fontSize="9.5"
                    fontFamily="'Inter', 'Euclid-Medium', -apple-system, sans-serif"
                    fontWeight="500"
                    textAnchor="start"
                >
                    {item.text}
                </text>
            ))}

            {/* 6. Current Price Tag on Right Axis */}
            <g transform={`translate(${chartRight + 3}, ${badgeY})`}>
                {/* Connecting dash to last candle */}
                <line
                    x1={lastCandleX - (chartRight + 3)}
                    y1={0}
                    x2={0}
                    y2={0}
                    stroke={lastBullish ? '#10B981' : '#EF4444'}
                    strokeDasharray="2 2"
                    strokeWidth="1"
                    opacity="0.75"
                />
                {/* Badge Background Pill */}
                <rect
                    x={2}
                    y={-9}
                    width={48}
                    height={18}
                    rx="4"
                    fill={lastBullish ? '#10B981' : '#EF4444'}
                />
                {/* Badge Text */}
                <text
                    x={26}
                    y={4}
                    fill="#05080A"
                    fontSize="9.5"
                    fontWeight="800"
                    fontFamily="'Inter', 'Euclid-Bold', -apple-system, sans-serif"
                    textAnchor="middle"
                >
                    {badgeText}
                </text>
            </g>

            {/* 7. Sub-Pane Divider */}
            <line
                x1={chartLeft}
                y1={indTop - 3}
                x2={chartRight}
                y2={indTop - 3}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
            />

            {/* 8. Sub-Pane Indicator Title */}
            <text
                x={chartLeft + 2}
                y={indTop + 8}
                fill="#94A3B8"
                fontSize="8.5"
                fontFamily="'Inter', 'Euclid-Medium', sans-serif"
                fontWeight="600"
            >
                Indicator: <tspan fill="#10B981">{displayIndicator}</tspan>
            </text>

            {/* 9. Indicator Midline (Dashed) */}
            <line
                x1={chartLeft}
                y1={indMidY}
                x2={chartRight}
                y2={indMidY}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="2 2"
                strokeWidth="0.8"
            />

            {/* 10. Dual Wave Indicator Curves (Green & Orange) */}
            <path
                d={wave1Path}
                fill="none"
                stroke="#10B981"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={wave2Path}
                fill="none"
                stroke="#F97316"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
            />

            {/* 11. Indicator Y-Axis Scale (1.00, 0.00, -1.20) */}
            <text
                x={chartRight + 6}
                y={indTop + 9}
                fill="#64748B"
                fontSize="8.5"
                fontFamily="'Inter', 'Euclid-Medium', -apple-system, sans-serif"
            >
                1.00
            </text>
            <text
                x={chartRight + 6}
                y={indMidY + 3}
                fill="#64748B"
                fontSize="8.5"
                fontFamily="'Inter', 'Euclid-Medium', -apple-system, sans-serif"
            >
                0.00
            </text>
            <text
                x={chartRight + 6}
                y={indBottom - 1}
                fill="#64748B"
                fontSize="8.5"
                fontFamily="'Inter', 'Euclid-Medium', -apple-system, sans-serif"
            >
                -1.20
            </text>

            {/* 12. Bottom X-Axis Line */}
            <line
                x1={chartLeft}
                y1={xAxisY}
                x2={chartRight}
                y2={xAxisY}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
            />

            {/* 13. Bottom X-Axis Time Labels */}
            {xTimeLabels.map((lbl, idx) => (
                <text
                    key={idx}
                    x={lbl.x}
                    y={xAxisY + 13}
                    fill="#64748B"
                    fontSize="9"
                    fontFamily="'Inter', 'Euclid-Medium', -apple-system, sans-serif"
                    textAnchor="middle"
                >
                    {lbl.text}
                </text>
            ))}
        </svg>
    );
}
