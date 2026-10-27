
import { headers, cookies } from "next/headers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HomePage from "@/rendering/home";
import ArabicMetaPixel from "@/components/ArabicMetaPixel";

export const metadata = {
  title: {
    absolute: "TraderMaster — Trade Smarter With AI Signals That Never Sleep",
  },
  description:
    "Get real-time AI trading signals, market insights, and trade recommendations across Forex, Crypto, Stocks, and Global Markets.",
  alternates: {
    canonical: "https://thetradermaster.com",
  },
  openGraph: {
    title: "TraderMaster — Trade Smarter With AI Signals That Never Sleep",
    description:
      "Get real-time AI trading signals, market insights, and trade recommendations across Forex, Crypto, Stocks, and Global Markets.",
    url: "https://thetradermaster.com",
    siteName: "TraderMaster",
    images: [
      {
        url: "/assets/logo/logoWhite.svg",
        width: 1200,
        height: 630,
        alt: "TraderMaster AI Trading Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TraderMaster — Trade Smarter With AI Signals That Never Sleep",
    description:
      "Get real-time AI trading signals, market insights, and trade recommendations across Forex, Crypto, Stocks, and Global Markets.",
    images: ["/assets/logo/logoWhite.svg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://thetradermaster.com/#organization",
      "name": "TraderMaster",
      "url": "https://thetradermaster.com",
      "logo": "https://thetradermaster.com/assets/logo/logo.png",
      "description": "Next-Gen AI Trading Platform & Institutional Market Intelligence Desk."
    },
    {
      "@type": "WebSite",
      "@id": "https://thetradermaster.com/#website",
      "url": "https://thetradermaster.com",
      "name": "TraderMaster",
      "publisher": { "@id": "https://thetradermaster.com/#organization" }
    },
    {
      "@type": "SoftwareApplication",
      "name": "TraderMaster AI Trading Platform",
      "operatingSystem": "Web",
      "applicationCategory": "FinanceApplication",
      "description": "Get real-time AI trading signals, market insights, and trade recommendations across Forex, Crypto, Stocks, and Global Markets.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
};

export default async function Home() {
  let isArabicSSR = false;
  try {
    const headerStore = await headers();
    const headerLang = headerStore.get('x-tradermaster-lang');
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get('app_language')?.value || cookieStore.get('NEXT_LOCALE')?.value;
    isArabicSSR = headerLang === 'ar' || headerLang === 'ary' || cookieLang === 'ar' || cookieLang === 'ary';
  } catch (_) {}

  return (
    <>
      <ArabicMetaPixel initialIsArabic={isArabicSSR} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HomePage />
      <Footer />
    </>
  );
}
