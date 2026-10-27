import AiStrategyPage from "@/rendering/aiStrategyPage";

export const metadata = {
    title: "AI Trading Signal — Algorithmic Playbooks & Strategy Engine | TraderMaster",
    description:
        "Select custom algorithmic strategies, explore high-conviction quantitative rule playbooks, and execute data-backed trades with multi-factor confluence.",
    openGraph: {
        title: "AI Trading Signal — Algorithmic Playbooks & Strategy Engine | TraderMaster",
        description:
            "Select custom algorithmic strategies and deploy institutional rule playbooks with multi-factor confluence.",
        url: "https://thetradermaster.com/ai-trading-signal",
        siteName: "TraderMaster",
        images: [
            {
                url: "/assets/images/ai-strategy.png",
                width: 1200,
                height: 630,
                alt: "TraderMaster AI Trading Signal"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Trading Signal — TraderMaster Strategy Engine",
        description:
            "Explore, backtest, and deploy algorithmic trading strategies with institutional accuracy metrics on TraderMaster.",
        images: ["/assets/images/ai-strategy.png"]
    },
    alternates: {
        canonical: "https://thetradermaster.com/ai-trading-signal"
    }
};

export default function StrategyHubPage() {
    return <AiStrategyPage />;
}
