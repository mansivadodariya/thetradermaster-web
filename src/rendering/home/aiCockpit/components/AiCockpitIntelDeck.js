"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../aiCockpit.module.scss';

export default React.memo(function AiCockpitIntelDeck({
  cockpitSubTab,
  setCockpitSubTab,
  hoveredIntelCard,
  setHoveredIntelCard,
}) {
  const { t } = useLanguage();

  return (
    <>
      {/* Cockpit Mode Sub-Tabs with Interactive Luxury Hover */}
      <div className={styles.cockpitSubTabs}>
        <button
          type="button"
          className={`${styles.tabLink} ${cockpitSubTab === 'overview' ? styles.tabLinkActive : ''}`}
          onClick={() => setCockpitSubTab('overview')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18M7 16l4-4 4 4 5-6" />
          </svg>
          <span>{t('homeSections.aiCockpit.tabOverview', 'Overview')}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabLink} ${cockpitSubTab === 'deep' ? styles.tabLinkActive : ''}`}
          onClick={() => setCockpitSubTab('deep')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span>{t('homeSections.aiCockpit.tabDeep', 'Deep Analysis')}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabLink} ${cockpitSubTab === 'tools' ? styles.tabLinkActive : ''}`}
          onClick={() => setCockpitSubTab('tools')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>{t('homeSections.aiCockpit.tabTools', 'Trading Tools')}</span>
        </button>
      </div>

      {/* Two High-Impact Intelligence Cards with Mutual Dimming & Respective Hover Animations */}
      <div className={styles.cardsPairGrid}>

        {/* Card 1: Technical Market Structure */}
        <div
          className={`${styles.intelCard} ${styles.scoreCard} ${hoveredIntelCard === 'score' ? styles.cardActiveScore : ''} ${hoveredIntelCard === 'rank' ? styles.cardDimmed : ''}`}
          onMouseEnter={() => setHoveredIntelCard('score')}
          onMouseLeave={() => setHoveredIntelCard(null)}
        >


          <div className={styles.scoreNumberBlock}>
            <div className={styles.structurePrimaryRow}>
              <span className={`${styles.structureHeadline} ${hoveredIntelCard === 'score' ? styles.scoreActiveText : ''}`}>
                {t('homeSections.aiCockpit.scoreVal', 'BULLISH STRUCTURE')}
              </span>

            </div>
            <p className={styles.structureDetailText}>
              {t('homeSections.aiCockpit.scoreDetail', 'Higher Highs & Higher Lows Intact · Key Demand Retained')}
            </p>
          </div>

          <div className={styles.sliderTrackWrapper}>
            <div className={styles.sliderRangeHeader}>
              <span>{t('homeSections.aiCockpit.sliderMin', 'SWING')}</span>
              <span className={styles.rangeCenterText}>{t('homeSections.aiCockpit.sliderCenter', 'SIGNAL CONVICTION')}</span>
              <span>{t('homeSections.aiCockpit.sliderMax', 'SCALPING')}</span>
            </div>
            <div className={styles.sliderTrack}>
              <motion.div
                className={styles.sliderFill}
                animate={{
                  width: hoveredIntelCard === 'score' ? '96%' : '84%',
                  background: hoveredIntelCard === 'score'
                    ? 'linear-gradient(90deg, var(--accent-bullish) 0%, var(--primary-green) 65%, #6EE7B7 100%)'
                    : 'linear-gradient(90deg, rgba(16, 185, 129, 0.4) 0%, #10B981 100%)',
                  boxShadow: hoveredIntelCard === 'score' ? '0 0 16px var(--primary-green-glow)' : 'none'
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <motion.span
                  className={styles.sliderKnob}
                  animate={{
                    scale: hoveredIntelCard === 'score' ? 1.35 : 1,
                    borderColor: hoveredIntelCard === 'score' ? '#6EE7B7' : 'var(--accent-bullish)',
                    boxShadow: hoveredIntelCard === 'score' ? '0 0 12px #6EE7B7' : '0 0 8px var(--primary-green)'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Card 2: Institutional Order Flow */}
        <div
          className={`${styles.intelCard} ${styles.rankCard} ${hoveredIntelCard === 'rank' ? styles.cardActiveRank : ''} ${hoveredIntelCard === 'score' ? styles.cardDimmed : ''}`}
          onMouseEnter={() => setHoveredIntelCard('rank')}
          onMouseLeave={() => setHoveredIntelCard(null)}
        >


          <div className={styles.rankNumberBlock}>
            <div className={styles.orderFlowPrimaryRow}>
              <span className={`${styles.orderFlowHeadline} ${hoveredIntelCard === 'rank' ? styles.rankActiveText : ''}`}>
                {t('homeSections.aiCockpit.rankVal', 'ORDER BLOCK RECLAIMED')}
              </span>

            </div>
            <p className={styles.orderFlowDetailText}>
              {t('homeSections.aiCockpit.rankDetail', 'Sell-Side Liquidity Swept · High Demand Absorption')}
            </p>
          </div>

          <div className={styles.sparklineContainer}>
            <svg viewBox="0 0 220 54" className={styles.sparklineSvg} preserveAspectRatio="none">
              <defs>
                <linearGradient id="eqGlowGradGoldCockpit" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-green)" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="var(--primary-green)" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="var(--primary-green)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {hoveredIntelCard === 'rank' ? (
                <g>
                  {/* Luminous Area Under Upward Equity Curve in Green */}
                  <motion.path
                    d="M 6 46 Q 40 44 80 38 T 130 26 T 175 18 T 205 12 L 205 50 L 6 50 Z"
                    fill="url(#eqGlowGradGoldCockpit)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  />

                  {/* Moving Upward Equity Surge Curve in Green */}
                  <motion.path
                    d="M 6 46 Q 40 44 80 38 T 130 26 T 175 18 T 205 12"
                    fill="none"
                    stroke="var(--primary-green)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    filter="drop-shadow(0 0 10px var(--primary-green-glow))"
                  />

                  {/* Peak Tip Dot at Top */}
                  <motion.circle
                    cx="205"
                    cy="12"
                    r="5"
                    fill="var(--text-white)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.55 }}
                    filter="drop-shadow(0 0 8px #6EE7B7)"
                  />

                  {/* Pulsating Ping Radar Ring */}
                  <motion.circle
                    cx="205"
                    cy="12"
                    r="8"
                    fill="none"
                    stroke="var(--primary-green)"
                    strokeWidth="1.5"
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: "easeOut", delay: 0.6 }}
                  />
                </g>
              ) : (
                <g className={styles.sparklineIdleGroup}>
                  <path
                    className={styles.sparklineIdlePath}
                    d="M 6 46 Q 40 44 80 38 T 130 26"
                    fill="none"
                    stroke="var(--primary-green)"
                    strokeOpacity="0.5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle className={styles.sparklineIdleDot} cx="130" cy="26" r="3.5" fill="var(--primary-green)" />
                </g>
              )}
            </svg>
          </div>
        </div>

      </div>
    </>
  );
});
