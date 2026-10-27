"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from './animatedAreaChart.module.scss';
import classNames from 'classnames';
import { useLanguage } from '@/context/LanguageContext';

export default function AnimatedAreaChart({

  height = 440,
  isBackground = false,
  dataPoints = [
    { x: 0, y: 280, label: "00:00", val: "2,741.20" },
    { x: 45, y: 180, label: "01:00", val: "2,752.80" },
    { x: 75, y: 240, label: "02:00", val: "2,743.40" },
    { x: 140, y: 170, label: "03:30", val: "2,755.10" },
    { x: 220, y: 190, label: "05:00", val: "2,750.50" },
    { x: 380, y: 70,  label: "07:00", val: "2,788.10" },
    { x: 580, y: 320, label: "09:30", val: "2,725.90" },
    { x: 650, y: 250, label: "11:00", val: "2,742.30" },
    { x: 700, y: 220, label: "12:00", val: "2,748.00" },
    { x: 730, y: 240, label: "12:30", val: "2,744.50" },
    { x: 800, y: 220, label: "14:00", val: "2,748.20" },
    { x: 860, y: 270, label: "15:00", val: "2,735.80" },
    { x: 900, y: 320, label: "16:00", val: "2,725.10" },
    { x: 930, y: 290, label: "16:30", val: "2,732.00" },
    { x: 965, y: 140, label: "17:30", val: "2,780.00" },
    { x: 1020, y: 380, label: "18:30", val: "2,710.90" },
    { x: 1180, y: 180, label: "20:00", val: "2,768.40" },
    { x: 1250, y: 280, label: "21:00", val: "2,735.00" },
    { x: 1300, y: 220, label: "21:45", val: "2,752.10" },
    { x: 1350, y: 310, label: "22:15", val: "2,728.40" },
    { x: 1420, y: 30,  label: "23:00", val: "2,810.10" },
    { x: 1490, y: 200, label: "23:30", val: "2,756.40" },
    { x: 1540, y: 360, label: "23:45", val: "2,718.00" },
    { x: 1600, y: 420, label: "LIVE",  val: "2,705.50" }
  ],
  disableAnimations = false
}) {
  const svgRef = useRef(null);
  const { t } = useLanguage();
  const [activePoint, setActivePoint] = useState({
    x: 965,
    y: 140,
    val: "2,780.00",
    label: "17:30",
    visible: true
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldDisableAnimations = prefersReducedMotion || disableAnimations;

  // Construct SVG Path String (Line & Area Fill)
  const linePath = dataPoints.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  const areaPath = `${linePath} L ${dataPoints[dataPoints.length - 1].x} ${height} L ${dataPoints[0].x} ${height} Z`;

  // Handle Mouse Move for Fancy Glowing Pointer Tracking
  const handleMouseMove = (e) => {
    if (!svgRef.current || shouldDisableAnimations) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 1600;

    // Find closest point in dataPoints array
    let closest = dataPoints[0];
    let minDiff = Math.abs(dataPoints[0].x - mouseX);

    for (let i = 1; i < dataPoints.length; i++) {
      const diff = Math.abs(dataPoints[i].x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = dataPoints[i];
      }
    }

    setActivePoint({
      x: closest.x,
      y: closest.y,
      val: closest.val,
      label: closest.label,
      visible: true
    });
  };

  const handleMouseLeave = () => {
    if (shouldDisableAnimations) return;
    setActivePoint(prev => ({ ...prev, x: 1400, y: 30, val: "2,810.10", label: "22:30" }));
  };

  // Build shimmer gradient - only include animate elements if animations enabled
  const shimmerGradientStops = shouldDisableAnimations ? (
    <>
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
      <stop offset="30%" stopColor="#18c98b" stopOpacity="0.9" />
      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
      <stop offset="70%" stopColor="#18c98b" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
    </>
  ) : (
    <>
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15">
        <animate
          attributeName="offset"
          values="-1; 1"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </stop>
      <stop offset="30%" stopColor="#18c98b" stopOpacity="0.9">
        <animate
          attributeName="offset"
          values="-0.7; 1.3"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </stop>
      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9">
        <animate
          attributeName="offset"
          values="-0.5; 1.5"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </stop>
      <stop offset="70%" stopColor="#18c98b" stopOpacity="0.9">
        <animate
          attributeName="offset"
          values="-0.3; 1.7"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </stop>
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15">
        <animate
          attributeName="offset"
          values="0; 2"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </stop>
    </>
  );

  return (
    <div className={classNames(styles.chartContainer, isBackground ? styles.bgMode : "")}>
      {!isBackground && <div className={styles.gridBackground} />}
      {!isBackground && <div className={styles.ambientGlow} />}

      {/* Floating Live Tooltip Card (Only in regular mode) */}
      {!isBackground && (
        <div className={styles.tooltipCard}>
          <div className={styles.badgeLive}>
            <span className={styles.dot} />
            <span>{t('components.chart.realTimeEngine', 'REAL-TIME ENGINE')}</span>
          </div>
          <div className={styles.tooltipDivider} />
          <div className={styles.tooltipItem}>
            <span className={styles.label}>{t('components.chart.aiAccuracy', 'AI ACCURACY')}</span>
          </div>
          <div className={styles.tooltipDivider} />
          <div className={styles.tooltipItem}>
            <span className={styles.label}>{t('components.chart.currentPrice', 'CURRENT PRICE')}</span>
          </div>
          <div className={styles.tooltipDivider} />
          <div className={styles.tooltipItem}>
            <span className={styles.label}>{t('components.chart.timeframe', 'TIMEFRAME')}</span>
          </div>
        </div>
      )}

      {/* Main SVG Vector Area Chart */}
      <div className={styles.svgWrapper}>
        <svg
          ref={svgRef}
          className={styles.chartSvg}
          viewBox={`0 0 1600 ${height}`}
          preserveAspectRatio="none"
          onMouseMove={!isBackground && !shouldDisableAnimations ? handleMouseMove : undefined}
          onMouseLeave={!isBackground && !shouldDisableAnimations ? handleMouseLeave : undefined}
          style={shouldDisableAnimations ? { animation: 'none' } : {}}
        >
          <defs>
            {/* Area Fill Mint Gradient */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18c98b" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#18c98b" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#18c98b" stopOpacity="0.0" />
            </linearGradient>

            {/* Dynamic Fading Line Gradient (Fades softly in valleys, bright at peaks) */}
            <linearGradient id="fadeLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18c98b" stopOpacity="0.3" />
              <stop offset="3%" stopColor="#18c98b" stopOpacity="0.95" />
              <stop offset="6%" stopColor="#18c98b" stopOpacity="0.2" />
              <stop offset="11%" stopColor="#18c98b" stopOpacity="0.8" />
              <stop offset="18%" stopColor="#18c98b" stopOpacity="0.35" />
              <stop offset="24%" stopColor="#18c98b" stopOpacity="1" />
              <stop offset="36%" stopColor="#18c98b" stopOpacity="0.12" />
              <stop offset="43%" stopColor="#18c98b" stopOpacity="0.65" />
              <stop offset="52%" stopColor="#18c98b" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#18c98b" stopOpacity="1" />
              <stop offset="68%" stopColor="#18c98b" stopOpacity="0.08" />
              <stop offset="78%" stopColor="#18c98b" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#18c98b" stopOpacity="0.15" />
              <stop offset="89%" stopColor="#18c98b" stopOpacity="1" />
              <stop offset="95%" stopColor="#18c98b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#18c98b" stopOpacity="0.05" />
            </linearGradient>

            {/* Continuous Shimmer Gradient along stroke path */}
            <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {shimmerGradientStops}
            </linearGradient>
          </defs>

          {/* Area Fill under chart */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />

          {/* Base Vector Line with Dynamic Fading & Entrance path draw animation */}
          <path
            d={linePath}
            className={`${styles.chartPathBase} ${shouldDisableAnimations ? '' : styles.chartPathEntrance}`}
          />

          {/* Continuous Moving Shimmer Layer */}
          <path
            d={linePath}
            className={shouldDisableAnimations ? styles.chartPathBase : styles.chartPathShimmer}
          />
        </svg>
      </div>
    </div>
  );
}
