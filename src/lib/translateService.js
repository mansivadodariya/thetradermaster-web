'use client';

import {
    maskWidgets,
    restoreWidgets,
    normalizeFiguresAndTables,
    ensureWidgetsRetained,
} from '@/utils/translateHelpers';

const clientTranslationCache = new Map();

const GOOGLE_LANG_MAP = {
    en: 'en',
    ar: 'ar',
    ary: 'ar',
    es: 'es',
    ru: 'ru',
    zh: 'zh-CN',
    vi: 'vi',
    id: 'id',
    fil: 'tl',
};

/**
 * Translate any backend response text directly into the desired target language.
 * Tries the Next.js API route first, and falls back to direct Google Translate in browser if needed.
 *
 * @param {string} text - The original text/markdown from the backend
 * @param {string} targetLang - The target language code (e.g. 'es', 'ar', 'ru', 'zh', 'vi', 'id', 'fil')
 * @returns {Promise<string>} The translated text
 */
export async function translateResponseText(text, targetLang = 'es') {
    if (!text || typeof text !== 'string' || !text.trim()) {
        return text;
    }

    const trimmed = text.trim();
    const lang = (targetLang || 'es').toLowerCase();

    if (lang === 'en') {
        return trimmed;
    }

    const cacheKey = `${lang}:${trimmed}`;
    if (clientTranslationCache.has(cacheKey)) {
        return clientTranslationCache.get(cacheKey);
    }

    // 1. Primary: Next.js API Route (handles chunking, server cache, etc.)
    try {
        const res = await fetch('/api/v1/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: trimmed, targetLang: lang }),
            signal: AbortSignal.timeout(15000),
        });

        if (res.ok) {
            const data = await res.json();
            if (data.success && data.translatedText) {
                clientTranslationCache.set(cacheKey, data.translatedText);
                return data.translatedText;
            }
        }
    } catch (_) {
        // Fallback to client-side direct request below
    }

    // 2. Client-side direct fallback to Google Translate GTX
    try {
        const tl = GOOGLE_LANG_MAP[lang] || lang || 'es';
        const { maskedText, widgetTokens } = maskWidgets(trimmed);
        let rawTranslated = '';

        if (maskedText.length > 1400) {
            const paragraphs = maskedText.split(/\n\n+/);
            const chunks = [];
            for (const p of paragraphs) {
                if (!p.trim()) {
                    chunks.push('');
                    continue;
                }
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(p.trim().slice(0, 1500))}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data[0])) {
                        chunks.push(data[0].map((s) => s?.[0] || '').join(''));
                    } else {
                        chunks.push(p);
                    }
                } else {
                    chunks.push(p);
                }
            }
            rawTranslated = chunks.join('\n\n');
        } else {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(maskedText)}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data[0])) {
                    rawTranslated = data[0].map((s) => s?.[0] || '').join('');
                }
            }
        }

        if (rawTranslated && rawTranslated.trim()) {
            const restored = restoreWidgets(rawTranslated, widgetTokens);
            const normalized = normalizeFiguresAndTables(restored);
            const translated = ensureWidgetsRetained(trimmed, normalized);
            clientTranslationCache.set(cacheKey, translated);
            return translated;
        }
    } catch (err) {
        console.warn('Client translation fallback notice:', err);
    }

    throw new Error('Unable to translate response at this moment. Please try again.');
}

export default translateResponseText;
