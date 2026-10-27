import PublicEconomicCalendar from '@/rendering/publicCalendar';

export const metadata = {
    title: 'Global Economic Calendar & Macro Desk',
    description: 'Track high-impact macroeconomic events, central bank interest rate decisions, inflation, and volatility releases in real-time.',
    alternates: {
        canonical: 'https://chronosx.com/economic-calendar',
    },
    openGraph: {
        title: 'Global Economic Calendar & Macro Desk | ChronosX',
        description: 'Track high-impact macroeconomic events, central bank interest rate decisions, inflation, and volatility releases in real-time.',
        url: 'https://chronosx.com/economic-calendar',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX Global Economic Calendar & Macro Desk',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Global Economic Calendar & Macro Desk | ChronosX',
        description: 'Track high-impact macroeconomic events, central bank interest rate decisions, inflation, and volatility releases in real-time.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DataFeed',
    'name': 'ChronosX Global Economic Calendar',
    'url': 'https://chronosx.com/economic-calendar',
    'description': 'Track high-impact macroeconomic events, central bank interest rate decisions, inflation, and volatility releases in real-time.',
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
            <PublicEconomicCalendar />
        </>
    );
}
