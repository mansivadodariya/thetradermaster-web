"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import styles from './teamUp.module.scss';
import SectionHeader from '@/components/sectionHeader';

export default function TeamUp() {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: '/assets/icons/hex-chart.svg?v=2',
      title: t('homeSections.teamUp.pillar1Title', 'Tier-1 Liquidity Access'),
      stat: t('homeSections.teamUp.pillar1Stat', 'FROM 0.0 PIPS'),
      desc: t('homeSections.teamUp.pillar1Desc', 'Tap directly into deep institutional order books with raw spreads and zero hidden markups.')
    },
    {
      icon: '/assets/icons/hex-shield.svg?v=2',
      title: t('homeSections.teamUp.pillar2Title', 'Regulated Broker Partners'),
      stat: t('homeSections.teamUp.pillar2Stat', 'FCA · ASIC · CySEC'),
      desc: t('homeSections.teamUp.pillar2Desc', 'Connect seamlessly to fully licensed brokerages featuring segregated client accounts and top-tier compliance.')
    },
    {
      icon: '/assets/icons/hex-speed.svg?v=2',
      title: t('homeSections.teamUp.pillar3Title', 'Ultra-Low Latency Routing'),
      stat: t('homeSections.teamUp.pillar3Stat', '< 12MS LATENCY'),
      desc: t('homeSections.teamUp.pillar3Desc', 'High-speed fiber cross-connects co-located at London (LD4) and New York (NY4) financial data centers.')
    },
    {
      icon: '/assets/icons/hex-users.svg?v=2',
      title: t('homeSections.teamUp.pillar4Title', 'Institutional Scale & Uptime'),
      stat: t('homeSections.teamUp.pillar4Stat', '$4.2B+ ANALYZED'),
      desc: t('homeSections.teamUp.pillar4Desc', 'Enterprise-grade AI analytical engine with 99.99% uptime, processing high-volume tick data across global sessions.')
    }
  ];

  return (
    <section className={styles.teamUp} aria-label="Supported Brokers and Platforms">

      <div className="container">
        <div className={styles.gridWrapper}>

          {/* Left Column: Clean, Elegant Typography */}
          <motion.div
            className={styles.leftContent}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader
              align="left"
              badge={t('homeSections.teamUp.badge', 'INSTITUTIONAL INFRASTRUCTURE')}
              title1={t('homeSections.teamUp.title1', 'Direct Market Access to')}
              title2={t('homeSections.teamUp.title2', 'World-Class Liquidity.')}
              description={t('homeSections.teamUp.description', 'Direct connectivity to Tier-1 institutional liquidity providers, high-speed matching engines, and regulated broker bridges—ensuring unmatched speed, ultra-tight spreads, and zero-compromise execution.')}
            />
          </motion.div>

          {/* Right Column: 2x2 Bento Pillar Grid & Trust Banner */}
          <motion.div
            className={styles.rightContent}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.bentoGrid}>
              {pillars.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={styles.bentoCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className={styles.bentoCardTop}>
                    <div className={styles.iconBox}>
                      <img src={item.icon} alt={item.title} />
                    </div>
                    <span className={styles.statPill}>{item.stat}</span>
                  </div>
                  <h3 className={styles.bentoTitle}>{item.title}</h3>
                  <p className={styles.bentoDesc}>{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom Institutional Trust Banner */}
            <motion.div
              className={styles.trustBanner}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.bannerInfo}>
                <span className={styles.verifiedTag}>{t('homeSections.teamUp.vaultTag', 'ENTERPRISE SECURITY VAULT')}</span>
                <h4>{t('homeSections.teamUp.vaultTitle', '100% NON-CUSTODIAL & SEGREGATED')}</h4>
                <p>{t('homeSections.teamUp.vaultBody', 'You maintain 100% custody of your trading capital. ChronosX operates purely as an analytical AI layer and bridge. We never hold, manage, or custody user funds—your capital remains securely deposited with your regulated MT5 broker.')}</p>
              </div>
              <div className={styles.shieldVisual}>
                <svg width="100" height="90" viewBox="0 0 100 90" fill="none" className={styles.shieldSvg} aria-hidden="true">
                  <g className={styles.constellationLines} stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2">
                    <line x1="20" y1="30" x2="35" y2="45"/>
                    <line x1="35" y1="45" x2="25" y2="65"/>
                    <line x1="80" y1="25" x2="65" y2="45"/>
                    <line x1="65" y1="45" x2="75" y2="68"/>
                    <line x1="50" y1="10" x2="35" y2="25"/>
                    <line x1="50" y1="10" x2="65" y2="25"/>
                    <line x1="30" y1="75" x2="50" y2="85"/>
                    <line x1="70" y1="75" x2="50" y2="85"/>
                  </g>
                  <g className={styles.constellationDots}>
                    <circle cx="20" cy="30" r="2.5"/>
                    <circle cx="35" cy="45" r="2"/>
                    <circle cx="25" cy="65" r="2"/>
                    <circle cx="80" cy="25" r="2.5"/>
                    <circle cx="65" cy="45" r="2"/>
                    <circle cx="75" cy="68" r="2"/>
                    <circle cx="50" cy="10" r="2.5"/>
                    <circle cx="50" cy="85" r="2.5"/>
                  </g>
                  <g className={styles.shieldGlowGroup}>
                    <path className={styles.shieldBody} d="M50 20L34 26V45C34 56 41 65 50 68C59 65 66 56 66 45V26L50 20Z" strokeWidth="2.5" strokeLinejoin="round"/>
                    <path className={styles.shieldCheck} d="M43 44L48 49L58 39" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
