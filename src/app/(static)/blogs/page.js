import BlogsListing from '@/rendering/blogs';

export const metadata = {
    title: 'Institutional Research & Trading Insights',
    description: 'Expert analysis, Smart Money Concepts, Order Block breakdowns, and algorithmic FX strategies from institutional trading veterans.',
    alternates: {
        canonical: 'https://chronosx.com/blogs',
    },
    openGraph: {
        title: 'Institutional Research & Trading Insights | ChronosX',
        description: 'Expert analysis, Smart Money Concepts, Order Block breakdowns, and algorithmic FX strategies from institutional trading veterans.',
        url: 'https://chronosx.com/blogs',
        siteName: 'ChronosX',
        images: [
            {
                url: '/assets/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX Institutional Research & Trading Insights',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Institutional Research & Trading Insights | ChronosX',
        description: 'Expert analysis, Smart Money Concepts, Order Block breakdowns, and algorithmic FX strategies.',
        images: ['/assets/logo/logo.png'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'ChronosX Institutional Research & Trading Insights',
    'url': 'https://chronosx.com/blogs',
    'description': 'Expert analysis, Smart Money Concepts, Order Block breakdowns, and algorithmic FX strategies from institutional trading veterans.',
    'publisher': {
        '@type': 'Organization',
        'name': 'ChronosX',
        'url': 'https://chronosx.com',
        'logo': 'https://chronosx.com/assets/logo/logo.png'
    }
};

export default function BlogsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogsListing />
        </>
    );
}
