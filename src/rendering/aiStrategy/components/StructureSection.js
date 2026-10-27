'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../aiStrategy.module.scss';
import { IndicatorIcon, CircleCheckIcon, formatValue } from '@/icons/analysisIcons';

export default function StructureSection({
    levels = {},
    pivotPoints = {},
    evidence = [],
    structureScore = 12,
    maxScore = 25,
}) {
    const { t } = useLanguage();
    const defaultStructure = {
        nearestSupport: 4418.71769,
        nearestResistance: 4439.31457,
        pivotP: 4437.78065,
        r1: 4440.97151,
        s1: 4433.48597,
    };

    const std = pivotPoints?.standard || pivotPoints || {};
    const supportVal = levels?.nearest_support || levels?.support || 4418.71769;
    const resistVal = levels?.nearest_resistance || levels?.resistance || 4439.31457;
    const pivotP = std.P || std.p || pivotPoints?.P || pivotPoints?.p || pivotPoints?.pivot || 4437.78065;
    const r1 = std.R1 || std.r1 || pivotPoints?.R1 || pivotPoints?.r1 || 4440.97151;
    const s1 = std.S1 || std.s1 || pivotPoints?.S1 || pivotPoints?.s1 || 4433.48597;

    const levelItems = [
        { label: 'Nearest Support', value: supportVal, type: 'support' },
        { label: 'Nearest Resistance', value: resistVal, type: 'resistance' },
        { label: 'Pivot Standard (P)', value: pivotP, type: 'pivot' },
        { label: 'Resistance 1 (R1)', value: r1, type: 'resistance' },
        { label: 'Support 1 (S1)', value: s1, type: 'support' },
    ];

    const defaultEvidence = [
        'Price holding firmly above Pivot Standard level 4,437.78',
        'Clean test and rejection of Nearest Support at 4,418.72',
        'Immediate upside target oriented toward Resistance 1 (R1) 4,440.97',
    ];

    const evidenceList = Array.isArray(evidence) && evidence.length > 0 ? evidence : defaultEvidence;
    const progressPct = Math.round(((structureScore || 12) / (maxScore || 25)) * 100);

    return (
        <div className={styles.unifiedDomainCard}>
            {/* Header */}
            <div className={styles.domainHeaderRow}>
                <div className={styles.domainTitleGroup}>
                    <div className={styles.domainIconWrap} style={{ color: '#18C98B', background: 'rgba(24, 201, 139, 0.1)', borderColor: 'rgba(24, 201, 139, 0.25)' }}>
                        <IndicatorIcon type="structure" />
                    </div>
                    <div>
                        <h4 className={styles.domainMainTitle}>STRUCTURE & KEY LEVELS & EVIDENCE</h4>
                        <span className={styles.domainSubtitle}>Support, resistance, pivot order flow & price action boundaries</span>
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
                    NEUTRAL • {structureScore}/{maxScore}
                </div>
            </div>

            {/* All 3 Components in ONE ROW: [ Confluence Score Card (Col 1) | 5 Key Levels (Col 2) | Structure Evidence (Col 3) ] */}
            <div className={styles.threeColumnUnifiedRow}>
                {/* Column 1: Market Structure Confluence Score Card */}
                <div className={styles.structureScoreCardColumn}>
                    <div className={styles.structureScoreCard}>
                        <div className={styles.structScoreCardTop}>
                            <span className={styles.structCardHeading}>Market Structure</span>
                            <span className={styles.structCardFraction}>{structureScore} <span style={{ color: 'rgba(255,255,255,0.4)' }}>/ {maxScore}</span></span>
                        </div>
                        <div className={styles.structProgressTrack}>
                            <div
                                className={styles.structProgressFill}
                                style={{
                                    width: `${progressPct}%`,
                                    background: 'linear-gradient(90deg, #10B981 0%, #18C98B 100%)'
                                }}
                            />
                        </div>
                        <div className={styles.structScoreCardBottom}>
                            <span className={styles.structSentimentTag} style={{ color: '#18C98B' }}>{t('aiStrategy.neutralConfluence', 'NEUTRAL CONFLUENCE')}</span>
                            <span className={styles.structPctText}>{progressPct}%</span>
                        </div>
                    </div>
                </div>

                {/* Column 2: 5 Key Levels List Table */}
                <div className={styles.seamlessListColumn}>
                    <div className={styles.cleanIndicatorsListTable}>
                        {levelItems.map((lvl, idx) => (
                            <div key={idx} className={styles.indicatorTableRow}>
                                <span className={styles.rowName}>{lvl.label}</span>
                                <span className={styles.rowValue}>{formatValue(lvl.value)}</span>
                                <span
                                    className={styles.rowAction}
                                    style={{
                                        color: lvl.type === 'support' ? '#18C98B' : lvl.type === 'resistance' ? '#EF4444' : '#18C98B'
                                    }}
                                >
                                    {lvl.type === 'support' ? 'Support' : lvl.type === 'resistance' ? 'Resistance' : 'Pivot (P)'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 3: Structure Evidence List */}
                <div className={styles.seamlessEvidenceColumn}>
                    <div className={styles.evidenceHeaderTag}>
                        <div className={styles.evidenceTitleWrap}>
                            <span className={styles.evidenceTagDot} />
                            <span className={styles.evidenceTitleText}>{t('aiStrategy.structureEvidence', 'STRUCTURE EVIDENCE')}</span>
                        </div>
                        <span className={styles.evidenceVerifiedBadge}>KEY LEVELS</span>
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
