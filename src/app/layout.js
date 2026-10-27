import { headers, cookies } from "next/headers";
import { Anton, Plus_Jakarta_Sans, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ToastProvider } from "@/components/toast";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import SmoothScrollProvider from "@/components/smoothScroll";
import ClientOnlyWidgets from "@/components/ClientOnlyWidgets";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { normalizeLocale, SUPPORTED_LOCALES, RTL_LOCALES } from "@/locales";

const antonSans = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
});

const plusSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

const robotoSans = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: 'swap',
});

export const viewport = {
  themeColor: "#08140F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://thetradermaster.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TraderMaster',
  },
  title: {
    default: "TraderMaster — Next-Gen AI Trading Platform & Intelligence Desk",
    template: "%s | TraderMaster"
  },
  description: "Next-gen AI trading platform providing real-time AI trading signals, instant neural chart pattern recognition, and multi-market insights across Forex, Stocks, and Commodities.",
  authors: [{ name: "The Trader Master", url: "https://thetradermaster.com" }],
  creator: "The Trader Master",
  publisher: "The Trader Master",
  category: "Finance & Trading Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://thetradermaster.com',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thetradermaster.com",
    title: "TraderMaster — Next-Gen AI Trading Platform & Intelligence Desk",
    description: "Trade smarter with AI that never sleeps. Real-time AI trading signals, instant neural chart insights, and algorithmic market analysis.",
    siteName: "TraderMaster",
    images: [
      {
        url: "/assets/logo/logoWhite.svg",
        width: 1200,
        height: 630,
        alt: "TraderMaster AI Trading Desk"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TraderMaster — Next-Gen AI Trading Platform & Intelligence Desk",
    description: "Trade smarter with AI that never sleeps. Real-time AI trading signals, instant neural chart insights, and algorithmic market analysis.",
    images: ["/assets/logo/logoWhite.svg"],
    creator: "@thetradermaster",
    site: "@thetradermaster",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/assets/logo/smallLogo.svg", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/assets/logo/smallLogo.svg", type: "image/png" },
    ],
  },
};

export default async function RootLayout({ children }) {
  let lang = 'en';
  try {
    const headerStore = await headers();
    const headerLang = headerStore.get('x-tradermaster-lang');
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get('app_language')?.value || cookieStore.get('NEXT_LOCALE')?.value;
    const candidate = normalizeLocale(headerLang || cookieLang);
    if (candidate && SUPPORTED_LOCALES.includes(candidate)) {
      lang = candidate;
    }
  } catch (_) {}

  const isRtl = RTL_LOCALES.includes(lang);
  const dir = isRtl ? 'rtl' : 'ltr';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://thetradermaster.com/#organization",
        "name": "The Trader Master",
        "alternateName": "TraderMaster AI Trading Platform",
        "url": "https://thetradermaster.com",
        "logo": "https://thetradermaster.com/assets/logo/logo.png",
        "description": "TraderMaster is a financial technology software provider delivering non-custodial AI market intelligence, neural chart pattern recognition, and quantitative trading signals.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Dubai Silicon Oasis, IFZA Business Park, Building A1",
          "addressLocality": "Dubai",
          "addressCountry": "AE"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "support@thetradermaster.com",
          "contactType": "customer support"
        },
        "sameAs": [
          "https://x.com/thetradermaster",
          "https://t.me/thetradermaster",
          "https://www.youtube.com/@thetradermaster",
          "https://www.instagram.com/thetradermaster",
          "https://www.facebook.com/profile.php?id=61594721187286",
          "https://discord.gg/uPTwM59wY"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://thetradermaster.com/#website",
        "url": "https://thetradermaster.com",
        "name": "TraderMaster",
        "publisher": { "@id": "https://thetradermaster.com/#organization" }
      }
    ]
  };

  return (
    <html lang={lang} dir={dir} className={`${antonSans.variable} ${robotoSans.variable} ${plusSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(storedTheme);
                document.documentElement.setAttribute('data-theme', storedTheme);

                var pathSeg = (window.location.pathname.split('/')[1] || '').toLowerCase();
                var queryMatch = ((window.location.search.match(/[?&](?:lang|locale)=([a-zA-Z_-]+)/) || [])[1] || '').toLowerCase();
                var aliases = {
                  ar: 'ar', arabic: 'ar',
                  ary: 'ary', darija: 'ary', moroccan: 'ary',
                  es: 'es', spanish: 'es', espanol: 'es',
                  ru: 'ru', russian: 'ru',
                  zh: 'zh', chinese: 'zh',
                  vi: 'vi', vietnamese: 'vi',
                  id: 'id', indonesian: 'id',
                  fil: 'fil', filipino: 'fil', tagalog: 'fil', ph: 'fil',
                  en: 'en', english: 'en'
                };
                var matched = aliases[queryMatch] || aliases[pathSeg];
                var storedLang = matched || localStorage.getItem('app_language') || (document.cookie.match(/app_language=([a-z]+)/) || [])[1] || '${lang}';
                var canonical = aliases[storedLang] || '${lang}';
                if (matched) {
                  localStorage.setItem('app_language', canonical);
                  document.cookie = 'app_language=' + canonical + '; path=/; max-age=31536000; SameSite=Lax';
                }
                document.documentElement.setAttribute('lang', canonical);
                document.documentElement.setAttribute('dir', (canonical === 'ar' || canonical === 'ary') ? 'rtl' : 'ltr');
              } catch (_) {}
            `,
          }}
        />
        <Script
          id="pwa-sw-registration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(e) {});
                });
              }
            `,
          }}
        />
        <Script
          id="reduced-motion-detector"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
                if (mq.matches) {
                  document.documentElement.classList.add('reduce-motion');
                }
                mq.addEventListener('change', function(e) {
                  if (e.matches) {
                    document.documentElement.classList.add('reduce-motion');
                  } else {
                    document.documentElement.classList.remove('reduce-motion');
                  }
                });
              } catch (_) {}
            `,
          }}
        />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "yrb44c8pan");
            `,
          }}
        />
        <ThemeProvider>
          <LanguageProvider initialLanguage={lang}>
            <ToastProvider>
              <SmoothScrollProvider>
                <GoogleAnalytics />
                {children}
                <ClientOnlyWidgets />
              </SmoothScrollProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
