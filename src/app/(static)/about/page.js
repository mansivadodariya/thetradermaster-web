import AboutUs from "@/rendering/aboutUs";
import React from "react";

export const metadata = {
  title: "About Trader Master | Next-Generation AI Trading Intelligence",
  description:
    "Discover how Trader Master empowers traders globally with institutional-grade AI chart analysis, algorithmic strategies, and MT5 market insights.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Trader Master | Next-Generation AI Trading Intelligence",
    description:
      "Discover how Trader Master empowers traders globally with institutional-grade AI chart analysis, algorithmic strategies, and MT5 market insights.",
    url: "https://thetradermaster.com/about",
    siteName: "Trader Master",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "About Trader Master",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Trader Master | Next-Generation AI Trading Intelligence",
    description:
      "Discover how Trader Master empowers traders globally with institutional-grade AI chart analysis, algorithmic strategies, and MT5 market insights.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Trader Master",
  "url": "https://thetradermaster.com/about",
  "description": "Discover Trader Master's mission to deliver institutional-grade AI chart analysis and Forex trading copilot tools."
};

export default function page() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutUs />
    </div>
  );
}
