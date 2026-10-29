/**
 * Utilities to protect graphs (candlestick & radar widgets), figures (numbers,
 * prices, ratios, percentages), and markdown tables during translation.
 */

/**
 * Normalizes localized, translated, or spaced widget tokens into standard
 * canonical [WIDGET:TYPE:SYMBOL] format.
 *
 * Handles Spanish (candelabro), Russian (подсвечник, радар), Arabic (شموع, رادار),
 * Chinese (烛台, 雷达), Vietnamese (nến), Indonesian (lilin), Filipino (kandila).
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizeWidgetTags(text = '') {
    if (!text || typeof text !== 'string') return text;
    let s = text.replace(/：/g, ':').replace(/｜/g, '|');

    // Matches any localized or spaced widget tags e.g. [ВИДЖЕТ: ПОДСВЕЧНИК: EURUSD]
    s = s.replace(/\[\s*(?:WIDGET|ВИДЖЕТ|小部件|TIỆN\s*ÍCH|عنصر\s*واجهة(?:\s*مستخدم)?)\s*:\s*([^:\]]+?)(?:\s*:\s*([^\]]+?))?\s*\]/gi, (match, rawType, rawSym) => {
        const typeStr = (rawType || '').trim().toLowerCase();
        const sym = (rawSym || '').trim().toUpperCase();

        let standardType = 'CANDLESTICK';
        if (/radar|радар|sentiment|настроение|sentimiento|رادار|雷达|tâm lý|damdamin/i.test(typeStr)) {
            standardType = 'SENTIMENT_RADAR';
        } else if (/candle|подсвечник|свеч|candelabro|candelero|lilin|kandila|nến|烛台|شموع/i.test(typeStr)) {
            standardType = 'CANDLESTICK';
        } else {
            standardType = typeStr.toUpperCase().replace(/\s+/g, '_');
        }

        return `[WIDGET:${standardType}${sym ? `:${sym}` : ''}]`;
    });

    return s;
}

/**
 * Pre-translation masking: replaces all widget tags with language-neutral
 * protected constant identifiers (CXWIDGETPROTECTED_{index}_END) so translation
 * APIs do not translate or mangle graph widget definitions.
 *
 * @param {string} text
 * @returns {{ maskedText: string, widgetTokens: Array<{ placeholder: string, canonicalTag: string, index: number }> }}
 */
export function maskWidgets(text = '') {
    if (!text || typeof text !== 'string') return { maskedText: text, widgetTokens: [] };
    const widgetTokens = [];
    const normalized = normalizeWidgetTags(text);

    const maskedText = normalized.replace(/\[WIDGET:[A-Z0-9_]+(?::[A-Z0-9/_-]+)?\]/gi, (match) => {
        const index = widgetTokens.length;
        const placeholder = `CXWIDGETPROTECTED_${index}_END`;
        widgetTokens.push({ placeholder, canonicalTag: match, index });
        return placeholder;
    });

    return { maskedText, widgetTokens };
}

/**
 * Post-translation restoration: restores protected widget tokens back to canonical
 * [WIDGET:...] tags. If Google Translate completely dropped any widget token, it
 * re-injects the missing widget into the translated text at the appropriate section.
 *
 * @param {string} translatedText
 * @param {Array<{ placeholder: string, canonicalTag: string, index: number }>} widgetTokens
 * @returns {string}
 */
export function restoreWidgets(translatedText = '', widgetTokens = []) {
    if (!translatedText || typeof translatedText !== 'string') return translatedText;
    let restored = translatedText;

    widgetTokens.forEach(({ canonicalTag, index }) => {
        // Tolerates casing changes or spaces injected around the token by translation
        const tokenRegex = new RegExp(`(?:CXWIDGETPROTECTED|cxwidgetprotected)[\\s_]*${index}[\\s_]*(?:END|end)`, 'gi');
        if (tokenRegex.test(restored)) {
            restored = restored.replace(tokenRegex, canonicalTag);
        } else if (!restored.includes(canonicalTag)) {
            // Token was dropped by translation engine: re-inject at appropriate position
            if (canonicalTag.includes('CANDLESTICK')) {
                const headingMatch = restored.match(/^(#[^\n]+\n+)/m);
                if (headingMatch) {
                    restored = restored.replace(headingMatch[0], `${headingMatch[0]}\n\n${canonicalTag}\n\n`);
                } else {
                    restored = `${canonicalTag}\n\n${restored}`;
                }
            } else {
                const thesisMatch = restored.match(/(\n\n\*{0,2}(?:Trade Thesis|Final Bias|Тезис|Заключение|Tesis))/i);
                if (thesisMatch) {
                    restored = restored.replace(thesisMatch[0], `\n\n${canonicalTag}\n\n${thesisMatch[0]}`);
                } else {
                    restored = `${restored}\n\n${canonicalTag}`;
                }
            }
        }
    });

    return restored;
}

/**
 * Normalizes markdown tables, numerical figures, and indicator rows
 * so translated reports render figures cleanly and do not break remark-gfm.
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizeFiguresAndTables(text = '') {
    if (!text || typeof text !== 'string') return '';
    let raw = text.replace(/｜/g, '|');

    // 1. Repair markdown table delimiter rows: converts (| — | — | or | - | - |) into standard GFM (| --- | --- |)
    raw = raw.replace(/^\|?[\s\-–—:]+(\|[\s\-–—:]+)+\|?$/gm, (delLine) => {
        const cells = delLine.trim().split('|');
        const norm = cells.map((cell) => {
            const t = cell.trim();
            if (!t) return '';
            const l = t.startsWith(':');
            const r = t.endsWith(':');
            if (l && r) return ' :---: ';
            if (l) return ' :--- ';
            if (r) return ' ---: ';
            return ' --- ';
        });
        return norm.join('|');
    });

    // 2. Repair split decimals in figures: 1. 0825 -> 1.0825
    raw = raw.replace(/(\d+)\.\s+(\d+)/g, '$1.$2');

    // 3. Repair split comma numbers: 1, 000 -> 1,000
    raw = raw.replace(/(\d+)\s*,\s*(\d{3})/g, '$1,$2');

    // 4. Repair split ratios: 1 : 2.5 -> 1:2.5
    raw = raw.replace(/(\d+)\s*:\s*(\d+(?:\.\d+)?)/g, '$1:$2');

    // 5. Repair split currency pairs: EUR / USD -> EUR/USD
    raw = raw.replace(/\b([A-Z]{3,6})\s*\/\s*([A-Z]{3,6})\b/g, '$1/$2');

    // 6. Repair split percentages: 54.2 % -> 54.2%
    raw = raw.replace(/(\d+(?:\.\d+)?)\s*%/g, '$1%');

    return raw;
}

/**
 * Guarantees that all graph/chart widgets present in the original report are
 * preserved in the translated report, preventing any graph or radar from being lost.
 *
 * @param {string} originalText
 * @param {string} translatedText
 * @returns {string}
 */
export function ensureWidgetsRetained(originalText = '', translatedText = '') {
    if (!originalText || !translatedText) return translatedText || originalText;
    const normalizedOrig = normalizeWidgetTags(originalText);
    const origWidgets = normalizedOrig.match(/\[WIDGET:[A-Z0-9_]+(?::[A-Z0-9/_-]+)?\]/gi) || [];
    if (origWidgets.length === 0) return translatedText;

    let result = normalizeWidgetTags(translatedText);

    origWidgets.forEach((tag) => {
        if (!result.includes(tag)) {
            if (tag.includes('CANDLESTICK')) {
                const headingMatch = result.match(/^(#[^\n]+\n+)/m);
                if (headingMatch) {
                    result = result.replace(headingMatch[0], `${headingMatch[0]}\n\n${tag}\n\n`);
                } else {
                    result = `${tag}\n\n${result}`;
                }
            } else {
                const thesisMatch = result.match(/(\n\n\*{0,2}(?:Trade Thesis|Final Bias|Тезис|Заключение|Tesis))/i);
                if (thesisMatch) {
                    result = result.replace(thesisMatch[0], `\n\n${tag}\n\n${thesisMatch[0]}`);
                } else {
                    result = `${result}\n\n${tag}`;
                }
            }
        }
    });

    return normalizeFiguresAndTables(result);
}
