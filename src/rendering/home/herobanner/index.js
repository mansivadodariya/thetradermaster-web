"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';
import styles from './herobanner.module.scss';
import Button from '@/components/button';
import CandlesticksIcon from './CandlesticksIcon';
import HeroSideDots from './HeroSideDots';
import HeroSlopeLasers from './HeroSlopeLasers';
import HeroFeatureCards from './HeroFeatureCards';
import HeroTickerMarquee from './HeroTickerMarquee';

const RightArrow = '/assets/icons/right.svg';

export default function Herobanner() {
  const router = useRouter();
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  // Scroll Progress Driven Motion Animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25]);

  const rafRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (((clientX - rect.left) / rect.width) * 100).toFixed(2);
      const y = (((clientY - rect.top) / rect.height) * 100).toFixed(2);
      sectionRef.current.style.setProperty('--mouse-x', `${x}%`);
      sectionRef.current.style.setProperty('--mouse-y', `${y}%`);
      sectionRef.current.style.setProperty('--mouse-opacity', '1');
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (sectionRef.current) {
      sectionRef.current.style.setProperty('--mouse-opacity', '0');
    }
  };

  return (
    <section
      ref={sectionRef}
      className={styles.herobanner}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Side Animation Dots on Both Sides */}
      <HeroSideDots />

      {/* Animated Slope Laser Lines on Perspective Candlestick Slopes */}
      <HeroSlopeLasers />

      {/* High-Tech Ambient Atmosphere & Glow Layers */}
      <motion.div style={{ opacity: bgOpacity }} className={styles.scrollBgWrapper}>
        <div className={styles.ambientGlowTop} aria-hidden="true" />
        <div className={styles.ambientGlowCenter} aria-hidden="true" />
        <div className={styles.ambientGlowLeft} aria-hidden="true" />
        <div className={styles.ambientGlowRight} aria-hidden="true" />
        <div className={styles.ambientGlowBottom} aria-hidden="true" />

        {/* Interactive Cursor Spotlight Glow */}
        <div
          className={styles.interactiveSpotlight}
          aria-hidden="true"
        />

        {/* Base Grid Overlay */}
        <div className={styles.gridOverlay} aria-hidden="true" />

        {/* Localized Green Spotlight Grid (area around pointer illuminates green grid) */}
        <div
          className={styles.greenSpotlightGrid}
          aria-hidden="true"
        />
      </motion.div>

      {/* Main Hero Content Container */}
      <motion.div
        className="container"
        style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
      >
        <div className={styles.heroCenterCol}>
          {/* 1. Top Pill Badge */}
          <div className={styles.topBadgeRow}>
            <div className={styles.badge} onClick={() => authNavigate(router, '/dashboard')}>
              <span className={styles.badgeText}>
                {t('homeSections.hero.badge', 'Next–Gen AI  Trading Analysis')}
              </span>
            </div>
          </div>

          {/* 2. Centered Headline with Candlesticks Icon Inline */}
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>
              {t('homeSections.hero.titleLine1', 'TRADE SMARTER')}
            </span>
            <span className={styles.titleLine2}>
              <span className={styles.gradientText}>{t('homeSections.hero.titleLine2', 'WITH AI THAT')}</span>
              <span className={styles.candleIconBox}>
                <CandlesticksIcon className={styles.titleCandleIcon} width={38} height={38} />
              </span>
              <span className={styles.gradientText}>{t('homeSections.hero.titleLine3', 'NEVER SLEEP')}</span>
            </span>
          </h1>

          {/* Centered Subheadline (Primary LCP Element) */}
          <p className={styles.heroDesc}>
            {t('homeSections.hero.description', 'Get real-time AI trading signals, market insights, and trade recommendations across Forex, Crypto, Stocks, and Commodities.')}
          </p>

          {/* Centered Actions Group (Button + Cyber Bracket Trust Badge) */}
          <div className={styles.actionsGroup}>
            <Button
              text={t('homeSections.hero.getStarted', 'GET STARTED')}
              icon={RightArrow}
              onClick={() => authNavigate(router, '/dashboard')}
            />

            {/* Bracketed Cyber Trust Badge */}
            <div className={styles.trustBadge}>
              <span className={styles.cornerTL} aria-hidden="true" />
              <span className={styles.cornerTR} aria-hidden="true" />
              <span className={styles.cornerBL} aria-hidden="true" />
              <span className={styles.cornerBR} aria-hidden="true" />

              <div className={styles.avatarsGroup}>
                {['a1', 'a2', 'a3'].map((img) => (
                  <img
                    key={img}
                    src={`/assets/images/${img}.png`}
                    alt="Trader User"
                    className={styles.avatarItem}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>

              <div className={styles.trustText}>
                <span className={styles.trustHighlight}>{t('homeSections.hero.trustCount', 'Trusted by over +35k')}</span>
                <span className={styles.trustSub}>{t('homeSections.hero.trustSub', 'people in the world')}</span>
              </div>
            </div>
          </div>

          {/* 3 Bottom Feature Cards */}
          <HeroFeatureCards />
        </div>

        {/* Real-time Scrolling Market Pairs Marquee */}
        <HeroTickerMarquee />
      </motion.div>
    </section>
  );
}
