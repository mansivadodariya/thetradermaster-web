'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/paymentSuccessModal.module.scss';
import { useLanguage } from '@/context/LanguageContext';

export default function PaymentSuccessModal({
    isOpen,
    onClose,
    plan,
    orderId
}) {
    const router = useRouter();
    const { t } = useLanguage();

    if (!isOpen) return null;

    const planName = plan?.name || 'Pro';
    const credits = plan?.credits ? `${plan.credits.toLocaleString()} AI Credits` : '200 AI Credits';
    const validity = plan?.validity || '1 Month';
    const displayOrder = orderId || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const today = new Date();
    const durationDays = (plan?.id === 'pro') ? 180 : (plan?.id === 'growth') ? 90 : 30;
    const expiryDate = new Date(today.getTime() + durationDays * 86400000);

    const formattedStart = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedEnd = expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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

                    {/* Celebration Icon */}
                    <div className={styles.celebrationIconBox}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h2 className={styles.title}>{t('plans.paymentSuccessTitle', 'Payment Successful!')}</h2>
                    <p className={styles.subtitle}>
                        {t(
                            'plans.paymentSuccessDesc',
                            'Your subscription has been confirmed and activated. Full platform bandwidth is now allocated.'
                        )}
                    </p>

                    {/* Activated Plan Card */}
                    <div className={styles.activatedPlanBox}>
                        <div className={styles.row}>
                            <span>{t('plans.activatedTier', 'Activated Tier')}</span>
                            <span className={styles.highlightValue}>{planName} Tier</span>
                        </div>

                        <div className={styles.row}>
                            <span>{t('plans.aiComputeCredits', 'Compute Quota')}</span>
                            <span className={styles.value}>{credits}</span>
                        </div>

                        <div className={styles.row}>
                            <span>{t('plans.activePeriod', 'Coverage Window')}</span>
                            <span className={styles.value}>{formattedStart} — {formattedEnd}</span>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.row}>
                            <span>{t('plans.invoiceNumber', 'Invoice Number')}</span>
                            <span className={styles.value}>{displayOrder}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={styles.actionStack}>
                        <button
                            type="button"
                            className={styles.primaryBtn}
                            onClick={() => {
                                onClose();
                                router.push('/market-assistant');
                            }}
                        >
                            <span>{t('plans.launchAiWorkspace', 'Launch AI Market Assistant')}</span>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => {
                                onClose();
                                router.push('/profile?tab=payment_history');
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span>{t('plans.viewInvoiceSettings', 'View Invoice in Settings')}</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
