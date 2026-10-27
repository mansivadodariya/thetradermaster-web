import AiChat from "@/rendering/aiChat";
import React from "react";

export const metadata = {
  title: "AI Forex Trading Assistant & Market Chat | Trader Master",
  description:
    "Chat with Trader Master's real-time AI trading copilot for technical indicators, Forex news sentiment, pair forecasts, and risk management.",
  alternates: {
    canonical: "/ai-chat",
  },
  openGraph: {
    title: "AI Forex Trading Assistant & Market Chat | Trader Master",
    description:
      "Chat with Trader Master's real-time AI trading copilot for technical indicators, Forex news sentiment, pair forecasts, and risk management.",
    url: "https://thetradermaster.com/ai-chat",
    siteName: "Trader Master",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Trader Master AI Assistant Chat",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Forex Trading Assistant & Market Chat | Trader Master",
    description:
      "Chat with Trader Master's real-time AI trading copilot for technical indicators, Forex news sentiment, pair forecasts, and risk management.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Trader Master AI Assistant Chat",
  "operatingSystem": "Web",
  "applicationCategory": "FinanceApplication",
  "url": "https://thetradermaster.com/ai-chat",
  "description": "Real-time AI trading copilot for Forex technical analysis, pair forecasts, and market insights."
};

export default function page() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiChat />
    </div>
  );
}
