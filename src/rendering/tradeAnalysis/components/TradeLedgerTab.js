'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../tradeAnalysis.module.scss';
import { SparklesIcon, formatCurrency } from '@/icons/tradeAnalysisIcons';

export default function TradeLedgerTab({
    filteredTrades = [],
    analyzingTradeId,
    handleAnalyzeIndividualTrade
}) {
    const { t } = useLanguage();

    return (
        <div className={styles.dataTableCard}>
            <div className={styles.tableSectionHeader}>
                <h3>{t('tradeAnalysis.ledgerTitle', 'Normalized Trades Ledger')} ({filteredTrades.length})</h3>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>{t('tradeAnalysis.dateTime', 'Date & Time')}</th>
                        <th>{t('tradeAnalysis.symbol', 'Symbol')}</th>
                        <th>{t('tradeAnalysis.side', 'Side')}</th>
                        <th>{t('tradeAnalysis.lots', 'Lots')}</th>
                        <th>{t('tradeAnalysis.entryPrice', 'Entry Price')}</th>
                        <th>{t('tradeAnalysis.outcome', 'Outcome')}</th>
                        <th>{t('tradeAnalysis.netPnl', 'Net PnL')}</th>
                        <th>{t('tradeAnalysis.action', 'Action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTrades.map((tItem, i) => {
                        const tId = tItem.trade_id || tItem.id || tItem.ticket || tItem.ticket_id || `trade_${i + 1}`;
                        const isAnalyzing = analyzingTradeId === tId;

                        return (
                            <tr key={i}>
                                <td>{tItem.date} {tItem.time}</td>
                                <td className={styles.symbolCell}>{tItem.symbol}</td>
                                <td className={(tItem.side || '').toUpperCase() === 'BUY' ? styles.greenText : styles.redText}>
                                    {tItem.side || 'BUY'}
                                </td>
                                <td>{tItem.quantity ?? '0.1'}</td>
                                <td>{tItem.entry_price ?? '—'}</td>
                                <td className={Number(tItem.pnl) >= 0 ? styles.greenText : styles.redText}>
                                    {tItem.outcome || (Number(tItem.pnl) >= 0 ? t('tradeAnalysis.win', 'WIN') : t('tradeAnalysis.loss', 'LOSS'))}
                                </td>
                                <td className={Number(tItem.pnl) >= 0 ? styles.greenText : styles.redText}>
                                    {formatCurrency(tItem.pnl)}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className={styles.rowAnalyzeBtn}
                                        onClick={() => handleAnalyzeIndividualTrade(tItem, i)}
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing ? (
                                            <span>{t('tradeAnalysis.analyzing', 'Analyzing...')}</span>
                                        ) : (
                                            <>
                                                <SparklesIcon />
                                                <span>{t('tradeAnalysis.analyze', 'Analyze')}</span>
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
