import PublicAffiliateView from '@/rendering/publicAffiliate';

export const metadata = {
  title: 'Affiliate Program — Earn Recurring Commissions',
  description: 'Join the ChronosX Affiliate Program and earn up to 20% recurring commissions by sharing AI-powered trading tools with your audience.',
  alternates: {
    canonical: 'https://chronosx.com/affiliate-program',
  },
  openGraph: {
    title: 'Affiliate Program — Earn Recurring Commissions | ChronosX',
    description: 'Join the ChronosX Affiliate Program and earn up to 20% recurring commissions by sharing AI-powered trading tools with your audience.',
    url: 'https://chronosx.com/affiliate-program',
    siteName: 'ChronosX',
    images: [
      {
        url: '/assets/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'ChronosX Affiliate Program',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affiliate Program — Earn Recurring Commissions | ChronosX',
    description: 'Join the ChronosX Affiliate Program and earn up to 20% recurring commissions by sharing AI-powered trading tools with your audience.',
    images: ['/assets/logo/logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  'name': 'ChronosX Affiliate Program',
  'url': 'https://chronosx.com/affiliate-program',
  'description': 'Earn up to 20% recurring commissions by sharing AI-powered trading tools with your audience.',
  'provider': {
    '@type': 'Organization',
    'name': 'ChronosX',
    'url': 'https://chronosx.com'
  }
};

export default function AffiliateProgramPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicAffiliateView />
    </>
  );
}
