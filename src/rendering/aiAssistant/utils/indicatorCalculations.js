import React from 'react';
import { getSymbolPrecision, applySymbolPrecision } from '@/lib/chartStore';

export { getSymbolPrecision, applySymbolPrecision };

export function formatPrice(val, sym) {
    if (val === undefined || val === null || isNaN(val)) return '0.00';
    const { precision } = getSymbolPrecision(sym);
    return Number(val).toLocaleString('en-US', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    });
}

// Helper to normalize symbol string (e.g. "XAU/USD" -> "XAUUSD")
export function normalizeSymbol(sym, defaultFallback = '') {
    if (!sym || sym === 'No Pair' || sym === 'NO_PAIR' || String(sym).toUpperCase().includes('NO PAIR')) return defaultFallback;
    return sym.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Render SVG icon for chart types (Candlestick, Line, Area) matching TradingView
export function renderChartTypeIcon(type) {
    if (type === 'line') {
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <path d="M7 14l4-4 4 3 5-6" />
            </svg>
        );
    } else if (type === 'area') {
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <path d="M7 14l4-3 4 2 5-5v6H7z" fill="currentColor" fillOpacity="0.25" />
                <path d="M7 14l4-3 4 2 5-5" />
            </svg>
        );
    } else {
        // Candlestick (Default)
        return (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <line x1="9" y1="7" x2="9" y2="15" />
                <rect x="7.5" y="9" width="3" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
                <line x1="15" y1="5" x2="15" y2="13" />
                <rect x="13.5" y="7" width="3" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
            </svg>
        );
    }
}

// Get icon symbol representation for trading pairs
export function getSymbolIcon(pairStr) {
    const s = (pairStr || '').toUpperCase();
    if (s.includes('XAU') || s.includes('GOLD')) return 'GOLD';
    if (s.includes('BTC')) return 'BTC';
    if (s.includes('ETH')) return 'ETH';
    if (s.includes('EUR')) return 'EUR';
    if (s.includes('GBP')) return 'GBP';
    if (s.includes('JPY')) return 'JPY';
    if (s.includes('AUD')) return 'AUD';
    if (s.includes('CAD')) return 'CAD';
    if (s.includes('NZD')) return 'NZD';
    if (s.includes('CHF')) return 'CHF';
    return 'USD';
}

export function getTimeframeInterval(tf) {
    switch (tf) {
        case '1m': return 60;
        case '5m': return 300;
        case '15m': return 900;
        case '30m': return 1800;
        case '1h': return 3600;
        case '4h': return 14400;
        case '1d': return 86400;
        default: return 900;
    }
}

// Get default realistic base price for symbols dynamically from live socket singleton
export function getDefaultSymbolBasePrice(symbolStr = 'XAUUSD', fallbackPrice = null) {
    if (fallbackPrice && !isNaN(fallbackPrice) && Number(fallbackPrice) > 0) {
        return Number(fallbackPrice);
    }
    try {
        const { unifiedSocket } = require('@/lib/unifiedSocket');
        const known = unifiedSocket?.getKnownPrice ? unifiedSocket.getKnownPrice(symbolStr) : null;
        if (known && !isNaN(known) && Number(known) > 0) {
            return Number(known);
        }
    } catch (_) {}
    return null;
}

// Generate realistic fallback candles anchored precisely to the live price at the latest candle
export function generateMockCandles(count = 600, basePrice = null, tf = '15m', symbolStr = 'XAUUSD') {
    const finalBasePrice = (basePrice && !isNaN(basePrice) && Number(basePrice) > 0)
        ? Number(basePrice)
        : getDefaultSymbolBasePrice(symbolStr);

    if (!finalBasePrice || finalBasePrice <= 0) {
        return [];
    }
    const candles = [];
    const now = Math.floor(Date.now() / 1000);
    const interval = getTimeframeInterval(tf);
    const bucketedNow = Math.floor(now / interval) * interval;
    const { precision } = getSymbolPrecision(symbolStr);

    let currentPrice = finalBasePrice;
    // Walk backwards from current time so latest candle's close is EXACTLY finalBasePrice
    for (let i = 0; i <= count; i++) {
        const time = bucketedNow - i * interval;
        const volatility = finalBasePrice * 0.0006;
        const change = (Math.random() - 0.5) * volatility;
        const close = currentPrice;
        const open = close - change;
        const wick = Math.random() * volatility * 0.4;
        const high = Math.max(open, close) + wick;
        const low = Math.min(open, close) - wick;
        currentPrice = open;

        candles.unshift({
            time,
            open: Number(open.toFixed(precision)),
            high: Number(high.toFixed(precision)),
            low: Number(low.toFixed(precision)),
            close: Number(close.toFixed(precision)),
        });
    }
    return candles;
}

export function calculateEMA(candles, period = 20, source = 'close') {
    if (!candles || candles.length < period) return [];
    const getVal = (c) => (c && c[source] !== undefined) ? Number(c[source]) : (c && c.close !== undefined ? Number(c.close) : 0);
    const k = 2 / (period + 1);

    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += getVal(candles[i]);
    }
    let ema = sum / period;
    const result = [{ time: candles[period - 1].time, value: Number(ema.toFixed(5)) }];

    for (let i = period; i < candles.length; i++) {
        const val = getVal(candles[i]);
        ema = (val * k) + (ema * (1 - k));
        result.push({ time: candles[i].time, value: Number(ema.toFixed(5)) });
    }
    return result;
}

export function calculateSMA(candles, period = 20, source = 'close') {
    if (!candles || candles.length < period) return [];
    const getVal = (c) => (c && c[source] !== undefined) ? Number(c[source]) : (c && c.close !== undefined ? Number(c.close) : 0);
    const result = [];
    for (let i = period - 1; i < candles.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += getVal(candles[i - j]);
        }
        result.push({ time: candles[i].time, value: Number((sum / period).toFixed(5)) });
    }
    return result;
}

export function getIndicatorData(candles, type, period = 20, source = 'close') {
    if (type === 'SMA') return calculateSMA(candles, period, source);
    return calculateEMA(candles, period, source);
}

export function calculateBollingerBands(candles, period = 20, stdDevMult = 2, source = 'close') {
    const upper = [];
    const lower = [];
    const middle = [];
    if (!candles || candles.length < period) return { upper, lower, middle };
    const getVal = (c) => (c && c[source] !== undefined) ? c[source] : c.close;

    for (let i = period - 1; i < candles.length; i++) {
        const slice = candles.slice(i - period + 1, i + 1);
        const mean = slice.reduce((sum, c) => sum + getVal(c), 0) / period;
        const variance = slice.reduce((sum, c) => sum + Math.pow(getVal(c) - mean, 2), 0) / period;
        const stdDev = Math.sqrt(variance);
        const time = candles[i].time;
        middle.push({ time, value: mean });
        upper.push({ time, value: mean + stdDevMult * stdDev });
        lower.push({ time, value: mean - stdDevMult * stdDev });
    }
    return { upper, lower, middle };
}

export function calculatePivotPoints(candles) {
    if (!candles || candles.length === 0) return { P: [], R1: [], S1: [], R2: [], S2: [] };
    const lastBar = candles[candles.length - 1];
    const H = lastBar.high;
    const L = lastBar.low;
    const C = lastBar.close;

    const P_val = (H + L + C) / 3;
    const R1_val = 2 * P_val - L;
    const S1_val = 2 * P_val - H;
    const R2_val = P_val + (H - L);
    const S2_val = P_val - (H - L);

    const firstTime = candles[0].time;
    const lastTime = candles[candles.length - 1].time;

    return {
        P: [{ time: firstTime, value: P_val }, { time: lastTime, value: P_val }],
        R1: [{ time: firstTime, value: R1_val }, { time: lastTime, value: R1_val }],
        S1: [{ time: firstTime, value: S1_val }, { time: lastTime, value: S1_val }],
        R2: [{ time: firstTime, value: R2_val }, { time: lastTime, value: R2_val }],
        S2: [{ time: firstTime, value: S2_val }, { time: lastTime, value: S2_val }],
    };
}

export function calculateRSI(candles, period = 14) {
    if (!candles || candles.length <= period) return [];
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const change = candles[i].close - candles[i - 1].close;
        if (change >= 0) gains += change;
        else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;
    const result = [];
    const firstRs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push({ time: candles[period].time, value: 100 - 100 / (1 + firstRs) });

    for (let i = period + 1; i < candles.length; i++) {
        const change = candles[i].close - candles[i - 1].close;
        const gain = change >= 0 ? change : 0;
        const loss = change < 0 ? -change : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        result.push({ time: candles[i].time, value: 100 - 100 / (1 + rs) });
    }
    return result;
}

export function calculateMACD(candles, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const fastEma = calculateEMA(candles, fastPeriod);
    const slowEma = calculateEMA(candles, slowPeriod);
    const slowMap = new Map(slowEma.map(item => [item.time, item.value]));
    const macdLine = [];

    for (const f of fastEma) {
        if (slowMap.has(f.time)) {
            macdLine.push({ time: f.time, value: f.value - slowMap.get(f.time) });
        }
    }

    if (macdLine.length < signalPeriod) return { macd: [], macdLine: [], signal: [], signalLine: [], histogram: [] };
    const k = 2 / (signalPeriod + 1);
    let signalEma = macdLine.slice(0, signalPeriod).reduce((sum, item) => sum + item.value, 0) / signalPeriod;
    const signalLine = [{ time: macdLine[signalPeriod - 1].time, value: signalEma }];
    const histogram = [{
        time: macdLine[signalPeriod - 1].time,
        value: macdLine[signalPeriod - 1].value - signalEma,
        color: (macdLine[signalPeriod - 1].value - signalEma) >= 0 ? '#26a69a' : '#ef5350'
    }];

    for (let i = signalPeriod; i < macdLine.length; i++) {
        const item = macdLine[i];
        signalEma = (item.value - signalEma) * k + signalEma;
        const histVal = item.value - signalEma;
        signalLine.push({ time: item.time, value: signalEma });
        histogram.push({
            time: item.time,
            value: histVal,
            color: histVal >= 0 ? '#26a69a' : '#ef5350'
        });
    }

    return { macd: macdLine, macdLine, signal: signalLine, signalLine, histogram };
}

export function calculateStochastic(candles, period = 14, kSmooth = 3, dSmooth = 3) {
    if (!candles || candles.length < period) return { k: [], d: [] };
    const rawK = [];

    for (let i = period - 1; i < candles.length; i++) {
        const slice = candles.slice(i - period + 1, i + 1);
        let lowMin = Infinity;
        let highMax = -Infinity;
        for (const c of slice) {
            if (c.low < lowMin) lowMin = c.low;
            if (c.high > highMax) highMax = c.high;
        }
        const currentClose = candles[i].close;
        const kVal = highMax === lowMin ? 50 : ((currentClose - lowMin) / (highMax - lowMin)) * 100;
        rawK.push({ time: candles[i].time, value: kVal });
    }

    const smoothedK = [];
    for (let i = kSmooth - 1; i < rawK.length; i++) {
        const slice = rawK.slice(i - kSmooth + 1, i + 1);
        const avg = slice.reduce((sum, item) => sum + item.value, 0) / kSmooth;
        smoothedK.push({ time: rawK[i].time, value: avg });
    }

    const smoothedD = [];
    for (let i = dSmooth - 1; i < smoothedK.length; i++) {
        const slice = smoothedK.slice(i - dSmooth + 1, i + 1);
        const avg = slice.reduce((sum, item) => sum + item.value, 0) / dSmooth;
        smoothedD.push({ time: smoothedK[i].time, value: avg });
    }

    return { k: smoothedK, d: smoothedD };
}
