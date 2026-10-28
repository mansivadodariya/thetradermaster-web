'use client';

import React from 'react';
import styles from '../aiStrategy.module.scss';
import { CircleCheckIcon, getScoreColor, IndicatorIcon } from '@/icons/analysisIcons';

export default function EvidenceSection({
    evidence = {},
    title = 'EVIDENCE'
}) {
    // Filter out volume from evidence cards as requested
    const validEntries = Object.entries(evidence).filter(([key, data]) => {
        if (key === 'volume') return false;
        return data && data.details && data.details.length > 0;
    });

    if (validEntries.length === 0) return null;

    return (
        <div className={styles.evidenceShowcaseCard}>
            {/* Header */}
            <div className={styles.sectionHeaderRow}>
                <div className={styles.headerTitleGroup}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span className={styles.headerMainTitle}>{title}</span>
                </div>
                <span className={styles.evidenceVerifiedBadge}>
                    <span className={styles.verifiedDot} />
                    Quantitative Validation
                </span>
            </div>

            {/* Evidence Sub-Cards Grid (Direct view - No Toggles) */}
            <div className={styles.evidenceCardsGrid}>
                {validEntries.map(([key, data]) => {
                    const itemColor = getScoreColor(data.label);

                    return (
                        <div key={key} className={styles.evidenceSubCard}>
                            <div className={styles.evidenceCardHeader}>
                                <div className={styles.evidenceTypeGroup}>
                                    <IndicatorIcon type={key} />
                                    <span className={styles.evidenceTypeTitle}>{key.toUpperCase()} EVIDENCE</span>
                                </div>
                                <span
                                    className={styles.evidenceActionPill}
                                    style={{
                                        color: itemColor,
                                        backgroundColor: `${itemColor}15`,
                                        borderColor: `${itemColor}35`
                                    }}
                                >
                                    {data.label}
                                </span>
                            </div>

                            <ul className={styles.evidenceList}>
                                {data.details.map((detail, idx) => (
                                    <li key={idx} className={styles.evidenceListItem}>
                                        <CircleCheckIcon color={itemColor} />
                                        <span className={styles.evidenceText}>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
