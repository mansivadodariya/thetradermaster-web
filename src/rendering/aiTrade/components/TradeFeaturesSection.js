'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { KEY_FEATURES } from '../constants/aiTradeData';
import styles from '../aiTrade.module.scss';

export default function TradeFeaturesSection() {
    const { t } = useLanguage();

    return (
        <section className={styles.featuresSection}>
            <div className="container">
                <SectionHeader
                    badge={t('aiTrade.featuresBadge', 'QUANTITATIVE VISION SUITE')}
                    title1={t('aiTrade.featuresTitle1', 'KEY PLATFORM')}
                    title2={t('aiTrade.featuresTitle2', 'CAPABILITIES')}
                    description={t('aiTrade.featuresSubtitle', 'Engineered to extract reliable price action patterns, liquidity sweeps, and high-probability setups from raw charts.')}
                    align="center"
                />

                <div className={styles.featuresGrid}>
                    {KEY_FEATURES.map((feat, index) => (
                        <motion.div
                            key={feat.number}
                            className={styles.featureCard}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.12 }}
                            whileHover={{ y: -6, transition: { duration: 0.25 } }}
                        >
                            <div className={styles.cardGlowHover} />

                            <div className={styles.cardTopRow}>
                                <div className={styles.featureIconWrap}>
                                    {feat.icon}
                                </div>
                                <span className={styles.featureNum}>{feat.number}</span>
                            </div>

                            <div className={styles.featureBadgePill}>
                                {feat.badge}
                            </div>

                            <h3 className={styles.featureCardTitle}>{feat.title}</h3>
                            <p className={styles.featureCardDesc}>{feat.desc}</p>

                            <div className={styles.featureCardStat}>
                                <span className={styles.statLabel}>{feat.statLabel}</span>
                                <span className={styles.statVal}>{feat.statValue}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
