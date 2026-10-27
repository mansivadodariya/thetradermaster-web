'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../dashboard.module.scss';

export default function DashboardStatsCards({
    loading,
    stats,
    totalAccountCredits,
    handleExportPdf,
    router
}) {
    const { t } = useLanguage();

    return (
        <div className={styles.dailyStatsSideCard}>
            <div className={styles.dailyStatsHeader}>
                <div className={styles.headerTitleWrap}>
                    <span>{t('dashboard.statsHeader', 'AI Usage & Credits')}</span>
                    <button type="button" className={styles.infoBtn} title={t('dashboard.telemetryInfo', 'AI Telemetry & Credit Info')}>i</button>
                </div>
                <button type="button" className={styles.shareBtn} title={t('dashboard.exportPdfTooltip', 'Export Telemetry PDF')} onClick={handleExportPdf}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                </button>
            </div>

            <div className={styles.dailyStatsRows}>
                {/* Box 1: AI Chart Scanner */}
                <div className={styles.statPillRow} onClick={() => router.push('/chart-scanner')}>
                    <div className={styles.rowTopHeader}>
                        <div className={styles.rowTitleWrap}>
                            <span className={styles.rowTitle}>{t('dashboard.scannerCardTitle', 'AI Chart Scanner')}</span>
                            <span className={styles.rowDesc}>{t('dashboard.scannerCardDesc', 'Automated pattern recognition & OCR scans')}</span>
                        </div>
                        <div className={`${styles.rowIconWrap} ${styles.greenIcon}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" fill="currentColor" fillOpacity="0.2" />
                            </svg>
                        </div>
                    </div>

                    <div className={styles.bigNumWrap}>
                        {loading && !stats ? (
                            <span className={`${styles.skeletonPulse} ${styles.skeletonStatNum}`} />
                        ) : (
                            <span className={styles.statBigNum}>{stats?.total_analysis_history ?? 0}</span>
                        )}
                    </div>

                    <div className={styles.rowCtaLink}>
                        <span>{t('dashboard.launchScanner', 'Launch Scanner')}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Box 2: AI Market Assistant */}
                <div className={styles.statPillRow} onClick={() => router.push('/market-assistant?tab=chat')}>
                    <div className={styles.rowTopHeader}>
                        <div className={styles.rowTitleWrap}>
                            <span className={styles.rowTitle}>{t('dashboard.assistantCardTitle', 'AI Market Assistant')}</span>
                            <span className={styles.rowDesc}>{t('dashboard.assistantCardDesc', '24/7 neural market & trade assistant')}</span>
                        </div>
                        <div className={`${styles.rowIconWrap} ${styles.greenIcon}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="8" width="18" height="12" rx="4" />
                                <path d="M12 2v6" />
                                <circle cx="8.5" cy="13.5" r="1.5" fill="currentColor" />
                                <circle cx="15.5" cy="13.5" r="1.5" fill="currentColor" />
                                <path d="M9 17h6" />
                            </svg>
                        </div>
                    </div>

                    <div className={styles.bigNumWrap}>
                        {loading && !stats ? (
                            <span className={`${styles.skeletonPulse} ${styles.skeletonStatNum}`} />
                        ) : (
                            <span className={styles.statBigNum}>{stats?.total_chat_history ?? 0}</span>
                        )}
                    </div>

                    <div className={styles.rowCtaLink}>
                        <span>{t('dashboard.openAssistant', 'Open Market Assistant')}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Box 3: Available AI Credits */}
                <div className={styles.statPillRow} onClick={() => router.push('/credit-history')}>
                    <div className={styles.rowTopHeader}>
                        <div className={styles.rowTitleWrap}>
                            <span className={styles.rowTitle}>{t('dashboard.availableCredits', 'Available Credits')}</span>
                            <span className={styles.rowDesc}>{t('dashboard.availableCreditsDesc', 'Ready for real-time AI strategy execution')}</span>
                        </div>
                        <div className={`${styles.rowIconWrap} ${styles.greenIcon}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.25" />
                            </svg>
                        </div>
                    </div>

                    <div className={styles.bigNumWrap}>
                        {loading && !stats ? (
                            <span className={`${styles.skeletonPulse} ${styles.skeletonStatNum}`} />
                        ) : (
                            <span className={styles.statBigNum}>{stats?.available_credits ?? 0}</span>
                        )}
                    </div>

                    <div className={styles.rowCtaLink}>
                        <span>{t('dashboard.manageRecharge', 'Manage & Recharge')}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Box 4: Withdrawable Balance */}
                <div className={styles.statPillRow} onClick={() => router.push('/affiliate')}>
                    <div className={styles.rowTopHeader}>
                        <div className={styles.rowTitleWrap}>
                            <span className={styles.rowTitle}>{t('dashboard.withdrawableBalance', 'Withdrawable Balance')}</span>
                            <span className={styles.rowDesc}>{t('dashboard.withdrawableBalanceDesc', 'Affiliate earnings available for withdrawal')}</span>
                        </div>
                        <div className={`${styles.rowIconWrap} ${styles.greenIcon}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="6" width="20" height="13" rx="2" fill="currentColor" fillOpacity="0.2" />
                                <path d="M16 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" />
                                <path d="M6 6V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2" />
                            </svg>
                        </div>
                    </div>

                    <div className={styles.bigNumWrap}>
                        {loading && !stats ? (
                            <span className={`${styles.skeletonPulse} ${styles.skeletonStatNum}`} />
                        ) : (
                                <span className={styles.statBigNum}>
                                    $
                                    {Number(
                                        stats?.wallet?.withdrawable_balance ??
                                        stats?.withdrawable_balance ??
                                        0
                                    ).toFixed(2)}
                                </span>
                        )}
                    </div>

                    <div className={styles.rowCtaLink}>
                        <span>{t('dashboard.viewWallet', 'View Wallet')}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
