'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/strategyStudio.module.scss';

function CheckmarkSvg() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#040605" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

import { computeDynamicStrategyName } from '../utils/strategyNaming';

/**
 * ReadyToProceedCard — Displays the Strategy Name input & actions (Screenshot 1 Top)
 * and the 3-step animated generation progress bar (Screenshot 1 Bottom)
 */
export default function ReadyToProceedCard({
    draft,
    strategyName: initialStrategyName,
    onCreateStrategy,
    onEnhance,
    onModifyStrategy,
    generatingStrategy
}) {
    const defaultName = initialStrategyName || draft?.strategy_name || draft?.suggested_strategy_name || draft?.name || computeDynamicStrategyName(draft) || 'Algorithmic Strategy';
    const [strategyName, setStrategyName] = useState(defaultName);
    const [hasUserEdited, setHasUserEdited] = useState(false);
    const [generationStage, setGenerationStage] = useState(1);

    useEffect(() => {
        const dynamicName = initialStrategyName || draft?.strategy_name || draft?.suggested_strategy_name || draft?.name;
        if (dynamicName && !hasUserEdited) {
            setStrategyName(dynamicName);
        }
    }, [draft, initialStrategyName, hasUserEdited]);

    // Animate the 3-step generation progression when generatingStrategy is true
    useEffect(() => {
        if (!generatingStrategy) {
            setGenerationStage(1);
            return;
        }

        setGenerationStage(1);
        const t1 = setTimeout(() => setGenerationStage(2), 1200);
        const t2 = setTimeout(() => setGenerationStage(3), 2800);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [generatingStrategy]);

    const getStatusMessage = () => {
        if (generationStage === 1) return 'Starting strategy generation...';
        if (generationStage === 2) return 'Synthesizing algorithmic indicators & risk model...';
        return 'Compiling algorithmic strategy rules...';
    };

    if (generatingStrategy) {
        return (
            <div className={styles.strategyGeneratingContainer}>
                {/* 3-dots bubble */}
                <div className={styles.generatingDotsBubble}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                </div>

                {/* 3-step Progress Stepper Card */}
                <div className={styles.generationStepperCard}>
                    {/* Step 1: Starting */}
                    <div className={`${styles.stepperItem} ${generationStage >= 1 ? styles.completedStep : ''}`}>
                        <div className={styles.stepperIconWrap}>
                            <div className={styles.stepperCheckmarkCircle}>
                                <CheckmarkSvg />
                            </div>
                        </div>
                        <span className={styles.stepperLabel}>Starting</span>
                    </div>

                    {/* Connector Line 1 */}
                    <div className={`${styles.stepperConnector} ${generationStage >= 2 ? styles.activeConnector : ''}`} />

                    {/* Step 2: Progressing */}
                    <div className={`${styles.stepperItem} ${generationStage >= 2 ? (generationStage === 2 ? styles.activeStep : styles.completedStep) : styles.idleStep}`}>
                        <div className={styles.stepperIconWrap}>
                            {generationStage > 2 ? (
                                <div className={styles.stepperCheckmarkCircle}>
                                    <CheckmarkSvg />
                                </div>
                            ) : generationStage === 2 ? (
                                <div className={styles.stepperSpinnerBlue} />
                            ) : (
                                <div className={styles.stepperIdleDot} />
                            )}
                        </div>
                        <span className={styles.stepperLabel}>Progressing</span>
                    </div>

                    {/* Connector Line 2 */}
                    <div className={`${styles.stepperConnector} ${generationStage >= 3 ? styles.activeConnector : ''}`} />

                    {/* Step 3: Completing */}
                    <div className={`${styles.stepperItem} ${generationStage >= 3 ? styles.activeStep : styles.idleStep}`}>
                        <div className={styles.stepperIconWrap}>
                            {generationStage >= 3 ? (
                                <div className={styles.stepperSpinnerBlue} />
                            ) : (
                                <div className={styles.stepperIdleDot} />
                            )}
                        </div>
                        <span className={styles.stepperLabel}>Completing</span>
                    </div>
                </div>

                {/* Bottom rotating status indicator */}
                <div className={styles.generationStatusRow}>
                    <span className={styles.statusSpinner} />
                    <span>{getStatusMessage()}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.readyToProceedCard}>
            <h3 className={styles.readyCardTitle}>Ready to proceed?</h3>

            {/* Editable Strategy Name */}
            <div className={styles.strategyNameGroup}>
                <label className={styles.strategyNameLabel}>STRATEGY NAME</label>
                <input
                    type="text"
                    className={styles.strategyNameInput}
                    value={strategyName}
                    onChange={(e) => {
                        setStrategyName(e.target.value);
                        setHasUserEdited(true);
                    }}
                    placeholder="Strategy name (e.g. EUR/USD Momentum Scalping)"
                />
            </div>

            {/* Action Buttons Row */}
            <div className={styles.readyActionsRow}>
                <button
                    type="button"
                    className={styles.btnCreateStrategy}
                    onClick={() => {
                        const finalChosenName = strategyName.trim() || defaultName;
                        onCreateStrategy(finalChosenName);
                    }}
                    disabled={generatingStrategy}
                >
                    <span>Create Strategy</span>
                </button>
            </div>
        </div>
    );
}
