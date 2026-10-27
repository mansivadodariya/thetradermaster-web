'use client';

import React from 'react';
import styles from '../profile.module.scss';
import AiAssessmentCard from './AiAssessmentCard';
import { TradingViewPairIcon, SessionIcon } from './TradingViewPairIcon';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function TradingProfileAnalysisCard({
    tradingProfileData,
    onOpenModal,
}) {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const dataObj = tradingProfileData?.data || tradingProfileData || {};
    const preferences = dataObj.preferences || tradingProfileData?.preferences || {};
    const personal = preferences.personal || {};
    const investment = preferences.investment || {};
    const risk = preferences.risk || {};
    const goals = preferences.goals || {};
    const pref = preferences.preferences || {};
    const latestAnalysis = dataObj.latest_analysis ||
                           dataObj.analysis ||
                           dataObj.assessment ||
                           dataObj.tradermaster_assessment ||
                           tradingProfileData?.latest_analysis ||
                           tradingProfileData?.analysis ||
                           tradingProfileData?.assessment ||
                           null;
    const hasProfile = Boolean(
        tradingProfileData?.has_saved_profile ||
        dataObj.has_saved_profile ||
        latestAnalysis ||
        personal.name ||
        personal.experience_level ||
        personal.full_name
    );

    const initialCap = Number(investment.total_investment || investment.total_investment_capital || 5000);
    const profitGoal = Number(goals.profit_goal || 25000);
    const targetMonths = Number(goals.timeframe || 12);
    const pairs = pref.preferred_currency_pairs || ['EUR/USD', 'GBP/USD', 'XAU/USD'];
    const sessions = pref.preferred_trading_sessions || pref.preferred_sessions || ['London Session', 'New York Session'];

    return (
        <div className={styles.tradingProfileAnalysisCard}>
            {/* Card Header */}
            <div className={styles.cardHeaderRow}>
                <div className={styles.cardTitleWrap}>
                    <div className={styles.aiPulseIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                    </div>
                    <div>
                        <h3>{t('profile.aiTradingProfileTitle', 'AI Trading Profile & Strategy Alignment')}</h3>
                        <p>{t('profile.aiTradingProfileDesc', 'Real-time algorithmic risk parameters, capital allocation, and market session routing.')}</p>
                    </div>
                </div>

                <button
                    type="button"
                    className={styles.btnReAnalyze}
                    onClick={onOpenModal}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
                        <path d="M19 16L20.2 19.3L23.5 20.5L20.2 21.7L19 25L17.8 21.7L14.5 20.5L17.8 19.3L19 16Z" opacity="0.85" />
                        <path d="M5 2L5.8 4.2L8 5L5.8 5.8L5 8L4.2 5.8L2 5L4.2 4.2L5 2Z" opacity="0.85" />
                    </svg>
                    <span>{hasProfile ? t('profile.reanalyzeProfile', 'Generate / Re-analyze Profile') : t('profile.generateProfile', 'Generate Trading Profile')}</span>
                </button>
            </div>

            {/* 4 Metrics Tiles */}
            <div className={styles.metricsGrid4}>
                <div className={styles.metricTile}>
                    <span className={styles.tileLabel}>{t('profile.riskTolerance', 'Risk Tolerance')}</span>
                    <span className={`${styles.tileValue} ${styles.tileValueRisk}`}>
                        {risk.risk_capacity || risk.risk_tolerance || 'Moderate'}
                    </span>
                    <span className={styles.tileSub}>
                        Max DD: {risk.max_drawdown_limit || risk.max_acceptable_drawdown || '15%'}
                    </span>
                </div>

                <div className={styles.metricTile}>
                    <span className={styles.tileLabel}>{t('profile.tradingStyle', 'Trading Style')}</span>
                    <span className={styles.tileValue}>
                        {personal.trading_style || 'Day Trading'}
                    </span>
                    <span className={styles.tileSub}>
                        {personal.experience_level || 'Intermediate'}
                    </span>
                </div>

                <div className={styles.metricTile}>
                    <span className={styles.tileLabel}>{t('profile.activeCapital', 'Active Capital')}</span>
                    <span className={styles.tileValue}>
                        ${initialCap.toLocaleString()}
                    </span>
                    <span className={styles.tileSub}>
                        +${Number(investment.monthly_top_up || 0).toLocaleString()}/mo
                    </span>
                </div>

                <div className={styles.metricTile}>
                    <span className={styles.tileLabel}>{t('profile.targetReturn', 'Target Return')}</span>
                    <span className={`${styles.tileValue} ${styles.tileValueReturn}`}>
                        {goals.monthly_return_rate || goals.monthly_return_target || '5%'} / mo
                    </span>
                    <span className={styles.tileSub}>
                        Goal: ${profitGoal.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* 12-Month Financial Projection Track */}
            <div className={styles.projectionCard}>
                <div className={styles.projectionHeader}>
                    <span>{t('profile.monthTargetGrowth', '{{months}}-Month Target Growth Horizon', { months: targetMonths })}</span>
                    <span>Initial: <strong>${initialCap.toLocaleString()}</strong> ➔ Target: <strong>${profitGoal.toLocaleString()}</strong></span>
                </div>
                <div className={styles.projectionTrack}>
                    <div
                        className={styles.projectionFill}
                        style={{ width: `${Math.min(100, Math.max(20, (initialCap / (profitGoal || 1)) * 100))}%` }}
                    />
                </div>
            </div>

            {/* Preferred Markets & Sessions Chips (Separate Dedicated Rows) */}
            <div className={styles.chipsContainer}>
                {/* Row 1: Preferred Pairs */}
                <div className={styles.chipRow}>
                    <span className={styles.chipRowLabel}>{t('profile.preferredPairs', 'Preferred Pairs:')}</span>
                    <div className={styles.chipItemsWrap}>
                        {pairs.map((p) => (
                            <span key={p} className={styles.pairChip}>
                                <TradingViewPairIcon pair={p} size={16} />
                                <span className={styles.chipText}>{p}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Row 2: Sessions */}
                <div className={styles.chipRow}>
                    <span className={styles.chipRowLabel}>{t('profile.sessions', 'Sessions:')}</span>
                    <div className={styles.chipItemsWrap}>
                        {sessions.map((s) => (
                            <span key={s} className={styles.sessionChip}>
                                <SessionIcon session={s} size={16} />
                                <span className={styles.chipText}>{s}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* TraderMaster AI Trading Assessment Response */}
            <AiAssessmentCard
                analysis={latestAnalysis || dataObj}
                preferences={preferences}
            />
        </div>
    );
}
