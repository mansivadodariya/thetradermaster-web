'use client';

import React, { useMemo } from 'react';
import styles from '../customBotBuilder.module.scss';
import { getSteps } from '../constants';
import { useLanguage } from '@/context/LanguageContext';

function renderStepIcon(iconType) {
    switch (iconType) {
        case 'sliders':
            return (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14" />
                    <line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" />
                    <line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" />
                    <line x1="9" y1="8" x2="15" y2="8" />
                    <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
            );
        case 'pulse':
            return (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            );
        case 'target':
            return (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                </svg>
            );
        case 'shield':
            return (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            );
        case 'eye':
            return (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            );
        default:
            return null;
    }
}

export default function StepperHeader({ currentStep, onSelectStep }) {
    const { t } = useLanguage();
    const steps = useMemo(() => getSteps(t), [t]);

    return (
        <div className={styles.stepperContainer}>
            <div className={styles.stepperTrack}>
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    const isAccessible = currentStep >= step.id;

                    return (
                        <React.Fragment key={step.id}>
                            <button
                                type="button"
                                className={`${styles.stepPill} ${isActive ? styles.stepPillActive : ''} ${isCompleted ? styles.stepPillCompleted : ''}`}
                                onClick={() => isAccessible && onSelectStep(step.id)}
                                disabled={!isAccessible}
                            >
                                <span className={styles.stepPillIcon}>
                                    {isCompleted ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        renderStepIcon(step.icon)
                                    )}
                                </span>
                                <span className={styles.stepPillLabel}>{step.label}</span>
                            </button>

                            {index < steps.length - 1 && (
                                <div
                                    className={`${styles.stepConnector} ${isCompleted ? styles.stepConnectorActive : ''}`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
