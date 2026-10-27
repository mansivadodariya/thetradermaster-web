'use client';

import React from 'react';
import styles from '../aiStrategy.module.scss';
import { useLanguage } from '@/context/LanguageContext';
import {
    TrendArrowIcon,
    TrendBoxIcon,
    getScoreColor,
    formatValue,
} from '@/icons/analysisIcons';

export default function IndicatorsBreakdownSection({
    trendAnalysis = {},
    momentum = {},
    scoreColor,
}) {
    const { t } = useLanguage();
    const isBullish = trendAnalysis.direction?.toLowerCase().includes('bull') || trendAnalysis.direction?.toLowerCase().includes('buy');

    return (
        <div className={styles.indicatorsBreakdownGrid}>
            {/* 1. TREND ANALYSIS CARD */}
            <div className={styles.breakdownDetailCard}>
                <div className={styles.cardHeaderRow}>
                    <div className={styles.headerTitleGroup}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                        </svg>
                        <span className={styles.headerMainTitle}>
                            {t('aiStrategy.trendTitle', 'TREND ANALYSIS')}
                        </span>
                    </div>
                    <span
                        className={styles.directionStatusPill}
                        style={{
                            color: isBullish ? '#10b981' : '#ef4444',
                            backgroundColor: isBullish ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            borderColor: isBullish ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                        }}
                    >
                        {trendAnalysis.direction || 'Neutral'}
                    </span>
                </div>

                <div className={styles.cardContentBody}>
                    {/* Direction & Strength Banner */}
                    <div className={styles.trendRowHeader}>
                        <TrendBoxIcon isBullish={isBullish} />
                        <div className={styles.trendHeaderText}>
                            <h4>{trendAnalysis.direction || 'Neutral'} Trend</h4>
                            <span>{trendAnalysis.strength || 'Consistent technical alignment'}</span>
                        </div>
                    </div>

                    {/* EMA & SuperTrend 3-Column Metric Cards */}
                    <div className={styles.indicatorMetricGrid}>
                        <div className={styles.metricGridItem}>
                            <div className={styles.indicatorLabelBox}>
                                <span className={`${styles.dotDot} ${styles.ema20}`} />
                                <span>EMA 20</span>
                            </div>
                            <div className={styles.indicatorValueAction}>
                                <span
                                    className={styles.positionTxt}
                                    style={{ color: trendAnalysis.ema_20?.position === 'Above' ? '#10b981' : '#ef4444' }}
                                >
                                    {trendAnalysis.ema_20?.position || 'Below'}
                                </span>
                                <TrendArrowIcon direction={trendAnalysis.ema_20?.position} />
                            </div>
                        </div>

                        <div className={styles.metricGridItem}>
                            <div className={styles.indicatorLabelBox}>
                                <span className={`${styles.dotDot} ${styles.ema50}`} />
                                <span>EMA 50</span>
                            </div>
                            <div className={styles.indicatorValueAction}>
                                <span
                                    className={styles.positionTxt}
                                    style={{ color: trendAnalysis.ema_50?.position === 'Above' ? '#10b981' : '#ef4444' }}
                                >
                                    {trendAnalysis.ema_50?.position || 'Below'}
                                </span>
                                <TrendArrowIcon direction={trendAnalysis.ema_50?.position} />
                            </div>
                        </div>

                        <div className={styles.metricGridItem}>
                            <div className={styles.indicatorLabelBox}>
                                <span className={`${styles.dotDot} ${styles.supertrend}`} />
                                <span>SuperTrend</span>
                            </div>
                            <div className={styles.indicatorValueAction}>
                                <span
                                    className={styles.positionTxt}
                                    style={{ color: trendAnalysis.supertrend?.direction === 'BULLISH' ? '#10b981' : '#ef4444' }}
                                >
                                    {trendAnalysis.supertrend?.direction === 'BULLISH' ? 'Above' : 'Below'}
                                </span>
                                <TrendArrowIcon direction={trendAnalysis.supertrend?.direction === 'BULLISH' ? 'Above' : 'Below'} />
                            </div>
                        </div>
                    </div>

                    {/* Trend Confidence Visual Progress */}
                    <div className={styles.trendConfidenceContainer}>
                        <div className={styles.confidenceTexts}>
                            <span>Trend Confidence</span>
                            <strong>{trendAnalysis.trend_confidence || '75%'}</strong>
                        </div>
                        <div className={styles.confidenceTrack}>
                            <div
                                className={styles.confidenceFill}
                                style={{
                                    width: trendAnalysis.trend_confidence || '75%',
                                    backgroundColor: scoreColor || '#10b981'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MOMENTUM ANALYSIS CARD */}
            <div className={styles.breakdownDetailCard}>
                <div className={styles.cardHeaderRow}>
                    <div className={styles.headerTitleGroup}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <span className={styles.headerMainTitle}>
                            {t('aiStrategy.momentumTitle', 'MOMENTUM OSCILLATORS')}
                        </span>
                    </div>
                    <span className={styles.momentumTagPill}>
                        RSI &bull; MACD &bull; Stoch
                    </span>
                </div>

                <div className={styles.cardContentBody}>
                    {/* RSI Visual Range Slider */}
                    <div className={styles.momentumSliderContainer}>
                        <div className={styles.sliderLabelRow}>
                            <div className={styles.rsiNameWithStatus}>
                                <span className={styles.sliderName}>RSI (14)</span>
                                <span className={styles.sliderStatusLabel}>
                                    {momentum.rsi?.value < 30 ? 'Oversold (<30)' : momentum.rsi?.value > 70 ? 'Overbought (>70)' : 'Neutral Dynamic'}
                                </span>
                            </div>
                            <span className={styles.sliderValTxt}>{formatValue(momentum.rsi?.value) || '50.0'}</span>
                        </div>

                        {/* Gradient Track & Pin Pointer */}
                        <div className={styles.gradientTrackBg}>
                            <div
                                className={styles.sliderPinPointer}
                                style={{ left: `${Math.min(100, Math.max(0, momentum.rsi?.value || 50))}%` }}
                            >
                                <div className={styles.pinDot} />
                                <div className={styles.pinLine} />
                            </div>
                            <span className={styles.axisMarker} style={{ left: '30%' }}>30</span>
                            <span className={styles.axisMarker} style={{ left: '70%' }}>70</span>
                        </div>
                    </div>

                    {/* MACD Histogram Visualizer */}
                    {momentum.macd && (
                        <div className={styles.macdMetricsContainer}>
                            <div className={styles.macdHeaderRow}>
                                <span className={styles.macdTitle}>MACD ({momentum.macd.params || '12, 26, 9'})</span>
                                <span
                                    className={styles.macdLabelValue}
                                    style={{ color: getScoreColor(momentum.macd.direction) }}
                                >
                                    {momentum.macd.direction || 'Neutral'}
                                </span>
                            </div>

                            {/* Histogram Center Alignment Track */}
                            <div className={styles.macdHistogramTrack}>
                                <div className={styles.centerLine} />
                                {momentum.macd.histogram !== undefined && (
                                    <div
                                        className={styles.histogramFillBar}
                                        style={{
                                            left: momentum.macd.histogram >= 0 ? '50%' : `calc(50% - ${Math.min(48, Math.abs(momentum.macd.histogram) * 2.5)}%)`,
                                            width: `${Math.min(48, Math.abs(momentum.macd.histogram) * 2.5)}%`,
                                            backgroundColor: momentum.macd.histogram >= 0 ? '#10b981' : '#ef4444'
                                        }}
                                    />
                                )}
                            </div>
                            <div className={styles.macdSubDetailsRow}>
                                <span>Line: <strong>{formatValue(momentum.macd.line)}</strong></span>
                                <span>Signal: <strong>{formatValue(momentum.macd.signal)}</strong></span>
                                <span>Hist: <strong>{formatValue(momentum.macd.histogram)}</strong></span>
                            </div>
                        </div>
                    )}

                    {/* Stochastic %K and %D Rows */}
                    {momentum.stochastic && (
                        <div className={styles.stochasticSubProgressList}>
                            <div className={styles.stochProgressRow}>
                                <span className={styles.stochLabel}>Stoch %K</span>
                                <div className={styles.stochTrackBg}>
                                    <div
                                        className={styles.stochFillBar}
                                        style={{
                                            width: `${momentum.stochastic.k || 0}%`,
                                            backgroundColor: getScoreColor(momentum.stochastic.direction)
                                        }}
                                    />
                                </div>
                                <span className={styles.stochValText}>{Math.round(momentum.stochastic.k || 0)}</span>
                            </div>

                            <div className={styles.stochProgressRow}>
                                <span className={styles.stochLabel}>Stoch %D</span>
                                <div className={styles.stochTrackBg}>
                                    <div
                                        className={styles.stochFillBar}
                                        style={{
                                            width: `${momentum.stochastic.d || 0}%`,
                                            backgroundColor: getScoreColor(momentum.stochastic.direction)
                                        }}
                                    />
                                </div>
                                <span className={styles.stochValText}>{Math.round(momentum.stochastic.d || 0)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
