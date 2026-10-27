import React from 'react';

// Pre-built Quick Prompts Data
export const QUICK_PROMPTS = [
    {
        id: 'market-analysis',
        category: 'Market Analysis',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
                <circle cx="19" cy="9" r="1.5" fill="currentColor" />
            </svg>
        ),
        badge: 'H1 OUTLOOK',
        presetText: "What is the current technical outlook and key support/resistance levels for XAUUSD (Gold) on H1?",
        demoData: {
            pair: 'XAUUSD (Gold)',
            timeframe: 'H1 (1-Hour)',
            userPrompt: "What is the current technical outlook and key support/resistance levels for XAUUSD (Gold) on H1?",
            title: "XAUUSD H1 Technical Outlook & Key Levels",
            price: "2,742.50",
            trend: "Bullish (Trading above EMA 20 & 50)",
            trendType: "bullish",
            resistance: "R1 = 2,748.10 | R2 = 2,755.00",
            support: "S1 = 2,738.00 | S2 = 2,730.50",
            setup: {
                entryZone: "2,740.00 - 2,742.00 (Pullback to 20 EMA)",
                stopLoss: "2,734.50 (Below S1 support)",
                takeProfit1: "2,748.00",
                takeProfit2: "2,755.00",
                rrr: "1 : 2.3",
            },
            indicators: [
                { name: 'EMA 20/50', status: 'Golden Cross (Bullish)', val: '2,738.20 / 2,732.10' },
                { name: 'RSI (14)', status: '58.4 (Healthy Momentum)', val: 'Bullish Zone' },
                { name: 'SuperTrend', status: 'Green (Bullish Trend)', val: 'Support @ 2,735.00' }
            ],
            note: "Keep an eye on upcoming High-Impact USD Economic Data (Core PPI & Fed Speech)."
        }
    },
    {
        id: 'risk-management',
        category: 'Risk Management',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        badge: 'QUANT CALC',
        presetText: "Calculate optimal position size for EURUSD with a $10,000 account, 1.5% risk, and a 25-pip Stop Loss.",
        demoData: {
            pair: 'EURUSD (Euro)',
            timeframe: 'Position Sizing Audit',
            userPrompt: "Calculate optimal position size for EURUSD with a $10,000 account, 1.5% risk, and a 25-pip Stop Loss.",
            title: "EURUSD Institutional Risk & Position Sizing Breakdown",
            price: "1.08450",
            trend: "Neutral / Range-Bound",
            trendType: "neutral",
            resistance: "R1 = 1.08800 | R2 = 1.09250",
            support: "S1 = 1.08200 | S2 = 1.07900",
            setup: {
                entryZone: "1.08450 (Market Execution)",
                stopLoss: "1.08200 (25 Pips)",
                takeProfit1: "1.08950 (50 Pips)",
                takeProfit2: "1.09450 (100 Pips)",
                rrr: "1 : 2.0 (TP1) | 1 : 4.0 (TP2)",
            },
            calcMetrics: {
                accountBalance: "$10,000.00",
                riskPercent: "1.50%",
                dollarRisk: "$150.00",
                stopLossPips: "25 Pips",
                recommendedLots: "0.60 Lots (60,000 Units)",
                pipValue: "$6.00 / Pip"
            },
            note: "Position strictly limited to $150.00 max risk to preserve capital across multiple drawdowns."
        }
    },
    {
        id: 'indicator-signal',
        category: 'Indicator Signal',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        badge: 'SUPER TREND & EMA',
        presetText: "Are EMA 20/50 crossovers and SuperTrend aligned bullish or bearish on GBPUSD right now?",
        demoData: {
            pair: 'GBPUSD (Cable)',
            timeframe: '15M Execution Chart',
            userPrompt: "Are EMA 20/50 crossovers and SuperTrend aligned bullish or bearish on GBPUSD right now?",
            title: "GBPUSD Technical Indicators & Trend Confluence",
            price: "1.29820",
            trend: "Bullish Trend Confluence",
            trendType: "bullish",
            resistance: "R1 = 1.30200 | R2 = 1.30650",
            support: "S1 = 1.29450 | S2 = 1.29100",
            setup: {
                entryZone: "1.29750 - 1.29850",
                stopLoss: "1.29400 (35 Pips)",
                takeProfit1: "1.30400 (60 Pips)",
                takeProfit2: "1.30900 (110 Pips)",
                rrr: "1 : 1.7 (TP1) | 1 : 3.1 (TP2)",
            },
            indicators: [
                { name: 'EMA 20 > EMA 50', status: 'Bullish Aligned (Slope +12°)', val: '1.29650' },
                { name: 'SuperTrend (10, 3)', status: 'Green Buy Signal', val: 'Support @ 1.29380' },
                { name: 'Volume Flow (CMF)', status: '+0.18 Capital Inflow', val: 'Institutional Buying' }
            ],
            note: "Strong multi-indicator buy confirmation detected across 15M and 1H timeframes."
        }
    },
    {
        id: 'macro-news',
        category: 'Macro & News Prep',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="6" x2="12" y2="12" />
                <line x1="12" y1="12" x2="16" y2="14" />
            </svg>
        ),
        badge: 'VOLATILITY SHIELD',
        presetText: "What upcoming high-impact economic calendar events could cause spread widening or slippage today?",
        demoData: {
            pair: 'USD High-Impact Releases',
            timeframe: 'Global Economic Calendar',
            userPrompt: "What upcoming high-impact economic calendar events could cause spread widening or slippage today?",
            title: "Macroeconomic Volatility & Slippage Risk Warning",
            price: "DXY 104.15 (+0.22%)",
            trend: "Heightened Event Risk Ahead",
            trendType: "neutral",
            resistance: "DXY Resistance: 104.60",
            support: "DXY Support: 103.80",
            setup: {
                entryZone: "No new market orders recommended 15m before news",
                stopLoss: "Widen manual SL or reduce volume by 50%",
                takeProfit1: "Wait 10-15m for post-release spread stabilization",
                takeProfit2: "Trade the 15M confirmation impulse breakout",
                rrr: "Capital Preservation Priority",
            },
            indicators: [
                { name: '13:30 GMT', status: 'Core CPI m/m (Expected 0.3%)', val: 'High Impact Red Folder' },
                { name: '15:00 GMT', status: 'Fed Chair Powell Testimony', val: 'Extreme Currency Volatility' },
                { name: 'Spread Warning', status: 'Anticipate 3x to 6x spread spike', val: 'Forex & Gold' }
            ],
            note: "Institutional brokers typically experience wider slippage and liquidity gaps during CPI prints."
        }
    }
];

// Key Features Data
export const KEY_FEATURES = [
    {
        number: "01",
        title: "Live Institutional Market Intelligence",
        desc: "Ask any question about real-time market structure, price momentum, key liquidity zones, order blocks, and dynamic trends across all asset classes.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
        badge: "LIVE TICK DATA",
        statLabel: "Data Latency",
        statValue: "< 50ms"
    },
    {
        number: "02",
        title: "Algorithmic Technical Indicator Confluence",
        desc: "Query live EMAs (20, 50, 200), RSI, MACD, Bollinger Bands, and institutional SuperTrend parameters with zero manual chart plotting required.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19h16" />
                <path d="M4 15l4-6 4 2 5-7 3 2" />
                <circle cx="20" cy="6" r="1.5" fill="currentColor" />
            </svg>
        ),
        badge: "QUANT ALGORITHMS",
        statLabel: "Indicator Library",
        statValue: "45+ Models"
    },
    {
        number: "03",
        title: "Institutional Risk Management & Calculator",
        desc: "Protect your capital with smart position sizing recommendations, dynamic Stop-Loss (SL) placing, Take-Profit (TP) target structures, and strict Risk-to-Reward (RRR) enforcement.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="3" />
            </svg>
        ),
        badge: "CAPITAL SHIELD",
        statLabel: "Math Precision",
        statValue: "100.0%"
    },
    {
        number: "04",
        title: "Pattern Recognition & Trade Setup Generator",
        desc: "Identify key candlestick structures, liquidity sweeps, order blocks, and chart breakout signals across Forex, Metals, and Global pairs.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        badge: "NEURAL PATTERNS",
        statLabel: "Recognition Speed",
        statValue: "0.8 Sec"
    }
];

// Comparison Matrix Data
export const COMPARISON_DATA = [
    {
        feature: "Live MT5 Price Stream",
        generic: { status: 'cross', text: "No (Outdated static knowledge cutoffs)" },
        TraderMaster: { status: 'check', text: "Direct MT5 Integration (Real-time live tick stream)" },
        highlight: true
    },
    {
        feature: "Exact Pip & Lot Calculations",
        generic: { status: 'warn', text: "Unreliable (Frequent math hallucinations)" },
        TraderMaster: { status: 'check', text: "100% Precision Math (Strict broker contract sizing)" },
        highlight: true
    },
    {
        feature: "Custom FX Indicators",
        generic: { status: 'cross', text: "No (Guesses from outdated web text)" },
        TraderMaster: { status: 'check', text: "EMAs, SuperTrend & Pivots (Computed live on chart)" },
        highlight: true
    },
    {
        feature: "Zero Delay Execution Setup",
        generic: { status: 'cross', text: "No (No real-time market depth)" },
        TraderMaster: { status: 'check', text: "Real-Time Data & Precise Entry/SL/TP Structures" },
        highlight: true
    },
    {
        feature: "Institutional Risk:Reward Enforcement",
        generic: { status: 'warn', text: "Basic text advice without sizing rules" },
        TraderMaster: { status: 'check', text: "Strict Capital Preservation & Dynamic RRR Rules" },
        highlight: false
    },
    {
        feature: "Multi-Timeframe Confluence",
        generic: { status: 'cross', text: "Limited to single-view context" },
        TraderMaster: { status: 'check', text: "Simultaneous M1, M15, H1, H4 & Daily Analysis" },
        highlight: false
    }
];

// FAQ Accordion Data
export const FAQS = [
    {
        question: "How does the AI Chat analyze forex markets?",
        answer: "Our AI model reads live tick and candle data directly from MT5 terminals, combining institutional technical indicators (EMAs, RSI, Pivots, SuperTrend) with quantitative risk management models to give clear, actionable insights."
    },
    {
        question: "Can the AI calculate my lot size and risk per trade?",
        answer: "Absolutely. Simply tell the AI your account balance, risk percentage (e.g., 1% or 2%), and stop-loss pips, and it will immediately calculate your exact recommended lot size and dollar risk."
    },
    {
        question: "Is the market data delayed?",
        answer: "No. Unlike standard AI models with static data cutoff dates, our AI Chat is connected live to institutional MetaTrader 5 feeds, ensuring instant price transparency."
    },
    {
        question: "What currency pairs and asset classes are supported?",
        answer: "TraderMaster AI Chat supports all major, minor, and exotic Forex currency pairs (EURUSD, GBPUSD, USDJPY, AUDUSD, etc.), precious metals (XAUUSD Gold, XAGUSD Silver), energies (USOIL, UKOIL), and global indices (US30, NAS100)."
    },
    {
        question: "Do I need coding experience or manual MT5 configuration?",
        answer: "None at all. TraderMaster handles all server-side MT5 terminal routing and algorithmic analysis automatically in the cloud. You interact through a clean, conversational natural-language chat interface."
    }
];
