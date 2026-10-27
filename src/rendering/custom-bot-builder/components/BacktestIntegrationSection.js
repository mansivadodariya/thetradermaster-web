"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../customBotBuilder.module.scss';

const METRICS = [
  "Net Profit",
  "Total Return",
  "Win Rate",
  "Profit Factor",
  "Drawdown",
  "Total Trades",
  "Average Trade",
  "Equity Curve"
];

const CATEGORIES = [
  { title: "Scalping", desc: "Short-term trading configurations focused on small frequent gains." },
  { title: "Trend Following", desc: "Strategies designed around sustained directional market movement." },
  { title: "Breakout", desc: "Bots built around predefined key support/resistance breakout conditions." },
  { title: "Momentum", desc: "Configurations focused on speed and strength of price moves." },
  { title: "Reversal", desc: "Bots built around predefined counter-trend and oversold/overbought setups." },
  { title: "Custom", desc: "Unique bot configurations created around specific user trading logic." }
];

export default function BacktestIntegrationSection({ onExploreClick }) {
  return (
    <section className={styles.backtestSection}>
      <div className="container">
        {/* Backtest Main Banner */}
        <div className={styles.backtestWrapper}>
          <SectionHeader
            badge="BACKTEST YOUR BOT"
            title1="Don't Just Build It."
            title2="Test It With Precision."
            description="Once your bot is created, move directly into the ChronosX Backtesting engine. Test your bot using historical market data and analyze performance under chosen simulation conditions."
          />

          {/* Metric Pills */}
          <div className={styles.metricsGrid}>
            {METRICS.map((m, i) => (
              <div key={i} className={styles.metricPill}>
                <span className={styles.metricDot} />
                <span>{m}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/backtesting" className={styles.heroPrimaryBtn}>
              BACKTEST YOUR BOT →
            </Link>
          </div>
        </div>

        {/* Category Explorer */}
        <div style={{ marginTop: 80 }}>
          <SectionHeader
            badge="READY-MADE BOTS"
            title1="Find a Bot That Matches"
            title2="Your Trading Style."
            description="Explore ready-made bots built around different trading approaches and strategy types."
          />

          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.title}
                className={styles.categoryCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <h4 className={styles.catTitle}>{cat.title}</h4>
                <p className={styles.catDesc}>{cat.desc}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button className={styles.heroSecondaryBtn} onClick={onExploreClick}>
              VIEW ALL BOTS →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
