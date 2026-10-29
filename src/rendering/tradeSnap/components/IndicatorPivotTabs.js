'use client';
import React, { useState } from 'react';
import styles from '../aiSnapDashboard.module.scss';
import { ActivityIcon, ChevronDownIcon } from '@/icons/aiSnapIcons';
import { getTradeSnapText } from '../utils/tradeSnapTranslations';

export default function IndicatorPivotTabs({ trendIndicators, momentumIndicators, volatilityIndicators, pivotPoints, activeLang = 'en' }) {
    const [activeTab, setActiveTab] = useState('trend');

    const defaultTrend = trendIndicators || {
        "SMA_10": { "value": 0.80824, "action": "Bullish" },
        "EMA_20": { "value": 0.80038, "action": "Bullish" },
        "EMA_50": { "value": 0.80770, "action": "Mixed" }
    };

    const defaultMomentum = momentumIndicators || {
        "RSI (14)": { "value": 64.63, "action": "Neutral" },
        "Stoch_K": { "value": 0.90, "action": "Oversold" },
        "MACD (12,26,9)": { "value": -0.0021, "action": "Bearish" }
    };

    const defaultVolatility = volatilityIndicators || {
        "ATR (14)": { "value": 0.0045, "action": "Normal" },
        "Bollinger Upper": { "value": 0.8124, "action": "Resistance" },
        "Bollinger Lower": { "value": 0.7985, "action": "Support" }
    };

    const defaultPivots = pivotPoints || {
        standard: { P: 0.80825, R1: 0.81299, S1: 0.79854, R2: 0.81966, S2: 0.7918 },
        fibonacci: { P: 0.80825, R1: 0.81180, S1: 0.80470, R2: 0.81530, S2: 0.80120 },
        camarilla: { P: 0.80825, R1: 0.80950, S1: 0.80700, R2: 0.81100, S2: 0.80550 },
        woodie: { P: 0.80830, R1: 0.81310, S1: 0.79860, R2: 0.81970, S2: 0.79190 }
    };

    const getActionBadgeClass = (action = '') => {
        const a = String(action).toLowerCase();
        if (a.includes('bull') || a.includes('overbought')) return styles.badgeGreen;
        if (a.includes('bear') || a.includes('oversold')) return styles.badgeRed;
        return styles.badgeAmber;
    };

    const renderIndicatorTable = (dataObj) => {
        if (!dataObj || typeof dataObj !== 'object') return null;
        const entries = Object.entries(dataObj);

        return (
            <div className={styles.tableWrapper}>
                <table className={styles.breakdownTable}>
                    <thead>
                        <tr>
                            <th>{getTradeSnapText('Indicator / Metric', activeLang)}</th>
                            <th>{getTradeSnapText('Value', activeLang)}</th>
                            <th>{getTradeSnapText('Action / Condition', activeLang)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map(([name, item]) => {
                            const val = typeof item === 'object' ? item.value : item;
                            const act = typeof item === 'object' ? item.action : '—';
                            return (
                                <tr key={name}>
                                    <td className={styles.tableNameCell}>{name}</td>
                                    <td className={styles.tableValCell}>{val}</td>
                                    <td>
                                        <span className={`${styles.actionTableBadge} ${getActionBadgeClass(act)}`}>
                                            {getTradeSnapText(act, activeLang)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderPivotTable = (pivotsObj) => {
        if (!pivotsObj || typeof pivotsObj !== 'object') return null;
        const types = Object.keys(pivotsObj);

        return (
            <div className={styles.tableWrapper}>
                <table className={styles.breakdownTable}>
                    <thead>
                        <tr>
                            <th>{getTradeSnapText('Pivot Formula', activeLang)}</th>
                            <th>S2</th>
                            <th>S1</th>
                            <th className={styles.pivotMainHeader}>{getTradeSnapText('P (Pivot)', activeLang)}</th>
                            <th>R1</th>
                            <th>R2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {types.map((typeKey) => {
                            const row = pivotsObj[typeKey] || {};
                            return (
                                <tr key={typeKey}>
                                    <td className={styles.tableNameCell}>{typeKey.toUpperCase()}</td>
                                    <td className={styles.supportCell}>{row.S2 || row.s2 || '—'}</td>
                                    <td className={styles.supportCell}>{row.S1 || row.s1 || '—'}</td>
                                    <td className={styles.pivotMainCell}>{row.P || row.p || '—'}</td>
                                    <td className={styles.resistanceCell}>{row.R1 || row.r1 || '—'}</td>
                                    <td className={styles.resistanceCell}>{row.R2 || row.r2 || '—'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className={styles.indicatorPivotSection}>
            <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionTitleWrap}>
                    <ActivityIcon size={18} className={styles.sectionTitleIcon} />
                    <h3>{getTradeSnapText('Technical Indicators & Pivot Point Breakdown', activeLang)}</h3>
                </div>
            </div>

            {/* Tab Navigation (Visible on screen) */}
            <div className={styles.tabNavRow}>
                <button
                    type="button"
                    className={`${styles.tabNavBtn} ${activeTab === 'trend' ? styles.tabNavActive : ''}`}
                    onClick={() => setActiveTab('trend')}
                >
                    {getTradeSnapText('Trend Indicators', activeLang)}
                </button>
                <button
                    type="button"
                    className={`${styles.tabNavBtn} ${activeTab === 'momentum' ? styles.tabNavActive : ''}`}
                    onClick={() => setActiveTab('momentum')}
                >
                    {getTradeSnapText('Momentum', activeLang)}
                </button>
                <button
                    type="button"
                    className={`${styles.tabNavBtn} ${activeTab === 'volatility' ? styles.tabNavActive : ''}`}
                    onClick={() => setActiveTab('volatility')}
                >
                    {getTradeSnapText('Volatility', activeLang)}
                </button>
                <button
                    type="button"
                    className={`${styles.tabNavBtn} ${activeTab === 'pivots' ? styles.tabNavActive : ''}`}
                    onClick={() => setActiveTab('pivots')}
                >
                    {getTradeSnapText('Pivot Points', activeLang)}
                </button>
            </div>

            {/* Tab Body (Interactive Single Tab on screen) */}
            <div className={styles.tabContentCard}>
                {activeTab === 'trend' && renderIndicatorTable(defaultTrend)}
                {activeTab === 'momentum' && renderIndicatorTable(defaultMomentum)}
                {activeTab === 'volatility' && renderIndicatorTable(defaultVolatility)}
                {activeTab === 'pivots' && renderPivotTable(defaultPivots)}
            </div>

            {/* PDF Full Breakdown (Shows all 4 indicator & pivot tables sequentially in PDF export) */}
            <div className={styles.pdfFullBreakdown}>
                <div className={styles.pdfBreakdownBlock} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className={styles.pdfSubHeading}>1. {getTradeSnapText('Trend Indicators', activeLang)}</div>
                    <div className={styles.tabContentCard}>{renderIndicatorTable(defaultTrend)}</div>
                </div>
                <div className={styles.pdfBreakdownBlock} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className={styles.pdfSubHeading}>2. {getTradeSnapText('Momentum', activeLang)}</div>
                    <div className={styles.tabContentCard}>{renderIndicatorTable(defaultMomentum)}</div>
                </div>
                <div className={styles.pdfBreakdownBlock} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className={styles.pdfSubHeading}>3. {getTradeSnapText('Volatility', activeLang)}</div>
                    <div className={styles.tabContentCard}>{renderIndicatorTable(defaultVolatility)}</div>
                </div>
                <div className={styles.pdfBreakdownBlock} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className={styles.pdfSubHeading}>4. {getTradeSnapText('Pivot Points Breakdown', activeLang)}</div>
                    <div className={styles.tabContentCard}>{renderPivotTable(defaultPivots)}</div>
                </div>
            </div>
        </div>
    );
}
