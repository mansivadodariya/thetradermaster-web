import AboutUs from '@/rendering/aboutUs';

export const metadata = {
    title: 'About Us — Institutional AI Market Infrastructure',
    description: 'Learn about ChronosX, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
    alternates: {
        canonical: 'https://chronosx.com/about-us',
    },
    openGraph: {
        title: 'About Us — Institutional AI Market Infrastructure | ChronosX',
        description: 'Learn about ChronosX, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
        url: 'https://chronosx.com/about-us',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'About ChronosX Institutional AI Market Infrastructure',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us — Institutional AI Market Infrastructure | ChronosX',
        description: 'Learn about ChronosX, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About ChronosX',
    'url': 'https://chronosx.com/about-us',
    'description': 'Learn about ChronosX, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
    'mainEntity': {
        '@type': 'Organization',
        'name': 'ChronosX',
        'url': 'https://chronosx.com',
        'logo': 'https://chronosx.com/assets/logo/logo.png'
    }
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AboutUs />
        </>
    );
}
