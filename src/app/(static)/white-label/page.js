import WhiteLabel from '@/rendering/whiteLabel';

export const metadata = {
    title: 'White Label AI Trading Platform — Your Brand. Our AI Intelligence | ChronosX',
    description: 'Launch a powerful AI-driven trading platform under your own brand. Give your clients access to advanced market intelligence, AI-powered chart analysis, quantitative tools, and performance analytics.',
    alternates: {
        canonical: 'https://chronosx.com/white-label',
    },
    openGraph: {
        title: 'White Label AI Trading Platform | ChronosX Enterprise',
        description: 'Launch a branded AI trading ecosystem powered by ChronosX institutional intelligence, computer vision chart scanner, and quantitative trading tools.',
        url: 'https://chronosx.com/white-label',
        images: [
            {
                url: '/assets/images/hero-whitelabel.png',
                width: 1200,
                height: 630,
                alt: 'ChronosX White Label Trading Platform'
            }
        ]
    }
};

export default function Page() {
    return <WhiteLabel />;
}
