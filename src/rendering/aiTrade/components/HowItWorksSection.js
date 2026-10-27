'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { STEPS } from '../constants/aiTradeData';
import styles from '../aiTrade.module.scss';

export default function HowItWorksSection() {
    const { t } = useLanguage();

    return (
        <section className={styles.howItWorksSection}>
            <div className="container">
                <SectionHeader
                    badge={t('aiTrade.howItWorksBadge', '3-STEP SCANNING WORKFLOW')}
                    title1={t('aiTrade.howItWorksTitle1', 'HOW AI TRADE')}
                    title2={t('aiTrade.howItWorksTitle2', 'SCANNING WORKS')}
                    description={t('aiTrade.howItWorksSubtitle', 'From raw screenshot to full quantitative trade setup in 3 automated steps:')}
                    align="center"
                />

                <div className={styles.stepsGrid}>
                    {STEPS.map((step, idx) => (
                        <motion.div
                            key={step.number}
                            className={styles.stepCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                        >
                            <div className={styles.stepHeader}>
                                <div className={styles.stepNumBadge}>{step.number}</div>
                                <span className={styles.stepTag}>{step.badge}</span>
                            </div>

                            <div className={styles.stepIconWrap}>
                                {step.icon}
                            </div>

                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
