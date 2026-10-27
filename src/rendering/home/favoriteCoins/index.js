"use client";
import { useLanguage } from '@/context/LanguageContext';
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate, navigateFeature } from '@/lib/authRedirect';
import { useLiveTickerPrices } from '@/lib/useLiveTickerPrices';
import styles from './favoriteCoins.module.scss';
import SectionHeader from '@/components/sectionHeader';

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// TradingView Symbol Logo Component with Fallback
function TradingViewLogo({ logoUrl, name, color, fallbackChar }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={styles.iconWrapper}>
      {!imgError && logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} TradingView Symbol`}
          className={styles.logoImg}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={styles.fallbackChar} style={{ color: color || '#6EE7B7' }}>
          {fallbackChar || name.charAt(0)}
        </span>
      )}
    </div>
  );
}

// Mini Sparkline Curve Component
function SparklineCurve({ isUp }) {
  const strokeColor = isUp ? '#34D399' : '#F87171';
  const pathD = isUp
    ? 'M 2 15 Q 12 16, 22 10 T 42 3'
    : 'M 2 3 Q 12 5, 22 12 T 42 17';

  return (
    <div className={styles.sparklineGraph}>
      <svg viewBox="0 0 44 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={pathD} stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Row 1 Assets (Forex Pairs 1-8) - Official TradingView Symbol Logos & Truth Details
const row1Assets = [
  {
    name: 'XAU / USD',
    symbol: 'XAUUSD',
    price: '4,171.41',
    change: '+0.14%',
    isUp: true,
    signal: 'STRONG BUY',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/metal/gold.svg',
    fallbackChar: 'Au',
    color: '#F59E0B'
  },
  {
    name: 'EUR / USD',
    symbol: 'EURUSD',
    price: '1.1221',
    change: '-0.16%',
    isUp: false,
    signal: 'BEARISH',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/EU.svg',
    fallbackChar: '€',
    color: '#003399'
  },
  {
    name: 'USD / JPY',
    symbol: 'USDJPY',
    price: '158.179',
    change: '+0.13%',
    isUp: true,
    signal: 'BULLISH',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/JP.svg',
    fallbackChar: '¥',
    color: '#BC002D'
  },
  {
    name: 'GBP / USD',
    symbol: 'GBPUSD',
    price: '1.3335',
    change: '+0.10%',
    isUp: true,
    signal: 'CONFLUENCE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/GB.svg',
    fallbackChar: '£',
    color: '#C8102E'
  },
  {
    name: 'AUD / USD',
    symbol: 'AUDUSD',
    price: '0.6987',
    change: '+0.60%',
    isUp: true,
    signal: 'BULLISH',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/AU.svg',
    fallbackChar: 'A$',
    color: '#00008B'
  },
  {
    name: 'USD / CAD',
    symbol: 'USDCAD',
    price: '1.4080',
    change: '-0.41%',
    isUp: false,
    signal: 'BEARISH',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/CA.svg',
    fallbackChar: 'C$',
    color: '#FF0000'
  },
  {
    name: 'USD / CHF',
    symbol: 'USDCHF',
    price: '0.8251',
    change: '+0.13%',
    isUp: true,
    signal: 'STRONG BUY',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/CH.svg',
    fallbackChar: 'Fr',
    color: '#D52B1E'
  },
  {
    name: 'NZD / USD',
    symbol: 'NZDUSD',
    price: '0.5668',
    change: '+0.35%',
    isUp: true,
    signal: 'STABLE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/NZ.svg',
    fallbackChar: 'NZ$',
    color: '#00247D'
  },
  {
    name: 'EUR / JPY',
    symbol: 'EURJPY',
    price: '177.491',
    change: '-0.03%',
    isUp: false,
    signal: 'MOMENTUM',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/EU.svg',
    fallbackChar: '€',
    color: '#003399'
  }
];

// Row 2 Assets (Forex Pairs 9-15) - Official TradingView Symbol Logos & Truth Details
const row2Assets = [
  {
    name: 'GBP / JPY',
    symbol: 'GBPJPY',
    price: '198.400',
    change: '+0.65%',
    isUp: true,
    signal: 'BREAKOUT',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/GB.svg',
    fallbackChar: '£',
    color: '#C8102E'
  },
  {
    name: 'EUR / GBP',
    symbol: 'EURGBP',
    price: '0.8385',
    change: '-0.15%',
    isUp: false,
    signal: 'CONFLUENCE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/EU.svg',
    fallbackChar: '€',
    color: '#003399'
  },
  {
    name: 'AUD / JPY',
    symbol: 'AUDJPY',
    price: '101.200',
    change: '+0.48%',
    isUp: true,
    signal: 'BUY',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/AU.svg',
    fallbackChar: 'A$',
    color: '#00008B'
  },
  {
    name: 'EUR / AUD',
    symbol: 'EURAUD',
    price: '1.6420',
    change: '-0.22%',
    isUp: false,
    signal: 'RANGE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/EU.svg',
    fallbackChar: '€',
    color: '#003399'
  },
  {
    name: 'CAD / JPY',
    symbol: 'CADJPY',
    price: '111.850',
    change: '+0.32%',
    isUp: true,
    signal: 'TREND',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/CA.svg',
    fallbackChar: 'C$',
    color: '#FF0000'
  },
  {
    name: 'GBP / AUD',
    symbol: 'GBPAUD',
    price: '1.9560',
    change: '+0.45%',
    isUp: true,
    signal: 'STRONG BUY',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/GB.svg',
    fallbackChar: '£',
    color: '#C8102E'
  },
  {
    name: 'EUR / CHF',
    symbol: 'EURCHF',
    price: '0.9380',
    change: '+0.08%',
    isUp: true,
    signal: 'STABLE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/EU.svg',
    fallbackChar: '€',
    color: '#003399'
  }
];

export default function FavoriteCoins() {
  const { t } = useLanguage();
  const router = useRouter();

  const allInitialAssets = useMemo(() => [...row1Assets, ...row2Assets], []);
  const { assets: liveAllAssets, flashMap } = useLiveTickerPrices(allInitialAssets);

  const liveRow1 = liveAllAssets.slice(0, row1Assets.length);
  const liveRow2 = liveAllAssets.slice(row1Assets.length);

  // Duplicate arrays 3x for seamless infinite marquee loop
  const marqueeRow1 = [...liveRow1, ...liveRow1, ...liveRow1];
  const marqueeRow2 = [...liveRow2, ...liveRow2, ...liveRow2];

  const signalMap = {
    'BULLISH': t('homeSections.favoriteCoins.signals.bullish', 'BULLISH'),
    'BEARISH': t('homeSections.favoriteCoins.signals.bearish', 'BEARISH'),
    'STRONG BUY': t('homeSections.favoriteCoins.signals.strongBuy', 'STRONG BUY'),
    'CONFLUENCE': t('homeSections.favoriteCoins.signals.confluence', 'CONFLUENCE'),
    'MOMENTUM': t('homeSections.favoriteCoins.signals.momentum', 'MOMENTUM'),
    'BREAKOUT': t('homeSections.favoriteCoins.signals.breakout', 'BREAKOUT'),
    'BUY': t('homeSections.favoriteCoins.signals.buy', 'BUY'),
    'RANGE': t('homeSections.favoriteCoins.signals.range', 'RANGE'),
    'TREND': t('homeSections.favoriteCoins.signals.trend', 'TREND'),
    'STABLE': t('homeSections.favoriteCoins.signals.stable', 'STABLE'),
  };

  const getAssetData = (item) => ({
    price: item.price,
    change: item.change,
    isUp: item.isUp,
    signal: signalMap[item.signal] || item.signal
  });

  return (
    <section className={styles.favoriteCoinsSection} aria-label="TradingView Verified Asset Markets">
      <div className="container">
        {/* Section Header */}
        <SectionHeader
          badge={t('homeSections.favoriteCoins.badge', 'TRADINGVIEW VERIFIED SYMBOLS · LIVE MARKETS')}
          title1={t('homeSections.favoriteCoins.title1', 'Trade your')}
          title2={t('homeSections.favoriteCoins.title2', 'favorite pairs & assets')}
          breakLine={false}
          description={t('homeSections.favoriteCoins.description', 'Sub-second real-time neural telemetry across Forex, Indices, and Commodities with institutional AI signals.')}
        />
      </div>

      {/* Infinite Continuous Looping Marquee */}
      <div className={styles.marqueeContainer}>
        {/* Row 1: Scrolling Left */}
        <div className={`${styles.marqueeTrack} ${styles.trackLeft}`}>
          {marqueeRow1.map((item, idx) => {
            const data = getAssetData(item);
            const flashDir = flashMap[item.symbol];
            return (
              <div key={`row1-${idx}`} className={styles.assetCard} onClick={() => navigateFeature(router, '/ai-chart-scanner', '/chart-scanner')}>
                <TradingViewLogo
                  logoUrl={item.logoUrl}
                  name={item.name}
                  color={item.color}
                  fallbackChar={item.fallbackChar}
                />
                <div className={styles.assetContent}>
                  <div className={styles.topRow}>
                    <div className={styles.nameGroup}>
                      <span className={styles.assetName}>{item.name}</span>
                      <span className={styles.tvSymbol}>{item.symbol}</span>
                    </div>
                    <span className={styles.signalTag}>{data.signal}</span>
                  </div>
                  <div className={styles.bottomRow}>
                    <div className={styles.priceGroup}>
                      <span className={`${styles.priceText} ${flashDir === 'up' ? styles.flashUp : flashDir === 'down' ? styles.flashDown : ''}`}>
                        {data.price}
                      </span>
                      <span className={`${styles.changeBadge} ${data.isUp ? styles.green : styles.red}`}>
                        {data.change}
                      </span>
                    </div>
                    <SparklineCurve isUp={data.isUp} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2: Scrolling Right */}
        <div className={`${styles.marqueeTrack} ${styles.trackRight}`}>
          {marqueeRow2.map((item, idx) => {
            const data = getAssetData(item);
            const flashDir = flashMap[item.symbol];
            return (
              <div key={`row2-${idx}`} className={styles.assetCard} onClick={() => navigateFeature(router, '/ai-chart-scanner', '/chart-scanner')}>
                <TradingViewLogo
                  logoUrl={item.logoUrl}
                  name={item.name}
                  color={item.color}
                  fallbackChar={item.fallbackChar}
                />
                <div className={styles.assetContent}>
                  <div className={styles.topRow}>
                    <div className={styles.nameGroup}>
                      <span className={styles.assetName}>{item.name}</span>
                      <span className={styles.tvSymbol}>{item.symbol}</span>
                    </div>
                    <span className={styles.signalTag}>{data.signal}</span>
                  </div>
                  <div className={styles.bottomRow}>
                    <div className={styles.priceGroup}>
                      <span className={`${styles.priceText} ${flashDir === 'up' ? styles.flashUp : flashDir === 'down' ? styles.flashDown : ''}`}>
                        {data.price}
                      </span>
                      <span className={`${styles.changeBadge} ${data.isUp ? styles.green : styles.red}`}>
                        {data.change}
                      </span>
                    </div>
                    <SparklineCurve isUp={data.isUp} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="container">
        <motion.div 
          className={styles.ctaWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            type="button" 
            className={styles.ctaBtn}
            onClick={() => authNavigate(router, '/chart-scanner')}
          >
            <span>{t('homeSections.favoriteCoins.ctaBtn', 'SIGN UP & START SCANNING')}</span>
            <ArrowRightIcon />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
