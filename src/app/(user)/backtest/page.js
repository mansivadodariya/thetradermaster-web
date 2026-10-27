import React, { Suspense } from 'react';
import BacktestPage from '@/rendering/backtest';

export const metadata = {
    title: 'Backtest | TraderMaster',
    description: 'Run full-screen algorithmic backtest simulations on historical forex & crypto candle data with TraderMaster Backtester.',
};

export default function BacktestRoute() {
    return (
        <Suspense fallback={null}>
            <BacktestPage />
        </Suspense>
    );
}
