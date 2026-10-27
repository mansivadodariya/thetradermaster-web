'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../profile.module.scss';
import { TradingViewPairIcon } from './TradingViewPairIcon';

// Mapping for Experience Level
const EXPERIENCE_MAP = {
    beginner: {
        title: 'Beginner',
        badge: 'LEVEL 01',
        desc: 'New to Forex or financial markets. Looking for guided trade validation & learning.',
        tag: 'Guided AI Analysis'
    },
    intermediate: {
        title: 'Intermediate',
        badge: 'LEVEL 02',
        desc: '1–3 years active trading experience. Looking to sharpen edge and verify setups.',
        tag: 'Scanner & Key Levels'
    },
    advanced: {
        title: 'Advanced',
        badge: 'LEVEL 03',
        desc: 'Consistent trader utilizing technical models, price action, and orderflow confluence.',
        tag: 'Cascade Timeframes'
    },
    professional: {
        title: 'Professional',
        badge: 'INSTITUTIONAL',
        desc: 'Prop firm funded or full-time market participant focused on algorithmic precision.',
        tag: 'MT5 Sub-ms Sync'
    }
};

// Mapping for Trading Styles
const STYLE_MAP = {
    scalping: { label: 'Scalping', timeframe: '1M – 5M EXECUTIONS' },
    day_trading: { label: 'Day Trading', timeframe: '15M – 1H INTRADAY' },
    swing_trading: { label: 'Swing Trading', timeframe: '4H – 1D MULTI-DAY' },
    position_trading: { label: 'Position Trading', timeframe: 'WEEKLY / MONTHLY' },
    algo_trading: { label: 'Algorithmic / Automated', timeframe: '24/7 EA LOGIC' },
    unsure: { label: 'Multi-Style / Flexible', timeframe: 'ADAPTIVE' }
};

// Mapping for AI Objectives / Help Goals
const GOAL_MAP = {
    analyze_trades: { label: 'Technical Chart Analysis & OCR Vision', tag: 'CHART VISION' },
    ask_ai: { label: 'AI Market Assistant & Live Copilot', tag: '24/7 CHAT' },
    automated_strategy: { label: 'Algorithmic Trading & EA Strategies', tag: 'STRATEGY' },
    backtesting: { label: 'Strategy Backtesting & Simulations', tag: 'BACKTEST' },
    risk_management: { label: 'Trade Audit & Mistake Prevention', tag: 'RISK DESK' },
    market_scanner: { label: 'Signal Terminal & Breakout Alerts', tag: 'SIGNALS' }
};

// Mapping for Preferred Markets
const MARKET_MAP = {
    eur_usd: { label: 'EUR/USD', category: 'Forex Major' },
    eurusd: { label: 'EUR/USD', category: 'Forex Major' },
    gbp_usd: { label: 'GBP/USD', category: 'Forex Major' },
    gbpusd: { label: 'GBP/USD', category: 'Forex Major' },
    usd_jpy: { label: 'USD/JPY', category: 'Forex Major' },
    usdjpy: { label: 'USD/JPY', category: 'Forex Major' },
    aud_usd: { label: 'AUD/USD', category: 'Forex Major' },
    audusd: { label: 'AUD/USD', category: 'Forex Major' },
    usd_cad: { label: 'USD/CAD', category: 'Forex Major' },
    usdcad: { label: 'USD/CAD', category: 'Forex Major' },
    usd_chf: { label: 'USD/CHF', category: 'Forex Major' },
    usdchf: { label: 'USD/CHF', category: 'Forex Major' },
    xau_usd: { label: 'XAU/USD', category: 'Commodity' },
    gold: { label: 'XAU/USD', category: 'Commodity' },
    btc_usd: { label: 'BTC/USD', category: 'Crypto' },
    crypto: { label: 'BTC/USD', category: 'Crypto' },
    us30: { label: 'US30', category: 'Indices' },
    indices: { label: 'US30', category: 'Indices' },
    oil: { label: 'Crude Oil (WTI)', category: 'Energy' }
};

export default function ProfileOnboardingSurveyCard({ onboardingData, t }) {
    const hasData = onboardingData && (
        onboardingData.experience ||
        (Array.isArray(onboardingData.tradingStyles) && onboardingData.tradingStyles.length > 0) ||
        (Array.isArray(onboardingData.helpGoals) && onboardingData.helpGoals.length > 0) ||
        (Array.isArray(onboardingData.markets) && onboardingData.markets.length > 0) ||
        onboardingData.completed
    );

    const expKey = (onboardingData?.experience || '').toLowerCase();
    const expInfo = EXPERIENCE_MAP[expKey] || (expKey ? { title: expKey.toUpperCase(), badge: 'TIER', desc: 'Custom configured trading level', tag: 'AI Calibrated' } : null);

    const stylesList = Array.isArray(onboardingData?.tradingStyles) ? onboardingData.tradingStyles : [];
    const goalsList = Array.isArray(onboardingData?.helpGoals) ? onboardingData.helpGoals : [];
    const marketsList = Array.isArray(onboardingData?.markets) ? onboardingData.markets : [];

    return (
        <div className={styles.onboardingSurveyCard}>
            {/* Header */}
            <div className={styles.surveyCardHeader}>
                <div className={styles.surveyHeaderLeft}>
                    <div className={styles.surveyIconPulse}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className={styles.surveyHeaderTexts}>
                        <div className={styles.surveyTitleBadgeRow}>
                            <h3>{t('profile.onboardingSurveyTitle', 'Trader Onboarding Survey & Strategy Profile')}</h3>
                        </div>
                        <p>{t('profile.onboardingSurveyDesc', 'Your trading methodology, risk parameters, and AI engine calibration preferences.')}</p>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            {!hasData ? (
                <div className={styles.emptySurveyBanner}>
                    <div className={styles.emptyIconWrap}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <div className={styles.emptyTexts}>
                        <h4>{t('profile.noSurveyDataTitle', 'Onboarding Survey Incomplete')}</h4>
                        <p>{t('profile.noSurveyDataDesc', 'Complete the 1-minute trader assessment to fine-tune AI recommendations, alert sensitivities, and chart tools to your exact style.')}</p>
                    </div>
                    <Link href="/onboarding" className={styles.startSurveyCta}>
                        {t('profile.startAssessment', 'Start Trader Assessment →')}
                    </Link>
                </div>
            ) : (
                <div className={styles.surveyGridDeck}>
                    {/* 1. Experience Level Block */}
                    <div className={styles.surveyBlockItem}>
                        <div className={styles.blockHead}>
                            <span className={styles.blockLabel}>{t('profile.experienceLevel', 'EXPERIENCE LEVEL')}</span>
                            {expInfo?.badge && <span className={styles.expBadgePill}>{expInfo.badge}</span>}
                        </div>
                        <div className={styles.blockMainVal}>
                            <h4>{expInfo?.title || 'Intermediate Trader'}</h4>
                            <p className={styles.blockSubDesc}>{expInfo?.desc || 'Active trader with custom AI parameters'}</p>
                        </div>
                        {expInfo?.tag && (
                            <div className={styles.blockFooterTag}>
                                <span>{expInfo.tag}</span>
                            </div>
                        )}
                    </div>

                    {/* 2. Trading Styles Block */}
                    <div className={styles.surveyBlockItem}>
                        <div className={styles.blockHead}>
                            <span className={styles.blockLabel}>{t('profile.tradingStyles', 'PRIMARY TRADING STYLES')}</span>
                            <span className={styles.countBadge}>{stylesList.length} Selected</span>
                        </div>
                        <div className={styles.pillsCluster}>
                            {stylesList.length > 0 ? (
                                stylesList.map((styleId) => {
                                    const sInfo = STYLE_MAP[styleId] || { label: styleId.replace(/_/g, ' ').toUpperCase(), timeframe: 'ACTIVE' };
                                    return (
                                        <div key={styleId} className={styles.surveyPillTag}>
                                            <span className={styles.pillDot} />
                                            <span className={styles.pillLabel}>{sInfo.label}</span>
                                            <span className={styles.pillTimeframe}>({sInfo.timeframe})</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <span className={styles.emptyTextMuted}>{t('profile.noStylesSelected', 'No styles selected')}</span>
                            )}
                        </div>
                    </div>

                    {/* 3. AI Objectives & Platform Goals */}
                    <div className={styles.surveyBlockItem}>
                        <div className={styles.blockHead}>
                            <span className={styles.blockLabel}>{t('profile.aiObjectives', 'AI PLATFORM OBJECTIVES')}</span>
                            <span className={styles.countBadge}>{goalsList.length} Goals</span>
                        </div>
                        <div className={styles.pillsCluster}>
                            {goalsList.length > 0 ? (
                                goalsList.map((goalId) => {
                                    const gInfo = GOAL_MAP[goalId] || { label: goalId.replace(/_/g, ' ').toUpperCase(), tag: 'AI' };
                                    return (
                                        <div key={goalId} className={styles.goalPillTag}>
                                            <span className={styles.goalTagBadge}>{gInfo.tag}</span>
                                            <span className={styles.goalText}>{gInfo.label}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <span className={styles.emptyTextMuted}>{t('profile.noObjectivesSet', 'No specific objectives set')}</span>
                            )}
                        </div>
                    </div>

                    {/* 4. Preferred Markets & Assets */}
                    <div className={styles.surveyBlockItem}>
                        <div className={styles.blockHead}>
                            <span className={styles.blockLabel}>{t('profile.preferredMarkets', 'PREFERRED ASSETS & MARKETS')}</span>
                            <span className={styles.countBadge}>{marketsList.length} Assets</span>
                        </div>
                        <div className={styles.pillsCluster}>
                            {marketsList.length > 0 ? (
                                marketsList.map((mId) => {
                                    const key = String(mId).toLowerCase();
                                    const mInfo = MARKET_MAP[key] || {
                                        label: String(mId).replace(/_/g, '/').toUpperCase(),
                                        category: 'Forex'
                                    };
                                    return (
                                        <div key={mId} className={styles.assetPillTag}>
                                            <TradingViewPairIcon pair={mInfo.label} size={15} />
                                            <span className={styles.assetName}>{mInfo.label}</span>
                                            <span className={styles.assetCategory}>{mInfo.category}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <span className={styles.emptyTextMuted}>{t('profile.allMajorAssets', 'All major global assets')}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
