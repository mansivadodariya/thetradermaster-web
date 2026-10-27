import {
  DashboardGridIcon,
  AiTradeSparkIcon,
  AiChatBotIcon,
  AiStrategyIcon,
  CalendarIcon,
  ToolsIcon,
  CreditShieldIcon,
  BrokerBankIcon,
  ProfileUserIcon,
  CrownIcon,
  AiTradeAnalysisIcon,
  AffiliateIcon,
  LiveAnalysisIcon,
  StrategyIcon,
  BotBuilderIcon,
  PredefinedStrategyIcon,
  MyBotsIcon,
  AiBotSparkIcon,
  CustomBotIcon,
  BotLibraryIcon,
  SubCalendarIcon,
  SubCalculatorIcon,
  EducationIcon,
  SupportTicketIcon,
} from '@/icons/sidebarIcons';

export const BrandDarkLogo = "/assets/logo/darklogo.png";
export const BrandLightLogo = "/assets/logo/logo.png";
export const SmallLogo = "/assets/logo/smallLogo.png";

export const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const getNavSections = (t) => [
  {
    title: t('sidebar.workspace', 'WORKSPACE'),
    items: [
      { label: t('nav.dashboard', 'Dashboard'), href: "/dashboard", icon: DashboardGridIcon },
      { label: t('nav.marketAssistant', 'AI Market Assistant'), href: "/market-assistant", icon: AiChatBotIcon },
      { label: t('nav.chartScanner', 'AI Chart Scanner'), href: "/chart-scanner", icon: AiTradeSparkIcon },
      { label: t('nav.tradeAudit', 'AI Past Trade Analyzer'), href: "/trade-advisor", icon: AiTradeAnalysisIcon },
      {
        label: t('nav.strategyHub', 'AI Trading Signal'),
        href: "/trading-signal",
        icon: AiStrategyIcon,
        subItems: [
          { label: t('nav.strategySignal', 'Strategy Signal'), href: "/strategy-signal", icon: StrategyIcon },
          { label: t('nav.signalTerminal', 'Signal Terminal'), href: "/signal-terminal", icon: LiveAnalysisIcon },
          { label: t('nav.predefinedStrategies', 'Predefined Strategies'), href: "/predefined-strategies", icon: PredefinedStrategyIcon },
        ]
      },
      {
        label: t('nav.aiTradingBot', 'AI Trading Bot'),
        href: "/my-bots",
        icon: BotBuilderIcon,
        subItems: [
          { label: t('nav.myBots', 'My Bots'), href: "/my-bots", icon: MyBotsIcon },
          { label: t('nav.aiBotBuilder', 'AI Bot Builder'), href: "/ai-bot-builder", icon: AiBotSparkIcon },
          { label: t('nav.customBotBuilder', 'Custom Bot Builder'), href: "/manual-bot-builder", icon: CustomBotIcon },
          { label: t('nav.botLibrary', 'Browse Bots Library'), href: "/bot-library", icon: BotLibraryIcon },
        ]
      },
    ]
  },
  {
    title: t('sidebar.more', 'MORE'),
    items: [
      {
        label: t('nav.tools', 'Tools'),
        href: "/tools",
        icon: ToolsIcon,
        subItems: [
          { label: t('nav.economicCalendar', 'Economic Calendar'), href: "/calendar", icon: SubCalendarIcon },
          { label: t('nav.forexCalculator', 'Forex Calculator'), href: "/calculator", icon: SubCalculatorIcon },
          { label: t('nav.education', 'Education'), href: "https://edufins.com", icon: EducationIcon, isExternal: true },
        ]
      },
      { label: t('nav.plans', 'Subscription Plans'), href: "/subscription-plans", icon: CrownIcon },
      { label: t('nav.broker', 'Associated Brokers'), href: "/brokers", icon: BrokerBankIcon },
      { label: t('nav.affiliate', 'Affiliate Program'), href: "/affiliate", icon: AffiliateIcon },
      { label: t('nav.profile', 'Settings'), href: "/profile", icon: ProfileUserIcon },
      { label: t('nav.customerSupport', 'Customer Support'), href: "/support", icon: SupportTicketIcon },
    ]
  }
];

export const SUPPORTED_LOCALES = ['en', 'ar', 'ary', 'es', 'ru', 'zh', 'vi', 'id', 'fil', 'arabic', 'spanish', 'russian', 'chinese', 'vietnamese', 'indonesian', 'filipino', 'darija'];

export function stripLocalePrefix(path) {
  if (!path) return '/';
  const clean = path.split('?')[0].replace(/\/$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  if (parts.length > 0 && SUPPORTED_LOCALES.includes(parts[0].toLowerCase())) {
    const withoutLocale = '/' + parts.slice(1).join('/');
    return withoutLocale === '' ? '/' : withoutLocale;
  }
  return clean;
}

export function getLocalizedHref(href, lang) {
  if (!href || href.startsWith('http')) return href;
  const clean = stripLocalePrefix(href);
  const currentLang = lang || 'en';
  return clean === '/' ? `/${currentLang}` : `/${currentLang}${clean}`;
}

/** Match current route to nav item (handles trailing slashes, locale prefixes, and nested paths). */
export function isNavItemActive(pathname, href, search = '') {
  if (!pathname || !href) return false;
  const current = stripLocalePrefix(pathname);
  const target = stripLocalePrefix(href);
  if (current === target || (target !== '/' && current.startsWith(`${target}/`))) return true;

  // Handle /backtest and /backtesting route matching to AI Trading Bot or AI Trading Signal
  if (current === '/backtest' || current === '/backtesting') {
    let queryStr = search;
    if (!queryStr && typeof window !== 'undefined') {
      queryStr = window.location.search || '';
    }
    const params = new URLSearchParams(queryStr);
    const source = (params.get('source') || '').toLowerCase();

    // If redirected from Predefined Strategies / AI Trading Signal
    if (source === 'trading_strategies' || source.includes('signal') || source.includes('trading_strat')) {
      if (target === '/predefined-strategies' || target === '/trading-signal') {
        return true;
      }
    } else {
      // Default: redirected from My Bots / Bot Builder (AI Trading Bot suite)
      if (target === '/my-bots' || target === '/ai-trading-bot') {
        return true;
      }
    }
  }

  return false;
}
