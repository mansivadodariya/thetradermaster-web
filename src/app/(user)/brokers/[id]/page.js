import BrokerDetailPage from '@/rendering/broker/detail';

export const metadata = {
    title: 'Broker & Platform Details | TraderMaster Dashboard',
    description: 'Explore full features, liquidity specs, and direct connectivity for verified trading partners.',
};

export default async function UserBrokerDetailPage({ params }) {
    const resolvedParams = await params;
    return <BrokerDetailPage brokerId={resolvedParams?.id} isPublicLanding={false} />;
}
