'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LineText from '@/components/lineText';
import styles from './analysisProcess.module.scss';

export default function AnalysisProcess() {
    const { t } = useLanguage();
    const processSteps = [
        {
            num: '01',
            title: t('analysisProcess.step1Title', 'Upload Your Completed Trade'),
            desc: t('analysisProcess.step1Desc', 'Upload a screenshot of your completed trade or provide the relevant trade information.'),
            sub: t('analysisProcess.step1Sub', 'Your chart. Your execution. Your history.'),
        },
        {
            num: '02',
            title: t('analysisProcess.step2Title', 'AI Reviews the Trade'),
            desc: t('analysisProcess.step2Desc', 'The analyzer examines the visible chart, entry, exit, market structure, risk management, and surrounding price action.'),
            sub: t('analysisProcess.step2Sub', 'Deep AI chart structure audit'),
        },
        {
            num: '03',
            title: t('analysisProcess.step3Title', 'Explore the Findings'),
            desc: t('analysisProcess.step3Desc', 'Review the trade breakdown, potential mistakes, execution issues, and important observations identified by AI.'),
            sub: t('analysisProcess.step3Sub', 'Comprehensive report & score'),
        },
        {
            num: '04',
            title: t('analysisProcess.step4Title', 'Improve Your Next Trade'),
            desc: t('analysisProcess.step4Desc', 'Use the feedback to refine your process and avoid repeating the same execution mistakes.'),
            sub: t('analysisProcess.step4Sub', 'Continuous trading progress'),
        },
    ];

    return (
        <section className={styles.analysisProcess}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text={t('analysisProcess.badge', 'How It Works')} />
                    <h2>
                        {t('analysisProcess.titlePart1', 'From Trade Screenshot to')} <span className={styles.neonText}>{t('analysisProcess.titlePart2', 'Detailed Analysis')}</span>
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
