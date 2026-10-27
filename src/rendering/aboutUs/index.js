"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { authNavigate } from '@/lib/authRedirect';
import CommonCta from '@/components/commonCta';
import styles from './aboutUs.module.scss';

// Institutional Metrics
const METRICS = [
    { value: '$4.2B+', label: 'Volume Analyzed', sub: 'Processed across global FX & metals' },
    { value: '99.99%', label: 'Engine Uptime', sub: 'Institutional high-availability SLA' },
    { value: '< 12ms', label: 'Signal Latency', sub: 'Ultra-low latency execution speed' },
    { value: '35,000+', label: 'Active Traders', sub: 'Across 120+ countries worldwide' }
];

// Core Technology Pillars
const TECH_PILLARS = [
    {
        id: 'vision',
        title: 'Deep Neural Vision & OCR',
        desc: 'Proprietary computer vision models that analyze live charts in milliseconds, detecting liquidity sweeps, break of structure, and high-probability harmonic formations.',
        badge: 'OCR VISION',
        badgeColor: 'gold',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        )
    },
    {
        id: 'signals',
        title: 'Quantum Signal Ensemble',
        desc: 'Consensus engine merging real-time macro fundamentals, statistical arbitrage, and order flow metrics to generate precise entry, SL, and multi-tier TP targets.',
        badge: 'MULTI-MODEL',
        badgeColor: 'cyan',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        )
    },
    {
        id: 'security',
        title: 'Zero-Knowledge Security',
        desc: 'Non-custodial architecture with 256-bit TLS encryption. Your trading credentials, strategies, and analytical queries remain private and protected at all times.',
        badge: 'ENTERPRISE',
        badgeColor: 'emerald',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        )
    },
    {
        id: 'infrastructure',
        title: 'Global Edge Routing',
        desc: 'Cross-connected server nodes co-located near primary liquidity centers in London, New York, Dubai, and Singapore for zero-lag data propagation.',
        badge: 'LOW LATENCY',
        badgeColor: 'purple',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        )
    }
];

// Timeline Milestones
const TIMELINE = [
    {
        year: '2024',
        title: 'Genesis & Deep Model Training',
        desc: 'TraderMaster was founded by quantitative engineers and market makers. Initial deep neural models trained on over a decade of institutional tick-level market data.'
    },
    {
        year: '2025',
        title: 'Neural OCR Vision & Real-Time Engine',
        desc: 'Launched automated multi-timeframe OCR pattern detection, live Telegram broadcast signals, and real-time economic calendar intelligence.'
    },
    {
        year: '2026',
        title: 'Conversational Copilot & Institutional Desk',
        desc: 'Rolled out institutional webhook bridges for MT5, conversational AI assistant, and custom algorithmic indicator engineering for prop firms.'
    }
];

// Executive & Quant Leadership
const LEADERSHIP = [
    {
        name: 'Dr. Aris Thorne',
        role: 'Chief AI Scientist & Co-Founder',
        bio: 'Ph.D. in Deep Reinforcement Learning from Imperial College. 12+ years developing algorithmic market models for tier-1 quantitative funds.',
        tag: 'AI RESEARCH'
    },
    {
        name: 'Elena Rostova',
        role: 'Head of Quantitative Strategy',
        bio: 'Former Senior FX Structurer at leading European investment banks. Specializes in statistical arbitrage and risk-weighted execution algorithms.',
        tag: 'QUANT DESK'
    },
    {
        name: 'Marcus Vance',
        role: 'VP of Distributed Infrastructure',
        bio: 'Ex-telecoms and high-frequency trading infrastructure architect. Oversees TraderMaster zero-latency global edge network and MT5 bridge stability.',
        tag: 'INFRASTRUCTURE'
    },
    {
        name: 'Sophia Lin',
        role: 'Chief Product Officer',
        bio: 'Product visionary dedicated to democratizing institutional fintech UX. Passionate about empowering retail traders with intuitive AI copilots.',
        tag: 'PRODUCT'
    }
];

// Global Hubs & Registered Corporate Entity
const GLOBAL_HUBS = [
    { city: 'London', role: 'Fintech & Quant Engine Desk', timezone: 'UTC+0 (GMT)' },
    { city: 'New York', role: 'Market Intelligence & ML Operations', timezone: 'UTC-5 (EST)' },
    { city: 'Dubai (HQ)', role: 'The Trader Master, Dubai Silicon Oasis, IFZA Building A1, UAE', timezone: 'UTC+4 (GST)' },
    { city: 'Singapore', role: 'APAC Ultra-Low Latency Gateway', timezone: 'UTC+8 (SGT)' }
];

export default function AboutUs() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <div className={styles.aboutPage}>
            {/* Ambient Atmosphere Glows */}
            <div className={styles.ambientGlowTop} aria-hidden="true" />
            <div className={styles.ambientGlowCenter} aria-hidden="true" />
            <div className={styles.ambientGlowBottom} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            <div className="container-xs">
                {/* 1. Hero Header Section */}
                <motion.header
                    className={styles.heroSection}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <SectionHeader
                        as="h1"
                        badge={t('aboutUs.heroBadge', 'INSTITUTIONAL AI // EST. 2024')}
                        title1={t('aboutUs.heroTitle1', 'Pioneering the Future of')}
                        title2={t('aboutUs.heroTitle2', 'Algorithmic Intelligence & Market Vision')}
                        description={t('aboutUs.heroSubtitle', 'TraderMaster was forged by quantitative researchers, deep learning engineers, and veteran market makers to eliminate retail information asymmetry by delivering institutional-grade neural intelligence to traders worldwide.')}
                        align="center"
                    />
                </motion.header>

                {/* 2. Institutional Metrics Strip */}
                <motion.section
                    className={styles.metricsSection}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    aria-label={t('aboutUs.keyMetrics', 'Key Institutional Metrics')}
                >
                    <div className={styles.metricsGrid}>
                        {METRICS.map((metric, index) => (
                            <motion.div
                                key={metric.label}
                                className={styles.metricCard}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                            >
                                <div className={styles.metricNumber}>{metric.value}</div>
                                <div className={styles.metricLabel}>{metric.label}</div>
                                <div className={styles.metricSub}>{metric.sub}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* 3. Mission & Vision Bento Cards */}
                <section className={styles.missionSection}>
                    <SectionHeader
                        badge={t('aboutUs.missionBadge', 'PURPOSE & PHILOSOPHY')}
                        title1={t('aboutUs.missionTitle1', 'Built for Precision.')}
                        title2={t('aboutUs.missionTitle2', 'Powered by Data.')}
                        description={t('aboutUs.missionSubtitle', 'We bridge the gap between complex quantitative models and everyday trading execution.')}
                        align="center"
                    />

                    <div className={styles.missionGrid}>
                        <motion.div
                            className={styles.missionCard}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={styles.missionCardIcon}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </div>
                            <h3 className={styles.missionCardTitle}>{t('aboutUs.missionTitle', 'Our Mission')}</h3>
                            <p className={styles.missionCardDesc}>
                                To democratize hedge-fund caliber machine learning tools. We believe every trader deserves access to instant chart OCR vision, high-probability pattern detection, and autonomous risk management without paying prohibitive institutional software fees.
                            </p>
                            <div className={styles.missionHighlight}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{t('aboutUs.missionDesc', 'Zero information asymmetry for all traders')}</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className={styles.missionCard}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={styles.missionCardIcon}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="m4.93 4.93 4.24 4.24" />
                                    <path d="m14.83 9.17 4.24-4.24" />
                                    <path d="m14.83 14.83 4.24 4.24" />
                                    <path d="m9.17 14.83-4.24 4.24" />
                                    <circle cx="12" cy="12" r="4" />
                                </svg>
                            </div>
                            <h3 className={styles.missionCardTitle}>{t('aboutUs.visionTitle', 'Our Vision')}</h3>
                            <p className={styles.missionCardDesc}>
                                A unified financial technology ecosystem where human trading intuition is seamlessly augmented by real-time neural networks. By eliminating emotional bias, we enable traders to achieve superior risk-adjusted consistency across dynamic market cycles.
                            </p>
                            <div className={styles.missionHighlight}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{t('aboutUs.visionDesc', 'Augmented human intelligence with AI precision')}</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 4. Core Technology Pillars */}
                <section className={styles.pillarsSection}>
                    <SectionHeader
                        badge={t('aboutUs.techBadge', 'TECHNOLOGY STACK')}
                        title1={t('aboutUs.techTitle1', 'The TraderMaster')}
                        title2={t('aboutUs.techTitle2', 'Architecture')}
                        description={t('aboutUs.techSubtitle', 'Engineered from the ground up for speed, predictive accuracy, and institutional resilience.')}
                        align="center"
                    />

                    <div className={styles.pillarsGrid}>
                        {TECH_PILLARS.map((pillar, idx) => (
                            <motion.div
                                key={pillar.id}
                                className={styles.pillarCard}
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                            >
                                <div className={styles.pillarHeader}>
                                    <div className={styles.pillarIconBox}>
                                        {pillar.icon}
                                    </div>
                                    <span className={`${styles.pillarBadge} ${styles[pillar.badgeColor]}`}>
                                        {pillar.badge}
                                    </span>
                                </div>
                                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                                <p className={styles.pillarDesc}>{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 5. Evolutionary Timeline */}
                <section className={styles.timelineSection}>
                    <SectionHeader
                        badge={t('aboutUs.timelineBadge', 'MILESTONES')}
                        title1={t('aboutUs.timelineTitle1', 'Our Evolutionary')}
                        title2={t('aboutUs.timelineTitle2', 'Journey')}
                        description={t('aboutUs.timelineSubtitle', 'From deep learning research labs to a global AI financial technology platform.')}
                        align="center"
                    />

                    <div className={styles.timelineWrapper}>
                        <div className={styles.timelineTrack} />
                        <div className={styles.timelineList}>
                            {TIMELINE.map((item, index) => (
                                <motion.div
                                    key={item.year}
                                    className={styles.timelineItem}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className={styles.timelineDot}>
                                        <span className={styles.dotInner} />
                                    </div>
                                    <div className={styles.timelineCard}>
                                        <div className={styles.timelineYear}>{item.year}</div>
                                        <h3 className={styles.timelineTitle}>{item.title}</h3>
                                        <p className={styles.timelineDesc}>{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. Executive & Quant Leadership */}
                <section className={styles.teamSection}>
                    <SectionHeader
                        badge={t('aboutUs.leadershipBadge', 'EXECUTIVE LEADERSHIP')}
                        title1={t('aboutUs.leadershipTitle1', 'Guided by Quantitative')}
                        title2={t('aboutUs.leadershipTitle2', 'Visionaries')}
                        description={t('aboutUs.leadershipSubtitle', 'Our leadership team combines decades of deep tech research and top-tier financial markets expertise.')}
                        align="center"
                    />

                    <div className={styles.teamGrid}>
                        {LEADERSHIP.map((member, index) => (
                            <motion.div
                                key={member.name}
                                className={styles.teamCard}
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                                <div className={styles.teamCardHeader}>
                                    <div className={styles.avatarPlaceholder}>
                                        <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                                    </div>
                                    <span className={styles.teamTag}>{member.tag}</span>
                                </div>
                                <h3 className={styles.memberName}>{member.name}</h3>
                                <div className={styles.memberRole}>{member.role}</div>
                                <p className={styles.memberBio}>{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 7. Global Financial Hubs */}
                <section className={styles.hubsSection}>
                    <div className={styles.hubsCard}>
                        <div className={styles.hubsHeader}>
                            <div className={styles.hubsBadge}>
                                <span>STRATEGIC GLOBAL PRESENCE</span>
                            </div>
                            <h2 className={styles.hubsTitle}>Operating Across Primary Financial Centers</h2>
                            <p className={styles.hubsSubtitle}>
                                Connected 24/7 across Asian, European, and American market trading sessions.
                            </p>
                        </div>

                        <div className={styles.hubsGrid}>
                            {GLOBAL_HUBS.map((hub) => (
                                <div key={hub.city} className={styles.hubItem}>
                                    <div className={styles.hubCityRow}>
                                        <span className={styles.hubCity}>{hub.city}</span>
                                        <span className={styles.hubTz}>{hub.timezone}</span>
                                    </div>
                                    <p className={styles.hubRole}>{hub.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            {/* 8. Bottom Call to Action Banner (Common CTA) */}
            <CommonCta
                badge="ENTERPRISE FINANCIAL INTELLIGENCE"
                title1="Experience the Power of"
                title2="TraderMaster AI Today"
                description="Join thousands of elite traders leveraging automated chart pattern recognition, predictive signals, and conversational market copilot."
                primaryBtnText="GET STARTED FREE"
                primaryBtnAction="/dashboard"
                secondaryBtnText="CONTACT DESK"
                secondaryBtnAction="/contact-us"
            />

        </div>
    );
}
