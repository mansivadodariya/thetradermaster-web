'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from './tradeSnap.module.scss';
import { ClockIcon, ChartIcon, EyeIcon } from '@/icons/tradeSnapIcons';

function formatSymbol(symbol) {
    if (!symbol) return 'Unknown';
    return String(symbol).split(' - ')[0].split(' LTD')[0];
}

function formatValue(val) {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'object') {
        if (val.price !== undefined) return String(val.price);
        if (val.value !== undefined) return String(val.value);
        if (val.label !== undefined) return String(val.label);
        return String(val.price || val.value || JSON.stringify(val));
    }
    const str = String(val).trim();
    if (!str || str.toLowerCase() === 'null' || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'nan') return '-';
    return str;
}

/** e.g. future_sell → Future Sell, no_trade → No Trade */
function formatTradeCall(tradeCall) {
    if (!tradeCall) return '—';
    const raw = String(tradeCall).trim();
    if (!raw) return '—';

    return raw
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default function AnalysisResultItem({
 trade, index, onViewDetails, onDelete }) {
    const { t } = useLanguage();
    if (!trade) return null;
    const call = (trade.trade_call || trade.signal_type || trade.action || '').toLowerCase();
    const isBuy = call.includes('buy');
    const isSell = call.includes('sell');
    const isNoTrade = call.includes('no_trade') || call === 'neutral' || (!isBuy && !isSell);
    const confidence = parseInt(trade?.confidence, 10) || 0;

    const confidenceClass =
        confidence >= 70 ? styles.confidenceHigh : confidence >= 40 ? styles.confidenceMid : styles.confidenceLow;

    const ringOffset = 2 * Math.PI * 34 * (1 - confidence / 100);

    const supportVal = formatValue(trade?.Support_price || trade?.support_price || trade?.support);
    const resistanceVal = formatValue(trade?.Resistance_price || trade?.resistance_price || trade?.resistance);
    const hasSr = supportVal !== '-' || resistanceVal !== '-';

    return (
        <motion.article
            className={styles.resultCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index || 0) * 0.08 }}
        >
            <div className={styles.resultHeader}>
                <div>
                    <div className={styles.resultTitleRow}>
                        <h3>{formatSymbol(trade?.symbol || trade?.pair)}</h3>
                        {(trade.Trade || trade.trade_type) && (
                            <span className={styles.tradeTypeBadge}>{String(trade.Trade || trade.trade_type).toUpperCase()}</span>
                        )}
                        <span className={styles.timeframeBadge}>
                            <ClockIcon />
                            {trade?.timeframe || trade?.Timeframe || 'M15'}
                        </span>
                    </div>
                    <div
                        className={`${styles.signalPill} ${isBuy ? styles.signalBuy : isSell ? styles.signalSell : styles.signalNeutral}`}
                    >
                        {isBuy && <img src="/assets/images/bull.png" alt="Bull" className={styles.miniSignalImg} />}
                        {isSell && <img src="/assets/images/bear.png" alt="Bear" className={styles.miniSignalImg} />}
                        {isNoTrade && <ChartIcon />}
                        <span>{formatTradeCall(trade?.trade_call || trade?.signal_type || 'No Trade')}</span>
                    </div>
                </div>

                <div className={styles.confidenceWrap}>
                    <div className={`${styles.confidenceRing} ${confidenceClass}`}>
                        <svg viewBox="0 0 80 80" aria-hidden="true">
                            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="6" />
                            <motion.circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="6"
                                strokeDasharray={2 * Math.PI * 34}
                                strokeDashoffset={ringOffset}
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                                animate={{ strokeDashoffset: ringOffset }}
                                transition={{ duration: 0.8 }}
                            />
                        </svg>
                        <span>{confidence}%</span>
                    </div>
                    <span className={`${styles.confidenceLabel} ${confidenceClass}`}>{t('tradeSnap.confidence', 'Confidence')}</span>
                </div>
            </div>

            {/* Result Body */}
            <div className={styles.resultBody}>
                {!isNoTrade ? (
                    <>
                        <div className={styles.detailGrid}>
                            <div className={styles.detailBox}>
                                <span>{t('tradeSnap.entryPrice', 'Entry Price')}</span>
                                <strong>{formatValue(trade?.entry?.split('(')[0].trim())}</strong>
                            </div>
                            <div className={styles.detailBox}>
                                <span>{t('tradeSnap.stopLoss', 'Stop Loss')}</span>
                                <strong className={styles.lossText}>{formatValue(trade.stop_loss)}</strong>
                            </div>
                        </div>

                        <div className={styles.targetsGrid}>
                            <div className={styles.targetsBox}>
                                <span className={styles.targetsLabel}>{t('tradeSnap.targets', 'TARGETS')}</span>
                                <div className={styles.targetsList}>
                                    {Object.entries(trade?.targets || trade?.Targets || {}).map(([key, value], i) => {
                                        const formattedVal = formatValue(value);
                                        return formattedVal !== '-' ? (
                                            <div key={key} className={styles.targetRow}>
                                                <span>{t('tradeSnap.targetNumber', 'Target')} {i + 1}</span>
                                                <strong className={styles.profitText}>{formattedVal}</strong>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                            {hasSr && (
                                <div className={styles.srColumn}>
                                    <div className={styles.detailBox}>
                                        <span>{t('tradeSnap.support', 'Support')}</span>
                                        <strong>{supportVal}</strong>
                                    </div>
                                    <div className={styles.detailBox}>
                                        <span>{t('tradeSnap.resistance', 'Resistance')}</span>
                                        <strong>{resistanceVal}</strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={styles.noTradeSummaryBox}>
                        <div className={styles.noTradeText}>
                            <span className={styles.noTradeDot} />
                            <span>
                                {trade.rationale
                                    ? (trade.rationale.length > 130 ? `${trade.rationale.substring(0, 130)}...` : trade.rationale)
                                    : 'Market structure consolidation. No high-conviction directional setup detected.'}
                            </span>
                        </div>
                        {hasSr && (
                            <div className={styles.compactSrRow}>
                                <div className={styles.compactSrItem}>
                                    <span>{t('tradeSnap.support', 'Support:')}</span>
                                    <strong>{supportVal}</strong>
                                </div>
                                <div className={styles.compactSrItem}>
                                    <span>{t('tradeSnap.resistance', 'Resistance:')}</span>
                                    <strong>{resistanceVal}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Dedicated Card Footer Action Bar */}
            <div className={styles.resultCardFooter}>
                {onViewDetails && (
                    <button
                        type="button"
                        className={styles.viewDetailsBtn}
                        onClick={() => onViewDetails(trade)}
                    >
                        <EyeIcon />
                        <span>{t('tradeSnap.viewDetailedAnalysis', 'View Detailed Analysis')}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.btnArrow}>
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
                {onDelete && (
                    <button
                        type="button"
                        className={styles.deleteResultBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        title={t('common.delete', 'Delete Analysis')}
                        aria-label="Delete Analysis"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                )}
            </div>
        </motion.article>
    );
}
