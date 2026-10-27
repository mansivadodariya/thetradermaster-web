import BacktestingView from '@/rendering/backtesting';

export const metadata = {
  title: 'Backtesting Engine — Test Ideas & Trade With Confidence',
  description: 'Validate your trading strategies, bots, and custom ideas using historical market data. Analyze win rate, profit factor, drawdown, and optimize before going live.',
  alternates: {
    canonical: 'https://chronosx.com/backtesting',
  },
  openGraph: {
    title: 'Backtesting Engine — Test Ideas & Trade With Confidence | ChronosX',
    description: 'Validate your trading strategies, bots, and custom ideas using historical market data. Analyze win rate, profit factor, drawdown, and optimize before going live.',
    url: 'https://chronosx.com/backtesting',
    siteName: 'ChronosX',
    images: [
      {
        url: '/assets/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'ChronosX Backtesting Engine',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backtesting Engine — Test Ideas & Trade With Confidence | ChronosX',
    description: 'Validate your trading strategies, bots, and custom ideas using historical market data.',
    images: ['/assets/logo/logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  'name': 'ChronosX Backtesting Engine',
  'operatingSystem': 'Web',
  'applicationCategory': 'FinanceApplication',
  'url': 'https://chronosx.com/backtesting',
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
