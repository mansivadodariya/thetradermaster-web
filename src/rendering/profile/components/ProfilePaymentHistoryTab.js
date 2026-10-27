'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/paymentHistoryTab.module.scss';
import { subscriptionApi } from '@/lib/subscriptionApi';
import { generateInvoicePdf, formatTransactionId } from '../utils/invoicePdfGenerator';
import { toast } from '@/components/toast';

export default function ProfilePaymentHistoryTab({ t }) {
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const tableContainerRef = React.useRef(null);

    const handleTableWheel = (e) => {
        const el = tableContainerRef.current;
        if (!el) return;
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            const maxScroll = el.scrollHeight - el.clientHeight;
            if (maxScroll > 0) {
                el.scrollTop += e.deltaY;
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        async function loadHistory() {
            try {
                const data = await subscriptionApi.getPaymentHistory();
                if (isMounted && Array.isArray(data)) {
                    setHistory(data);
                }
            } catch (err) {
                console.warn('Failed to load payment history:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        loadHistory();
        return () => { isMounted = false; };
    }, []);

    const handleDownloadReceipt = async (item, idx) => {
        const isPending = String(item.status || '').toUpperCase() === 'PENDING';
        if (isPending) {
            toast.error(t?.('profile.invoicePendingNotice', 'Invoice is available after payment is confirmed.') || 'Invoice is available after payment is confirmed.');
            return;
        }

        setDownloadingId(item.id);
        const toastId = toast.loading(t?.('profile.downloadingPdf', 'Downloading official invoice...') || 'Downloading official invoice...');
        try {
            let downloaded = false;

            // 1. Primary: Call backend invoice download API
            const invoiceNum = item.invoice_number || item.id;
            if (invoiceNum) {
                try {
                    const res = await subscriptionApi.downloadInvoice(invoiceNum);
                    if (res?.downloaded) {
                        downloaded = true;
                    }
                } catch (apiErr) {
                    console.warn('[ProfilePaymentHistoryTab] Backend download API error:', apiErr);
                }
            }

            // 2. Secondary: If direct pdf_url exists on item
            if (!downloaded && item.pdf_url) {
                try {
                    const fileFetch = await fetch(item.pdf_url);
                    if (fileFetch.ok) {
                        const blob = await fileFetch.blob();
                        const blobUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = `Invoice-${invoiceNum || item.id}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
                        downloaded = true;
                    }
                } catch (urlErr) {
                    console.warn('[ProfilePaymentHistoryTab] Failed to fetch pdf_url:', urlErr);
                }
            }

            // 3. Guaranteed fallback: Generate executive PDF invoice immediately
            if (!downloaded) {
                await generateInvoicePdf(item, idx + 1);
                downloaded = true;
            }

            toast.dismiss(toastId);
            toast.success(t?.('profile.receiptDownloaded', 'PDF Invoice downloaded successfully!') || 'PDF Invoice downloaded!');
        } catch (err) {
            toast.dismiss(toastId);
            toast.error(err?.message || 'Failed to download PDF receipt.');
        } finally {
            setDownloadingId(null);
        }
    };

    const isPaidRecord = (item) => {
        if (item?.is_paid === true) return true;
        const s = String(item?.status || item?.payment_status || item?.original_status || '').toUpperCase();
        return s === 'SUCCESS' || s === 'COMPLETED' || s === 'PAID';
    };

    const totalSpent = history
        .filter(isPaidRecord)
        .reduce((sum, item) => sum + (Number(item?.amount_paid || item?.paid_amount || item?.amount || item?.total) || 0), 0);

    const activeCount = history.filter(isPaidRecord).length;

    const settlementCurrency = React.useMemo(() => {
        const currencies = new Set();
        history.forEach(item => {
            if (item?.currency) currencies.add(String(item.currency).toUpperCase());
        });
        if (currencies.size === 0) return 'USD / USDT';
        if (currencies.size === 1) return `${Array.from(currencies)[0]}`;
        return Array.from(currencies).join(' / ');
    }, [history]);

    const totalCreditsGranted = history
        .filter(isPaidRecord)
        .reduce((sum, item) => sum + (Number(item?.subscription_plans?.credits ?? item?.credits) || 0), 0);

    return (
        <div className={styles.paymentHistoryPanel}>
            <div className={styles.panelHeaderRow}>
                <div>
                    <h3>{t?.('profile.paymentHistoryTitle', 'Payment History & Invoices') || 'Payment History & Invoices'}</h3>
                    <p className={styles.panelSubtitle}>
                        {t?.('profile.paymentHistorySubtitle', 'Audit all previous subscription transactions, renewals, and download formal receipts.') || 'Audit all previous subscription transactions, renewals, and download formal receipts.'}
                    </p>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>{t?.('profile.totalInvested', 'Total Invested') || 'Total Invested'}</div>
                    <p className={styles.statValue}>
                        {loading ? <span className={styles.skeletonPulse} style={{ width: '80px', height: '24px' }} /> : `$${totalSpent.toFixed(2)}`}
                    </p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statLabel}>{t?.('profile.creditsGranted', 'Plan Credits Granted') || 'Plan Credits Granted'}</div>
                    <p className={styles.statValue}>
                        {loading ? <span className={styles.skeletonPulse} style={{ width: '90px', height: '24px' }} /> : `+${totalCreditsGranted.toLocaleString()} CR`}
                    </p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statLabel}>{t?.('profile.invoicesCount', 'Paid Invoices') || 'Paid Invoices'}</div>
                    <p className={styles.statValue}>
                        {loading ? (
                            <span className={styles.skeletonPulse} style={{ width: '60px', height: '24px' }} />
                        ) : (
                            <>
                                {activeCount} {history.length > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>/ {history.length}</span>}
                            </>
                        )}
                    </p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statLabel}>{t?.('profile.billingCurrency', 'Settlement') || 'Settlement'}</div>
                    <p className={styles.statValue}>
                        {loading ? <span className={styles.skeletonPulse} style={{ width: '85px', height: '24px' }} /> : settlementCurrency}
                    </p>
                </div>
            </div>

            {/* Ledger Table */}
            {loading ? (
                <div className={styles.tableWrapper}>
                    <table className={styles.historyTable}>
                        <thead>
                            <tr>
                                <th>{t?.('profile.invoiceNumber', 'Transaction / Invoice #') || 'Transaction / Invoice #'}</th>
                                <th>{t?.('profile.date', 'Date') || 'Date'}</th>
                                <th>{t?.('profile.planTier', 'Tier') || 'Tier'}</th>
                                <th>{t?.('profile.credits', 'Credits') || 'Credits'}</th>
                                <th>{t?.('profile.gateway', 'Method') || 'Method'}</th>
                                <th>{t?.('profile.amount', 'Amount') || 'Amount'}</th>
                                <th>{t?.('profile.status', 'Status') || 'Status'}</th>
                                <th style={{ textAlign: 'right' }}>{t?.('profile.action', 'Receipt') || 'Receipt'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <tr key={`skel-pay-${idx}`}>
                                    <td><div className={styles.skeletonPulse} style={{ width: '120px', height: '18px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '90px', height: '18px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '80px', height: '20px', borderRadius: '6px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '75px', height: '20px', borderRadius: '6px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '100px', height: '18px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '70px', height: '18px' }} /></td>
                                    <td><div className={styles.skeletonPulse} style={{ width: '85px', height: '20px', borderRadius: '99px' }} /></td>
                                    <td style={{ textAlign: 'right' }}><div className={styles.skeletonPulse} style={{ width: '65px', height: '24px', borderRadius: '6px' }} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : history.length > 0 ? (
                <div
                    ref={tableContainerRef}
                    className={styles.tableWrapper}
                    onWheel={handleTableWheel}
                    tabIndex={0}
                >
                    <table className={styles.historyTable}>
                        <thead>
                            <tr>
                                <th>{t?.('profile.invoiceNumber', 'Transaction / Invoice #') || 'Transaction / Invoice #'}</th>
                                <th>{t?.('profile.date', 'Date') || 'Date'}</th>
                                <th>{t?.('profile.planTier', 'Tier') || 'Tier'}</th>
                                <th>{t?.('profile.credits', 'Credits') || 'Credits'}</th>
                                <th>{t?.('profile.gateway', 'Method') || 'Method'}</th>
                                <th>{t?.('profile.amount', 'Amount') || 'Amount'}</th>
                                <th>{t?.('profile.status', 'Status') || 'Status'}</th>
                                <th style={{ textAlign: 'right' }}>{t?.('profile.action', 'Receipt') || 'Receipt'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, idx) => {
                                const d = new Date(item.created_at);
                                const dateStr = !isNaN(d.getTime())
                                    ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : '—';

                                const txnFormatted = item.invoice_number || formatTransactionId(item.id, idx + 1);
                                const statusStr = String(item.status || item.payment_status || item.original_status || 'PENDING').toUpperCase();
                                const isSuccess = statusStr === 'SUCCESS' || statusStr === 'COMPLETED' || statusStr === 'PAID' || item.is_paid;
                                const isPending = statusStr === 'PENDING' || statusStr === 'WAITING_PAYMENT' || statusStr === 'CREATED';
                                const isExpired = statusStr === 'EXPIRED';

                                const planName = item.plan_name || item.tier_name || item.tier || item.subscription_plans?.name || item.plan || 'Growth';
                                const creditsVal = item.subscription_plans?.credits ?? item.credits ?? (planName?.toLowerCase().includes('pro') ? 1500 : planName?.toLowerCase().includes('growth') ? 500 : 100);
                                const chainName = item.chain || (item.currency === 'USDT' ? 'TRON' : '');
                                const method = item.method || item.gateway || (item.currency ? `${item.currency}` : 'USDT');
                                const amountNum = Number(item.amount ?? item.total ?? 0).toFixed(2);
                                const cregisId = item.cregis_order_id || (item.webhook_payload?.data ? (() => {
                                    try {
                                        const parsed = typeof item.webhook_payload.data === 'string' ? JSON.parse(item.webhook_payload.data) : item.webhook_payload.data;
                                        return parsed?.order_id || parsed?.cregis_id || null;
                                    } catch (_) { return null; }
                                })() : null);

                                return (
                                    <tr key={item.id || idx}>
                                        <td className={styles.invoiceCol}>
                                            <span>{txnFormatted}</span>
                                            {cregisId && <span className={styles.cregisSub}>{cregisId}</span>}
                                        </td>
                                        <td>{dateStr}</td>
                                        <td>
                                            <span className={styles.planTierBadge}>
                                                {planName}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.creditsBadge}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <circle cx="12" cy="12" r="9" />
                                                    <path d="M12 6v12M15 9.5a3 3 0 0 0-3-2.5h-1a2.5 2.5 0 0 0 0 5h2a2.5 2.5 0 0 1 0 5h-1a3 3 0 0 1-3-2.5" />
                                                </svg>
                                                <span>+{Number(creditsVal).toLocaleString()}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span>{method}</span>
                                            {chainName && <span className={styles.chainTag}>{chainName}</span>}
                                            {item.tx_hash && (
                                                <a
                                                    href={`https://tronscan.org/#/transaction/${item.tx_hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ display: 'block', fontSize: '0.68rem', color: '#18c98b', textDecoration: 'underline', marginTop: '2px' }}
                                                >
                                                    Tx: {item.tx_hash.slice(0, 8)}...
                                                </a>
                                            )}
                                        </td>
                                        <td className={styles.amountText}>${amountNum}</td>
                                        <td>
                                            <span
                                                className={`
                                                    ${styles.statusPill}
                                                    ${isSuccess ? styles.statusSuccess : isPending ? styles.statusPending : isExpired ? styles.statusExpired : styles.statusFailed}
                                                `}
                                            >
                                                {statusStr}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                className={`${styles.downloadBtn} ${!isSuccess ? styles.btnDisabled : ''}`}
                                                onClick={() => handleDownloadReceipt({ ...item, invoice_number: txnFormatted, plan_name: planName, gateway: `${method} (${chainName})`, amount: amountNum, status: statusStr, credits: creditsVal }, idx)}
                                                disabled={!isSuccess || downloadingId === item.id}
                                                title={
                                                    !isSuccess
                                                        ? (t?.('profile.invoicePendingTooltip', 'Invoice available once payment is confirmed') || 'Invoice available once payment is confirmed')
                                                        : (t?.('profile.downloadInvoiceTooltip', 'Download Official PDF Invoice') || 'Download Official PDF Invoice')
                                                }
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="7 10 12 15 17 10" />
                                                    <line x1="12" y1="15" x2="12" y2="3" />
                                                </svg>
                                                <span>{downloadingId === item.id ? 'Exporting...' : (t?.('profile.invoice', 'Invoice') || 'Invoice')}</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    </div>
                    <h4>{t?.('profile.noPaymentsYet', 'No Payment Records Found') || 'No Payment Records Found'}</h4>
                    <p>
                        {t?.('profile.noPaymentsDesc', 'You have not made any plan purchases yet. Explore our high-speed AI subscription tiers to unlock institutional analytics.') || 'You have not made any plan purchases yet. Explore our high-speed AI subscription tiers to unlock institutional analytics.'}
                    </p>
                    <button
                        type="button"
                        className={styles.exploreBtn}
                        onClick={() => router.push('/subscription-plans')}
                    >
                        <span>{t?.('profile.viewPlansBtn', 'Explore Subscription Plans') || 'Explore Subscription Plans'}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
