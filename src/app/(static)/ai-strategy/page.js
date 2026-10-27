import React from "react";
import AiStrategyPage from "@/rendering/aiStrategyPage";

export const metadata = {
  title: "AI Strategy Generator & Backtesting Engine | Trader Master",
  description:
    "Create, backtest, and refine automated Forex and MT5 trading strategies powered by deep learning AI and real-time market data.",
  alternates: {
    canonical: "/ai-strategy",
  },
  openGraph: {
    title: "AI Strategy Generator & Backtesting Engine | Trader Master",
    description:
      "Create, backtest, and refine automated Forex and MT5 trading strategies powered by deep learning AI and real-time market data.",
    url: "https://thetradermaster.com/ai-strategy",
    siteName: "Trader Master",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "AI Strategy Builder",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Strategy Generator & Backtesting Engine | Trader Master",
    description:
      "Create, backtest, and refine automated Forex and MT5 trading strategies powered by deep learning AI and real-time market data.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Trader Master AI Strategy Generator",
  "operatingSystem": "Web",
  "applicationCategory": "FinanceApplication",
  "url": "https://thetradermaster.com/ai-strategy",
  "description": "Algorithmic strategy builder and MT5 backtesting engine powered by artificial intelligence."
};

export default function Page() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiStrategyPage />
    </div>
  );
}
