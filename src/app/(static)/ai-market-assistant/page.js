import AiChat from "@/rendering/aiChat";

export const metadata = {
    title: "AI Market Assistant — Real-Time Conversational Market Intelligence",
    description:
        "Meet your institutional AI market copilot. Ask any question about technical setups, macroeconomic trends, and risk management with real-time financial context.",
    openGraph: {
        title: "AI Market Assistant — Instant Conversational Market Intelligence | ChronosX",
        description:
            "Instant answers to technical setups, macroeconomic analysis, and strategy feedback powered by ChronosX AI.",
        url: "https://chronosx.com/ai-market-assistant",
        siteName: "ChronosX",
        images: [
            {
                url: "/assets/images/ai-chat.png",
                width: 1200,
                height: 630,
                alt: "ChronosX AI Market Assistant"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Market Assistant — ChronosX",
        description: "Your 24/7 AI-powered market copilot.",
        images: ["/assets/images/ai-chat.png"]
    },
    alternates: {
        canonical: "https://chronosx.com/ai-market-assistant"
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChronosX AI Market Assistant",
    "operatingSystem": "Web",
    "applicationCategory": "FinanceApplication",
    "url": "https://chronosx.com/ai-market-assistant",
    "description": "Meet your institutional AI market copilot. Ask any question about technical setups, macroeconomic trends, and risk management with real-time financial context.",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function AiMarketAssistantPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AiChat />
        </>
    );
}
