import TermsAndConditions from '@/rendering/termsAndConditions';

export const metadata = {
    title: 'Terms and Conditions',
    description: 'Read the terms and conditions governing your use of the TraderMaster AI trading platform.',
    alternates: {
        canonical: 'https://thetradermaster.com/terms-and-conditions',
    },
    openGraph: {
        title: 'Terms and Conditions | TraderMaster',
        description: 'Read the terms and conditions governing your use of the TraderMaster AI trading platform.',
        url: 'https://thetradermaster.com/terms-and-conditions',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'TraderMaster Terms and Conditions',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms and Conditions | TraderMaster',
        description: 'Read the terms and conditions governing your use of the TraderMaster AI trading platform.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'TraderMaster Terms and Conditions',
    'url': 'https://thetradermaster.com/terms-and-conditions',
    'description': 'Read the terms and conditions governing your use of the TraderMaster AI trading platform.',
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
            <TermsAndConditions />
        </>
    );
}
