import PrivacyPolicy from '@/rendering/privacyPolicy';

export const metadata = {
    title: 'Privacy Policy',
    description: 'Learn how ChronosX collects, uses, and safeguards your personal data and trading privacy.',
    alternates: {
        canonical: 'https://chronosx.com/privacy-policy',
    },
    openGraph: {
        title: 'Privacy Policy | ChronosX',
        description: 'Learn how ChronosX collects, uses, and safeguards your personal data and trading privacy.',
        url: 'https://chronosx.com/privacy-policy',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX Privacy Policy',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Privacy Policy | ChronosX',
        description: 'Learn how ChronosX collects, uses, and safeguards your personal data and trading privacy.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'ChronosX Privacy Policy',
    'url': 'https://chronosx.com/privacy-policy',
    'description': 'Learn how ChronosX collects, uses, and safeguards your personal data and trading privacy.',
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
            <PrivacyPolicy />
        </>
    );
}
