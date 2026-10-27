import ContactUs from '@/rendering/contactUs';

export const metadata = {
    title: 'Contact Us — 24/7 AI Trading Desk & Support',
    description: 'Get in touch with the ChronosX AI trading team, quantitative support desk, and institutional partnership specialists. 24/7 live assistance.',
    alternates: {
        canonical: 'https://chronosx.com/contact-us',
    },
    openGraph: {
        title: 'Contact Us — 24/7 AI Trading Desk & Support | ChronosX',
        description: 'Get in touch with the ChronosX AI trading team, quantitative support desk, and institutional partnership specialists. 24/7 live assistance.',
        url: 'https://chronosx.com/contact-us',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'Contact ChronosX AI Trading Desk',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us — 24/7 AI Trading Desk & Support | ChronosX',
        description: 'Get in touch with the ChronosX AI trading team, quantitative support desk, and institutional partnership specialists.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact ChronosX AI Trading Desk',
    'url': 'https://chronosx.com/contact-us',
    'description': 'Get in touch with the ChronosX AI trading team, quantitative support desk, and institutional partnership specialists.',
    'mainEntity': {
        '@type': 'Organization',
        'name': 'ChronosX',
        'url': 'https://chronosx.com',
        'logo': 'https://chronosx.com/assets/logo/logo.png',
        'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Customer Support',
            'availableLanguage': ['English', 'Arabic']
        }
    }
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ContactUs />
        </>
    );
}
