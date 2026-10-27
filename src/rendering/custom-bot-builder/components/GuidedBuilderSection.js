"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../customBotBuilder.module.scss';

const BLOCKS = [
  {
    title: "Market & Timeframe",
    desc: "Choose the instrument and timeframe for your strategy.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  },
  {
    title: "Technical Indicators",
    desc: "Configure indicators such as EMA, RSI, MACD, Bollinger Bands and more.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    )
  },
  {
    title: "Entry Conditions",
    desc: "Define the exact conditions required before a trade can trigger.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    )
  },
  {
    title: "Exit Conditions",
    desc: "Set take-profit, stop-loss and trailing-stop logic.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
    )
  },
  {
    title: "Position Sizing",
    desc: "Configure lot size and position-sizing rules.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    title: "Risk Parameters",
    desc: "Define your risk limits and risk-reward structure.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }
];

export default function GuidedBuilderSection({ refProp }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    botName: "My Trend Follower",
    description: "EMA 20/50 crossover with RSI momentum confirmation",
    pair: "EUR/USD",
    timeframe: "1H",
    indicator: "EMA 20 & EMA 50",
    condition: "Crossover + RSI > 50",
    stopLoss: "25 pips",
    takeProfit: "50 pips",
    riskPercent: "1.0%"
  });

  const wizardSteps = [
    { id: 1, name: "Market" },
    { id: 2, name: "Indicators" },
    { id: 3, name: "Entry & Exit" },
    { id: 4, name: "Risk & Size" },
    { id: 5, name: "Review" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <section ref={refProp} className={styles.guidedBuilderSection}>
      <div className="container">
        <SectionHeader
          badge="SECTION 04 — CUSTOM BOT BUILDER"
          title1="Complete Control Over"
          title2="Your Trading Logic"
          description="Prefer to define everything yourself? Custom Bot Builder gives you a structured environment to assemble your strategy exactly the way you want."
        />

        {/* Build Your Bot Block by Block Grid */}
        <div style={{ textAlign: 'center', margin: '40px 0 24px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px' }}>
            Build Your Bot Block by Block
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: 0 }}>
            Configure each component of your strategy with modular precision.
          </p>
        </div>

        <div className={styles.guidedFeaturesGrid}>
          {BLOCKS.map((b, i) => (
            <motion.div
              key={i}
              className={styles.guidedFeatureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className={styles.cardIcon}>{b.icon}</div>
              <h4 className={styles.cardTitle}>{b.title}</h4>
              <p className={styles.cardDesc}>{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Step-by-Step Configuration Wizard */}
        <div style={{ marginTop: '56px' }}>
          <div className={styles.guidedWizardContainer}>
            {/* Progress Bar */}
            <div className={styles.wizardProgressBar}>
              {wizardSteps.map((step) => (
                <div
                  key={step.id}
                  className={`${styles.stepProgressNode} ${
                    currentStep === step.id ? styles.activeNode : ''
                  } ${currentStep > step.id ? styles.completedNode : ''}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={styles.nodeCircle}>
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  <span className={styles.nodeLabel}>{step.name}</span>
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className={styles.wizardFormCard}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.stepHeaderTitle}>Block 1 — Market & Timeframe</div>
                    <div className={styles.stepHeaderSub}>Choose the instrument and timeframe for your strategy.</div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Bot Strategy Name</label>
                        <input
                          type="text"
                          name="botName"
                          value={formData.botName}
                          onChange={handleChange}
                          placeholder="e.g. EUR Trend Follower"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Trading Pair / Market</label>
                        <select name="pair" value={formData.pair} onChange={handleChange}>
                          <option value="XAU/USD">XAU/USD (Gold)</option>
                          <option value="EUR/USD">EUR/USD</option>
                          <option value="GBP/USD">GBP/USD</option>
                          <option value="GBP/JPY">GBP/JPY</option>
                          <option value="EUR/JPY">EUR/JPY</option>
                          <option value="USD/CAD">USD/CAD</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Execution Timeframe</label>
                        <select name="timeframe" value={formData.timeframe} onChange={handleChange}>
                          <option value="15M">15 Minutes (15M)</option>
                          <option value="1H">1 Hour (1H)</option>
                          <option value="4H">4 Hours (4H)</option>
                          <option value="1D">Daily (1D)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.stepHeaderTitle}>Block 2 — Technical Indicators</div>
                    <div className={styles.stepHeaderSub}>Configure indicators such as EMA, RSI, MACD, Bollinger Bands and more.</div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Primary Technical Indicator</label>
                        <select name="indicator" value={formData.indicator} onChange={handleChange}>
                          <option value="EMA 20 & EMA 50">EMA 20 & EMA 50 (Exponential Moving Average)</option>
                          <option value="RSI 14">RSI 14 (Relative Strength Index)</option>
                          <option value="MACD 12,26,9">MACD (12, 26, 9)</option>
                          <option value="Bollinger Bands">Bollinger Bands (20, 2)</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Trigger Condition</label>
                        <select name="condition" value={formData.condition} onChange={handleChange}>
                          <option value="Crossover + RSI > 50">Bullish Crossover + RSI &gt; 50</option>
                          <option value="Crossunder + RSI < 50">Bearish Crossover + RSI &lt; 50</option>
                          <option value="RSI Oversold (<30)">RSI Oversold (&lt;30) Rebound</option>
                          <option value="Lower Band Bounce">Bollinger Band Bounce</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.stepHeaderTitle}>Blocks 3 & 4 — Entry & Exit Conditions</div>
                    <div className={styles.stepHeaderSub}>Define exact trigger conditions, take-profit, stop-loss and trailing-stop rules.</div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Stop Loss (SL)</label>
                        <input
                          type="text"
                          name="stopLoss"
                          value={formData.stopLoss}
                          onChange={handleChange}
                          placeholder="e.g. 25 pips or 1.5% ATR"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Take Profit (TP)</label>
                        <input
                          type="text"
                          name="takeProfit"
                          value={formData.takeProfit}
                          onChange={handleChange}
                          placeholder="e.g. 50 pips (1:2 R:R)"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.stepHeaderTitle}>Blocks 5 & 6 — Position Sizing & Risk Parameters</div>
                    <div className={styles.stepHeaderSub}>Configure lot size and risk-reward structure.</div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Risk Per Trade (% Account Equity)</label>
                        <select name="riskPercent" value={formData.riskPercent} onChange={handleChange}>
                          <option value="0.5%">0.5% (Conservative)</option>
                          <option value="1.0%">1.0% (Standard Quantitative)</option>
                          <option value="2.0%">2.0% (Aggressive Growth)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.stepHeaderTitle}>Summary — Assembled Bot Strategy</div>
                    <div className={styles.stepHeaderSub}>Deterministic execution logic assembled without writing code.</div>
                    <div style={{ background: 'rgba(24, 201, 139, 0.1)', padding: 20, borderRadius: 12, border: '1px solid rgba(24, 201, 139, 0.3)' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: '#18C98B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        {formData.botName}
                      </p>
                      <p style={{ margin: '8px 0', fontSize: '0.9rem', color: '#E2E8F0' }}>{formData.description}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 12, fontSize: '0.85rem' }}>
                        <div>Market: <strong>{formData.pair}</strong></div>
                        <div>Timeframe: <strong>{formData.timeframe}</strong></div>
                        <div>Indicators: <strong>{formData.indicator}</strong></div>
                        <div>Trigger: <strong>{formData.condition}</strong></div>
                        <div>Exit Rules: <strong>SL {formData.stopLoss} / TP {formData.takeProfit}</strong></div>
                        <div>Risk Sizing: <strong>{formData.riskPercent} per trade</strong></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.wizardActionsRow} style={{ marginTop: 24 }}>
                <button
                  className={styles.heroSecondaryBtn}
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  style={{ opacity: currentStep === 1 ? 0.4 : 1, cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}
                >
                  ← PREVIOUS
                </button>
                <button className={styles.heroPrimaryBtn} onClick={handleNext}>
                  {currentStep === 5 ? 'ASSEMBLE BOT →' : 'NEXT BLOCK →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
