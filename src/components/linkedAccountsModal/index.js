'use client';

import React, { useState, useEffect } from 'react';
import styles from './linkedAccountsModal.module.scss';
import { useLanguage } from '@/context/LanguageContext';

export default function LinkedAccountsModal({
    onClose,
    accounts = [],
    summary = {},
    email = '',
    onRefresh = null,
    refreshing = false,
}) {
    const { t } = useLanguage();
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Prevent body scroll while modal is open
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    const handleCopy = (accountNum, idx) => {
        if (!accountNum) return;
        try {
            navigator.clipboard.writeText(String(accountNum));
            setCopiedIndex(idx);
            setTimeout(() => setCopiedIndex(null), 1800);
        } catch (_) {}
    };

    const accountCount = summary?.AccountCount ?? accounts.length ?? 0;
    const totalBalance = Number(summary?.AccountBalance ?? 0);
    const totalLots = Number(summary?.Lot ?? 0);
    const totalVolume = Number(summary?.Volume ?? 0);

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                <div className={styles.accentTopLine} />

                {/* Modal Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles.iconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                        </div>
                        <div className={styles.titleGroup}>
                            <h3>
                                <span>{t('dashboard.linkedAccountsModalTitle', 'Linked MetaTrader 5 Accounts')}</span>
                                <span className={styles.activeBadge}>
                                    <span className={styles.statusDot} />
                                    {accountCount} {accountCount === 1 ? 'Account' : 'Accounts'}
                                </span>
                            </h3>
                            <p>
                                <span>{t('dashboard.linkedToEmail', 'Live accounts associated with')}</span>
                                {email && <span className={styles.emailPill}>{email}</span>}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.closeBtn}
                        aria-label="Close modal"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Aggregated Totals Strip */}
                <div className={styles.summaryStrip}>
                    <div className={styles.summaryChip}>
                        <span className={styles.summaryLabel}>{t('dashboard.totalBalance', 'Total Balance')}</span>
                        <span className={styles.summaryVal}>
                            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className={styles.summaryChip}>
                        <span className={styles.summaryLabel}>{t('dashboard.tradedLots', 'Total Lots')}</span>
                        <span className={styles.summaryVal}>
                            {totalLots.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className={styles.summaryChip}>
                        <span className={styles.summaryLabel}>{t('dashboard.tradingVolume', 'Trading Volume')}</span>
                        <span className={styles.summaryVal}>
                            {totalVolume.toLocaleString('en-US')}
                        </span>
                    </div>
                    <div className={styles.summaryChip}>
                        <span className={styles.summaryLabel}>{t('dashboard.activeAccounts', 'Active MT5 IDs')}</span>
                        <span className={styles.summaryVal}>
                            {accountCount}
                        </span>
                    </div>
                </div>

                {/* Accounts List */}
                <div className={styles.accountsList}>
                    {accounts && accounts.length > 0 ? (
                        accounts.map((acc, idx) => {
                            const isCopied = copiedIndex === idx;
                            return (
                                <div key={acc.AccountNumber || idx} className={styles.accountCard}>
                                    <div className={styles.cardHead}>
                                        <div className={styles.accountIdent}>
                                            <span className={styles.accountNum}>
                                                #{acc.AccountNumber}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(acc.AccountNumber, idx)}
                                                className={styles.copyBtn}
                                                title="Copy account number"
                                            >
                                                {isCopied ? (
                                                    <>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                        </svg>
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className={styles.accountPlatform}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                                <polyline points="2 17 12 22 22 17" />
                                                <polyline points="2 12 12 17 22 12" />
                                            </svg>
                                            <span>Newera MT5</span>
                                        </div>
                                    </div>

                                    <div className={styles.accountMetricsGrid}>
                                        <div className={styles.accountMetric}>
                                            <span className={styles.subLabel}>{t('dashboard.accountBalance', 'Balance')}</span>
                                            <span className={styles.metricFigure}>
                                                ${Number(acc.AccountBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className={styles.accountMetric}>
                                            <span className={styles.subLabel}>{t('dashboard.equity', 'Equity')}</span>
                                            <span className={styles.metricFigure}>
                                                ${Number(acc.AccountEquity || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className={styles.accountMetric}>
                                            <span className={styles.subLabel}>{t('dashboard.tradedLots', 'Closed Lots')}</span>
                                            <span className={`${styles.metricFigure} ${styles.lotsFigure}`}>
                                                {Number(acc.Lot || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className={styles.accountMetric}>
                                            <span className={styles.subLabel}>{t('dashboard.tradingVolume', 'Volume')}</span>
                                            <span className={styles.metricFigure}>
                                                {Number(acc.Volume || 0).toLocaleString('en-US')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <h4>{t('dashboard.noAccountsFound', 'No Linked MT5 Accounts')}</h4>
                            <p>{t('dashboard.noAccountsFoundDesc', 'We could not detect any active MT5 trading account associated with this email.')}</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className={styles.modalFooter}>
                    <div className={styles.footerNote}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>Verified live via Newera MT5 OpenApi</span>
                    </div>
                    <div className={styles.footerActions}>
                        {onRefresh && (
                            <button
                                type="button"
                                onClick={onRefresh}
                                disabled={refreshing}
                                className={styles.copyBtn}
                                style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10" />
                                    <polyline points="1 20 1 14 7 14" />
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>
                                <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.doneBtn}
                        >
                            {t('common.done', 'Done')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
