'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../aiSnapDashboard.module.scss';
import { ClockIcon, FlameIcon, TrendingUpIcon, GlobeIcon } from '@/icons/aiSnapIcons';

export default function TimeframeSelectionModal({ open, onClose, onSelectTimeframe, timeframeOptions }) {
    if (!open) return null;

    const defaultOptions = timeframeOptions || [
        { label: "Short Term (Intraday)", value: "D1", desc: "For day trading & quick scalp momentum setups", icon: <FlameIcon size={20} color="#18C98B" /> },
        { label: "Mid Term (Swing)", value: "W1", desc: "For multi-day swing positions & structural trends", icon: <TrendingUpIcon size={20} color="#18C98B" /> },
        { label: "Long Term (Positional)", value: "MN", desc: "For macro position trading & major cycles", icon: <GlobeIcon size={20} color="#18C98B" /> }
    ];

    return (
        <AnimatePresence>
            <div className={styles.timeframeModalOverlay} role="dialog" aria-modal="true" onClick={onClose}>
                <motion.div
                    className={styles.timeframeModalBox}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Header */}
                    <div className={styles.timeframeModalHeader}>
                        <div className={styles.timeframeHeaderIconWrap}>
                            <ClockIcon size={22} />
                        </div>
                        <div>
                            <h2 className={styles.timeframeHeaderTitle}>Timeframe Horizon Needed</h2>
                            <p className={styles.timeframeHeaderSub}>
                                Timeframe was not auto-detected from chart image. Select your preferred analysis timeframe horizon:
                            </p>
                        </div>
                        <button type="button" className={styles.timeframeModalClose} onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>

                    {/* 3 Selectable Cards */}
                    <div className={styles.timeframeCardsGrid}>
                        {defaultOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={styles.timeframeOptionCard}
                                onClick={() => {
                                    onSelectTimeframe(opt.value);
                                    onClose();
                                }}
                            >
                                <div className={styles.tfCardTopRow}>
                                    <span className={styles.tfCardEmoji}>{typeof opt.icon === 'string' ? <ClockIcon size={20} color="#18C98B" /> : (opt.icon || <ClockIcon size={20} color="#18C98B" />)}</span>
                                    <span className={styles.tfBadge}>{opt.value}</span>
                                </div>
                                <h3 className={styles.tfCardLabel}>{opt.label}</h3>
                                <p className={styles.tfCardDesc}>{opt.desc || `Analyze market structure on ${opt.value} horizon`}</p>
                                <div className={styles.tfCardActionRow}>
                                    <span>Select Horizon</span>
                                    <span className={styles.tfArrow}>→</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className={styles.timeframeModalFooter}>
                        <button type="button" className={styles.btnGhostModal} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
