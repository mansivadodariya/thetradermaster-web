'use client';

import React from 'react';
import styles from '../profile.module.scss';

export default function ProfileSkeleton() {
    return (
        <div className={styles.profileSkeletonWrapper} aria-busy="true" aria-label="Loading Profile">
            {/* Top Page Header Skeleton */}
            <div className={styles.skeletonHeader}>
                <div className={styles.skeletonHeaderLeft}>
                    <div className={`${styles.skeletonBadge} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonSubtitle} ${styles.skeletonPulse}`} />
                </div>
            </div>

            {/* 3-Column Profile Layout Skeleton */}
            <div className={styles.skeletonGrid}>
                {/* 1. Left Sidebar Navigation Skeleton */}
                <div className={styles.skeletonNavCard}>
                    <div className={`${styles.skeletonNavItem} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonNavItem} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonNavItem} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonNavItem} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonNavItem} ${styles.skeletonPulse}`} />
                    <div className={`${styles.skeletonNavItem} ${styles.skeletonPulse}`} />
                </div>

                {/* 2. Middle Column: Main Profile Area Skeleton */}
                <div className={styles.skeletonMainCol}>
                    {/* Hero User Info Card Skeleton */}
                    <div className={styles.skeletonCard}>
                        <div className={styles.skeletonCardHead}>
                            <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} style={{ width: '160px', height: '20px' }} />
                            <div className={`${styles.skeletonBadge} ${styles.skeletonPulse}`} style={{ width: '110px', height: '32px' }} />
                        </div>

                        <div className={styles.skeletonHeroMeta}>
                            <div className={`${styles.skeletonAvatar} ${styles.skeletonPulse}`} />
                            <div className={styles.skeletonMetaText}>
                                <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} style={{ width: '180px', height: '22px' }} />
                                <div className={`${styles.skeletonSubtitle} ${styles.skeletonPulse}`} style={{ width: '220px', height: '14px' }} />
                                <div className={`${styles.skeletonBadge} ${styles.skeletonPulse}`} style={{ width: '130px', height: '18px' }} />
                            </div>
                        </div>

                        <div className={styles.skeletonFieldsGrid2}>
                            <div className={`${styles.skeletonFieldBox} ${styles.skeletonPulse}`} />
                            <div className={`${styles.skeletonFieldBox} ${styles.skeletonPulse}`} />
                            <div className={`${styles.skeletonFieldBox} ${styles.skeletonPulse}`} />
                            <div className={`${styles.skeletonFieldBox} ${styles.skeletonPulse}`} />
                        </div>
                    </div>

                    {/* AI Trading Profile Card Skeleton */}
                    <div className={styles.skeletonCard}>
                        <div className={styles.skeletonCardHead}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} style={{ width: '240px', height: '18px' }} />
                                <div className={`${styles.skeletonSubtitle} ${styles.skeletonPulse}`} style={{ width: '320px', height: '12px' }} />
                            </div>
                            <div className={`${styles.skeletonBadge} ${styles.skeletonPulse}`} style={{ width: '150px', height: '34px' }} />
                        </div>

                        <div className={styles.skeletonMetricsGrid4}>
                            <div className={`${styles.skeletonMetricBox} ${styles.skeletonPulse}`} />
                            <div className={`${styles.skeletonMetricBox} ${styles.skeletonPulse}`} />
                            <div className={`${styles.skeletonMetricBox} ${styles.skeletonPulse}`} />
                            <div className={`${styles.skeletonMetricBox} ${styles.skeletonPulse}`} />
                        </div>

                        <div className={`${styles.skeletonProgressBar} ${styles.skeletonPulse}`} />
                    </div>

                    {/* Onboarding Strategy Alignment Card Skeleton */}
                    <div className={styles.skeletonCard}>
                        <div className={styles.skeletonCardHead}>
                            <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} style={{ width: '200px', height: '18px' }} />
                            <div className={`${styles.skeletonBadge} ${styles.skeletonPulse}`} style={{ width: '100px', height: '30px' }} />
                        </div>

                        <div className={styles.skeletonFieldsGrid2}>
                            <div className={`${styles.skeletonFieldBox} ${styles.skeletonPulse}`} style={{ height: '80px' }} />
                            <div className={`${styles.skeletonFieldBox} ${styles.skeletonPulse}`} style={{ height: '80px' }} />
                        </div>
                    </div>
                </div>

                {/* 3. Right Sidebar Skeleton */}
                <div className={styles.skeletonRightCol}>
                    <div className={styles.skeletonRightCard}>
                        <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} style={{ width: '130px', height: '16px' }} />
                        <div className={`${styles.skeletonFieldBox} ${styles.skeletonPulse}`} style={{ height: '70px' }} />
                    </div>

                    <div className={styles.skeletonRightCard}>
                        <div className={`${styles.skeletonTitle} ${styles.skeletonPulse}`} style={{ width: '110px', height: '16px' }} />
                        <div className={`${styles.skeletonNavItem} ${styles.skeletonPulse}`} />
                        <div className={`${styles.skeletonNavItem} ${styles.skeletonPulse}`} />
                        <div className={`${styles.skeletonNavItem} ${styles.skeletonPulse}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}
