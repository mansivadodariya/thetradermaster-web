import ContactUs from "@/rendering/contactUs";
import React from "react";

export const metadata = {
  title: "Contact Trader Master | Support, Partnerships & Inquiries",
  description:
    "Get in touch with the Trader Master team for customer support, broker partnership opportunities, custom AI API solutions, and media inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Trader Master | Support, Partnerships & Inquiries",
    description:
      "Get in touch with the Trader Master team for customer support, broker partnership opportunities, custom AI API solutions, and media inquiries.",
    url: "https://thetradermaster.com/contact",
    siteName: "Trader Master",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Contact Trader Master",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Trader Master | Support, Partnerships & Inquiries",
    description:
      "Get in touch with the Trader Master team for customer support, broker partnership opportunities, custom AI API solutions, and media inquiries.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Trader Master",
  "url": "https://thetradermaster.com/contact",
  "description": "Get in touch with Trader Master support and partnerships."
};

export default function page() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactUs />
    </div>
  );
}
