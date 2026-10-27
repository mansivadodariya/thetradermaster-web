import React, { Suspense } from 'react';
import BacktestPage from '@/rendering/backtest';

export const metadata = {
    title: 'Backtest | ChronosX',
    description: 'Run full-screen algorithmic backtest simulations on historical forex & crypto candle data with ChronosX Backtester.',
};

export default function BacktestRoute() {
    return (
        <Suspense fallback={null}>
            <BacktestPage />
        </Suspense>
    );
}
