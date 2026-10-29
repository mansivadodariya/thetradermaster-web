'use client';

/**
 * Multilingual dictionary for My Bots strategy studio cards and filters.
 * Supports: en, zh, ru, es, ar, ary, vi, id, fil
 */

export const MY_BOTS_DICTIONARY = {
    // Strategy Directions
    'Long': {
        zh: '多头 (Long)',
        ru: 'Лонг (Long)',
        es: 'Largo (Long)',
        ar: 'شراء (Long)',
        ary: 'شرا (Long)',
        vi: 'Mua (Long)',
        id: 'Beli (Long)',
        fil: 'Long (Bili)',
    },
    'LONG': {
        zh: '多头 (Long)',
        ru: 'ЛОНГ',
        es: 'LARGO',
        ar: 'شراء',
        ary: 'شرا',
        vi: 'MUA',
        id: 'BELI',
        fil: 'LONG',
    },
    'SHORT': {
        zh: '空头 (Short)',
        ru: 'ШОРТ',
        es: 'CORTO',
        ar: 'بيع',
        ary: 'بيع',
        vi: 'BÁN',
        id: 'JUAL',
        fil: 'SHORT',
    },
    'BOTH': {
        zh: '双向',
        ru: 'ОБА',
        es: 'AMBOS',
        ar: 'كلاهما',
        ary: 'بجوج',
        vi: 'CẢ HAI',
        id: 'KEDUANYA',
        fil: 'PAREHO',
    },
    'Both': {
        zh: '双向',
        ru: 'Оба',
        es: 'Ambos',
        ar: 'كلاهما',
        ary: 'بجوج',
        vi: 'Cả hai',
        id: 'Keduanya',
        fil: 'Pareho',
    },
    'AI BOTS': {
        zh: 'AI 机器人',
        ru: 'AI-БОТЫ',
        es: 'BOTS IA',
        ar: 'روبوتات الذكاء الاصطناعي',
        ary: 'روبوتات الذكاء الاصطناعي',
        vi: 'BOT AI',
        id: 'BOT AI',
        fil: 'AI MGA BOT',
    },
    'MANUAL BOTS': {
        zh: '手动机器人',
        ru: 'РУЧНЫЕ БОТЫ',
        es: 'BOTS MANUALES',
        ar: 'روبوتات يدوية',
        ary: 'بوتات يدوية',
        vi: 'BOT THỦ CÔNG',
        id: 'BOT MANUAL',
        fil: 'MANUAL NA MGA BOT',
    },

    // Badges & Types
    'MANUAL BACKTEST': {
        zh: '手动回测',
        ru: 'РУЧНОЙ БЭКТЕСТ',
        es: 'BACKTEST MANUAL',
        ar: 'اختبار يدوي',
        ary: 'اختبار يدوي',
        vi: 'KIỂM THỬ THỦ CÔNG',
        id: 'BACKTEST MANUAL',
        fil: 'MANUAL NA BACKTEST',
    },
    'AI STRATEGY': {
        zh: 'AI 量化策略',
        ru: 'AI-СТРАТЕГИЯ',
        es: 'ESTRATEGIA IA',
        ar: 'استراتيجية الذكاء الاصطناعي',
        ary: 'استراتيجية الذكاء الاصطناعي',
        vi: 'CHIẾN LƯỢC AI',
        id: 'STRATEGI AI',
        fil: 'AI ESTRATEHIYA',
    },
    'CUSTOM STRATEGY': {
        zh: '自定义策略',
        ru: 'ПОЛЬЗОВАТЕЛЬСКАЯ СТРАТЕГИЯ',
        es: 'ESTRATEGIA PERSONALIZADA',
        ar: 'استراتيجية مخصصة',
        ary: 'استراتيجية مخصصة',
        vi: 'CHIẾN LƯỢC TÙY CHỈNH',
        id: 'STRATEGI KUSTOM',
        fil: 'CUSTOM NA ESTRATEHIYA',
    },
    'MANUAL': {
        zh: '手动',
        ru: 'Вручную',
        es: 'Manual',
        ar: 'يدوي',
        ary: 'يدوي',
        vi: 'Thủ công',
        id: 'Manual',
        fil: 'Manual',
    },
    'MANUAL / CUSTOM BOTS': {
        zh: '手动 / 自定义机器人',
        ru: 'Ручные / Кастомные боты',
        es: 'Bots Manuales / Personalizados',
        ar: 'روبوتات يدوية / مخصصة',
        ary: 'بوتات يدوية ومخصصة',
        vi: 'Bot Thủ công / Tùy chỉnh',
        id: 'Bot Manual / Kustom',
        fil: 'Manual / Pasadyang mga Bot',
    },

    // Indicator Patterns
    'EMA Crossover': {
        zh: 'EMA 指数移动平均交叉',
        ru: 'Пересечение EMA',
        es: 'Cruce de EMA',
        ar: 'تقاطع EMA',
        ary: 'تقاطع EMA',
        vi: 'Giao cắt EMA',
        id: 'Persilangan EMA',
        fil: 'EMA Crossover',
    },
    'RSI Mean Reversion': {
        zh: 'RSI 相对强弱均值回归',
        ru: 'Возврат к среднему по RSI',
        es: 'Reversión a la media con RSI',
        ar: 'ارتداد متوسط RSI',
        ary: 'ارتداد متوسط RSI',
        vi: 'Hồi quy trung bình RSI',
        id: 'Pembalikan Rata-rata RSI',
        fil: 'RSI Mean Reversion',
    },

    // Strategy Names
    'EURUSD 5min Long Strategy': {
        zh: 'EURUSD 5分钟多头策略',
        ru: 'Лонг-стратегия EURUSD 5мин',
        es: 'Estrategia en largo EURUSD 5min',
        ar: 'استراتيجية شراء EURUSD 5 دقائق',
        ary: 'استراتيجية شراء EURUSD 5 دقائق',
        vi: 'Chiến lược Mua EURUSD 5 phút',
        id: 'Strategi Long EURUSD 5 menit',
        fil: 'EURUSD 5min Long na Estratehiya',
    },
    'XAUUSD 5min Long Strategy': {
        zh: 'XAUUSD (黄金) 5分钟多头策略',
        ru: 'Лонг-стратегия XAUUSD 5мин',
        es: 'Estrategia en largo XAUUSD 5min',
        ar: 'استراتيجية شراء XAUUSD 5 دقائق',
        ary: 'استراتيجية شرا XAUUSD 5 دقائق',
        vi: 'Chiến lược Mua XAUUSD 5 phút',
        id: 'Strategi Long XAUUSD 5 menit',
        fil: 'XAUUSD 5min Long na Estratehiya',
    },
    'GBPUSD 5min RSI Mean Reversion': {
        zh: 'GBPUSD 5分钟 RSI 均值回归策略',
        ru: 'GBPUSD 5мин возврат к среднему по RSI',
        es: 'GBPUSD 5min reversión a la media RSI',
        ar: 'استراتيجية ارتداد RSI لزوج GBPUSD 5 دقائق',
        ary: 'استراتيجية ارتداد RSI لزوج GBPUSD 5 دقائق',
        vi: 'Chiến lược Hồi quy trung bình RSI GBPUSD 5 phút',
        id: 'GBPUSD 5 menit Pembalikan Rata-rata RSI',
        fil: 'GBPUSD 5min RSI Mean Reversion',
    },
    'XAUUSD 15min EMA Crossover (9/21)': {
        zh: 'XAUUSD 15分钟 EMA 交叉策略 (9/21)',
        ru: 'XAUUSD 15мин пересечение EMA (9/21)',
        es: 'XAUUSD 15min cruce de EMA (9/21)',
        ar: 'استراتيجية تقاطع EMA لزوج XAUUSD 15 دقيقة (9/21)',
        ary: 'استراتيجية تقاطع EMA لزوج XAUUSD 15 دقيقة (9/21)',
        vi: 'XAUUSD 15 phút Giao cắt EMA (9/21)',
        id: 'XAUUSD 15 menit Persilangan EMA (9/21)',
        fil: 'XAUUSD 15min EMA Crossover (9/21)',
    },

    'EMA Crossover (Fast 9 / Slow 21)': {
        zh: 'EMA 指数移动平均交叉 (快线9 / 慢线21)',
        ru: 'Пересечение EMA (Быстрая 9 / Медленная 21)',
        es: 'Cruce de EMA (Rápida 9 / Lenta 21)',
        ar: 'تقاطع EMA (سريع 9 / بطيء 21)',
        ary: 'تقاطع EMA (سريع 9 / ثقيل 21)',
        vi: 'Giao cắt EMA (Nhanh 9 / Chậm 21)',
        id: 'Persilangan EMA (Cepat 9 / Lambat 21)',
        fil: 'EMA Crossover (Mabilis 9 / Mabagal 21)',
    },
    'EMA Crossover (9/21)': {
        zh: 'EMA 指数移动平均交叉 (9/21)',
        ru: 'Пересечение EMA (9/21)',
        es: 'Cruce de EMA (9/21)',
        ar: 'تقاطع EMA (9/21)',
        ary: 'تقاطع EMA (9/21)',
        vi: 'Giao cắt EMA (9/21)',
        id: 'Persilangan EMA (9/21)',
        fil: 'EMA Crossover (9/21)',
    },
    // Descriptions
    'Trend Following - EMA Crossover Strategy generated via AI Strategy Advisor': {
        zh: '通过 AI 策略顾问生成的顺势交易 - EMA 交叉量化策略',
        ru: 'Трендовая стратегия пересечения EMA, сгенерированная AI-советником',
        es: 'Estrategia de seguimiento de tendencia con cruce de EMA generada por el Asesor IA',
        ar: 'استراتيجية تتبع الاتجاه بتقاطع EMA مولدة عبر مستشار الذكاء الاصطناعي',
        ary: 'استراتيجية تتبع الاتجاه بتقاطع EMA من مستشار الذكاء الاصطناعي',
        vi: 'Chiến lược theo xu hướng giao cắt EMA được tạo bởi Cố vấn AI',
        id: 'Strategi Mengikuti Tren Persilangan EMA yang dihasilkan oleh AI Strategy Advisor',
        fil: 'Trend Following - EMA Crossover Strategy na binuo ng AI Strategy Advisor',
    }
};

export function getMyBotsText(text, targetLang = 'en') {
    if (!text || typeof text !== 'string') return text || '';
    const lang = (targetLang || 'en').toLowerCase();
    if (lang === 'en') return text;

    const entry = MY_BOTS_DICTIONARY[text.trim()];
    if (entry && entry[lang]) {
        return entry[lang];
    }

    // Pattern matching for "Automated save from backtest run on {pair} ({tf})" or "{pair}"
    const autoSaveMatch = text.match(/Automated save from backtest run on ([A-Z0-9]+)(?:\s*\(([^)]+)\))?/i);
    if (autoSaveMatch) {
        const pair = autoSaveMatch[1];
        const tf = autoSaveMatch[2] ? ` (${autoSaveMatch[2]})` : '';
        const formats = {
            zh: `来自 ${pair}${tf} 回测运行的自动保存`,
            ru: `Автоматическое сохранение бэктеста для ${pair}${tf}`,
            es: `Guardado automático de backtest en ${pair}${tf}`,
            ar: `حفظ تلقائي من تشغيل الاختبار لـ ${pair}${tf}`,
            ary: `تسجيل أوتوماتيكي من الباك تيست لـ ${pair}${tf}`,
            vi: `Tự động lưu từ lần chạy kiểm thử trên ${pair}${tf}`,
            id: `Penyimpanan otomatis dari uji balik pada ${pair}${tf}`,
            fil: `Awtomatikong na-save mula sa backtest sa ${pair}${tf}`,
        };
        if (formats[lang]) return formats[lang];
    }

    // Pattern matching for "{pair} {tf} Long Strategy" or "{pair} Long Strategy"
    const longStratMatch = text.match(/([A-Z0-9]+)(?:\s+([0-9a-zA-Z]+))?\s+Long Strategy/i);
    if (longStratMatch) {
        const pair = longStratMatch[1];
        const tf = longStratMatch[2] ? ` ${longStratMatch[2]}` : '';
        const formats = {
            zh: `${pair}${tf} 多头量化策略`,
            ru: `Лонг-стратегия ${pair}${tf}`,
            es: `Estrategia en largo ${pair}${tf}`,
            ar: `استراتيجية شراء ${pair}${tf}`,
            ary: `استراتيجية شرا ${pair}${tf}`,
            vi: `Chiến lược Mua ${pair}${tf}`,
            id: `Strategi Long ${pair}${tf}`,
            fil: `${pair}${tf} Long na Estratehiya`,
        };
        if (formats[lang]) return formats[lang];
    }

    // Pattern matching for "{pair} {tf} Short Strategy" or "{pair} Short Strategy"
    const shortStratMatch = text.match(/([A-Z0-9]+)(?:\s+([0-9a-zA-Z]+))?\s+Short Strategy/i);
    if (shortStratMatch) {
        const pair = shortStratMatch[1];
        const tf = shortStratMatch[2] ? ` ${shortStratMatch[2]}` : '';
        const formats = {
            zh: `${pair}${tf} 空头量化策略`,
            ru: `Шорт-стратегия ${pair}${tf}`,
            es: `Estrategia en corto ${pair}${tf}`,
            ar: `استراتيجية بيع ${pair}${tf}`,
            ary: `استراتيجية بيع ${pair}${tf}`,
            vi: `Chiến lược Bán ${pair}${tf}`,
            id: `Strategi Short ${pair}${tf}`,
            fil: `${pair}${tf} Short na Estratehiya`,
        };
        if (formats[lang]) return formats[lang];
    }

    return text;
}
