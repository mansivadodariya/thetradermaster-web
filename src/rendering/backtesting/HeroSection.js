"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import CandlesticksIcon from '../home/herobanner/CandlesticksIcon';
import styles from './backtesting.module.scss';

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ChartDataIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 9l-5 5-4-4-5 5" />
    <circle cx="18" cy="9" r="2" fill="#18c98b" />
    <circle cx="13" cy="14" r="2" fill="#00F2FE" />
  </svg>
);

const MetricsIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <polyline points="6 10 10 7 14 11 18 8" stroke="#18c98b" strokeWidth="2" />
  </svg>
);

const OptimizeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="3" fill="#18c98b" />
  </svg>
);

const HIGHLIGHTS = [
  {
    icon: <ChartDataIcon />,
    tag: "TICK PRECISION",
    title: "Real Market Data",
    desc: "Test your strategy against verified historical tick-level market conditions across Forex, Crypto, & Stocks."
  },
  {
    icon: <MetricsIcon />,
    tag: "QUANT ANALYTICS",
    title: "Detailed Performance Metrics",
    desc: "Understand net returns, win rate, max drawdown, profit factor, Sharpe ratio, and execution stats in depth."
  },
  {
    icon: <OptimizeIcon />,
    tag: "AUTO REFLECTION",
    title: "Optimize & Improve",
    desc: "Adjust your parameters, run multi-variable simulations, and continuously refine your trading logic."
  }
];

export default function HeroSection({ onStartClick }) {
  const router = useRouter();

  const handleCta = () => {
    if (onStartClick) {
      onStartClick();
    } else {
      authNavigate(router, '/dashboard');
    }
  };

  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroCenterCol}>
          {/* 1. Top Pill Badge */}
          <motion.div
            className={styles.topBadgeRow}
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.badge} onClick={handleCta}>
              <span className={styles.badgeDot} />
              <span className={styles.badgeText}>
                Next–Gen Strategies  Backtesting
              </span>
            </div>
          </motion.div>

          {/* 2. Hero Headline with Candlestick Vector Box Inline */}
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.titleLine1}>TEST YOUR IDEAS.</span>
            <span className={styles.titleLine2}>
              <span className={styles.gradientText}>TRADE WITH</span>
              <span className={styles.candleIconBox}>
                <CandlesticksIcon className={styles.titleCandleIcon} width={36} height={36} />
              </span>
              <span className={styles.gradientText}>CONFIDENCE.</span>
            </span>
          </motion.h1>

          {/* Centered Subheadline */}
          <motion.p
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Backtesting lets you validate your strategies, bots, or custom trading ideas using historical market data. Analyze performance, measure risk, and optimize your approach before going live.
          </motion.p>

          {/* Centered Actions Group (Primary Button + Cyber Bracket Trust Badge) */}
          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className={styles.primaryCtaBtn}
              onClick={handleCta}
            >
              <span>START BACKTESTING</span>
              <ArrowRightIcon />
            </button>

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
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ))}
              </div>

              <div className={styles.trustText}>
                <span className={styles.trustHighlight}>Trusted by over +35k</span>
                <span className={styles.trustSub}>traders & quants worldwide</span>
              </div>
            </div>
          </motion.div>

          {/* Key Highlights Cards Grid */}
          <motion.div
            className={styles.highlightsGrid}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {HIGHLIGHTS.map((item, index) => (
              <motion.div
                key={index}
                className={styles.highlightCard}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.cardHeaderRow}>
                  <div className={styles.highlightIconBox}>
                    {item.icon}
                  </div>
                  <span className={styles.cardTag}>{item.tag}</span>
                </div>
                <h3 className={styles.highlightTitle}>{item.title}</h3>
                <p className={styles.highlightDesc}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
