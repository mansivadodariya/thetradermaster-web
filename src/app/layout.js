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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://chronosx.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ChronosX',
  },
  title: {
    default: "ChronosX — Next-Gen AI Trading Platform & Intelligence Desk",
    template: "%s | ChronosX"
  },
  description: "Next-gen AI trading platform providing real-time AI trading signals, instant neural chart pattern recognition, and multi-market insights across Forex, Stocks, and Commodities.",
  authors: [{ name: "ChronosX Financial Technologies FZ-LLC", url: "https://chronosx.com" }],
  creator: "ChronosX Financial Technologies FZ-LLC",
  publisher: "ChronosX Financial Technologies FZ-LLC",
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
    canonical: 'https://chronosx.com',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chronosx.com",
    title: "ChronosX — Next-Gen AI Trading Platform & Intelligence Desk",
    description: "Trade smarter with AI that never sleeps. Real-time AI trading signals, instant neural chart insights, and algorithmic market analysis.",
    siteName: "ChronosX",
    images: [
      {
        url: "/assets/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "ChronosX AI Trading Desk"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ChronosX — Next-Gen AI Trading Platform & Intelligence Desk",
    description: "Trade smarter with AI that never sleeps. Real-time AI trading signals, instant neural chart insights, and algorithmic market analysis.",
    images: ["/assets/logo/logo.png"],
    creator: "@ChronosX_AI",
    site: "@ChronosX_AI",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/assets/logo/smallLogo.png", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/assets/logo/smallLogo.png", type: "image/png" },
    ],
  },
};

export default async function RootLayout({ children }) {
  let lang = 'en';
  try {
    const headerStore = await headers();
    const headerLang = headerStore.get('x-chronosx-lang');
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
        "@id": "https://chronosx.com/#organization",
        "name": "ChronosX Financial Technologies FZ-LLC",
        "alternateName": "ChronosX AI Trading Platform",
        "url": "https://chronosx.com",
        "logo": "https://chronosx.com/assets/logo/logo.png",
        "description": "ChronosX is a financial technology software provider delivering non-custodial AI market intelligence, neural chart pattern recognition, and quantitative trading signals.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Dubai Silicon Oasis, IFZA Business Park, Building A1",
          "addressLocality": "Dubai",
          "addressCountry": "AE"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "support@chronosx.com",
          "contactType": "customer support"
        },
        "sameAs": [
          "https://x.com/ChronosX_Official",
          "https://t.me/chronosxofficial",
          "https://www.youtube.com/@Chronosx_Official",
          "https://www.instagram.com/chronosx_official/",
          "https://www.facebook.com/profile.php?id=61594721187286",
          "https://discord.gg/uPTwM59wY"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://chronosx.com/#website",
        "url": "https://chronosx.com",
        "name": "ChronosX",
        "publisher": { "@id": "https://chronosx.com/#organization" }
      }
    ]
  };

  return (
    <html lang={lang} dir={dir} className={`${antonSans.variable} ${robotoSans.variable} ${plusSans.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
      </head>
      <body suppressHydrationWarning>
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
