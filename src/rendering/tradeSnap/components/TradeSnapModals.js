'use client';

import React, { useRef } from 'react';
import Modal from '../Modal';
import Loader from '@/components/loader';
import AnalysisResultItem from '../AnalysisResultItem';
import AiSnapDashboard from './AiSnapDashboard';
import { DownloadIcon } from '@/icons/aiSnapIcons';
import { useTradeSnapExport } from '../hooks/useTradeSnapExport';
import styles from '../tradeSnap.module.scss';

export default function TradeSnapModals({
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedAnalysis,
    historyOpen,
    setHistoryOpen,
    historyLoading,
    historyItems,
    openDetailModal,
    handleDeleteHistoryItem,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    confirmDeleteHistoryItem,
    t
}) {
    const modalDashboardRef = useRef(null);
    const { exportToPdf, isExporting } = useTradeSnapExport();

    const handleDownloadModalPdf = () => {
        const analysis = selectedAnalysis?.analysis || selectedAnalysis || {};
        const symbol = analysis.symbol || analysis.Symbol || selectedAnalysis?.symbol || 'XAUUSD';
        const timeframe = analysis.timeframe || analysis.Timeframe || selectedAnalysis?.timeframe || 'M15';
        exportToPdf(modalDashboardRef.current, symbol, timeframe);
    };

    return (
        <>
            <Modal
                open={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                size="large"
                title="AI Snap Technical Analysis Dashboard"
                description="State-of-the-art AI market diagnosis and trade signal setup"
                headerActions={
                    <button
                        type="button"
                        className={styles.modalDownloadBtn}
                        onClick={handleDownloadModalPdf}
                        disabled={isExporting}
                        title="Download Complete AI Analysis Report (PDF)"
                    >
                        <DownloadIcon size={14} />
                        <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
                    </button>
                }
            >
                {selectedAnalysis && (
                    <div ref={modalDashboardRef}>
                        <AiSnapDashboard rawData={selectedAnalysis} />
                    </div>
                )}
            </Modal>

            <Modal
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                title={t('tradeSnap.historyTitle', 'AI Trade History')}
                description={t('tradeSnap.historyDesc', 'Your AI Trade analyses')}
            >
                {historyLoading ? (
                    <div className={styles.loadingBox}>
                        <Loader centered />
                    </div>
                ) : historyItems.length === 0 ? (
                    <div className={styles.recentEmpty}>
                        <p>{t('tradeSnap.noHistoryYet', 'No analysis history yet.')}</p>
                    </div>
                ) : (
                    <div className={styles.historyList}>
                        {historyItems.map((item, index) => {
                            const tradeObj = (Array.isArray(item?.data) && item.data.length > 0)
                                ? item.data[0]
                                : (item?.analysis_data || item);
                            return (
                                <AnalysisResultItem
                                    key={item.id || index}
                                    trade={tradeObj}
                                    onViewDetails={() => {
                                        setHistoryOpen(false);
                                        openDetailModal(tradeObj);
                                    }}
                                    onDelete={item.id || item.deleteId ? () => handleDeleteHistoryItem(item) : null}
                                />
                            );
                        })}
                    </div>
                )}
            </Modal>

            {confirmDeleteOpen && (
                <div
                    className={styles.modalOverlay}
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setConfirmDeleteOpen(false)}
                >
                    <div
                        className={styles.deleteConfirmModalBox}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className={styles.deleteModalCloseBtn}
                            onClick={() => setConfirmDeleteOpen(false)}
                            aria-label={t('tradeSnap.close', 'Close')}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <div className={styles.deleteIconBadge}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>

                        <h3 className={styles.deleteConfirmTitle}>
                            {t('tradeSnap.confirmDeleteTitle', 'Delete Analysis')}
                        </h3>

                        <p className={styles.deleteConfirmMessage}>
                            {t('tradeSnap.confirmDeleteBody', 'Are you sure you want to delete this analysis? This action cannot be undone.')}
                        </p>

                        <div className={styles.deleteConfirmActions}>
                            <button
                                type="button"
                                className={styles.deleteCancelBtn}
                                onClick={() => setConfirmDeleteOpen(false)}
                            >
                                {t('tradeSnap.cancel', 'Cancel')}
                            </button>
                            <button
                                type="button"
                                className={styles.deleteConfirmBtn}
                                onClick={confirmDeleteHistoryItem}
                            >
                                {t('tradeSnap.delete', 'Delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
