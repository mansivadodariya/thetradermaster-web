'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraIcon } from '@/icons/tradeSnapIcons';
import styles from '../tradeSnap.module.scss';

const SCAN_STAGES = [
    { text: 'Scanning market…', sub: 'Extracting price action geometry & candlestick wicks' },
    { text: 'Analyzing indicators…', sub: 'Evaluating EMAs, SuperTrend & volume delta' },
    { text: 'Checking momentum…', sub: 'Inspecting RSI divergence & stochastic oscillators' },
    { text: 'Detecting signals…', sub: 'Identifying order blocks, liquidity pools & chart patterns' },
    { text: 'Generating AI insights…', sub: 'Synthesizing trade setups, exact entry, stop-loss & take-profit' }
];

export default function TradeSnapSnapshotPanel({
    capturedImage,
    isAnalyzing,
    analyzeImage,
    error,
    retryAnalysis,
    onDiscard
}) {
    const [scanStageIndex, setScanStageIndex] = useState(0);
    const [dynamicProgress, setDynamicProgress] = useState(18);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (!isAnalyzing) {
            setScanStageIndex(0);
            setDynamicProgress(18);
            setElapsedSeconds(0);
            return;
        }

        const stageInterval = setInterval(() => {
            setScanStageIndex((prev) => (prev + 1) % SCAN_STAGES.length);
        }, 1600);

        const progressInterval = setInterval(() => {
            setDynamicProgress((prev) => {
                if (prev < 94) {
                    const step = Math.floor(Math.random() * 6) + 2;
                    return Math.min(94, prev + step);
                }
                return prev;
            });
        }, 300);

        const timerInterval = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => {
            clearInterval(stageInterval);
            clearInterval(progressInterval);
            clearInterval(timerInterval);
        };
    }, [isAnalyzing]);

    const activeStage = SCAN_STAGES[scanStageIndex];

    return (
        <div className={styles.sideColumn}>
            <div className={styles.panel}>
                <div className={styles.snapshotHeader}>
                    <h3>
                        <CameraIcon />
                        Latest Snapshot
                    </h3>
                    <div className={styles.snapshotHeaderActions}>
                        {!isAnalyzing && onDiscard && (
                            <button
                                type="button"
                                className={styles.btnDiscard}
                                onClick={onDiscard}
                                title="Discard snapshot and return to guide or live feed"
                            >
                                Discard
                            </button>
                        )}
                        <button
                            type="button"
                            className={`${styles.btnAnalyze} ${isAnalyzing ? styles.isAnalyzingBtn : ''}`}
                            onClick={analyzeImage}
                            disabled={isAnalyzing || !capturedImage}
                        >
                            {isAnalyzing ? (
                                <span className={styles.analyzingTextWrap}>
                                    <span className={styles.pulseDot} />
                                    {activeStage.text}
                                </span>
                            ) : (
                                <span>Analyze</span>
                            )}
                        </button>
                    </div>
                </div>

                <div className={styles.snapshotWrapper}>
                    {capturedImage ? (
                        <div className={styles.snapshotImageContainer}>
                            <img src={capturedImage} alt="Captured screenshot" className={styles.snapshotImg} />
                            
                            {/* Animated Holographic Scanner & Radar Overlay when analyzing */}
                            <AnimatePresence>
                                {isAnalyzing && (
                                    <motion.div
                                        className={styles.scannerOverlay}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={styles.scannerGridMesh} />
                                        <div className={styles.scannerLaserLine} />
                                        <div className={styles.cornerBracketTL} />
                                        <div className={styles.cornerBracketTR} />
                                        <div className={styles.cornerBracketBL} />
                                        <div className={styles.cornerBracketBR} />

                                        <div className={styles.scannerOverlayContent}>
                                            {/* Holographic Center Radar */}
                                            <div className={styles.scannerCenterCore}>
                                                <div className={styles.scannerRingGlow} />
                                                
                                                {/* Outer Rotating Radar Ring */}
                                                <motion.svg
                                                    className={styles.radarSvgRingOuter}
                                                    viewBox="0 0 100 100"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                                                >
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="44"
                                                        fill="none"
                                                        stroke="rgba(24, 201, 139, 0.3)"
                                                        strokeWidth="2.5"
                                                        strokeDasharray="16 10"
                                                    />
                                                </motion.svg>

                                                {/* Middle Counter-Rotating Pulse Ring */}
                                                <motion.svg
                                                    className={styles.radarSvgRingInner}
                                                    viewBox="0 0 100 100"
                                                    animate={{ rotate: -360 }}
                                                    transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
                                                >
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="34"
                                                        fill="none"
                                                        stroke="url(#scannerOverlayGradient)"
                                                        strokeWidth="3.5"
                                                        strokeDasharray="45 55"
                                                        strokeLinecap="round"
                                                    />
                                                    <defs>
                                                        <linearGradient id="scannerOverlayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#18C98B" />
                                                            <stop offset="100%" stopColor="#38BDF8" />
                                                        </linearGradient>
                                                    </defs>
                                                </motion.svg>

                                                {/* Center Lightning / Scanner Core Icon */}
                                                <div className={styles.scannerCenterIcon}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Rotating Messages */}
                                            <div className={styles.rotatingMessageBlock}>
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={activeStage.text}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -6 }}
                                                        transition={{ duration: 0.22 }}
                                                        className={styles.messageContentWrap}
                                                    >
                                                        <h4 className={styles.rotatingMainMessage}>{activeStage.text}</h4>
                                                        <p className={styles.rotatingSubMessage}>{activeStage.sub}</p>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>

                                            {/* Progress Section */}
                                            <div className={styles.analyzingProgressSection}>
                                                <div className={styles.analyzingProgressBarTrack}>
                                                    <motion.div
                                                        className={styles.analyzingProgressBarFill}
                                                        style={{ width: `${dynamicProgress}%` }}
                                                        transition={{ ease: 'easeOut', duration: 0.3 }}
                                                    />
                                                </div>

                                                <div className={styles.analyzingMetaFooter}>
                                                    <span className={styles.analyzingTelemetryText}>
                                                        Multi-Timeframe Neural Pipeline • {elapsedSeconds}s (max 75s)
                                                    </span>
                                                    <span className={styles.analyzingPercentNumber}>
                                                        {dynamicProgress}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className={styles.snapshotEmpty}>Capture a screenshot to analyze</div>
                    )}
                </div>

                {/* Inline Failure & Retry State */}
                {error && !isAnalyzing && capturedImage && (
                    <div className={styles.snapshotRetryBar}>
                        <div className={styles.retryInfo}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{error || 'Please add a graph screenshot to analyze'}</span>
                        </div>
                        <button
                            type="button"
                            className={styles.retryActionBtn}
                            onClick={retryAnalysis || analyzeImage}
                        >
                            Retry Analysis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
