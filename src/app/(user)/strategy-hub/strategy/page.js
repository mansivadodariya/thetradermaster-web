import AiStrategy from '@/rendering/aiStrategy';

export const metadata = {
    title: 'Strategy Signal — AI Trading Signal | ChronosX',
    description: 'Explore, backtest, and deploy algorithmic trading strategies with institutional accuracy metrics on ChronosX.',
};

export default function StrategyHubPlaybooksPage() {
    return <AiStrategy initialTab="strategy" />;
}
