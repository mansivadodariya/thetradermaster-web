"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../customBotBuilder.module.scss';

const AiSparkIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
  </svg>
);

const SettingsWizardIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const WAYS = [
  {
    id: "ai-builder",
    icon: <AiSparkIcon />,
    title: "AI BOT BUILDER",
    tagline: "Describe your strategy. Let AI structure it.",
    desc: "Explain your trading idea in plain English and let ChronosX help transform it into an algorithmic strategy.",
    highlights: [
      "Convert natural-language strategy ideas into structured trading rules",
      "Define indicators, entry conditions and exits with AI assistance",
      "Tune parameters through an interactive workflow",
      "Backtest your generated strategy before deployment"
    ],
    cta: "BUILD WITH AI",
    illustration: "/assets/images/botai.png",
    cardClass: "aiCard"
  },
  {
    id: "custom-builder",
    icon: <SettingsWizardIcon />,
    title: "CUSTOM BOT BUILDER",
    tagline: "Build every rule exactly the way you want.",
    desc: "Create your bot step-by-step using structured inputs for indicators, conditions, execution rules and risk management.",
    highlights: [
      "Configure technical indicators and trigger conditions",
      "Set entry, take-profit and stop-loss rules",
      "Define position sizing and risk parameters",
      "Build deterministic execution logic without writing code"
    ],
    cta: "BUILD CUSTOM BOT",
    illustration: "/assets/images/botcutom.png",
    cardClass: "customCard"
  }
];

export default function ThreeWaysSection({ onSelectWay }) {
  return (
    <section className={styles.threeWaysSection}>
      <div className="container">
        <SectionHeader
          badge="TWO WAYS TO BUILD"
          title1="Your Strategy. Your Rules."
          title2="Your Bot."
          description="Whether you have a strategy in your head or already know every entry and exit condition, ChronosX gives you two ways to turn it into a trading bot."
        />

        <div className={styles.twoCardsGrid}>
          {WAYS.map((way, idx) => (
            <motion.div
              key={way.id}
              className={`${styles.creationHeroCard} ${styles[way.cardClass]}`}
              onClick={() => onSelectWay && onSelectWay(way.id)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.botGlowOverlay} />

              {/* 3D Illustration Graphic on Right (as in dashboard) */}
              <div className={styles.botIllustrationBg}>
                <img
                  src={way.illustration}
                  alt={way.title}
                  className={styles.IllustrationImg}
                />
              </div>

              {/* Header with Icon Box and Title */}
              <div className={styles.botHeaderRow}>
                <div className={styles.botIconBox}>
                  {way.icon}
                </div>
                <h3 className={styles.botTitle}>{way.title}</h3>
              </div>

              {/* Body Content */}
              <div className={styles.botBody}>
                <div className={styles.botTagline}>{way.tagline}</div>
                <p className={styles.botDescription}>{way.desc}</p>

                <div className={styles.highlightsHeader}>Highlights</div>
                <div className={styles.featureList}>
                  {way.highlights.map((h, hIdx) => (
                    <div key={hIdx} className={styles.botList}>
                      <span className={styles.checkIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Button */}
              <div className={styles.botFooter}>
                <button
                  type="button"
                  className={styles.primaryActionBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectWay && onSelectWay(way.id);
                  }}
                >
                  <span>{way.cta}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
