'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { timeAgo, formatSummary, formatRecentActivityItem } from '../utils/dashboardHelpers';
import styles from '../dashboard.module.scss';

export default function DashboardRecentActivities({
    loading,
    recents,
    activityFilter,
    setActivityFilter,
    openRecent
}) {
    const { t } = useLanguage();

    return (
        <div className={styles.feedColumn}>
            <div className={styles.feedHeader}>
                <div className={styles.feedTitleWrap}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <h3>{t('dashboard.recentActivityTitle', 'Recent Activity Feed')}</h3>
                </div>

                <div className={styles.filterPills}>
                    <button
                        type="button"
                        className={`${styles.filterTab} ${activityFilter === 'all' ? styles.filterTabActive : ''}`}
                        onClick={() => setActivityFilter('all')}
                    >
                        {t('dashboard.tabAll', 'All')}
                    </button>
                    <button
                        type="button"
                        className={`${styles.filterTab} ${(activityFilter === 'analysis' || activityFilter === 'blog') ? styles.filterTabActive : ''}`}
                        onClick={() => setActivityFilter('analysis')}
                    >
                        {t('dashboard.tabScanner', 'Scanner')}
                    </button>
                    <button
                        type="button"
                        className={`${styles.filterTab} ${activityFilter === 'chat' ? styles.filterTabActive : ''}`}
                        onClick={() => setActivityFilter('chat')}
                    >
                        {t('dashboard.tabAssistant', 'Assistant')}
                    </button>
                </div>
            </div>

            <div className={styles.feedCardContainer}>
                {loading ? (
                    <div className={styles.activityItemsList}>
                        {[1, 2, 3, 4, 5].map((idx) => (
                            <div key={idx} className={`${styles.activityRowItem} ${styles.skeletonRow}`}>
                                <div className={`${styles.actIndexBadge} ${styles.skeletonPulse}`}>
                                    <span style={{ opacity: 0 }}>{idx}</span>
                                </div>

                                <div className={styles.actContent}>
                                    <div className={styles.actHeaderRow}>
                                        <div className={`${styles.skeletonBar} ${styles.skeletonTitleBar}`} />
                                        <div className={`${styles.skeletonBar} ${styles.skeletonTagBar}`} />
                                        <div className={`${styles.skeletonBar} ${styles.skeletonTimeBar}`} />
                                    </div>

                                    <div className={`${styles.skeletonBar} ${styles.skeletonDescBar}`} />
                                </div>

                                <div className={`${styles.skeletonBar} ${styles.skeletonActionBar}`} />
                            </div>
                        ))}
                    </div>
                ) : recents.length === 0 ? (
                    <div className={styles.emptyFeed}>
                        <div className={styles.emptyIconCircle}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <p>{t('dashboard.noRecentActivityRecorded', 'No recent activity recorded yet.')}</p>
                        <Link href="/chart-scanner" className={styles.firstScanBtn}>
                            {t('dashboard.uploadFirstChart', 'Upload Your First Chart →')}
                        </Link>
                    </div>
                ) : (
                    <div className={styles.activityItemsList}>
                        {recents.map((item, index) => {
                            const { title, description, signal } = formatRecentActivityItem(item);
                            const isScanner = item.type === 'analysis' || item.type === 'blog';
                            return (
                                <div
                                    key={`${item.type}-${item.id}`}
                                    className={styles.activityRowItem}
                                    onClick={() => openRecent(item)}
                                >
                                    <div className={styles.actIndexBadge}>
                                        {index + 1}
                                    </div>

                                    <div className={styles.actContent}>
                                        <div className={styles.actHeaderRow}>
                                            <strong className={styles.actMainTitle}>{title}</strong>
                                            <span className={styles.actTypeTag}>
                                                {isScanner ? t('dashboard.tabScanner', 'AI Chart Scanner') : t('dashboard.tabAssistant', 'AI Market Assistant')}
                                            </span>
                                            {signal && (
                                                <span className={`${styles.actSignalTag} ${signal.includes('BUY') ? styles.signalBuy : styles.signalSell}`}>
                                                    {signal}
                                                </span>
                                            )}
                                            <span className={styles.actTime}>{timeAgo(item.created_at)}</span>
                                        </div>

                                        <p className={styles.actDescription}>
                                            {description}
                                        </p>
                                    </div>

                                    <div className={styles.actAction}>
                                        <span>{t('dashboard.openAction', 'Open')}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
