import BlogDetailView from '@/rendering/blogDetail';
import { BLOG_POSTS } from '@/rendering/blogs/data';

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

    return {
        title: {
            absolute: `${post.title} | TraderMaster Insights`,
        },
        description: post.excerpt,
        alternates: {
            canonical: `https://thetradermaster.com/blogs/${post.slug}`,
        },
        openGraph: {
            title: `${post.title} | TraderMaster Insights`,
            description: post.excerpt,
            url: `https://thetradermaster.com/blogs/${post.slug}`,
            siteName: 'TraderMaster',
            images: [
                {
                    url: post.image || "/assets/logo/logoWhite.svg",
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            locale: 'en_US',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${post.title} | TraderMaster Insights`,
            description: post.excerpt,
            images: [post.image || "/assets/logo/logoWhite.svg"],
        },
    };
}

export default async function BlogDetailsPage({ params }) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.excerpt,
        'url': `https://thetradermaster.com/blogs/${post.slug}`,
        'datePublished': post.publishedAt,
        'author': {
            '@type': 'Person',
            'name': post.author?.name || 'TraderMaster Research Team',
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'TraderMaster',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://thetradermaster.com/assets/logo/logo.png',
            },
        },
        'image': post.image ? `https://thetradermaster.com${post.image}` : 'https://thetradermaster.com/assets/logo/logo.png',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogDetailView slug={slug} />
        </>
    );
}
