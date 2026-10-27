'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../myBots.module.scss';

export default function MyBotsStats({ totalCount, aiCount, manualCount }) {
    const { t } = useLanguage();

    return (
        <div className={styles.statsBar}>
            <div className={styles.statBox}>
                <span className={styles.statLabel}>{t('myBots.totalStrategies', 'TOTAL STRATEGIES')}</span>
                <span className={styles.statVal}>{totalCount}</span>
            </div>
            <div className={styles.statBox}>
                <span className={styles.statLabel}>{t('myBots.aiBots', 'AI BOTS')}</span>
                <span className={styles.statVal}>{aiCount}</span>
            </div>
            <div className={styles.statBox}>
                <span className={styles.statLabel}>{t('myBots.manualBots', 'MANUAL BOTS')}</span>
                <span className={styles.statVal}>{manualCount}</span>
            </div>
        </div>
    );
}
