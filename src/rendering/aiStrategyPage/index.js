"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/toast';
import CommonCta from '@/components/commonCta';
import StrategyPageHero from './components/StrategyPageHero';
import StrategySimulatorSection from './components/StrategySimulatorSection';
import StrategyFeaturesBento from './components/StrategyFeaturesBento';
import StrategyComparisonFaq from './components/StrategyComparisonFaq';
import {
    VALUE_BADGES,
    CORE_FEATURES,
    PAIRS_DATA,
    STRATEGIES,
    COMPARISON_DATA,
    FAQS
} from './constants/strategyPageData';
import styles from './aiStrategyPage.module.scss';

export default function AiStrategyPage() {
    const router = useRouter();
    const [selectedPair, setSelectedPair] = useState(PAIRS_DATA[0]);
    const [selectedStrategy, setSelectedStrategy] = useState('EMA Pullback Strategy');
    const [isRecomputing, setIsRecomputing] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    const demoRef = useRef(null);

    const handleSelectPair = (pair) => {
        setIsRecomputing(true);
        setTimeout(() => {
            setSelectedPair(pair);
            setIsRecomputing(false);
            toast.success(`Loaded 100-Point Score for ${pair.symbol}!`);
        }, 220);
    };

    const handleSelectStrategy = (strat) => {
        setIsRecomputing(true);
        setSelectedStrategy(strat);
        setTimeout(() => {
            setIsRecomputing(false);
            toast.success(`Applied ${strat}!`);
        }, 200);
    };

    const handleCopyScore = () => {
        const text = `[LIVE STRATEGY FEED]: ${selectedPair.symbol} (${selectedPair.name})
==================================================
Active Strategy: ${selectedStrategy}
Market Bias:     ${selectedPair.bias} (Score: ${selectedPair.score}/100)
AI Confidence:   ${selectedPair.confidence}
[PILLAR SCORE BREAKDOWN]:
├── [Trend Alignment]:   ${selectedPair.pillars.trend.score} / 25  (${selectedPair.pillars.trend.note})
├── [Momentum Score]:   ${selectedPair.pillars.momentum.score} / 25  (${selectedPair.pillars.momentum.note})
├── [Volume Surge]:      ${selectedPair.pillars.volume.score} / 25  (${selectedPair.pillars.volume.note})
└── [Structure Score]:   ${selectedPair.pillars.structure.score} / 25  (${selectedPair.pillars.structure.note})
──────────────────────────────────────────────────
TOTAL AGGREGATE SCORE: ${selectedPair.score} / 100 [${selectedPair.bias}]
==================================================`;

        navigator.clipboard.writeText(text);
        toast.success('Technical Score & Pillar Breakdown copied!');
    };

    const scrollToDemo = () => {
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Ambient Background Glows */}
            <div className={styles.ambientTopGlow} aria-hidden="true" />
            <div className={styles.ambientCenterGlow} aria-hidden="true" />
            <div className={styles.ambientBottomGlow} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            {/* 1. Hero Section */}
            <StrategyPageHero
                router={router}
                scrollToDemo={scrollToDemo}
                valueBadges={VALUE_BADGES}
            />

            {/* Section Divider */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 2. Interactive Live Scoring Simulator Cockpit */}
            <StrategySimulatorSection
                demoRef={demoRef}
                strategies={STRATEGIES}
                selectedStrategy={selectedStrategy}
                handleSelectStrategy={handleSelectStrategy}
                pairsData={PAIRS_DATA}
                selectedPair={selectedPair}
                handleSelectPair={handleSelectPair}
                isRecomputing={isRecomputing}
                handleCopyScore={handleCopyScore}
                router={router}
            />

            {/* Section Divider */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 3. Core Platform Features Bento Grid */}
            <StrategyFeaturesBento coreFeatures={CORE_FEATURES} />

            {/* Section Divider */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 4. Comparison Matrix & FAQs */}
            <StrategyComparisonFaq
                comparisonData={COMPARISON_DATA}
                faqs={FAQS}
                openFaq={openFaq}
                setOpenFaq={setOpenFaq}
            />

            {/* 5. Bottom Call to Action */}
            <CommonCta
                badge="MULTI-PILLAR FX INTELLIGENCE"
                title1="Deploy Quantitative AI Strategies"
                title2="in Real Time"
                description="Stop trading blind. Access 100-point scoring, multi-pillar analytics, and instant strategy setups now."
                primaryBtnText="LAUNCH LIVE ANALYSIS FEED"
                primaryBtnAction="/signal-terminal"
                primaryBtnIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                }
                secondaryBtnText="SELECT STRATEGY"
                secondaryBtnAction={scrollToDemo}
            />
        </div>
    );
}
