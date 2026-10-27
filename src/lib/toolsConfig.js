import toolsData from '@/data/toolsData.json';

export const TOOLS = toolsData.tools;
export const UTILITY_TOOLS = toolsData.utilityTools;

export const ALL_TOOLS = [...TOOLS, ...UTILITY_TOOLS];

/**
 * Maps any pathname (new or legacy, outer or inner) to the standard tool tab name.
 */
export const ROUTE_TAB_MAP = {
  '/dashboard': 'Dashboard',
  // AI Chart Scanner
  '/chart-scanner': 'AI Chart Scanner',
  '/ai-chart-scanner': 'AI Chart Scanner',

  // AI Past Trade Analyzer
  '/trade-audit': 'AI Past Trade Analyzer',
  '/ai-trade-audit': 'AI Past Trade Analyzer',
  '/trade-advisor': 'AI Past Trade Analyzer',
  '/ai-trade-advisor': 'AI Past Trade Analyzer',

  // AI Trading Bot Suite
  '/my-bots': 'My Bots',
  '/ai-bot-builder': 'AI Bot Builder',
  '/manual-bot-builder': 'Custom Bot Builder',
  '/custom-bot-builder': 'Custom Bot Builder',
  '/ai-trading-bot-builder': 'Custom Bot Builder',
  '/bot-library': 'Browse Bots Library',
  '/browse-bots': 'Browse Bots Library',
  '/bot-builder': 'AI Bot Builder',
  '/strategy-studio': 'AI Bot Builder',
  '/ai-strategy-studio': 'AI Bot Builder',
  '/backtest': 'Backtest',
  '/backtesting': 'Backtest',

  // AI Market Assistant
  '/market-assistant': 'AI Market Assistant',
  '/ai-market-assistant': 'AI Market Assistant',

  // Signal Terminal
  '/live-scanner': 'Signal Terminal',
  '/live-market-scanner': 'Signal Terminal',
  '/signal-terminal': 'Signal Terminal',

  // AI Trading Signal
  '/trading-signal': 'AI Trading Signal',
  '/ai-trading-signal': 'AI Trading Signal',
  '/strategy-hub': 'AI Trading Signal',
  '/ai-strategy-hub': 'AI Trading Signal',
  '/strategy-core': 'AI Trading Signal',
  '/ai-strategy-core': 'AI Trading Signal',
  '/strategy-hub/live': 'Signal Terminal',
  '/strategy-hub/strategy': 'Strategy Signal',
  '/strategy-signal': 'Strategy Signal',
  '/predefined-strategies': 'Predefined Strategies',

  // Utility Tools
  '/tools': 'Tools',
  '/calendar': 'Economic Calendar',
  '/economic-calendar': 'Economic Calendar',
  '/calculator': 'Forex Calculator',
  '/forex-calculator': 'Forex Calculator',
  '/news': 'Market News',
  '/market-news': 'Market News',

  // System & Account
  '/credit-history': 'Credit History',
  '/plans': 'Subscription Plans',
  '/subscription-plans': 'Subscription Plans',
  '/broker': 'Broker',
  '/brokers': 'Broker',
  '/affiliate': 'Affiliate',
  '/dashboard/affiliate': 'Affiliate',
  '/profile': 'Profile',
  '/settings': 'Profile',
};

/**
 * Get tool definition by id.
 */
export function getToolById(id) {
  return ALL_TOOLS.find((t) => t.id === id);
}

/**
 * Get tool by any route (inner, outer, or legacy).
 */
export function getToolByRoute(pathname) {
  if (!pathname) return null;
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/';
  return ALL_TOOLS.find(
    (t) =>
      t.innerRoute === cleanPath ||
      t.outerRoute === cleanPath ||
      t.legacyRoutes?.includes(cleanPath)
  );
}

export default toolsData;
