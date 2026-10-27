"use client";
import React, { useRef, useState } from 'react';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import TiersSection from './TiersSection';
import ReferralLinkWidget from './ReferralLinkWidget';
import WhyJoinSection from './WhyJoinSection';
import StatsSection from './StatsSection';
import TestimonialsSection from './TestimonialsSection';
import FaqSection from './FaqSection';
import FinalCta from './FinalCta';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './publicAffiliate.module.scss';

export default function PublicAffiliateView() {
  const router = useRouter();
  const containerRef = useRef(null);
  const howItWorksRef = useRef(null);
  const tiersRef = useRef(null);

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

  const handleJoinClick = () => {
    authNavigate(router, '/affiliate');
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTiers = () => {
    tiersRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        onJoinClick={handleJoinClick}
        onHowItWorksClick={scrollToHowItWorks}
      />

      {/* CONTENT SECTIONS */}
      <div className={styles.contentSections}>
        {/* 2. HOW IT WORKS */}
        <HowItWorksSection
          refProp={howItWorksRef}
          onJoinClick={handleJoinClick}
        />

        {/* 3. COMMISSION & TIERS */}
        <TiersSection
          refProp={tiersRef}
          onJoinClick={handleJoinClick}
        />

        {/* 4. YOUR REFERRAL LINK WIDGET */}
        <ReferralLinkWidget />

        {/* 5. WHY JOIN */}
        <WhyJoinSection />

        {/* 6. STATS SECTION */}
        <StatsSection />

        {/* 7. TESTIMONIALS */}
        <TestimonialsSection />

        {/* 8. FAQ */}
        <FaqSection />
      </div>

      {/* 9. FINAL CTA (Common CTA) */}
      <FinalCta
        onJoinClick={handleJoinClick}
        onTiersClick={scrollToTiers}
      />
    </div>
  );
}
