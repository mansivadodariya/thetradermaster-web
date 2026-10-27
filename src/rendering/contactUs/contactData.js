// Curated List of Global Countries
export const COUNTRIES = [
    'United Arab Emirates',
    'United States',
    'United Kingdom',
    'India',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Singapore',
    'Switzerland',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'South Africa',
    'Nigeria',
    'Egypt',
    'Turkey',
    'Malaysia',
    'Indonesia',
    'Thailand',
    'Vietnam',
    'Philippines',
    'Japan',
    'South Korea',
    'Hong Kong',
    'Netherlands',
    'Sweden',
    'Norway',
    'Spain',
    'Italy',
    'Brazil',
    'Mexico',
    'Other'
];

export const getContactFaqs = (t) => [
    {
        q: t('contactUs.faqQ1', 'How fast will I receive a response from the TraderMaster team?'),
        a: t('contactUs.faqA1', 'Our support routing system prioritizes urgent trading requests immediately. General inquiries are typically answered within 15 minutes, while VIP and Institutional partners receive direct Slack/Telegram channels with sub-5-minute SLA.')
    },
    {
        q: t('contactUs.faqQ2', 'Can I integrate TraderMaster AI signals directly into my MT5 or broker account?'),
        a: t('contactUs.faqA2', 'Yes! TraderMaster provides ultra-low latency webhook APIs, MT5 bridge connectors, and automated signal alerts compatible with leading prop firms and global brokers.')
    },
    {
        q: t('contactUs.faqQ3', 'Do you offer 1-on-1 personalized demo onboarding?'),
        a: t('contactUs.faqA3', 'Absolutely. If you represent an institutional fund, prop firm, or are a high-volume trader looking for custom algorithmic indicators, please reach out via the form to schedule a private walkthrough.')
    },
    {
        q: t('contactUs.faqQ4', 'How do I request a custom technical indicator or algorithmic strategy?'),
        a: t('contactUs.faqA4', 'Submit your message with your exact specifications, chart timeframe requirements, and risk parameters. Our quant engineering team will review and respond with feasibility estimates.')
    },
    {
        q: t('contactUs.faqQ5', 'What is your security and data privacy protocol for trading accounts?'),
        a: t('contactUs.faqA5', 'TraderMaster adheres to strict zero-knowledge encryption protocols. We never store personal broker credentials or execute unauthorized trades. All analytical and OCR chart vision data is transmitted via end-to-end TLS 1.3 encryption.')
    }
];
