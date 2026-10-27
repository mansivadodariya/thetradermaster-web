"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../customBotBuilder.module.scss';

const DescribeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const GenerateIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

const RefineIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const BacktestIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const STEPS_FLOW = [
  {
    step: "Describe",
    title: "Natural Language Strategy",
    desc: "Explain your trading concept in plain English without writing any code.",
    icon: <DescribeIcon />
  },
  {
    step: "Generate",
    title: "AI Strategy Conversion",
    desc: "Transform your concept into structured indicators, entry conditions, and exit rules.",
    icon: <GenerateIcon />
  },
  {
    step: "Refine",
    title: "Interactive Parameter Tuning",
    desc: "Adjust parameters, add trailing stops, or apply multi-timeframe filters in seconds.",
    icon: <RefineIcon />
  },
  {
    step: "Backtest",
    title: "Backtest & Evaluate",
    desc: "Simulate performance over multi-year tick data and inspect win rate before live deployment.",
    icon: <BacktestIcon />
  }
];

export default function AiBuilderSection({ refProp }) {
  return (
    <section ref={refProp} className={styles.aiBuilderSection}>
      <div className="container">
        <SectionHeader
          badge="AI BOT BUILDER"
          title1="From Trading Idea"
          title2="to Algorithm"
          description="Have a strategy but don't want to build every rule manually? Just explain what you want your bot to do."
        />

        <div className={styles.aiChatGrid}>
          {/* Left Column: 4 Vertical Process Cards */}
          <div className={styles.stepsRail}>
            {STEPS_FLOW.map((s, idx) => (
              <motion.div
                key={idx}
                className={styles.stepCard}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className={styles.stepIconBox}>
                  {s.icon}
                </div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>{s.title}</h4>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: 3D AI Robot Showcase Visual */}
          <motion.div
            className={styles.aiImageVisual}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.imageWrapper}>
              <img
                src="/assets/images/ai-robot-builder.png"
                alt="TraderMaster AI Bot Builder Robot"
                className={styles.robotImage}
              />
              <div className={styles.imageOverlayGradient} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
