"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from '../customBotBuilder.module.scss';

const BotSparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const SlidersRuleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
  </svg>
);

const ChartBacktestIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const HIGHLIGHTS = [
  {
    icon: <BotSparklesIcon />,
    title: "AI-Assisted Creation",
    desc: "Describe your trading idea in natural language and let AI help build your bot."
  },
  {
    icon: <SlidersRuleIcon />,
    title: "Custom Rules",
    desc: "Define your own entry, exit, and risk-management conditions."
  },
  {
    icon: <ChartBacktestIcon />,
    title: "Backtesting Ready",
    desc: "Send your completed bot directly into historical backtesting."
  }
];

export default function HeroSection({ onStartClick, onCustomClick }) {
  return (
    <section className={styles.heroSection}>
      <div className="container">
        {/* Top Tag Badge */}
        <div className={styles.heroBadge}>
          <span className={styles.pulseDot} />
          AI TRADING BOT BUILDER
        </div>

        {/* Hero Title */}
        <h1 className={styles.heroTitle}>
          Build Your Strategy. <br />
          <span className={styles.highlight}>Automate Your Edge.</span>
        </h1>

        {/* Hero Subtext */}
        <p className={styles.heroSubtext}>
          Turn your trading ideas into configurable algorithmic bots with TraderMaster. Choose an AI-powered workflow to describe your strategy in plain English, or build every rule manually with the Custom Bot Builder.
        </p>

        {/* Hero CTAs */}
        <div className={styles.heroCtaGroup}>
          <button className={styles.heroPrimaryBtn} onClick={onStartClick}>
            CREATE YOUR BOT
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* Hero Highlights Grid */}
        <div className={styles.heroHighlightsGrid}>
          {HIGHLIGHTS.map((item, index) => (
            <motion.div
              key={index}
              className={styles.highlightCard}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className={styles.iconBox}>{item.icon}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
