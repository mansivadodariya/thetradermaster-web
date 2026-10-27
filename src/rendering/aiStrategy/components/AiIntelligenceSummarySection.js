'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../aiStrategy.module.scss';
import { getBidiProps } from '@/lib/bidi';
import { BrainRobotIcon } from '@/icons/analysisIcons';

export default function AiIntelligenceSummarySection({
    aiSummary = {},
    t: propT
}) {
    const { t: hookT } = useLanguage();
    const t = propT || hookT;

    if (!aiSummary || (!aiSummary.headline && !aiSummary.trend && !aiSummary.momentum)) {
        return null;
    }

    return (
        <div className={`${styles.unifiedDomainCard} ${styles.aiIntelligenceShowcaseCard}`}>
            {/* Header matching other sections */}
            <div className={styles.domainHeaderRow}>
                <div className={styles.domainTitleGroup}>
                    <div className={styles.domainIconWrap} style={{ color: '#18C98B', background: 'rgba(24, 201, 139, 0.1)', borderColor: 'rgba(24, 201, 139, 0.25)' }}>
                        <BrainRobotIcon />
                    </div>
                    <div>
                        <h4 className={styles.domainMainTitle}>
                            {t('aiStrategy.intelligenceSummary', 'AI INTELLIGENCE SUMMARY')}
                        </h4>
                        <span className={styles.domainSubtitle}>Neural confluence synthesis & automated strategy reasoning</span>
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
                    TRADERMASTER NEURAL MODEL
                </div>
            </div>

            {/* Headline Quote Banner */}
            {aiSummary.headline && (
                <div className={styles.aiHeadlineBanner}>
                    <div className={styles.aiQuoteAccent} style={{ background: '#18C98B' }} />
                    <h4 {...getBidiProps(aiSummary.headline, styles.greenAiHeadline)}>
                        &ldquo;{aiSummary.headline}&rdquo;
                    </h4>
                </div>
            )}

            {/* AI Insights Multi-column Grid */}
            <div className={styles.aiInsightsGrid}>
                {aiSummary.trend && (
                    <div className={styles.aiInsightCard}>
                        <div className={styles.aiInsightHeader}>
                            <span className={styles.insightDot} style={{ backgroundColor: '#18C98B' }} />
                            <span className={styles.insightCategoryTitle}>TREND DYNAMICS</span>
                        </div>
                        <p {...getBidiProps(aiSummary.trend)} className={styles.insightParagraph}>
                            {aiSummary.trend}
                        </p>
                    </div>
                )}

                {aiSummary.momentum && (
                    <div className={styles.aiInsightCard}>
                        <div className={styles.aiInsightHeader}>
                            <span className={styles.insightDot} style={{ backgroundColor: '#18C98B' }} />
                            <span className={styles.insightCategoryTitle}>MOMENTUM CONVERGENCE</span>
                        </div>
                        <p {...getBidiProps(aiSummary.momentum)} className={styles.insightParagraph}>
                            {aiSummary.momentum}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
