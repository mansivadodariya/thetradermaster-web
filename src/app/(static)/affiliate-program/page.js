import PublicAffiliateView from '@/rendering/publicAffiliate';

export const metadata = {
  title: 'Affiliate Program — Earn Recurring Commissions',
  description: 'Join the TraderMaster Affiliate Program and earn up to 20% recurring commissions by sharing AI-powered trading tools with your audience.',
  alternates: {
    canonical: 'https://thetradermaster.com/affiliate-program',
  },
  openGraph: {
    title: 'Affiliate Program — Earn Recurring Commissions | TraderMaster',
    description: 'Join the TraderMaster Affiliate Program and earn up to 20% recurring commissions by sharing AI-powered trading tools with your audience.',
    url: 'https://thetradermaster.com/affiliate-program',
    siteName: 'TraderMaster',
    images: [
      {
        url: "/assets/logo/logoWhite.svg",
        width: 1200,
        height: 630,
        alt: 'TraderMaster Affiliate Program',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affiliate Program — Earn Recurring Commissions | TraderMaster',
    description: 'Join the TraderMaster Affiliate Program and earn up to 20% recurring commissions by sharing AI-powered trading tools with your audience.',
    images: ["/assets/logo/logoWhite.svg"],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  'name': 'TraderMaster Affiliate Program',
  'url': 'https://thetradermaster.com/affiliate-program',
  'description': 'Earn up to 20% recurring commissions by sharing AI-powered trading tools with your audience.',
  'provider': {
    '@type': 'Organization',
    'name': 'TraderMaster',
    'url': 'https://thetradermaster.com'
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
