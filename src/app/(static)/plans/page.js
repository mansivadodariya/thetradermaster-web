import SubscriptionPlansView from '@/rendering/plans';

export const metadata = {
    title: 'Pricing Plans & AI Credits',
    description: 'Choose from flexible credit packages to power your AI trading analyses, strategy backtests, and real-time market queries.',
    alternates: {
        canonical: 'https://thetradermaster.com/plans',
    },
    openGraph: {
        title: 'Pricing Plans & AI Credits | TraderMaster',
        description: 'Choose from flexible credit packages to power your AI trading analyses, strategy backtests, and real-time market queries.',
        url: 'https://thetradermaster.com/plans',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'TraderMaster Pricing Plans and AI Credits',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pricing Plans & AI Credits | TraderMaster',
        description: 'Choose from flexible credit packages to power your AI trading analyses, strategy backtests, and real-time market queries.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': 'TraderMaster AI Trading Credits & Subscriptions',
    'url': 'https://thetradermaster.com/plans',
    'description': 'Choose from flexible credit packages to power your AI trading analyses, strategy backtests, and real-time market queries.',
    'brand': {
        '@type': 'Brand',
        'name': 'TraderMaster'
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
