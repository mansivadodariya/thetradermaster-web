'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LineText from '@/components/lineText';
import styles from './whyReview.module.scss';

export default function WhyReview() {
    const whyCards = [
        {
            title: 'Stop Repeating the Same Mistakes',
            desc: 'A mistake becomes expensive when it keeps happening. Review your previous trades and identify recurring execution problems.',
        },
        {
            title: 'Understand What Works for You',
            desc: 'Learn which setups, conditions, and execution patterns have worked best within your own trading history.',
        },
        {
            title: 'Improve Trading Discipline',
            desc: 'Create a habit of reviewing decisions instead of focusing only on the final profit or loss.',
        },
        {
            title: 'Make Your Journal More Useful',
            desc: 'Turn raw trade records into structured insights you can actually use.',
        },
        {
            title: 'Become More Consistent',
            desc: 'The objective is not to make every trade perfect. It is to make your decision-making process more consistent over time.',
        },
    ];

    return (
        <section className={styles.whyReview}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text="Core Benefits" />
                    <h2>
                        Why Review <span className={styles.neonText}>Past Trades?</span>
                    </h2>
                </div>

                <div className={styles.whyGrid}>
                    {whyCards.map((w, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.whyCard}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: idx * 0.08 }}
                        >
                            <h3>{w.title}</h3>
                            <p>{w.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className={styles.dataBanner}>
                    <h3>Your Trading History Is Your Data</h3>
                    <p>
                        Every completed trade contains information about your strategy, execution, risk, and decision-making. Instead of letting those trades disappear into a spreadsheet or trading platform history, use them as a source of feedback. Your past trades can become one of your most valuable learning tools. Past Trade Analyzer helps you extract that information.
                    </p>
                </div>
            </div>
        </section>
    );
}
