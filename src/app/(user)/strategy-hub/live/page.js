import AiStrategy from '@/rendering/aiStrategy';

export const metadata = {
    title: 'Signal Terminal — AI Trading Signal | ChronosX',
    description: 'Real-time multi-indicator algorithmic analysis, live candlestick charts, pivot points, and technical conviction scores.',
};

export default function StrategyHubLivePage() {
    return <AiStrategy initialTab="live" />;
}
