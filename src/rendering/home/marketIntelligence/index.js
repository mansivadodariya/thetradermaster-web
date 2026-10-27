"use client";
import { useLanguage } from '@/context/LanguageContext';
import React, { useState, useEffect, useRef } from 'react';
import styles from './marketIntelligence.module.scss';
import SectionHeader from '@/components/sectionHeader';

export default function MarketIntelligence() {
  const { t } = useLanguage();
  const [flippedCards, setFlippedCards] = useState({ 0: false, 1: false, 2: false });
  
  const canvas1Ref = useRef(null);
  const canvas2Ref = useRef(null);
  const canvas3Ref = useRef(null);

  // ----------------------------------------------------
  // CANVAS 1: MULTI-TIMEFRAME (Exact Quant Algo Engine)
  // ----------------------------------------------------
  useEffect(() => {
    const cv = canvas1Ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let animationId;
    let visible = false;

    function wave(x, a, f, p) {
      return Math.sin(x * f + p) * a;
    }

    function draw(t) {
      if (!visible || document.hidden) return;
      const rect = cv.getBoundingClientRect();
      const W = rect.width || 352;
      const H = rect.height || 258;
      const MY = H / 2;
      const dpr = Math.min(window.devicePixelRatio || 2, 2);

      if (cv.width !== W * dpr || cv.height !== H * dpr) {
        cv.width = W * dpr;
        cv.height = H * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light');

      const tfs = isLight ? [
        { c: "rgba(4, 120, 87, 0.95)", a: H * 0.28, f: 0.015, lw: 2.5, l: "4H" },
        { c: "rgba(16, 185, 129, 0.85)", a: H * 0.18, f: 0.035, lw: 1.8, l: "1H" },
        { c: "rgba(5, 150, 105, 0.65)", a: H * 0.1, f: 0.07, lw: 1.2, l: "15m" }
      ] : [
        { c: "rgba(24,201,139,0.9)", a: H * 0.28, f: 0.015, lw: 2.5, l: "4H" },
        { c: "rgba(110,231,183,0.75)", a: H * 0.18, f: 0.035, lw: 1.8, l: "1H" },
        { c: "rgba(24,201,139,0.5)", a: H * 0.1, f: 0.07, lw: 1.2, l: "15m" }
      ];

      tfs.forEach((tf, i) => {
        ctx.beginPath();
        ctx.strokeStyle = tf.c;
        ctx.lineWidth = tf.lw;
        for (let x = 0; x < W; x++) {
          const y = MY + wave(x, tf.a, tf.f, t * 8e-4 * (i + 1)) + wave(x, tf.a * 0.3, tf.f * 2.5, -t * 5e-4);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      const azX = W * 0.62 + Math.sin(t * 0.001) * 20;
      ctx.fillStyle = isLight ? "rgba(24,201,139,0.12)" : "rgba(24,201,139,0.08)";
      ctx.fillRect(azX - 20, 0, 40, H);
      ctx.strokeStyle = isLight ? "rgba(4, 120, 87, 0.35)" : "rgba(24,201,139,0.25)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(azX, 0);
      ctx.lineTo(azX, H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isLight ? "rgba(4, 120, 87, 0.9)" : "rgba(110,231,183,0.85)";
      ctx.beginPath();
      ctx.moveTo(azX, MY - 30);
      ctx.lineTo(azX - 8, MY - 15);
      ctx.lineTo(azX + 8, MY - 15);
      ctx.fill();

      ctx.font = '700 9px system-ui, -apple-system, sans-serif';
      tfs.forEach((tf, i) => {
        ctx.fillStyle = tf.c;
        ctx.fillText(tf.l, 8, 18 + i * 14);
      });

      ctx.restore();

      if (visible && !document.hidden) {
        animationId = requestAnimationFrame(draw);
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(draw);
      } else {
        if (animationId) cancelAnimationFrame(animationId);
      }
    }, { threshold: 0.05 });

    observer.observe(cv);

    return () => {
      observer.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  // ----------------------------------------------------
  // CANVAS 2: ORDER FLOW (Exact Quant Algo Engine)
  // ----------------------------------------------------
  useEffect(() => {
    const cv = canvas2Ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let animationId;
    let visible = false;

    const N = 50;
    const candles = [];
    const baseH = 258;
    let price = baseH * 0.5;

    // Seed deterministic or realistic candle series
    for (let i = 0; i < N; i++) {
      const dir = (Math.sin(i * 1.7) > -0.1) ? 1 : -1;
      const body = (Math.sin(i * 3.4) * 0.5 + 0.5) * 12 + 3;
      const wick = (Math.cos(i * 2.1) * 0.5 + 0.5) * 8 + 2;
      const o = price;
      const c = price + dir * body;
      const h = Math.max(o, c) + wick;
      const l = Math.min(o, c) - wick;
      candles.push({ o, c, h, l, bull: dir > 0 });
      price = c + Math.sin(i * 0.8) * 4.5;
      price = Math.max(baseH * 0.18, Math.min(baseH * 0.82, price));
    }

    const zones = [
      { y: baseH * 0.25, h: 18, col: "rgba(24,201,139,0.1)", bor: "rgba(24,201,139,0.3)", x1: 3, x2: 18 },
      { y: baseH * 0.58, h: 14, col: "rgba(110,231,183,0.06)", bor: "rgba(110,231,183,0.2)", x1: 12, x2: 30 },
      { y: baseH * 0.72, h: 20, col: "rgba(24,201,139,0.07)", bor: "rgba(24,201,139,0.2)", x1: 25, x2: 45 }
    ];

    function draw(t) {
      if (!visible || document.hidden) return;
      const rect = cv.getBoundingClientRect();
      const W = rect.width || 352;
      const H = rect.height || 258;
      const dpr = Math.min(window.devicePixelRatio || 2, 2);

      if (cv.width !== W * dpr || cv.height !== H * dpr) {
        cv.width = W * dpr;
        cv.height = H * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light');
      const cw = (W - 10) / N;

      const dynamicZones = isLight ? [
        { y: baseH * 0.25, h: 18, col: "rgba(16,185,129,0.12)", bor: "rgba(16,185,129,0.35)", x1: 3, x2: 18 },
        { y: baseH * 0.58, h: 14, col: "rgba(16,185,129,0.08)", bor: "rgba(16,185,129,0.25)", x1: 12, x2: 30 },
        { y: baseH * 0.72, h: 20, col: "rgba(16,185,129,0.1)", bor: "rgba(16,185,129,0.3)", x1: 25, x2: 45 }
      ] : zones;

      dynamicZones.forEach((z) => {
        const x1 = z.x1 * cw + 5;
        const x2 = z.x2 * cw + 5;
        ctx.fillStyle = z.col;
        ctx.fillRect(x1, z.y, x2 - x1, z.h);
        ctx.strokeStyle = z.bor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x1, z.y, x2 - x1, z.h);
      });

      ctx.strokeStyle = isLight ? "rgba(225,29,72,0.35)" : "rgba(255,77,106,0.25)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, H * 0.15);
      ctx.lineTo(W, H * 0.15);
      ctx.stroke();
      ctx.setLineDash([]);

      candles.forEach((c, i) => {
        const x = i * cw + 5 + cw / 2;
        const color = isLight
          ? (c.bull ? "rgba(5,150,105,0.9)" : "rgba(225,29,72,0.85)")
          : (c.bull ? "rgba(0,214,143,0.8)" : "rgba(255,77,106,0.8)");
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x, c.h);
        ctx.lineTo(x, c.l);
        ctx.stroke();

        ctx.fillStyle = color;
        const top = Math.min(c.o, c.c);
        const bh = Math.abs(c.c - c.o);
        ctx.fillRect(x - cw * 0.35, top, cw * 0.7, Math.max(bh, 1));
      });

      [8, 22, 38].forEach((si, idx) => {
        const c = candles[si];
        if (!c) return;
        const x = si * cw + 5 + cw / 2;
        const y = c.bull ? c.l - 8 : c.h + 8;
        const col = isLight
          ? (c.bull ? "rgba(4,120,87,1)" : "rgba(24,201,139,0.95)")
          : (c.bull ? "rgba(24,201,139,0.95)" : "rgba(255,77,106,0.9)");
        const glow = isLight
          ? (c.bull ? "rgba(16,185,129,0.25)" : "rgba(225,29,72,0.25)")
          : (c.bull ? "rgba(24,201,139,0.3)" : "rgba(255,77,106,0.3)");
        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.sin(t * 0.003 + idx), 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 6 + Math.sin(t * 0.003 + idx) * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      });

      ctx.restore();

      if (visible && !document.hidden) {
        animationId = requestAnimationFrame(draw);
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(draw);
      } else {
        if (animationId) cancelAnimationFrame(animationId);
      }
    }, { threshold: 0.05 });

    observer.observe(cv);

    return () => {
      observer.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  // ----------------------------------------------------
  // CANVAS 3: SIGNAL FILTER (Exact Quant Algo Engine)
  // ----------------------------------------------------
  useEffect(() => {
    const cv = canvas3Ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let animationId;
    let visible = false;

    function draw(t) {
      if (!visible || document.hidden) return;
      const rect = cv.getBoundingClientRect();
      const W = rect.width || 352;
      const H = rect.height || 258;
      const MY = H / 2;
      const dpr = Math.min(window.devicePixelRatio || 2, 2);

      if (cv.width !== W * dpr || cv.height !== H * dpr) {
        cv.width = W * dpr;
        cv.height = H * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light');

      ctx.fillStyle = isLight ? "rgba(225,29,72,0.06)" : "rgba(255,77,106,0.04)";
      ctx.fillRect(0, 0, W, H * 0.2);
      ctx.fillStyle = isLight ? "rgba(16,185,129,0.08)" : "rgba(24,201,139,0.05)";
      ctx.fillRect(0, H * 0.8, W, H * 0.2);

      ctx.strokeStyle = isLight ? "rgba(225,29,72,0.25)" : "rgba(255,77,106,0.15)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, H * 0.2);
      ctx.lineTo(W, H * 0.2);
      ctx.stroke();

      ctx.strokeStyle = isLight ? "rgba(16,185,129,0.3)" : "rgba(24,201,139,0.2)";
      ctx.beginPath();
      ctx.moveTo(0, H * 0.8);
      ctx.lineTo(W, H * 0.8);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.strokeStyle = isLight ? "rgba(15,23,42,0.1)" : "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.moveTo(0, MY);
      ctx.lineTo(W, MY);
      ctx.stroke();

      // Fast Wave (Green)
      ctx.beginPath();
      ctx.strokeStyle = isLight ? "rgba(4,120,87,0.95)" : "rgba(24,201,139,0.9)";
      ctx.lineWidth = 2;
      for (let x = 0; x < W; x++) {
        const y = MY + Math.sin(x * 0.025 + t * 0.001) * H * 0.35 + Math.sin(x * 0.06 - t * 5e-4) * H * 0.1;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Slow Wave (Mint)
      ctx.beginPath();
      ctx.strokeStyle = isLight ? "rgba(16,185,129,0.85)" : "rgba(110, 231, 183, 0.75)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x < W; x++) {
        const y = MY + Math.sin((x - 8) * 0.025 + t * 0.001) * H * 0.35 + Math.sin((x - 8) * 0.06 - t * 5e-4) * H * 0.1;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Synchronized Volume Squeeze Histogram Bars
      for (let x = 0; x < W; x += 3) {
        const val = Math.sin(x * 0.025 + t * 0.001) * H * 0.35 + Math.sin(x * 0.06 - t * 5e-4) * H * 0.1;
        ctx.fillStyle = isLight
          ? (val > 0 ? "rgba(225,29,72,0.3)" : "rgba(16,185,129,0.35)")
          : (val > 0 ? "rgba(255,77,106,0.25)" : "rgba(24,201,139,0.28)");
        ctx.fillRect(x, MY, 2, val * 0.3);
      }

      // Reversal Signal Dots
      for (let x = 1; x < W; x++) {
        const m = Math.sin(x * 0.025 + t * 0.001) * H * 0.35;
        const s = Math.sin((x - 8) * 0.025 + t * 0.001) * H * 0.35;
        const pm = Math.sin((x - 1) * 0.025 + t * 0.001) * H * 0.35;
        const ps = Math.sin((x - 9) * 0.025 + t * 0.001) * H * 0.35;

        if (pm <= ps && m > s && MY + m > MY + H * 0.2) {
          ctx.beginPath();
          ctx.arc(x, MY + m, 4 + Math.sin(t * 0.004), 0, Math.PI * 2);
          ctx.fillStyle = isLight ? "rgba(225,29,72,1)" : "rgba(255,77,106,0.9)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, MY + m, 8, 0, Math.PI * 2);
          ctx.fillStyle = isLight ? "rgba(225,29,72,0.25)" : "rgba(255,77,106,0.3)";
          ctx.fill();
        }
        if (pm >= ps && m < s && MY + m < MY - H * 0.2) {
          ctx.beginPath();
          ctx.arc(x, MY + m, 4 + Math.sin(t * 0.004), 0, Math.PI * 2);
          ctx.fillStyle = isLight ? "rgba(4,120,87,1)" : "rgba(24,201,139,0.95)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, MY + m, 8, 0, Math.PI * 2);
          ctx.fillStyle = isLight ? "rgba(16,185,129,0.25)" : "rgba(24,201,139,0.3)";
          ctx.fill();
        }
      }

      ctx.font = '700 8px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = isLight ? "rgba(225,29,72,0.7)" : "rgba(255,77,106,0.35)";
      ctx.fillText("OVERBOUGHT", 8, H * 0.2 - 4);
      ctx.fillStyle = isLight ? "rgba(4,120,87,0.75)" : "rgba(24,201,139,0.4)";
      ctx.fillText("OVERSOLD", 8, H * 0.8 + 12);

      ctx.restore();

      if (visible && !document.hidden) {
        animationId = requestAnimationFrame(draw);
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(draw);
      } else {
        if (animationId) cancelAnimationFrame(animationId);
      }
    }, { threshold: 0.05 });

    observer.observe(cv);

    return () => {
      observer.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className={styles.intelligenceSection} aria-label="Three layers of market intelligence">
      <div className="container">

        {/* Section Header */}
        <SectionHeader
          badge={t('homeSections.marketIntelligence.badge', 'TRADERMASTER CORE ENGINE')}
          title1={t('homeSections.marketIntelligence.title1', 'Three Layers of Market')}
          title2={t('homeSections.marketIntelligence.title2', 'Intelligence.')}
          description={t('homeSections.marketIntelligence.description', 'TraderMaster stacks multi-timeframe trend alignment, smart money liquidity flow, and AI execution filters into one synchronized institutional engine.')}
        />

        {/* 3-Column Interactive Moving Cards with Hover Flip */}
        <div className={styles.layersGrid}>

          {/* CARD 1: MULTI-TIMEFRAME · TRADERMASTER AI */}
          <div 
            className={styles.cardContainer} 
            onMouseEnter={() => setFlippedCards(prev => ({ ...prev, 0: true }))}
            onMouseLeave={() => setFlippedCards(prev => ({ ...prev, 0: false }))}
          >
            <div className={`${styles.cardInner} ${flippedCards[0] ? styles.flipped : ''}`}>

              {/* FRONT: Live Canvas 1 (fc1c) */}
              <div className={styles.cardFace}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalTitle}>{t('homeSections.marketIntelligence.card1Title', 'MULTI-TIMEFRAME · TRADERMASTER AI')}</span>
                  <div className={styles.liveBadge}>
                    <span className={styles.liveDot}></span>
                    <span>{t('homeSections.marketIntelligence.live', 'LIVE')}</span>
                  </div>
                </div>

                <div className={styles.chartStage}>
                  <canvas id="fc1c" ref={canvas1Ref} className={styles.canvasElement} />
                </div>

                <div className={styles.terminalFooter}>
                  <span className={styles.footLeft}>4H • 1H • 15M</span>
                  <span className={styles.footRight}>
                    {t('homeSections.marketIntelligence.alignedBullish', '▲ ALIGNED BULLISH')}
                  </span>
                </div>
              </div>

              {/* BACK: Deep Specifications */}
              <div className={`${styles.cardFace} ${styles.cardBack}`}>
                <div className={styles.backHeader}>
                  <span className={styles.backLayerTag}>{t('homeSections.marketIntelligence.layer1Tag', 'LAYER 01 — TIMEFRAME CONFLUENCE')}</span>
                  <span className={styles.flipHint}>{t('homeSections.marketIntelligence.hoverPreview', 'Hover to preview')}</span>
                </div>

                <h3 className={styles.backTitle}>{t('homeSections.marketIntelligence.card1BackTitle', 'Multi-Timeframe Trend Cascade')}</h3>
                <p className={styles.backDesc}>
                  {t('homeSections.marketIntelligence.card1BackDesc', 'Simultaneously cross-examines 15m, 1H, 4H, and Daily market cycles in real time. Eliminates counter-trend fakeouts by requiring macro trend alignment before confirming any setup.')}
                </p>

                <div className={styles.specList}>
                  <div className={styles.specItem}>
                    <span className={styles.specDot}>✦</span>
                    <span>{t('homeSections.marketIntelligence.card1Spec1', '4-Timeframe Cascade Structure Sync (15M / 1H / 4H / 1D)')}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specDot}>✦</span>
                    <span>{t('homeSections.marketIntelligence.card1Spec2', '100% Non-Repainting Confirmation Engine')}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specDot}>✦</span>
                    <span>{t('homeSections.marketIntelligence.card1Spec3', 'False-Breakout Noise Rejection Filter')}</span>
                  </div>
                </div>

                <div className={styles.backFooter}>
                  <span className={styles.metricTitle}>{t('homeSections.marketIntelligence.card1MetricTitle', 'Confluence Rating')}</span>
                  <span className={styles.metricValue}>{t('homeSections.marketIntelligence.card1MetricVal', '94.8% ALIGNMENT RATING')}</span>
                </div>
              </div>

            </div>
          </div>


          {/* CARD 2: ORDER FLOW · TRADESNAP AI */}
          <div 
            className={styles.cardContainer} 
            onMouseEnter={() => setFlippedCards(prev => ({ ...prev, 1: true }))}
            onMouseLeave={() => setFlippedCards(prev => ({ ...prev, 1: false }))}
          >
            <div className={`${styles.cardInner} ${flippedCards[1] ? styles.flipped : ''}`}>

              {/* FRONT: Live Canvas 2 (fc2c) */}
              <div className={styles.cardFace}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalTitle}>{t('homeSections.marketIntelligence.card2Title', 'ORDER FLOW · TRADESNAP AI')}</span>
                  <div className={styles.liveBadge}>
                    <span className={styles.liveDot}></span>
                    <span>{t('homeSections.marketIntelligence.live', 'LIVE')}</span>
                  </div>
                </div>

                <div className={styles.chartStage}>
                  <canvas id="fc2c" ref={canvas2Ref} className={styles.canvasElement} />
                </div>

                <div className={styles.terminalFooter}>
                  <span className={styles.footLeft}>XAU/USD · 4H</span>
                  <div className={styles.legendGroup}>
                    <span className={styles.legOb}>■ OB</span>
                    <span className={styles.legFvg}>■ FVG</span>
                    <span className={styles.legLiq}>■ Liquidity</span>
                  </div>
                </div>
              </div>

              {/* BACK: Deep Specifications */}
              <div className={`${styles.cardFace} ${styles.cardBack}`}>
                <div className={styles.backHeader}>
                  <span className={styles.backLayerTag}>{t('homeSections.marketIntelligence.layer2Tag', 'LAYER 02 — SMART MONEY FLOW')}</span>
                  <span className={styles.flipHint}>{t('homeSections.marketIntelligence.hoverPreview', 'Hover to preview')}</span>
                </div>

                <h3 className={styles.backTitle}>{t('homeSections.marketIntelligence.card2BackTitle', 'Institutional Order Flow & Liquidity')}</h3>
                <p className={styles.backDesc}>
                  {t('homeSections.marketIntelligence.card2BackDesc', 'Tracks institutional accumulation, liquidity stop-runs, and algorithmic price imbalances. Identifies high-conviction Order Blocks (OB) and Fair Value Gaps (FVG) where institutions step in.')}
                </p>

                <div className={styles.specList}>
                  <div className={styles.specItem}>
                    <span className={styles.specDot}>✦</span>
                    <span>{t('homeSections.marketIntelligence.card2Spec1', 'Graded Institutional Order Block (OB) Validation')}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specDot}>✦</span>
                    <span>{t('homeSections.marketIntelligence.card2Spec2', 'Fair Value Gap (FVG) Mitigation Detection')}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specDot}>✦</span>
                    <span>{t('homeSections.marketIntelligence.card2Spec3', 'Liquidity Sweep & Stop-Hunt Tracking')}</span>
                  </div>
                </div>

                <div className={styles.backFooter}>
                  <span className={styles.metricTitle}>{t('homeSections.marketIntelligence.card2MetricTitle', 'OB Reversal Strength')}</span>
                  <span className={styles.metricValue}>{t('homeSections.marketIntelligence.card2MetricVal', 'GRADE AAA (94.2%)')}</span>
                </div>
              </div>

            </div>
          </div>


          {/* CARD 3: SIGNAL FILTER · TRADERMASTER PRO */}
          <div 
            className={styles.cardContainer} 
            onMouseEnter={() => setFlippedCards(prev => ({ ...prev, 2: true }))}
            onMouseLeave={() => setFlippedCards(prev => ({ ...prev, 2: false }))}
          >
            <div className={`${styles.cardInner} ${flippedCards[2] ? styles.flipped : ''}`}>

              {/* FRONT: Live Canvas 3 (fc3c) */}
              <div className={styles.cardFace}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalTitle}>{t('homeSections.marketIntelligence.card3Title', 'SIGNAL FILTER · TRADERMASTER PRO')}</span>
                  <div className={styles.liveBadge}>
                    <span className={styles.liveDot}></span>
                    <span>{t('homeSections.marketIntelligence.live', 'LIVE')}</span>
                  </div>
                </div>

                <div className={styles.chartStage}>
                  <canvas id="fc3c" ref={canvas3Ref} className={styles.canvasElement} />
                </div>

                <div className={styles.terminalFooter}>
                  <span className={styles.footLeft}>WaveTrend + Squeeze Pro</span>
                  <span className={`${styles.footRight} ${styles.buySignal}`}>
                    {t('homeSections.marketIntelligence.buySignal', '● BUY SIGNAL')}
                  </span>
                </div>
              </div>

              {/* BACK: Deep Specifications */}
              <div className={`${styles.cardFace} ${styles.cardBack}`}>
                <div className={styles.backHeader}>
                  <span className={styles.backLayerTag}>{t('homeSections.marketIntelligence.layer3Tag', 'LAYER 03 — EXECUTION TIMING')}</span>
                  <span className={styles.flipHint}>{t('homeSections.marketIntelligence.hoverPreview', 'Hover to preview')}</span>
                </div>

                <h3 className={styles.backTitle}>{t('homeSections.marketIntelligence.card3BackTitle', 'Momentum & Volumetric Squeeze')}</h3>
                <p className={styles.backDesc}>
                  {t('homeSections.marketIntelligence.card3BackDesc', 'Monitors momentum exhaustion, volatility expansion bands, and real-time volume pulses to pinpoint optimal entry timing with asymmetric risk-to-reward.')}
                </p>

                <div className={styles.specList}>
                  <div className={styles.specItem}>
                    <span className={styles.specDot}>✦</span>
                    <span>{t('homeSections.marketIntelligence.card3Spec1', 'Dynamic Volatility Squeeze Bands (Expansion / Compression)')}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specDot}>✦</span>
                    <span>{t('homeSections.marketIntelligence.card3Spec2', 'Institutional Volume Pulse Engine')}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specDot}>✦</span>
                    <span>{t('homeSections.marketIntelligence.card3Spec3', 'Automated TP/SL Mapping with Minimum 1:2.5+ R:R Filter')}</span>
                  </div>
                </div>

                <div className={styles.backFooter}>
                  <span className={styles.metricTitle}>{t('homeSections.marketIntelligence.card3MetricTitle', 'Target Risk-to-Reward')}</span>
                  <span className={styles.metricValue}>{t('homeSections.marketIntelligence.card3MetricVal', '2.85 : 1 AVG R:R')}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
