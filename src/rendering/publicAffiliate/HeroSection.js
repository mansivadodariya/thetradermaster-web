"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './publicAffiliate.module.scss';

const HIGHLIGHTS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Up to 20% Recurring Commissions"
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: "Real-Time Tracking & Analytics"
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: "Flexible Payout Options"
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Dedicated Partner Support"
  }
];

export default function HeroSection({ onJoinClick, onHowItWorksClick }) {
  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroBadge}>
          <span className={styles.pulseDot} />
          TraderMaster Affiliate Program
        </div>

        <h1 className={styles.heroTitle}>
          Earn More with <br />
          <span className={styles.highlight}>TraderMaster Affiliate Program</span>
        </h1>

        <p className={styles.heroSubtext}>
          Share TraderMaster with your audience and earn recurring commissions from qualifying referral activity. It's simple, transparent, and built to help you grow your network.
        </p> 

        <div className={styles.heroCtaGroup}>
          <button className={styles.heroPrimaryBtn} onClick={onJoinClick}>
            JOIN NOW
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button className={styles.heroSecondaryBtn} onClick={onHowItWorksClick}>
            HOW IT WORKS
          </button>
        </div>

        <div className={styles.heroHighlightsGrid}>
          {HIGHLIGHTS.map((item, index) => (
            <motion.div
              key={index}
              className={styles.highlightCard}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className={styles.iconBox}>{item.icon}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
