import PublicTechnicalSupport from '@/rendering/publicTechnicalSupport';

export const metadata = {
    title: 'Customer Support — Raise a Query | TraderMaster',
    description:
        'Submit a TraderMaster customer support query with your contact details and an optional screenshot. Our team responds within hours.',
    alternates: {
        canonical: 'https://thetradermaster.com/support-ticket',
    },
    openGraph: {
        title: 'Customer Support — Raise a Query | TraderMaster',
        description:
            'Submit a TraderMaster customer support query with your contact details and an optional screenshot. Our team responds within hours.',
        url: 'https://thetradermaster.com/support-ticket',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'TraderMaster Customer Support',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Customer Support — Raise a Query | TraderMaster',
        description:
            'Submit a TraderMaster customer support query with your contact details and an optional screenshot for faster diagnosis.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'TraderMaster Customer Support',
    url: 'https://thetradermaster.com/support-ticket',
    description:
        'Submit a TraderMaster customer support query with your contact details and an optional screenshot. Our team responds within hours.',
    mainEntity: {
        '@type': 'Organization',
        name: 'TraderMaster',
        url: 'https://thetradermaster.com',
        logo: 'https://thetradermaster.com/assets/logo/logo.png',
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
