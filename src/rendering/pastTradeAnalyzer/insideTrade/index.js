'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LineText from '@/components/lineText';
import styles from './insideTrade.module.scss';

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default function InsideTrade() {
    const { t } = useLanguage();
    const insideQuestions = [
        t('insideTrade.q1', 'Was my entry well timed?'),
        t('insideTrade.q2', 'Was I entering before confirmation?'),
        t('insideTrade.q3', 'Did I trade with or against the market structure?'),
        t('insideTrade.q4', 'Was my stop-loss positioned logically?'),
        t('insideTrade.q5', 'Did the trade offer enough risk/reward?'),
        t('insideTrade.q6', 'Did my exit make sense based on the setup?'),
    ];

    return (
        <section className={styles.insideTrade}>
            <div className="container-xs">
                <div className={styles.checklistGlassBox}>
                    <div className={styles.sectionHeader}>
                        <LineText text={t('insideTrade.badge', 'Process Over Outcome')} />
                        <h2>
                            {t('insideTrade.titlePart1', 'See What Actually Happened')} <span className={styles.neonText}>{t('insideTrade.titlePart2', 'Inside Your Trade')}</span>
                        </h2>
                        <p>
                            {t('insideTrade.subtitle', 'A trade result only tells you the outcome. Past Trade Analyzer helps you understand the process behind that outcome.')}
                        </p>
                    </div>

                    <div className={styles.checkGrid}>
                        {insideQuestions.map((q, idx) => (
                            <motion.div
                                key={idx}
                                className={styles.checkItem}
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: idx * 0.06 }}
                            >
                                <div className={styles.checkMark}><CheckIcon /></div>
                                <span>{q}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className={styles.summaryLine}>
                        {t('insideTrade.summary', 'This turns your trading history into something you can actually learn from.')}
                    </div>
                </div>
            </div>
        </section>
    );
}
