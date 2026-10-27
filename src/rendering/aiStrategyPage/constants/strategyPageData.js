import React from 'react';

// Top Feature Highlights Data (4 Value Badges)
export const VALUE_BADGES = [
    {
        id: 'watchlist-grid',
        title: 'Real-Time FX Live Grid',
        desc: 'Interactive 6+ pair multi-asset watchlist',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
        colorClass: 'iconGold'
    },
    {
        id: 'scoring-engine',
        title: '100-Point Technical Scoring',
        desc: 'Trend, Momentum, Volume & Structure pillars',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        colorClass: 'iconAmber'
    },
    {
        id: 'strategy-selector',
        title: 'Multi-Strategy Selector',
        desc: 'EMA Pullback, Breakout & SuperTrend',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        colorClass: 'iconGreen'
    },
    {
        id: 'ai-evidence',
        title: 'AI Intelligence Evidence',
        desc: 'Transparent multi-factor trend breakdown',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        colorClass: 'iconBlue'
    }
];

// Core Features Breakdown (4 Bento Cards)
export const CORE_FEATURES = [
    {
        number: "01",
        title: "Real-Time FX Watchlist & Signal Grid",
        desc: "Track 6+ major Forex pairs and commodities (XAU/USD, EUR/USD, GBP/USD, GBP/JPY, EUR/JPY, USD/CAD) in real-time. Instantly identify Market Bias (Bullish, Bearish, or Neutral) with color-coded score indicators.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        badge: "MULTI-PAIR RADAR",
        statLabel: "Covered Pairs",
        statValue: "6+ Major Assets"
    },
    {
        number: "02",
        title: "100-Point Quantitative Technical Score",
        desc: "Stop relying on single indicators. Our AI engine dynamically analyzes four core market pillars to output an aggregate Technical Score from 0 (Strong Bearish) to 100 (Strong Bullish) with individual 25-point weighted audits.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
                <circle cx="19" cy="9" r="1.5" fill="currentColor" />
            </svg>
        ),
        badge: "4-PILLAR MODEL",
        statLabel: "Max Aggregate",
        statValue: "100 Points"
    },
    {
        number: "03",
        title: "Live Indicator Overlay Charting",
        desc: "Interactive charts loaded with active strategy indicators—including EMA 20, EMA 50, and SuperTrend channels—giving you a visual roadmap of active trends and key pivot zones.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
        badge: "LIVE CHARTS",
        statLabel: "Indicator Suite",
        statValue: "EMAs + SuperTrend"
    },
    {
        number: "04",
        title: "AI Strategy Generator",
        desc: "Create and deploy custom quantitative trading strategies tailored to your risk tolerance and trading style. Watch active setups trigger automatically as strategy conditions align in live market data.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        badge: "AUTOMATED RULES",
        statLabel: "Trigger Latency",
        statValue: "< 15ms"
    }
];

// 6+ Pairs Live Score Simulator Data
export const PAIRS_DATA = [
    {
        id: 'xauusd',
        symbol: 'XAU/USD',
        name: 'Gold / US Dollar',
        price: '2,742.50',
        score: 24,
        bias: 'STRONG BEARISH',
        biasType: 'bearish',
        confidence: '84%',
        activeStrategy: 'EMA Pullback Strategy',
        pillars: {
            trend: { score: 0, max: 25, note: 'SMA 10/20/50 & EMA 10/20/50 Bearish' },
            momentum: { score: 11, max: 25, note: 'Slight Bearish Divergence (RSI 42.1)' },
            volume: { score: 5, max: 25, note: 'Below Average Buyer Volume' },
            structure: { score: 8, max: 25, note: 'Testing Key Support at 2,735.00' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Bearish Alignment', state: 'bearish' },
            { name: 'SuperTrend', val: 'Red Cloud (Down)', state: 'bearish' },
            { name: 'RSI (14)', val: '42.10 (Bearish Slope)', state: 'bearish' }
        ],
        summary: 'Gold is encountering heavy resistance at 2,748.00 with multi-period moving average breakdown indicating high probability of downward expansion toward S1 support.'
    },
    {
        id: 'eurusd',
        symbol: 'EUR/USD',
        name: 'Euro / US Dollar',
        price: '1.08450',
        score: 78,
        bias: 'BULLISH',
        biasType: 'bullish',
        confidence: '86%',
        activeStrategy: 'Breakout Master',
        pillars: {
            trend: { score: 22, max: 25, note: 'Golden Cross (EMA 20 > EMA 50)' },
            momentum: { score: 20, max: 25, note: 'RSI 62.4 Expanding Bullish' },
            volume: { score: 18, max: 25, note: 'High Institutional Inflow Delta' },
            structure: { score: 18, max: 25, note: 'Holding Demand Level at 1.08200' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Bullish Crossover', state: 'bullish' },
            { name: 'SuperTrend', val: 'Green Cloud (Active)', state: 'bullish' },
            { name: 'RSI (14)', val: '62.40 (Healthy Momentum)', state: 'bullish' }
        ],
        summary: 'EUR/USD established firm baseline above 1.08200 support. Momentum surge and clean moving average fan confirm continuation toward 1.09200 resistance.'
    },
    {
        id: 'gbpusd',
        symbol: 'GBP/USD',
        name: 'British Pound / US Dollar',
        price: '1.29680',
        score: 86,
        bias: 'STRONG BULLISH',
        biasType: 'bullish',
        confidence: '91%',
        activeStrategy: 'SuperTrend Momentum',
        pillars: {
            trend: { score: 24, max: 25, note: 'Triple Moving Average Expansion' },
            momentum: { score: 22, max: 25, note: 'Strong MACD Positive Histogram' },
            volume: { score: 21, max: 25, note: 'High Buying Volume Delta (+68%)' },
            structure: { score: 19, max: 25, note: 'Breakout Above Asian Highs' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Wide Bullish Spread', state: 'bullish' },
            { name: 'SuperTrend', val: 'Green Trailing Support', state: 'bullish' },
            { name: 'Volume Profile', val: 'Institutional Accumulation', state: 'bullish' }
        ],
        summary: 'Cable displays premier quantitative confluence with multi-timeframe trend alignment and heavy institutional accumulation following European session open.'
    },
    {
        id: 'gbpjpy',
        symbol: 'GBP/JPY',
        name: 'British Pound / Japanese Yen',
        price: '192.400',
        score: 71,
        bias: 'BULLISH',
        biasType: 'bullish',
        confidence: '81%',
        activeStrategy: 'EMA Pullback Strategy',
        pillars: {
            trend: { score: 19, max: 25, note: 'EMA 20 Holding Support Line' },
            momentum: { score: 18, max: 25, note: 'RSI 57.8 Rising Momentum' },
            volume: { score: 16, max: 25, note: 'Moderate Buyer Inflow' },
            structure: { score: 18, max: 25, note: 'Ascending Higher-Low Series' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Upward Sloping', state: 'bullish' },
            { name: 'SuperTrend', val: 'Green Support @ 191.80', state: 'bullish' },
            { name: 'RSI (14)', val: '57.80 (Positive)', state: 'bullish' }
        ],
        summary: 'GBP/JPY pullback into the 20 EMA cleanly respected with buyers defending the 191.80 pivot, positioning for next leg toward 193.50.'
    },
    {
        id: 'eurjpy',
        symbol: 'EUR/JPY',
        name: 'Euro / Japanese Yen',
        price: '161.850',
        score: 48,
        bias: 'NEUTRAL / CONSOLIDATION',
        biasType: 'neutral',
        confidence: '75%',
        activeStrategy: 'EMA Pullback Strategy',
        pillars: {
            trend: { score: 12, max: 25, note: 'Flat Tangent on Moving Averages' },
            momentum: { score: 13, max: 25, note: 'RSI 50.2 Midpoint Neutral' },
            volume: { score: 11, max: 25, note: 'Contracting Session Volume' },
            structure: { score: 12, max: 25, note: 'Inside Daily Range Boundaries' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Intersecting (Flat)', state: 'neutral' },
            { name: 'SuperTrend', val: 'Choppy Sideways Channel', state: 'neutral' },
            { name: 'RSI (14)', val: '50.20 (No Directional Bias)', state: 'neutral' }
        ],
        summary: 'Market is in consolidation mode between 161.40 support and 162.30 resistance. Quantitative recommendation is to stay flat until directional breakout occurs.'
    },
    {
        id: 'usdcad',
        symbol: 'USD/CAD',
        name: 'US Dollar / Canadian Dollar',
        price: '1.38500',
        score: 19,
        bias: 'STRONG BEARISH',
        biasType: 'bearish',
        confidence: '87%',
        activeStrategy: 'Breakout Master',
        pillars: {
            trend: { score: 3, max: 25, note: 'All Major EMAs Sloping Downward' },
            momentum: { score: 6, max: 25, note: 'Oversold Continuation Profile' },
            volume: { score: 4, max: 25, note: 'Heavy Selling Pressure Delta' },
            structure: { score: 6, max: 25, note: 'Breakdown Below S1 Support Level' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Severe Bearish Divergence', state: 'bearish' },
            { name: 'SuperTrend', val: 'Red Cloud Above Price', state: 'bearish' },
            { name: 'RSI (14)', val: '34.60 (Bearish Momentum)', state: 'bearish' }
        ],
        summary: 'USD/CAD broke key structural support at 1.3880 with high selling volume. Multiple timeframes indicate continuation toward 1.3780.'
    }
];

// Available Strategy Options
export const STRATEGIES = [
    'EMA Pullback Strategy',
    'Breakout Master',
    'SuperTrend Momentum'
];

// Comparison Matrix Data
export const COMPARISON_DATA = [
    {
        feature: "Multi-Indicator Confluence",
        manual: { status: 'warn', text: "Manual & slow calculation" },
        aiEngine: { status: 'check', text: "Instant 100-Point Algorithmic Score" },
        highlight: true
    },
    {
        feature: "Pillar Evaluation",
        manual: { status: 'warn', text: "Trend Only (Limited scope)" },
        aiEngine: { status: 'check', text: "Trend + Momentum + Volume + Structure" },
        highlight: true
    },
    {
        feature: "Strategy Multi-Pair Grid",
        manual: { status: 'cross', text: "1 Chart at a time" },
        aiEngine: { status: 'check', text: "Real-Time Watchlist Grid (6+ Pairs)" },
        highlight: true
    },
    {
        feature: "Confidence Level",
        manual: { status: 'warn', text: "Subjective emotional guesswork" },
        aiEngine: { status: 'check', text: "Calculated AI Confidence % (0-100%)" },
        highlight: true
    },
    {
        feature: "Execution Latency",
        manual: { status: 'cross', text: "10-20 Minutes delay" },
        aiEngine: { status: 'check', text: "< 15ms Zero-Delay WebSocket Feed" },
        highlight: false
    }
];

// FAQ Accordion Data
export const FAQS = [
    {
        question: "How is the 100-point Technical Score calculated?",
        answer: "The score is calculated algorithmically across four weighted market pillars (Trend, Momentum, Volume, and Structure), each contributing up to 25 points. A score above 75 signals a Strong Bullish bias, while a score below 25 signals a Strong Bearish bias."
    },
    {
        question: "What strategies can I run on the Live Analysis Feed?",
        answer: "You can select pre-built institutional strategies such as EMA Pullback, Breakout Master, or SuperTrend Trend-Following, or generate custom parameters tailored to your trading style."
    },
    {
        question: "Is the chart data refreshed in real time?",
        answer: "Yes. The Live Analysis Feed connects directly to high-speed MT5 price feeds via WebSocket to stream zero-delay candlestick ticks and indicator adjustments."
    },
    {
        question: "Can I use this for commodities and indices?",
        answer: "Yes. In addition to major FX pairs, the engine computes 100-point scores and strategy setups for Gold (XAUUSD), Silver, Oil, and Global Indices."
    },
    {
        question: "How do I deploy my own custom strategy parameters?",
        answer: "Inside the Live AI Trading Desk, you can open the Strategy Builder, customize moving average lengths, RSI thresholds, and risk-to-reward targets, and deploy it across your entire watchlist."
    }
];
