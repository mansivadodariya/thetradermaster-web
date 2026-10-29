'use client';

import React from 'react';
import styles from '../tradeAnalysis.module.scss';
import { useLanguage } from '@/context/LanguageContext';
import { useTradeAnalysisLocalization } from '../hooks/useTradeAnalysisLocalization';
import {
    CrosshairIcon,
    ClockIcon,
    ZapIcon,
    TargetIcon,
    HistoryIcon,
    LockIcon,
    BarChartIcon,
    SuccessCircleIcon,
    AlertTriangleIcon,
    ScaleIcon,
    SparklesIcon,
    DangerCircleIcon,
    formatCurrency
} from '@/icons/tradeAnalysisIcons';

export default function OverviewAnalyticsTab({
    entryAnalysis: rawEntryAnalysis,
    summary = {},
    trades = [],
    timeInsights: rawTimeInsights = {},
    quickAnalysis: rawQuickAnalysis = {},
    winRateVal,
    netProfitVal,
    avgWinningTrade,
    avgLosingTrade,
    handleAnalyzeIndividualTrade,
    setFilterSide,
    setActiveTab
}) {
    const { t } = useLanguage();
    const {
        localizedQuickAnalysis: quickAnalysis,
        localizedTimeInsights: timeInsights,
        localizedEntryAnalysis: entryAnalysis,
    } = useTradeAnalysisLocalization({
        quickAnalysis: rawQuickAnalysis,
        timeInsights: rawTimeInsights,
        entryAnalysis: rawEntryAnalysis,
    });

    return (
        <div className={styles.resultsTwoColumnGrid}>
            <div className={styles.resultsLeftCol}>
                {/* AI Entry & Execution Quality Analysis Card */}
                {entryAnalysis && (
                    <div className={styles.entryAnalysisCard}>
                        <div className={styles.entryCardHeader}>
                            <div className={styles.entryHeaderLeft}>
                                <div className={styles.entryIconBadge}>
                                    <CrosshairIcon />
                                </div>
                                <div>
                                    <div className={styles.titleWithBadge}>
                                        <h3>{t('tradeAnalysis.entryQualityTitle', 'AI Entry & Execution Quality Analysis')}</h3>
                                        {entryAnalysis.quality_rating && (
                                            <span className={`${styles.qualityBadge} ${String(entryAnalysis.quality_rating).toLowerCase() === 'strong' ? styles.qualityStrong : styles.qualityModerate}`}>
                                                <span className={styles.badgePulseDot} />
                                                {entryAnalysis.quality_rating} {t('tradeAnalysis.executionBadge', 'Execution')}
                                            </span>
                                        )}
                                    </div>
                                    <p className={styles.entrySub}>
                                        {t('tradeAnalysis.entrySub', 'Algorithmic evaluation of entry timing, chasing behaviors, session momentum & volatility risk.')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 6-Metric KPI Grid */}
                        <div className={styles.entryKpiGrid}>
                            <div className={styles.entryKpiCard}>
                                <div className={styles.kpiTop}>
                                    <div className={styles.kpiIconWrap}>
                                        <ClockIcon />
                                    </div>
                                    <span className={styles.kpiLabel}>{t('tradeAnalysis.optimalEntryWindow', 'Optimal Entry Window')}</span>
                                </div>
                                <div className={styles.kpiValueHighlight}>
                                    {entryAnalysis.optimal_entry_window || t('tradeAnalysis.sessionOpen', 'Session Open')}
                                </div>
                                <div className={styles.kpiSub}>{t('tradeAnalysis.peakLiquidity', 'Peak liquidity alignment')}</div>
                            </div>

                            <div className={styles.entryKpiCard}>
                                <div className={styles.kpiTop}>
                                    <div className={styles.kpiIconWrap}>
                                        <ZapIcon />
                                    </div>
                                    <span className={styles.kpiLabel}>{t('tradeAnalysis.lateEntryRate', 'Late Entry Rate')}</span>
                                </div>
                                <div className={`${styles.kpiValue} ${Number(entryAnalysis.late_entry_percentage) > 30 ? styles.amberText : styles.greenText}`}>
                                    {entryAnalysis.late_entry_percentage ?? 0}%
                                </div>
                                <div className={styles.kpiSub}>{t('tradeAnalysis.enteredPostExpansion', 'Trades entered post-expansion')}</div>
                            </div>

                            <div className={styles.entryKpiCard}>
                                <div className={styles.kpiTop}>
                                    <div className={styles.kpiIconWrap}>
                                        <TargetIcon />
                                    </div>
                                    <span className={styles.kpiLabel}>{t('tradeAnalysis.chasingTrades', 'Chasing Trades')}</span>
                                </div>
                                <div className={`${styles.kpiValue} ${Number(entryAnalysis.possible_chasing_trades) > 0 ? styles.redText : styles.greenText}`}>
                                    {entryAnalysis.possible_chasing_trades ?? 0}
                                </div>
                                <div className={styles.kpiSub}>{t('tradeAnalysis.fomoTriggers', 'FOMO / extended impulses')}</div>
                            </div>

                            <div className={styles.entryKpiCard}>
                                <div className={styles.kpiTop}>
                                    <div className={styles.kpiIconWrap}>
                                        <HistoryIcon />
                                    </div>
                                    <span className={styles.kpiLabel}>{t('tradeAnalysis.rapidReentries', 'Rapid Re-entries')}</span>
                                </div>
                                <div className={`${styles.kpiValue} ${Number(entryAnalysis.rapid_reentry_trades) > 0 ? styles.redText : styles.greenText}`}>
                                    {entryAnalysis.rapid_reentry_trades ?? 0}
                                </div>
                                <div className={styles.kpiSub}>{t('tradeAnalysis.revengeTrading', 'Revenge trading indicators')}</div>
                            </div>

                            <div className={styles.entryKpiCard}>
                                <div className={styles.kpiTop}>
                                    <div className={styles.kpiIconWrap}>
                                        <LockIcon />
                                    </div>
                                    <span className={styles.kpiLabel}>{t('tradeAnalysis.overtradingRisk', 'Overtrading Risk')}</span>
                                </div>
                                <div className={`${styles.kpiValue} ${entryAnalysis.potential_overtrading ? styles.redText : styles.greenText}`}>
                                    {entryAnalysis.potential_overtrading ? t('tradeAnalysis.highRisk', 'High Risk') : t('tradeAnalysis.protected', 'Protected (0)')}
                                </div>
                                <div className={styles.kpiSub}>{t('tradeAnalysis.volumeLoad', 'Volume & frequency load')}</div>
                            </div>

                            <div className={styles.entryKpiCard}>
                                <div className={styles.kpiTop}>
                                    <div className={styles.kpiIconWrap}>
                                        <BarChartIcon />
                                    </div>
                                    <span className={styles.kpiLabel}>{t('tradeAnalysis.avgDuration', 'Avg Duration')}</span>
                                </div>
                                <div className={styles.kpiValue}>
                                    {entryAnalysis.avg_trade_duration || t('tradeAnalysis.intraday', 'Intraday')}
                                </div>
                                <div className={styles.kpiSub}>{t('tradeAnalysis.holdingProfile', 'Holding cycle profile')}</div>
                            </div>
                        </div>

                        {/* Strategic Assessment & Volatility Context */}
                        <div className={styles.entryContextRow}>
                            {entryAnalysis.best_setup_condition && (
                                <div className={styles.setupConditionBox}>
                                    <div className={styles.boxTag}>
                                        <span className={styles.tagDot} />
                                        {t('tradeAnalysis.optimalSetup', 'OPTIMAL SETUP CONDITION')}
                                    </div>
                                    <h4>{entryAnalysis.best_setup_condition}</h4>
                                    {entryAnalysis.assessment && <p>{entryAnalysis.assessment}</p>}
                                </div>
                            )}

                            {entryAnalysis.volatility_performance && (
                                <div className={styles.volatilityBox}>
                                    <div className={styles.boxTag}>
                                        <span className={styles.tagDot} />
                                        {t('tradeAnalysis.volatilityEnv', 'VOLATILITY & NEWS ENVIRONMENT')}
                                    </div>
                                    <p className={styles.volatilityText}>{entryAnalysis.volatility_performance}</p>
                                    {entryAnalysis.news_event_summary && (
                                        <div className={styles.newsTagRow}>
                                            <span className={styles.newsLabel}>{t('tradeAnalysis.macroDrivers', 'Macro Drivers:')}</span>
                                            <span className={styles.newsEvents}>{entryAnalysis.news_event_summary}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Strengths & Execution Risks 2-Col Grid */}
                        <div className={styles.entryStrengthsRisksGrid}>
                            {Array.isArray(entryAnalysis.entry_strengths) && entryAnalysis.entry_strengths.length > 0 && (
                                <div className={styles.entryColBox}>
                                    <div className={styles.entryColHeader}>
                                        <div className={styles.colHeaderIconWrap}>
                                            <SuccessCircleIcon />
                                        </div>
                                        <h4>{t('tradeAnalysis.execStrengths', 'Execution Strengths')}</h4>
                                    </div>
                                    <div className={styles.entryItemsList}>
                                        {entryAnalysis.entry_strengths.map((st, sIdx) => (
                                            <div key={sIdx} className={styles.strengthItem}>
                                                <div className={styles.checkBulletBadge}>
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <span>{st}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {Array.isArray(entryAnalysis.entry_risks) && entryAnalysis.entry_risks.length > 0 && (
                                <div className={`${styles.entryColBox} ${styles.riskColBox}`}>
                                    <div className={styles.entryColHeader}>
                                        <div className={`${styles.colHeaderIconWrap} ${styles.riskHeaderIconWrap}`}>
                                            <AlertTriangleIcon />
                                        </div>
                                        <h4>{t('tradeAnalysis.entryRisks', 'Entry Risks & Noise Vulnerabilities')}</h4>
                                    </div>
                                    <div className={styles.entryItemsList}>
                                        {entryAnalysis.entry_risks.map((rk, rIdx) => (
                                            <div key={rIdx} className={styles.riskItem}>
                                                <div className={styles.riskBulletBadge}>
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                        <line x1="12" y1="9" x2="12" y2="13" />
                                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                                    </svg>
                                                </div>
                                                <span>{rk}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* BUY vs SELL Breakdown Table */}
                <div className={styles.buySellTableCard}>
                    <div className={styles.tableSectionHeader}>
                        <ScaleIcon />
                        <h3>{t('tradeAnalysis.buySellTitle', 'BUY vs SELL Breakdown')}</h3>
                    </div>
                    {/* Table View (Desktops & Tablets with Horizontal Scroll) */}
                    <div className={styles.buySellTableScroll}>
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('tradeAnalysis.typeHeader', 'Type')}</th>
                                    <th>{t('tradeAnalysis.tradesHeader', 'Trades')}</th>
                                    <th>{t('tradeAnalysis.winRateHeader', 'Win Rate')}</th>
                                    <th>{t('tradeAnalysis.grossProfitHeader', 'Gross Profit')}</th>
                                    <th>{t('tradeAnalysis.netProfitHeader', 'Net Profit')}</th>
                                    <th>{t('tradeAnalysis.avgProfitHeader', 'Avg Profit/Trade')}</th>
                                    <th>{t('tradeAnalysis.actionHeader', 'Action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>BUY</td>
                                    <td>{summary.buy_stats?.trades ?? summary.buy_trades_count ?? trades.filter(t => (t.side || '').toUpperCase() === 'BUY').length}</td>
                                    <td>{summary.buy_stats?.win_rate ?? '100.0'}%</td>
                                    <td>+$0.00</td>
                                    <td className={styles.profitCell}>
                                        {formatCurrency(summary.buy_stats?.net_profit ?? summary.buy_net_pnl ?? 0)}
                                    </td>
                                    <td>{formatCurrency(summary.buy_stats?.avg_profit_per_trade ?? ((summary.buy_stats?.trades || 1) ? (summary.buy_stats?.net_profit || 0) / (summary.buy_stats?.trades || 1) : 0))}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className={styles.tableAnalyzeBtn}
                                            onClick={() => {
                                                const firstBuyTrade = trades.find(t => (t.side || '').toUpperCase() === 'BUY');
                                                if (firstBuyTrade) {
                                                    handleAnalyzeIndividualTrade(firstBuyTrade);
                                                } else {
                                                    setFilterSide('BUY');
                                                    setActiveTab('ledger');
                                                }
                                            }}
                                        >
                                            <SparklesIcon />
                                            <span>{t('tradeAnalysis.analyzeBuy', 'Analyze BUY')}</span>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>SELL</td>
                                    <td>{summary.sell_stats?.trades ?? summary.sell_trades_count ?? trades.filter(t => (t.side || '').toUpperCase() === 'SELL').length}</td>
                                    <td>{summary.sell_stats?.win_rate ?? '100.0'}%</td>
                                    <td>+$0.00</td>
                                    <td className={styles.profitCell}>
                                        {formatCurrency(summary.sell_stats?.net_profit ?? summary.sell_net_pnl ?? 0)}
                                    </td>
                                    <td>{formatCurrency(summary.sell_stats?.avg_profit_per_trade ?? ((summary.sell_stats?.trades || 1) ? (summary.sell_stats?.net_profit || 0) / (summary.sell_stats?.trades || 1) : 0))}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className={styles.tableAnalyzeBtn}
                                            onClick={() => {
                                                const firstSellTrade = trades.find(t => (t.side || '').toUpperCase() === 'SELL');
                                                if (firstSellTrade) {
                                                    handleAnalyzeIndividualTrade(firstSellTrade);
                                                } else {
                                                    setFilterSide('SELL');
                                                    setActiveTab('ledger');
                                                }
                                            }}
                                        >
                                            <SparklesIcon />
                                            <span>{t('tradeAnalysis.analyzeSell', 'Analyze SELL')}</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Native Card View (<= 640px) */}
                    <div className={styles.buySellMobileCards}>
                        <div className={styles.buySellMobileCard}>
                            <div className={styles.mobileCardHeader}>
                                <span className={`${styles.typeBadge} ${styles.buyBadge}`}>BUY</span>
                                <span className={styles.mobileWinRate}>{summary.buy_stats?.win_rate ?? '100.0'}% {t('tradeAnalysis.winRateHeader', 'Win Rate')}</span>
                            </div>
                            <div className={styles.mobileCardGrid}>
                                <div className={styles.mobileCardMetric}>
                                    <span className={styles.metricLabel}>{t('tradeAnalysis.tradesHeader', 'Trades')}</span>
                                    <span className={styles.metricVal}>{summary.buy_stats?.trades ?? summary.buy_trades_count ?? trades.filter(t => (t.side || '').toUpperCase() === 'BUY').length}</span>
                                </div>
                                <div className={styles.mobileCardMetric}>
                                    <span className={styles.metricLabel}>{t('tradeAnalysis.netProfitHeader', 'Net Profit')}</span>
                                    <span className={`${styles.metricVal} ${styles.profitCell}`}>{formatCurrency(summary.buy_stats?.net_profit ?? summary.buy_net_pnl ?? 0)}</span>
                                </div>
                                <div className={styles.mobileCardMetric}>
                                    <span className={styles.metricLabel}>{t('tradeAnalysis.grossProfitHeader', 'Gross Profit')}</span>
                                    <span className={styles.metricVal}>+$0.00</span>
                                </div>
                                <div className={styles.mobileCardMetric}>
                                    <span className={styles.metricLabel}>{t('tradeAnalysis.avgProfitHeader', 'Avg Profit/Trade')}</span>
                                    <span className={styles.metricVal}>{formatCurrency(summary.buy_stats?.avg_profit_per_trade ?? ((summary.buy_stats?.trades || 1) ? (summary.buy_stats?.net_profit || 0) / (summary.buy_stats?.trades || 1) : 0))}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={styles.mobileAnalyzeBtn}
                                onClick={() => {
                                    const firstBuyTrade = trades.find(t => (t.side || '').toUpperCase() === 'BUY');
                                    if (firstBuyTrade) {
                                        handleAnalyzeIndividualTrade(firstBuyTrade);
                                    } else {
                                        setFilterSide('BUY');
                                        setActiveTab('ledger');
                                    }
                                }}
                            >
                                <SparklesIcon />
                                <span>{t('tradeAnalysis.analyzeBuy', 'Analyze BUY')}</span>
                            </button>
                        </div>

                        <div className={styles.buySellMobileCard}>
                            <div className={styles.mobileCardHeader}>
                                <span className={`${styles.typeBadge} ${styles.sellBadge}`}>SELL</span>
                                <span className={styles.mobileWinRate}>{summary.sell_stats?.win_rate ?? '100.0'}% {t('tradeAnalysis.winRateHeader', 'Win Rate')}</span>
                            </div>
                            <div className={styles.mobileCardGrid}>
                                <div className={styles.mobileCardMetric}>
                                    <span className={styles.metricLabel}>{t('tradeAnalysis.tradesHeader', 'Trades')}</span>
                                    <span className={styles.metricVal}>{summary.sell_stats?.trades ?? summary.sell_trades_count ?? trades.filter(t => (t.side || '').toUpperCase() === 'SELL').length}</span>
                                </div>
                                <div className={styles.mobileCardMetric}>
                                    <span className={styles.metricLabel}>{t('tradeAnalysis.netProfitHeader', 'Net Profit')}</span>
                                    <span className={`${styles.metricVal} ${Number(summary.sell_stats?.net_profit ?? summary.sell_net_pnl ?? 0) >= 0 ? styles.profitCell : styles.lossCell}`}>
                                        {formatCurrency(summary.sell_stats?.net_profit ?? summary.sell_net_pnl ?? 0)}
                                    </span>
                                </div>
                                <div className={styles.mobileCardMetric}>
                                    <span className={styles.metricLabel}>{t('tradeAnalysis.grossProfitHeader', 'Gross Profit')}</span>
                                    <span className={styles.metricVal}>+$0.00</span>
                                </div>
                                <div className={styles.mobileCardMetric}>
                                    <span className={styles.metricLabel}>{t('tradeAnalysis.avgProfitHeader', 'Avg Profit/Trade')}</span>
                                    <span className={styles.metricVal}>{formatCurrency(summary.sell_stats?.avg_profit_per_trade ?? ((summary.sell_stats?.trades || 1) ? (summary.sell_stats?.net_profit || 0) / (summary.sell_stats?.trades || 1) : 0))}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={styles.mobileAnalyzeBtn}
                                onClick={() => {
                                    const firstSellTrade = trades.find(t => (t.side || '').toUpperCase() === 'SELL');
                                    if (firstSellTrade) {
                                        handleAnalyzeIndividualTrade(firstSellTrade);
                                    } else {
                                        setFilterSide('SELL');
                                        setActiveTab('ledger');
                                    }
                                }}
                            >
                                <SparklesIcon />
                                <span>{t('tradeAnalysis.analyzeSell', 'Analyze SELL')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3-Layer Insights Callout Cards */}
                <div className={styles.threeLayerBox}>
                    <div className={styles.sectionTitle}>
                        <TargetIcon />
                        <h3>{t('tradeAnalysis.threeLayerTitle', '3-Layer Insights')}</h3>
                    </div>

                    <div className={styles.calloutStack}>
                        <div className={`${styles.calloutCard} ${styles.fact}`}>
                            <span>
                                <strong className={styles.prefix}>{t('tradeAnalysis.factPrefix', 'Fact:')}</strong> {timeInsights.fact_loss_distribution || t('tradeAnalysis.factFallback', 'With 0.0% loss concentration and a 100% win rate during execution sessions, there is no evidence of temporal degradation or post-cutoff volatility leakage.')}
                            </span>
                        </div>

                        <div className={`${styles.calloutCard} ${styles.peak}`}>
                            <span>
                                <strong className={styles.prefix}>{t('tradeAnalysis.peakPrefix', 'Peak Activity:')}</strong> {timeInsights.peak_frequency_time || t('tradeAnalysis.peakFallback', 'The trading activity is hyper-concentrated, with 100% of the trades executed in peak volatility windows.')}
                            </span>
                        </div>

                        <div className={`${styles.calloutCard} ${styles.recommendation}`}>
                            <span>
                                <strong className={styles.prefix}>{t('tradeAnalysis.recPrefix', 'Recommendation:')}</strong> {timeInsights.cutoff_recommendation || t('tradeAnalysis.recFallback', 'Given the performance data, implement a Session Capacity Rule to cap daily session duration and protect equity.')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2-Column Strengths & Improvements Grid */}
                <div className={styles.strengthsImprovementsGrid}>
                    <div className={styles.columnBox}>
                        <div className={styles.colHeader}>
                            <SuccessCircleIcon />
                            <h4>{t('tradeAnalysis.wellDone', 'What You Did Well')}</h4>
                        </div>
                        <div className={styles.itemsStack}>
                            {(quickAnalysis.good && quickAnalysis.good.length > 0) ? (
                                quickAnalysis.good.map((item, idx) => (
                                    <div key={idx} className={`${styles.itemCard} ${styles.good}`}>
                                        ✓ {item}
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className={`${styles.itemCard} ${styles.good}`}>
                                        ✓ {t('tradeAnalysis.strongWinRate', 'Very strong win rate')}: {winRateVal.toFixed(2)}%.
                                    </div>
                                    <div className={`${styles.itemCard} ${styles.good}`}>
                                        ✓ {t('tradeAnalysis.overallProfitable', 'Overall trading is profitable')}: {formatCurrency(netProfitVal)}.
                                    </div>
                                    <div className={`${styles.itemCard} ${styles.good}`}>
                                        ✓ {t('tradeAnalysis.bothProfitable', 'Both BUY and SELL trades are profitable.')}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={styles.columnBox}>
                        <div className={styles.colHeader}>
                            <DangerCircleIcon />
                            <h4>{t('tradeAnalysis.improvements', 'Areas for Improvement')}</h4>
                        </div>
                        <div className={styles.itemsStack}>
                            {(quickAnalysis.needs_attention && quickAnalysis.needs_attention.length > 0) ? (
                                quickAnalysis.needs_attention.map((item, idx) => (
                                    <div key={idx} className={`${styles.itemCard} ${styles.bad}`}>
                                        X {item}
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className={`${styles.itemCard} ${styles.bad}`}>
                                        X {t('tradeAnalysis.avgLossLarger', 'Average loss')} ({formatCurrency(avgLosingTrade)}) {t('tradeAnalysis.largerThanWin', 'is larger than average win')} ({formatCurrency(avgWinningTrade)}).
                                    </div>
                                    <div className={`${styles.itemCard} ${styles.bad}`}>
                                        X {t('tradeAnalysis.maintainDiscipline', 'Maintain discipline on stop-loss execution to protect peak profitability.')}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
