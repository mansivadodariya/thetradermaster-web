'use client';

import React, { useState, useMemo } from 'react';
import styles from '../styles/strategyStudio.module.scss';

const formatPrice = (val) => {
    if (val === undefined || val === null || isNaN(Number(val))) return '—';
    const num = Number(val);
    return num.toFixed(4).replace(/0+$/, '').replace(/\.$/, '.00');
};

const formatPnL = (val) => {
    if (val === undefined || val === null || isNaN(Number(val))) return '$0.00';
    const num = Number(val);
    const sign = num > 0 ? '+' : '';
    return `${sign}$${num.toFixed(2)}`;
};

const formatBalance = (val) => {
    if (val === undefined || val === null || isNaN(Number(val))) return '$10,000.00';
    return `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function TradesTable({
    roundTrips = [],
    totalTrades = 0,
    wins = 0,
    losses = 0
}) {
    const [filter, setFilter] = useState('all');

    const safeRoundTrips = Array.isArray(roundTrips) ? roundTrips : [];

    const filteredTrades = useMemo(() => {
        if (filter === 'win') return safeRoundTrips.filter(t => (Number(t?.pnl) || 0) > 0);
        if (filter === 'loss') return safeRoundTrips.filter(t => (Number(t?.pnl) || 0) < 0);
        return safeRoundTrips;
    }, [safeRoundTrips, filter]);

    const displayTotal = safeRoundTrips.length > 0 ? safeRoundTrips.length : totalTrades;
    const displayWins = safeRoundTrips.length > 0 ? safeRoundTrips.filter(t => (Number(t?.pnl) || 0) > 0).length : wins;
    const displayLosses = safeRoundTrips.length > 0 ? safeRoundTrips.filter(t => (Number(t?.pnl) || 0) < 0).length : losses;

    return (
        <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
                <h3>Detailed Trades Execution Log ({displayTotal})</h3>
                <div className={styles.filterPills}>
                    <button
                        type="button"
                        className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Trades ({displayTotal})
                    </button>
                    <button
                        type="button"
                        className={`${styles.filterBtn} ${filter === 'win' ? styles.active : ''}`}
                        onClick={() => setFilter('win')}
                    >
                        Wins ({displayWins})
                    </button>
                    <button
                        type="button"
                        className={`${styles.filterBtn} ${filter === 'loss' ? styles.active : ''}`}
                        onClick={() => setFilter('loss')}
                    >
                        Losses ({displayLosses})
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Entry Date</th>
                            <th>Entry Price</th>
                            <th>Exit Date</th>
                            <th>Exit Price</th>
                            <th>Side</th>
                            <th>Trigger</th>
                            <th>Trade P&L</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrades.length === 0 ? (
                            <tr>
                                <td colSpan="9" className={styles.emptyTradesCell}>
                                    <div className={styles.emptyTradesContent}>
                                        {displayTotal > 0 ? (
                                            <span>
                                                Backend Engine Execution: <strong>{displayTotal}</strong> aggregate trades computed ({displayWins} wins / {displayLosses} losses).
                                            </span>
                                        ) : (
                                            <span>No trade signals generated for this backtest dataset.</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTrades.map((t, idx) => {
                                const pnlNum = Number(t?.pnl) || 0;
                                const isWin = pnlNum > 0;
                                const side = String(t?.side || 'BUY').toUpperCase();
                                const isBuy = side === 'BUY';
                                const trigger = String(t?.trigger || (isWin ? 'TARGET' : 'STOPLOSS')).toUpperCase();
                                const triggerClass = trigger.includes('TARGET') || trigger.includes('TP')
                                    ? styles.target
                                    : trigger.includes('STOPLOSS') || trigger.includes('SL') || trigger.includes('TRAILING')
                                    ? styles.stoploss
                                    : '';

                                return (
                                    <tr key={t?.index || idx + 1}>
                                        <td className={styles.indexCell}>{t?.index || idx + 1}</td>
                                        <td>{t?.entryDate || '—'}</td>
                                        <td>{formatPrice(t?.entryPrice)}</td>
                                        <td>{t?.exitDate || '—'}</td>
                                        <td>{formatPrice(t?.exitPrice)}</td>
                                        <td>
                                            <span className={isBuy ? styles.badgeBuy : styles.badgeSell}>
                                                {side}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.badgeTrigger} ${triggerClass}`}>
                                                {trigger}
                                            </span>
                                        </td>
                                        <td className={isWin ? styles.pnlWin : styles.pnlLoss}>
                                            {formatPnL(pnlNum)}
                                        </td>
                                        <td className={styles.balanceCell}>
                                            {formatBalance(t?.runningBalance)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
