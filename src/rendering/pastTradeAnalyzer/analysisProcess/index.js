'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LineText from '@/components/lineText';
import styles from './analysisProcess.module.scss';

export default function AnalysisProcess() {
    const processSteps = [
        {
            num: '01',
            title: 'Upload Your Completed Trade',
            desc: 'Upload a screenshot of your completed trade or provide the relevant trade information.',
            sub: 'Your chart. Your execution. Your history.',
        },
        {
            num: '02',
            title: 'AI Reviews the Trade',
            desc: 'The analyzer examines the visible chart, entry, exit, market structure, risk management, and surrounding price action.',
            sub: 'Deep AI chart structure audit',
        },
        {
            num: '03',
            title: 'Explore the Findings',
            desc: 'Review the trade breakdown, potential mistakes, execution issues, and important observations identified by AI.',
            sub: 'Comprehensive report & score',
        },
        {
            num: '04',
            title: 'Improve Your Next Trade',
            desc: 'Use the feedback to refine your process and avoid repeating the same execution mistakes.',
            sub: 'Continuous trading progress',
        },
    ];

    return (
        <section className={styles.analysisProcess}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text="How It Works" />
                    <h2>
                        From Trade Screenshot to <span className={styles.neonText}>Detailed Analysis</span>
                    </h2>
                </div>

                <div className={styles.stepsGrid}>
                    {processSteps.map((st, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.processStepCard}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                            <div className={styles.stepNum}>{st.num}</div>
                            <h3>{st.title}</h3>
                            <p>{st.desc}</p>
                            <span className={styles.subNote}>{st.sub}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
