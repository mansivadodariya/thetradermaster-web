'use client';

const LABEL_MAP = {
    stock_name: 'Asset / Pair',
    asset: 'Asset / Pair',
    instrument: 'Asset / Pair',
    symbol: 'Asset / Pair',
    category: 'Category',
    direction: 'Direction',
    pattern: 'Trading Pattern',
    entry_pattern: 'Entry Pattern',
    entry_conditions: 'Entry Rules',
    exit_conditions: 'Exit Rules',
    interval: 'Timeframe',
    timeframe: 'Timeframe',
    session: 'Trading Session',
    from_date: 'From Date',
    to_date: 'To Date',
    inital_capital: 'Initial Capital',
    initial_capital: 'Initial Capital',
    capital: 'Capital',
    quantity: 'Position Size',
    lots: 'Position Size',
    max_open_positions: 'Max Open Positions',
    risk_per_trade: 'Risk Per Trade',
    max_daily_loss: 'Max Daily Loss',
    stoploss: 'Stop Loss',
    stoploss_pips: 'Stop Loss',
    stoploss_type: 'Stop Loss Type',
    trailing_stoploss: 'Trailing Stop Loss',
    trailing_stoploss_pips: 'Trailing Stop Loss',
    target: 'Target Profit',
    target_pips: 'Target Profit',
    risk_reward_ratio: 'Risk / Reward',
    strategy_name: 'Strategy Name',
    name: 'Strategy Name',
    win_rate: 'Win Rate',
    total_trades: 'Total Trades',
    indicator: 'Indicator',
    indicator_params: 'Indicator Parameters',
    fast_ema: 'Fast EMA',
    slow_ema: 'Slow EMA',
    rsi_period: 'RSI Period'
};

/**
 * Formats a key-value pair or complex object from parsed JSON into clean, human-readable bullet points
 */
function formatJsonObjectToReadableSummary(obj) {
    if (!obj || typeof obj !== 'object') return '';
    const lines = [];
    const visitedSemantic = new Set();

    for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined || value === '') continue;

        // Skip internal or system metadata
        if (
            key === 'session_id' ||
            key === 'status' ||
            key === 'draft_id' ||
            key === 'step' ||
            key === 'total_steps' ||
            key === 'complete' ||
            key === 'success' ||
            key === 'code'
        ) {
            continue;
        }

        const label = LABEL_MAP[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        if (visitedSemantic.has(label)) continue;
        visitedSemantic.add(label);

        let valStr = '';
        if (Array.isArray(value)) {
            if (value.length === 0) continue;
            if (typeof value[0] === 'object' && value[0] !== null) {
                valStr = value.map((item) => {
                    if (item.indicator && item.operator && item.value !== undefined) {
                        return `${item.indicator} ${String(item.operator).replace(/_/g, ' ')} ${item.value}`;
                    }
                    return Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(', ');
                }).join('; ');
            } else {
                valStr = value.join(', ');
            }
        } else if (typeof value === 'object' && value !== null) {
            valStr = Object.entries(value)
                .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                .join(', ');
        } else {
            valStr = String(value);
            if (key.includes('capital') && !isNaN(Number(value))) {
                valStr = `$${Number(value).toLocaleString()}`;
            } else if ((key.includes('stoploss') || key.includes('target')) && !isNaN(Number(value))) {
                valStr = `${value} pts`;
            } else if ((key.includes('risk') || key.includes('loss')) && !isNaN(Number(value)) && !key.includes('ratio')) {
                valStr = `${value}%`;
            } else if (key === 'lots' && !isNaN(Number(value))) {
                valStr = `${value} lots`;
            }
        }

        lines.push(`• **${label}**: ${valStr}`);
    }

    return lines.join('\n');
}

/**
 * Extracts a balanced JSON object starting at startIndex, correctly handling nested objects and strings.
 */
function extractBalancedJsonObject(str, startIndex) {
    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = startIndex; i < str.length; i++) {
        const char = str[i];
        if (escape) {
            escape = false;
            continue;
        }
        if (char === '\\') {
            escape = true;
            continue;
        }
        if (char === '"') {
            inString = !inString;
            continue;
        }
        if (!inString) {
            if (char === '{') {
                depth++;
            } else if (char === '}') {
                depth--;
                if (depth === 0) {
                    return { jsonStr: str.slice(startIndex, i + 1), endIndex: i + 1 };
                }
            }
        }
    }
    return null;
}

/**
 * Sanitizes any raw JSON blocks inside a text string into clean human-friendly summaries.
 * Prevents raw JSON dumps or internal prompt tags from appearing in chat bubbles.
 */
export function sanitizeRawJsonText(rawText) {
    if (!rawText || typeof rawText !== 'string') return rawText;

    let text = rawText;

    // 1. Strip internal backend [SUGGESTIONS] ... [/SUGGESTIONS] prompt tags
    text = text.replace(/\[SUGGESTIONS\][\s\S]*?\[\/SUGGESTIONS\]/gi, '');
    text = text.replace(/\[\/?SUGGESTIONS\]/gi, '');

    // 2. Fenced code blocks ```json { ... } ``` or ``` { ... } ```
    text = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, (match, code) => {
        const trimmed = code.trim();
        if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
                    return parsed.map(formatJsonObjectToReadableSummary).filter(Boolean).join('\n\n');
                } else if (typeof parsed === 'object' && parsed !== null) {
                    return '\n' + formatJsonObjectToReadableSummary(parsed);
                }
            } catch (e) {
                // Not valid JSON, continue
            }
        }
        return code;
    });

    // 3. Process [STRATEGY_READY] ... [/STRATEGY_READY] or blocks ending with [/STRATEGY_READY]
    text = text.replace(/\[STRATEGY_READY\]([\s\S]*?)\[\/STRATEGY_READY\]/gi, (match, inner) => {
        const trimmed = inner.trim();
        try {
            const parsed = JSON.parse(trimmed);
            return '\n' + formatJsonObjectToReadableSummary(parsed);
        } catch (_) {
            const firstBrace = trimmed.indexOf('{');
            if (firstBrace !== -1) {
                const balanced = extractBalancedJsonObject(trimmed, firstBrace);
                if (balanced) {
                    try {
                        const parsed = JSON.parse(balanced.jsonStr);
                        return '\n' + formatJsonObjectToReadableSummary(parsed);
                    } catch (_) {}
                }
            }
            return '';
        }
    });

    // 4. Strip standalone [STRATEGY_READY] and [/STRATEGY_READY] tags
    text = text.replace(/\[\/?STRATEGY_READY\]/gi, '');

    // 5. Look for any balanced JSON objects in text (e.g. `{ "instrument": ... }`)
    let result = '';
    let i = 0;
    while (i < text.length) {
        if (text[i] === '{') {
            const balanced = extractBalancedJsonObject(text, i);
            if (balanced) {
                const { jsonStr, endIndex } = balanced;
                const isStrategyJson =
                    jsonStr.includes('"instrument"') ||
                    jsonStr.includes('"category"') ||
                    jsonStr.includes('"symbol"') ||
                    jsonStr.includes('"stock_name"') ||
                    jsonStr.includes('"entry_pattern"') ||
                    jsonStr.includes('"timeframe"') ||
                    jsonStr.includes('"indicator_params"') ||
                    jsonStr.includes('"strategy_name"') ||
                    jsonStr.includes('"initial_capital"');

                if (isStrategyJson) {
                    try {
                        const parsed = JSON.parse(jsonStr);
                        result += '\n' + formatJsonObjectToReadableSummary(parsed) + '\n';
                        i = endIndex;
                        continue;
                    } catch (_) {
                        // Unparseable JSON block: don't dump raw syntax
                        i = endIndex;
                        continue;
                    }
                }
            }
        }
        result += text[i];
        i++;
    }
    text = result;

    // 6. Convert any unwrapped raw JSON key-value lines like `"instrument": "EURUSD",`
    text = text.replace(/(?:^|\n)\s*"([a-zA-Z0-9_]+)"\s*:\s*(?:"([^"]*)"|([0-9.]+)|(true|false|null))\s*,?/gi, (match, key, sVal, nVal, bVal) => {
        const val = sVal !== undefined ? sVal : (nVal !== undefined ? nVal : bVal);
        if (key === 'session_id' || key === 'status' || key === 'code') return '';
        const label = LABEL_MAP[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        let formattedVal = val;
        if (key.includes('capital') && !isNaN(Number(val))) formattedVal = `$${Number(val).toLocaleString()}`;
        else if (key === 'lots') formattedVal = `${val} lots`;
        else if ((key.includes('risk') || key.includes('loss')) && !isNaN(Number(val))) formattedVal = `${val}%`;
        return `\n• **${label}**: ${formattedVal}`;
    });

    // 7. Strip stray braces, brackets, and empty punctuation lines
    text = text.replace(/^\s*[{}[\],]+\s*$/gm, '');

    // 8. Clean stray asterisks in bullet points
    text = text.replace(/(?:^|\n)\s*[•\-]\s*\*([^*:\n]+):?/g, '\n• $1:');
    text = text.replace(/(?:^|\n)\s*\*([A-Za-z0-9\s]{2,30}:)/g, '\n**$1**');

    // 9. Clean up trailing "Category:" if followed immediately by bullet point or empty
    text = text.replace(/(?:^|\n)\s*Category:\s*(?=\n|$)/gi, '');

    // 10. Clean up excessive blank lines
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    return text;
}
