import TermsAndConditions from "@/rendering/termsAndConditions";
import React from "react";

export const metadata = {
  title: "Terms & Conditions | Trader Master",
  description:
    "Read Trader Master's terms of service, platform usage conditions, subscription billing rules, and financial disclaimers.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Trader Master",
    description:
      "Read Trader Master's terms of service, platform usage conditions, subscription billing rules, and financial disclaimers.",
    url: "https://thetradermaster.com/terms-and-conditions",
    siteName: "Trader Master",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Trader Master Terms & Conditions",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Trader Master",
    description:
      "Read Trader Master's terms of service, platform usage conditions, subscription billing rules, and financial disclaimers.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Terms and Conditions - Trader Master",
  "url": "https://thetradermaster.com/terms-and-conditions"
};

export default function page() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TermsAndConditions />
    </div>
  );
}
