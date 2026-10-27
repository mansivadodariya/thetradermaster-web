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
            absolute: `${post.title} | ChronosX Insights`,
        },
        description: post.excerpt,
        alternates: {
            canonical: `https://chronosx.com/blogs/${post.slug}`,
        },
        openGraph: {
            title: `${post.title} | ChronosX Insights`,
            description: post.excerpt,
            url: `https://chronosx.com/blogs/${post.slug}`,
            siteName: 'ChronosX',
            images: [
                {
                    url: post.image || '/assets/logo/logo.png',
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
            title: `${post.title} | ChronosX Insights`,
            description: post.excerpt,
            images: [post.image || '/assets/logo/logo.png'],
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
        'url': `https://chronosx.com/blogs/${post.slug}`,
        'datePublished': post.publishedAt,
        'author': {
            '@type': 'Person',
            'name': post.author?.name || 'ChronosX Research Team',
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'ChronosX',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://chronosx.com/assets/logo/logo.png',
            },
        },
        'image': post.image ? `https://chronosx.com${post.image}` : 'https://chronosx.com/assets/logo/logo.png',
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
