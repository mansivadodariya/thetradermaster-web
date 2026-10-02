'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LineText from '@/components/lineText';
import styles from './aiTradeReview.module.scss';

export default function AiTradeReview() {
    const { t } = useLanguage();
    const questionCards = [
        t('pastTradeReview.q1', 'Why did the trade work?'),
        t('pastTradeReview.q2', 'Why did it fail?'),
        t('pastTradeReview.q3', 'Was the entry too early?'),
        t('pastTradeReview.q4', 'Was the stop-loss placed correctly?'),
        t('pastTradeReview.q5', 'Did the setup match the trading plan?'),
        t('pastTradeReview.q6', 'Was the risk worth taking?'),
    ];

    return (
        <section className={styles.aiTradeReview}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text={t('pastTradeReview.badge', 'AI Execution Review')} />
                    <h2>
                        {t('pastTradeReview.title1', 'Your Personal')} <span className={styles.neonText}>{t('pastTradeReview.title2', 'AI Trade Review')}</span>
                    </h2>
                    <p>
                        {t('pastTradeReview.sub', 'Most traders record whether a trade was a win or a loss. But the real questions are:')}
                    </p>
                </div>

                <div className={styles.questionGrid}>
                    {questionCards.map((q, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.qCard}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                        >
                            <div className={styles.qIcon}>?</div>
                            <p>{q}</p>
                        </motion.div>
                    ))}
                </div>

                <div className={styles.highlightFooterBox}>
                    {t('pastTradeReview.footer', 'Past Trade Analyzer goes beyond the final result and examines the trade itself to give you a more detailed view of your execution.')}
                </div>
            </div>
        </section>
    );
}
