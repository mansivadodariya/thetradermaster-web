export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chronosx.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard/', '/profile/', '/credit-history/', '/onboarding/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
