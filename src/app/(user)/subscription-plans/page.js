import SubscriptionPlansView from '@/rendering/plans';

export const metadata = {
    title: 'Subscription Plans & AI Credits | ChronosX Dashboard',
    description: 'Manage your active subscription plan and AI credits directly inside your user dashboard.',
};

export default function UserSubscriptionPlansPage() {
    return <SubscriptionPlansView />;
}
