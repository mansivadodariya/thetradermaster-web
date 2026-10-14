import { Plus_Jakarta_Sans, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ToastProvider } from "@/components/toast";
import WhatsappButton from "@/components/whatsappButton";
import { LanguageProvider } from "@/context/LanguageContext";

const plusSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

const robotoSans = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL("https://thetradermaster.com"),
  title: {
    default: "Trader Master — AI-Powered Forex Intelligence",
    template: "%s | Trader Master",
  },
  description:
    "Trader Master delivers AI-powered Forex analysis, chart reading, trade signals, and strategy generation built around MT5 and the AvaTrade brokerage stack.",
  keywords: ["forex", "trading", "AI", "trade analysis", "MT5", "trade signals", "Trader Master"],
  authors: [{ name: "Trader Master" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Trader Master — AI-Powered Forex Intelligence",
    description:
      "AI-powered Forex intelligence for serious traders. Chart reading, trade analysis, and strategy generation.",
    siteName: "Trader Master",
    url: "https://thetradermaster.com",
    type: "website",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Trader Master AI Trading",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trader Master — AI-Powered Forex Intelligence",
    description:
      "AI-powered Forex intelligence for serious traders. Chart reading, trade analysis, and strategy generation.",
    images: ["/assets/images/new-hero-banner.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${robotoSans.variable} ${plusSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preload" href="/assets/images/new-hero-banner.webp" as="image" type="image/webp" fetchPriority="high" />
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var isDashboard = /^\\/(dashboard|ai-assistant|ai-strategy|credit-history|economic-calendar|profile|settings|trade-snap)/.test(window.location.pathname);
                if (isDashboard && localStorage.getItem('theme') !== 'light') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }

                var storedLang = localStorage.getItem('app_language');
                if (storedLang === 'ar') {
                  document.documentElement.setAttribute('lang', 'ar');
                  document.documentElement.setAttribute('dir', 'rtl');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TWNPPGX2CM"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-TWNPPGX2CM');
          `}
        </Script>
        <LanguageProvider>
          <ToastProvider>
            {children}
            <WhatsappButton />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
