import { 
    generateMockCandles, 
    calculateSupportResistance, 
    getAssetData, 
    normalizeAssetSymbol 
} from '../components/MarkdownWidgetRenderer';

/**
 * Render SVG Radar Chart for PDF (White Theme, Centered, No Clipping)
 */
export function renderRadarSvgHtml(symbol, visualData, sourceDomElement = null, pair = 'XAUUSD') {
    const cleanSym = normalizeAssetSymbol(symbol || pair);
    const assetData = getAssetData(visualData, cleanSym) || {};
    const scores = assetData?.sentiment_scores || assetData?.indicators?.voting_scores || assetData?.indicators?.['4H']?.voting_scores || {};

    const norm = (v, fallback = 70) => {
        if (typeof v === 'number') {
            if (v >= -10 && v <= 10) return (v + 10) * 5;
            return Math.min(100, Math.max(0, v));
        }
        return fallback;
    };

    const sTrend = norm(scores.trend ?? scores.trend_score, 80);
    const sMom = norm(scores.momentum ?? scores.momentum_score, 75);
    const sVol = norm(scores.volatility ?? scores.volatility_score, 50);
    const sOver = norm(scores.overall ?? scores.overall_score, 72);

    const cx = 200;
    const cy = 120;
    const maxR = 68;

    const pTrend = `${cx},${cy - (sTrend / 100) * maxR}`;
    const pMom = `${cx + (sMom / 100) * maxR},${cy}`;
    const pVol = `${cx},${cy + (sVol / 100) * maxR}`;
    const pOver = `${cx - (sOver / 100) * maxR},${cy}`;

    return `
    <div class="pdfBlock pdfSectionCard" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin: 12px 0; text-align: center; page-break-inside: avoid; break-inside: avoid; color: #0F172A; box-sizing: border-box; width: 100%;">
        <div style="font-size: 11px; font-weight: 800; color: #0F172A; text-transform: uppercase; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            <span>Market Sentiment: <strong style="color: #059669;">${cleanSym}</strong></span>
            <span style="background: #ECFDF5; border: 1px solid #10B981; color: #065F46; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 4px;">QUANT AUDIT</span>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; padding: 6px 0; width: 100%;">
            <svg width="100%" height="240" viewBox="0 0 400 240" style="display: block; max-width: 380px; margin: 0 auto; overflow: visible;">
                <!-- Web Concentric Polygons -->
                <polygon points="${cx},${cy - maxR} ${cx + maxR},${cy} ${cx},${cy + maxR} ${cx - maxR},${cy}" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1" />
                <polygon points="${cx},${cy - maxR * 0.75} ${cx + maxR * 0.75},${cy} ${cx},${cy + maxR * 0.75} ${cx - maxR * 0.75},${cy}" fill="none" stroke="#E2E8F0" stroke-width="1" />
                <polygon points="${cx},${cy - maxR * 0.5} ${cx + maxR * 0.5},${cy} ${cx},${cy + maxR * 0.5} ${cx - maxR * 0.5},${cy}" fill="none" stroke="#E2E8F0" stroke-width="1" />
                <polygon points="${cx},${cy - maxR * 0.25} ${cx + maxR * 0.25},${cy} ${cx},${cy + maxR * 0.25} ${cx - maxR * 0.25},${cy}" fill="none" stroke="#E2E8F0" stroke-width="1" />
                
                <!-- Center Axis Lines -->
                <line x1="${cx}" y1="${cy - maxR}" x2="${cx}" y2="${cy + maxR}" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="2,2" />
                <line x1="${cx - maxR}" y1="${cy}" x2="${cx + maxR}" y2="${cy}" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="2,2" />
                
                <!-- Data Polygon -->
                <polygon points="${pTrend} ${pMom} ${pVol} ${pOver}" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" stroke-width="2.5" />
                
                <!-- Data Points -->
                <circle cx="${cx}" cy="${cy - (sTrend / 100) * maxR}" r="4" fill="#10B981" stroke="#FFFFFF" stroke-width="2" />
                <circle cx="${cx + (sMom / 100) * maxR}" cy="${cy}" r="4" fill="#10B981" stroke="#FFFFFF" stroke-width="2" />
                <circle cx="${cx}" cy="${cy + (sVol / 100) * maxR}" r="4" fill="#10B981" stroke="#FFFFFF" stroke-width="2" />
                <circle cx="${cx - (sOver / 100) * maxR}" cy="${cy}" r="4" fill="#10B981" stroke="#FFFFFF" stroke-width="2" />
                
                <!-- Labels with Safe Margins -->
                <text x="${cx}" y="${cy - maxR - 10}" text-anchor="middle" font-size="10" font-weight="700" fill="#0F172A">Trend (${sTrend}%)</text>
                <text x="${cx + maxR + 10}" y="${cy + 3.5}" text-anchor="start" font-size="10" font-weight="700" fill="#0F172A">Momentum (${sMom}%)</text>
                <text x="${cx}" y="${cy + maxR + 18}" text-anchor="middle" font-size="10" font-weight="700" fill="#0F172A">Volatility (${sVol}%)</text>
                <text x="${cx - maxR - 10}" y="${cy + 3.5}" text-anchor="end" font-size="10" font-weight="700" fill="#0F172A">Overall (${sOver}%)</text>
            </svg>
        </div>
    </div>
    `;
}

/**
 * Render SVG Candlestick Chart for PDF matching Institutional White Theme
 */
export function renderCandlestickSvgHtml(symbol, visualData, sourceDomElement = null, pair = 'XAUUSD') {
    const cleanSym = normalizeAssetSymbol(symbol || pair);
    const assetData = getAssetData(visualData, cleanSym) || {};
    const rawCandles = assetData?.ohlc_data?.ohlc_1h || assetData?.candles;
    const candles = Array.isArray(rawCandles) && rawCandles.length >= 10 
        ? rawCandles.slice(-40) 
        : generateMockCandles(cleanSym, 40);

    const rawSupport = assetData?.horizontal_levels?.supports ?? assetData?.horizontal_levels?.support ?? assetData?.support;
    const rawResistance = assetData?.horizontal_levels?.resistances ?? assetData?.horizontal_levels?.resistance ?? assetData?.resistance;

    const normSr = (levels) => {
        if (!Array.isArray(levels)) return [];
        return levels.map(l => typeof l === 'number' ? l : Number(l.price ?? l.value ?? l.level ?? 0)).filter(p => p > 0);
    };

    let sList = normSr(rawSupport);
    let rList = normSr(rawResistance);

    if (sList.length === 0 || rList.length === 0) {
        const sr = calculateSupportResistance(candles);
        if (sList.length === 0) sList = sr.support.map(s => s.price);
        if (rList.length === 0) rList = sr.resistance.map(r => r.price);
    }

    const svgW = 660;
    const svgH = 280;
    const chartL = 60;
    const chartR = 500;
    const chartT = 20;
    const chartB = 230;
    const chartW = chartR - chartL;
    const chartH = chartB - chartT;

    const count = candles.length;
    let minP = Infinity;
    let maxP = -Infinity;
    candles.forEach(c => {
        const l = Number(c.low ?? c.open);
        const h = Number(c.high ?? c.close);
        if (l < minP) minP = l;
        if (h > maxP) maxP = h;
    });

    sList.forEach(p => { if (p < minP) minP = p; if (p > maxP) maxP = p; });
    rList.forEach(p => { if (p < minP) minP = p; if (p > maxP) maxP = p; });

    const pad = (maxP - minP) * 0.08 || 1;
    const adjMin = minP - pad;
    const adjMax = maxP + pad;
    const pRange = adjMax - adjMin;

    const getY = (price) => chartB - ((price - adjMin) / pRange) * chartH;

    const candleSpacing = chartW / count;
    const candleWidth = Math.max(3, Math.min(8.5, candleSpacing * 0.72));

    let candlesSvg = '';
    candles.forEach((c, i) => {
        const o = Number(c.open);
        const h = Number(c.high);
        const l = Number(c.low);
        const cl = Number(c.close);
        const isUp = cl >= o;
        const color = isUp ? '#10B981' : '#EF4444';

        const cx = chartL + i * candleSpacing + candleSpacing / 2;
        const yH = getY(h);
        const yL = getY(l);
        const yO = getY(o);
        const yC = getY(cl);

        const bodyTop = Math.min(yO, yC);
        const bodyHeight = Math.max(1.5, Math.abs(yC - yO));

        candlesSvg += `
            <line x1="${cx}" y1="${yH}" x2="${cx}" y2="${yL}" stroke="${color}" stroke-width="1.2" />
            <rect x="${cx - candleWidth / 2}" y="${bodyTop}" width="${candleWidth}" height="${bodyHeight}" fill="${color}" stroke="${color}" rx="0.5" />
        `;
    });

    const fmtPrice = (p) => {
        if (typeof p !== 'number' || isNaN(p)) return '0.00';
        return p > 100 ? p.toFixed(2) : p.toFixed(4);
    };

    // S/R Lines (Horizontal with badges on right)
    let srLinesSvg = '';
    rList.forEach(p => {
        const y = getY(p);
        srLinesSvg += `
            <line x1="${chartL}" y1="${y}" x2="${chartR}" y2="${y}" stroke="#EF4444" stroke-width="1.2" stroke-dasharray="4,4" />
            <rect x="${chartR + 8}" y="${y - 8.5}" width="78" height="17" fill="#EF4444" rx="3" />
            <text x="${chartR + 47}" y="${y + 3.5}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#FFFFFF">R ${fmtPrice(p)}</text>
        `;
    });
    sList.forEach(p => {
        const y = getY(p);
        srLinesSvg += `
            <line x1="${chartL}" y1="${y}" x2="${chartR}" y2="${y}" stroke="#10B981" stroke-width="1.2" stroke-dasharray="4,4" />
            <rect x="${chartR + 8}" y="${y - 8.5}" width="78" height="17" fill="#10B981" rx="3" />
            <text x="${chartR + 47}" y="${y + 3.5}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#FFFFFF">S ${fmtPrice(p)}</text>
        `;
    });

    // Y-Axis Gridlines & Price Ticks on LEFT (Clean light styling)
    let yGridSvg = '';
    const stepCount = 6;
    for (let i = 0; i <= stepCount; i++) {
        const priceVal = adjMin + (i / stepCount) * pRange;
        const yPos = getY(priceVal);
        yGridSvg += `
            <line x1="${chartL}" y1="${yPos}" x2="${chartR}" y2="${yPos}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3,3" />
            <text x="${chartL - 6}" y="${yPos + 3}" text-anchor="end" font-size="8.5" font-family="monospace" fill="#64748B" font-weight="600">${fmtPrice(priceVal)}</text>
        `;
    }

    // X-Axis Time Labels from actual candle timestamps
    let xTimeSvg = '';
    const numTimeTicks = 6;
    for (let i = 0; i < numTimeTicks; i++) {
        const idx = Math.min(candles.length - 1, Math.round((i / (numTimeTicks - 1)) * (candles.length - 1)));
        const c = candles[idx];
        const xPos = chartL + idx * candleSpacing + candleSpacing / 2;
        let label = '';
        if (c.timestamp) {
            const d = new Date(c.timestamp);
            const day = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            label = `${day} ${time}`;
        } else {
            label = `T-${(candles.length - idx)}h`;
        }
        xTimeSvg += `
            <text x="${xPos}" y="${chartB + 16}" text-anchor="middle" font-size="8.5" fill="#64748B" font-weight="600">${label}</text>
        `;
    }

    return `
    <div class="pdfBlock pdfSectionCard" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin: 12px 0; page-break-inside: avoid; break-inside: avoid; color: #0F172A; box-sizing: border-box; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            <div>
                <span style="font-size: 13px; font-weight: 800; color: #0F172A; letter-spacing: 0.3px;">${cleanSym}</span>
                <div style="font-size: 10.5px; font-weight: 700; color: #059669; margin-top: 1px;">${cleanSym} Price Action & Key Levels</div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="background: #F0FDF4; border: 1px solid #10B981; color: #065F46; font-size: 8.5px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">S/R Levels</span>
            </div>
        </div>
        <div style="display: flex; justify-content: center; width: 100%; box-sizing: border-box;">
            <svg width="100%" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display: block; width: 100%; height: auto; overflow: visible;">
                <!-- Horizontal Gridlines & Left Price Ticks -->
                ${yGridSvg}
                
                <!-- Candlesticks -->
                ${candlesSvg}
                
                <!-- Support & Resistance Reference Lines with Price Badges -->
                ${srLinesSvg}
                
                <!-- Bottom Axis Line -->
                <line x1="${chartL}" y1="${chartB}" x2="${chartR}" y2="${chartB}" stroke="#CBD5E1" stroke-width="1" />
                
                <!-- X-Axis Timestamps -->
                ${xTimeSvg}
            </svg>
        </div>
    </div>
    `;
}
