/**
 * Trading Profile Data Mapper & Schema Converter
 */

export const EXPERIENCE_LEVELS = [
    { value: 'Beginner', label: 'Beginner', desc: '0–1 years. Guided AI validation & foundational models.' },
    { value: 'Intermediate', label: 'Intermediate', desc: '1–3 years. Indicator confluence & multi-timeframe setups.' },
    { value: 'Advanced', label: 'Advanced', desc: '3–5+ years. Orderflow, liquidity pools & quantitative risk.' },
    { value: 'Professional', label: 'Professional / Prop Firm', desc: 'Full-time trader focused on algorithmic execution & MT5 EAs.' },
];

export const TRADING_STYLES = [
    { value: 'Scalping', label: 'Scalping (1M – 5M)' },
    { value: 'Day Trading', label: 'Day Trading (15M – 1H)' },
    { value: 'Swing Trading', label: 'Swing Trading (4H – 1D)' },
    { value: 'Position Trading', label: 'Position Trading (Weekly / Multi-Month)' },
    { value: 'Algorithmic / Automated', label: 'Algorithmic / EA Strategies (24/7 Automation)' },
];

export const RISK_TOLERANCES = [
    { value: 'Low', label: 'Conservative (Low Risk)', maxDd: '8-10%', maxRisk: '0.5-1%' },
    { value: 'Moderate', label: 'Balanced (Moderate Risk)', maxDd: '12-15%', maxRisk: '1-2%' },
    { value: 'High', label: 'Growth (High Risk)', maxDd: '20-25%', maxRisk: '2-3%' },
    { value: 'Aggressive', label: 'Aggressive (Max Yield)', maxDd: '30%+', maxRisk: '3-5%' },
];

export const PRIMARY_GOALS = [
    'Wealth Building',
    'Capital Preservation',
    'Consistent Monthly Income',
    'Prop Firm Challenge Passing',
    'Automated Passive Growth'
];

export const AVAILABLE_PAIRS = [
    { id: 'EUR/USD', symbol: 'EUR/USD', icon: 'EUR', tag: 'FX Major' },
    { id: 'GBP/USD', symbol: 'GBP/USD', icon: 'GBP', tag: 'FX Major' },
    { id: 'USD/JPY', symbol: 'USD/JPY', icon: 'JPY', tag: 'FX Major' },
    { id: 'XAU/USD', symbol: 'XAU/USD', icon: 'GOLD', tag: 'Gold' },
    { id: 'GBP/JPY', symbol: 'GBP/JPY', icon: 'GBP/JPY', tag: 'FX Cross' },
    { id: 'AUD/USD', symbol: 'AUD/USD', icon: 'AUD', tag: 'FX Major' },
    { id: 'USD/CAD', symbol: 'USD/CAD', icon: 'CAD', tag: 'FX Major' },
    { id: 'USD/CHF', symbol: 'USD/CHF', icon: 'CHF', tag: 'FX Major' },
];

export const AVAILABLE_SESSIONS = [
    { id: 'London Session', label: 'London Session', icon: 'LON' },
    { id: 'New York Session', label: 'New York Session', icon: 'NY' },
    { id: 'Tokyo / Asian Session', label: 'Tokyo / Asian Session', icon: 'TKY' },
    { id: 'Sydney Session', label: 'Sydney Session', icon: 'SYD' },
    { id: 'Overlap (London + NY)', label: 'Overlap (London + NY)', icon: 'LN' }
];


const MARKET_TO_PAIR_MAP = {
    eurusd: 'EUR/USD',
    eur_usd: 'EUR/USD',
    gbpusd: 'GBP/USD',
    gbp_usd: 'GBP/USD',
    usdjpy: 'USD/JPY',
    usd_jpy: 'USD/JPY',
    gold: 'XAU/USD',
    xau_usd: 'XAU/USD',
    gbpjpy: 'GBP/JPY',
    gbp_jpy: 'GBP/JPY',
    audusd: 'AUD/USD',
    aud_usd: 'AUD/USD',
    usdcad: 'USD/CAD',
    usd_cad: 'USD/CAD',
    usdchf: 'USD/CHF',
    usd_chf: 'USD/CHF',
};

const STYLE_TO_LABEL_MAP = {
    scalping: 'Scalping',
    day_trading: 'Day Trading',
    swing_trading: 'Swing Trading',
    position_trading: 'Position Trading',
    algo_trading: 'Algorithmic / Automated'
};

/**
 * Robust helper to dynamically resolve the respective logged-in user's full name
 */
export function resolveUserFullName({ personal, user, onboardingData }) {
    // 1. Primary: Current active user prop (first_name, last_name, full_name, name)
    const userCombined = (user?.first_name || user?.last_name)
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
        : '';
    const userDirect = user?.full_name || user?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || userCombined;

    if (userDirect && userDirect.trim()) {
        return userDirect.trim();
    }

    // 2. Secondary: Check browser storage for current logged-in user session
    if (typeof window !== 'undefined') {
        try {
            const rawStored = localStorage.getItem('user');
            if (rawStored) {
                const storedUser = JSON.parse(rawStored);
                const storedCombined = (storedUser?.first_name || storedUser?.last_name)
                    ? `${storedUser.first_name || ''} ${storedUser.last_name || ''}`.trim()
                    : '';
                const storedName = storedUser?.full_name || storedUser?.name || storedUser?.user_metadata?.full_name || storedUser?.user_metadata?.name || storedCombined;
                if (storedName && storedName.trim()) {
                    return storedName.trim();
                }
            }
        } catch (_) {}
    }

    // 3. Saved personal profile name (if previously saved)
    const savedName = personal?.full_name || personal?.name;
    if (savedName && savedName.trim()) {
        return savedName.trim();
    }

    // 4. Onboarding data
    if (onboardingData?.name || onboardingData?.full_name) {
        return (onboardingData.name || onboardingData.full_name).trim();
    }

    // 5. Fallback from email prefix if available
    const email = user?.email || (typeof window !== 'undefined' && (() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}')?.email;
        } catch (_) { return ''; }
    })());

    if (email && typeof email === 'string' && email.includes('@')) {
        const prefix = email.split('@')[0].replace(/[._-]/g, ' ');
        return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    return '';
}

/**
 * Merges API preferences, DB user onboarding survey data, and fallback defaults
 */
export function buildInitialTradingProfileForm({ apiPreferences, onboardingData, user }) {
    const p = apiPreferences || {};
    const personal = p.personal || {};
    const investment = p.investment || {};
    const risk = p.risk || {};
    const goals = p.goals || {};
    const pref = p.preferences || {};

    // 1. Resolve Respective User Full Name
    const resolvedName = resolveUserFullName({ personal, user, onboardingData });

    // 2. Resolve Experience Level
    let resolvedExp = personal.experience_level;
    if (!resolvedExp && onboardingData?.experience) {
        const lower = String(onboardingData.experience).toLowerCase();
        if (lower.includes('begin')) resolvedExp = 'Beginner';
        else if (lower.includes('inter')) resolvedExp = 'Intermediate';
        else if (lower.includes('adv')) resolvedExp = 'Advanced';
        else if (lower.includes('prof')) resolvedExp = 'Professional / Prop Firm';
    }
    resolvedExp = resolvedExp || 'Intermediate';

    // 3. Resolve Trading Style
    let resolvedStyle = personal.trading_style;
    if (!resolvedStyle && Array.isArray(onboardingData?.tradingStyles) && onboardingData.tradingStyles[0]) {
        resolvedStyle = STYLE_TO_LABEL_MAP[onboardingData.tradingStyles[0]] || onboardingData.tradingStyles[0];
    }
    resolvedStyle = resolvedStyle || 'Day Trading';

    // 4. Resolve Preferred Pairs
    let resolvedPairs = pref.preferred_currency_pairs || pref.preferred_pairs;
    if (!resolvedPairs || !Array.isArray(resolvedPairs) || resolvedPairs.length === 0) {
        if (Array.isArray(onboardingData?.markets) && onboardingData.markets.length > 0) {
            resolvedPairs = onboardingData.markets.map(m => MARKET_TO_PAIR_MAP[String(m).toLowerCase()] || m).filter(Boolean);
        }
    }
    if (!resolvedPairs || resolvedPairs.length === 0) {
        resolvedPairs = ['EUR/USD', 'GBP/USD', 'XAU/USD'];
    }

    // 5. Resolve Preferred Sessions
    let resolvedSessions = pref.preferred_trading_sessions || pref.preferred_sessions;
    if (!resolvedSessions || !Array.isArray(resolvedSessions) || resolvedSessions.length === 0) {
        resolvedSessions = ['London Session', 'New York Session'];
    }

    return {
        personal: {
            full_name: resolvedName,
            experience_level: resolvedExp,
            trading_style: resolvedStyle,
        },
        investment: {
            total_investment_capital: Number(investment.total_investment ?? investment.total_investment_capital ?? 5000),
            monthly_top_up: Number(investment.monthly_top_up ?? 500),
        },
        risk: {
            risk_tolerance: risk.risk_capacity || risk.risk_tolerance || 'Moderate',
            max_acceptable_drawdown: risk.max_drawdown_limit || risk.max_acceptable_drawdown || '15%',
            max_risk_per_trade: risk.max_risk_per_trade || '1-2%',
        },
        goals: {
            primary_goal: goals.primary_goal || 'Wealth Building',
            monthly_return_target: goals.monthly_return_rate || goals.monthly_return_target || '5%',
            profit_goal: Number(goals.profit_goal ?? 25000),
            timeframe: Number(goals.timeframe ?? 12),
            describe_goals: goals.describe_goals || 'Achieve consistent risk-adjusted returns and build long-term trading capital.',
        },
        preferences: {
            preferred_currency_pairs: resolvedPairs,
            preferred_sessions: resolvedSessions,
        },
        generate_ai: true
    };
}
