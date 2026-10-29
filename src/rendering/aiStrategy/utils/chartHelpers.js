import React from 'react';

// Helper to calculate milliseconds until the next HH:01:00
export function getMsUntilNextHourOOne() {
    const now = new Date();
    const next = new Date(now);

    next.setMinutes(1);
    next.setSeconds(0);
    next.setMilliseconds(0);

    if (now.getMinutes() >= 1) {
        next.setHours(now.getHours() + 1);
    }

    const diff = next.getTime() - now.getTime();
    return diff > 0 ? diff : 3600000;
}

export function formatPairCurrency(val, symbol) {
    if (typeof val !== 'number' || isNaN(val)) return '-';
    let symUpper = (symbol || '').toUpperCase().replace("/", "").replace(" ", "");
    if (symUpper.endsWith("JPY")) return val.toFixed(3);
    if (symUpper.includes("XAU") || symUpper.includes("GOLD") || symUpper.includes("XAG")) return val.toFixed(2);
    if (symUpper.includes("BTC")) return val.toFixed(2);
    if (symUpper.includes("NIFTY")) return val.toFixed(2);
    if (symUpper.length === 6) return val.toFixed(5);
    return val.toFixed(2);
}

export function generateFallbackCandles(symbol = 'XAUUSD', timeframe = '1H', anchorPrice = null) {
    if (!anchorPrice || isNaN(anchorPrice) || Number(anchorPrice) <= 0) {
        return [];
    }

    const candlesList = [];
    const basePrice = Number(anchorPrice);
    const step = Math.max(0.0001, basePrice * 0.0006);

    const now = Math.floor(Date.now() / 1000);
    const count = 120;
    const interval = timeframe === '5M' ? 300 : timeframe === '15M' ? 900 : timeframe === '1D' ? 86400 : 3600;

    let currentPrice = basePrice - count * 0.15 * step;
    let ema20Val = currentPrice;
    let ema50Val = currentPrice;

    for (let i = 0; i < count; i++) {
        const time = now - (count - i) * interval;
        const change = (Math.random() - 0.47) * step * 2;
        const open = currentPrice;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * step * 0.8;
        const low = Math.min(open, close) - Math.random() * step * 0.8;
        const vol = Math.floor(Math.random() * 4000) + 1200;

        currentPrice = close;
        ema20Val = ema20Val * (1 - 2 / 21) + close * (2 / 21);
        ema50Val = ema50Val * (1 - 2 / 51) + close * (2 / 51);
        const supertrend_dir = close >= ema20Val ? 1 : -1;
        const supertrend_val = supertrend_dir === 1 ? low - step * 0.5 : high + step * 0.5;

        candlesList.push({
            time,
            open: Number(open.toFixed(4)),
            high: Number(high.toFixed(4)),
            low: Number(low.toFixed(4)),
            close: Number(close.toFixed(4)),
            tick_volume: vol,
            ema20: Number(ema20Val.toFixed(4)),
            ema50: Number(ema50Val.toFixed(4)),
            supertrend_value: Number(supertrend_val.toFixed(4)),
            supertrend_direction: supertrend_dir,
        });
    }
    return candlesList;
}

export function EyeToggleIcon({ visible, className }) {
    if (visible) {
        return (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        );
    }
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
    );
}

export function getTimeframeSeconds(tf) {
    const s = String(tf || '1H').toUpperCase();
    if (s.includes('1M') || s === '1') return 60;
    if (s.includes('5M') || s === '5') return 300;
    if (s.includes('15M') || s === '15') return 900;
    if (s.includes('30M') || s === '30') return 1800;
    if (s.includes('4H') || s === '240') return 14400;
    if (s.includes('D') || s === '1D') return 86400;
    return 3600; // default 1H
}

export function calculateLiveCandleUpdate(candles, newPrice, timeframe, meta = {}) {
    if (!candles || candles.length === 0 || !newPrice || isNaN(newPrice) || newPrice <= 0) {
        return null;
    }

    const lastCandle = candles[candles.length - 1];

    const tfSec = getTimeframeSeconds(timeframe);

    // Sanity check: prevent artificial plunge/spike artifacts if price deviation > 5%
    const deviation = Math.abs(newPrice - lastCandle.close) / (lastCandle.close || 1);
    if (deviation > 0.05) {
        return {
            updatedBar: null,
            needsResync: true,
            isSameCandle: false,
            change: 0,
            changePct: 0
        };
    }

    const eventTime = meta.time ? (typeof meta.time === 'number' ? meta.time : Math.floor(new Date(meta.time).getTime() / 1000)) : null;
    const isSameCandle = eventTime ? eventTime < (lastCandle.time + tfSec) : true;
    let updatedBar;

    const rawHigh = meta.high !== undefined ? parseFloat(meta.high) : newPrice;
    const highVal = (!isNaN(rawHigh) && rawHigh > 0) ? Math.max(newPrice, rawHigh) : newPrice;

    const rawLow = meta.low !== undefined ? parseFloat(meta.low) : newPrice;
    const lowVal = (!isNaN(rawLow) && rawLow > 0) ? Math.min(newPrice, rawLow) : newPrice;

    if (isSameCandle) {
        const rawCandleLow = Math.min(lastCandle.low || lastCandle.open, lowVal);
        const safeLow = rawCandleLow > 0 ? rawCandleLow : Math.min(lastCandle.open, newPrice);
        updatedBar = {
            time: lastCandle.time,
            open: lastCandle.open,
            high: Math.max(lastCandle.high, highVal),
            low: safeLow,
            close: newPrice,
            tick_volume: (lastCandle.tick_volume || 1500) + 1,
        };
        candles[candles.length - 1] = updatedBar;
    } else {
        const newTime = lastCandle.time + tfSec;
        // Start the new candle cleanly from newPrice. Never stretch artificially back to lastCandle.close if it diverges!
        const isNear = Math.abs(newPrice - lastCandle.close) / (lastCandle.close || 1) < 0.002;
        const candleOpen = isNear ? lastCandle.close : newPrice;
        const validHigh = Math.max(candleOpen, newPrice, highVal);
        const rawCandleLow = Math.min(candleOpen, newPrice, lowVal);
        const validLow = rawCandleLow > 0 ? rawCandleLow : Math.min(candleOpen, newPrice);
        updatedBar = {
            time: newTime,
            open: candleOpen,
            high: validHigh,
            low: validLow,
            close: newPrice,
            tick_volume: 15,
        };
        candles.push(updatedBar);
    }

    const prevCandle = candles.length > 1 ? candles[candles.length - 2] : updatedBar;
    const change = updatedBar.close - prevCandle.close;
    const changePct = prevCandle.close > 0 ? (change / prevCandle.close) * 100 : 0;

    return {
        updatedBar,
        isSameCandle,
        change: meta.change !== undefined && !isNaN(meta.change) ? Number(meta.change) : change,
        changePct: meta.changePct !== undefined && !isNaN(meta.changePct) ? Number(meta.changePct) : changePct,
    };
}

export function getChartConfig(width, height, isLight, isDark) {
    return {
        width,
        height,
        layout: {
            background: { type: 'solid', color: 'transparent' },
            textColor: isLight ? '#475569' : '#94A3B8',
            fontSize: 11,
            fontFamily: "'Inter', sans-serif",
            attributionLogo: false,
        },
        grid: {
            vertLines: { color: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)' },
            horzLines: { color: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)' },
        },
        crosshair: {
            vertLine: { color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)', width: 1 },
            horzLine: { color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)', width: 1 },
        },
        handleScroll: {
            mouseWheel: false,
            pressedMouseMove: true,
            horzTouchDrag: true,
            vertTouchDrag: false,
        },
        handleScale: {
            axisPressedMouseMove: { time: true, price: true },
            axisDoubleClickReset: { time: true, price: true },
            mouseWheel: false,
            pinch: true,
        },
        timeScale: {
            borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.12)',
            timeVisible: true,
            secondsVisible: false,
            rightOffset: 20,
            barSpacing: 6.5,
            minBarSpacing: 2,
            rightBarStaysOnScroll: true,
        },
        rightPriceScale: {
            borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.12)',
            scaleMargins: { top: 0.08, bottom: 0.12 },
        },
    };
}

export function handleCrosshairMove(param, chartRef, chartDataRef, setHoveredData, setDotPositions) {
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

        const ema20 = data.ema20Map?.get(t);
        const ema50 = data.ema50Map?.get(t);
        const supertrendObj = data.supertrendMap?.get(t);

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
            supertrendColor: supertrendObj?.color,
        });

        if (chartRef.current?.chart && chartRef.current?.series) {
            const timeScale = chartRef.current.chart.timeScale();
            const seriesInstance = chartRef.current.series;
            const x = timeScale.timeToCoordinate(t);
            const positions = {};
            if (x !== null) {
                if (ema20 !== undefined && ema20 !== null && seriesInstance.ema20) {
                    const y = seriesInstance.ema20.priceToCoordinate(ema20);
                    if (y !== null) positions.ema20 = { x, y, color: '#38bdf8' };
                }
                if (ema50 !== undefined && ema50 !== null && seriesInstance.ema50) {
                    const y = seriesInstance.ema50.priceToCoordinate(ema50);
                    if (y !== null) positions.ema50 = { x, y, color: '#00E5FF' };
                }
                if (supertrendObj?.value !== undefined && supertrendObj?.value !== null && seriesInstance.supertrend) {
                    const y = seriesInstance.supertrend.priceToCoordinate(supertrendObj.value);
                    if (y !== null) positions.supertrend = { x, y, color: supertrendObj.color };
                }
            }
            setDotPositions(positions);
        }
    } else {
        setHoveredData(null);
        setDotPositions(null);
    }
}

export function createWheelZoomHandler(chartRef) {
    return (e) => {
        const targetEl = e.target;
        if (
            targetEl &&
            (targetEl.closest('[class*="dropdown"]') ||
                targetEl.closest('[class*="Dropdown"]') ||
                targetEl.closest('[class*="tickerSearch"]') ||
                targetEl.closest('[class*="tickerList"]') ||
                targetEl.closest('[class*="modal"]') ||
                targetEl.closest('[class*="Modal"]') ||
                targetEl.closest('[class*="menu"]') ||
                targetEl.closest('[class*="Menu"]') ||
                targetEl.closest('[class*="popup"]') ||
                targetEl.closest('[class*="settings"]') ||
                targetEl.closest('[class*="control"]') ||
                targetEl.closest('[class*="pill"]') ||
                targetEl.closest('[class*="Pill"]') ||
                targetEl.closest('input, select, textarea, button'))
        ) {
            return;
        }

        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();

        if (!chartRef.current?.chart) return;
        const timeScale = chartRef.current.chart.timeScale();
        const currentSpacing = timeScale.options().barSpacing || 6.5;

        const zoomIn = e.deltaY < 0;
        const zoomMultiplier = zoomIn ? 1.15 : 0.87;
        const nextSpacing = Math.max(2, Math.min(80, currentSpacing * zoomMultiplier));

        timeScale.applyOptions({
            barSpacing: nextSpacing,
            rightBarStaysOnScroll: true,
        });
    };
}


