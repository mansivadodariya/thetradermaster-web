'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import { LightningIcon } from './StudioIcons';

/**
 * PROGRESS_CONFIGS — Predefined step configurations for different operations
 */
const PROGRESS_CONFIGS = {
    generating: {
        title: 'Generating Strategy',
        steps: [
            { label: 'Analyzing strategy parameters', duration: 1200 },
            { label: 'Building entry & exit rules', duration: 1800 },
            { label: 'Validating JSON schema', duration: 1000 },
            { label: 'Strategy specification ready', duration: 600 }
        ]
    },
    backtesting: {
        title: 'Running Backtest Simulation',
        steps: [
            { label: 'Fetching historical candle data', duration: 1500 },
            { label: 'Applying indicator calculations', duration: 2000 },
            { label: 'Simulating trade executions', duration: 2500 },
            { label: 'Compiling analytics & metrics', duration: 1000 }
        ]
    },
    thinking: {
        title: 'Processing Request',
        steps: [
            { label: 'Understanding your strategy idea', duration: 800 },
            { label: 'Analyzing market context', duration: 1200 },
            { label: 'Preparing advisor response', duration: 1000 }
        ]
    }
};

/**
 * ChatProgressSteps — Animated multi-step progress indicator for the chat
 * 
 * Shows during strategy generation, backtesting, or AI thinking to keep
 * users engaged with interactive step-by-step progress feedback.
 */
export default function ChatProgressSteps({ type = 'thinking', isActive = true, onComplete }) {
    const config = PROGRESS_CONFIGS[type] || PROGRESS_CONFIGS.thinking;
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const timerRef = useRef(null);
    const completeCalledRef = useRef(false);

    useEffect(() => {
        if (!isActive) return;

        completeCalledRef.current = false;
        setActiveStep(0);
        setCompletedSteps([]);

        let currentStep = 0;

        const advanceStep = () => {
            if (currentStep < config.steps.length) {
                setActiveStep(currentStep);

                timerRef.current = setTimeout(() => {
                    setCompletedSteps((prev) => [...prev, currentStep]);
                    currentStep++;

                    if (currentStep < config.steps.length) {
                        advanceStep();
                    } else if (!completeCalledRef.current) {
                        completeCalledRef.current = true;
                        if (onComplete) onComplete();
                    }
                }, config.steps[currentStep].duration);
            }
        };

        advanceStep();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isActive, type, config, onComplete]);

    if (!isActive) return null;

    return (
        <div className={styles.chatProgressStepsCard}>
            <div className={styles.progressStepsHeader}>
                <LightningIcon size={14} color="#18C98B" />
                <span>{config.title}</span>
            </div>
            <div className={styles.progressStepsList}>
                {config.steps.map((step, idx) => {
                    const isDone = completedSteps.includes(idx);
                    const isCurrent = activeStep === idx && !isDone;
                    const isPending = idx > activeStep && !isDone;

                    return (
                        <div
                            key={idx}
                            className={`
                                ${styles.progressStep}
                                ${isDone ? styles.progressStepDone : ''}
                                ${isCurrent ? styles.progressStepActive : ''}
                                ${isPending ? styles.progressStepPending : ''}
                            `}
                        >
                            <div className={styles.progressStepIcon}>
                                {isDone ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : isCurrent ? (
                                    <div className={styles.progressSpinner} />
                                ) : (
                                    <div className={styles.progressDotPending} />
                                )}
                            </div>
                            <span className={styles.progressStepLabel}>{step.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
