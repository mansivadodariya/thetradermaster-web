'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styles from '../aiStrategy.module.scss';

const WatchlistPanel = dynamic(() => import('../WatchlistPanel'), { ssr: false });
const ChartPanel = dynamic(() => import('../ChartPanel'), { ssr: false });
const AnalysisPanel = dynamic(() => import('../AnalysisPanel'), { ssr: false });

export default function LiveAnalysisView({
    selectedSymbol,
    setSelectedSymbol,
    globalTimeframe,
    addLog,
    activeAnalysis,
    setActiveAnalysis,
    selectedSymbolPriceInfo,
    setSelectedSymbolPriceInfo,
    selectedStrategyId,
    handleHourlyRefresh,
    refreshCounter
}) {
    return (
        <div className={styles.liveAnalysisLayout}>
            {/* Real-time Feed Status & Latency Transparency Banner */}
            <div className={styles.feedDisclosureBanner}>
                <div className={styles.feedStatusPill}>
                    <span className={styles.feedStatusDot} />
                    <span className={styles.feedStatusLabel}>MT5 WEBSOCKET TICK STREAM</span>
                </div>
                <div className={styles.feedDisclosureText}>
                    <span>
                        Real-time AI algorithmic telemetry. Market quotes update via institutional WebSocket bridges (standard 15-minute indicative delay may apply during exchange settlement or low-liquidity sessions).
                    </span>
                </div>
            </div>

            {/* Top Row: Watchlist + Chart Panels side-by-side */}
            <div className={styles.topPanelsRow}>
                {/* Panel 1: Watchlist */}
                <WatchlistPanel 
                    selectedSymbol={selectedSymbol}
                    onSelectSymbol={setSelectedSymbol}
                    globalTimeframe={globalTimeframe}
                    addLog={addLog}
                    activeAnalysis={activeAnalysis}
                    onActivePriceUpdate={setSelectedSymbolPriceInfo}
                />

                {/* Panel 2: Chart */}
                <ChartPanel 
                    symbol={selectedSymbol}
                    strategyId={selectedStrategyId}
                    timeframe={globalTimeframe === '1h' ? '1H' : globalTimeframe}
                    nearestSupport={activeAnalysis?.levels?.nearest_support}
                    nearestResistance={activeAnalysis?.levels?.nearest_resistance}
                    onRefreshNeeded={handleHourlyRefresh}
                    livePriceInfo={selectedSymbolPriceInfo}
                />
            </div>

            {/* Bottom Row: Analysis Panel placed below */}
            <div className={styles.bottomAnalysisRow}>
                <AnalysisPanel 
                    symbol={selectedSymbol}
                    strategyId={selectedStrategyId}
                    activeAnalysis={activeAnalysis}
                    onAnalysisLoaded={setActiveAnalysis}
                    key={`${selectedSymbol}-${selectedStrategyId}-${refreshCounter}`}
                />
            </div>
        </div>
    );
}
