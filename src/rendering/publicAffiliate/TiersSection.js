"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import styles from './publicAffiliate.module.scss';

export default function TiersSection({ refProp, onJoinClick }) {
  const { t } = useLanguage();
  return (
    <section ref={refProp} className={styles.tiersSection}>
      <div className="container">
        <SectionHeader
          badge={t('publicAffiliate.tiersBadge', 'COMMISSION & TIERS')}
          title1="Higher Traffic."
          title2="Bigger Rewards."
          description={t('publicAffiliate.tiersSubtitle', 'Build your referral network and unlock higher commission opportunities as you reach the applicable program milestones.')}
        />

        <div className={styles.tiersGrid}>
          {/* Tier 1 Card */}
          <motion.div
            className={styles.tierCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.tierHeader}>
              <div className={styles.tierName}>{t('publicAffiliate.tier1Title', 'TIER 1 — STANDARD PARTNER')}</div>
              <div className={styles.tierRate}>10% <span>{t('publicAffiliate.recurring', 'Recurring')}</span></div>
              <p className={styles.tierDesc}>{t('publicAffiliate.tier1Desc', 'Start earning with the standard affiliate level.')}</p>
            </div>

            <div className={styles.checklist}>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier1Comm', '10% recurring commission')}</div>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier1Auto', 'Automated payouts according to program terms')}</div>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier1Min', 'Minimum withdrawal threshold')}</div>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier1Analytics', 'Standard affiliate analytics')}</div>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier1Link', 'Personal referral link')}</div>
            </div>

            <button className={styles.heroSecondaryBtn} onClick={onJoinClick}>
              START EARNING
            </button>
          </motion.div>

          {/* Tier 2 Pro Partner Card */}
          <motion.div
            className={`${styles.tierCard} ${styles.proTier}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className={styles.proBadge}>{t('publicAffiliate.mostRewarding', 'MOST REWARDING')}</span>
            <div className={styles.tierHeader}>
              <div className={styles.tierName}>{t('publicAffiliate.tier2Title', 'TIER 2 — PRO PARTNER')}</div>
              <div className={styles.tierRate}>20% <span>{t('publicAffiliate.recurring', 'Recurring')}</span></div>
              <p className={styles.tierDesc}>{t('publicAffiliate.tier2Desc', 'Grow your active referral network and unlock the Pro Partner tier when you meet qualification requirements.')}</p>
            </div>

            <div className={styles.checklist}>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier2Comm', '20% recurring commission')}</div>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier2Priority', 'Priority partner benefits')}</div>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier2Enhanced', 'Enhanced payout options where applicable')}</div>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier2Lower', 'Lower withdrawal threshold where applicable')}</div>
              <div className={styles.checkItem}><span className={styles.checkIcon}>✓</span> {t('publicAffiliate.tier2Support', 'Dedicated partner support')}</div>
            </div>

            <button className={styles.heroPrimaryBtn} onClick={onJoinClick}>
              VIEW COMMISSION DETAILS
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
