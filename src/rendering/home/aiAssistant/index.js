"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './aiAssistant.module.scss';
import Textbutton from '@/components/textbutton';

const featureData = [
  {
    id: 0,
    step: '01',
    modelKey: 'Neural-v4.2',
    name: 'Neural Engine',
    badge: 'LIVE REASONING',
    title: 'Instant AI Market Insights',
    desc: 'Receive real-time multi-modal market analysis, structural pattern recognition, and high-probability setup alerts with institutional precision.',
    metric: 'Latency: < 12ms • Multi-Asset',
    iconType: 'lightning'
  },
  {
    id: 1,
    step: '02',
    modelKey: 'GPT-4o Vision',
    name: 'Vision Analysis',
    badge: 'AUTO STRUCTURE',
    title: 'Smarter Automated Analysis',
    desc: 'AI dynamically scans chart structures, detects liquidity imbalances, and maps harmonic key levels 24/7.',
    metric: 'Pattern Engine: Vision-v4.2 • 98.4%',
    iconType: 'robot'
  },
  {
    id: 2,
    step: '03',
    modelKey: 'DeepReasoning',
    name: 'Decision Guard',
    badge: 'DECISION COPILOT',
    title: 'Real-Time Decision Support',
    desc: 'Execute trades backed by automated risk calibration, dynamic target projections, and intelligent trailing guard protection.',
    metric: 'Risk Engine: Auto Calibration • Dynamic Guard',
    iconType: 'gauge'
  }
];

const modelConfigurations = {
  'Neural-v4.2': {
    name: 'Chronos Neural Engine v4.2',
    category: 'Multi-Modal Reasoning',
    activeTabLabel: 'REAL-TIME ANALYSIS',
    prompt: 'Identify structural liquidity gaps and optimal risk-reward parameters for high-probability setups.',
    confidence: '98.4% Confluence Score',
    recommendation: 'STRUCTURAL BREAKOUT VALIDATED',
    statusTag: 'HIGH ACCURACY',
    pipelineSteps: [
      { step: '01', name: 'Pattern Recognition', status: 'Structure Identified', detail: 'Harmonic Confluence & Breakout Zone' },
      { step: '02', name: 'Liquidity Analysis', status: 'Sweep Confirmed', detail: 'Institutional Volume Footprint' },
      { step: '03', name: 'Risk Calibration', status: 'Guard Active', detail: 'Auto Trailing Guard Locked (1:3.4 R:R)' }
    ],
    keyTakeaways: [
      { label: 'Market Structure', val: 'Higher High Breakout Confirmed', color: 'gold' },
      { label: 'Confidence Score', val: '98.4% Neural Confluence', color: 'green' },
      { label: 'Risk Calibration', val: 'Auto Trailing Guard Locked', color: 'cyan' }
    ],
    logs: [
      { time: '17:12:42', type: 'engine', text: 'Neural Engine verified multi-timeframe trend alignment across all timeframes.' },
      { time: '17:12:38', type: 'orderflow', text: 'Pattern Detector matched 98.4% similarity against historical dataset.' },
      { time: '17:12:30', type: 'risk', text: 'Risk Guard calibrated automated trailing protection with 1:3.4 ratio.' }
    ]
  },
  'GPT-4o Vision': {
    name: 'GPT-4o Vision Copilot',
    category: 'Computer Vision',
    activeTabLabel: 'PATTERN DETECTION',
    prompt: 'Scan multi-timeframe price action to detect liquidity sweeps and key support-resistance zones.',
    confidence: '97.8% Precision Rating',
    recommendation: 'LIQUIDITY SWEEP DETECTED',
    statusTag: 'AUTO STRUCTURE',
    pipelineSteps: [
      { step: '01', name: 'Visual Scanner', status: 'Chart Processed', detail: 'Multi-Timeframe Spatial Mapping' },
      { step: '02', name: 'Structure Engine', status: 'Imbalance Mapped', detail: 'Fair Value Gap Detected' },
      { step: '03', name: 'Target Generator', status: 'Projection Ready', detail: 'Dynamic Fibonacci Target 61.8%' }
    ],
    keyTakeaways: [
      { label: 'Visual Mapping', val: 'Multi-Timeframe Spatial Mesh', color: 'cyan' },
      { label: 'Imbalance Engine', val: 'Fair Value Gap Cleared', color: 'green' },
      { label: 'Accuracy Rating', val: '97.8% Precision Score', color: 'gold' }
    ],
    logs: [
      { time: '17:12:44', type: 'engine', text: 'GPT-4o Vision Engine analyzed spatial chart vectors and key levels.' },
      { time: '17:12:36', type: 'orderflow', text: 'Fair Value Gap mapped with 97.8% confidence on 1H timeframe.' },
      { time: '17:12:28', type: 'risk', text: 'Target projection calibrated for optimal risk-adjusted reward.' }
    ]
  },
  'DeepReasoning': {
    name: 'DeepReasoning Risk Engine',
    category: 'Autonomous Guard',
    activeTabLabel: 'RISK COPILOT',
    prompt: 'Calculate dynamic position sizing and automated trailing stop-loss parameters.',
    confidence: '99.1% Guard Reliability',
    recommendation: 'AUTOMATED RISK GUARD ACTIVE',
    statusTag: 'DYNAMIC GUARD',
    pipelineSteps: [
      { step: '01', name: 'Volatility Engine', status: 'Metrics Scanned', detail: 'Real-Time Volatility Guard' },
      { step: '02', name: 'R:R Optimizer', status: 'Ratio Calibrated', detail: 'Optimal Risk Ceiling Applied' },
      { step: '03', name: 'Stop Protection', status: 'Trailing Active', detail: 'Dynamic Stop Loss Safeguard' }
    ],
    keyTakeaways: [
      { label: 'Volatility Guard', val: 'Real-Time Volatility Scanned', color: 'green' },
      { label: 'Risk Ratio', val: '1 : 3.8 Optimal Calibration', color: 'gold' },
      { label: 'Guard Status', val: '99.1% Dynamic Protection', color: 'cyan' }
    ],
    logs: [
      { time: '17:12:45', type: 'engine', text: 'DeepReasoning Engine computed real-time volatility distribution.' },
      { time: '17:12:40', type: 'orderflow', text: 'Optimal risk ratio calculated at 1:3.8 risk-reward balance.' },
      { time: '17:12:32', type: 'risk', text: 'Dynamic trailing guard active with automated risk mitigation.' }
    ]
  }
};

export default function AiAssistant() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeModel, setActiveModel] = useState('Neural-v4.2');
  const [isPaused, setIsPaused] = useState(false);

  // Sync active model key when feature tab changes
  useEffect(() => {
    const feature = featureData[activeTab];
    const key = feature.modelKey;
    setActiveModel(key);
  }, [activeTab]);

  // Auto-cycle through feature tabs
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % featureData.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const cfg = modelConfigurations[activeModel] || modelConfigurations['Neural-v4.2'];

  // Render feature icon based on type
  const renderIcon = (type) => {
    switch (type) {
      case 'lightning':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'robot':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2.2"/>
            <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2.2"/>
            <path d="M12 7V11" stroke="currentColor" strokeWidth="2.2"/>
            <line x1="8" y1="16" x2="8.01" y2="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="16" y1="16" x2="16.01" y2="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        );
      case 'gauge':
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2.2"/>
          </svg>
        );
    }
  };

  return (
    <section 
      className={styles.aiAssistant}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="AI Assistant Section"
    >
      {/* Background Ambient Glows */}
      <div className={styles.ambientGlowLeft} aria-hidden="true" />
      <div className={styles.ambientGlowRight} aria-hidden="true" />

      <div className='container'>
        <div className={styles.gridWrapper}>
          
          {/* Left Column: Interactive Feature Selection Deck */}
          <motion.div 
            className={styles.leftContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.badgeWrapper}>
              <Textbutton text="AI ASSISTANT" />
              <div className={styles.neuralEngineBadge}>
                <span className={styles.enginePulseDot} />
                <span>POWERED BY NEURAL-v4.2</span>
              </div>
            </div>

            <h2 className={styles.mainTitle}>
              YOUR PERSONAL AI <br />
              <span>INTELLIGENCE ASSISTANT</span>
            </h2>

            <p className={styles.subtext}>
              Analyze complex market dynamics with <span className={styles.textHighlight}>institutional precision</span>, 
              identify high-probability patterns, and execute intelligent risk-managed strategies backed by 
              continuous <span className={styles.textHighlight}>machine learning</span>.
            </p>

            {/* Interactive Feature Deck List */}
            <div className={styles.featuresList}>
              {featureData.map((item, index) => {
                const isActive = activeTab === index;
                return (
                  <div
                    key={item.id}
                    className={`${styles.featureItem} ${isActive ? styles.featureActive : ''}`}
                    onClick={() => {
                      setActiveTab(index);
                      setIsPaused(true);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveTab(index)}
                  >
                    {/* Active Accent Pillar Bar */}
                    {isActive && <div className={styles.activePillarBar} />}

                    <div className={styles.featureHeaderRow}>
                      <div className={styles.iconCircle}>
                        {renderIcon(item.iconType)}
                      </div>
                      
                      <div className={styles.featureText}>
                        <div className={styles.titleMetaRow}>
                          <div className={styles.titleWithStep}>
                            <span className={styles.stepNum}>{item.step}</span>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                          </div>
                          <span className={styles.miniBadge}>{item.badge}</span>
                        </div>

                        <p className={styles.itemDesc}>{item.desc}</p>
                        
                        <div className={styles.metaFooterRow}>
                          <span className={styles.metricBadge}>
                            <span className={styles.metricDot} />
                            {item.metric}
                          </span>
                          <span className={styles.symbolTag}>
                            {item.modelKey}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Glowing Accent Progress Bar for Active Tab Auto-Cycling */}
                    {isActive && (
                      <div className={styles.progressBarTrack}>
                        <motion.div
                          className={styles.progressBarFill}
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{
                            duration: isPaused ? 0 : 6.5,
                            ease: 'linear'
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: AI Copilot Reasoning & Conversation Console (No Stock Tickers / No Trading Numbers) */}
          <motion.div 
            className={styles.rightColumn}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.intelligenceTerminalCard}>
              
              {/* Terminal Header Bar */}
              <div className={styles.terminalHeader}>
                <div className={styles.leftHeaderCluster}>
                  <div className={styles.windowControls} aria-hidden="true">
                    <span className={styles.controlDotRed} />
                    <span className={styles.controlDotYellow} />
                    <span className={styles.controlDotGreen} />
                  </div>

                  <div className={styles.activeAssetBadge}>
                    <span className={styles.liveBeacon} />
                    <span className={styles.assetTicker}>{activeModel}</span>
                    <span className={styles.assetSubName}>{cfg.name}</span>
                  </div>
                </div>

                {/* Model Switcher Tabs */}
                <div className={styles.symbolSelectorTabs}>
                  {['Neural-v4.2', 'GPT-4o Vision', 'DeepReasoning'].map((mKey) => (
                    <button
                      key={mKey}
                      type="button"
                      className={`${styles.symTabBtn} ${activeModel === mKey ? styles.symTabActive : ''}`}
                      onClick={() => {
                        setActiveModel(mKey);
                        const idx = featureData.findIndex(f => f.modelKey === mKey);
                        if (idx !== -1) setActiveTab(idx);
                      }}
                    >
                      {mKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Intelligence Hub Content - Non-Trading AI Copilot Interface */}
              <div className={styles.terminalBody}>
                
                {/* 1. Live AI Prompt Query Card */}
                <div className={styles.promptQueryCard}>
                  <div className={styles.queryHeaderRow}>
                    <div className={styles.queryUserBadge}>
                      <span className={styles.userIcon}>💬</span>
                      <span className={styles.queryTitle}>ACTIVE AI PROMPT ANALYSIS</span>
                    </div>
                    <span className={styles.latencyPill}>Latency: &lt; 12ms</span>
                  </div>
                  <p className={styles.promptText}>"{cfg.prompt}"</p>
                </div>

                {/* 2. AI Recommendation & Confidence Score Hero Banner */}
                <div className={styles.priceHeaderRow}>
                  <div className={styles.livePriceGroup}>
                    <div className={styles.heroRecLabel}>AI REASONING OUTPUT</div>
                    <div className={styles.heroRecValue}>{cfg.recommendation}</div>
                  </div>

                  {/* AI Confidence Hero Pill */}
                  <div className={styles.aiSignalHeroBox}>
                    <div className={styles.signalHeader}>
                      <span className={styles.pulseDot} />
                      <span className={styles.signalTitle}>CONFIDENCE SCORE</span>
                    </div>
                    <div className={styles.signalValueRow}>
                      <span className={styles.signalText}>{cfg.confidence}</span>
                      <span className={styles.confidencePill}>{cfg.statusTag}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Multimodal Reasoning Matrix - 3 Stage Processing Cards */}
                <div className={styles.reasoningPipelineSection}>
                  <div className={styles.sectionLabel}>REASONING & EXECUTION PIPELINE</div>
                  <div className={styles.pipelineGrid}>
                    {cfg.pipelineSteps.map((stepItem, i) => (
                      <div key={i} className={styles.pipelineCard}>
                        <div className={styles.pHeader}>
                          <span className={styles.pStepBadge}>{stepItem.step}</span>
                          <span className={styles.pCheckIcon}>✓</span>
                        </div>
                        <div className={styles.pName}>{stepItem.name}</div>
                        <div className={styles.pStatus}>{stepItem.status}</div>
                        <div className={styles.pDetail}>{stepItem.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Active Strategy Key Insights Cards */}
                <div className={styles.keyInsightsGrid}>
                  {cfg.keyTakeaways.map((item, idx) => (
                    <div key={idx} className={styles.takeawayCard}>
                      <span className={styles.tLabel}>{item.label}</span>
                      <span className={item.color === 'gold' ? styles.tValGold : item.color === 'green' ? styles.tValGreen : styles.tValCyan}>
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 5. Live AI Thought & Reasoning Stream Console */}
                <div className={styles.streamConsole}>
                  <div className={styles.consoleHeader}>
                    <div className={styles.consoleTitleGroup}>
                      <span className={styles.consoleBeacon} />
                      <span className={styles.consoleTitle}>REAL-TIME AI REASONING STREAM</span>
                    </div>
                    <span className={styles.engineBadge}>Model: {activeModel}</span>
                  </div>

                  <div className={styles.logStreamList}>
                    <AnimatePresence mode="wait">
                      {cfg.logs.map((log, i) => (
                        <motion.div 
                          key={`${activeModel}-${i}`}
                          className={styles.logItem}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.3, delay: i * 0.08 }}
                        >
                          <span className={styles.logTime}>{log.time}</span>
                          <span className={styles.logIcon}>
                            {log.type === 'engine' ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="10" rx="2" />
                                <circle cx="12" cy="5" r="2" />
                                <path d="M12 7v4" />
                                <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
                                <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
                              </svg>
                            ) : log.type === 'orderflow' ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <polyline points="9 12 11 14 15 10" />
                              </svg>
                            )}
                          </span>
                          <span className={styles.logText}>{log.text}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

              </div>

              {/* Terminal Footer HUD */}
              <div className={styles.terminalFooter}>
                <div className={styles.hudTile}>
                  <span className={styles.hudLabel}>ACTIVE MODEL</span>
                  <span className={styles.hudValGold}>{activeModel}</span>
                </div>
                <div className={styles.hudTile}>
                  <span className={styles.hudLabel}>RESPONSE SPEED</span>
                  <span className={styles.hudValGreen}>&lt; 12ms</span>
                </div>
                <div className={styles.hudTile}>
                  <span className={styles.hudLabel}>PRECISION RATING</span>
                  <span className={styles.hudValGold}>{cfg.confidence}</span>
                </div>
                <div className={styles.hudTile}>
                  <span className={styles.hudLabel}>COPILOT GUARD</span>
                  <span className={styles.hudValGreen}>ACTIVE</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
