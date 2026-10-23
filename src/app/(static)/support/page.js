import React from 'react';
import CustomerSupport from '@/rendering/customerSupport';

export const metadata = {
    title: 'Customer Support | Trader Master Help Desk',
    description:
        'Get in touch with Trader Master customer support. Submit a support ticket for technical help, MT5 connectivity, and platform features.',
    alternates: {
        canonical: '/support',
    },
    openGraph: {
        title: 'Customer Support | Trader Master Help Desk',
        description:
            'Get in touch with Trader Master customer support. Submit a support ticket for technical help, MT5 connectivity, and platform features.',
        url: 'https://thetradermaster.com/support',
        siteName: 'Trader Master',
        images: [
            {
                url: '/assets/images/new-hero-banner.png',
                width: 1200,
                height: 630,
                alt: 'Trader Master Customer Support',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Customer Support | Trader Master Help Desk',
        description:
            'Get in touch with Trader Master customer support. Submit a support ticket for technical help, MT5 connectivity, and platform features.',
        images: ['/assets/images/new-hero-banner.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Trader Master Customer Support',
    url: 'https://thetradermaster.com/support',
    description: 'Submit customer support and technical tickets to Trader Master.',
};

export default function PublicSupportPage() {
    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CustomerSupport isDashboard={false} />
        </div>
    );
}
