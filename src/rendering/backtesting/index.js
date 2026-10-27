"use client";
import React, { useRef, useState } from 'react';
import HeroSection from './HeroSection';
import InteractiveSimulator from './InteractiveSimulator';
import FeaturesGrid from './FeaturesGrid';
import FourStepProcess from './FourStepProcess';
import TestYourWay from './TestYourWay';
import FinalCta from './FinalCta';
import CommonCta from '@/components/commonCta';
import styles from './backtesting.module.scss';

export default function BacktestingView() {
  const containerRef = useRef(null);
  const simulatorRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 20, isHovered: false });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y, isHovered: true });
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, isHovered: false }));
  };

  const scrollToSimulator = () => {
    if (simulatorRef.current) {
      simulatorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.backtestingPage}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hero Atmosphere Glows & Grid */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowCenter} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Interactive Cursor Spotlight Glow */}
      <div
        className={styles.interactiveSpotlight}
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          opacity: mousePos.isHovered ? 1 : 0
        }}
        aria-hidden="true"
      />

      {/* 1. HERO BANNER */}
      <HeroSection onStartClick={scrollToSimulator} />

      {/* 2. CONTENT SECTIONS */}
      <div className={styles.contentSections}>
        <div className={styles.ambientGlowBottom} aria-hidden="true" />

        <InteractiveSimulator refProp={simulatorRef} />
        <FeaturesGrid />
        <FourStepProcess onCtaClick={scrollToSimulator} />
        <TestYourWay />
        <FinalCta />
        <CommonCta
          badge="INSTANT ALGORITHMIC ACCESS"
          title1="Ready to Backtest &"
          title2="Optimize Your Trading Setup?"
          description="Experience institutional-grade backtesting, tick data precision, and real-time performance analytics in just minutes."
          primaryBtnText="START BACKTESTING NOW"
          primaryBtnAction="/dashboard"
        />
      </div>
    </div>
  );
}
