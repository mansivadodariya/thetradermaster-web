import BacktestingView from '@/rendering/backtesting';

export const metadata = {
  title: 'Backtesting Engine — Test Ideas & Trade With Confidence',
  description: 'Validate your trading strategies, bots, and custom ideas using historical market data. Analyze win rate, profit factor, drawdown, and optimize before going live.',
  alternates: {
    canonical: 'https://thetradermaster.com/backtesting',
  },
  openGraph: {
    title: 'Backtesting Engine — Test Ideas & Trade With Confidence | TraderMaster',
    description: 'Validate your trading strategies, bots, and custom ideas using historical market data. Analyze win rate, profit factor, drawdown, and optimize before going live.',
    url: 'https://thetradermaster.com/backtesting',
    siteName: 'TraderMaster',
    images: [
      {
        url: "/assets/logo/logoWhite.svg",
        width: 1200,
        height: 630,
        alt: 'TraderMaster Backtesting Engine',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backtesting Engine — Test Ideas & Trade With Confidence | TraderMaster',
    description: 'Validate your trading strategies, bots, and custom ideas using historical market data.',
    images: ["/assets/logo/logoWhite.svg"],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  'name': 'TraderMaster Backtesting Engine',
  'operatingSystem': 'Web',
  'applicationCategory': 'FinanceApplication',
  'url': 'https://thetradermaster.com/backtesting',
  'description': 'Validate your trading strategies, bots, and custom ideas using historical market data. Analyze win rate, profit factor, drawdown, and optimize before going live.',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD'
  }
};

export default function BacktestingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BacktestingView />
    </>
  );
}
