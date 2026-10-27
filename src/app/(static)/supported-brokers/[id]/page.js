import BrokerDetailPage from '@/rendering/broker/detail';

export const metadata = {
    title: 'Broker & Platform Details | TraderMaster',
    description: 'Explore full features, liquidity specs, and official links for verified trading partners.',
};

export default async function SupportedBrokerDetailPage({ params }) {
    const resolvedParams = await params;
    return <BrokerDetailPage brokerId={resolvedParams?.id} isPublicLanding={true} />;
}
