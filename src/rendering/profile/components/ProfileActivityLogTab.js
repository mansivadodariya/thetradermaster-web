'use client';

import React from 'react';
import styles from '../profile.module.scss';

function formatLoginEntry(entry, idx, total, t) {
    let timestamp = null;
    let description = t ? t('profile.authSuccess', 'Successful WebApp Authentication') : 'Successful WebApp Authentication';

    if (typeof entry === 'string') {
        timestamp = new Date(entry);
    } else if (entry && typeof entry === 'object') {
        timestamp = entry.timestamp ? new Date(entry.timestamp) : 
                    entry.time ? new Date(entry.time) :
                    entry.created_at ? new Date(entry.created_at) :
                    entry.login_at ? new Date(entry.login_at) : null;
        description = entry.description || entry.type || entry.action || description;
    }

    let dateStr = '';
    let timeStr = '';

    if (timestamp && !isNaN(timestamp.getTime())) {
        dateStr = timestamp.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        timeStr = timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    const isActive = idx === 0;

    return { dateStr, timeStr, description, isActive };
}

export default function ProfileActivityLogTab({
    displayLogins,
    t
}) {
    return (
        <div className={styles.tabContentPanel}>
            <div className={styles.panelHeaderRow}>
                <h3>{t('profile.recentActivity', 'Recent Activity')}</h3>
                <p className={styles.panelSubtitle}>
                    {t('profile.activitySubtitle', 'Monitor your 5 most recent login sessions for account security.')}
                </p>
            </div>
            {displayLogins.length > 0 ? (
                <div className={styles.activityCardsList}>
                    {displayLogins.map((entry, idx) => {
                        const { dateStr, timeStr, description, isActive } = formatLoginEntry(entry, idx, displayLogins.length, t);
                        return (
                            <div key={idx} className={`${styles.activityItemRow} ${isActive ? styles.activeActivityRow : ''}`}>
                                <div className={styles.activityItemLeft}>
                                    <div className={`${styles.activityIconBox} ${isActive ? styles.activeActivityIconBox : ''}`}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                            <line x1="8" y1="21" x2="16" y2="21" />
                                            <line x1="12" y1="17" x2="12" y2="21" />
                                        </svg>
                                    </div>
                                    <div className={styles.activityMeta}>
                                        <div className={styles.activityDateRow}>
                                            <span className={styles.activityDateText}>{dateStr || t('profile.unknownDate', 'Unknown Date')}</span>
                                            {timeStr && (
                                                <>
                                                    <span className={styles.dateDotSeparator}>•</span>
                                                    <span className={styles.activityTimeText}>{timeStr}</span>
                                                </>
                                            )}
                                        </div>
                                        <span className={styles.activityDescText}>{description}</span>
                                    </div>
                                </div>
                                <div className={styles.activityItemRight}>
                                    {isActive ? (
                                        <span className={styles.activeSessionBadge}>
                                            <span className={styles.activePulseDot} />
                                            {t ? t('profile.activeSession', 'Active Session') : 'Active Session'}
                                        </span>
                                    ) : (
                                        <span className={styles.pastSessionBadge}>
                                            {t ? t('profile.pastSession', 'Past Session') : 'Past Session'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.emptyActivityState}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <p>{t('profile.noActivityLogs', 'No recent activity logs available')}</p>
                </div>
            )}
        </div>
    );
}

