import PublicMarketNews from '@/rendering/publicNews';

export const metadata = {
    title: 'Live Market Intelligence & Financial News',
    description: 'Track breaking global macroeconomic catalysts, market developments, and institutional market sentiment in real time.',
    alternates: {
        canonical: 'https://thetradermaster.com/market-news',
    },
    openGraph: {
        title: 'Live Market Intelligence & Financial News | TraderMaster',
        description: 'Track breaking global macroeconomic catalysts, market developments, and institutional market sentiment in real time.',
        url: 'https://thetradermaster.com/market-news',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'TraderMaster Live Market Intelligence & Financial News',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Live Market Intelligence & Financial News | TraderMaster',
        description: 'Track breaking global macroeconomic catalysts, market developments, and institutional market sentiment in real time.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Live Market Intelligence & Financial News',
    'url': 'https://thetradermaster.com/market-news',
    'description': 'Track breaking global macroeconomic catalysts, market developments, and institutional market sentiment in real time.',
    'publisher': {
        '@type': 'NewsMediaOrganization',
        'name': 'TraderMaster',
        'url': 'https://thetradermaster.com',
        'logo': 'https://thetradermaster.com/assets/logo/logo.png'
    }
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PublicMarketNews />
        </>
    );
}
