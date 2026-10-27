"use client";
import React, { useRef, useState } from 'react';
import HeroSection from './components/HeroSection';
import ThreeWaysSection from './components/ThreeWaysSection';
import AiBuilderSection from './components/AiBuilderSection';
import WhyChronosXSection from './components/WhyChronosXSection';
import ComparisonSection from './components/ComparisonSection';
import FaqSection from './components/FaqSection';
import CommonCta from '@/components/commonCta';
import styles from './customBotBuilder.module.scss';

export default function CustomBotBuilderView() {
  const containerRef = useRef(null);
  const aiBuilderRef = useRef(null);
  const comparisonRef = useRef(null);

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

  const scrollToAiBuilder = () => {
    aiBuilderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectWay = (wayId) => {
    if (wayId === 'ai-builder') scrollToAiBuilder();
    else if (wayId === 'custom-builder') scrollToComparison();
  };

  return (
    <div
      ref={containerRef}
      className={styles.pageWrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Atmosphere Glows & Grid */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowCenter} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Interactive Cursor Spotlight */}
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
      <HeroSection
        onStartClick={scrollToAiBuilder}
        onCustomClick={scrollToComparison}
      />

      {/* CONTENT SECTIONS */}
      <div className={styles.contentSections}>
        {/* TWO WAYS TO BUILD */}
        <ThreeWaysSection onSelectWay={handleSelectWay} />

        {/* AI BOT BUILDER */}

        {/* WHY BUILD WITH CHRONOSX? */}
        <WhyChronosXSection />
        <AiBuilderSection refProp={aiBuilderRef} />

        {/* AI VS CUSTOM COMPARISON */}
        <ComparisonSection
          refProp={comparisonRef}
          onAiClick={scrollToAiBuilder}
          onCustomClick={scrollToComparison}
          onStartClick={scrollToAiBuilder}
        />

        {/* SECTION 07 — FAQ ACCORDION */}
        <FaqSection />

        {/* FINAL CTA (COMMON CTA) */}
        <CommonCta
          badge="AI TRADING BOT BUILDER"
          title1="Your Strategy Shouldn't"
          title2="Stay on Paper."
          description="Build it. Test it. Refine it. Turn your trading logic into a bot with ChronosX."
          primaryBtnText="CREATE YOUR FIRST BOT"
          primaryBtnAction={scrollToAiBuilder}
        />
      </div>
    </div>
  );
}
