"use client";

import React, { useState, useRef } from 'react';
import { toast } from '@/components/toast';
import CommonCta from '@/components/commonCta';
import { QUICK_PROMPTS } from './constants/aiChatData';
import ChatHeroSection from './components/ChatHeroSection';
import PromptStartersSection from './components/PromptStartersSection';
import LiveChatDemoSection from './components/LiveChatDemoSection';
import ChatFeaturesSection from './components/ChatFeaturesSection';
import ComparisonFaqSection from './components/ComparisonFaqSection';
import styles from './aiChat.module.scss';

export default function AiChat() {
    const [selectedPrompt, setSelectedPrompt] = useState(QUICK_PROMPTS[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const demoRef = useRef(null);

    const handleSelectPrompt = (promptItem) => {
        setIsGenerating(true);
        setSelectedPrompt(promptItem);
        setCustomInput('');

        // Smooth scroll to demo section
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
            setIsGenerating(false);
            toast.success(`Loaded ${promptItem.category} AI Setup!`);
        }, 350);
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!customInput.trim()) return;

        setIsGenerating(true);
        const dynamicSetup = {
            id: 'custom-query',
            category: 'Custom Pair Analysis',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            ),
            badge: 'LIVE QUERY',
            presetText: customInput,
            demoData: {
                pair: customInput.toUpperCase().slice(0, 8),
                timeframe: 'M15 / H1 Analysis',
                userPrompt: customInput,
                title: `${customInput.toUpperCase().slice(0, 8)} Real-Time AI Outlook`,
                price: "1.24850",
                trend: "Bullish Trend Confluence",
                trendType: "bullish",
                resistance: "R1 = 1.25200 | R2 = 1.25800",
                support: "S1 = 1.24500 | S2 = 1.23900",
                setup: {
                    entryZone: "1.24700 - 1.24900 (Pullback to EMA 20)",
                    stopLoss: "1.24350 (35 Pips Below Support)",
                    takeProfit1: "1.25350 (65 Pips)",
                    takeProfit2: "1.25900 (120 Pips)",
                    rrr: "1 : 2.5",
                },
                indicators: [
                    { name: 'EMA 20 > 50', status: 'Bullish Crossover Active', val: '1.24650' },
                    { name: 'RSI (14)', status: '56.2 (Healthy Inflow)', val: 'Bullish' },
                    { name: 'Order Block', status: 'Institutional Liquidity Absorbed', val: 'Support @ 1.24400' }
                ],
                note: "Calculated with live MT5 feed algorithms. Manage risk with disciplined stop-loss sizing."
            }
        };

        setTimeout(() => {
            setSelectedPrompt(dynamicSetup);
            setIsGenerating(false);
            toast.success(`Generated setup for ${customInput}!`);
        }, 500);
    };

    const handleCopySetup = () => {
        const text = `TRADERMASTER AI TRADE SETUP:
Pair: ${selectedPrompt.demoData.pair}
Outlook: ${selectedPrompt.demoData.title}
Trend: ${selectedPrompt.demoData.trend}
Entry: ${selectedPrompt.demoData.setup.entryZone}
Stop Loss: ${selectedPrompt.demoData.setup.stopLoss}
TP1: ${selectedPrompt.demoData.setup.takeProfit1}
TP2: ${selectedPrompt.demoData.setup.takeProfit2}
RRR: ${selectedPrompt.demoData.setup.rrr}`;

        navigator.clipboard.writeText(text);
        toast.success('Trade setup copied to clipboard!');
    };

    const scrollToDemo = () => {
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Ambient Atmosphere Background Glows */}
            <div className={styles.ambientTopGlow} aria-hidden="true" />
            <div className={styles.ambientCenterGlow} aria-hidden="true" />
            <div className={styles.ambientBottomGlow} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            {/* 1. PAGE HEADER & HERO SECTION */}
            <ChatHeroSection />

            {/* 3. PRE-BUILT QUICK PROMPT STARTERS */}
            <PromptStartersSection
                selectedPrompt={selectedPrompt}
                onSelectPrompt={handleSelectPrompt}
            />

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 5. LIVE INTERACTIVE CHAT DEMO */}
            <LiveChatDemoSection
                demoRef={demoRef}
                selectedPrompt={selectedPrompt}
                onSelectPrompt={handleSelectPrompt}
                isGenerating={isGenerating}
                customInput={customInput}
                setCustomInput={setCustomInput}
                onCustomSubmit={handleCustomSubmit}
                onCopySetup={handleCopySetup}
            />

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 4. KEY FEATURES & CAPABILITIES */}
            <ChatFeaturesSection />

            {/* 6. COMPARISON MATRIX & 7. FAQS */}
            <ComparisonFaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

            {/* 8. BOTTOM CALL TO ACTION */}
            <CommonCta
                badge="ZERO-LATENCY AI TRADING INTELLIGENCE"
                title1="Start Chatting with Your"
                title2="AI Copilot Today"
                description="Transform market noise into high-probability trading decisions in seconds."
                primaryBtnText="LAUNCH AI CHAT NOW"
                primaryBtnAction="/market-assistant"
                primaryBtnIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                }
                secondaryBtnText="VIEW LIVE DEMO"
                secondaryBtnAction={scrollToDemo}
            />
        </div>
    );
}
