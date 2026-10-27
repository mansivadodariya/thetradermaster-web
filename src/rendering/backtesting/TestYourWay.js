"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from './backtesting.module.scss';

const ManualIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const StrategyDocIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CpuBotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

const CodeCustomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const MODES = [
  {
    icon: <ManualIcon />,
    tag: "CUSTOM INPUT",
    title: "Manual Backtesting",
    desc: "Enter your own symbol, timeframe, parameters, and date range to create a customized historical test."
  },
  {
    icon: <StrategyDocIcon />,
    tag: "READY STRATEGIES",
    title: "Pre-Built Strategies",
    desc: "Choose from available strategies and evaluate their historical performance."
  },
  {
    icon: <CpuBotIcon />,
    tag: "AUTOMATED BOTS",
    title: "Pre-Built Bots",
    desc: "Test ready-to-use trading bots against your selected historical market conditions."
  },
  {
    icon: <CodeCustomIcon />,
    tag: "YOUR LOGIC",
    title: "Custom Strategies / Bots",
    desc: "Backtest your own trading logic, strategies, or bots and analyze how they performed historically."
  }
];

export default function TestYourWay() {
  return (
    <section className={styles.testWaySection}>
      <div className="container">
        {/* Header */}
        <SectionHeader
          badge="FLEXIBLE WORKFLOWS"
          title1="Test Your"
          title2="Way"
          description="Whether you're following a strategy, using a bot, or building your own, TraderMaster gives you a flexible backtesting workflow."
        />

        {/* 4 Trading Modes Grid */}
        <div className={styles.modesGrid}>
          {MODES.map((mode, index) => (
            <motion.div
              key={index}
              className={styles.modeCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -5 }}
            >
              <div className={styles.modeTopRow}>
                <div className={styles.modeIconBox}>
                  {mode.icon}
                </div>
                <span className={styles.modeBadge}>{mode.tag}</span>
              </div>
              <h3 className={styles.modeTitle}>{mode.title}</h3>
              <p className={styles.modeDesc}>{mode.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
