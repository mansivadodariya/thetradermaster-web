import TermsAndConditions from '@/rendering/termsAndConditions';

export const metadata = {
    title: 'Terms and Conditions',
    description: 'Read the terms and conditions governing your use of the ChronosX AI trading platform.',
    alternates: {
        canonical: 'https://chronosx.com/terms-and-conditions',
    },
    openGraph: {
        title: 'Terms and Conditions | ChronosX',
        description: 'Read the terms and conditions governing your use of the ChronosX AI trading platform.',
        url: 'https://chronosx.com/terms-and-conditions',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX Terms and Conditions',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms and Conditions | ChronosX',
        description: 'Read the terms and conditions governing your use of the ChronosX AI trading platform.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'ChronosX Terms and Conditions',
    'url': 'https://chronosx.com/terms-and-conditions',
    'description': 'Read the terms and conditions governing your use of the ChronosX AI trading platform.',
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
            <TermsAndConditions />
        </>
    );
}
