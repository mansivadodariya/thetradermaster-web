'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/paymentFailedModal.module.scss';
import { useLanguage } from '@/context/LanguageContext';

export default function PaymentFailedModal({
    isOpen,
    onClose,
    onRetry,
    reason
}) {
    const { t } = useLanguage();

    if (!isOpen) return null;

    const displayReason = reason === 'cancelled'
        ? t('plans.paymentCancelledByClient', 'The payment session was cancelled or timed out.')
        : (reason || t('plans.paymentIncompleteReason', 'Gateway transaction was not completed.'));

    return (
        <AnimatePresence>
            <div className={styles.modalBackdrop} onClick={onClose}>
                <motion.div
                    className={styles.modalCard}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={styles.ambientGlow} aria-hidden="true" />

                    {/* Alert Icon */}
                    <div className={styles.failIconBox}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>

                    <h2 className={styles.title}>{t('plans.paymentIncompleteTitle', 'Payment Not Completed')}</h2>
                    <p className={styles.subtitle}>{displayReason}</p>

                    {/* Safeguard Reassurance */}
                    <div className={styles.reassuranceBox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <polyline points="9 12 11 14 15 10" />
                        </svg>
                        <span>
                            {t(
                                'plans.existingPlanSafe',
                                'Zero Risk Guarantee: Your existing active plan and AI compute credits remain 100% untouched and active.'
                            )}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className={styles.actionStack}>
                        <button
                            type="button"
                            className={styles.retryBtn}
                            onClick={onRetry}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="1 4 1 10 7 10" />
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                            <span>{t('plans.retryPayment', 'Retry Checkout')}</span>
                        </button>

                        <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={onClose}
                        >
                            <span>{t('common.close', 'Dismiss & Return to Plans')}</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
