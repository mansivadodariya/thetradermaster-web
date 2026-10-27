import PublicEconomicCalendar from '@/rendering/publicCalendar';

export const metadata = {
    title: 'Global Economic Calendar & Macro Desk',
    description: 'Track high-impact macroeconomic events, central bank interest rate decisions, inflation, and volatility releases in real-time.',
    alternates: {
        canonical: 'https://thetradermaster.com/economic-calendar',
    },
    openGraph: {
        title: 'Global Economic Calendar & Macro Desk | TraderMaster',
        description: 'Track high-impact macroeconomic events, central bank interest rate decisions, inflation, and volatility releases in real-time.',
        url: 'https://thetradermaster.com/economic-calendar',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'TraderMaster Global Economic Calendar & Macro Desk',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Global Economic Calendar & Macro Desk | TraderMaster',
        description: 'Track high-impact macroeconomic events, central bank interest rate decisions, inflation, and volatility releases in real-time.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DataFeed',
    'name': 'TraderMaster Global Economic Calendar',
    'url': 'https://thetradermaster.com/economic-calendar',
    'description': 'Track high-impact macroeconomic events, central bank interest rate decisions, inflation, and volatility releases in real-time.',
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
            <PublicEconomicCalendar />
        </>
    );
}
