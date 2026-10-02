'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/button';
import styles from './readyToAnalyze.module.scss';

const UploadIcon = '/assets/icons/upload-xs.svg';

export default function ReadyToAnalyze() {
    const router = useRouter();
    const { t } = useLanguage();

    const handleUploadClick = () => {
        authNavigate(router, '/trade-snap');
    };

    return (
        <section className={styles.readyToAnalyze}>
            <div className="container-xs">
                <div className={styles.ctaSection}>
                    <h2>
                        {t('readyToAnalyze.titlePart1', 'Your Next Trade Can Be')} <span className={styles.neonText}>{t('readyToAnalyze.titlePart2', 'Better Than Your Last')}</span>
                    </h2>
                    <p>
                        {t('readyToAnalyze.desc', 'You do not need to predict every market move. You need to keep learning from the decisions you make. Analyze your completed trades. Understand your mistakes. Recognize your strengths. Refine your process.')}
                    </p>
                    <div className={styles.ctaCallout}>
                        {t('readyToAnalyze.callout', 'Review Your Past Trades With AI — Upload a trade and discover what you can learn from it.')}
                    </div>
                    <div className={styles.ctaBtnWrap}>
                        <Button text={t('pastTrade.btnUpload', 'Upload Trade For Analysis')} icon={UploadIcon} onClick={handleUploadClick} />
                    </div>
                </div>
            </div>
        </section>
    );
}
