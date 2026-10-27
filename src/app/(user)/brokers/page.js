import BrokerPage from '@/rendering/broker';

export const metadata = {
    title: 'Associated Brokers | ChronosX Dashboard',
    description: 'Connect verified broker partners with Tier-1 liquidity, zero-latency MT5 bridges, and automated volume rebates.',
};

export default function UserBrokersPage() {
    return <BrokerPage isPublic={false} />;
}
