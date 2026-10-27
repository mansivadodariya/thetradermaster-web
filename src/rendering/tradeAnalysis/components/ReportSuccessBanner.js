'use client';

import React from 'react';
import styles from '../tradeAnalysis.module.scss';
import { useLanguage } from '@/context/LanguageContext';
import { CheckIcon, UploadIcon, DownloadIcon } from '@/icons/tradeAnalysisIcons';

export default function ReportSuccessBanner({
    fileDetails,
    totalTradesCount,
    onViewTrades,
    onReupload,
    onDownloadReport,
    isExporting = false
}) {
    const { t } = useLanguage();

    return (
        <div className={styles.reportSuccessBannerCard}>
            <div className={styles.bannerContentLeft}>
                <div className={styles.bannerFileMetaRow}>
                    <div className={`${styles.fileBadgeBox} ${fileDetails.badgeClass}`}>
                        <span>{fileDetails.ext}</span>
                    </div>
                    <div className={styles.fileMetaDetails}>
                        <span className={styles.fileName}>
                            {fileDetails.name}
                        </span>
                        <span className={styles.fileSub}>
                            {fileDetails.sizeText} • {totalTradesCount} {t('tradeAnalysis.tradesUnit', 'trades')} • {t('tradeAnalysis.uploadedJustNow', 'Uploaded just now')}
                        </span>
                    </div>
                </div>

                <div className={styles.bannerMessageRow}>
                    <div className={styles.checkTitleGroup}>
                        <div className={styles.checkCircle}>
                            <CheckIcon />
                        </div>
                        <h3>{t('tradeAnalysis.aiProcessedSuccess', 'AI has successfully processed your report!')}</h3>
                    </div>
                    <p className={styles.bannerSubtext}>
                        {t('tradeAnalysis.foundTradesCount', 'We found {{count}} trades in your report.', { count: totalTradesCount })}
                    </p>
                </div>

                <div className={styles.bannerActionsRow}>
                    <button
                        type="button"
                        className={styles.viewTradesBtn}
                        onClick={onViewTrades}
                    >
                        {t('tradeAnalysis.viewTrades', 'VIEW TRADES')}
                    </button>
                    <button
                        type="button"
                        className={styles.reuploadBtn}
                        onClick={onReupload}
                    >
                        <UploadIcon />
                        <span>{t('tradeAnalysis.uploadNewStatement', 'Upload New Statement')}</span>
                    </button>
                    <button
                        type="button"
                        className={styles.downloadReportBtn}
                        onClick={onDownloadReport}
                        disabled={isExporting}
                        title="Download Complete Statement Audit Report (PDF)"
                    >
                        <DownloadIcon />
                        <span>{isExporting ? t('tradeAnalysis.exportingPdf', 'Generating PDF...') : t('tradeAnalysis.downloadReport', 'Download Report')}</span>
                    </button>
                </div>
            </div>

            <div className={styles.bannerGraphicRight}>
                <img src="/assets/images/brain.png" alt="AI Brain Analysis" className={styles.brainImg} />
            </div>
        </div>
    );
}

