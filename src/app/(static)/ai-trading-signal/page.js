import AiStrategyPage from "@/rendering/aiStrategyPage";

export const metadata = {
    title: "AI Trading Signal — Algorithmic Playbooks & Strategy Engine",
    description:
        "Select custom algorithmic strategies, explore high-conviction quantitative rule playbooks, and execute data-backed trades with multi-factor confluence.",
    openGraph: {
        title: "AI Trading Signal — Algorithmic Playbooks & Strategy Engine | ChronosX",
        description:
            "Select custom algorithmic strategies and deploy institutional rule playbooks with multi-factor confluence.",
        url: "https://chronosx.com/ai-trading-signal",
        siteName: "ChronosX",
        images: [
            {
                url: "/assets/images/ai-strategy.png",
                width: 1200,
                height: 630,
                alt: "ChronosX AI Trading Signal"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Trading Signal — ChronosX Strategy Engine",
        description:
            "Explore, backtest, and deploy algorithmic trading strategies with institutional accuracy metrics on ChronosX.",
        images: ["/assets/images/ai-strategy.png"]
    },
    alternates: {
        canonical: "https://chronosx.com/ai-trading-signal"
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChronosX AI Trading Signal Engine",
    "operatingSystem": "Web",
    "applicationCategory": "FinanceApplication",
    "url": "https://chronosx.com/ai-trading-signal",
    "description": "Select custom algorithmic strategies, explore high-conviction quantitative rule playbooks, and execute data-backed trades.",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function AiTradingSignalPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AiStrategyPage />
        </>
    );
}
