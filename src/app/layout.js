import { Plus_Jakarta_Sans, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ToastProvider } from "@/components/toast";
import WhatsappButton from "@/components/whatsappButton";
import { LanguageProvider } from "@/context/LanguageContext";
import { AiAssistantJobProvider } from "@/context/AiAssistantJobContext";
import NotificationPopup from "@/components/notificationPopup";

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
  metadataBase: new URL("https://thetradeexpert.com"),
  title: {
    default: "The Trade Expert — AI-Powered Forex Intelligence",
    template: "%s | The Trade Expert",
  },
  description:
    "The Trade Expert delivers AI-powered Forex analysis, chart reading, trade signals, and strategy generation built around MT5 and the Newera brokerage stack.",
  keywords: ["forex", "trading", "AI", "trade analysis", "MT5", "trade signals", "The Trade Expert"],
  authors: [{ name: "The Trade Expert" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Trade Expert — AI-Powered Forex Intelligence",
    description:
      "AI-powered Forex intelligence for serious traders. Chart reading, trade analysis, and strategy generation.",
    siteName: "The Trade Expert",
    url: "https://thetradeexpert.com",
    type: "website",
    images: [
      {
        url: "/assets/images/new-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "The Trade Expert AI Trading",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Trade Expert — AI-Powered Forex Intelligence",
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
                var isDashboard = /^\\/(dashboard|ai-assistant|ai-strategy|credit-history|economic-calendar|profile|settings|trade-snap|ai-chart-scanner)/.test(window.location.pathname);
                if (isDashboard && localStorage.getItem('theme') !== 'light') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }

                var storedLang = localStorage.getItem('app_language');
                if (storedLang) {
                  document.documentElement.setAttribute('lang', storedLang);
                  if (storedLang === 'ar' || storedLang === 'ma') {
                    document.documentElement.setAttribute('dir', 'rtl');
                  } else {
                    document.documentElement.setAttribute('dir', 'ltr');
                  }
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PX1KYEDKMJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-PX1KYEDKMJ');
          `}
        </Script>
        <LanguageProvider>
          <ToastProvider>
            <AiAssistantJobProvider>
              {children}
            </AiAssistantJobProvider>
            <NotificationPopup />
            <WhatsappButton />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
