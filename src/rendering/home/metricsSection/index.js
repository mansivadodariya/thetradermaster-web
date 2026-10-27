"use client";
import React, { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import CountUp from '@/components/countUp';
import SectionHeader from '@/components/sectionHeader';
import styles from './metricsSection.module.scss';

// Motion variants for entry animations
const headerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.05,
    },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const gridContainerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.94, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const emptyTileVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export default function MetricsSection() {
  const { t } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: -500, y: -500, isHovered: false });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, isHovered: true });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
  };

  return (
    <section className={styles.metricsSection} aria-label="Institutional Performance Metrics">
      {/* Background Ambient Glow */}
      <div className={styles.ambientGlow} />

      <div className="container">
        {/* Section Header */}
        <SectionHeader
          badge={t('homeSections.metrics.badge', 'PLATFORM METRICS')}
          title1={t('homeSections.metrics.title1', 'Numbers That Prove')}
          title2={t('homeSections.metrics.title2', 'the Edge.')}
          description={t('homeSections.metrics.description', 'High-frequency neural pattern recognition operating across global markets with ultra-low latency.')}
        />

        {/* Centered Brick Wall Grid with Localized Green Laser Border Spotlight & Staggered Entry Motions */}
        <motion.div
          ref={containerRef}
          className={styles.brickWallContainer}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Localized Green Laser Border Spotlight Overlay */}
          <div
            className={styles.laserBorderSpotlight}
            style={{
              opacity: mousePos.isHovered ? 1 : 0,
              WebkitMaskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, #000 0%, transparent 100%)`,
              maskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, #000 0%, transparent 100%)`
            }}
          >
            <div className={styles.laserWallGrid}>
              <div className={`${styles.laserRow} ${styles.row1}`}>
                <div className={styles.laserTile} />
                <div className={styles.laserTile} />
                <div className={styles.laserTile} />
                <div className={styles.laserTile} />
              </div>
              <div className={`${styles.laserRow} ${styles.row2}`}>
                <div className={styles.laserTile} />
                <div className={styles.laserTile} />
                <div className={styles.laserTile} />
              </div>
              <div className={`${styles.laserRow} ${styles.row3}`}>
                <div className={styles.laserTile} />
                <div className={styles.laserTile} />
                <div className={styles.laserTile} />
              </div>
            </div>
          </div>

          {/* ROW 1: Leading Empty Box -> 1,000+ Market Pairs Scanned -> <300ms AI Speed -> Trailing Empty Box */}
          <div className={`${styles.wallRow} ${styles.row1}`}>
            <motion.div variants={emptyTileVariants} className={`${styles.wallTile} ${styles.emptyTile}`} aria-hidden="true" />

            <motion.div
              className={`${styles.wallTile} ${styles.filledTile}`}
              variants={tileVariants}
            >
              <div className={styles.tileBody}>
                <div className={styles.bigNumber}>
                  <CountUp to={1000} duration={2.0} />
                  <span className={styles.suffixGreen}>+</span>
                </div>
                <div className={styles.tileLabel}>{t('homeSections.metrics.tile1Label', 'Market Pairs Scanned')}</div>
                <div className={styles.tileDesc}>{t('homeSections.metrics.tile1Desc', 'Live Forex, Indices & Metals telemetry')}</div>
              </div>
            </motion.div>

            <motion.div
              className={`${styles.wallTile} ${styles.filledTile}`}
              variants={tileVariants}
            >
              <div className={styles.tileBody}>
                <div className={styles.bigNumber}>
                  <span className={styles.suffixGreen}>&lt; </span>
                  <CountUp to={50} duration={2.0} />
                  <span className={styles.suffixGreen}>ms</span>
                </div>
                <div className={styles.tileLabel}>{t('homeSections.metrics.tile2Label', 'AI Processing Speed')}</div>
                <div className={styles.tileDesc}>{t('homeSections.metrics.tile2Desc', 'Sub-second neural pattern analysis')}</div>
              </div>
            </motion.div>

            <motion.div variants={emptyTileVariants} className={`${styles.wallTile} ${styles.emptyTile}`} aria-hidden="true" />
          </div>

          {/* ROW 2: Leading Empty Box -> 6 Timeframes Multi-TF Confluence -> Trailing Empty Box */}
          <div className={`${styles.wallRow} ${styles.row2}`}>
            <motion.div variants={emptyTileVariants} className={`${styles.wallTile} ${styles.emptyTile}`} aria-hidden="true" />

            <motion.div
              className={`${styles.wallTile} ${styles.filledTile}`}
              variants={tileVariants}
            >
              <div className={styles.tileBody}>
                <div className={styles.bigNumber}>
                  <CountUp to={6} duration={2.0} />
                  <span className={styles.suffixGreen}> Timeframes</span>
                </div>
                <div className={styles.tileLabel}>{t('homeSections.metrics.tile3Label', 'Timeframes Multi-TF Confluence')}</div>
                <div className={styles.tileDesc}>{t('homeSections.metrics.tile3Desc', 'From 1-minute scalping to daily swings')}</div>
              </div>
            </motion.div>

            <motion.div variants={emptyTileVariants} className={`${styles.wallTile} ${styles.emptyTile}`} aria-hidden="true" />
          </div>

          {/* ROW 3: Leading Empty Box -> 99.9% Platform Availability -> Trailing Empty Box */}
          <div className={`${styles.wallRow} ${styles.row3}`}>
            <motion.div variants={emptyTileVariants} className={`${styles.wallTile} ${styles.emptyTile}`} aria-hidden="true" />

            <motion.div
              className={`${styles.wallTile} ${styles.filledTile}`}
              variants={tileVariants}
            >
              <div className={styles.tileBody}>
                <div className={styles.bigNumber}>
                  <CountUp to={99.9} decimals={1} duration={2.0} />
                  <span className={styles.suffixGreen}>%</span>
                </div>
                <div className={styles.tileLabel}>{t('homeSections.metrics.tile4Label', 'Platform Availability')}</div>
                <div className={styles.tileDesc}>{t('homeSections.metrics.tile4Desc', '24/7 continuous market telemetry')}</div>
              </div>
            </motion.div>

            <motion.div variants={emptyTileVariants} className={`${styles.wallTile} ${styles.emptyTile}`} aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
