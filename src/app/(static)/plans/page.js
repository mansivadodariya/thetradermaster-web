import SubscriptionPlansView from '@/rendering/plans';

export const metadata = {
    title: 'Pricing Plans & AI Credits',
    description: 'Choose from flexible credit packages to power your AI trading analyses, strategy backtests, and real-time market queries.',
    alternates: {
        canonical: 'https://chronosx.com/plans',
    },
    openGraph: {
        title: 'Pricing Plans & AI Credits | ChronosX',
        description: 'Choose from flexible credit packages to power your AI trading analyses, strategy backtests, and real-time market queries.',
        url: 'https://chronosx.com/plans',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX Pricing Plans and AI Credits',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pricing Plans & AI Credits | ChronosX',
        description: 'Choose from flexible credit packages to power your AI trading analyses, strategy backtests, and real-time market queries.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': 'ChronosX AI Trading Credits & Subscriptions',
    'url': 'https://chronosx.com/plans',
    'description': 'Choose from flexible credit packages to power your AI trading analyses, strategy backtests, and real-time market queries.',
    'brand': {
        '@type': 'Brand',
        'name': 'ChronosX'
    },
    'offers': {
        '@type': 'AggregateOffer',
        'priceCurrency': 'USD',
        'lowPrice': '0',
        'highPrice': '299',
        'offerCount': '3'
    }
};

export default function PlansPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SubscriptionPlansView />
        </>
    );
}
