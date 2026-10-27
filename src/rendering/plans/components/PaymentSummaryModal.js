'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/paymentSummaryModal.module.scss';
import { subscriptionApi } from '@/lib/subscriptionApi';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/components/toast';

export default function PaymentSummaryModal({
    isOpen,
    onClose,
    plan,
    currentSubscription,
    actionType = 'SUBSCRIBE',
    onProceed
}) {
    const { t } = useLanguage();
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Calculate itemized summary whenever modal opens via POST /api/v1/payments/calculate-summary
    useEffect(() => {
        if (!isOpen || !plan) return;
        let isMounted = true;
        async function updateSummary() {
            setIsLoading(true);
            try {
                const calculated = await subscriptionApi.calculateSummary({
                    planId: plan.id,
                    plan,
                });
                if (isMounted && calculated) {
                    setSummary(calculated);
                }
            } catch (err) {
                console.warn('[PaymentSummaryModal] Failed to calculate summary:', err);
                if (isMounted) {
                    setSummary({
                        plan_id: plan.id,
                        plan_name: plan.name,
                        base_price: Number(plan.price || 0),
                        discount_amount: 0,
                        tax_rate: 0,
                        tax_amount: 0,
                        final_amount: Number(plan.price || 0),
                        currency: plan.currency || 'USD',
                    });
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        updateSummary();
        return () => { isMounted = false; };
    }, [plan, isOpen]);

    if (!isOpen || !plan) return null;

    // CTA Click Handler ("Proceed to Secure Checkout") -> Direct Cregis Redirect
    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const payableAmount = Number(summary?.final_amount ?? plan.price);

            if (onProceed) {
                await onProceed({
                    plan,
                    gateway: 'CREGIS',
                    amount: payableAmount,
                    summary,
                });
            } else {
                const res = await subscriptionApi.createCryptoDeposit({
                    amount: payableAmount,
                    plan_id: plan.id,
                    currency: 'USDT',
                    chain: 'TRON',
                });
                const checkoutUrl = subscriptionApi.extractCheckoutUrl(res);

                if (checkoutUrl) {
                    toast.success(t('plans.redirecting', 'Redirecting to secure payment...'));
                    onClose();
                    window.location.href = checkoutUrl;
                } else {
                    toast.success(t('plans.cryptoOrderCreated', 'Crypto deposit order created successfully.'));
                    onClose();
                }
            }
        } catch (err) {
            toast.error(err.message || 'Payment initiation failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const modalTitle = actionType === 'RENEW'
        ? t('plans.renewSubscription', 'Renew & Extend Subscription')
        : actionType === 'UPGRADE'
        ? t('plans.upgradeTierTitle', 'Upgrade AI Processing Tier')
        : actionType === 'DOWNGRADE'
        ? t('plans.downgradePlanTitle', 'Select Plan Tier')
        : t('plans.checkoutSummary', 'Payment Order Summary');

    return (
        <AnimatePresence>
            <div className={styles.modalBackdrop} onClick={onClose}>
                <motion.div
                    className={styles.modalCard}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* Header */}
                    <div className={styles.modalHeader}>
                        <div className={styles.modalTitleGroup}>
                            <div className={styles.iconBadge}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </div>
                            <h3>{modalTitle}</h3>
                        </div>

                        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className={styles.modalBody}>
                        {/* 1. Plan Overview */}
                        <div className={styles.planOverviewCard}>
                            <div className={styles.planDetails}>
                                <h4>{plan.name} Tier</h4>
                                <p>{plan.validity} Duration • {plan.credits?.toLocaleString() || 'Unlimited'} AI Credits</p>
                            </div>
                            <div className={styles.planPriceCol}>
                                <div className={styles.priceMain}>${plan.price}</div>
                                <div className={styles.validitySub}>Billed Once</div>
                            </div>
                        </div>

                        {/* 2. Itemized Financial Summary */}
                        {summary && (
                            <div className={styles.summaryTable}>
                                <div className={styles.summaryRow}>
                                    <span>{t('plans.basePrice', 'Base Plan Price')}</span>
                                    <span>${summary.base_price.toFixed(2)}</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>
                                        {t('plans.taxVat', 'Tax / Fee')}
                                        {summary.tax_rate > 0 ? ` (${(summary.tax_rate * 100).toFixed(0)}%)` : ''}
                                    </span>
                                    <span>${summary.tax_amount.toFixed(2)}</span>
                                </div>

                                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                    <span>{t('plans.netPayable', 'Net Final Payable')}</span>
                                    <span className={styles.totalAmount}>
                                        ${summary.final_amount.toFixed(2)} {summary.currency || 'USD'}
                                    </span>
                                </div>
                            </div>
                        )}


                        {/* 4. Zero-Deactivation Safeguard Notice */}
                        <div className={styles.safeguardBanner}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span>
                                {t(
                                    'plans.safeguardExplanation',
                                    'Safe Checkout: Your existing plan remains 100% active and will not be altered until payment is verified by the gateway.'
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isLoading}>
                            {t('common.cancel', 'Cancel')}
                        </button>

                        <button type="button" className={styles.checkoutBtn} onClick={handleCheckout} disabled={isLoading}>
                            {isLoading ? t('common.processing', 'Redirecting...') : (
                                <>
                                    <span>{t('plans.proceedToGateway', 'Proceed to Secure Checkout')}</span>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
