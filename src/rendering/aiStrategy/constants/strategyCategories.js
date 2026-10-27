export const STRATEGY_CATEGORIES = [
    { id: 'all', label: 'All Strategies' },
    { id: 'ema_pullback', label: 'EMA Pullback' }
];

export const PRESET_STRATEGIES = [
    { 
        id: '3e8d2b78-0e86-4fdf-9759-338276db1742', 
        name: 'EMA Pullback Strategy', 
        description: 'Trend Following EMA Pullback',
        category: 'ema_pullback'
    },
    { 
        id: 'strat-breakout-master', 
        name: 'Breakout Master Pro', 
        description: 'Key Level & Order Block Breakout',
        category: 'breakout'
    },
    { 
        id: 'strat-reversal-rsi', 
        name: 'RSI Mean Reversion', 
        description: 'Multi-Oscillator Extreme Reversal',
        category: 'reversal'
    },
    { 
        id: 'strat-scalping-vwap', 
        name: '1M/5M VWAP Scalper', 
        description: 'High Frequency Dynamic Scalping',
        category: 'scalping'
    },
    { 
        id: 'strat-momentum-surge', 
        name: 'MACD Momentum Surge', 
        description: 'Directional Velocity & Volume Push',
        category: 'momentum'
    },
    { 
        id: 'strat-smc-orderflow', 
        name: 'Smart Money Concepts (SMC)', 
        description: 'Institutional Liquidity & Order Flow',
        category: 'institutional'
    },
    { 
        id: 'strat-pattern-harmonic', 
        name: 'Harmonic Pattern Scanner', 
        description: 'Gartley, Bat & Double Top/Bottom Patterns',
        category: 'pattern'
    },
    { 
        id: 'strat-news-catalyst', 
        name: 'High Impact News Catalyst', 
        description: 'Macro Event & Volatility Expansion',
        category: 'news'
    },
    { 
        id: 'strat-confluence-matrix', 
        name: 'Multi-Timeframe Confluence', 
        description: '4-Pillar Quantitative Confluence Engine',
        category: 'confluence'
    }
];
