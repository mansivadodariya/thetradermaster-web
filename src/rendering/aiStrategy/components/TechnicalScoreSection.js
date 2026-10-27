'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import styles from '../aiStrategy.module.scss';
import SpeedometerGauge from './SpeedometerGauge';
import { IndicatorIcon, getScoreColor } from '@/icons/analysisIcons';

export default function TechnicalScoreSection({
    technicalScore = {},
}) {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const scoreColor = getScoreColor(technicalScore.label);
    const breakdown = technicalScore.breakdown || {};

    const trendBreakdown = breakdown.trend || { score: 25, max: 25, label: 'Bullish' };
    const momentumBreakdown = breakdown.momentum || { score: 21, max: 25, label: 'Bullish' };
    const structureBreakdown = breakdown.structure || { score: 12, max: 25, label: 'Neutral' };

    const trendPct = Math.round(((trendBreakdown.score || 25) / (trendBreakdown.max || 25)) * 100);
    const momentumPct = Math.round(((momentumBreakdown.score || 21) / (momentumBreakdown.max || 25)) * 100);
    const structurePct = Math.round(((structureBreakdown.score || 12) / (structureBreakdown.max || 25)) * 100);

    return (
        <div className={styles.technicalScoreShowcaseCard}>
            {/* Header */}
            <div className={styles.sectionHeaderRow}>
                <div className={styles.headerTitleGroup}>
                    <div className={styles.titleIconPulse} style={{ backgroundColor: scoreColor }} />
                    <span className={styles.headerMainTitle} style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>{t('aiStrategy.technicalScore', 'TECHNICAL SCORE')}</span>
                </div>
                <div className={styles.headerConfidencePill}>
                    <span className={styles.confLabel} style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.5)' }}>{t('aiStrategy.confidence', 'CONFIDENCE')}</span>
                    <span className={styles.confValText} style={{ color: isLight ? '#047857' : '#10B981' }}>{technicalScore.confidence || '56%'}</span>
                </div>
            </div>

            {/* Main Content: Speedometer (Left) + High Level Pillars (Right) */}
            <div className={styles.scoreShowcaseContentGrid}>
                {/* Left: Master Speedometer Gauge (0 to 100 Numeric Scale) */}
                <div className={styles.speedometerColumn}>
                    <SpeedometerGauge
                        score={technicalScore.total || 68}
                        label={technicalScore.label || 'BULLISH'}
                        confidence={technicalScore.confidence || '56%'}
                        mode="numeric"
                    />
                </div>

                {/* Right: Pillars Confluence Overview */}
                <div className={styles.pillarsOverviewCol}>
                    {/* 1. Trend Pillar */}
                    <div className={styles.pillarSummaryRow}>
                        <div className={styles.pillarMeta}>
                            <div className={styles.pillarIconWrap} style={{ color: isLight ? '#047857' : '#10B981' }}>
                                <IndicatorIcon type="trend" />
                            </div>
                            <span className={styles.pillarName} style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>{t('aiStrategy.trendAnalysis', 'Trend Analysis')}</span>
                        </div>
                        <div className={styles.pillarTrackWrap}>
                            <div className={styles.pillarTrack}>
                                <div className={styles.pillarFill} style={{ width: `${trendPct}%`, background: isLight ? '#059669' : '#10B981' }} />
                            </div>
                        </div>
                        <div className={styles.pillarScoreWrap}>
                            <span className={styles.pillarScoreText} style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>
                                {trendBreakdown.score || 25}{' '}
                                <span className={styles.pillarMaxScore} style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.45)' }}>/ 25</span>
                            </span>
                            <span
                                className={`${styles.pillarSentimentBadge} ${styles.trendBadge}`}
                                style={{
                                    color: isLight ? '#047857' : '#10B981',
                                    borderColor: isLight ? 'rgba(5, 150, 105, 0.4)' : 'rgba(16, 185, 129, 0.3)',
                                    background: isLight ? '#ECFDF5' : 'rgba(16, 185, 129, 0.1)',
                                    fontWeight: 700
                                }}
                            >
                                {trendBreakdown.label || 'Bullish'}
                            </span>
                        </div>
                    </div>

                    {/* 2. Momentum Pillar */}
                    <div className={styles.pillarSummaryRow}>
                        <div className={styles.pillarMeta}>
                            <div className={styles.pillarIconWrap} style={{ color: isLight ? '#7C3AED' : '#C084FC' }}>
                                <IndicatorIcon type="momentum" />
                            </div>
                            <span className={styles.pillarName} style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>{t('aiStrategy.momentumDynamics', 'Momentum Dynamics')}</span>
                        </div>
                        <div className={styles.pillarTrackWrap}>
                            <div className={styles.pillarTrack}>
                                <div className={styles.pillarFill} style={{ width: `${momentumPct}%`, background: isLight ? '#8B5CF6' : '#C084FC' }} />
                            </div>
                        </div>
                        <div className={styles.pillarScoreWrap}>
                            <span className={styles.pillarScoreText} style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>
                                {momentumBreakdown.score || 21}{' '}
                                <span className={styles.pillarMaxScore} style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.45)' }}>/ 25</span>
                            </span>
                            <span
                                className={`${styles.pillarSentimentBadge} ${styles.momentumBadge}`}
                                style={{
                                    color: isLight ? '#7C3AED' : '#C084FC',
                                    borderColor: isLight ? 'rgba(124, 58, 237, 0.4)' : 'rgba(192, 132, 252, 0.3)',
                                    background: isLight ? '#F5F3FF' : 'rgba(192, 132, 252, 0.1)',
                                    fontWeight: 700
                                }}
                            >
                                {momentumBreakdown.label || 'Bullish'}
                            </span>
                        </div>
                    </div>

                    {/* 3. Structure Pillar */}
                    <div className={styles.pillarSummaryRow}>
                        <div className={styles.pillarMeta}>
                            <div className={styles.pillarIconWrap} style={{ color: isLight ? '#0284C7' : '#38BDF8' }}>
                                <IndicatorIcon type="structure" />
                            </div>
                            <span className={styles.pillarName} style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>{t('aiStrategy.marketStructure', 'Market Structure')}</span>
                        </div>
                        <div className={styles.pillarTrackWrap}>
                            <div className={styles.pillarTrack}>
                                <div className={styles.pillarFill} style={{ width: `${structurePct}%`, background: isLight ? '#0EA5E9' : '#38BDF8' }} />
                            </div>
                        </div>
                        <div className={styles.pillarScoreWrap}>
                            <span className={styles.pillarScoreText} style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>
                                {structureBreakdown.score || 12}{' '}
                                <span className={styles.pillarMaxScore} style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.45)' }}>/ 25</span>
                            </span>
                            <span
                                className={`${styles.pillarSentimentBadge} ${styles.structureBadge}`}
                                style={{
                                    color: isLight ? '#0284C7' : '#38BDF8',
                                    borderColor: isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(56, 189, 248, 0.3)',
                                    background: isLight ? '#F0F9FF' : 'rgba(56, 189, 248, 0.1)',
                                    fontWeight: 700
                                }}
                            >
                                {structureBreakdown.label || 'Neutral'}
                            </span>
                        </div>
                    </div>

                    {/* Confluence Formula Line */}
                    <div className={styles.confluenceFormulaLine}>
                        <span className={styles.formulaTitle} style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.5)' }}>{t('aiStrategy.scoringEquation', 'SCORING EQUATION:')}</span>
                        <span className={styles.formulaEquation} style={{ color: isLight ? '#0F172A' : 'rgba(255, 255, 255, 0.85)' }}>
                            {t('aiStrategy.trend', 'Trend')} ({trendBreakdown.score || 25}) + {t('aiStrategy.momentum', 'Momentum')} ({momentumBreakdown.score || 21}) + {t('aiStrategy.structure', 'Structure')} ({structureBreakdown.score || 12}) = <strong style={{ color: isLight ? '#047857' : '#10B981' }}>{technicalScore.total || 68} / 100</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
