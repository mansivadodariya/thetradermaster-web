'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LineText from '@/components/lineText';
import styles from './reportIncludes.module.scss';

export default function ReportIncludes() {
    const { t } = useLanguage();
    const reportIncludes = [
        {
            title: t('reportIncludes.item1Title', 'Trade Summary'),
            desc: t('reportIncludes.item1Desc', 'A clear overview of the trade, including direction, entry, exit, result, and other relevant details.'),
        },
        {
            title: t('reportIncludes.item2Title', 'Execution Review'),
            desc: t('reportIncludes.item2Desc', 'A closer look at how the trade was entered and managed.'),
        },
        {
            title: t('reportIncludes.item3Title', 'Market Context'),
            desc: t('reportIncludes.item3Desc', 'Analysis of the surrounding trend, structure, support/resistance, and price behavior.'),
        },
        {
            title: t('reportIncludes.item4Title', 'Risk Review'),
            desc: t('reportIncludes.item4Desc', 'Evaluation of stop-loss, target, position size, and risk/reward considerations.'),
        },
        {
            title: t('reportIncludes.item5Title', 'Mistake Breakdown'),
            desc: t('reportIncludes.item5Desc', 'Potential issues that may have affected the trade.'),
        },
        {
            title: t('reportIncludes.item6Title', 'Improvement Plan'),
            desc: t('reportIncludes.item6Desc', 'Practical suggestions for approaching similar situations more effectively.'),
        },
    ];

    return (
        <section className={styles.reportIncludes}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text={t('reportIncludes.badge', 'Report Breakdown')} />
                    <h2>
                        {t('reportIncludes.titlePart1', 'What Your Trade Report')} <span className={styles.neonText}>{t('reportIncludes.titlePart2', 'Can Include')}</span>
                    </h2>
                    <p>{t('reportIncludes.subtitle', 'Structured breakdown generated for every submitted trade.')}</p>
                </div>

                <div className={styles.reportGrid}>
                    {reportIncludes.map((rep, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.reportCard}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: idx * 0.07 }}
                        >
                            <div className={styles.reportHeader}>
                                <div className={styles.iconDot} />
                                <h3>{rep.title}</h3>
                            </div>
                            <p>{rep.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
