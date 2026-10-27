'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../whiteLabel.module.scss';

const CAPABILITIES = [
    {
        num: '01',
        title: 'AI Chart Intelligence',
        desc: 'Give users an intelligent way to analyze charts and market structures. Users can upload chart screenshots and receive AI-powered analysis covering market structure, price action, patterns, support/resistance, and setups.',
        tags: ['Chart Analysis', 'Pattern Recognition', 'Multi-Timeframe', 'Technical Setups'],
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
            </svg>
        )
    },
    {
        num: '02',
        title: 'AI Market Assistant',
        desc: 'Give your users an intelligent market companion that can help them explore market conditions and validate trading ideas through a conversational, real-time interface.',
        tags: ['Real-time Intelligence', 'Conversational AI', 'Scenario Analysis', 'Idea Validation'],
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        num: '03',
        title: 'AI Trading Intelligence',
        desc: 'Bring algorithmic market intelligence directly into your branded platform. Combines quantitative models, tick data, and strategy workflows to deliver structured market scanning.',
        tags: ['Algorithmic Insights', 'Strategy Intelligence', 'Market Scanner', 'Trade Setups'],
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        )
    },
    {
        num: '04',
        title: 'AI Past Trade Analyzer',
        desc: 'Help users learn from historical trading activity. Evaluates entries, exits, risk management, and market context to identify execution mistakes and turn trades into actionable insights.',
        tags: ['Execution Review', 'Risk Audit', 'Mistake Detection', 'Performance Analytics'],
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
            </svg>
        )
    },
    {
        num: '05',
        title: 'Backtesting & Strategy Suite',
        desc: 'Give users the ability to evaluate trading strategies against deep historical market data before risking capital in live environments with detailed drawdown and Sharpe metrics.',
        tags: ['Historical Simulation', 'Drawdown Analysis', 'Risk Modeling', 'Sharpe Ratio'],
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
            </svg>
        )
    },
    {
        num: '06',
        title: 'Custom Bot & Strategy Tech',
        desc: 'Create an environment where users can build, configure, and automate systematic strategies with custom risk controls and webhook bridges.',
        tags: ['Automated Execution', 'Rule Builder', 'Webhook Bridges', 'Custom Indicators'],
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
            </svg>
        )
    }
];

export default function WhiteLabelCapabilities() {
    return (
        <section className={styles.capabilitiesSection}>
            <div className={styles.container}>
                {/* Section Header */}
                <SectionHeader
                    badge="Core Capabilities"
                    title="Everything You Need to Build a Modern Trading Ecosystem."
                    description="Modular, high-performance financial intelligence modules ready to deploy under your custom brand."
                />

                {/* Symmetrical 3x2 Grid of Capabilities */}
                <div className={styles.capabilitiesGrid}>
                    {CAPABILITIES.map((cap, index) => (
                        <motion.div
                            key={cap.num}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: index * 0.07 }}
                            className={styles.capabilityCard}
                        >
                            <div className={styles.capabilityCardGlow} />
                            <div className={styles.capabilityIconRow}>
                                <div className={styles.capabilityIconWrap}>
                                    {cap.icon}
                                </div>
                                <span className={styles.capabilityBigNum}>{cap.num}</span>
                            </div>
                            <h3 className={styles.capabilityTitle}>{cap.title}</h3>
                            <p className={styles.capabilityDesc}>{cap.desc}</p>
                            <div className={styles.capabilityTagList}>
                                {cap.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
