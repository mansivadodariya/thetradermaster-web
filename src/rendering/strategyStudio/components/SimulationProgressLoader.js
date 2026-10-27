'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/simulationProgressLoader.module.scss';

const SIMULATION_STEPS = [
    {
        id: 1,
        title: 'Market Dataset & Historical Feed',
        desc: 'Streaming high-precision OHLC candles & tick price history'
    },
    {
        id: 2,
        title: 'Indicator Signals & Rule Engine',
        desc: 'Evaluating technical indicators, breakout conditions & rules'
    },
    {
        id: 3,
        title: 'Execution Simulation & Metrics',
        desc: 'Simulating position round-trips, win-rate & equity curve'
    }
];

export default function SimulationProgressLoader({ symbol = 'XAUUSD', interval = '15min' }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0, 1, 2
    const [progress, setProgress] = useState(18);

    useEffect(() => {
        // Smooth Step Progression (1 -> 2 -> 3)
        const t1 = setTimeout(() => {
            setCurrentStepIndex(1);
        }, 1100);

        const t2 = setTimeout(() => {
            setCurrentStepIndex(2);
        }, 2300);

        // Smooth continuous progress bar fill
        const pInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 94) return 94;
                const increment = Math.floor(Math.random() * 5) + 3;
                return Math.min(94, prev + increment);
            });
        }, 160);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearInterval(pInterval);
        };
    }, []);

    return (
        <div className={styles.stepperLoaderContainer}>
            {/* Header Title Section */}
            <div className={styles.stepperHeader}>
                <div className={styles.stepperBadge}>
                    <span className={styles.stepperLiveDot} />
                    <span>SIMULATION ENGINE</span>
                </div>
                <h3 className={styles.stepperMainTitle}>Executing Strategy Backtest</h3>
                <p className={styles.stepperSubTitle}>
                    Running multi-period quantitative simulation on <strong>{symbol}</strong> ({interval})
                </p>
            </div>

            {/* 3-Step Vertical Stepper List */}
            <div className={styles.stepperTrack}>
                {SIMULATION_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    const isPending = idx > currentStepIndex;

                    return (
                        <React.Fragment key={step.id}>
                            <div className={`${styles.stepperStepItem} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''} ${isPending ? styles.pending : ''}`}>
                                <div className={styles.stepCircleWrap}>
                                    {isCompleted ? (
                                        <div className={styles.stepCheckCircle}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                    ) : isActive ? (
                                        <div className={styles.stepActiveSpinnerCircle}>
                                            <div className={styles.activeSpinnerRing} />
                                            <span className={styles.activeStepNumber}>{step.id}</span>
                                        </div>
                                    ) : (
                                        <div className={styles.stepPendingCircle}>
                                            <span>{step.id}</span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.stepInfoBlock}>
                                    <div className={styles.stepTitleRow}>
                                        <h4 className={styles.stepItemTitle}>{step.title}</h4>
                                        <span className={styles.stepNumberPrefix}>STEP 0{step.id}</span>
                                    </div>
                                    <p className={styles.stepItemDesc}>{step.desc}</p>
                                </div>
                            </div>

                            {idx < SIMULATION_STEPS.length - 1 && (
                                <div className={styles.connectorWrap}>
                                    <div className={`${styles.stepperConnectingLine} ${idx < currentStepIndex ? styles.lineCompleted : ''}`} />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Bottom Progress Bar & Telemetry */}
            <div className={styles.stepperFooterProgress}>
                <div className={styles.stepperProgressTrack}>
                    <div
                        className={styles.stepperProgressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className={styles.stepperProgressMeta}>
                    <span className={styles.metaLeft}>
                        Step <strong>{currentStepIndex + 1} of 3</strong> ({progress}%)
                    </span>
                    <span className={styles.metaRight}>
                        Market: <strong>{symbol}</strong> • TF: <strong>{interval}</strong>
                    </span>
                </div>
            </div>
        </div>
    );
}
