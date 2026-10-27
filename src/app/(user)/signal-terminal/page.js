import AiStrategy from '@/rendering/aiStrategy';

export const metadata = {
    title: 'Signal Terminal | TraderMaster',
    description: 'Real-time multi-indicator algorithmic analysis, live candlestick charts, pivot points, and technical conviction scores.',
};

export default function SignalTerminalPage() {
    return <AiStrategy initialTab="live" />;
}
