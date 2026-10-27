'use client';

import React from 'react';
import styles from '../aiStrategy.module.scss';

export function AnalysisSkeleton() {
    return (
        <div className={styles.analysisSkeletonContainer}>
            {/* Technical Score Skeleton Card */}
            <div className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                    <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonBadge} ${styles.skeletonPulse}`} />
                </div>
                <div className={styles.skeletonGaugeRow}>
                    <div className={`${styles.skeletonCircle} ${styles.skeletonPulse}`} />
                </div>
                <div className={styles.skeletonBarsGrid}>
                    <div className={`${styles.skeletonBarBox} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonBarBox} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonBarBox} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonBarBox} ${styles.skeletonPulse}`} />
                </div>
            </div>

            {/* AI Summary Skeleton Card */}
            <div className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                    <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} style={{ width: '110px' }} />
                </div>
                <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonPulse} ${styles.medium}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonPulse} ${styles.short}`} />
            </div>

            {/* Key Levels Skeleton Card */}
            <div className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                    <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} style={{ width: '95px' }} />
                </div>
                <div className={styles.skeletonLevelsGrid}>
                    <div className={`${styles.skeletonLevelBox} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonLevelBox} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonLevelBox} ${styles.skeletonPulse}`} />
                </div>
            </div>
        </div>
    );
}

export function AnalysisErrorState({ symbol, onRetry }) {
    return (
        <div className={`${styles.analysisPanel} ${styles.analysisErrorWrapper}`}>
            <div className={styles.analysisErrorBox}>
                <div className={styles.analysisErrorIconBox}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h3 className={styles.analysisErrorTitle}>Failed to load analysis</h3>
                <p className={styles.analysisErrorSubtitle}>
                    Unable to fetch real-time technical analysis feed for {symbol || 'this pair'}.
                </p>
                <button onClick={onRetry} className={styles.analysisRetryBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    <span>Retry</span>
                </button>
            </div>
        </div>
    );
}
