"use client";

import React, { useState, useRef } from 'react';
import { toast } from '@/components/toast';
import CommonCta from '@/components/commonCta';
import { useLanguage } from '@/context/LanguageContext';
import { SAMPLE_PRESETS } from './constants/aiTradeData';
import TradeHeroSection from './components/TradeHeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import LiveScannerDemoSection from './components/LiveScannerDemoSection';
import TradeFeaturesSection from './components/TradeFeaturesSection';
import TradeComparisonFaqSection from './components/TradeComparisonFaqSection';
import styles from './aiTrade.module.scss';

export default function AiTrade() {
    const { t } = useLanguage();
    const [selectedPreset, setSelectedPreset] = useState(SAMPLE_PRESETS[0]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [openFaq, setOpenFaq] = useState(0);
    const fileInputRef = useRef(null);
    const demoRef = useRef(null);

    const handleSelectPreset = (preset) => {
        setIsScanning(true);
        setScanProgress(0);
        setSelectedPreset(preset);
        setUploadedFile(null);

        // Smooth scroll to demo section
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const interval = setInterval(() => {
            setScanProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    toast.success(`OCR Scan Complete for ${preset.pair}!`);
                    return 100;
                }
                return prev + 25;
            });
        }, 120);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file.name);
            setIsScanning(true);
            setScanProgress(0);

            const interval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsScanning(false);
                        toast.success(`Vision AI analyzed: ${file.name}`);
                        return 100;
                    }
                    return prev + 20;
                });
            }, 140);
        }
    };

    const handleCopyPlan = () => {
        const text = `[AI TRADE ANALYSIS RESULT]
==================================================
Ticker: ${selectedPreset.pair} | Timeframe: ${selectedPreset.timeframe} | Signal Confidence: ${selectedPreset.confidence}
Decision: ${selectedPreset.decision}
Entry Zone: ${selectedPreset.entryZone}
Stop Loss: ${selectedPreset.stopLoss}
Target 1 (TP1): ${selectedPreset.tp1}
Target 2 (TP2): ${selectedPreset.tp2}
Target 3 (TP3): ${selectedPreset.tp3}
Risk-to-Reward Ratio: ${selectedPreset.rrr}
Trade Rationale: ${selectedPreset.rationale}
==================================================`;

        navigator.clipboard.writeText(text);
        toast.success('AI Trade Setup copied to clipboard!');
    };

    const scrollToDemo = () => {
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Ambient Glows */}
            <div className={styles.ambientTopGlow} aria-hidden="true" />
            <div className={styles.ambientCenterGlow} aria-hidden="true" />
            <div className={styles.ambientBottomGlow} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            {/* 1. HERO SECTION */}
            <TradeHeroSection scrollToDemo={scrollToDemo} />

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 3. HOW IT WORKS */}
            <HowItWorksSection />

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 5. LIVE AI TRADE RESULTS PREVIEW */}
            <LiveScannerDemoSection
                demoRef={demoRef}
                selectedPreset={selectedPreset}
                onSelectPreset={handleSelectPreset}
                isScanning={isScanning}
                scanProgress={scanProgress}
                uploadedFile={uploadedFile}
                fileInputRef={fileInputRef}
                onFileUpload={handleFileUpload}
                onCopyPlan={handleCopyPlan}
            />

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 4. KEY PLATFORM FEATURES */}
            <TradeFeaturesSection />

            {/* 6. COMPARISON TABLE & 7. FAQS */}
            <TradeComparisonFaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

            {/* 8. BOTTOM CALL TO ACTION */}
            <CommonCta
                badge={t('aiTrade.ctaBadge', 'INSTITUTIONAL PRECISION OCR')}
                title1={t('aiTrade.ctaTitle1', 'Transform Any Chart Into')}
                title2={t('aiTrade.ctaTitle2', 'Actionable Trade Plans')}
                description={t('aiTrade.ctaDesc', 'Upload screenshots from TradingView, MT4/5, or any mobile broker app. Get high-conviction trade signals with exact Entry, SL, and multi-TP setups.')}
                primaryBtnText={t('aiTrade.startScanningNow', 'START SCANNING NOW')}
                primaryBtnAction="/chart-scanner"
                primaryBtnIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                }
                secondaryBtnText={t('aiTrade.tryDemoScanner', 'TRY DEMO SCANNER')}
                secondaryBtnAction={scrollToDemo}
            />
        </div>
    );
}
