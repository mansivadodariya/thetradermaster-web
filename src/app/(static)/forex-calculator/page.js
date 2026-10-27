import PublicForexCalculator from '@/rendering/publicCalculator';

export const metadata = {
    title: 'Free Forex & Trading Calculators',
    description: 'Precision pip value calculator, margin requirements, Fibonacci retracements, pivot points, and position sizing risk calculator.',
    alternates: {
        canonical: 'https://thetradermaster.com/forex-calculator',
    },
    openGraph: {
        title: 'Free Forex & Trading Calculators | TraderMaster',
        description: 'Precision pip value calculator, margin requirements, Fibonacci retracements, pivot points, and position sizing risk calculator.',
        url: 'https://thetradermaster.com/forex-calculator',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'TraderMaster Free Forex & Trading Calculators',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Forex & Trading Calculators | TraderMaster',
        description: 'Precision pip value calculator, margin requirements, Fibonacci retracements, pivot points, and position sizing risk calculator.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'TraderMaster Precision Forex & Trading Calculators',
    'url': 'https://thetradermaster.com/forex-calculator',
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'Web',
    'description': 'Precision pip value calculator, margin requirements, Fibonacci retracements, pivot points, and position sizing risk calculator.',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
    }
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PublicForexCalculator />
        </>
    );
}
