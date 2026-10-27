import TradeAnalysis from '@/rendering/tradeAnalysis';

export const metadata = {
    title: 'AI Past Trade Analyzer | ChronosX',
    description: 'Institutional statement decoder & behavioral edge auditor. Upload MT4, MT5, cTrader, or broker CSV/Excel statements to decode performance edge and trading psychology.',
};

export default function TradeAuditPage() {
    return <TradeAnalysis />;
}
