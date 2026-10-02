import HomePage from "@/rendering/home";

export const metadata = {
  title: "Trader Master — #1 AI Forex Trading Assistant & MT5 Signal Analysis",
  description:
    "Trader Master delivers AI-powered Forex analysis, technical chart reading, real-time trade signals, and automated strategy generation for MT5 traders.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Trader Master — #1 AI Forex Trading Assistant & MT5 Signal Analysis",
    description:
      "Trader Master delivers AI-powered Forex analysis, technical chart reading, real-time trade signals, and automated strategy generation for MT5 traders.",
    url: "https://thetradermaster.com",
    siteName: "Trader Master",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Trader Master AI Trading Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trader Master — #1 AI Forex Trading Assistant & MT5 Signal Analysis",
    description:
      "Trader Master delivers AI-powered Forex analysis, technical chart reading, real-time trade signals, and automated strategy generation for MT5 traders.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://thetradermaster.com/#organization",
      "name": "Trader Master",
      "url": "https://thetradermaster.com",
      "logo": "https://thetradermaster.com/assets/images/logo.png",
      "sameAs": []
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://thetradermaster.com/#application",
      "name": "Trader Master",
      "operatingSystem": "Web, iOS, Android, Windows, MT5",
      "applicationCategory": "FinanceApplication",
      "url": "https://thetradermaster.com",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "AI-powered Forex intelligence, automated chart reading, trade signals, and MT5 strategy generation platform."
    }
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}
