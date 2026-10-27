"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import styles from './publicAffiliate.module.scss';

const STEPS = [
  {
    num: "01 — SIGN UP",
    title: "Create Your Account",
    desc: "Create your affiliate account and get started in just a few steps."
  },
  {
    num: "02 — SHARE YOUR LINK",
    title: "Share With Your Audience",
    desc: "Get your unique referral link and start sharing it with your audience."
  },
  {
    num: "03 — EARN COMMISSIONS",
    title: "Collect Recurring Rewards",
    desc: "Receive eligible commissions from qualifying referral activity according to the program terms."
  }
];

export default function HowItWorksSection({ refProp, onJoinClick }) {
  const { t } = useLanguage();
  return (
    <section ref={refProp} className={styles.howItWorksSection}>
      <div className="container">
        <SectionHeader
          badge={t('publicAffiliate.howItWorksBadge', 'HOW IT WORKS')}
          title1="Three Simple Steps to"
          title2="Start Earning"
          description={t('publicAffiliate.howItWorksSubtitle', 'Join the TraderMaster affiliate program, share your unique referral link, and earn commissions when qualifying activity is generated through your referrals.')}
        />

        <div className={styles.stepsGrid}>
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              className={styles.stepCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.stepNumBadge}>{step.num}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className={styles.ctaContainer}>
          <button className={styles.heroPrimaryBtn} onClick={onJoinClick}>
            JOIN AFFILIATE PROGRAM →
          </button>
        </div>
      </div>
    </section>
  );
}
