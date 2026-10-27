'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../customBotBuilder.module.scss';

export default function StepFooterNav({ currentStep, totalSteps = 5, onPrev, onNext, onDeploy, isDeploying = false, isNextDisabled = false }) {
    const { t } = useLanguage();
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div className={styles.footerNavContainer}>
            <button
                type="button"
                className={styles.prevBtn}
                onClick={onPrev}
                disabled={isFirstStep || isDeploying}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </svg>
                <span>{t('botBuilder.nav.previous', 'Previous')}</span>
            </button>

            <span className={styles.stepIndicatorText}>
                {t('botBuilder.nav.stepCounter', 'Step {{current}} of {{total}}', { current: currentStep, total: totalSteps })}
            </span>

            {isLastStep ? (
                <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={onDeploy}
                    disabled={isDeploying || isNextDisabled}
                >
                    <span>{isDeploying ? t('botBuilder.nav.deploying', 'Deploying...') : t('botBuilder.nav.deployBot', 'Deploy Bot')}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </button>
            ) : (
                <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={onNext}
                    disabled={isNextDisabled || isDeploying}
                >
                    <span>{t('botBuilder.nav.next', 'Next')}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}
