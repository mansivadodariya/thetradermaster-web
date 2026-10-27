
import { headers, cookies } from "next/headers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HomePage from "@/rendering/home";
import ArabicMetaPixel from "@/components/ArabicMetaPixel";

export const metadata = {
  title: {
    absolute: "ChronosX — Trade Smarter With AI Signals That Never Sleep",
  },
  description:
    "Get real-time AI trading signals, market insights, and trade recommendations across Forex, Crypto, Stocks, and Global Markets.",
  alternates: {
    canonical: "https://chronosx.com",
  },
  openGraph: {
    title: "ChronosX — Trade Smarter With AI Signals That Never Sleep",
    description:
      "Get real-time AI trading signals, market insights, and trade recommendations across Forex, Crypto, Stocks, and Global Markets.",
    url: "https://chronosx.com",
    siteName: "ChronosX",
    images: [
      {
        url: "/assets/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "ChronosX AI Trading Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChronosX — Trade Smarter With AI Signals That Never Sleep",
    description:
      "Get real-time AI trading signals, market insights, and trade recommendations across Forex, Crypto, Stocks, and Global Markets.",
    images: ["/assets/logo/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://chronosx.com/#organization",
      "name": "ChronosX",
      "url": "https://chronosx.com",
      "logo": "https://chronosx.com/assets/logo/logo.png",
      "description": "Next-Gen AI Trading Platform & Institutional Market Intelligence Desk."
    },
    {
      "@type": "WebSite",
      "@id": "https://chronosx.com/#website",
      "url": "https://chronosx.com",
      "name": "ChronosX",
      "publisher": { "@id": "https://chronosx.com/#organization" }
    },
    {
      "@type": "SoftwareApplication",
      "name": "ChronosX AI Trading Platform",
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
    const headerLang = headerStore.get('x-chronosx-lang');
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
