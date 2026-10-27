import BlogsListing from '@/rendering/blogs';

export const metadata = {
    title: 'Institutional Research & Trading Insights',
    description: 'Expert analysis, Smart Money Concepts, Order Block breakdowns, and algorithmic FX strategies from institutional trading veterans.',
    alternates: {
        canonical: 'https://thetradermaster.com/blogs',
    },
    openGraph: {
        title: 'Institutional Research & Trading Insights | TraderMaster',
        description: 'Expert analysis, Smart Money Concepts, Order Block breakdowns, and algorithmic FX strategies from institutional trading veterans.',
        url: 'https://thetradermaster.com/blogs',
        siteName: 'TraderMaster',
        images: [
            {
                url: "/assets/logo/logoWhite.svg",
                width: 1200,
                height: 630,
                alt: 'TraderMaster Institutional Research & Trading Insights',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Institutional Research & Trading Insights | TraderMaster',
        description: 'Expert analysis, Smart Money Concepts, Order Block breakdowns, and algorithmic FX strategies.',
        images: ["/assets/logo/logoWhite.svg"],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'TraderMaster Institutional Research & Trading Insights',
    'url': 'https://thetradermaster.com/blogs',
    'description': 'Expert analysis, Smart Money Concepts, Order Block breakdowns, and algorithmic FX strategies from institutional trading veterans.',
    'publisher': {
        '@type': 'Organization',
        'name': 'TraderMaster',
        'url': 'https://thetradermaster.com',
        'logo': 'https://thetradermaster.com/assets/logo/logo.png'
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
