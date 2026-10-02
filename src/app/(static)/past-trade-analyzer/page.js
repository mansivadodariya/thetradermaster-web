import React from "react";
import PastTradeAnalyzerPage from "@/rendering/pastTradeAnalyzer";

export const metadata = {
  title: "Past Trade Analyzer — AI Trading Journal & Audit | Trader Master",
  description:
    "Audit past MT5 trades with Trader Master's AI trade reviewer. Identify win/loss patterns, optimize risk-reward ratios, and eliminate trading mistakes.",
  alternates: {
    canonical: "/past-trade-analyzer",
  },
  openGraph: {
    title: "Past Trade Analyzer — AI Trading Journal & Audit | Trader Master",
    description:
      "Audit past MT5 trades with Trader Master's AI trade reviewer. Identify win/loss patterns, optimize risk-reward ratios, and eliminate trading mistakes.",
    url: "https://thetradermaster.com/past-trade-analyzer",
    siteName: "Trader Master",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Past Trade Analyzer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Past Trade Analyzer — AI Trading Journal & Audit | Trader Master",
    description:
      "Audit past MT5 trades with Trader Master's AI trade reviewer. Identify win/loss patterns, optimize risk-reward ratios, and eliminate trading mistakes.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the Past Trade Analyzer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Past Trade Analyzer reviews historical MT5 trade entries, stop losses, and take profits to help traders identify mistakes and optimize win rates."
      }
    },
    {
      "@type": "Question",
      "name": "How does AI audit past Forex trades?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By evaluating trade parameters, market volatility, indicator alignment, and risk-reward ratios at the exact moment of trade execution."
      }
    }
  ]
};

export default function Page() {
  return (
    <div style={{ backgroundColor: "#030E09" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PastTradeAnalyzerPage />
    </div>
  );
}
