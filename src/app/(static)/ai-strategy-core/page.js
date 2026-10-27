import AiStrategyPage from "@/rendering/aiStrategyPage";

export const metadata = {
    title: "AI Trading Signal — Algorithmic Playbooks & Strategy Engine | ChronosX",
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

export default function AiStrategyCorePage() {
    return <AiStrategyPage />;
}
