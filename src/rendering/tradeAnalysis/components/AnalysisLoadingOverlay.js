'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../tradeAnalysis.module.scss';
import { SparklesIcon, LockIcon } from '@/icons/tradeAnalysisIcons';

const STAGES = [
    { label: 'Reading Statement & Normalizing Format', sub: 'Parsing broker CSV / PDF ledger structures' },
    { label: 'Neural Trade Extraction', sub: 'Mapping tickets, fill prices, lot sizing & commissions' },
    { label: 'Behavioral & Psychological Audit', sub: 'Scanning for FOMO impulses, revenge re-entries & tilt' },
    { label: 'Synthesizing Executive Scorecard', sub: 'Computing win-rate, R:R edge & category grading' }
];

export default function AnalysisLoadingOverlay({ file }) {
    const [currentStage, setCurrentStage] = useState(0);
    const [progress, setProgress] = useState(14);

    useEffect(() => {
        const stageInterval = setInterval(() => {
            setCurrentStage((prev) => {
                if (prev < STAGES.length - 1) return prev + 1;
                return prev;
            });
        }, 2200);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 94) {
                    const inc = Math.floor(Math.random() * 8) + 3;
                    return Math.min(94, prev + inc);
                }
                return prev;
            });
        }, 350);

        return () => {
            clearInterval(stageInterval);
            clearInterval(progressInterval);
        };
    }, []);

    const fileName = file?.name || 'Trading_Statement.pdf';
    const fileSize = file?.size
        ? file.size >= 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`
        : 'Broker Export';

    return (
        <motion.div
            className={styles.loadingOverlayBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            <motion.div
                className={styles.loadingOverlayCard}
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            >
                {/* Glowing Ambient Top Highlight */}
                <div className={styles.loadingGlowBar} />

                {/* Central Holographic Spinner Core */}
                <div className={styles.spinnerCoreContainer}>
                    <div className={styles.spinnerGlowAura} />
                    
                    {/* Outer Rotating Radar Ring */}
                    <motion.svg
                        className={styles.outerRadarRing}
                        viewBox="0 0 100 100"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="none"
                            stroke="rgba(24, 201, 139, 0.25)"
                            strokeWidth="2"
                            strokeDasharray="14 10"
                        />
                    </motion.svg>

                    {/* Middle Counter-Rotating Pulse Ring */}
                    <motion.svg
                        className={styles.middleRadarRing}
                        viewBox="0 0 100 100"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="34"
                            fill="none"
                            stroke="url(#greenCyanGrad)"
                            strokeWidth="3"
                            strokeDasharray="40 60"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="greenCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#18C98B" />
                                <stop offset="100%" stopColor="#38BDF8" />
                            </linearGradient>
                        </defs>
                    </motion.svg>

                    {/* Inner AI Sparkle Center */}
                    <div className={styles.centerSparkleOrb}>
                        <SparklesIcon />
                    </div>
                </div>

                {/* Main Header */}
                <div className={styles.loadingHeaderArea}>
                    <h3>AI Deep Audit in Progress</h3>
                    <p>Extracting trading metrics, execution timing & psychological behavioral patterns.</p>
                </div>

                {/* Active File Chip */}
                <div className={styles.activeFilePill}>
                    <div className={styles.fileIconWrap}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                    </div>
                    <span className={styles.fileName}>{fileName}</span>
                    <span className={styles.fileSize}>({fileSize})</span>
                </div>

                {/* Progress Bar Container */}
                <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBarTrack}>
                        <motion.div
                            className={styles.progressBarFill}
                            style={{ width: `${progress}%` }}
                            transition={{ ease: 'easeOut', duration: 0.3 }}
                        />
                    </div>
                    <div className={styles.progressPercentText}>{progress}%</div>
                </div>

                {/* Telemetry Stage List */}
                <div className={styles.stagesList}>
                    {STAGES.map((stage, idx) => {
                        const isDone = idx < currentStage;
                        const isCurrent = idx === currentStage;
                        return (
                            <div
                                key={idx}
                                className={`${styles.stageRow} ${isDone ? styles.stageDone : ''} ${isCurrent ? styles.stageActive : ''}`}
                            >
                                <div className={styles.stageIndicator}>
                                    {isDone ? (
                                        <div className={styles.stageDoneCheck}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                    ) : isCurrent ? (
                                        <div className={styles.stageActiveDot}>
                                            <span className={styles.pulseRing} />
                                        </div>
                                    ) : (
                                        <div className={styles.stagePendingDot} />
                                    )}
                                </div>
                                <div className={styles.stageContent}>
                                    <div className={styles.stageTitle}>{stage.label}</div>
                                    <div className={styles.stageSub}>{stage.sub}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Security Footer Notice */}
                <div className={styles.loadingSecurityNotice}>
                    <LockIcon />
                    <span>256-Bit Encrypted Client-Side Execution • Secure & Confidential</span>
                </div>
            </motion.div>
        </motion.div>
    );
}
