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
