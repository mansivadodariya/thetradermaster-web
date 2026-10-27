import AiTrade from "@/rendering/aiTrade";

export const metadata = {
    title: "AI Chart Scanner — Instant Vision AI Technical Pattern Scanner",
    description:
        "Upload any TradingView, MT4/MT5, or broker chart screenshot and get instant institutional AI trade signals. Dual Vision AI and live MT5 indicator confluence with precise Entry, Stop-Loss, and Multi-TP targets.",
    openGraph: {
        title: "AI Chart Scanner — Instant Vision AI Technical Pattern Scanner | ChronosX",
        description:
            "Upload any TradingView, MT4/MT5, or broker chart screenshot and get instant institutional AI trade signals.",
        url: "https://chronosx.com/ai-chart-scanner",
        siteName: "ChronosX",
        images: [
            {
                url: "/assets/images/ai-trade.png",
                width: 1200,
                height: 630,
                alt: "ChronosX AI Chart Scanner"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Chart Scanner — ChronosX Vision Scanner",
        description:
            "Upload any chart screenshot and receive precise BUY / SELL / NO-TRADE execution setups in seconds.",
        images: ["/assets/images/ai-trade.png"]
    },
    alternates: {
        canonical: "https://chronosx.com/ai-chart-scanner"
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChronosX AI Chart Scanner",
    "operatingSystem": "Web",
    "applicationCategory": "FinanceApplication",
    "url": "https://chronosx.com/ai-chart-scanner",
    "description": "Upload any TradingView, MT4/MT5, or broker chart screenshot and get instant institutional AI trade signals with Entry, Stop-Loss, and Multi-TP targets.",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function AiChartScannerPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AiTrade />
        </>
    );
}
