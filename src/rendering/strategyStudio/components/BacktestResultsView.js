'use client';

import React from 'react';
import styles from '../styles/strategyStudio.module.scss';
import BacktestCandlestickChart from './BacktestCandlestickChart';
import BacktestCharts from './BacktestCharts';
import TradesTable from './TradesTable';
import {
    CoinsCapitalIcon,
    ChartTrendIcon,
    RefreshResetIcon,
    SlidersTuneIcon,
    LightningIcon
} from './StudioIcons';

export default function BacktestResultsView({
    results,
    roundTrips,
    initialCapital = 10000,
    symbol = 'EURUSD',
    interval = '15min',
    quantity = 0.01,
    loading = false
}) {
    const isLoading = loading || !results;

    if (isLoading) {
        return (
            <div className={styles.resultsContainer}>
                {/* Row 1: KPI Skeleton Cards */}
                <div className={styles.kpiGrid}>
                    {[
                        { label: 'Trades', icon: <RefreshResetIcon size={14} color="#18C98B" /> },
                        { label: 'Win Rate', icon: <ChartTrendIcon size={14} color="#18C98B" /> },
                        { label: 'Net PnL', icon: <CoinsCapitalIcon size={14} color="#18C98B" /> },
                        { label: 'Return', icon: <ChartTrendIcon size={14} color="#18C98B" /> },
                        { label: 'Profit Factor', icon: <SlidersTuneIcon size={14} color="#18C98B" /> },
                        { label: 'Max DD', icon: <ChartTrendIcon size={14} color="#18C98B" /> },
                        { label: 'Wins', icon: <ChartTrendIcon size={14} color="#18C98B" /> },
                        { label: 'Losses', icon: <ChartTrendIcon size={14} color="#18C98B" /> },
                        { label: 'Expectancy', icon: <CoinsCapitalIcon size={14} color="#18C98B" /> },
                        { label: 'Avg Win', icon: <CoinsCapitalIcon size={14} color="#18C98B" /> },
                        { label: 'Avg Loss', icon: <CoinsCapitalIcon size={14} color="#18C98B" /> },
                        { label: 'Sharpe', icon: <SlidersTuneIcon size={14} color="#18C98B" /> },
                        { label: 'Max Gain / Loss', icon: <SlidersTuneIcon size={14} color="#18C98B" /> },
                        { label: 'Execution Streaks', icon: <LightningIcon size={14} color="#18C98B" /> }
                    ].map((card, idx) => (
                        <div key={idx} className={styles.kpiCard}>
                            <div className={styles.kpiLabel}>
                                <span>{card.label}</span>
                                {card.icon}
                            </div>
                            <div className={styles.kpiValue} style={{ color: '#64748B', opacity: 0.6, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span className={styles.liveIndicatorPulse} style={{ display: 'inline-block' }} />
                                Loading...
                            </div>
                            <div className={styles.kpiSub}>
                                Synchronizing dataset
                            </div>
                        </div>
                    ))}
                </div>

                {/* Row 2: Market Data & Executions (Candlestick Loader Skeleton) */}
                <BacktestCandlestickChart
                    results={null}
                    roundTrips={[]}
                    symbol={symbol}
                    interval={interval}
                    quantity={quantity}
                    capital={initialCapital}
                />

                {/* Row 3: Performance Charts Loader */}
                <BacktestCharts
                    results={null}
                    roundTrips={[]}
                    initialCapital={initialCapital}
                    wins={0}
                    losses={0}
                />
            </div>
        );
    }

    const stats = results?.stats || {};
    const safeTrips = Array.isArray(roundTrips) ? roundTrips : [];
    
    // Total completed trades: extract from top-level, stats, or safeTrips
    const totalCompleted = Number(
        results?.total_trades ?? 
        stats?.trades ?? 
        stats?.total_trades ?? 
        safeTrips.length ?? 
        0
    );

    // Wins and Losses
    const wins = Number(
        results?.wins ?? 
        stats?.win ?? 
        stats?.wins ?? 
        (safeTrips.length > 0 ? safeTrips.filter(t => (Number(t?.pnl) || 0) > 0).length : 0)
    );

    const losses = Number(
        results?.losses ?? 
        stats?.loss ?? 
        stats?.losses ?? 
        (safeTrips.length > 0 ? safeTrips.filter(t => (Number(t?.pnl) || 0) <= 0).length : 0)
    );

    // Total PnL
    const rawPnL = results?.pnl ?? results?.net_profit ?? stats?.pnl ?? (safeTrips.length > 0 ? safeTrips.reduce((acc, t) => acc + (Number(t?.pnl) || 0), 0) : 0);
    const totalPnL = parseFloat(Number(rawPnL || 0).toFixed(2));

    // PnL percentage
    const rawPnLPct = results?.pnl_percentage ?? stats?.pnl_percentage ?? (initialCapital > 0 ? (totalPnL / initialCapital) * 100 : 0);
    const pnlPercent = parseFloat(Number(rawPnLPct || 0).toFixed(2));

    // Win rate
    const rawWinRate = results?.win_rate ?? stats?.win_rate ?? (totalCompleted > 0 ? ((wins / totalCompleted) * 100) : 0);
    const winRate = parseFloat(Number(rawWinRate || 0).toFixed(2));

    // Profit factor
    const profitFactor = Number(results?.profit_factor ?? stats?.profit_factor ?? 0);

    // Max Drawdown %
    const maxDrawdown = Number(results?.max_drawdown_percentage ?? stats?.max_drawdown_percentage ?? stats?.max_drawdown ?? 0);

    // Expectancy
    const expectancy = Number(stats?.expectancy ?? results?.expectancy ?? (totalCompleted > 0 ? totalPnL / totalCompleted : 0));

    // Average Win & Average Loss
    const winTrips = safeTrips.filter(t => (Number(t?.pnl) || 0) > 0);
    const avgWinFallback = winTrips.length > 0 ? (winTrips.reduce((acc, t) => acc + Number(t.pnl), 0) / winTrips.length) : 0;
    const avgWin = Math.abs(Number(stats?.avg_win ?? results?.avg_win ?? avgWinFallback));

    const lossTrips = safeTrips.filter(t => (Number(t?.pnl) || 0) < 0);
    const avgLossFallback = lossTrips.length > 0 ? Math.abs(lossTrips.reduce((acc, t) => acc + Number(t.pnl), 0) / lossTrips.length) : 0;
    const avgLoss = Math.abs(Number(stats?.avg_loss ?? results?.avg_loss ?? avgLossFallback));

    // Sharpe ratio
    const sharpeRatio = Number(stats?.sharpe_ratio ?? results?.sharpe_ratio ?? 0);

    // Max Gain & Max Loss
    const maxGain = Number(
        results?.max_gain ?? 
        stats?.max_gain ?? 
        (safeTrips.length > 0 ? Math.max(0, ...safeTrips.map(t => Number(t?.pnl) || 0)) : 0)
    );

    const maxLoss = Math.abs(Number(
        results?.max_loss ?? 
        stats?.max_loss ?? 
        (safeTrips.length > 0 ? Math.min(0, ...safeTrips.map(t => Number(t?.pnl) || 0)) : 0)
    ));

    // Streaks
    const winStreak = Number(results?.win_streak ?? stats?.win_streak ?? 0);
    const lossStreak = Number(results?.loss_streak ?? stats?.loss_streak ?? 0);

    return (
        <div className={styles.resultsContainer}>
            {/* Row 1: KPI Cards */}
            <div className={styles.kpiGrid}>
                {/* 1. Trades */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Trades</span>
                        <RefreshResetIcon size={14} color="#18C98B" />
                    </div>
                    <div className={styles.kpiValue}>
                        {totalCompleted}
                    </div>
                    <div className={styles.kpiSub}>
                        Executions
                    </div>
                </div>

                {/* 2. Win Rate */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Win Rate</span>
                        <ChartTrendIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${winRate >= 50 ? styles.positive : styles.negative}`}>
                        {winRate.toFixed(2)}%
                    </div>
                    <div className={styles.kpiSub}>
                        {wins}W / {losses}L
                    </div>
                </div>

                {/* 3. Net PnL */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Net PnL</span>
                        <CoinsCapitalIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${totalPnL >= 0 ? styles.positive : styles.negative}`}>
                        {totalPnL >= 0 
                            ? `+$${totalPnL.toFixed(2)}` 
                            : `-$${Math.abs(totalPnL).toFixed(2)}`}
                    </div>
                    <div className={styles.kpiSub}>
                        Net profit / loss
                    </div>
                </div>

                {/* 4. Return */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Return</span>
                        <ChartTrendIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${pnlPercent >= 0 ? styles.positive : styles.negative}`}>
                        {pnlPercent >= 0 
                            ? `+${pnlPercent.toFixed(2)}%` 
                            : `-${Math.abs(pnlPercent).toFixed(2)}%`}
                    </div>
                    <div className={styles.kpiSub}>
                        Return on capital
                    </div>
                </div>

                {/* 5. Profit Factor */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Profit Factor</span>
                        <SlidersTuneIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${profitFactor >= 1.0 ? styles.positive : (profitFactor > 0 ? styles.negative : '')}`}>
                        {profitFactor.toFixed(2)}
                    </div>
                    <div className={styles.kpiSub}>
                        Gross P / L ratio
                    </div>
                </div>

                {/* 6. Max DD */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Max DD</span>
                        <ChartTrendIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${styles.negative}`}>
                        {maxDrawdown.toFixed(2)}%
                    </div>
                    <div className={styles.kpiSub}>
                        Peak-to-trough
                    </div>
                </div>

                {/* 7. Wins */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Wins</span>
                        <ChartTrendIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${styles.positive}`}>
                        {wins}
                    </div>
                    <div className={styles.kpiSub}>
                        Profitable trades
                    </div>
                </div>

                {/* 8. Losses */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Losses</span>
                        <ChartTrendIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${styles.negative}`}>
                        {losses}
                    </div>
                    <div className={styles.kpiSub}>
                        Unprofitable trades
                    </div>
                </div>

                {/* 9. Expectancy */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Expectancy</span>
                        <CoinsCapitalIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${expectancy >= 0 ? styles.positive : styles.negative}`}>
                        {expectancy >= 0 
                            ? `+$${expectancy.toFixed(2)}` 
                            : `-$${Math.abs(expectancy).toFixed(2)}`}
                    </div>
                    <div className={styles.kpiSub}>
                        Per trade average
                    </div>
                </div>

                {/* 10. Avg Win */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Avg Win</span>
                        <CoinsCapitalIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${styles.positive}`}>
                        +${avgWin.toFixed(2)}
                    </div>
                    <div className={styles.kpiSub}>
                        Winning average
                    </div>
                </div>

                {/* 11. Avg Loss */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Avg Loss</span>
                        <CoinsCapitalIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${styles.negative}`}>
                        -${avgLoss.toFixed(2)}
                    </div>
                    <div className={styles.kpiSub}>
                        Losing average
                    </div>
                </div>

                {/* 12. Sharpe */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Sharpe</span>
                        <SlidersTuneIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${sharpeRatio >= 1.0 ? styles.positive : (sharpeRatio < 0 ? styles.negative : '')}`}>
                        {sharpeRatio.toFixed(2)}
                    </div>
                    <div className={styles.kpiSub}>
                        Risk-adjusted
                    </div>
                </div>

                {/* 13. Max Gain / Loss */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Max Gain / Loss</span>
                        <SlidersTuneIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${styles.positive}`}>
                        +${maxGain.toFixed(2)}
                    </div>
                    <div className={styles.kpiSub} style={{ color: '#F43F5E' }}>
                        -${maxLoss.toFixed(2)}
                    </div>
                </div>

                {/* 14. Execution Streaks */}
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>
                        <span>Execution Streaks</span>
                        <LightningIcon size={14} color="#18C98B" />
                    </div>
                    <div className={`${styles.kpiValue} ${styles.positive}`}>
                        {winStreak} Wins
                    </div>
                    <div className={styles.kpiSub}>
                        {lossStreak} Losses max
                    </div>
                </div>
            </div>

            {/* Row 2: Market Data & Executions (Candlestick Chart with Entry/Exit Markers) */}
            <BacktestCandlestickChart
                results={results}
                roundTrips={roundTrips}
                symbol={symbol}
                interval={interval}
                quantity={quantity}
                capital={initialCapital}
            />

            {/* Row 3: Performance Charts */}
            <BacktestCharts
                results={results}
                roundTrips={roundTrips}
                initialCapital={initialCapital}
                wins={wins}
                losses={losses}
                totalPnL={totalPnL}
                totalTrades={totalCompleted}
            />

            {/* Row 4: Trades Table */}
            <TradesTable
                roundTrips={roundTrips}
                totalTrades={totalCompleted}
                wins={wins}
                losses={losses}
            />
        </div>
    );
}
