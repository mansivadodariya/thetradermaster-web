import RiskDisclosure from '@/rendering/riskDisclosure';

export const metadata = {
    title: 'Risk Disclosure Statement',
    description: 'Understand the risks involved in foreign exchange, leveraged trading, and algorithmic market analysis.',
    alternates: {
        canonical: 'https://thetradermaster.com/risk-disclosure',
    },
    openGraph: {
        title: 'Risk Disclosure Statement | TraderMaster',
        description: 'Understand the risks involved in foreign exchange, leveraged trading, and algorithmic market analysis.',
        url: 'https://thetradermaster.com/risk-disclosure',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'TraderMaster Risk Disclosure Statement',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Risk Disclosure Statement | TraderMaster',
        description: 'Understand the risks involved in foreign exchange, leveraged trading, and algorithmic market analysis.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'TraderMaster Risk Disclosure Statement',
    'url': 'https://thetradermaster.com/risk-disclosure',
    'description': 'Understand the risks involved in foreign exchange, leveraged trading, and algorithmic market analysis.',
    'publisher': {
        '@type': 'Organization',
        'name': 'TraderMaster',
        'url': 'https://thetradermaster.com'
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
