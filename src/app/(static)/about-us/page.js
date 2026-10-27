import AboutUs from '@/rendering/aboutUs';

export const metadata = {
    title: 'About Us — Institutional AI Market Infrastructure',
    description: 'Learn about TraderMaster, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
    alternates: {
        canonical: 'https://thetradermaster.com/about-us',
    },
    openGraph: {
        title: 'About Us — Institutional AI Market Infrastructure | TraderMaster',
        description: 'Learn about TraderMaster, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
        url: 'https://thetradermaster.com/about-us',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'About TraderMaster Institutional AI Market Infrastructure',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us — Institutional AI Market Infrastructure | TraderMaster',
        description: 'Learn about TraderMaster, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About TraderMaster',
    'url': 'https://thetradermaster.com/about-us',
    'description': 'Learn about TraderMaster, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
    'mainEntity': {
        '@type': 'Organization',
        'name': 'TraderMaster',
        'url': 'https://thetradermaster.com',
        'logo': 'https://thetradermaster.com/assets/logo/logo.png'
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
