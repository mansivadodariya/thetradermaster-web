import AiStrategyPage from "@/rendering/aiStrategyPage";

export const metadata = {
    title: "Signal Terminal — Real-Time Algorithmic Market Signals | ChronosX",
    description:
        "Experience real-time institutional FX and Crypto intelligence. Track live 100-point Technical Scores across major pairs, momentum breakouts, and algorithmic alerts.",
    openGraph: {
        title: "Signal Terminal — Real-Time Breakout Signals & Technical Scoring | ChronosX",
        description:
            "Track live 100-point Technical Scores across 6+ Forex pairs. 4-pillar algorithmic evaluation covering Trend, Momentum, Volume, and Structure.",
        url: "https://chronosx.com/live-market-scanner",
        siteName: "ChronosX",
        images: [
            {
                url: "/assets/images/ai-strategy.png",
                width: 1200,
                height: 630,
                alt: "ChronosX Signal Terminal"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Signal Terminal — ChronosX Signal Terminal",
        description:
            "Real-time breakout scanner and institutional algorithmic confluence across major assets.",
        images: ["/assets/images/ai-strategy.png"]
    },
    alternates: {
        canonical: "https://chronosx.com/live-market-scanner"
    }
};

export default function LiveMarketScannerPage() {
    return <AiStrategyPage />;
}
