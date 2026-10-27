"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './backtesting.module.scss';

export default function FinalCta() {
  const router = useRouter();

  const handleStartBacktesting = () => {
    authNavigate(router, '/dashboard');
  };

  return (
    <section className={styles.finalCtaSection}>
      <div className="container">
        <motion.div
          className={styles.finalCtaCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Supporting Metrics Pills */}
          <div className={styles.metricsPillRow}>
            <div className={styles.metricBadge}>
              <span className={styles.metricLabel}>Win Rate:</span>
              <span className={styles.metricVal}>68.2%</span>
            </div>
            <div className={styles.metricBadge}>
              <span className={styles.metricLabel}>Total Return:</span>
              <span className={styles.metricVal}>+24.38%</span>
            </div>
            <div className={styles.metricBadge}>
              <span className={styles.metricLabel}>Profit Factor:</span>
              <span className={styles.metricVal}>2.41</span>
            </div>
          </div>

          <h2 className={styles.finalTitle}>Turn Data Into Decisions</h2>
          <div className={styles.finalSubtitle}>Backtest Smarter. Trade Better.</div>
          <p className={styles.finalDesc}>
            Validate your strategy, understand historical performance, and make more informed trading decisions — all in one place.
          </p>

          <button
            type="button"
            className={styles.finalCtaBtn}
            onClick={handleStartBacktesting}
          >
            <span>START BACKTESTING</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
