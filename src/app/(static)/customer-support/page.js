import PublicTechnicalSupport from '@/rendering/publicTechnicalSupport';

export const metadata = {
    title: 'Customer Support — Raise a Query | ChronosX',
    description:
        'Submit a ChronosX customer support query with your contact details and an optional screenshot. Our team responds within hours.',
    alternates: {
        canonical: 'https://chronosx.com/customer-support',
    },
    openGraph: {
        title: 'Customer Support — Raise a Query | ChronosX',
        description:
            'Submit a ChronosX customer support query with your contact details and an optional screenshot. Our team responds within hours.',
        url: 'https://chronosx.com/customer-support',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX Customer Support',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Customer Support — Raise a Query | ChronosX',
        description:
            'Submit a ChronosX customer support query with your contact details and an optional screenshot for faster diagnosis.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'ChronosX Customer Support',
    url: 'https://chronosx.com/customer-support',
    description:
        'Submit a ChronosX customer support query with your contact details and an optional screenshot. Our team responds within hours.',
    mainEntity: {
        '@type': 'Organization',
        name: 'ChronosX',
        url: 'https://chronosx.com',
        logo: 'https://chronosx.com/assets/logo/logo.png',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Support',
            availableLanguage: ['English', 'Arabic'],
        },
    },
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PublicTechnicalSupport />
        </>
    );
}
