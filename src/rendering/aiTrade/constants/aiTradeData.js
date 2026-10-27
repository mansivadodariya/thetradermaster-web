import React from 'react';

// Top Feature Highlights Badges Data (3-4 Badges)
export const TOP_HIGHLIGHTS = [
    {
        id: 'recognition',
        title: 'Instant Screenshot Recognition',
        desc: 'Upload PNG/JPG from any broker or app',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        ),
        colorClass: 'iconGold'
    },
    {
        id: 'detection',
        title: 'Auto Ticker & Timeframe Detection',
        desc: 'Vision AI automatically reads pair & period',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <path d="M11 8v6M8 11h6" />
            </svg>
        ),
        colorClass: 'iconAmber'
    },
    {
        id: 'confluence',
        title: 'Vision AI ',
        desc: 'Harmonized patterns + live tick overlay',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        colorClass: 'iconGreen'
    },
    {
        id: 'targets',
        title: 'Calculated Entry, SL & Multi-TP',
        desc: 'Precise protection & 3 profit targets',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
            </svg>
        ),
        colorClass: 'iconBlue'
    }
];

// 3-Step Process Data
export const STEPS = [
    {
        number: "01",
        title: "Upload Your Chart Screenshot",
        desc: "Drag and drop or upload any chart image from TradingView, MetaTrader 4/5, or your mobile broker app.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
        ),
        badge: "STEP 1 // INPUT"
    },
    {
        number: "02",
        title: "Dual Vision AI & MT5 Analysis",
        desc: "Our Gemini Vision AI scans pattern structures and liquidity zones, combining them with live MT5 indicator calculations (EMAs, SuperTrend, Pivots).",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="6" x2="12" y2="12" />
                <line x1="12" y1="12" x2="16" y2="14" />
            </svg>
        ),
        badge: "STEP 2 // DUAL ENGINE"
    },
    {
        number: "03",
        title: "Receive Execution Plan",
        desc: "Get a high-conviction trade signal complete with Action (BUY/SELL), Entry Zone, Protection Stop-Loss (SL), Take Profit Targets (TP1, TP2, TP3), and Risk-Reward Ratio.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
        badge: "STEP 3 // EXECUTION"
    }
];

// Key Platform Features (4 Bento Cards)
export const KEY_FEATURES = [
    {
        number: "01",
        title: "Universal Chart Compatibility",
        desc: "Supports screenshots from any broker, charting software, or mobile app. Detects major Forex pairs (XAUUSD, EURUSD, GBPUSD, USDJPY), Metals, and Indices.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        badge: "ALL PLATFORMS",
        statLabel: "Supported Assets",
        statValue: "150+ Pairs"
    },
    {
        number: "02",
        title: "Dynamic Timeframe Alignment",
        desc: "Automatically identifies the active timeframe (M1, M15, H1, H4, D1). If timeframe details are missing from the chart image, the system lets you choose short-term, mid-term, or long-term horizons with one click.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        badge: "MULTI-TIMEFRAME",
        statLabel: "Timeframe Range",
        statValue: "M1 to 1D"
    },
    {
        number: "03",
        title: "Support, Resistance & Pattern Mapping",
        desc: "Identifies chart formations (Head & Shoulders, Double Top/Bottom, Breakouts, Order Blocks) and lists exact support and resistance levels extracted visually from your image.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
                <circle cx="19" cy="9" r="1.5" fill="currentColor" />
            </svg>
        ),
        badge: "PATTERN VISION",
        statLabel: "Pattern Library",
        statValue: "30+ Structures"
    },
    {
        number: "04",
        title: "Quantitative Conviction Rating",
        desc: "Evaluates signal strength with a clear Conviction Score (e.g. 88% Confidence), allowing you to filter out low-probability market noise.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        badge: "CONVICTION SCORE",
        statLabel: "Analysis Precision",
        statValue: "99.2%"
    }
];

// Sample Preset Scan Trades
export const SAMPLE_PRESETS = [
    {
        id: 'xauusd-gold',
        pair: 'XAUUSD (Gold)',
        timeframe: 'H1',
        confidence: '88%',
        decision: 'BUY (HIGH CONVICTION)',
        decisionType: 'buy',
        patternDetected: 'Ascending Triangle Breakout',
        entryZone: '2,741.50 - 2,743.00',
        stopLoss: '2,735.00 (Protected below S1 Support Level)',
        tp1: '2,748.50',
        tp2: '2,756.00',
        tp3: '2,765.00',
        rrr: '1 : 2.4',
        rationale: 'Vision AI detected an ascending triangle breakout above 2,740.00, confirmed by MT5 Technical Engine showing price holding firmly above the 20 & 50 EMAs with bullish SuperTrend alignment.',
        currentPrice: '2,742.50',
        resistance: 'R1 = 2,748.50 | R2 = 2,756.00',
        support: 'S1 = 2,735.00 | S2 = 2,728.00'
    },
    {
        id: 'eurusd-short',
        pair: 'EURUSD (Euro)',
        timeframe: '15M',
        confidence: '84%',
        decision: 'SELL (HIGH CONVICTION)',
        decisionType: 'sell',
        patternDetected: 'Liquidity Sweep of Asian Highs',
        entryZone: '1.08450 - 1.08520',
        stopLoss: '1.08750 (Above Asian Session High)',
        tp1: '1.08150',
        tp2: '1.07800',
        tp3: '1.07400',
        rrr: '1 : 2.8',
        rationale: 'Vision AI detected a sharp liquidity sweep into the 1H supply zone, confirmed by MT5 SuperTrend bearish flip and EMA 20 rejection.',
        currentPrice: '1.08480',
        resistance: 'R1 = 1.08750 | R2 = 1.09100',
        support: 'S1 = 1.08150 | S2 = 1.07800'
    },
    {
        id: 'btcusdt-long',
        pair: 'BTCUSD (Bitcoin)',
        timeframe: '4H',
        confidence: '91%',
        decision: 'BUY (STRONG IMPULSE)',
        decisionType: 'buy',
        patternDetected: 'Bullish Order Block Retest',
        entryZone: '$64,200 - $64,600',
        stopLoss: '$62,900 (Below 4H Demand Zone)',
        tp1: '$66,800',
        tp2: '$68,500',
        tp3: '$71,200',
        rrr: '1 : 3.1',
        rationale: 'Clean retest of institutional 4H order block with massive buy volume delta (+72%) and RSI momentum divergence confirmation.',
        currentPrice: '$64,450',
        resistance: 'R1 = $66,800 | R2 = $68,500',
        support: 'S1 = $62,900 | S2 = $61,500'
    },
    {
        id: 'gbpusd-flag',
        pair: 'GBPUSD (Cable)',
        timeframe: 'H1',
        confidence: '86%',
        decision: 'BUY (TREND CONTINUATION)',
        decisionType: 'buy',
        patternDetected: 'Bullish Flag Breakout',
        entryZone: '1.29650 - 1.29720',
        stopLoss: '1.29300 (Below Flag Channel Low)',
        tp1: '1.30200',
        tp2: '1.30650',
        tp3: '1.31200',
        rrr: '1 : 2.5',
        rationale: 'Consolidation flag breakout confirmed by Golden Cross on H1 with strong foreign exchange inflows post-London session open.',
        currentPrice: '1.29680',
        resistance: 'R1 = 1.30200 | R2 = 1.30650',
        support: 'S1 = 1.29300 | S2 = 1.28900'
    }
];

// Comparison Matrix Data
export const COMPARISON_DATA = [
    {
        feature: "Analysis Speed",
        manual: { status: 'warn', text: "15 - 30 Minutes" },
        aiTrade: { status: 'check', text: "< 3 Seconds" },
        highlight: true
    },
    {
        feature: "Human Bias & Emotion",
        manual: { status: 'warn', text: "High Risk (FOMO, Revenge Trading)" },
        aiTrade: { status: 'check', text: "100% Objective & Data-Driven" },
        highlight: true
    },
    {
        feature: "Chart Upload Feature",
        manual: { status: 'cross', text: "Not Supported" },
        aiTrade: { status: 'check', text: "Instant Vision OCR Recognition" },
        highlight: true
    },
    {
        feature: "MT5 Indicator Confluence",
        manual: { status: 'warn', text: "Manual & Slow Calculation" },
        aiTrade: { status: 'check', text: "Automated Real-Time Indicator Engine" },
        highlight: true
    },
    {
        feature: "Multi-Target Profit Blueprints",
        manual: { status: 'cross', text: "Arbitrary single target estimates" },
        aiTrade: { status: 'check', text: "Calculated TP1, TP2, TP3 Targets" },
        highlight: false
    }
];

// FAQ Accordion Data
export const FAQS = [
    {
        question: "What types of chart screenshots can I upload?",
        answer: "You can upload screenshots from any charting platform including TradingView, MetaTrader 4, MetaTrader 5, cTrader, or mobile broker apps in PNG, JPG, or WEBP format."
    },
    {
        question: "How does AI Trade ensure accuracy?",
        answer: "AI Trade uses a dual-engine architecture: Vision AI analyzes the visual patterns and structures on your uploaded image, while our backend cross-checks current live market tick data and MT5 indicators to confirm the signal."
    },
    {
        question: "What happens if my screenshot doesn't show a clear timeframe?",
        answer: "If the image lacks a clear timeframe label, the system automatically prompts you to choose your desired trading horizon (Short-Term, Mid-Term, or Long-Term) before generating the setup."
    },
    {
        question: "Can I upload charts from mobile broker apps?",
        answer: "Yes, absolutely. You can take a screenshot directly on your smartphone (iOS/Android) from MT4, MT5, TradingView, or proprietary broker apps and upload it directly."
    },
    {
        question: "How many targets (Take-Profits) are provided per setup?",
        answer: "Every trade analysis provides 3 distinct Take-Profit levels (TP1 for conservative scalpers, TP2 for trend followers, and TP3 for full swing runner targets) alongside a strict Stop-Loss."
    }
];
