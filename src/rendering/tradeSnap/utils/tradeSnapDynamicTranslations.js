'use client';

/**
 * Dynamic AI text and pattern translation dictionary for TradeSnap
 * Supports: zh, ru, es, ar, ary, vi, id, fil
 */

export const TRADESNAP_DYNAMIC_DICTIONARY = {
    // Live Scan Patterns
    'Rectangular consolidation': {
        zh: '矩形震荡整理',
        ru: 'Прямоугольная консолидация',
        es: 'Consolidación rectangular',
        ar: 'توطيد مستطيلي جانبي',
        ary: 'توطيد مستطيلي جانبي',
        vi: 'Tích lũy mô hình chữ nhật',
        id: 'Konsolidasi persegi panjang',
        fil: 'Parihabang konsolidasyon',
    },
    'Bull Flag / Accumulation Breakout': {
        zh: '牛旗形态 / 吸筹突破',
        ru: 'Бычий флаг / Пробой накопления',
        es: 'Bandera alcista / Ruptura de acumulación',
        ar: 'علم صعودي / اختراق التجميع',
        ary: 'علم صعودي / اختراق التجميع',
        vi: 'Cờ tăng giá / Đột phá tích lũy',
        id: 'Bull Flag / Penembusan Akumulasi',
        fil: 'Bull Flag / Accumulation Breakout',
    },
    'Bearish Channel / Distribution Breakdown': {
        zh: '熊市通道 / 派发下破',
        ru: 'Медвежий канал / Пробой распределения',
        es: 'Canal bajista / Ruptura de distribución',
        ar: 'قناة هبوطية / كسر التوزيع',
        ary: 'قناة هبوطية / كسر التوزيع',
        vi: 'Kênh giảm giá / Phá vỡ phân phối',
        id: 'Saluran Bearish / Penurunan Distribusi',
        fil: 'Bearish Channel / Distribution Breakdown',
    },

    // Execution types & invalidation reasons
    'Structure protection level from chart': {
        zh: '基于图表结构的保护位',
        ru: 'Уровень защиты структуры по графику',
        es: 'Nivel de protección de estructura del gráfico',
        ar: 'مستوى حماية الهيكل من الرسم البياني',
        ary: 'مستوى حماية الهيكل من الشارت',
        vi: 'Mức bảo vệ cấu trúc từ biểu đồ',
        id: 'Tingkat perlindungan struktur dari grafik',
        fil: 'Lebel ng proteksyon ng istruktura mula sa tsart',
    },
    'Structure protection level': {
        zh: '结构保护止损位',
        ru: 'Уровень защиты структуры',
        es: 'Nivel de protección estructural',
        ar: 'مستوى حماية الهيكل',
        ary: 'مستوى حماية الهيكل',
        vi: 'Mức bảo vệ cấu trúc',
        id: 'Tingkat perlindungan struktur',
        fil: 'Antas ng proteksyon sa istruktura',
    },
    'Vision AI Chart Analysis & M15 Technical Confluence': {
        zh: '视觉AI图表分析与M15技术共振',
        ru: 'Анализ графика Vision AI и слияние M15',
        es: 'Análisis gráfico Vision AI y confluencia técnica M15',
        ar: 'تحليل الذكاء الاصطناعي البصري وتوافق M15 الفني',
        ary: 'تحليل الذكاء الاصطناعي وتوافق فني M15',
        vi: 'Phân tích biểu đồ Vision AI & Hợp lưu kỹ thuật M15',
        id: 'Analisis Grafik Vision AI & Konfluensi Teknis M15',
        fil: 'Vision AI Tsart Pagsusuri at M15 Technical Confluence',
    },
    'Vision AI & Technical Confluence': {
        zh: '视觉AI与多维度技术指标共振',
        ru: 'Vision AI и техническое слияние',
        es: 'Vision AI y confluencia técnica',
        ar: 'توافق فني مع الذكاء الاصطناعي البصري',
        ary: 'توافق فني مع الذكاء الاصطناعي',
        vi: 'Hợp lưu Vision AI & Kỹ thuật',
        id: 'Vision AI & Konfluensi Teknis',
        fil: 'Vision AI at Teknikal na Confluence',
    },
    'Market Order / Retracement': {
        zh: '市价单 / 回踩入场',
        ru: 'Рыночный ордер / Откат',
        es: 'Orden de mercado / Retroceso',
        ar: 'أمر سوق / ارتداد',
        ary: 'أمر سوق / ارتداد',
        vi: 'Lệnh thị trường / Hồi quy',
        id: 'Order Pasar / Retracement',
        fil: 'Market Order / Retracement',
    },
    'Invalidation below key pivot level': {
        zh: '跌破关键枢轴位失效',
        ru: 'Недействительность ниже ключевого пивота',
        es: 'Invalidación por debajo del pivote clave',
        ar: 'إلغاء أسفل مستوى الارتكاز الرئيسي',
        ary: 'إلغاء تحت مستوى البيفوت الرئيسي',
        vi: 'Vô hiệu hóa dưới mức pivot chính',
        id: 'Pembatalan di bawah level pivot kunci',
        fil: 'Pagpapawalang-bisa sa ibaba ng mahalagang pivot',
    },

    // Market Strength & Momentum
    'Moderate': {
        zh: '中等',
        ru: 'Умеренная',
        es: 'Moderada',
        ar: 'معتدل',
        ary: 'معتدل',
        vi: 'Trung bình',
        id: 'Moderat',
        fil: 'Katamtaman',
    },
    'Down Momentum': {
        zh: '下行动能',
        ru: 'Нисходящий импульс',
        es: 'Momento bajista',
        ar: 'زخم هبوطي',
        ary: 'زخم هابط',
        vi: 'Động lượng giảm',
        id: 'Momentum Turun',
        fil: 'Pababang Momentum',
    },
    'Up Momentum': {
        zh: '上行动能',
        ru: 'Восходящий импульс',
        es: 'Momento alcista',
        ar: 'زخم صعودي',
        ary: 'زخم صاعد',
        vi: 'Động lượng tăng',
        id: 'Momentum Naik',
        fil: 'Pataas na Momentum',
    },
    'Down': {
        zh: '向下',
        ru: 'Вниз',
        es: 'Abajo',
        ar: 'هبوط',
        ary: 'هبوط',
        vi: 'Xuống',
        id: 'Turun',
        fil: 'Pababa',
    },
    'Up': {
        zh: '向上',
        ru: 'Вверх',
        es: 'Arriba',
        ar: 'صعود',
        ary: 'صعود',
        vi: 'Lên',
        id: 'Naik',
        fil: 'Pataas',
    },
    'Normal': {
        zh: '正常',
        ru: 'Нормальный',
        es: 'Normal',
        ar: 'طبيعي',
        ary: 'عادي',
        vi: 'Bình thường',
        id: 'Normal',
        fil: 'Karaniwan',
    },

    // UI Badges & Labels
    'Market Strength:': {
        zh: '市场强度:',
        ru: 'Сила рынка:',
        es: 'Fuerza del mercado:',
        ar: 'قوة السوق:',
        ary: 'قوة السوق:',
        vi: 'Sức mạnh thị trường:',
        id: 'Kekuatan Pasar:',
        fil: 'Lakas ng Merkado:',
    },
    'Momentum': {
        zh: '动能',
        ru: 'Импульс',
        es: 'Momento',
        ar: 'الزخم',
        ary: 'الزخم',
        vi: 'Động lượng',
        id: 'Momentum',
        fil: 'Momentum',
    },
    'Match': {
        zh: '匹配度',
        ru: 'Совпадение',
        es: 'Coincidencia',
        ar: 'تطابق',
        ary: 'تطابق',
        vi: 'Khớp',
        id: 'Kecocokan',
        fil: 'Tugma',
    },
    'Patterns Detected': {
        zh: '个形态被识别',
        ru: 'Паттернов обнаружено',
        es: 'Patrones detectados',
        ar: 'أنماط تم اكتشافها',
        ary: 'أنماط تم رصدها',
        vi: 'Mô hình được phát hiện',
        id: 'Pola Terdeteksi',
        fil: 'Mga Pattern na Natukoy',
    },
    '1 Patterns Detected': {
        zh: '检测到 1 个形态',
        ru: 'Обнаружен 1 паттерн',
        es: '1 patrón detectado',
        ar: 'تم اكتشاف نمط واحد',
        ary: 'تم رصد نمط واحد',
        vi: '1 mô hình được phát hiện',
        id: '1 Pola Terdeteksi',
        fil: '1 Pattern na Natukoy',
    },

    // Risk Warnings
    'Neutral bias but momentum is down – divergence check': {
        zh: '中立偏向但动能趋向下行 — 建议排查指标背离',
        ru: 'Нейтральный уклон, но импульс направлен вниз — проверка дивергенции',
        es: 'Sesgo neutral pero momento a la baja – comprobación de divergencia',
        ar: 'انحياز محايد ولكن الزخم هابط – فحص التباعد',
        ary: 'ميل محايد ولكن الزخم هابط – تحقق من الدايفرجنس',
        vi: 'Xu hướng trung lập nhưng động lượng giảm – kiểm tra phân kỳ',
        id: 'Bias netral namun momentum turun – periksa divergensi',
        fil: 'Neutral bias ngunit pababa ang momentum – divergence check',
    },

    // AI Rationales
    'The asset is currently consolidating in a range between 2030 and 2050. Price action shows indecision with no clear directional momentum. A no-trade stance is optimal until the price breaks out of this compression zone with volume confirmation.': {
        zh: '该品种目前处于 2030 至 2050 的区间内震荡整理。价格行为呈现多空犹豫，缺乏明确的单边动能。在伴随放量突破该压缩整理区间前，建议保持观望等待更明确的信号。',
        ru: 'Актив в настоящее время консолидируется в диапазоне между 2030 и 2050. Ценовое движение демонстрирует нерешительность без четкого направленного импульса. Оптимальна позиция вне рынка до подтверждения пробоя зоны сжатия объемом.',
        es: 'El activo se encuentra actualmente consolidando en un rango entre 2030 y 2050. La acción del precio muestra indecisión sin un impulso direccional claro. Mantenerse al margen es óptimo hasta que el precio rompa esta zona de compresión con confirmación de volumen.',
        ar: 'يتذبذب الأصل حالياً في نطاق بين 2030 و 2050. يظهر السلوك السعري حالة من التردد بدون زخم اتجاهي واضح. يُفضل البقاء خارج السوق حتى يكسر السعر منطقة الضغط هذه بتأكيد الحجم.',
        ary: 'الأصل كيتداول دابا فمجال بين 2030 و 2050. حركة السعر كتبين تردد بلا زخم اتجاهي باين. البقاء خارج السوق هو الخيار الأفضل حتى يخرج السعر من هاد النطاق بتأكيد الفوليم.',
        vi: 'Tài sản hiện đang tích lũy trong phạm vi từ 2030 đến 2050. Hành động giá cho thấy sự do dự không có động lượng xu hướng rõ ràng. Đứng ngoài thị trường là tối ưu cho đến khi giá bứt phá khỏi vùng nén kèm khối lượng xác nhận.',
        id: 'Aset saat ini berkonsolidasi dalam rentang antara 2030 dan 2050. Aksi harga menunjukkan keraguan tanpa momentum arah yang jelas. Sikap tanpa perdagangan optimal hingga harga keluar dari zona kompresi ini dengan konfirmasi volume.',
        fil: 'Ang asset ay kasalukuyang nagko-konsolida sa saklaw sa pagitan ng 2030 at 2050. Ang price action ay nagpapakita ng pag-aalinlangan na walang malinaw na direksyon ng momentum. Ang hindi pag-trade ay pinakamainam hanggang sa lumabas ang presyo sa compression zone na ito na may kumpirmasyon ng volume.',
    },
    'Price is rangebound between key support and resistance boundaries. Await volatility expansion.': {
        zh: '价格在关键支撑位和阻力位之间区间震荡。请等待波动率放大突破。',
        ru: 'Цена находится в диапазоне между ключевыми границами поддержки и сопротивления. Ожидайте расширения волатильности.',
        es: 'El precio está en un rango entre los límites clave de soporte y resistencia. Espere la expansión de la volatilidad.',
        ar: 'السعر محصور ضمن نطاق بين حدود الدعم والمقاومة الرئيسية. انتظر توسع التقلبات.',
        ary: 'السعر محصور بين مستويات الدعم والمقاومة الرئيسية. تسنى زيادة التقلبات.',
        vi: 'Giá đang dao động trong phạm vi giữa các ranh giới hỗ trợ và kháng cự chính. Chờ đợi sự mở rộng biến động.',
        id: 'Harga berada dalam rentang antara batas support dan resistance utama. Tunggu ekspansi volatilitas.',
        fil: 'Ang presyo ay nasa saklaw sa pagitan ng pangunahing suporta at mga hangganan ng paglaban. Maghintay para sa pagpapalawak ng pagkasumpungin.',
    },
    'Structural higher-highs sequence confirmed. Favorable risk-to-reward long setup.': {
        zh: '结构性更高的高点序列已获确认。具备优势风险回报比的多头交易设置。',
        ru: 'Подтверждена структурная последовательность повышающихся максимумов. Выгодный лонг с отличным риск/прибыль.',
        es: 'Secuencia estructural de máximos crecientes confirmada. Configuración alcista con relación riesgo-recompensa favorable.',
        ar: 'تم تأكيد تسلسل القمم المتصاعدة الهيكلية. إعداد شراء ملائم بنسبة مخاطرة إلى عائد ممتازة.',
        ary: 'تأكد تسلسل القمم الصاعدة الهيكلية. صفقة شراء بنسبة مخاطرة لعائد ممتازة.',
        vi: 'Chuỗi đỉnh cao hơn theo cấu trúc đã được xác nhận. Thiết lập vị thế mua thuận lợi với tỷ lệ rủi ro/lợi nhuận tốt.',
        id: 'Urutan higher-high struktural terkonfirmasi. Pengaturan long yang menguntungkan dengan rasio risk-to-reward.',
        fil: 'Nakumpirma ang structural higher-highs sequence. Paborableng risk-to-reward na long setup.',
    },
    'Price action rejected repeatedly from key resistance levels with downward momentum.': {
        zh: '价格在关键阻力位反复承压回落，并伴随加速向下的动能。',
        ru: 'Цена неоднократно отталкивалась от ключевых уровней сопротивления с нисходящим импульсом.',
        es: 'La acción del precio fue rechazada repetidamente desde niveles clave de resistencia con impulso bajista.',
        ar: 'تم رفض حركة السعر بشكل متكرر من مستويات المقاومة الرئيسية مع زخم هبوطي.',
        ary: 'حركة السعر ترفضات بزاف دالمرات من مستويات المقاومة الرئيسية مع زخم هابط.',
        vi: 'Hành động giá bị từ chối liên tục từ các mức kháng cự chính với động lượng đi xuống.',
        id: 'Aksi harga ditolak berulang kali dari level resistance kunci dengan momentum ke bawah.',
        fil: 'Ang pagkilos ng presyo ay paulit-ulit na tinanggihan mula sa mga pangunahing antas ng paglaban na may pababang momentum.',
    }
};

/**
 * Handle regex and pattern matches for dynamic scan strings
 */
export function matchDynamicTradeSnapText(text, targetLang = 'en') {
    if (!text || typeof text !== 'string') return null;
    const lang = (targetLang || 'en').toLowerCase();
    if (lang === 'en') return null;

    // Pattern: Wait for breakout above {val1} or pullback to {val2}
    const breakoutMatch = text.match(/Wait for breakout above\s+([0-9.]+)\s+or pullback to\s+([0-9.]+)/i);
    if (breakoutMatch) {
        const v1 = breakoutMatch[1];
        const v2 = breakoutMatch[2];
        const templates = {
            zh: `等待突破 ${v1} 上方或回调至 ${v2}`,
            ru: `Ожидайте пробоя выше ${v1} или отката к ${v2}`,
            es: `Espere una ruptura por encima de ${v1} o un retroceso a ${v2}`,
            ar: `انتظر اختراق أعلى ${v1} أو ارتداد إلى ${v2}`,
            ary: `تسنى اختراق فوق ${v1} أو هبوط لـ ${v2}`,
            vi: `Chờ bứt phá trên ${v1} hoặc thoái lui về ${v2}`,
            id: `Tunggu penembusan di atas ${v1} atau pullback ke ${v2}`,
            fil: `Maghintay ng breakout sa itaas ng ${v1} o pullback sa ${v2}`,
        };
        if (templates[lang]) return templates[lang];
    }

    return null;
}
