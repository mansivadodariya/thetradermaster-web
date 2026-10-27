import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
}

// In-memory LRU-like cache for translations
const serverTranslationCache = new Map();
const MAX_CACHE_SIZE = 500;

// Language code mapping for Google Translate GTX endpoint
const GOOGLE_LANG_MAP = {
    en: 'en',
    ar: 'ar',
    ary: 'ar', // Moroccan Arabic maps to Arabic
    es: 'es',
    ru: 'ru',
    zh: 'zh-CN',
    vi: 'vi',
    id: 'id',
    fil: 'tl', // Filipino / Tagalog
};

async function translateChunk(text, targetLang, sourceLang = 'auto') {
    const tl = GOOGLE_LANG_MAP[targetLang] || targetLang || 'es';
    const sl = sourceLang || 'auto';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: '*/*',
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Google Translate upstream error: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data[0])) {
        throw new Error('Unexpected translation response structure');
    }

    return data[0].map((segment) => segment?.[0] || '').join('');
}

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { text, targetLang = 'es', sourceLang = 'auto' } = body;

        if (!text || typeof text !== 'string' || !text.trim()) {
            return NextResponse.json(
                { success: false, error: 'Text to translate is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        const trimmed = text.trim();
        const targetLocale = (targetLang || 'es').toLowerCase();

        // If target language is already English and source is auto/en, or string is just numbers/symbols
        if (targetLocale === 'en' && (sourceLang === 'en' || !sourceLang)) {
            return NextResponse.json(
                { success: true, translatedText: trimmed, targetLang: 'en', sourceLang: 'en' },
                { status: 200, headers: corsHeaders }
            );
        }

        const cacheKey = `${targetLocale}:${trimmed.slice(0, 100)}_${trimmed.length}`;
        if (serverTranslationCache.has(cacheKey)) {
            return NextResponse.json(
                {
                    success: true,
                    translatedText: serverTranslationCache.get(cacheKey),
                    targetLang: targetLocale,
                    cached: true,
                },
                { status: 200, headers: corsHeaders }
            );
        }

        let translatedText = '';

        // Chunking for long markdown texts (to stay within Google single-query URL length limit)
        if (trimmed.length > 1400) {
            const paragraphs = trimmed.split(/\n\n+/);
            const translatedParagraphs = [];

            // Translate in small batches to preserve memory and speed
            for (const paragraph of paragraphs) {
                const pTrim = paragraph.trim();
                if (!pTrim) {
                    translatedParagraphs.push('');
                    continue;
                }
                if (pTrim.length > 1400) {
                    // Sub-split by single newline if a single paragraph is massive
                    const lines = pTrim.split(/\n+/);
                    const translatedLines = await Promise.all(
                        lines.map((l) => (l.trim() ? translateChunk(l, targetLocale, sourceLang) : Promise.resolve(l)))
                    );
                    translatedParagraphs.push(translatedLines.join('\n'));
                } else {
                    const translatedP = await translateChunk(pTrim, targetLocale, sourceLang);
                    translatedParagraphs.push(translatedP);
                }
            }

            translatedText = translatedParagraphs.join('\n\n');
        } else {
            translatedText = await translateChunk(trimmed, targetLocale, sourceLang);
        }

        if (serverTranslationCache.size >= MAX_CACHE_SIZE) {
            const firstKey = serverTranslationCache.keys().next().value;
            serverTranslationCache.delete(firstKey);
        }
        serverTranslationCache.set(cacheKey, translatedText);

        return NextResponse.json(
            {
                success: true,
                translatedText,
                targetLang: targetLocale,
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (err) {
        console.error('API Translation error:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Translation failed' },
            { status: 500, headers: corsHeaders }
        );
    }
}
