"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import styles from './publicAffiliate.module.scss';

const STATS = [
  { val: "10,000+", label: "Traders Worldwide" },
  { val: "$2M+", label: "Total Affiliate Payouts" },
  { val: "20%", label: "Maximum Commission Rate" },
  { val: "1 Platform", label: "For Your Network" }
];

export default function StatsSection() {
  const { t } = useLanguage();
  return (
    <section className={styles.statsSection}>
      <div className="container">
        <SectionHeader
          badge={t('publicAffiliate.growBadge', 'GROW WITH CHRONOSX')}
          title1="Build Your Network."
          title2="Track Your Growth."
          description={t('publicAffiliate.growSubtitle', 'Use your affiliate dashboard to monitor your referral activity, earnings, pending commissions, and withdrawals.')}
        />

        <div className={styles.statsGrid}>
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              className={styles.statCard}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <div className={styles.statValue}>{stat.val}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
