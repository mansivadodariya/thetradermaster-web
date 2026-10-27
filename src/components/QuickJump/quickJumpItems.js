import React from 'react';
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
    BotBuilderIcon,
    MyBotsIcon,
    AiBotSparkIcon,
    CustomBotIcon,
    BotLibraryIcon,
    BacktestIcon,
    SupportTicketIcon,
} from '@/icons/sidebarIcons';

const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const LiveAnalysisIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

const SubCalculatorIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="18" />
        <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
    </svg>
);

const SubNewsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
    </svg>
);

// --- Quick Jump Navigation Items Dynamic Generator ---
export const getQuickJumpSections = (t) => [
    {
        categoryKey: 'general',
        category: t('quickJump.catGeneral', 'General'),
        items: [
            {
                id: 'home',
                title: t('nav.home', 'Home'),
                subtitle: t('quickJump.homeSub', 'Return to TraderMaster main landing'),
                href: '/',
                keywords: ['home', 'landing', 'main', 'start'],
                icon: <HomeIcon />,
            },
            {
                id: 'dashboard',
                title: t('nav.dashboard', 'Dashboard'),
                subtitle: t('quickJump.dashboardSub', 'Executive account overview & KPI analytics'),
                href: '/dashboard',
                keywords: ['dashboard', 'kpi', 'stats', 'analytics', 'overview', 'pnl'],
                icon: <DashboardGridIcon />,
            },
            {
                id: 'profile',
                title: t('quickJump.profileTitle', 'Trader Profile'),
                subtitle: t('quickJump.profileSub', 'Security, personal details & settings'),
                href: '/profile',
                keywords: ['profile', 'settings', 'user', 'account', 'security', 'preferences'],
                icon: <ProfileUserIcon />,
            },
            {
                id: 'customer-support',
                title: t('nav.customerSupport', 'Customer Support'),
                subtitle: t('quickJump.customerSupportSub', 'Raise a query for product or account help'),
                href: '/support',
                keywords: ['support', 'ticket', 'help', 'customer', 'technical', 'contact', 'issue', 'query', 'bug'],
                icon: <SupportTicketIcon />,
            },
        ],
    },
    {
        categoryKey: 'trading',
        category: t('quickJump.catTrading', 'Trading'),
        items: [
            {
                id: 'signal-terminal',
                title: t('nav.liveMarketScanner', 'Signal Terminal'),
                subtitle: t('quickJump.liveScannerSub', 'Live algorithmic market scanner, momentum radar & alerts'),
                href: '/signal-terminal',
                keywords: ['signal', 'terminal', 'live', 'scanner', 'trading', 'chart', 'watchlist', 'mt5', 'stream', 'order', 'forex', 'market', 'analysis'],
                icon: <LiveAnalysisIcon />,
            },
            {
                id: 'trading-signal',
                title: t('nav.strategyHub', 'AI Trading Signal'),
                subtitle: t('quickJump.strategyHubSub', 'Automated strategy signals & quantitative algorithms'),
                href: '/trading-signal',
                keywords: ['signals', 'strategy', 'core', 'bot', 'algo', 'supertrend', 'ema', 'automated', 'engine', 'playbooks', 'hub'],
                icon: <AiStrategyIcon />,
            },
            {
                id: 'chart-scanner',
                title: t('nav.chartScanner', 'AI Chart Scanner'),
                subtitle: t('quickJump.chartScannerSub', 'Instant vision AI chart screenshot analysis & scanner'),
                href: '/chart-scanner',
                keywords: ['chart', 'scanner', 'snap', 'vision', 'camera', 'scan', 'screenshot', 'pattern', 'confluence'],
                icon: <AiTradeSparkIcon />,
            },
            {
                id: 'trade-advisor',
                title: t('nav.tradeAudit', 'AI Past Trade Analyzer'),
                subtitle: t('quickJump.tradeAuditSub', 'Statement audit, behavioral flaws & trade ledger review'),
                href: '/trade-advisor',
                keywords: ['ai past trade analyzer', 'past trade analyzer', 'trade analyzer', 'trade advisor', 'audit', 'past', 'history', 'statement', 'analysis', 'fomo', 'report', 'ledger', 'csv'],
                icon: <AiTradeAnalysisIcon />,
            },
        ],
    },
    {
        categoryKey: 'bots',
        category: t('nav.aiTradingBot', 'AI Trading Bot'),
        items: [
            {
                id: 'my-bots',
                title: t('nav.myBots', 'My Bots'),
                subtitle: 'Manage, monitor, and deploy your algorithmic trading bots',
                href: '/my-bots',
                keywords: ['my bots', 'bots', 'active bots', 'bot fleet', 'algo', 'deploy', 'portfolio'],
                icon: <MyBotsIcon />,
            },
            {
                id: 'ai-bot-builder',
                title: t('nav.aiBotBuilder', 'AI Bot Builder'),
                subtitle: t('quickJump.strategyStudioSub', 'Interactive AI strategy and algorithmic bot builder'),
                href: '/ai-bot-builder',
                keywords: ['bot', 'builder', 'ai bot', 'copilot', 'strategy', 'studio', 'algo', 'automation', 'create', 'prompt'],
                icon: <AiBotSparkIcon />,
            },
            {
                id: 'manual-bot-builder',
                title: t('nav.customBotBuilder', 'Custom Bot Builder'),
                subtitle: 'Visual rule & indicator configuration with full manual control',
                href: '/manual-bot-builder',
                keywords: ['custom bot', 'manual bot', 'builder', 'indicators', 'rsi', 'ema', 'macd', 'rules'],
                icon: <CustomBotIcon />,
            },
            {
                id: 'bot-library',
                title: t('nav.botLibrary', 'Browse Bots Library'),
                subtitle: 'Explore and clone verified algorithmic trading bot templates',
                href: '/bot-library',
                keywords: ['library', 'templates', 'catalog', 'pre-built', 'clone', 'community bots', 'browse'],
                icon: <BotLibraryIcon />,
            },
            {
                id: 'backtest',
                title: t('nav.backtest', 'Backtest'),
                subtitle: 'Simulate and evaluate algorithmic strategy performance on historical candles',
                href: '/backtest',
                keywords: ['backtest', 'simulation', 'strategy', 'algo', 'historical', 'trades', 'metrics', 'win rate', 'test'],
                icon: <BacktestIcon />,
            },
        ],
    },
    {
        categoryKey: 'copilot',
        category: t('quickJump.catCopilot', 'Copilot & AI'),
        items: [
            {
                id: 'market-assistant',
                title: t('nav.marketAssistant', 'AI Market Assistant'),
                subtitle: t('quickJump.marketAssistantSub', 'Interactive multi-turn trading copilot & market assistant'),
                href: '/market-assistant',
                keywords: ['chat', 'assistant', 'copilot', 'bot', 'ask', 'prompt', 'talk', 'gpt', 'trading', 'market'],
                icon: <AiChatBotIcon />,
            },
        ],
    },
    {
        categoryKey: 'tools',
        category: t('quickJump.catTools', 'Tools & Insights'),
        items: [
            {
                id: 'economic-calendar',
                title: t('nav.economicCalendar', 'Economic Calendar'),
                subtitle: t('quickJump.calendarSub', 'Real-time high impact macroeconomic news and events'),
                href: '/calendar',
                keywords: ['calendar', 'news', 'events', 'nfp', 'cpi', 'fomc', 'interest rate'],
                icon: <CalendarIcon />,
            },
            {
                id: 'forex-calculator',
                title: t('nav.forexCalculator', 'Forex Calculator'),
                subtitle: t('quickJump.calculatorSub', 'Pip value, risk reward, margin and lot position sizing'),
                href: '/calculator',
                keywords: ['calculator', 'pip', 'margin', 'lots', 'sizing', 'risk', 'reward', 'leverage'],
                icon: <SubCalculatorIcon />,
            },
            {
                id: 'market-news',
                title: t('nav.marketNews', 'Market News'),
                subtitle: t('quickJump.marketNewsSub', 'Financial markets headline news & sentiment feeds'),
                href: '/news',
                keywords: ['news', 'market', 'headlines', 'fx', 'sentiment', 'central bank'],
                icon: <SubNewsIcon />,
            },
            {
                id: 'education',
                title: t('nav.education', 'Education'),
                subtitle: t('quickJump.educationSub', 'Master trading fundamentals, psychology & markets at Edufins'),
                href: 'https://edufins.com',
                isExternal: true,
                keywords: ['education', 'learn', 'courses', 'edufins', 'academy', 'trading guide'],
                icon: <SubCalculatorIcon />,
            },
        ],
    },
    {
        categoryKey: 'account',
        category: t('quickJump.catAccount', 'Account & Broker'),
        items: [
            {
                id: 'affiliate',
                title: t('nav.affiliate', 'Affiliate Program'),
                subtitle: t('quickJump.affiliateSub', 'Referral tracking, tier commissions & crypto withdrawals'),
                href: '/affiliate',
                keywords: ['affiliate', 'referral', 'commission', 'withdraw', 'crypto', 'usdt', 'earn', 'invite', 'partner'],
                icon: <AffiliateIcon />,
            },
            {
                id: 'subscription-plans',
                title: t('nav.plans', 'Subscription Plans'),
                subtitle: t('quickJump.plansSub', 'Upgrade to Pro, Institutional tiers & active quotas'),
                href: '/subscription-plans',
                keywords: ['plans', 'subscription', 'upgrade', 'pro', 'pricing', 'tier', 'membership'],
                icon: <CrownIcon />,
            },
            {
                id: 'broker',
                title: t('nav.broker', 'Associated Brokers'),
                subtitle: t('quickJump.brokerSub', 'Connect MT4/MT5 accounts, broker API & credentials'),
                href: '/brokers',
                keywords: ['broker', 'mt5', 'mt4', 'metatrader', 'account', 'deposit', 'credentials'],
                icon: <BrokerBankIcon />,
            },
            {
                id: 'credit-history',
                title: t('nav.creditHistory', 'Credit History'),
                subtitle: t('quickJump.creditHistorySub', 'Review AI token usage, credits and transaction logs'),
                href: '/credit-history',
                keywords: ['credits', 'tokens', 'history', 'billing', 'balance', 'usage'],
                icon: <CreditShieldIcon />,
            },
        ],
    },
];

const ROUTE_PERMISSION_MAP = {
    '/dashboard': 'dashboard',
    '/chart-scanner': 'ai chart scanner',
    '/ai-chart-scanner': 'ai chart scanner',
    '/trade-audit': 'ai past trade analyzer',
    '/ai-trade-audit': 'ai past trade analyzer',
    '/trade-advisor': 'ai past trade analyzer',
    '/ai-trade-advisor': 'ai past trade analyzer',
    '/my-bots': 'my bots',
    '/ai-bot-builder': 'ai bot builder',
    '/manual-bot-builder': 'custom bot builder',
    '/custom-bot-builder': 'custom bot builder',
    '/bot-library': 'browse bots library',
    '/browse-bots': 'browse bots library',
    '/market-assistant': 'ai market assistant',
    '/ai-market-assistant': 'ai market assistant',
    '/trading-signal': 'ai trading signal',
    '/ai-trading-signal': 'ai trading signal',
    '/signal-terminal': 'signal terminal',
    '/live-scanner': 'signal terminal',
    '/calendar': 'economic calendar',
    '/economic-calendar': 'economic calendar',
    '/calculator': 'forex calculator',
    '/forex-calculator': 'forex calculator',
    '/news': 'economic calendar',
    '/market-news': 'economic calendar',
    '/plans': 'subscription plans',
    '/subscription-plans': 'subscription plans',
    '/broker': 'associated brokers',
    '/brokers': 'associated brokers',
    '/affiliate': 'affiliate',
    '/profile': 'profile',
};

const ID_PERMISSION_MAP = {
    'dashboard': 'dashboard',
    'profile': 'profile',
    'signal-terminal': 'signal terminal',
    'trading-signal': 'ai trading signal',
    'chart-scanner': 'ai chart scanner',
    'trade-advisor': 'ai trade advisor',
    'my-bots': 'my bots',
    'ai-bot-builder': 'ai bot builder',
    'manual-bot-builder': 'custom bot builder',
    'custom-bot-builder': 'custom bot builder',
    'bot-library': 'browse bots library',
    'browse-bots': 'browse bots library',
    'market-assistant': 'ai market assistant',
    'economic-calendar': 'economic calendar',
    'forex-calculator': 'forex calculator',
    'market-news': 'economic calendar',
    'affiliate': 'affiliate',
    'subscription-plans': 'subscription plans',
    'broker': 'associated brokers',
    'credit-history': 'subscription plans',
};

/**
 * Strict permission check against Supabase dashboard_tabs visible set.
 * Returns false if the item has no active permission.
 */
export function checkItemPermission(item, visibleTabNames) {
    if (!visibleTabNames || visibleTabNames.size === 0) return true;

    // Public / external items
    if (item.id === 'home' || item.href === '/') return true;
    if (item.id === 'education' || item.isExternal || item.href?.includes('edufins')) return true;
    if (item.id === 'customer-support' || item.id === 'technical-support' || item.href === '/customer-support' || item.href === '/technical-support') return true;
    if (item.id === 'profile' || item.href === '/profile') return true;

    // Check by ID mapping
    const targetTabById = ID_PERMISSION_MAP[item.id];
    if (targetTabById && !visibleTabNames.has(targetTabById)) {
        return false;
    }

    // Check by Route mapping
    const targetTabByRoute = ROUTE_PERMISSION_MAP[item.href];
    if (targetTabByRoute && !visibleTabNames.has(targetTabByRoute)) {
        return false;
    }

    // Direct Title check as safety fallback
    const titleLower = (item.title || '').toLowerCase().trim();
    if (titleLower === 'browse bots library' && !visibleTabNames.has('browse bots library')) return false;
    if (titleLower === 'my bots' && !visibleTabNames.has('my bots')) return false;
    if (titleLower === 'ai bot builder' && !visibleTabNames.has('ai bot builder')) return false;

    return true;
}
