'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LineText from '@/components/lineText';
import styles from './learningOpportunity.module.scss';

export default function LearningOpportunity() {
    const scenarioCards = [
        {
            type: 'losing',
            tag: 'Losing Trade?',
            title: 'Analyze Execution Issues',
            desc: 'Find the execution issues that may have contributed to the loss.',
        },
        {
            type: 'winning',
            tag: 'Winning Trade?',
            title: 'Recognize Quality Setups',
            desc: 'Understand what you did correctly so you can recognize similar high-quality setups.',
        },
        {
            type: 'repeating',
            tag: 'Repeating Mistakes?',
            title: 'Identify Bad Habits',
            desc: 'Compare your reviewed trades and identify patterns in your execution.',
        },
        {
            type: 'unsure',
            tag: 'Unsure Process?',
            title: 'Build Consistency',
            desc: 'Use your previous trades to see where your decision-making can become more consistent.',
        },
    ];

    return (
        <section className={styles.learningOpportunity}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text="Adaptive Learning" />
                    <h2>
                        Turn Every Trade Into a <span className={styles.neonText}>Learning Opportunity</span>
                    </h2>
                </div>

                <div className={styles.scenariosGrid}>
                    {scenarioCards.map((sc, idx) => (
                        <motion.div
                            key={idx}
                            className={`${styles.scenarioCard} ${styles[sc.type]}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                            <span className={styles.badgeTag}>{sc.tag}</span>
                            <h4>{sc.title}</h4>
                            <p>{sc.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
