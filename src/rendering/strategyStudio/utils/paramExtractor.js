'use client';

export const normalizeInterval = (tf) => {
    if (!tf) return null;
    const s = String(tf).toLowerCase().trim();
    if (s === '1d' || s === '1day' || s === 'd1' || s === 'daily' || s === 'day') return '1day';
    if (s === '60m' || s === '60min' || s === '1h' || s === 'h1' || s === '1hr' || s === '1hour') return '60min';
    if (s === '30m' || s === '30min' || s === 'm30') return '30min';
    if (s === '15m' || s === '15min' || s === 'm15') return '15min';
    if (s === '5m' || s === '5min' || s === 'm5') return '5min';
    if (s.includes('min')) return s;
    return `${s}min`;
};

export const normalizeSymbol = (sym) => {
    if (!sym) return null;
    if (Array.isArray(sym)) sym = sym[0];
    const s = String(sym).toUpperCase().replace(/[\/\-_]/g, '').trim();
    const map = {
        'GOLD': 'XAUUSD',
        'BTC': 'BTCUSD',
        'ETH': 'ETHUSD',
        'SOL': 'SOLUSD'
    };
    return map[s] || s;
};

export const extractParamsFromChatAndContext = ({ text = '', extraData = null, draft = null, strategy = null, messages = [] }) => {
    const res = {};

    // 1. Direct from draft & strategy
    if (draft?.instrument || draft?.symbol) res.symbol = normalizeSymbol(draft.instrument || draft.symbol);
    if (draft?.timeframe || draft?.interval) res.interval = normalizeInterval(draft.timeframe || draft.interval);
    if (draft?.capital || draft?.inital_capital) res.capital = Number(draft.capital || draft.inital_capital);
    if (draft?.quantity || draft?.lots) res.quantity = Math.min(Math.max(parseFloat(draft.quantity || draft.lots) || 0.01, 0.01), 1);

    if (strategy?.stock_name || strategy?.symbol) res.symbol = res.symbol || normalizeSymbol(strategy.stock_name || strategy.symbol);
    if (strategy?.interval || strategy?.timeframe) res.interval = res.interval || normalizeInterval(strategy.interval || strategy.timeframe);

    // 2. From QA answers in the wizard
    const qaItems = extraData?.qaList || [];
    qaItems.forEach((qa) => {
        const str = `${qa.answer || ''} ${qa.label || ''} ${qa.value || ''} ${qa.question || ''}`;
        
        const symMatch = str.match(/\b(GBPJPY|EURJPY|EURUSD|GBPUSD|USDCAD|XAUUSD|BTCUSD|ETHUSD|US30|SOLUSD|AUDUSD|NZDUSD|USDJPY|EURGBP|NAS100)\b/i);
        if (symMatch && !res.symbol) res.symbol = normalizeSymbol(symMatch[1]);

        const intvMatch = str.match(/\b(1day|1d|daily|60min|1h|1hr|30min|30m|15min|15m|5min|5m)\b/i);
        if (intvMatch && !res.interval) res.interval = normalizeInterval(intvMatch[1]);

        const capMatch = str.match(/\$?\s*([0-9]{3,7})\s*(?:capital|balance|usd|\$)/i);
        if (capMatch && !res.capital) res.capital = Number(capMatch[1]);

        const qtyMatch = str.match(/\b(0\.01|0\.05|0\.10|0\.1|0\.50|0\.5|1\.00|1)\s*(?:lots?|micro|mini|std)?\b/i);
        if (qtyMatch && !res.quantity) res.quantity = parseFloat(qtyMatch[1]);
    });

    // 3. From text and recent messages in reverse order
    const allTexts = [text];
    if (Array.isArray(messages)) {
        for (let i = messages.length - 1; i >= Math.max(0, messages.length - 8); i--) {
            const m = messages[i];
            if (m?.text) allTexts.push(m.text);
            if (m?.draft?.instrument && !res.symbol) res.symbol = normalizeSymbol(m.draft.instrument);
            if (m?.draft?.timeframe && !res.interval) res.interval = normalizeInterval(m.draft.timeframe);
        }
    }

    const combined = allTexts.join(' ');

    if (!res.symbol) {
        const symMatch = combined.match(/\b(GBPJPY|EURJPY|EURUSD|GBPUSD|USDCAD|XAUUSD|BTCUSD|ETHUSD|US30|SOLUSD|AUDUSD|NZDUSD|USDJPY|EURGBP|NAS100)\b/i);
        if (symMatch) res.symbol = normalizeSymbol(symMatch[1]);
    }

    if (!res.interval) {
        const intvMatch = combined.match(/\b(1day|1d|daily|60min|1h|1hr|30min|30m|15min|15m|5min|5m)\b/i);
        if (intvMatch) res.interval = normalizeInterval(intvMatch[1]);
    }

    if (!res.capital) {
        const capMatch = combined.match(/\$?\s*([0-9]{4,7})\s*(?:capital|balance|usd|\$)/i);
        if (capMatch) res.capital = Number(capMatch[1]);
    }

    return res;
};
