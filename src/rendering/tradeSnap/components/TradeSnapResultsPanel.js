'use client';

import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon } from '@/icons/tradeSnapIcons';
import { DownloadIcon } from '@/icons/aiSnapIcons';
import { useLanguage } from '@/context/LanguageContext';
import AiSnapDashboard from './AiSnapDashboard';
import { useTradeSnapExport } from '../hooks/useTradeSnapExport';
import styles from '../tradeSnap.module.scss';

export default function TradeSnapResultsPanel({
    isAnalyzing,
    allAnalyses,
    error,
    retryAnalysis
}) {
    const resultsContainerRef = useRef(null);
    const { exportToPdf, isExporting } = useTradeSnapExport();
    const { t, language } = useLanguage();
    const activeLang = language || 'en';

    const activeFirstTrade = allAnalyses?.[0]?.data?.[0];
    const tradeTextToTranslate = useMemo(() => {
        if (!activeFirstTrade) return '';
        const trade = activeFirstTrade?.analysis || activeFirstTrade;
        const verdict = trade?.market_assessment?.verdict || trade?.trade_call || '';
        const rationale = trade?.trade_decision?.rationale || trade?.rationale || '';
        return [verdict, rationale].filter(Boolean).join('\n\n') || 'AI Market Analysis';
    }, [activeFirstTrade]);

    const handleDownloadPdf = () => {
        const firstTrade = allAnalyses?.[0]?.data?.[0];
        const symbol = firstTrade?.symbol || firstTrade?.Symbol || firstTrade?.data?.pair || 'MARKET';
        const timeframe = firstTrade?.timeframe || firstTrade?.Timeframe || firstTrade?.data?.timeframe || 'M15';
        exportToPdf(resultsContainerRef.current, symbol, timeframe);
    };

    if (isAnalyzing) {
        return null;
    }

    return (
        <div className={styles.resultsColumn}>
            <div className={styles.resultsPanel} data-lenis-prevent="true">
                <div className={styles.resultsHeader}>
                    <div className={styles.resultsHeaderRow}>
                        <h3>{t('tradeSnap.analysisResults', 'Analysis Results')}</h3>
                        <div className={styles.resultsHeaderActions}>
                            {isAnalyzing && (
                                <div className={styles.liveEngineBadge}>
                                    <span className={styles.pulseDot} />
                                    <span>{t('tradeSnap.quantEngineLive', 'AI QUANT ENGINE LIVE')}</span>
                                </div>
                            )}
                            {!isAnalyzing && allAnalyses && allAnalyses.length > 0 && (
                                <button
                                    type="button"
                                    className={styles.headerDownloadBtn}
                                    onClick={handleDownloadPdf}
                                    disabled={isExporting}
                                    title="Download Complete AI Analysis Report (PDF)"
                                >
                                    <DownloadIcon size={14} />
                                    <span>{isExporting ? t('tradeSnap.exporting', 'Exporting...') : t('tradeSnap.downloadPdf', 'Download PDF')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.resultsBody} data-lenis-prevent="true">
                    <AnimatePresence mode="wait">
                        {/* 1. Failure & Retry State Card on Error */}
                        {error && !isAnalyzing && (
                            <motion.div
                                key="error"
                                className={styles.analysisErrorCard}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={styles.errorIconWrap}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                                <div className={styles.errorDetails}>
                                    <h4>Analysis Incomplete</h4>
                                    <p>{typeof error === 'string' ? error : 'Unable to complete AI chart scan. Please ensure the chart image is clearly visible.'}</p>
                                </div>
                                {retryAnalysis && (
                                    <button
                                        type="button"
                                        className={styles.retryPrimaryBtn}
                                        onClick={retryAnalysis}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="23 4 23 10 17 10" />
                                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                        </svg>
                                        <span>Retry Analysis</span>
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {/* 2. Smooth Transition to Analysis Results */}
                        {!isAnalyzing && allAnalyses && allAnalyses.length > 0 && (
                            <motion.div
                                key="results"
                                ref={resultsContainerRef}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className={styles.analysesListContainer}
                            >
                                {allAnalyses.map((analysis, analysisIndex) => {
                                    const dateLocale = activeLang === 'zh' ? 'zh-CN' : activeLang === 'ru' ? 'ru-RU' : activeLang === 'es' ? 'es-ES' : activeLang === 'ar' || activeLang === 'ary' ? 'ar-EG' : activeLang === 'vi' ? 'vi-VN' : activeLang === 'id' ? 'id-ID' : activeLang === 'fil' ? 'fil-PH' : 'en-US';
                                    const formatted = new Date(analysis.timestamp).toLocaleString(dateLocale, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    });
                                    return (
                                        <div key={`history-${analysisIndex}`} className={styles.historyGroup}>
                                            <div className={styles.historyTime}>
                                                <ClockIcon />
                                                {t('tradeSnap.analysisAt', 'Analysis at')} {formatted}
                                            </div>
                                            {analysis.data.map((trade, tradeIndex) => (
                                                <AiSnapDashboard
                                                    key={`trade-${analysisIndex}-${tradeIndex}`}
                                                    rawData={trade}
                                                    translation={translation}
                                                    activeLang={activeLang}
                                                />
                                            ))}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty State when no analyses and not analyzing */}
                    {(!allAnalyses || allAnalyses.length === 0) && !error && (
                        <div className={styles.resultsEmptyState}>
                            <div className={styles.emptyIconBox}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(24, 201, 139, 0.4)" strokeWidth="1.8">
                                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                                    <line x1="7" y1="12" x2="17" y2="12" />
                                </svg>
                            </div>
                            <h4>{isAnalyzing ? 'Scanning in Progress…' : 'No Active Analysis'}</h4>
                            <p>
                                {isAnalyzing
                                    ? 'The AI Quant Engine is currently analyzing your chart snapshot above.'
                                    : 'Capture a chart screenshot or upload an image and click Analyze to run the neural quant engine.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
