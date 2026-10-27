"use client";

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toast } from '@/components/toast';
import CommonCta from '@/components/commonCta';
import { useLanguage } from '@/context/LanguageContext';
import { SAMPLE_TRADES } from './constants/sampleTrades';
import HeroBannerSection from './components/HeroBannerSection';
import CockpitStage from './components/CockpitStage';
import StepsPillarsSection from './components/StepsPillarsSection';
import InteractiveAuditSection from './components/InteractiveAuditSection';
import styles from './aiPastTradeAnalyzer.module.scss';

export default function AiPastTradeAnalyzer() {
    const { t } = useLanguage();
    const [selectedTrade, setSelectedTrade] = useState(SAMPLE_TRADES[0]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

    const heroSectionRef = useRef(null);

    // 3D Perspective Scroll Rotation (Rotates from 52deg back to 0deg flat on scroll)
    const { scrollYProgress } = useScroll({
        target: heroSectionRef,
        offset: ["start 98%", "center center"]
    });

    const rotateX = useTransform(scrollYProgress, [0, 1], [52, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
    const translateY = useTransform(scrollYProgress, [0, 1], [75, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.6, 0.88, 1]);

    const handleSelectPreset = (trade) => {
        setIsScanning(true);
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    setSelectedTrade(trade);
                    toast.success(`AI Audit generated for ${trade.title}`);
                    return 100;
                }
                return prev + 25;
            });
        }, 120);
    };

    const scrollToAudit = () => {
        const el = document.getElementById('audit-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Ambient Atmosphere Glows */}
            <div className={styles.ambientTopGlow} aria-hidden="true" />
            <div className={styles.ambientCenterGlow} aria-hidden="true" />
            <div className={styles.ambientBottomGlow} aria-hidden="true" />

            {/* 1. BRAND NEW HERO BANNER UI: Futuristic AI Command Cockpit */}
            <section ref={heroSectionRef} className={styles.heroSection}>
                <HeroBannerSection scrollToAudit={scrollToAudit} />

                {/* 1.6 Centerpiece: Futuristic Holographic Trade Cockpit Stage with 3D Perspective Scroll */}
                <div className="container">
                    <div className={styles.perspectiveWrapper}>
                        <motion.div
                            className={styles.cockpitStage}
                            style={{
                                rotateX,
                                scale,
                                translateY,
                                opacity,
                                transformStyle: "preserve-3d",
                                transformOrigin: "top center"
                            }}
                        >
                            <CockpitStage
                                selectedTrade={selectedTrade}
                                onSelectPreset={handleSelectPreset}
                            />
                        </motion.div>
                    </div>

                    {/* 1.7 3 Value Pillar Bento Cards & 2. 3 Simple Steps */}
                    <StepsPillarsSection />
                </div>
            </section>

            {/* 3. WHAT YOU'LL GET & INTERACTIVE LIVE AUDIT RESULT */}
            <div id="audit-section">
                <InteractiveAuditSection
                    selectedTrade={selectedTrade}
                    onSelectPreset={handleSelectPreset}
                    isScanning={isScanning}
                    scanProgress={scanProgress}
                />
            </div>

            {/* 4. BOTTOM CALL TO ACTION BANNER (COMMON CTA COMPONENT) */}
            <CommonCta
                badge={t('tradeAudit.ctaBadge', 'AI AUDIT TECHNOLOGY')}
                title1={t('tradeAudit.ctaTitle1', 'Stop Repeating Trading Mistakes')}
                title2={t('tradeAudit.ctaTitle2', 'Start Auditing Every Execution')}
                description={t('tradeAudit.ctaDesc', 'Upload your historical trade logs and screenshots. Receive immediate quantified feedback on risk sizing, invalid entries, and missed profits.')}
                primaryBtnText={t('tradeAudit.startAnalyzingNow', 'START YOUR ANALYSIS')}
                primaryBtnAction={scrollToAudit}
                primaryBtnIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                }
            />
        </div>
    );
}
