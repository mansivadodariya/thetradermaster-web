"use client";
import { useLanguage } from '@/context/LanguageContext';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './beforeAfterComparison.module.scss';
import SectionHeader from '@/components/sectionHeader';

// High-Density Realistic 60-Candle Wave Dataset matching TradingView Chart
const candlesData = [
  { open: 510, high: 525, low: 505, close: 518 },
  { open: 518, high: 535, low: 512, close: 532 },
  { open: 532, high: 545, low: 528, close: 520 },
  { open: 520, high: 528, low: 485, close: 490 },
  { open: 490, high: 515, low: 480, close: 508 },
  { open: 508, high: 512, low: 468, close: 472 },
  { open: 472, high: 498, low: 465, close: 492 }, // Candle 6 - Weak Buy
  { open: 492, high: 496, low: 458, close: 464 },
  { open: 464, high: 478, low: 442, close: 448 },
  { open: 448, high: 458, low: 432, close: 440 },
  { open: 440, high: 455, low: 435, close: 448 },
  { open: 448, high: 452, low: 430, close: 435 },
  { open: 435, high: 450, low: 428, close: 442 },
  { open: 442, high: 448, low: 425, close: 430 },
  { open: 430, high: 465, low: 422, close: 458 },
  { open: 458, high: 472, low: 445, close: 450 },
  { open: 450, high: 468, low: 438, close: 462 }, // Candle 16 - Sell Signal Pullback
  { open: 462, high: 470, low: 418, close: 424 },
  { open: 424, high: 445, low: 420, close: 438 },
  { open: 438, high: 448, low: 430, close: 434 },
  { open: 434, high: 442, low: 422, close: 428 },
  { open: 428, high: 448, low: 425, close: 440 }, // Candle 21 - TP1
  { open: 440, high: 452, low: 432, close: 446 },
  { open: 446, high: 460, low: 435, close: 442 },
  { open: 442, high: 458, low: 430, close: 452 },
  { open: 452, high: 475, low: 448, close: 468 },
  { open: 468, high: 482, low: 405, close: 415 }, // Candle 26 - Sweep & TP2
  { open: 415, high: 488, low: 410, close: 482 }, // Candle 27 - Buy Signal
  { open: 482, high: 495, low: 475, close: 488 },
  { open: 488, high: 492, low: 460, close: 468 },
  { open: 468, high: 485, low: 462, close: 480 },
  { open: 480, high: 508, low: 478, close: 502 },
  { open: 502, high: 522, low: 498, close: 518 },
  { open: 518, high: 535, low: 505, close: 510 },
  { open: 510, high: 528, low: 495, close: 522 },
  { open: 522, high: 538, low: 512, close: 528 },
  { open: 528, high: 545, low: 518, close: 536 },
  { open: 536, high: 550, low: 525, close: 542 },
  { open: 542, high: 548, low: 518, close: 522 },
  { open: 522, high: 540, low: 515, close: 535 },
  { open: 535, high: 552, low: 528, close: 545 },
  { open: 545, high: 568, low: 540, close: 560 },
  { open: 560, high: 585, low: 555, close: 572 }, // Candle 42 - Sell Signal Peak
  { open: 572, high: 578, low: 538, close: 542 },
  { open: 542, high: 555, low: 532, close: 548 },
  { open: 548, high: 558, low: 530, close: 536 },
  { open: 536, high: 546, low: 522, close: 540 },
  { open: 540, high: 548, low: 512, close: 518 },
  { open: 518, high: 528, low: 488, close: 495 },
  { open: 495, high: 512, low: 462, close: 468 }, // Candle 49 - Sharp Sell Dump & Sweep
  { open: 468, high: 490, low: 460, close: 484 },
  { open: 484, high: 522, low: 480, close: 515 }, // Candle 50 - Buy Signal V-Rally
  { open: 515, high: 538, low: 508, close: 532 },
  { open: 532, high: 552, low: 525, close: 546 },
  { open: 546, high: 562, low: 540, close: 555 },
  { open: 555, high: 570, low: 548, close: 564 },
  { open: 564, high: 572, low: 538, close: 545 },
  { open: 545, high: 555, low: 528, close: 532 },
  { open: 532, high: 542, low: 515, close: 520 },
  { open: 520, high: 528, low: 482, close: 488 }
];

export default function BeforeAfterComparison() {
  const { t } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const isDraggingRef = useRef(false);
  const containerRef = useRef(null);
  const rafId = useRef(null);
  // Handle Drag / Touch Move to update slider position smoothly with 0ms delay
  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percentage);
    });
  }, []);

  const onPointerDown = (e) => {
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) { }
    updatePosition(e.clientX);

    const onWinMove = (moveEvt) => {
      if (isDraggingRef.current) {
        updatePosition(moveEvt.clientX);
      }
    };

    const onWinUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', onWinMove);
      window.removeEventListener('pointerup', onWinUp);
    };

    window.addEventListener('pointermove', onWinMove, { passive: true });
    window.addEventListener('pointerup', onWinUp, { passive: true });
  };

  const onPointerMove = (e) => {
    if (isDraggingRef.current) {
      updatePosition(e.clientX);
    }
  };

  const onPointerUp = (e) => {
    isDraggingRef.current = false;
    try {
      if (e?.currentTarget && e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) { }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Chart dimensions & scaling
  const width = 960;
  const height = 480;
  const padding = { top: 45, bottom: 55, left: 35, right: 185 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minPrice = 390;
  const maxPrice = 600;
  const priceRange = maxPrice - minPrice;

  const priceToY = (val) => {
    return height - padding.bottom - ((val - minPrice) / priceRange) * chartHeight;
  };

  const candleWidth = chartWidth / candlesData.length;
  const currentPrice = candlesData[candlesData.length - 1].close;

  // Gridlines Data (Continuous across full width 0 to 960px and full height)
  const verticalGridLines = Array.from({ length: 25 }, (_, i) => i * (width / 24));
  const horizontalGridLines = [390, 420, 450, 480, 510, 540, 570, 600];

  return (
    <section className={styles.comparisonSection} aria-label="Before vs After Algorithm Comparison">
      <div className="container">

        {/* Standardized Header */}
        <SectionHeader
          badge={t('homeSections.comparison.badge', 'ALGORITHM COMPARISON')}
          title1={t('homeSections.comparison.title1', 'See the Difference.')}
          title2={t('homeSections.comparison.title2', 'Raw Chart vs TraderMaster Algo.')}
          description={t('homeSections.comparison.description', 'Transform noisy raw market price action into institutional trade execution setups. Drag the slider to reveal high-impact AI Buy/Sell signals, liquidity sweeps, and multi-timeframe backtest confluence.')}
        />

        {/* Interactive Comparison Card Container */}
        <div
          className={styles.comparisonCard}
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >

          {/* LAYER 1: BEFORE (Raw Candlestick Chart ONLY) */}
          <div className={styles.layerBefore}>
            <div className={styles.badgeBefore}>{t('homeSections.comparison.before', 'BEFORE')}</div>

            <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart} preserveAspectRatio="none">
              {/* Background Fine Grid Lines */}
              {verticalGridLines.map((x, i) => (
                <line key={`vgrid-before-${i}`} x1={x} y1={0} x2={x} y2={height} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              ))}
              {horizontalGridLines.map((price, i) => (
                <line key={`hgrid-before-${i}`} x1={0} y1={priceToY(price)} x2={width} y2={priceToY(price)} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              ))}

              {/* Current Price Dotted Baseline */}
              <line x1={0} y1={priceToY(currentPrice)} x2={width - padding.right} y2={priceToY(currentPrice)} stroke="#EF5350" strokeDasharray="3 3" strokeWidth="1.2" />

              {/* High-Density Candlesticks Render (Raw Price Action) */}
              {candlesData.map((c, i) => {
                const x = padding.left + i * candleWidth + candleWidth / 2;
                const isBull = c.close >= c.open;
                const color = isBull ? '#26A69A' : '#EF5350';
                const yTop = priceToY(Math.max(c.open, c.close));
                const yBot = priceToY(Math.min(c.open, c.close));
                const hBody = Math.max(2, yBot - yTop);
                const yHigh = priceToY(c.high);
                const yLow = priceToY(c.low);
                const bodyW = Math.max(3.2, candleWidth * 0.68);

                return (
                  <g key={`before-${i}`}>
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.3" />
                    <rect x={x - bodyW / 2} y={yTop} width={bodyW} height={hBody} fill={color} rx="1" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* LAYER 2: AFTER TRADERMASTER ALGO (Full Signals Revealed Across Entire Chart Width) */}
          <div
            className={styles.layerAfter}
            style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
          >
            <div className={styles.badgeAfter}>{t('homeSections.comparison.after', 'TRADERMASTER ALGORITHM')}</div>

            <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart} preserveAspectRatio="none">
              <defs>
                {/* Sell Badge Gradient & Glow */}
                <linearGradient id="sellBadgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#BE123C" />
                </linearGradient>
                <filter id="sellBadgeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#F43F5E" floodOpacity="0.45" />
                </filter>

                {/* Buy Badge Gradient & Glow */}
                <linearGradient id="buyBadgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <filter id="buyBadgeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#10B981" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* Background Fine Grid Lines */}
              {verticalGridLines.map((x, i) => (
                <line key={`vgrid-after-${i}`} x1={x} y1={0} x2={x} y2={height} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              ))}
              {horizontalGridLines.map((price, i) => (
                <line key={`hgrid-after-${i}`} x1={0} y1={priceToY(price)} x2={width} y2={priceToY(price)} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              ))}

              {/* Dotted Level Lines with Volume Labels Across Chart */}
              <line x1={padding.left + 40 * candleWidth} y1={priceToY(576)} x2={width - padding.right + 10} y2={priceToY(576)} stroke="#EF5350" strokeDasharray="3 3" strokeWidth="1.2" />
              <text x={width - padding.right + 15} y={priceToY(576) + 4} fill="#EF5350" fontSize="10" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">576.825K (100%)</text>

              <line x1={padding.left + 40 * candleWidth} y1={priceToY(495)} x2={width - padding.right + 10} y2={priceToY(495)} stroke="#38BDF8" strokeDasharray="3 3" strokeWidth="1.2" />
              <text x={width - padding.right + 15} y={priceToY(495) + 4} fill="#38BDF8" fontSize="10" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">404.007K (77%)</text>

              <line x1={padding.left + 40 * candleWidth} y1={priceToY(462)} x2={width - padding.right + 10} y2={priceToY(462)} stroke="#38BDF8" strokeDasharray="3 3" strokeWidth="1.2" />
              <text x={width - padding.right + 15} y={priceToY(462) + 4} fill="#38BDF8" fontSize="10" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">1.431M (22%)</text>

              {/* Current Price Dotted Baseline */}
              <line x1={0} y1={priceToY(currentPrice)} x2={width - padding.right} y2={priceToY(currentPrice)} stroke="#EF4444" strokeDasharray="3 3" strokeWidth="1.2" />

              {/* High-Density Candlesticks Render (Crisp Green & Red) */}
              {candlesData.map((c, i) => {
                const x = padding.left + i * candleWidth + candleWidth / 2;
                const isBull = c.close >= c.open;
                const color = isBull ? '#26A69A' : '#EF4444';
                const yTop = priceToY(Math.max(c.open, c.close));
                const yBot = priceToY(Math.min(c.open, c.close));
                const hBody = Math.max(2, yBot - yTop);
                const yHigh = priceToY(c.high);
                const yLow = priceToY(c.low);
                const bodyW = Math.max(3.2, candleWidth * 0.68);

                return (
                  <g key={`after-${i}`}>
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.3" />
                    <rect x={x - bodyW / 2} y={yTop} width={bodyW} height={hBody} fill={color} rx="1" />
                  </g>
                );
              })}

              {/* SIGNAL 1 (PEAK 1 SHORT): Sell Signal $545.00 */}
              <g transform={`translate(${padding.left + 2 * candleWidth - 40}, ${priceToY(545) - 40})`} filter="url(#sellBadgeGlow)">
                <rect width="80" height="27" rx="6" fill="url(#sellBadgeGrad)" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="0.8" />
                <polygon points="40,32 35,27 45,27" fill="#BE123C" />
                <text x="40" y="11.5" fill="#FFFFFF" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" letterSpacing="0.6" textAnchor="middle">{t('homeSections.comparison.sellSignal', 'SELL SIGNAL')}</text>
                <text x="40" y="22.5" fill="#A7F3D0" fontSize="9.5" fontFamily="system-ui, -apple-system, monospace" fontWeight="800" textAnchor="middle">$545.00</text>
              </g>
              <line x1={padding.left + 2 * candleWidth} y1={priceToY(472)} x2={padding.left + 8 * candleWidth} y2={priceToY(472)} stroke="#EF5350" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 7.5 * candleWidth} cy={priceToY(472)} r="3.5" fill="#EF5350" />
              <text x={padding.left + 7.5 * candleWidth - 6} y={priceToY(472) - 6} fill="#EF5350" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">TP1</text>

              <line x1={padding.left + 8 * candleWidth} y1={priceToY(430)} x2={padding.left + 16 * candleWidth} y2={priceToY(430)} stroke="#EF5350" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 15.5 * candleWidth} cy={priceToY(430)} r="3.5" fill="#EF5350" />
              <text x={padding.left + 15.5 * candleWidth - 6} y={priceToY(430) + 12} fill="#EF5350" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">TP2</text>

              <circle cx={padding.left + 26 * candleWidth} cy={priceToY(405)} r="3.5" fill="#EF5350" />
              <text x={padding.left + 26 * candleWidth - 6} y={priceToY(405) + 12} fill="#EF5350" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">TP3</text>

              {/* SIGNAL 2 (BOTTOM 1 LONG): Buy Signal $410.00 */}
              <g transform={`translate(${padding.left + 27 * candleWidth - 40}, ${priceToY(410) + 10})`} filter="url(#buyBadgeGlow)">
                <polygon points="40,-5 35,0 45,0" fill="#10B981" />
                <rect width="80" height="27" rx="6" fill="url(#buyBadgeGrad)" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="0.8" />
                <text x="40" y="11.5" fill="#FFFFFF" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" letterSpacing="0.6" textAnchor="middle">{t('homeSections.comparison.buySignal', 'BUY SIGNAL')}</text>
                <text x="40" y="22.5" fill="#E6FFFA" fontSize="9.5" fontFamily="system-ui, -apple-system, monospace" fontWeight="800" textAnchor="middle">$410.00</text>
              </g>

              <line x1={padding.left + 27 * candleWidth} y1={priceToY(500)} x2={padding.left + 32 * candleWidth} y2={priceToY(500)} stroke="#26A69A" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 31.5 * candleWidth} cy={priceToY(500)} r="3.5" fill="#26A69A" />
              <text x={padding.left + 31.5 * candleWidth - 6} y={priceToY(500) - 6} fill="#26A69A" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">TP1</text>

              <line x1={padding.left + 32 * candleWidth} y1={priceToY(542)} x2={padding.left + 37 * candleWidth} y2={priceToY(542)} stroke="#26A69A" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 36.5 * candleWidth} cy={priceToY(542)} r="3.5" fill="#26A69A" />
              <text x={padding.left + 36.5 * candleWidth - 6} y={priceToY(542) - 6} fill="#26A69A" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">TP2</text>

              <line x1={padding.left + 37 * candleWidth} y1={priceToY(576)} x2={padding.left + 42 * candleWidth} y2={priceToY(576)} stroke="#26A69A" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 41.5 * candleWidth} cy={priceToY(576)} r="3.5" fill="#26A69A" />
              <text x={padding.left + 41.5 * candleWidth - 6} y={priceToY(576) - 6} fill="#26A69A" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">TP3</text>

              {/* SIGNAL 3 (TOP PEAK SHORT): Sell Signal $585.00 */}
              <g transform={`translate(${padding.left + 42 * candleWidth - 40}, ${priceToY(585) - 40})`} filter="url(#sellBadgeGlow)">
                <rect width="80" height="27" rx="6" fill="url(#sellBadgeGrad)" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="0.8" />
                <polygon points="40,32 35,27 45,27" fill="#BE123C" />
                <text x="40" y="11.5" fill="#FFFFFF" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" letterSpacing="0.6" textAnchor="middle">{t('homeSections.comparison.sellSignal', 'SELL SIGNAL')}</text>
                <text x="40" y="22.5" fill="#A7F3D0" fontSize="9.5" fontFamily="system-ui, -apple-system, monospace" fontWeight="800" textAnchor="middle">$585.00</text>
              </g>

              <line x1={padding.left + 42 * candleWidth} y1={priceToY(536)} x2={padding.left + 46 * candleWidth} y2={priceToY(536)} stroke="#EF5350" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 45.5 * candleWidth} cy={priceToY(536)} r="3.5" fill="#EF5350" />
              <text x={padding.left + 45.5 * candleWidth - 6} y={priceToY(536) + 12} fill="#EF5350" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">TP1</text>

              <line x1={padding.left + 46 * candleWidth} y1={priceToY(495)} x2={padding.left + 48 * candleWidth} y2={priceToY(495)} stroke="#EF5350" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 47.5 * candleWidth} cy={priceToY(495)} r="3.5" fill="#EF5350" />
              <text x={padding.left + 47.5 * candleWidth - 6} y={priceToY(495) + 12} fill="#EF5350" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">TP2</text>

              {/* SIGNAL 4 (V-REVERSAL LONG): Buy Signal $462.00 */}
              <g transform={`translate(${padding.left + 50 * candleWidth - 40}, ${priceToY(460) + 10})`} filter="url(#buyBadgeGlow)">
                <polygon points="40,-5 35,0 45,0" fill="#10B981" />
                <rect width="80" height="27" rx="6" fill="url(#buyBadgeGrad)" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="0.8" />
                <text x="40" y="11.5" fill="#FFFFFF" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" letterSpacing="0.6" textAnchor="middle">{t('homeSections.comparison.buySignal', 'BUY SIGNAL')}</text>
                <text x="40" y="22.5" fill="#E6FFFA" fontSize="9.5" fontFamily="system-ui, -apple-system, monospace" fontWeight="800" textAnchor="middle">$462.00</text>
              </g>

              <line x1={padding.left + 50 * candleWidth} y1={priceToY(555)} x2={padding.left + 55 * candleWidth} y2={priceToY(555)} stroke="#26A69A" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 54.5 * candleWidth} cy={priceToY(555)} r="3.5" fill="#26A69A" />
              <text x={padding.left + 54.5 * candleWidth - 6} y={priceToY(555) - 6} fill="#26A69A" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">TP1</text>
            </svg>

            {/* MTF Telemetry & Backtest Table HUD Overlay */}
            <div className={styles.mtfHudOverlay}>
              {/* Parameters Table */}
              <div className={styles.hudTableWrapper}>
                <div className={styles.hudTableHeader}>
                  <span>{t('homeSections.comparison.mtf', 'MTF')}</span>
                  <span>{t('homeSections.comparison.parameters', 'Parameters')}</span>
                  <span>{t('homeSections.comparison.data', 'Data')}</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>5M</span>
                  <span>{t('homeSections.comparison.sentimentRange', 'Sentiment Range')}</span>
                  <span className={styles.valGreen}>28.38%</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>M15</span>
                  <span>{t('homeSections.comparison.footprint', 'Footprint')}</span>
                  <span className={styles.valRed}>15.57%</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>M30</span>
                  <span>{t('homeSections.comparison.trendStrength', 'Trend Strength')}</span>
                  <span className={styles.valRed}>19.14%</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>1H</span>
                  <span>{t('homeSections.comparison.condition', 'Condition')}</span>
                  <span className={styles.valRed}>{t('homeSections.comparison.bearish', 'Bearish')}</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>4H</span>
                  <span>{t('homeSections.comparison.optimalSensitivity', 'Optimal Sensitivity')}</span>
                  <span className={styles.valWhite}>2</span>
                </div>
              </div>

              {/* Backtest Win Rate Table */}
              <div className={styles.backtestTable}>
                <div className={styles.btHeader}>{t('homeSections.comparison.backtestTable', 'Backtest Table')}</div>
                <div className={styles.btGrid}>
                  <div>
                    <span className={styles.btLabel}>% TP1</span>
                    <span className={styles.btVal}>78.13%</span>
                  </div>
                  <div>
                    <span className={styles.btLabel}>% TP2</span>
                    <span className={styles.btVal}>65.63%</span>
                  </div>
                  <div>
                    <span className={styles.btLabel}>% TP3</span>
                    <span className={styles.btVal}>50%</span>
                  </div>
                </div>
              </div>

              {/* Trend Strength Meter */}
              <div className={styles.trendStrengthBox}>
                <div className={styles.tsHeader}>
                  <span>{t('homeSections.comparison.trendStrength', 'Trend Strength')}</span>
                  <span className={styles.tsLabel}>{t('homeSections.comparison.bullishMomentum', 'Bullish Momentum')}</span>
                </div>
                <div className={styles.tsMeterBar}>
                  <div className={styles.tsMeterFill} style={{ width: '44.8%' }} />
                </div>
                <span className={styles.tsScore}>0.448</span>
              </div>
            </div>
          </div>

          {/* Central Draggable Slider Bar & Handle */}
          <div
            className={styles.sliderLine}
            style={{ left: `${sliderPos}%` }}
          >
            <div className={styles.sliderHandle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8L22 12L18 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 8L2 12L6 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Drag Pill Badge */}
          <div className={styles.dragBadgePill}>
            <span>{t('homeSections.comparison.dragToCompare', 'Drag to compare')}</span>
          </div>

        </div>

      </div>
    </section>
  );
}
