"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from './backtesting.module.scss';

const STRATEGIES = [
  { id: 'ai-trend', name: 'AI Neural Trend Master (Pre-Built Bot)', winRate: '68.2%', returnVal: '+24.38%', factor: '2.41', drawdown: '-5.8%', trades: '482' },
  { id: 'rsi-macd', name: 'RSI + MACD Momentum Crossover', winRate: '64.5%', returnVal: '+19.82%', factor: '2.15', drawdown: '-7.2%', trades: '364' },
  { id: 'breakout', name: 'Volatile Breakout & Scalper Bot', winRate: '71.0%', returnVal: '+31.45%', factor: '2.85', drawdown: '-4.9%', trades: '620' },
  { id: 'custom-mean', name: 'Custom Mean Reversion Quant', winRate: '62.8%', returnVal: '+16.70%', factor: '1.92', drawdown: '-6.4%', trades: '295' }
];

const SYMBOLS = ['EUR/USD', 'BTC/USD', 'XAU/USD (Gold)', 'AAPL', 'ETH/USD', 'GBP/USD'];
const TIMEFRAMES = ['5m', '15m', '1H', '4H', '1D'];
const DATES = ['Last 6 Months', 'Last 1 Year', 'Last 3 Years', 'Custom Range'];

export default function InteractiveSimulator({ refProp }) {
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGIES[0].id);
  const [selectedDate, setSelectedDate] = useState('Last 1 Year');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(100);

  const currentStrat = STRATEGIES.find(s => s.id === selectedStrategy) || STRATEGIES[0];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSimProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 180);
  };

  return (
    <section ref={refProp} className={styles.simulatorSection} id="simulator">
      <div className="container">
        {/* Section Header */}
        <SectionHeader
          badge="LIVE backtest Simulation"
          title1="Simulate Strategies with"
          title2="Verified Tick Market Data"
          description="Select your symbol, timeframe, trading bot logic, and historical date range to test performance before live execution."
        />

        <motion.div
          className={styles.simulatorContainer}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header Row */}
          <div className={styles.simulatorHeader}>
            <div className={styles.simTitleGroup}>
              <span className={styles.simLiveTag}>
                <span className={styles.simDot} />
                LIVE SIMULATOR PLAYGROUND
              </span>
              <h2 className={styles.simTitle}>Backtest Engine Terminal</h2>
            </div>
            <span style={{ fontSize: '13px', opacity: 0.7 }}>
              Historical Data: <strong style={{ color: '#18c98b' }}>Verified Tick Feed</strong>
            </span>
          </div>

          {/* Controls Form Grid */}
          <div className={styles.simControlsRow}>
            {/* Symbol */}
            <div className={styles.controlField}>
              <label className={styles.controlLabel}>Symbol / Asset</label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className={styles.controlSelect}
              >
                {SYMBOLS.map(sym => <option key={sym} value={sym}>{sym}</option>)}
              </select>
            </div>

            {/* Timeframe */}
            <div className={styles.controlField}>
              <label className={styles.controlLabel}>Timeframe</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className={styles.controlSelect}
              >
                {TIMEFRAMES.map(tf => <option key={tf} value={tf}>{tf}</option>)}
              </select>
            </div>

            {/* Strategy / Bot */}
            <div className={styles.controlField}>
              <label className={styles.controlLabel}>Strategy / Trading Bot</label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className={styles.controlSelect}
              >
                {STRATEGIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            {/* Historical Range */}
            <div className={styles.controlField}>
              <label className={styles.controlLabel}>Historical Date Range</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.controlSelect}
              >
                {DATES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Run Button */}
          <div className={styles.runBtnWrapper}>
            <button
              type="button"
              className={styles.runSimBtn}
              onClick={handleRunSimulation}
              disabled={isSimulating}
            >
              {isSimulating ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
                  <span>Processing Historical Data... ({simProgress}%)</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>RUN BACKTEST SIMULATION</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          <div className={styles.chartStatsGrid}>
            {/* Left: SVG Equity Curve Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h3 className={styles.chartTitle}>Simulated Equity Growth Curve</h3>
                  <span style={{ fontSize: '12px', opacity: 0.65 }}>
                    {selectedSymbol} • {selectedTimeframe} • {selectedDate}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={styles.equityValue}>{currentStrat.returnVal}</span>
                  <div style={{ fontSize: '12px', color: '#18c98b', fontWeight: 600 }}>Total Growth</div>
                </div>
              </div>

              <div className={styles.svgChartWrap}>
                <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#18c98b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#18c98b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(24,201,139,0.1)" strokeDasharray="4 4" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(24,201,139,0.1)" strokeDasharray="4 4" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(24,201,139,0.1)" strokeDasharray="4 4" />

                  {/* Area Fill */}
                  <path
                    d="M 0 160 L 0 140 Q 60 120, 120 130 T 240 80 T 360 60 T 500 20 L 500 180 L 0 180 Z"
                    fill="url(#equityGrad)"
                  />

                  {/* Equity Line */}
                  <motion.path
                    d="M 0 140 Q 60 120, 120 130 T 240 80 T 360 60 T 500 20"
                    fill="none"
                    stroke="#18c98b"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />

                  {/* Interactive Nodes */}
                  <circle cx="120" cy="130" r="4" fill="#18c98b" />
                  <circle cx="240" cy="80" r="4" fill="#18c98b" />
                  <circle cx="360" cy="60" r="4" fill="#18c98b" />
                  <circle cx="500" cy="20" r="5" fill="#00F2FE" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Right: Key Performance Metrics List */}
            <div className={styles.metricsListCard}>
              <div className={styles.metricTile}>
                <span className={styles.metricTileLabel}>Win Rate</span>
                <span className={`${styles.metricTileValue} ${styles.positive}`}>{currentStrat.winRate}</span>
              </div>
              <div className={styles.metricTile}>
                <span className={styles.metricTileLabel}>Total Return</span>
                <span className={`${styles.metricTileValue} ${styles.positive}`}>{currentStrat.returnVal}</span>
              </div>
              <div className={styles.metricTile}>
                <span className={styles.metricTileLabel}>Profit Factor</span>
                <span className={styles.metricTileValue}>{currentStrat.factor}</span>
              </div>
              <div className={styles.metricTile}>
                <span className={styles.metricTileLabel}>Max Drawdown</span>
                <span className={styles.metricTileValue} style={{ color: '#EF4444' }}>{currentStrat.drawdown}</span>
              </div>
              <div className={styles.metricTile}>
                <span className={styles.metricTileLabel}>Total Trades</span>
                <span className={styles.metricTileValue}>{currentStrat.trades}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
