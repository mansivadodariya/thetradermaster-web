'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../aiAssistant.module.scss';

export default function ChartLoaderOverlay({ isDark = true }) {
    const { t } = useLanguage();
    const loadingText = t('common.loading', 'Loading...');

    return (
        <div className={`${styles.chartLoaderOverlay} ${!isDark ? styles.lightLoaderOverlay : ''}`}>
            <div className={styles.chartSpinnerWrapper}>
                <div className={styles.chartSpinner} />
                <span>{loadingText}</span>
            </div>
        </div>
    );
}
