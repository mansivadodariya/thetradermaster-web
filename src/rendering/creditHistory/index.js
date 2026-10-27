'use client';
import CommonSectionHeader from '@/components/CommonSectionHeader';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './creditHistory.module.scss';
import Loader from '@/components/loader';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/toast';
import { useLanguage } from '@/context/LanguageContext';

function getUserFromStorage() {
    try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

export default function CreditHistory({ embedMode = false }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [userId, setUserId] = useState('');
    const [creditHistory, setCreditHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const user = getUserFromStorage();
        if (!user) {
            router.replace('/login');
            return;
        }
        const id = user.id || user.user_id || '';
        setUserId(id);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCreditHistory(userId);
        }
    }, [userId]);

    const fetchCreditHistory = async (id) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('credit_history')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setCreditHistory(data || []);
            setCurrentPage(1);
        } catch (err) {
            toast.error(err.message || 'Failed to load credit history.');
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateLike) => {
        const d = dateLike ? new Date(dateLike) : null;
        if (!d || Number.isNaN(d.getTime())) return '—';

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12;
        hours = String(hours).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    // Calculate totals
    const totalCreditsAdded = creditHistory
        .filter(item => item.transaction_type === 'add')
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const totalCreditsUsed = creditHistory
        .filter(item => item.transaction_type !== 'add')
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    // Pagination calculations
    const totalPages = Math.ceil(creditHistory.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = creditHistory.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.container}>
            {!embedMode && (
                <CommonSectionHeader
                    badge={t('creditHistory.badge', 'CREDIT VAULT & AUDIT LOG')}
                    badgeIcon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 6v12M15 9.5a3 3 0 0 0-3-2.5h-1a2.5 2.5 0 0 0 0 5h2a2.5 2.5 0 0 1 0 5h-1a3 3 0 0 1-3-2.5" />
                        </svg>
                    }
                    title={t('creditHistory.title', 'Credit History')}
                    subtitle={t('creditHistory.subtitle', 'Track your credit usage, deposits, and rewards')}
                    isCard={true}
                />
            )}

            {/* Top Summary Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIconBox}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    </div>
                    <div className={styles.statMeta}>
                        <span className={styles.statLabel}>{t('creditHistory.totalTransactions', 'Total Transactions')}</span>
                        <strong className={styles.statValue}>{creditHistory.length}</strong>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIconBox} ${styles.iconGreen}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </div>
                    <div className={styles.statMeta}>
                        <span className={styles.statLabel}>{t('creditHistory.totalCredited', 'Total Credited')}</span>
                        <strong className={`${styles.statValue} ${styles.textGreen}`}>+{totalCreditsAdded.toLocaleString()}</strong>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIconBox} ${styles.iconRed}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </div>
                    <div className={styles.statMeta}>
                        <span className={styles.statLabel}>{t('creditHistory.totalUsed', 'Total Used / Deducted')}</span>
                        <strong className={`${styles.statValue} ${styles.textRed}`}>-{totalCreditsUsed.toLocaleString()}</strong>
                    </div>
                </div>
            </div>

            {/* Main History Table Card */}
            <div className={styles.card}>
                <div className={styles.historyHeader}>
                    <div className={styles.historyHeaderLeft}>
                        <div className={styles.cardHeaderIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div>
                            <h2>{t('creditHistory.transactionHistory', 'Transaction History')}</h2>
                            <p>{t('creditHistory.detailsDesc', 'Details of all your credit transactions')}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <Loader centered size="lg" />
                ) : creditHistory.length === 0 ? (
                    <div className={styles.emptyState}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(24, 201, 139, 0.4)" strokeWidth="1.5">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        <p>{t('creditHistory.noTransactions', 'No credit transactions found.')}</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.tableWrapper}>
                            <table className={styles.historyTable}>
                                <thead>
                                    <tr>
                                        <th>{t('creditHistory.dateTime', 'Date & Time')}</th>
                                        <th>{t('dashboard.type', 'Type')}</th>
                                        <th>{t('creditHistory.amount', 'Amount')}</th>
                                        <th>{t('creditHistory.description', 'Description')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item.id} className={styles.tableRow}>
                                            <td className={styles.dateTimeCell}>
                                                {formatDateTime(item.created_at)}
                                            </td>
                                            <td>
                                                <span className={`${styles.badge} ${item.transaction_type === 'add' ? styles.badgeAdd : styles.badgeDeduct}`}>
                                                    {item.transaction_type === 'add' ? t('creditHistory.credit', 'Credit') : t('creditHistory.debit', 'Debit')}
                                                </span>
                                            </td>
                                            <td className={`${styles.amountCell} ${item.transaction_type === 'add' ? styles.amountAdd : styles.amountDeduct}`}>
                                                {item.transaction_type === 'add' ? `+${item.amount}` : `-${item.amount}`}
                                            </td>
                                            <td className={styles.descCell}>
                                                {item.description || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    type="button"
                                    className={styles.paginationButton}
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    {t('common.previous', 'Previous')}
                                </button>
                                <span className={styles.paginationInfo}>
                                    {t('common.page', 'Page')} {currentPage} {t('common.of', 'of')} {totalPages}
                                </span>
                                <button
                                    type="button"
                                    className={styles.paginationButton}
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    {t('common.next', 'Next')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
