import TradeAnalysis from '@/rendering/tradeAnalysis';

export const metadata = {
    title: 'AI Past Trade Analyzer | TraderMaster',
    description: 'Upload your trade history to receive deep AI performance audits, win-rate attribution, and behavioral risk detection.',
};

export default function TradeAdvisorPage() {
    return <TradeAnalysis />;
}
