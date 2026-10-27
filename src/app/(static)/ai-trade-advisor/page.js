import AiPastTradeAnalyzer from "@/rendering/aiPastTradeAnalyzer";

export const metadata = {
    title: "AI Trade Advisor — Learn From Every Trade & Eliminate Leaks",
    description:
        "Upload your past trade screenshots and statements to get instant AI-powered advice and audits. Identify poor entries, risk management errors, market structure conflicts, and execution mistakes to trade smarter.",
    openGraph: {
        title: "AI Trade Advisor — Learn From Every Trade | ChronosX",
        description:
            "Stop guessing why you lost. Let ChronosX AI analyze your completed trade screenshots, detect execution flaws, and give you actionable improvements in seconds.",
        url: "https://chronosx.com/ai-trade-advisor",
        siteName: "ChronosX",
        images: [
            {
                url: "/assets/images/ai-past-trade-analyzer/brain-pedestal.jpg",
                width: 1200,
                height: 630,
                alt: "ChronosX AI Trade Advisor"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Trade Advisor — ChronosX",
        description:
            "Your past trades have the answers. Deep AI advice for your entries, exits, risk management, and execution mistakes.",
        images: ["/assets/images/ai-past-trade-analyzer/brain-pedestal.jpg"]
    },
    alternates: {
        canonical: "https://chronosx.com/ai-trade-advisor"
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChronosX AI Trade Advisor",
    "operatingSystem": "Web",
    "applicationCategory": "FinanceApplication",
    "url": "https://chronosx.com/ai-trade-advisor",
    "description": "Upload your past trade screenshots and statements to get instant AI-powered advice and audits. Identify poor entries and execution mistakes.",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function AiTradeAdvisorPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AiPastTradeAnalyzer />
        </>
    );
}
