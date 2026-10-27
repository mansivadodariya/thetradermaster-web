import PublicForexCalculator from '@/rendering/publicCalculator';

export const metadata = {
    title: 'Free Forex & Trading Calculators',
    description: 'Precision pip value calculator, margin requirements, Fibonacci retracements, pivot points, and position sizing risk calculator.',
    alternates: {
        canonical: 'https://chronosx.com/forex-calculator',
    },
    openGraph: {
        title: 'Free Forex & Trading Calculators | ChronosX',
        description: 'Precision pip value calculator, margin requirements, Fibonacci retracements, pivot points, and position sizing risk calculator.',
        url: 'https://chronosx.com/forex-calculator',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX Free Forex & Trading Calculators',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Forex & Trading Calculators | ChronosX',
        description: 'Precision pip value calculator, margin requirements, Fibonacci retracements, pivot points, and position sizing risk calculator.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'ChronosX Precision Forex & Trading Calculators',
    'url': 'https://chronosx.com/forex-calculator',
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
