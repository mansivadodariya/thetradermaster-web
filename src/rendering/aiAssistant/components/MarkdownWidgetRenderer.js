'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from '../aiAssistant.module.scss';
import { useTheme } from '@/context/ThemeContext';
import { getBidiProps, bidiMarkdownComponents } from '@/lib/bidi';
import { ATR } from 'technicalindicators';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const WIDGET_REGEX = /(\[WIDGET:[A-Z_]+(?::[A-Z0-9/_-]+)?\])/gi;

const normalizeAssetSymbol = (symbol = '') => String(symbol).replace('/', '').toUpperCase();

const getAssetData = (visualData, symbol) => {
    const assets = visualData?.assets || {};
    const cleanSymbol = normalizeAssetSymbol(symbol);
    return assets[cleanSymbol] || assets[symbol] || assets[symbol?.replace('/', '')];
};

// ─── Support & Resistance calculation ──────────────────────────────────────────
const LEFT = 8;
const RIGHT = 8;

export const strengthStars = (score) => {
    if (typeof score === 'string') return score;
    if (score >= 8) return 'Strong';
    if (score >= 4) return 'Medium';
    return 'Weak';
};

export const normalizeBackendLevels = (levels) => {
    if (!Array.isArray(levels)) return null;
    return levels.map(level => {
        if (typeof level === 'number') return { price: level, strength: 5 };
        if (level && typeof level === 'object') {
            const price = Number(level.price ?? level.value ?? level.level ?? 0);
            const strength = level.strength ?? level.touches ?? 5;
            return { price, strength };
        }
        return null;
    }).filter(Boolean);
};

export const calculateSupportResistance = (candles) => {
    if (!candles?.length) return { support: [], resistance: [] };
    const highs = candles.map(c => Number(c.high));
    const lows = candles.map(c => Number(c.low));
    const closes = candles.map(c => Number(c.close));

    const atrValues = ATR.calculate({ period: 14, high: highs, low: lows, close: closes });
    const atrThreshold = atrValues.length ? atrValues[atrValues.length - 1] * 0.7 : 0.0008;

    const minMove = atrThreshold * 1.5;
    const pivotHighs = [];
    let lastPH = null;
    for (let i = LEFT; i < highs.length - RIGHT; i++) {
        const val = highs[i];
        if (lastPH !== null && Math.abs(val - lastPH) < minMove) continue;
        let ok = true;
        for (let j = i - LEFT; j <= i + RIGHT; j++) {
            if (j !== i && highs[j] >= val) { ok = false; break; }
        }
        if (ok) { pivotHighs.push({ price: val, index: i }); lastPH = val; }
    }

    const pivotLows = [];
    let lastPL = null;
    for (let i = LEFT; i < lows.length - RIGHT; i++) {
        const val = lows[i];
        if (lastPL !== null && Math.abs(val - lastPL) < minMove) continue;
        let ok = true;
        for (let j = i - LEFT; j <= i + RIGHT; j++) {
            if (j !== i && lows[j] <= val) { ok = false; break; }
        }
        if (ok) { pivotLows.push({ price: val, index: i }); lastPL = val; }
    }

    return {
        support: pivotLows.slice(-3).map(p => ({ price: p.price, strength: 6 })),
        resistance: pivotHighs.slice(-3).map(p => ({ price: p.price, strength: 6 }))
    };
};

// Seeded deterministic pseudo-random generator so mock candles NEVER change across re-renders
export function pseudoRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function() {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

export function getSymbolSeed(symbol = 'XAUUSD') {
    let hash = 0;
    const str = String(symbol).toUpperCase();
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) || 12345;
}

// Global cache for mock candles so candles remain 100% stable across renders
export const MOCK_CANDLES_CACHE = new Map();

export const generateMockCandles = (symbol = 'XAUUSD', count = 40) => {
    const cleanSym = String(symbol).replace('/', '').toUpperCase();
    const cacheKey = `${cleanSym}_${count}`;
    if (MOCK_CANDLES_CACHE.has(cacheKey)) {
        return MOCK_CANDLES_CACHE.get(cacheKey);
    }

    const rand = pseudoRandom(getSymbolSeed(cleanSym));
    const base = cleanSym.includes('BTC') ? 92000 : (cleanSym.includes('XAU') || cleanSym.includes('GOLD')) ? 4165 : cleanSym.includes('JPY') ? 154.5 : 1.085;
    
    // Stable reference timestamp so candle dates on X-axis do not drift or change
    const baseTime = Math.floor(Date.now() / 1000) - count * 3600;
    const candles = [];
    let cur = base;

    for (let i = 0; i < count; i++) {
        const t = baseTime + (i * 3600);
        const change = (rand() - 0.49) * (base * 0.003);
        const open = cur;
        const close = open + change;
        const high = Math.max(open, close) + rand() * (base * 0.0015);
        const low = Math.min(open, close) - rand() * (base * 0.0015);
        cur = close;
        candles.push({ timestamp: new Date(t * 1000).toISOString(), open, high, low, close });
    }

    MOCK_CANDLES_CACHE.set(cacheKey, candles);
    return candles;
};

export { normalizeAssetSymbol, getAssetData };

// ─── 1. Candlestick Price Chart Widget ─────────────────────────────────────────
export const InlineCandlestickWidget = React.memo(function InlineCandlestickWidget({ symbol = 'XAUUSD', visualData, isDark = true }) {
    const [showSR, setShowSR] = useState(true);
    const assetData = useMemo(() => getAssetData(visualData, symbol), [visualData, symbol]);

    const rawOhlc = useMemo(() => {
        return assetData?.ohlc_data?.ohlc_1h || assetData?.candles || generateMockCandles(symbol, 40);
    }, [assetData, symbol]);

    const rawSupport = assetData?.horizontal_levels?.supports ?? assetData?.horizontal_levels?.support ?? assetData?.support;
    const rawResistance = assetData?.horizontal_levels?.resistances ?? assetData?.horizontal_levels?.resistance ?? assetData?.resistance;

    const backendSupport = useMemo(() => normalizeBackendLevels(rawSupport), [rawSupport]);
    const backendResistance = useMemo(() => normalizeBackendLevels(rawResistance), [rawResistance]);

    const supportLevels = useMemo(() => {
        return backendSupport !== null ? backendSupport : calculateSupportResistance(rawOhlc).support;
    }, [backendSupport, rawOhlc]);

    const resistanceLevels = useMemo(() => {
        return backendResistance !== null ? backendResistance : calculateSupportResistance(rawOhlc).resistance;
    }, [backendResistance, rawOhlc]);

    const series = useMemo(() => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const candleData = (Array.isArray(rawOhlc) ? rawOhlc : []).map((d) => {
            const timeObj = d.timestamp
                ? new Date(d.timestamp)
                : d.time
                ? (typeof d.time === 'number' ? new Date(d.time > 1e11 ? d.time : d.time * 1000) : new Date(d.time))
                : new Date();

            const isValidTime = !isNaN(timeObj.getTime());
            const day = isValidTime ? String(timeObj.getDate()).padStart(2, '0') : '';
            const month = isValidTime ? monthNames[timeObj.getMonth()] || '' : '';
            const hours = isValidTime ? String(timeObj.getHours()).padStart(2, '0') : '';
            const mins = isValidTime ? String(timeObj.getMinutes()).padStart(2, '0') : '';
            const formattedLabel = isValidTime ? `${day} ${month} ${hours}:${mins}` : 'N/A';

            return {
                x: formattedLabel,
                y: [
                    parseFloat(d.open || 0),
                    parseFloat(d.high || 0),
                    parseFloat(d.low || 0),
                    parseFloat(d.close || 0)
                ]
            };
        }).filter(item => item.x !== 'N/A' && item.y.every(v => !isNaN(v) && v > 0));

        return [{
            name: 'Candles',
            data: candleData
        }];
    }, [rawOhlc]);

    const options = useMemo(() => {
        const yAxisAnnotations = showSR ? [
            ...supportLevels.map(({ price, strength }) => ({
                y: price,
                borderColor: '#10b981',
                strokeDashArray: 4,
                label: {
                    borderColor: '#10b981',
                    style: { color: '#fff', background: '#10b981', fontSize: '10px' },
                    text: `S ${price.toFixed(price > 100 ? 2 : 4)}`
                }
            })),
            ...resistanceLevels.map(({ price, strength }) => ({
                y: price,
                borderColor: '#ef4444',
                strokeDashArray: 4,
                label: {
                    borderColor: '#ef4444',
                    style: { color: '#fff', background: '#ef4444', fontSize: '10px' },
                    text: `R ${price.toFixed(price > 100 ? 2 : 4)}`
                }
            }))
        ] : [];

        return {
            chart: {
                type: 'candlestick',
                background: 'transparent',
                toolbar: { show: true, tools: { download: false, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true } },
                animations: { enabled: false, dynamicAnimation: { enabled: false } }
            },
            title: {
                text: `${symbol} Price Action & Key Levels`,
                align: 'left',
                margin: 10,
                style: { color: isDark ? '#18C98B' : '#047857', fontSize: '13px', fontWeight: 700 }
            },
            legend: {
                show: false
            },
            theme: { mode: isDark ? 'dark' : 'light' },
            xaxis: {
                type: 'category',
                tickAmount: 6,
                labels: {
                    rotate: 0,
                    style: { colors: isDark ? 'rgba(255, 255, 255, 0.65)' : '#475569', fontSize: '10.5px' }
                },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                tooltip: { enabled: true },
                labels: {
                    style: { colors: isDark ? 'rgba(255, 255, 255, 0.65)' : '#475569' },
                    formatter: (val) => (typeof val === 'number' ? val.toFixed(val > 100 ? 2 : 4) : val)
                }
            },
            grid: { 
                borderColor: isDark ? 'rgba(24, 201, 139, 0.15)' : 'rgba(226, 232, 240, 0.9)', 
                strokeDashArray: 4,
                padding: {
                    right: 65,
                    left: 10
                }
            },
            annotations: { yaxis: yAxisAnnotations },
            plotOptions: {
                candlestick: {
                    colors: {
                        upward: '#10b981',
                        downward: '#ef4444'
                    },
                    wick: { useFillColor: true }
                }
            },
            tooltip: { theme: isDark ? 'dark' : 'light', x: { format: 'dd MMM HH:mm' } }
        };
    }, [symbol, isDark, showSR, supportLevels, resistanceLevels]);

    return (
        <div className={`${styles.inlineWidgetCard} ${styles.pdfGraphBreak} pdfGraphBreak pdfPageBreakBefore`}>
            <div className={styles.inlineWidgetHeader}>
                <span className={styles.inlineWidgetTitle}>{symbol}</span>
                <button
                    type="button"
                    className={`${styles.srToggleBtn} ${showSR ? styles.srToggleActive : ''}`}
                    onClick={() => setShowSR(v => !v)}
                >
                    S/R Levels
                </button>
            </div>
            <Chart options={options} series={series} type="candlestick" height={320} width="100%" />
        </div>
    );
});

// ─── 2. Sentiment Radar Widget ────────────────────────────────────────────────
export const InlineSentimentRadarWidget = React.memo(function InlineSentimentRadarWidget({ symbol = 'XAUUSD', visualData, isDark = true }) {
    const assetData = useMemo(() => getAssetData(visualData, symbol), [visualData, symbol]);
    const scores = useMemo(() => {
        return assetData?.sentiment_scores || assetData?.indicators?.voting_scores || assetData?.indicators?.['4H']?.voting_scores || {};
    }, [assetData]);

    const normalizeScore = (val, fallback = 70) => {
        if (typeof val === 'number') {
            if (val >= -10 && val <= 10) return (val + 10) * 5;
            return Math.min(100, Math.max(0, val));
        }
        return fallback;
    };

    const series = useMemo(() => [{
        name: 'Market Sentiment',
        data: [
            normalizeScore(scores.trend ?? scores.trend_score, 80),
            normalizeScore(scores.momentum ?? scores.momentum_score, 75),
            normalizeScore(scores.volatility ?? scores.volatility_score, 50),
            normalizeScore(scores.overall ?? scores.overall_score, 72)
        ]
    }], [scores]);

    const options = useMemo(() => ({
        chart: {
            type: 'radar',
            background: 'transparent',
            toolbar: { show: false },
            animations: { enabled: false }
        },
        theme: { mode: isDark ? 'dark' : 'light' },
        labels: ['Trend', 'Momentum', 'Volatility', 'Overall'],
        yaxis: { show: false, min: 0, max: 100 },
        fill: {
            opacity: 0.35,
            type: 'gradient',
            gradient: {
                shade: isDark ? 'dark' : 'light',
                gradientToColors: ['#10B981'],
                shadeIntensity: 1,
                stops: [0, 100]
            }
        },
        stroke: { width: 2, colors: ['#18C98B'] },
        markers: {
            size: 5,
            colors: ['#18C98B'],
            strokeWidth: 2,
            strokeColors: isDark ? '#000000' : '#FFFFFF'
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: isDark ? 'rgba(24, 201, 139, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                    connectorColors: isDark ? 'rgba(24, 201, 139, 0.15)' : 'rgba(16, 185, 129, 0.15)'
                }
            }
        },
        xaxis: {
            labels: {
                style: {
                    colors: isDark ? ['#E2E8F0', '#E2E8F0', '#E2E8F0', '#E2E8F0'] : ['#0F172A', '#0F172A', '#0F172A', '#0F172A'],
                    fontSize: '11px',
                    fontWeight: 600
                }
            }
        },
        tooltip: { theme: isDark ? 'dark' : 'light' }
    }), [isDark]);

    return (
        <div className={`${styles.inlineWidgetCard} ${styles.pdfGraphBreak} pdfGraphBreak pdfPageBreakBefore`}>
            <div className={styles.inlineWidgetHeader}>
                <span className={styles.inlineWidgetTitle}>Market Sentiment: {symbol}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Chart options={options} series={series} type="radar" height={260} width="100%" />
            </div>
        </div>
    );
});

// ─── Helper: Format & Clean Inline Markdown Linebreaks & Stray Asterisks ──────
export function normalizeMarkdownParagraphs(text = '') {
    if (!text) return '';
    let raw = String(text);

    // 1. Normalize 3+ asterisks to standard bold **
    raw = raw.replace(/\*{3,}/g, '**');

    // 2. Convert bullet points starting with * or • to standard markdown -
    raw = raw.replace(/^[ \t]*[*•][ \t]+/gm, '- ');

    // 3. Put Trade Thesis & Final Bias strictly on new paragraphs
    raw = raw.replace(/([^\n])\s*\*{0,2}Trade Thesis:?\*{0,2}\s*/gi, '$1\n\n**Trade Thesis:** ');
    raw = raw.replace(/(?:^|\n)\s*\*{0,2}Trade Thesis:?\*{0,2}\s*/gi, '\n\n**Trade Thesis:** ');

    raw = raw.replace(/([^\n])\s*\*{0,2}Final Bias:?\*{0,2}\s*/gi, '$1\n\n**Final Bias:**\n');
    raw = raw.replace(/(?:^|\n)\s*\*{0,2}Final Bias:?\*{0,2}\s*/gi, '\n\n**Final Bias:**\n');

    // 4. Pipe-separated bias tokens onto bullet lines
    raw = raw.replace(/\s*\|\s*(\*{0,2}(?:Intraday Bias|Intraday|Swing Bias|Swing|Conviction|Forecast Horizon|Trade Thesis):\s*)/gi, '\n- $1');

    // 5. Standalone bias metrics onto clean bullets
    raw = raw.replace(/(?:^|\n|[.:!]\s*)\s*[-*•]?\s*\*+\s*(Intraday(?:\s*\([^)]+\))?|Swing(?:\s*\([^)]+\))?|Conviction|Forecast Horizon|Target Level|Stop Loss|Invalidation|Risk\/Reward):?\s*\*+/gi, '\n- **$1:** ');

    // 6. Clean lone single asterisks (*) anywhere in the text (like "*Trade Thesis: XAUUSD*" or "*Final Bias:")
    raw = raw.replace(/(?<!\*)\*(?!\*)/g, '');

    const rawLines = raw.split('\n');
    const processedLines = [];

    for (let i = 0; i < rawLines.length; i++) {
        let line = rawLines[i];
        const trimmed = line.trim();

        // If markdown table row or separator, preserve as is
        if ((trimmed.startsWith('|') && trimmed.endsWith('|')) || /^\|?[\s-:]+(\|[\s-:]+)+\|?$/.test(trimmed)) {
            processedLines.push(line);
            continue;
        }

        // Skip empty bullet lines or stray divider lines
        if (/^[-*+•]\s*$/.test(trimmed) || /^(\*\*|\*|__|_)\s*$/.test(trimmed) || /^[–—]\s*$/.test(trimmed)) {
            continue;
        }

        // Clean section headers if they were rendered as plain text
        if (/^Trade Thesis:/i.test(trimmed)) {
            line = line.replace(/^Trade Thesis:/i, '**Trade Thesis:**');
        } else if (/^Final Bias:?/i.test(trimmed)) {
            line = line.replace(/^Final Bias:?/i, '**Final Bias:**');
        }

        const subLines = line.split('\n');
        for (const sub of subLines) {
            const subTrimmed = sub.trim();
            if (/^[-*+•]\s*$/.test(subTrimmed) || /^(\*\*|\*|__|_)\s*$/.test(subTrimmed)) continue;

            let cleanedSub = sub
                .replace(/\s+\*{2,}$/, '')
                .replace(/^-\s+\*{2,}\s+/, '- ')
                .replace(/\*{4,}/g, '**');

            // Format bullet items:
            // Case 1: Already has bold key e.g. "- **Momentum:** **1H ADX**..." or "- **Momentum**: **1H ADX**..."
            const boldKeyColonMatch = cleanedSub.match(/^([ \t]*[-*•]\s*)\*\*([^*\n:]+)(:?\*\*|\*\*:)\s*(.*)$/);
            if (boldKeyColonMatch) {
                const prefix = boldKeyColonMatch[1].replace(/[*•]/g, '-');
                const key = boldKeyColonMatch[2].trim();
                const val = boldKeyColonMatch[4].trim();
                cleanedSub = `${prefix}**${key}:** ${val}`;
            } else {
                // Case 2: Plain unbolded key with colon e.g. "- Momentum: **1H ADX**..."
                const plainKeyMatch = cleanedSub.match(/^([ \t]*[-*•]\s*)([A-Za-z0-9\s()/-]{2,35}):\s+(.*)$/);
                if (plainKeyMatch) {
                    const prefix = plainKeyMatch[1].replace(/[*•]/g, '-');
                    const key = plainKeyMatch[2].trim();
                    const val = plainKeyMatch[3].trim();
                    cleanedSub = `${prefix}**${key}:** ${val}`;
                }
            }

            // Clean any remaining lone single asterisks
            cleanedSub = cleanedSub.replace(/(?<!\*)\*(?!\*)/g, '');

            processedLines.push(cleanedSub);
        }
    }

    return processedLines.join('\n')
        .replace(/([^\n])\n(- |\d+\. )/g, '$1\n\n$2')
        .replace(/\n{3,}/g, '\n\n');
}

// ─── 3. Main Widget-Aware Markdown Renderer ───────────────────────────────────
const RenderMarkdownWithWidgets = React.memo(function RenderMarkdownWithWidgets({ 
    content = '', 
    visualData = null, 
    defaultSymbol = 'XAUUSD',
    isStreaming = false,
    onComplete,
    forceLight = false
}) {
    const { theme } = useTheme();
    const isDark = forceLight ? false : (theme !== 'light');

    const normalizedContent = useMemo(() => normalizeMarkdownParagraphs(content), [content]);

    const words = React.useMemo(() => {
        if (!normalizedContent) return [];
        return normalizedContent.split(' ');
    }, [normalizedContent]);

    const [revealedWordCount, setRevealedWordCount] = useState(isStreaming ? 0 : words.length);
    const [isStreamingFinished, setIsStreamingFinished] = useState(!isStreaming);

    useEffect(() => {
        if (!isStreaming) {
            setRevealedWordCount(words.length);
            setIsStreamingFinished(true);
            return;
        }

        if (words.length === 0) {
            setIsStreamingFinished(true);
            return;
        }

        setRevealedWordCount(0);
        setIsStreamingFinished(false);

        let currentIdx = 0;
        const intervalId = setInterval(() => {
            const step = words.length > 300 ? 6 : words.length > 100 ? 3 : 1;
            currentIdx = Math.min(words.length, currentIdx + step);
            setRevealedWordCount(currentIdx);

            if (currentIdx >= words.length) {
                clearInterval(intervalId);
                setIsStreamingFinished(true);
                if (onComplete) onComplete();
            }
        }, 45);

        return () => clearInterval(intervalId);
    }, [normalizedContent, isStreaming, words.length, onComplete]);

    const displayContent = useMemo(() => {
        if (isStreamingFinished) return normalizedContent;
        return words.slice(0, revealedWordCount).join(' ');
    }, [isStreamingFinished, normalizedContent, words, revealedWordCount]);

    const parts = useMemo(() => {
        if (!displayContent) return [];
        return displayContent.split(WIDGET_REGEX);
    }, [displayContent]);

    if (!content) return null;

    return (
        <div className={styles.chatMarkdown}>
            {parts.map((part, index) => {
                const widgetMatch = part.match(/\[WIDGET:([A-Z_]+)(?::([A-Z0-9/_-]+))?\]/i);
                if (widgetMatch) {
                    const widgetType = widgetMatch[1].toUpperCase();
                    const symbol = widgetMatch[2] ? normalizeAssetSymbol(widgetMatch[2]) : normalizeAssetSymbol(defaultSymbol);

                    if (widgetType === 'SENTIMENT_RADAR') {
                        return (
                            <div key={`widget-${index}-${symbol}`} className={`${styles.pdfSection} pdfSection`} data-pdf-section="widget">
                                <InlineSentimentRadarWidget symbol={symbol} visualData={visualData} isDark={isDark} />
                            </div>
                        );
                    }
                    if (widgetType === 'CANDLESTICK') {
                        return (
                            <div key={`widget-${index}-${symbol}`} className={`${styles.pdfSection} pdfSection`} data-pdf-section="widget">
                                <InlineCandlestickWidget symbol={symbol} visualData={visualData} isDark={isDark} />
                            </div>
                        );
                    }
                }

                if (!part.trim()) return null;

                return (
                    <div key={`md-${index}`} className={`${styles.pdfSection} pdfSection`} data-pdf-section="text">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={bidiMarkdownComponents}
                        >
                            {part}
                        </ReactMarkdown>
                    </div>
                );
            })}
            {!isStreamingFinished && (
                <span className={styles.typewriterCursor} aria-hidden="true">▌</span>
            )}
        </div>
    );
});

export default RenderMarkdownWithWidgets;
