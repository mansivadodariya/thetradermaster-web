/**
 * Intelligently generates a descriptive default strategy name based on:
 * - Draft properties (instrument, indicators, timeframe, pattern, category)
 * - Conversation messages (what indicators, symbols, or concepts were discussed)
 * - Avoids hardcoding "EMA Crossover Strategy" as a default
 */

const KNOWN_INDICATORS = [
    { key: 'rsi', label: 'RSI Momentum', match: /\b(rsi|relative strength)\b/i },
    { key: 'macd', label: 'MACD Divergence', match: /\b(macd|moving average convergence)\b/i },
    { key: 'bollinger', label: 'Bollinger Bands Breakout', match: /\b(bollinger|bbands|squeeze)\b/i },
    { key: 'supertrend', label: 'Supertrend Trend Follower', match: /\b(supertrend|super trend)\b/i },
    { key: 'stochastic', label: 'Stochastic Reversal', match: /\b(stochastic|stoch)\b/i },
    { key: 'ema', label: 'EMA Trend', match: /\b(ema|exponential moving average|moving average crossover)\b/i },
    { key: 'sma', label: 'SMA Crossover', match: /\b(sma|simple moving average)\b/i },
    { key: 'vwap', label: 'VWAP Institutional', match: /\b(vwap|volume weighted)\b/i },
    { key: 'atr', label: 'ATR Volatility', match: /\b(atr|average true range)\b/i },
    { key: 'donchian', label: 'Donchian Channel Breakout', match: /\b(donchian)\b/i },
    { key: 'breakout', label: 'Support & Resistance Breakout', match: /\b(breakout|support and resistance|key levels)\b/i },
    { key: 'price_action', label: 'Price Action Scalper', match: /\b(price action|candlestick patterns|pin bar|engulfing)\b/i }
];

const KNOWN_SYMBOLS = [
    { name: 'XAUUSD', match: /\b(gold|xau|xauusd|xau\/usd)\b/i },
    { name: 'EURUSD', match: /\b(eurusd|eur\/usd|euro)\b/i },
    { name: 'GBPUSD', match: /\b(gbpusd|gbp\/usd|cable|pound)\b/i },
    { name: 'USDJPY', match: /\b(usdjpy|usd\/jpy|yen)\b/i },
    { name: 'BTCUSD', match: /\b(bitcoin|btc|btcusd|btc\/usd)\b/i },
    { name: 'ETHUSD', match: /\b(ethereum|eth|ethusd|eth\/usd)\b/i },
    { name: 'US30', match: /\b(us30|dow|dow jones)\b/i },
    { name: 'NAS100', match: /\b(nas100|nasdaq|us100)\b/i }
];

export function computeDynamicStrategyName(draft = {}, messages = []) {
    // 1. If explicit specific name is provided that is not a generic placeholder
    if (draft?.strategy_name && !draft.strategy_name.toLowerCase().startsWith('ai strategy')) {
        return draft.strategy_name;
    }
    if (draft?.name && !draft.name.toLowerCase().startsWith('ai strategy') && !draft.name.toLowerCase().includes('momentum scalping')) {
        return draft.name;
    }

    // 2. Extract instrument/symbol
    let symbol = '';
    const draftSym = draft?.instrument || draft?.symbol || (Array.isArray(draft?.stock_name) ? draft.stock_name[0] : draft?.stock_name);
    if (draftSym && typeof draftSym === 'string') {
        symbol = draftSym.replace(/[^A-Za-z0-9/]/g, '').toUpperCase();
    }

    // 3. Collect all conversation text to detect concepts if draft is sparse
    const recentChatText = (Array.isArray(messages) ? messages : [])
        .map(m => (typeof m === 'string' ? m : m?.text || ''))
        .join(' ');

    const combinedContext = `${JSON.stringify(draft || {})} ${recentChatText}`;

    // Detect symbol if not in draft
    if (!symbol) {
        for (const s of KNOWN_SYMBOLS) {
            if (s.match.test(combinedContext)) {
                symbol = s.name;
                break;
            }
        }
    }
    if (!symbol) symbol = 'EURUSD';

    // 4. Detect matched indicators
    const matchedIndicators = [];
    for (const ind of KNOWN_INDICATORS) {
        if (ind.match.test(combinedContext)) {
            matchedIndicators.push(ind.label);
        }
    }

    // 5. Detect timeframe / style
    let style = 'Strategy';
    const tf = (draft?.timeframe || draft?.interval || '').toLowerCase();
    if (tf.includes('1m') || tf.includes('5m') || combinedContext.toLowerCase().includes('scalp')) {
        style = 'Scalper';
    } else if (tf.includes('1d') || tf.includes('4h') || combinedContext.toLowerCase().includes('swing')) {
        style = 'Swing Strategy';
    } else if (combinedContext.toLowerCase().includes('breakout')) {
        style = 'Breakout System';
    }

    // 6. Assemble intelligent title
    if (matchedIndicators.length > 0) {
        const topIndicator = matchedIndicators[0];
        if (matchedIndicators.length > 1) {
            const secondIndicator = matchedIndicators[1].split(' ')[0];
            return `${topIndicator} & ${secondIndicator} ${symbol} ${style}`;
        }
        return `${topIndicator} ${symbol} ${style}`;
    }

    // If explicit type/category in draft
    if (draft?.strategy_type || draft?.category) {
        const type = draft.strategy_type || draft.category;
        return `${type} ${symbol} ${style}`;
    }

    return `Algorithmic Momentum ${symbol} ${style}`;
}
