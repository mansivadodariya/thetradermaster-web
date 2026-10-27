import AiPastTradeAnalyzer from "@/rendering/aiPastTradeAnalyzer";

export const metadata = {
    title: "AI Trade Advisor — Learn From Every Trade & Eliminate Leaks | TraderMaster",
    description:
        "Upload your past trade screenshots and statements to get instant AI-powered advice and audits. Identify poor entries, risk management errors, market structure conflicts, and execution mistakes to trade smarter.",
    openGraph: {
        title: "AI Trade Advisor — Learn From Every Trade | TraderMaster",
        description:
            "Stop guessing why you lost. Let TraderMaster AI analyze your completed trade screenshots, detect execution flaws, and give you actionable improvements in seconds.",
        url: "https://thetradermaster.com/ai-trade-advisor",
        siteName: "TraderMaster",
        images: [
            {
                url: "/assets/images/ai-past-trade-analyzer/brain-pedestal.jpg",
                width: 1200,
                height: 630,
                alt: "TraderMaster AI Trade Advisor"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Trade Advisor — TraderMaster",
        description:
            "Your past trades have the answers. Deep AI advice for your entries, exits, risk management, and execution mistakes.",
        images: ["/assets/images/ai-past-trade-analyzer/brain-pedestal.jpg"]
    },
    alternates: {
        canonical: "https://thetradermaster.com/ai-trade-advisor"
    }
};

export default function AiTradeAuditPage() {
    return <AiPastTradeAnalyzer />;
}
