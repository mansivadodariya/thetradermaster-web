import PrivacyPolicy from "@/rendering/privacyPolicy";
import React from "react";

export const metadata = {
  title: "Privacy Policy | Trader Master",
  description:
    "Read the official privacy policy of Trader Master. Learn how we safeguard your personal data, trading account details, and data security.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Trader Master",
    description:
      "Read the official privacy policy of Trader Master. Learn how we safeguard your personal data, trading account details, and data security.",
    url: "https://thetradermaster.com/privacy-policy",
    siteName: "Trader Master",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Trader Master Privacy Policy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Trader Master",
    description:
      "Read the official privacy policy of Trader Master. Learn how we safeguard your personal data, trading account details, and data security.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Privacy Policy - Trader Master",
  "url": "https://thetradermaster.com/privacy-policy"
};

export default function page() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyPolicy />
    </div>
  );
}
