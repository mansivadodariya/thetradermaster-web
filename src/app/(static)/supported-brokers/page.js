import BrokerPage from '@/rendering/broker';

export const metadata = {
    title: 'Supported Brokers & Liquidity Partners | ChronosX',
    description: 'Explore verified broker partners with Tier-1 liquidity, zero-latency MT5 bridges, and raw spreads.',
};

export default function SupportedBrokersPage() {
    return <BrokerPage isPublic={true} />;
}
