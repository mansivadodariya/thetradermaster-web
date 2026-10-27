import AiStrategy from '@/rendering/aiStrategy';

export const metadata = {
    title: 'AI Trading Signal | ChronosX',
    description: 'Explore, backtest, and deploy algorithmic trading strategies with institutional accuracy metrics on ChronosX.',
};

export default function TradingSignalPage() {
    return <AiStrategy initialTab="strategy" />;
}
