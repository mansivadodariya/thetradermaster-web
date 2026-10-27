import TradeSnapPage from "@/rendering/tradeSnapPage";
import React from "react";

export const metadata = {
  title: "TradeSnap — Instant AI Trading Chart Reader & Setup Analysis",
  description:
    "Upload MT5 or TradingView chart screenshots to TradeSnap for instant AI technical analysis, support/resistance detection, and trade setup scoring.",
  alternates: {
    canonical: "/tradesnap",
  },
  openGraph: {
    title: "TradeSnap — Instant AI Trading Chart Reader & Setup Analysis",
    description:
      "Upload MT5 or TradingView chart screenshots to TradeSnap for instant AI technical analysis, support/resistance detection, and trade setup scoring.",
    url: "https://thetradermaster.com/tradesnap",
    siteName: "Trader Master",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "TradeSnap AI Chart Analysis",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeSnap — Instant AI Trading Chart Reader & Setup Analysis",
    description:
      "Upload MT5 or TradingView chart screenshots to TradeSnap for instant AI technical analysis, support/resistance detection, and trade setup scoring.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TradeSnap AI Chart Reader",
  "operatingSystem": "Web",
  "applicationCategory": "FinanceApplication",
  "url": "https://thetradermaster.com/tradesnap",
  "description": "Instant AI trading chart reader. Upload MT5 or TradingView chart screenshots to analyze support, resistance, and market setups."
};

export default function page() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TradeSnapPage />
    </div>
  );
}
