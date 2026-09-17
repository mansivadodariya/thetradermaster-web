'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LineText from '@/components/lineText';
import styles from './reportIncludes.module.scss';

export default function ReportIncludes() {
    const reportIncludes = [
        {
            title: 'Trade Summary',
            desc: 'A clear overview of the trade, including direction, entry, exit, result, and other relevant details.',
        },
        {
            title: 'Execution Review',
            desc: 'A closer look at how the trade was entered and managed.',
        },
        {
            title: 'Market Context',
            desc: 'Analysis of the surrounding trend, structure, support/resistance, and price behavior.',
        },
        {
            title: 'Risk Review',
            desc: 'Evaluation of stop-loss, target, position size, and risk/reward considerations.',
        },
        {
            title: 'Mistake Breakdown',
            desc: 'Potential issues that may have affected the trade.',
        },
        {
            title: 'Improvement Plan',
            desc: 'Practical suggestions for approaching similar situations more effectively.',
        },
        {
            title: 'Overall Trade Score',
            desc: 'A structured assessment that helps you compare trade quality across your journal.',
        },
    ];

    return (
        <section className={styles.reportIncludes}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text="Report Breakdown" />
                    <h2>
                        What Your Trade Report <span className={styles.neonText}>Can Include</span>
                    </h2>
                    <p>Structured breakdown generated for every submitted trade.</p>
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
