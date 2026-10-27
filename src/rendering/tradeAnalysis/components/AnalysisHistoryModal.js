'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../tradeAnalysis.module.scss';
import { HistoryIcon, CloseIcon, formatCurrency } from '@/icons/tradeAnalysisIcons';

export default function AnalysisHistoryModal({
    isOpen,
    onClose,
    brokerMeta = {},
    totalTradesCount,
    winRateVal,
    netProfitVal,
    payoffRatio,
    largestWin,
    largestLoss,
    profitFactor,
    avgHoldingTime
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className={styles.modalBackdrop} onClick={onClose} data-lenis-prevent="true">
                <motion.div
                    className={styles.historyModalContainer}
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                    data-lenis-prevent="true"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                >
                    <div className={styles.modalHeader}>
                        <h3>
                            <HistoryIcon />
                            <span>Analysis History & Overview</span>
                        </h3>
                        <button type="button" className={styles.closeBtn} onClick={onClose}>
                            <CloseIcon />
                        </button>
                    </div>

                    <div className={styles.modalBody}>
                        <div className={styles.overviewCard}>
                            <div className={styles.cardHeaderRow}>
                                <h3>Account Lifetime Statistics</h3>
                            </div>
                            <div className={styles.overviewGrid}>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Total Reports</span>
                                    <span className={styles.statVal}>{brokerMeta.files_count || 1}</span>
                                </div>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Total Trades</span>
                                    <span className={styles.statVal}>{totalTradesCount}</span>
                                </div>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Win Rate</span>
                                    <span className={`${styles.statVal} ${styles.gold}`}>{winRateVal.toFixed(1)}%</span>
                                </div>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Total P&L</span>
                                    <span className={`${styles.statVal} ${netProfitVal >= 0 ? styles.green : styles.red}`}>{formatCurrency(netProfitVal)}</span>
                                </div>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Avg. R:R</span>
                                    <span className={styles.statVal}>{payoffRatio?.split(':')[0] || '1.5'}</span>
                                </div>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Largest Win</span>
                                    <span className={`${styles.statVal} ${styles.green}`}>{formatCurrency(largestWin)}</span>
                                </div>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Largest Loss</span>
                                    <span className={`${styles.statVal} ${largestLoss < 0 ? styles.red : styles.green}`}>
                                        {largestLoss < 0 ? formatCurrency(largestLoss) : '$0.00'}
                                    </span>
                                </div>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Profit Factor</span>
                                    <span className={styles.statVal}>{profitFactor.toFixed(2)}</span>
                                </div>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Avg Holding</span>
                                    <span className={styles.statVal}>{avgHoldingTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
