'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../aiStrategy.module.scss';
import { IndicatorIcon, CircleCheckIcon, formatValue } from '@/icons/analysisIcons';

export default function MomentumSection({
    momentumIndicators = {},
    momentum = {},
    evidence = [],
}) {
    const defaultMomentumItems = [
        { label: 'RSI', value: 71.12297, action: 'Overbought' },
        { label: 'CCI', value: 110.75886, action: 'Overbought' },
        { label: 'ROC_9', value: 0.95469, action: 'Bullish' },
        { label: 'ROC_14', value: 1.07208, action: 'Bullish' },
        { label: 'ROC_25', value: 2.84384, action: 'Bullish' },
        { label: 'Stoch_K', value: 90.86485, action: 'Overbought' },
    ];

    let momentumChips = [];
    if (momentumIndicators && typeof momentumIndicators === 'object' && Object.keys(momentumIndicators).length > 0) {
        momentumChips = Object.entries(momentumIndicators).map(([key, val]) => {
            const numVal = typeof val === 'object' && val !== null ? val.value : val;
            const act = typeof val === 'object' && val !== null ? val.action : 'Overbought';
            return {
                label: key,
                value: numVal,
                action: act || 'Bullish'
            };
        }).filter(item => item.value !== undefined && item.value !== null);
    }

    if (momentumChips.length === 0) {
        momentumChips = defaultMomentumItems;
    }

    const defaultEvidence = [
        'RSI (14) at 71.12 entering overbought territory indicating strong bullish thrust',
        'MACD histogram expanding positively above zero line confirming buyer momentum',
        'Stochastic %K / %D holding sustained upper boundary momentum',
    ];

    const evidenceList = Array.isArray(evidence) && evidence.length > 0 ? evidence : defaultEvidence;

    // Visual ranges for top oscillators
    const rsiChip = momentumChips.find(c => c.label.toLowerCase().includes('rsi'));
    const stochKChip = momentumChips.find(c => c.label.toLowerCase().includes('stoch_k') || c.label.toLowerCase().includes('stoch'));
    const rsiVal = Number(momentum.rsi_14 || rsiChip?.value || 71.1);
    const macdLine = Number(momentum.macd?.line || 21.4266);
    const macdSignal = Number(momentum.macd?.signal || 18.2506);
    const macdHist = Number(momentum.macd?.histogram || 3.176);
    const stochK = Math.round(Number(momentum.stoch_k || stochKChip?.value || 91));
    const stochD = Math.round(Number(momentum.stoch_d || 87));

    const getActionStyle = (action = '') => {
        const lower = action.toLowerCase();
        if (lower.includes('overbought')) {
            return { color: '#F43F5E', borderColor: 'rgba(244, 63, 94, 0.35)', background: 'rgba(244, 63, 94, 0.12)' };
        }
        if (lower.includes('oversold')) {
            return { color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.35)', background: 'rgba(56, 189, 248, 0.12)' };
        }
        if (lower.includes('bull') || lower.includes('buy')) {
            return { color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.35)', background: 'rgba(16, 185, 129, 0.12)' };
        }
        return { color: '#EAB308', borderColor: 'rgba(234, 179, 8, 0.35)', background: 'rgba(234, 179, 8, 0.12)' };
    };

    return (
        <div className={styles.unifiedDomainCard}>
            {/* Header */}
            <div className={styles.domainHeaderRow}>
                <div className={styles.domainTitleGroup}>
                    <div className={styles.domainIconWrap} style={{ color: '#18C98B', background: 'rgba(24, 201, 139, 0.1)', borderColor: 'rgba(24, 201, 139, 0.25)' }}>
                        <IndicatorIcon type="momentum" />
                    </div>
                    <div>
                        <h4 className={styles.domainMainTitle}>MOMENTUM OSCILLATORS & EVIDENCE</h4>
                        <span className={styles.domainSubtitle}>Velocity, overbought dynamics & convergence divergence</span>
                    </div>
                </div>
                <div
                    className={styles.domainSentimentBadge}
                    style={{
                        color: '#18C98B',
                        borderColor: 'rgba(24, 201, 139, 0.35)',
                        background: 'rgba(24, 201, 139, 0.1)'
                    }}
                >
                    RSI • MACD • STOCH
                </div>
            </div>

            {/* All 3 Components in ONE ROW: [ 3 Oscillator Boxes (Col 1) | Indicators Table (Col 2) | Momentum Evidence (Col 3) ] */}
            <div className={styles.threeColumnUnifiedRow}>
                {/* Column 1: All 3 Oscillator Boxes in One Column */}
                <div className={styles.momentumSlidersColumn}>
                    {/* 1. RSI Range Slider */}
                    <div className={styles.visualSliderBlock}>
                        <div className={styles.sliderHeaderRow}>
                            <span className={styles.sliderName}>
                                RSI (14) <span style={{ color: '#10B981' }}>Overbought (&gt;70)</span>
                            </span>
                            <span className={styles.sliderValueText}>{rsiVal.toFixed(2)}</span>
                        </div>
                        <div className={styles.rsiTrack}>
                            <div
                                className={styles.rsiNeedlePin}
                                style={{ left: `${Math.min(98, Math.max(2, rsiVal))}%` }}
                            />
                        </div>
                        <div className={styles.rsiThresholds}>
                            <span style={{ left: '30%' }}>30</span>
                            <span style={{ left: '70%' }}>70</span>
                        </div>
                    </div>

                    {/* 2. MACD Histogram Row */}
                    <div className={styles.visualSliderBlock}>
                        <div className={styles.sliderHeaderRow}>
                            <span className={styles.sliderName}>MACD (12, 26, 9)</span>
                            <span className={styles.macdActionTag} style={{ color: '#10B981' }}>Bullish</span>
                        </div>
                        <div className={styles.macdTrack}>
                            <div className={styles.macdZeroLine} />
                            <div
                                className={styles.macdBarFill}
                                style={{
                                    width: '22%',
                                    left: '50%',
                                    background: '#10B981'
                                }}
                            />
                        </div>
                        <div className={styles.macdDetailsRow}>
                            <span>Line: {macdLine.toFixed(4)}</span>
                            <span>Signal: {macdSignal.toFixed(4)}</span>
                            <span>Hist: {macdHist.toFixed(3)}</span>
                        </div>
                    </div>

                    {/* 3. Stochastic K & D Progress Bars */}
                    <div className={styles.visualSliderBlock}>
                        <div className={styles.stochRow}>
                            <span className={styles.stochLabel}>Stoch %K</span>
                            <div className={styles.stochBarTrack}>
                                <div className={styles.stochBarFill} style={{ width: `${Math.min(100, stochK)}%` }} />
                            </div>
                            <span className={styles.stochValue}>{stochK}</span>
                        </div>
                        <div className={styles.stochRow}>
                            <span className={styles.stochLabel}>Stoch %D</span>
                            <div className={styles.stochBarTrack}>
                                <div className={styles.stochBarFill} style={{ width: `${Math.min(100, stochD)}%` }} />
                            </div>
                            <span className={styles.stochValue}>{stochD}</span>
                        </div>
                    </div>
                </div>

                {/* Column 2: Momentum Indicators Table */}
                <div className={styles.seamlessListColumn}>
                    <div className={styles.cleanIndicatorsListTable}>
                        {momentumChips.map((chip, i) => {
                            const actStyle = getActionStyle(chip.action);
                            return (
                                <div key={i} className={styles.indicatorTableRow}>
                                    <span className={styles.rowName}>{chip.label}</span>
                                    <span className={styles.rowValue}>{formatValue(chip.value)}</span>
                                    <span
                                        className={styles.rowAction}
                                        style={{ color: actStyle.color }}
                                    >
                                        {chip.action || 'Bullish'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Column 3: Momentum Evidence List */}
                <div className={styles.seamlessEvidenceColumn}>
                    <div className={styles.evidenceHeaderTag}>
                        <div className={styles.evidenceTitleWrap}>
                            <span className={styles.evidenceTagDot} />
                            <span className={styles.evidenceTitleText}>MOMENTUM EVIDENCE</span>
                        </div>
                        <span className={styles.evidenceVerifiedBadge}>DYNAMICS</span>
                    </div>
                    <ul className={styles.domainEvidenceList}>
                        {evidenceList.map((item, idx) => (
                            <li key={idx} className={styles.domainEvidenceItem}>
                                <CircleCheckIcon color="#18C98B" />
                                <span>{typeof item === 'string' ? item : item.text || item.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
