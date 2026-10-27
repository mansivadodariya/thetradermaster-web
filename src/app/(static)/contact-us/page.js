import ContactUs from '@/rendering/contactUs';

export const metadata = {
    title: 'Contact Us — 24/7 AI Trading Desk & Support',
    description: 'Get in touch with the TraderMaster AI trading team, quantitative support desk, and institutional partnership specialists. 24/7 live assistance.',
    alternates: {
        canonical: 'https://thetradermaster.com/contact-us',
    },
    openGraph: {
        title: 'Contact Us — 24/7 AI Trading Desk & Support | TraderMaster',
        description: 'Get in touch with the TraderMaster AI trading team, quantitative support desk, and institutional partnership specialists. 24/7 live assistance.',
        url: 'https://thetradermaster.com/contact-us',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'Contact TraderMaster AI Trading Desk',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us — 24/7 AI Trading Desk & Support | TraderMaster',
        description: 'Get in touch with the TraderMaster AI trading team, quantitative support desk, and institutional partnership specialists.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact TraderMaster AI Trading Desk',
    'url': 'https://thetradermaster.com/contact-us',
    'description': 'Get in touch with the TraderMaster AI trading team, quantitative support desk, and institutional partnership specialists.',
    'mainEntity': {
        '@type': 'Organization',
        'name': 'TraderMaster',
        'url': 'https://thetradermaster.com',
        'logo': 'https://thetradermaster.com/assets/logo/logo.png',
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
