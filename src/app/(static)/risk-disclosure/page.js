import RiskDisclosure from '@/rendering/riskDisclosure';

export const metadata = {
    title: 'Risk Disclosure Statement',
    description: 'Understand the risks involved in foreign exchange, leveraged trading, and algorithmic market analysis.',
    alternates: {
        canonical: 'https://chronosx.com/risk-disclosure',
    },
    openGraph: {
        title: 'Risk Disclosure Statement | ChronosX',
        description: 'Understand the risks involved in foreign exchange, leveraged trading, and algorithmic market analysis.',
        url: 'https://chronosx.com/risk-disclosure',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX Risk Disclosure Statement',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Risk Disclosure Statement | ChronosX',
        description: 'Understand the risks involved in foreign exchange, leveraged trading, and algorithmic market analysis.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'ChronosX Risk Disclosure Statement',
    'url': 'https://chronosx.com/risk-disclosure',
    'description': 'Understand the risks involved in foreign exchange, leveraged trading, and algorithmic market analysis.',
    'publisher': {
        '@type': 'Organization',
        'name': 'ChronosX',
        'url': 'https://chronosx.com'
    }
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RiskDisclosure />
        </>
    );
}
