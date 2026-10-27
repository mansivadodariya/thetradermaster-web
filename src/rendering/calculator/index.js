'use client';

import CommonSectionHeader from '@/components/CommonSectionHeader';
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './calculator.module.scss';
import PipCalculator from './components/PipCalculator';
import MarginCalculator from './components/MarginCalculator';
import FibonacciCalculator from './components/FibonacciCalculator';
import PivotCalculator from './components/PivotCalculator';
import ProfitCalculator from './components/ProfitCalculator';

export default function ForexCalculator() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('pip'); // 'pip' | 'margin' | 'fibonacci' | 'pivot' | 'profit'
    const [copied, setCopied] = useState(false);
    const tabRefs = useRef({});

    useEffect(() => {
        if (tabRefs.current[activeTab]) {
            tabRefs.current[activeTab].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [activeTab]);

    const handleCopy = (text) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={styles.calculatorContainer}>
            {/* Header Title */}
            <CommonSectionHeader
                as="h1"
                badge={t('calculator.badge', 'INSTITUTIONAL QUANT UTILITY')}
                badgeIcon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="8" y1="6" x2="16" y2="6" />
                        <line x1="16" y1="14" x2="16" y2="18" />
                        <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
                    </svg>
                }
                title={t('calculator.title', 'Precision Forex & Trading Calculators')}
                subtitle={t('calculator.subtitle', 'Institutional position sizing, exact pip values, dynamic margins and mathematical levels')}
                isCard={true}
            />

            {/* Navigation Tabs */}
            <div className={styles.tabBarWrapper}>
                <button
                    ref={(el) => (tabRefs.current['pip'] = el)}
                    type="button"
                    className={`${styles.tabBtn} ${activeTab === 'pip' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('pip')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    <span>{t('calculator.pipValueTab', 'PIP Value')}</span>
                </button>
                <button
                    ref={(el) => (tabRefs.current['margin'] = el)}
                    type="button"
                    className={`${styles.tabBtn} ${activeTab === 'margin' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('margin')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    <span>{t('calculator.marginTab', 'Margin')}</span>
                </button>
                <button
                    ref={(el) => (tabRefs.current['fibonacci'] = el)}
                    type="button"
                    className={`${styles.tabBtn} ${activeTab === 'fibonacci' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('fibonacci')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                    <span>{t('calculator.fibonacci', 'Fibonacci')}</span>
                </button>
                <button
                    ref={(el) => (tabRefs.current['pivot'] = el)}
                    type="button"
                    className={`${styles.tabBtn} ${activeTab === 'pivot' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('pivot')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                    <span>{t('calculator.pivotPoints', 'Pivot Points')}</span>
                </button>
                <button
                    ref={(el) => (tabRefs.current['profit'] = el)}
                    type="button"
                    className={`${styles.tabBtn} ${activeTab === 'profit' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('profit')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8h6V2" /><path d="m22 2-7.5 7.5-5-5L2 14" /><path d="M2 18h20" /></svg>
                    <span>{t('calculator.profitTab', 'Profit & Loss')}</span>
                </button>
            </div>

            {/* TAB 1: PIP VALUE CALCULATOR */}
            {activeTab === 'pip' && (
                <PipCalculator onCopy={handleCopy} copied={copied} />
            )}

            {/* TAB 2: MARGIN CALCULATOR */}
            {activeTab === 'margin' && (
                <MarginCalculator onCopy={handleCopy} copied={copied} />
            )}

            {/* TAB 3: FIBONACCI CALCULATOR */}
            {activeTab === 'fibonacci' && (
                <FibonacciCalculator />
            )}

            {/* TAB 4: PIVOT POINTS CALCULATOR */}
            {activeTab === 'pivot' && (
                <PivotCalculator />
            )}

            {/* TAB 5: PROFIT & LOSS / RISK CALCULATOR */}
            {activeTab === 'profit' && (
                <ProfitCalculator onCopy={handleCopy} copied={copied} />
            )}
        </div>
    );
}
