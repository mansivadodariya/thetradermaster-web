'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../myBots.module.scss';

export default function MyBotsFilterBar({
    botsCount,
    aiCount,
    manualCount,
    filterCreationType,
    setFilterCreationType,
    searchQuery,
    setSearchQuery
}) {
    const { t } = useLanguage();

    return (
        <div className={styles.controlRow}>
            <div className={styles.filterPills}>
                <button
                    type="button"
                    className={`${styles.filterPill} ${filterCreationType === 'all' ? styles.activePill : ''}`}
                    onClick={() => setFilterCreationType('all')}
                >
                    {t('myBots.filterAll', 'All')}
                </button>
                <button
                    type="button"
                    className={`${styles.filterPill} ${filterCreationType === 'ai' ? styles.activePill : ''}`}
                    onClick={() => setFilterCreationType('ai')}
                    title="Filter bots generated via AI"
                >
                    {t('myBots.filterAi', 'AI Bots')}
                </button>
                <button
                    type="button"
                    className={`${styles.filterPill} ${filterCreationType === 'manual' ? styles.activePill : ''}`}
                    onClick={() => setFilterCreationType('manual')}
                    title="Filter bots created manually"
                >
                    {t('myBots.filterManual', 'Manual / Custom Bots')}
                </button>
            </div>

            <div className={styles.searchBox}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder={t('myBots.searchPlaceholder', 'Search strategies by name, symbol, pattern...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );
}
