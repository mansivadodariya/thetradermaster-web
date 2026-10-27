"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../customBotBuilder.module.scss';

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CATEGORIES = ["All Bots", "Scalping", "Trend Following", "Breakout", "Momentum", "Reversal"];

const BOTS_DATA = [
  {
    id: 1,
    name: "Momentum Pro",
    category: "Momentum",
    pair: "EUR/USD",
    timeframe: "H1",
    return: "+32.4%",
    winRate: "71.2%",
    author: "TradeMaster"
  },
  {
    id: 2,
    name: "Trend Hunter",
    category: "Trend Following",
    pair: "XAU/USD",
    timeframe: "H4",
    return: "+28.7%",
    winRate: "69.4%",
    author: "GalaxyBots"
  },
  {
    id: 3,
    name: "Scalper X",
    category: "Scalping",
    pair: "GBP/USD",
    timeframe: "M15",
    return: "+19.8%",
    winRate: "61.5%",
    author: "AlphaTrades"
  },
  {
    id: 4,
    name: "Breakout Master",
    category: "Breakout",
    pair: "BTC/USD",
    timeframe: "H1",
    return: "+41.2%",
    winRate: "68.0%",
    author: "CryptoQuants"
  },
  {
    id: 5,
    name: "Reversal Sentinel",
    category: "Reversal",
    pair: "USD/JPY",
    timeframe: "H1",
    return: "+24.3%",
    winRate: "65.8%",
    author: "ZenithAI"
  },
  {
    id: 6,
    name: "Volatility Edge",
    category: "Momentum",
    pair: "ETH/USD",
    timeframe: "M30",
    return: "+36.1%",
    winRate: "73.5%",
    author: "QuantLab"
  }
];

export default function MarketplaceSection({ refProp }) {
  const [activeCategory, setActiveCategory] = useState("All Bots");
  const [selectedBotMsg, setSelectedBotMsg] = useState("");

  const filteredBots = BOTS_DATA.filter(bot => 
    activeCategory === "All Bots" || bot.category === activeCategory
  );

  const handleUseBot = (botName) => {
    setSelectedBotMsg(`Loaded configuration for "${botName}". Ready to backtest or edit!`);
    setTimeout(() => setSelectedBotMsg(""), 4000);
  };

  return (
    <section ref={refProp} className={styles.marketplaceSection}>
      <div className="container">
        <SectionHeader
          badge="BOT MARKETPLACE"
          title1="Discover. Explore."
          title2="Choose Your Bot."
          description="Browse a collection of ready-to-use trading bots built for different strategies, markets, and trading styles."
        />

        <div className={styles.marketplaceWrapper}>
          {/* Checklist Feature Row */}
          <div className={styles.marketplaceFeaturesRow}>
            <div className={styles.marketplaceCheckItem}>
              <div className={styles.checkIcon}><CheckIcon /></div>
              <span className={styles.checkText}>Browse Bots Across Supported Markets</span>
            </div>
            <div className={styles.marketplaceCheckItem}>
              <div className={styles.checkIcon}><CheckIcon /></div>
              <span className={styles.checkText}>View Strategy & Risk Settings</span>
            </div>
            <div className={styles.marketplaceCheckItem}>
              <div className={styles.checkIcon}><CheckIcon /></div>
              <span className={styles.checkText}>Check Historical Performance & Backtesting</span>
            </div>
            <div className={styles.marketplaceCheckItem}>
              <div className={styles.checkIcon}><CheckIcon /></div>
              <span className={styles.checkText}>Use as-is or Customize</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className={styles.categoryFilterTabs}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.filterTab} ${activeCategory === cat ? styles.activeTab : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notification Toast */}
          <AnimatePresence>
            {selectedBotMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: 'rgba(24, 201, 139, 0.2)',
                  border: '1px solid #18C98B',
                  color: '#18C98B',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}
              >
                {selectedBotMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bot Cards Grid */}
          <div className={styles.botCardsGrid}>
            {filteredBots.map((bot) => (
              <motion.div
                key={bot.id}
                className={styles.botCard}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.botCardHeader}>
                  <span className={styles.botName}>{bot.name}</span>
                  <span className={styles.strategyBadge}>{bot.category}</span>
                </div>

                <div className={styles.botMetaList}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Pair:</span>
                    <span className={styles.metaVal}>{bot.pair}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Timeframe:</span>
                    <span className={styles.metaVal}>{bot.timeframe}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Return:</span>
                    <span className={`${styles.metaVal} ${styles.positiveReturn}`}>{bot.return}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Win Rate:</span>
                    <span className={styles.metaVal}>{bot.winRate}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Created by:</span>
                    <span className={styles.metaVal}>{bot.author}</span>
                  </div>
                </div>

                <button
                  className={styles.useBotBtn}
                  onClick={() => handleUseBot(bot.name)}
                >
                  USE BOT
                </button>
              </motion.div>
            ))}
          </div>

          <div className={styles.marketplaceFooter}>
            <button className={styles.heroPrimaryBtn}>
              EXPLORE MARKETPLACE →
            </button>
            <p className={styles.disclaimerText}>
              * Example performance figures are illustrative. Historical backtests do not guarantee future live returns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
