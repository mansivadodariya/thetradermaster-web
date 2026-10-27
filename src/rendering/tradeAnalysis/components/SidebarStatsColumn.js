'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../tradeAnalysis.module.scss';
import { BarChartIcon, formatCurrency } from '@/icons/tradeAnalysisIcons';

export default function SidebarStatsColumn({
    brokerMeta = {},
    files = [],
    totalTradesCount,
    winRateVal,
    netProfitVal,
    payoffRatio,
    largestWin,
    largestLoss,
    profitFactor,
    avgHoldingTime,
    reqBreakevenWinRate,
    avgProfitPerTrade,
    avgWinningTrade,
    avgLosingTrade,
    actualLosingTrades = [],
    maxConsecutiveWins,
    maxConsecutiveLosses
}) {
    const { t } = useLanguage();

    return (
        <div className={styles.sidebarColumn}>
            {/* Dynamic Analysis Overview Card */}
            <div className={styles.overviewCard}>
                <div className={styles.cardHeaderRow}>
                    <h3>{t('tradeAnalysis.analysisOverview', 'Analysis Overview')}</h3>
                </div>

                <div className={styles.overviewGrid}>
                    <div className={styles.overviewStatItem}>
                        <span className={styles.statLabel}>{t('tradeAnalysis.totalReports', 'Total Reports')}</span>
                        <span className={styles.statVal}>{brokerMeta.files_count || (files.length ? files.length : 1)}</span>
                    </div>

                    <div className={styles.overviewStatItem}>
                        <span className={styles.statLabel}>{t('tradeAnalysis.totalTrades', 'Total Trades')}</span>
                        <span className={styles.statVal}>{totalTradesCount}</span>
                    </div>

                    <div className={styles.overviewStatItem}>
                        <span className={styles.statLabel}>{t('tradeAnalysis.winRate', 'Win Rate')}</span>
                        <span className={`${styles.statVal} ${styles.gold}`}>{winRateVal.toFixed(1)}%</span>
                    </div>

                    <div className={styles.overviewStatItem}>
                        <span className={styles.statLabel}>{t('tradeAnalysis.totalPnl', 'Total P&L')}</span>
                        <span className={`${styles.statVal} ${netProfitVal >= 0 ? styles.green : styles.red}`}>
                            {formatCurrency(netProfitVal)}
                        </span>
                    </div>

                    <div className={styles.overviewStatItem}>
                        <span className={styles.statLabel}>{t('tradeAnalysis.avgRr', 'Avg. R:R')}</span>
                        <span className={styles.statVal}>{payoffRatio?.split(':')[0] || '1.5'}</span>
                    </div>

                    <div className={styles.overviewStatItem}>
                        <span className={styles.statLabel}>{t('tradeAnalysis.largestWin', 'Largest Win')}</span>
                        <span className={`${styles.statVal} ${styles.green}`}>{formatCurrency(largestWin)}</span>
                    </div>

                    <div className={styles.overviewStatItem}>
                        <span className={styles.statLabel}>{t('tradeAnalysis.largestLoss', 'Largest Loss')}</span>
                        <span className={`${styles.statVal} ${largestLoss < 0 ? styles.red : styles.green}`}>
                            {largestLoss < 0 ? formatCurrency(largestLoss) : '$0.00'}
                        </span>
                    </div>

                    <div className={styles.overviewStatItem}>
                        <span className={styles.statLabel}>{t('tradeAnalysis.profitFactor', 'Profit Factor')}</span>
                        <span className={styles.statVal}>{profitFactor.toFixed(2)}</span>
                    </div>

                    <div className={styles.overviewStatItem}>
                        <span className={styles.statLabel}>{t('tradeAnalysis.avgHolding', 'Avg Holding')}</span>
                        <span className={styles.statVal}>{avgHoldingTime}</span>
                    </div>
                </div>
            </div>

            {/* BASIC TRADING STATS CARD */}
            <div className={styles.basicStatsCard}>
                <div className={styles.tableSectionHeader}>
                    <BarChartIcon />
                    <h3>{t('tradeAnalysis.basicStats', 'Basic Trading Stats')}</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>{t('tradeAnalysis.metric', 'Metric')}</th>
                            <th>{t('tradeAnalysis.result', 'Result')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{t('tradeAnalysis.profitFactor', 'Profit Factor')}</td>
                            <td>{profitFactor.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>{t('tradeAnalysis.payoffRatio', 'Payoff Ratio (Win/Loss)')}</td>
                            <td>{payoffRatio}</td>
                        </tr>
                        <tr>
                            <td>{t('tradeAnalysis.breakevenWinRate', 'Required Breakeven Win Rate')}</td>
                            <td>{reqBreakevenWinRate}</td>
                        </tr>
                        <tr>
                            <td>{t('tradeAnalysis.avgProfitPerTrade', 'Average Profit/Trade')}</td>
                            <td className={styles.greenText}>{formatCurrency(avgProfitPerTrade)}</td>
                        </tr>
                        <tr>
                            <td>{t('tradeAnalysis.avgWinningTrade', 'Average Winning Trade')}</td>
                            <td className={styles.greenText}>{formatCurrency(avgWinningTrade)}</td>
                        </tr>
                        <tr>
                            <td>{t('tradeAnalysis.avgLosingTrade', 'Average Losing Trade')}</td>
                            <td className={styles.redText}>{formatCurrency(avgLosingTrade)}</td>
                        </tr>
                        <tr>
                            <td>{t('tradeAnalysis.bestTrade', 'Best Trade')}</td>
                            <td className={styles.greenText}>{formatCurrency(largestWin)}</td>
                        </tr>
                        <tr>
                            <td>{t('tradeAnalysis.worstTrade', 'Worst Trade')}</td>
                            <td className={actualLosingTrades.length > 0 ? styles.redText : styles.greenText}>
                                {actualLosingTrades.length > 0 ? formatCurrency(largestLoss) : '$0.00'}
                            </td>
                        </tr>
                        <tr>
                            <td>{t('tradeAnalysis.maxConsecutiveWins', 'Max Consecutive Wins')}</td>
                            <td>{maxConsecutiveWins} {t('tradeAnalysis.tradesUnit', 'trades')}</td>
                        </tr>
                        <tr>
                            <td>{t('tradeAnalysis.maxConsecutiveLosses', 'Max Consecutive Losses')}</td>
                            <td>{maxConsecutiveLosses} {t('tradeAnalysis.tradesUnit', 'trades')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
