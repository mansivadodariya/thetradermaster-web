import WhiteLabel from '@/rendering/whiteLabel';

export const metadata = {
    title: 'White Label AI Trading Platform — Your Brand. Our AI Intelligence | TraderMaster',
    description: 'Launch a powerful AI-driven trading platform under your own brand. Give your clients access to advanced market intelligence, AI-powered chart analysis, quantitative tools, and performance analytics.',
    alternates: {
        canonical: 'https://thetradermaster.com/white-label',
    },
    openGraph: {
        title: 'White Label AI Trading Platform | TraderMaster Enterprise',
        description: 'Launch a branded AI trading ecosystem powered by TraderMaster institutional intelligence, computer vision chart scanner, and quantitative trading tools.',
        url: 'https://thetradermaster.com/white-label',
        images: [
            {
                url: '/assets/images/hero-whitelabel.png',
                width: 1200,
                height: 630,
                alt: 'TraderMaster White Label Trading Platform'
            }
        ]
    }
};

export default function Page() {
    return <WhiteLabel />;
}
