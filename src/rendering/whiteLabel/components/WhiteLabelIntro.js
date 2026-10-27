'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../whiteLabel.module.scss';

const PILLARS = [
    {
        num: '01',
        title: 'Complete Brand Sovereignty',
        desc: 'Deploy on your custom sub-domain with tailored typography, color palettes, and interface themes. Retain 100% ownership of your clients, auth credentials, and user data.',
        highlights: [
            'Custom sub-domain (e.g. app.yourbrand.com)',
            'Full dark & light design system integration',
            '100% private database & user retention'
        ],
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        )
    },
    {
        num: '02',
        title: 'Institutional AI Ecosystem',
        desc: 'Provide traders with sub-second chart scanning, real-time conversational market copilot, automated trade mistake auditing, and historical backtesting.',
        highlights: [
            'Neural Vision OCR pattern recognition',
            'Live conversational market assistant',
            'Algorithmic backtesting & strategy builder'
        ],
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        )
    },
    {
        num: '03',
        title: 'Turnkey Enterprise Reliability',
        desc: 'Eliminate years of costly AI engineering, server operations, and model retraining. Launch in days with enterprise-grade SLA and non-custodial security.',
        highlights: [
            'Sub-10ms global API execution pipeline',
            '99.98% high-availability cloud SLA',
            'Automatic continuous model upgrades'
        ],
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
        )
    }
];

export default function WhiteLabelIntro() {
    return (
        <section className={styles.introSection}>
            <div className={styles.container}>
                <SectionHeader
                    badge="ENTERPRISE FOUNDATION"
                    title="Build the Trading Platform Your Brand Deserves."
                    description="Launch a modern, intelligent trading ecosystem on top of an established AI foundation. Own your brand experience while eliminating the complexity of building AI infrastructure from scratch."
                />

                <div className={styles.introPillarsGrid}>
                    {PILLARS.map((pillar, index) => (
                        <motion.div
                            key={pillar.num}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={styles.introPillarCard}
                        >
                            <div className={styles.pillarHeaderRow}>
                                <div className={styles.pillarIconWrap}>
                                    {pillar.icon}
                                </div>
                            </div>

                            <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                            <p className={styles.pillarDesc}>{pillar.desc}</p>

                            <ul className={styles.pillarChecklist}>
                                {pillar.highlights.map((item) => (
                                    <li key={item}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className={styles.pillarCardGlow} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
