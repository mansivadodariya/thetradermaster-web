'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { authNavigate } from '@/lib/authRedirect';
import AnimatedAreaChart from '@/components/animatedAreaChart';
import styles from '../aiPastTradeAnalyzer.module.scss';

export default function HeroBannerSection({ scrollToAudit }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [mousePos, setMousePos] = useState({ x: 50, y: 50, isHovered: false });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y, isHovered: true });
    };

    const handleMouseLeave = () => {
        setMousePos(prev => ({ ...prev, isHovered: false }));
    };

    return (
        <div
            className={styles.heroHeaderArea}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.scrollBgWrapper}>
                <div className={styles.ambientGlowTop} aria-hidden="true" />
                <div className={styles.ambientGlowCenter} aria-hidden="true" />

                <div
                    className={styles.interactiveSpotlight}
                    style={{
                        left: `${mousePos.x}%`,
                        top: `${mousePos.y}%`,
                        opacity: mousePos.isHovered ? 1 : 0
                    }}
                    aria-hidden="true"
                />

                <div className={styles.gridOverlay} aria-hidden="true" />

                {/* Localized Green Grid Spotlight */}
                <div
                    className={styles.greenSpotlightGrid}
                    style={{
                        opacity: mousePos.isHovered ? 1 : 0,
                        WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, #000 0%, transparent 100%)`,
                        maskImage: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, #000 0%, transparent 100%)`
                    }}
                    aria-hidden="true"
                />

                <div className={styles.radialVignette} aria-hidden="true" />

                {/* Background Animated Vector Area Chart Behind Title Section */}
                <AnimatedAreaChart isBackground={true} height={360} />

                {/* High-Tech Mobile Ambient Atmosphere */}
                <div className={styles.mobileTechAtmosphere} aria-hidden="true">
                    <div className={styles.mobileQuantumHalo} />
                    <div className={styles.mobileLaserScan} />
                    <div className={styles.mobileConstellation}>
                        <span className={`${styles.particleDot} ${styles.pDot1}`} />
                        <span className={`${styles.particleDot} ${styles.pDot2}`} />
                        <span className={`${styles.particleDot} ${styles.pDot3}`} />
                        <span className={`${styles.particleDot} ${styles.pDot4}`} />
                        <span className={`${styles.particleDot} ${styles.pDot5}`} />
                    </div>
                </div>
            </div>

            <div className="container">
                <div className={styles.heroCenterWrapper}>
                    {/* Uniform Section Header */}
                    <SectionHeader
                        as="h1"
                        badge={t('tradeAudit.heroBadge', 'QUANT AUDIT ENGINE // OCR V3.2')}
                        title1={t('tradeAudit.heroTitle1', 'AI PAST TRADE')}
                        title2={t('tradeAudit.heroTitle2', 'ANALYZER')}
                        description={t('tradeAudit.heroSubtitle', 'Learn From Every Trade. Improve Every Time. Stop repeating the same trading mistakes. Upload a screenshot of any past trade, and our AI will audit your entry, exit, risk management, and market structure.')}
                        align="center"
                    />

                    {/* 1.5 Hero Action CTAs */}
                    <motion.div
                        className={styles.heroCtaGroup}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <button
                            type="button"
                            onClick={scrollToAudit}
                            className={styles.heroPrimaryBtn}
                        >
                            <span>{t('tradeAudit.startAnalyzingNow', 'START ANALYZING NOW')}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() => authNavigate(router, '/dashboard')}
                            className={styles.heroSecondaryBtn}
                        >
                            <span>{t('tradeAudit.exploreTraderMaster', 'EXPLORE TRADERMASTER')}</span>
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
