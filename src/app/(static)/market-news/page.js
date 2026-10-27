import PublicMarketNews from '@/rendering/publicNews';

export const metadata = {
    title: 'Live Market Intelligence & Financial News',
    description: 'Track breaking global macroeconomic catalysts, market developments, and institutional market sentiment in real time.',
    alternates: {
        canonical: 'https://chronosx.com/market-news',
    },
    openGraph: {
        title: 'Live Market Intelligence & Financial News | ChronosX',
        description: 'Track breaking global macroeconomic catalysts, market developments, and institutional market sentiment in real time.',
        url: 'https://chronosx.com/market-news',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX Live Market Intelligence & Financial News',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Live Market Intelligence & Financial News | ChronosX',
        description: 'Track breaking global macroeconomic catalysts, market developments, and institutional market sentiment in real time.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Live Market Intelligence & Financial News',
    'url': 'https://chronosx.com/market-news',
    'description': 'Track breaking global macroeconomic catalysts, market developments, and institutional market sentiment in real time.',
    'publisher': {
        '@type': 'NewsMediaOrganization',
        'name': 'ChronosX',
        'url': 'https://chronosx.com',
        'logo': 'https://chronosx.com/assets/logo/logo.png'
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
