"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../customBotBuilder.module.scss';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
  </svg>
);

const CategoryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const SlidersIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

const MATRIX_ROWS = [
  {
    feature: "Best Suited For",
    desc: "Target user & workflow preference",
    ai: {
      type: "pill",
      text: "Idea-focused traders seeking rapid automation",
      theme: "green"
    },
    custom: {
      type: "pill",
      text: "Quant traders demanding 100% parameter control",
      theme: "silver"
    }
  },
  {
    feature: "Strategy Input",
    desc: "How strategy rules are created",
    ai: {
      type: "pill",
      text: "Natural Language Prompt (Plain English)",
      theme: "green"
    },
    custom: {
      type: "pill",
      text: "Modular Logic Blocks & Parameter Fields",
      theme: "silver"
    }
  },
  {
    feature: "AI Logic Copilot",
    desc: "Automated syntax & condition assembly",
    ai: {
      type: "badge",
      text: "Autonomous Copilot",
      theme: "green",
      icon: "check"
    },
    custom: {
      type: "badge",
      text: "Optional Suggestions",
      theme: "neutral"
    }
  },
  {
    feature: "Manual Granular Control",
    desc: "Direct tweak of every math formula",
    ai: {
      type: "badge",
      text: "Full Rule Tweaking",
      theme: "green",
      icon: "check"
    },
    custom: {
      type: "highlight",
      text: "Deep Precision (No Limits)",
      stars: true
    }
  },
  {
    feature: "Technical Indicators",
    desc: "RSI, EMA, MACD, Bollinger, ATR & 50+",
    ai: {
      type: "badge",
      text: "50+ Built-in Indicators",
      theme: "green",
      icon: "check"
    },
    custom: {
      type: "badge",
      text: "50+ Indicators + Custom Math",
      theme: "green",
      icon: "check"
    }
  },
  {
    feature: "Entry & Exit Conditions",
    desc: "Triggers, confirmations & filters",
    ai: {
      type: "badge",
      text: "AI-Generated & Structured",
      theme: "green",
      icon: "check"
    },
    custom: {
      type: "badge",
      text: "Unlimited Nested Conditions",
      theme: "green",
      icon: "check"
    }
  },
  {
    feature: "Risk & Position Sizing",
    desc: "SL, TP, trailing stops, max drawdown",
    ai: {
      type: "badge",
      text: "Guardrail Sizing Included",
      theme: "green",
      icon: "check"
    },
    custom: {
      type: "badge",
      text: "Dynamic % & Custom Math Risk",
      theme: "green",
      icon: "check"
    }
  },
  {
    feature: "Historical Backtesting",
    desc: "Simulate over multi-year tick data",
    ai: {
      type: "badge",
      text: "Instant 1-Click Backtest",
      theme: "green",
      icon: "check"
    },
    custom: {
      type: "badge",
      text: "Multi-Parameter Optimization",
      theme: "green",
      icon: "check"
    }
  },
  {
    feature: "Refinement Workflow",
    desc: "Iterating and improving win rate",
    ai: {
      type: "pill",
      text: "Conversational Fine-Tuning",
      theme: "green"
    },
    custom: {
      type: "pill",
      text: "Visual Wizard Re-Configuration",
      theme: "silver"
    }
  }
];

export default function ComparisonSection({ refProp, onAiClick, onCustomClick, onStartClick }) {
  const handleAiClick = onAiClick || onStartClick;
  const handleCustomClick = onCustomClick || onStartClick;

  const renderCellContent = (data) => {
    if (!data) return null;

    if (data.type === 'pill') {
      return (
        <div className={`${styles.comparePill} ${styles[data.theme]}`}>
          {data.text}
        </div>
      );
    }

    if (data.type === 'badge') {
      return (
        <div className={`${styles.compareBadge} ${styles[data.theme]}`}>
          {data.icon === 'check' && (
            <span className={styles.badgeIconCircle}>
              <CheckIcon />
            </span>
          )}
          <span className={styles.badgeText}>{data.text}</span>
        </div>
      );
    }

    if (data.type === 'highlight') {
      return (
        <div className={styles.compareHighlightBadge}>
          {data.stars && (
            <span className={styles.starCluster}>
              <CheckIcon />
              <CheckIcon />
              <CheckIcon />
            </span>
          )}
          <span className={styles.highlightText}>{data.text}</span>
        </div>
      );
    }

    return <span>{String(data)}</span>;
  };

  return (
    <section ref={refProp} className={styles.comparisonSection}>
      {/* Dynamic Background Glow */}
      <div className={styles.comparisonGlow} aria-hidden="true" />

      <div className="container">
        <SectionHeader
          badge="FEATURE COMPARISON"
          title1="Which Builder Fits"
          title2="Your Workflow?"
          description="Compare capabilities across the AI Bot Builder and Custom Bot Builder to choose the development path tailored to your trading style."
        />

        <motion.div
          className={styles.matrixTableWrapper}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className={styles.tableScrollContainer}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  {/* Feature Column */}
                  <th className={styles.featureHeaderCol}>
                    <div className={styles.colHeaderInner}>
                      <div className={styles.categoryTrackBadge}>
                        <CategoryIcon />
                        <span>CAPABILITIES</span>
                      </div>
                      <h4 className={styles.colMainTitle}>Platform Features</h4>
                      <p className={styles.colSubtext}>Core algorithmic tools & controls</p>
                    </div>
                  </th>

                  {/* AI Bot Builder Column */}
                  <th className={styles.aiColHead}>
                    <div className={styles.colHeaderInner}>
                      <div className={styles.aiTrackBadge}>
                        <SparkleIcon />
                        <span>AI-FIRST TRACK</span>
                      </div>
                      <h4 className={styles.colMainTitle}>AI Bot Builder</h4>
                      <p className={styles.colSubtext}>Turn ideas into automated bots in seconds</p>
                      {handleAiClick && (
                        <button
                          type="button"
                          className={styles.headerActionBtnAi}
                          onClick={handleAiClick}
                        >
                          <span>Start with AI</span>
                          <ArrowIcon />
                        </button>
                      )}
                    </div>
                  </th>

                  {/* Custom Bot Builder Column */}
                  <th className={styles.customColHead}>
                    <div className={styles.colHeaderInner}>
                      <div className={styles.customTrackBadge}>
                        <SlidersIcon />
                        <span>GRANULAR TRACK</span>
                      </div>
                      <h4 className={styles.colMainTitle}>Custom Bot Builder</h4>
                      <p className={styles.colSubtext}>Full manual control over every rule</p>
                      {handleCustomClick && (
                        <button
                          type="button"
                          className={styles.headerActionBtnCustom}
                          onClick={handleCustomClick}
                        >
                          <span>Build Manually</span>
                          <ArrowIcon />
                        </button>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row, idx) => (
                  <tr key={idx} className={styles.matrixRow}>
                    <td className={styles.featureLabelCell}>
                      <div className={styles.featureLabelWrapper}>
                        <span className={styles.featureName}>{row.feature}</span>
                        {row.desc && <span className={styles.featureDesc}>{row.desc}</span>}
                      </div>
                    </td>
                    <td className={styles.aiCell}>
                      {renderCellContent(row.ai)}
                    </td>
                    <td className={styles.customCell}>
                      {renderCellContent(row.custom)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
