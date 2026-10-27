import PrivacyPolicy from '@/rendering/privacyPolicy';

export const metadata = {
    title: 'Privacy Policy',
    description: 'Learn how TraderMaster collects, uses, and safeguards your personal data and trading privacy.',
    alternates: {
        canonical: 'https://thetradermaster.com/privacy-policy',
    },
    openGraph: {
        title: 'Privacy Policy | TraderMaster',
        description: 'Learn how TraderMaster collects, uses, and safeguards your personal data and trading privacy.',
        url: 'https://thetradermaster.com/privacy-policy',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'TraderMaster Privacy Policy',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Privacy Policy | TraderMaster',
        description: 'Learn how TraderMaster collects, uses, and safeguards your personal data and trading privacy.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'TraderMaster Privacy Policy',
    'url': 'https://thetradermaster.com/privacy-policy',
    'description': 'Learn how TraderMaster collects, uses, and safeguards your personal data and trading privacy.',
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
            <PrivacyPolicy />
        </>
    );
}
