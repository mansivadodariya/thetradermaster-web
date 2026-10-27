"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { navigateFeature } from '@/lib/authRedirect';
import { useLiveTickerPrices } from '@/lib/useLiveTickerPrices';
import styles from './herobanner.module.scss';

// Official TradingView Country Flags & Currency Logos (Real-time baseline quotes)
const TICKER_ASSETS = [
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
  },
  {
    name: 'GBP / JPY',
    symbol: 'GBPJPY',
    price: '210.929',
    change: '+0.21%',
    isUp: true,
    signal: 'BREAKOUT',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/GB.svg',
    fallbackChar: '£',
    color: '#C8102E'
  }
];

const SparklineMini = React.memo(function SparklineMini({ isUp }) {
  const strokeColor = isUp ? '#34D399' : '#F87171';
  const pathD = isUp
    ? 'M 2 14 Q 12 15, 22 9 T 42 3'
    : 'M 2 3 Q 12 5, 22 11 T 42 16';

  return (
    <div className={styles.sparklineWrap}>
      <svg viewBox="0 0 44 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={pathD} stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
});

const TickerCard = React.memo(function TickerCard({ item, flashDir, onClick }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={styles.heroTickerCard}
      dir="ltr"
      onClick={onClick}
    >
      <div className={styles.tickerLogoCircle}>
        {!imgError && item.logoUrl ? (
          <img
            src={item.logoUrl}
            alt={item.name}
            className={styles.tickerLogoImg}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={styles.tickerFallbackChar} style={{ color: item.color || '#6EE7B7' }}>
            {item.fallbackChar || item.name.charAt(0)}
          </span>
        )}
      </div>
      <div className={styles.tickerCardContent}>
        <div className={styles.tickerCardTop}>
          <span className={styles.tickerCardName}>{item.name}</span>
          <span className={styles.tickerCardSymbol}>{item.symbol}</span>
          <span className={styles.tickerSignalPill}>{item.signal}</span>
        </div>
        <div className={styles.tickerCardBottom}>
          <span className={`${styles.tickerPrice} ${flashDir === 'up' ? styles.flashUp : flashDir === 'down' ? styles.flashDown : ''}`}>
            {item.price}
          </span>
          <span className={`${styles.tickerChange} ${item.isUp ? styles.green : styles.red}`}>
            {item.change}
          </span>
          <SparklineMini isUp={item.isUp} />
        </div>
      </div>
    </div>
  );
});

export default React.memo(function HeroTickerMarquee() {
  const router = useRouter();
  const { assets: liveAssets, flashMap } = useLiveTickerPrices(TICKER_ASSETS);

  const handleCardClick = React.useCallback(() => {
    navigateFeature(router, '/ai-chart-scanner', '/chart-scanner');
  }, [router]);

  return (
    <div className={styles.heroMarqueeWrapper} aria-label="Live Market Assets Ticker" dir="ltr">
      <div className={styles.marqueeTrackWrapper} dir="ltr">
        <div className={styles.heroMarqueeTrack} dir="ltr">
          {/* First loop group */}
          <div className={styles.marqueeGroup} dir="ltr">
            {liveAssets.map((item, idx) => (
              <TickerCard
                key={`hero-ticker-a-${item.symbol || idx}`}
                item={item}
                flashDir={flashMap[item.symbol]}
                onClick={handleCardClick}
              />
            ))}
          </div>

          {/* Second identical loop group for 100% seamless, mathematically exact infinite scroll */}
          <div className={styles.marqueeGroup} aria-hidden="true" dir="ltr">
            {liveAssets.map((item, idx) => (
              <TickerCard
                key={`hero-ticker-b-${item.symbol || idx}`}
                item={item}
                flashDir={flashMap[item.symbol]}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
