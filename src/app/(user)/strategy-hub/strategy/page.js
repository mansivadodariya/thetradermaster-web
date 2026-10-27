import AiStrategy from '@/rendering/aiStrategy';

export const metadata = {
    title: 'Strategy Signal — AI Trading Signal | TraderMaster',
    description: 'Explore, backtest, and deploy algorithmic trading strategies with institutional accuracy metrics on TraderMaster.',
};

export default function StrategyHubPlaybooksPage() {
    return <AiStrategy initialTab="strategy" />;
}
