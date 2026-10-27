"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';
import styles from './herobanner.module.scss';
import { AiChipIcon, TrendChartIcon, RiskAlertIcon } from './heroIcons';

export default React.memo(function HeroFeatureCards() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className={styles.heroCardsRow}>
      {/* 1. Left Card: AI Chart Scanner */}
      <div
        className={`${styles.featureCard} ${styles.cardNormal}`}
        onClick={() => authNavigate(router, '/chart-scanner')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && authNavigate(router, '/chart-scanner')}
      >
        <div className={styles.cardIconBox}>
          <AiChipIcon className={styles.cardSvgIcon} width={38} height={38} />
        </div>
        <div className={styles.cardTextCol}>
          <div className={styles.cardHeaderRow}>
            <h3 className={styles.cardTitle}>
              {t('header.products.chartScanner.title', 'AI Chart Scanner')}
            </h3>
            <span className={styles.cardMiniBadge}>{t('homeSections.hero.cards.visionBadge', 'VISION')}</span>
          </div>
          <p className={styles.cardDesc}>
            {t('homeSections.hero.cards.analysisDesc', 'Multi-timeframe technical pattern detection and neural OCR chart vision.')}
          </p>
        </div>
      </div>

      {/* 2. Center Card: AI Trading Signal */}
      <div
        className={`${styles.featureCard} ${styles.cardNormal}`}
        onClick={() => authNavigate(router, '/trading-signal')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && authNavigate(router, '/trading-signal')}
      >
        <div className={styles.cardIconBox}>
          <TrendChartIcon className={styles.cardSvgIcon} width={38} height={38} />
        </div>
        <div className={styles.cardTextCol}>
          <div className={styles.cardHeaderRow}>
            <h3 className={styles.cardTitle}>
              {t('header.products.strategyHub.title', 'AI Trading Signal')}
            </h3>
            <span className={styles.cardMiniBadge}>{t('homeSections.hero.cards.platformBadge', 'PLATFORM')}</span>
          </div>
          <p className={styles.cardDesc}>
            {t('homeSections.hero.cards.strategyDesc', 'Execute live market intelligence, algorithmic playbooks, and quant signals.')}
          </p>
        </div>
      </div>

      {/* 3. Right Card: AI Past Trade Analyzer */}
      <div
        className={`${styles.featureCard} ${styles.cardNormal}`}
        onClick={() => authNavigate(router, '/trade-advisor')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && authNavigate(router, '/trade-advisor')}
      >
        <div className={styles.cardIconBox}>
          <RiskAlertIcon className={styles.cardSvgIcon} width={38} height={38} />
        </div>
        <div className={styles.cardTextCol}>
          <div className={styles.cardHeaderRow}>
            <h3 className={styles.cardTitle}>
              {t('header.tradingTools.tradeAudit.title', 'AI Past Trade Analyzer')}
            </h3>
            <span className={styles.cardMiniBadge}>{t('homeSections.hero.cards.advisorBadge', 'ADVISOR')}</span>
          </div>
          <p className={styles.cardDesc}>
            {t('homeSections.hero.cards.riskDesc', 'Review historical trading data to evaluate performance, win rates, and max drawdowns.')}
          </p>
        </div>
      </div>
    </div>
  );
});
