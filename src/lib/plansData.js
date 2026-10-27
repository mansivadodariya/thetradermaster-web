import { supabase } from '@/lib/supabaseClient';

export const defaultSubscriptionPlans = [
    {
        id: 'starter',
        name: 'Starter',
        name_ar: 'المبتدئ (Starter)',
        name_ph: 'Starter',
        description: 'For traders starting their journey with AI-powered market pattern scans and chart recognition.',
        description_ar: 'للمتداولين الذين يبدأون رحلتهم مع مسح أنماط السوق والتعرف على المخططات بالذكاء الاصطناعي.',
        description_ph: 'Para sa mga trader na nagsisimula sa AI-powered market pattern scans at chart recognition.',
        price: 99,
        originalPrice: 129,
        currency: '$',
        credits: 200,
        validity: '1 month',
        validity_ar: 'شهر واحد',
        validity_ph: '1 buwan',
        ctaText: 'Start Starter Plan',
        ctaText_ar: 'بدء باقة المبتدئ',
        ctaText_ph: 'Simulan ang Starter Plan',
        subCtaText: 'Instant Activation • Full Access',
        subCtaText_ar: 'تفعيل فوري • وصول كامل',
        featuresHeader: 'Included in Starter:',
        featuresHeader_ar: 'المميزات المضمنة في خطة المبتدئ:',
        featuresHeader_ph: 'Kasama sa Starter:',
        features: [
            '200 AI Processing Credits',
            'Multi-Timeframe Chart Analysis (15M, 1H, 4H)',
            'Real-Time Market Structure & Key Levels',
            'Instant OCR Chart Snapshot Scanning',
            'AI Market Assistant Live Q&A',
            'Economic Calendar & Macro Telemetry'
        ],
        features_ar: [
            '200 رصيد معالجة بالذكاء الاصطناعي',
            'تحليل المخططات متعدد الأطر الزمنية (15 دقيقة، 1 ساعة، 4 ساعات)',
            'هيكل السوق المباشر وتحديد المستويات الرئيسية',
            'مسح فوري للقطات المخططات عبر OCR',
            'مساعد سوق مباشر بالذكاء الاصطناعي',
            'التقويم الاقتصادي ومقاييس الاقتصاد الكلي'
        ],
        features_ph: [
            '200 AI Processing Credits',
            'Multi-Timeframe Chart Analysis (15M, 1H, 4H)',
            'Real-Time Market Structure & Key Levels',
            'Instant OCR Chart Snapshot Scanning',
            'AI Market Assistant Live Q&A',
            'Economic Calendar & Macro Telemetry'
        ],
        badge: null,
        badge_ar: null,
        badge_ph: null,
        is_best_value: false,
        is_featured: false,
        display_order: 1
    },
    {
        id: 'growth',
        name: 'Growth',
        name_ar: 'النمو (Growth)',
        name_ph: 'Growth',
        description: 'Engineered for active traders demanding high-probability setups, automated audits, and deeper AI analysis.',
        description_ar: 'مصمم للمتداولين النشطين الذين يبحثون عن فرص عالية الاحتمالية وتدقيق آلي وتحليلات أعمق.',
        description_ph: 'Dinisenyo para sa mga aktibong trader na nangangailangan ng high-probability setups at automated audits.',
        price: 149,
        originalPrice: 199,
        currency: '$',
        credits: 500,
        validity: '3 months',
        validity_ar: '3 أشهر',
        validity_ph: '3 buwan',
        ctaText: 'Start Growth Plan',
        ctaText_ar: 'بدء باقة النمو',
        ctaText_ph: 'Simulan ang Growth Plan',
        subCtaText: 'Instant Activation • Priority Processing',
        subCtaText_ar: 'تفعيل فوري • معالجة ذات أولوية',
        featuresHeader: 'Everything in Starter plus:',
        featuresHeader_ar: 'كل شيء في خطة المبتدئ بالإضافة إلى:',
        featuresHeader_ph: 'Lahat sa Starter kasama ang:',
        features: [
            '500 AI Processing Credits',
            'Valid for 3 Months Full Access',
            'Deep AI Past Trade Analyzer & Win-Rate Forensics',
            'Sub-Second Pattern Detection Cloud',
            'Advanced Multi-Asset Confluence Scoring',
            'Automated Imbalance & Liquidity Mapping',
            'Priority Quantitative Support'
        ],
        features_ar: [
            '500 رصيد معالجة بالذكاء الاصطناعي',
            'صلاحية لمدة 3 أشهر مع وصول كامل',
            'تدقيق عميق للصفقات بالذكاء الاصطناعي وتحليل الأخطاء',
            'سحابة كشف أنماط فائقة السرعة بأجزاء من الثانية',
            'تسجيل توافق متقدم متعدد الأصول',
            'تحديد فجوات السيولة واختلالات الأسعار آلياً',
            'دعم كمي ذو أولوية'
        ],
        features_ph: [
            '500 AI Processing Credits',
            'Valid for 3 Months Full Access',
            'Deep AI Past Trade Analyzer & Win-Rate Forensics',
            'Sub-Second Pattern Detection Cloud',
            'Advanced Multi-Asset Confluence Scoring',
            'Automated Imbalance & Liquidity Mapping',
            'Priority Quantitative Support'
        ],
        badge: 'MOST POPULAR',
        badge_ar: 'الأكثر شعبية',
        badge_ph: 'PINAKASIKAT',
        is_best_value: true,
        is_featured: true,
        display_order: 2
    },
    {
        id: 'pro',
        name: 'Pro',
        name_ar: 'المحترف (Pro)',
        name_ph: 'Pro',
        description: 'For prop firm traders, fund managers, and quants requiring institutional volume and zero-latency execution.',
        description_ar: 'لمتداولي شركات التمويل ومديري الصناديق الذين يحتاجون إلى أقصى طاقة ونماذج مخصصة وسرعة فائقة.',
        description_ph: 'Para sa mga prop firm trader at quant na nangangailangan ng institutional volume at zero-latency execution.',
        price: 500,
        originalPrice: 650,
        currency: '$',
        credits: 5000,
        validity: '6 months',
        validity_ar: '6 أشهر',
        validity_ph: '6 na buwan',
        ctaText: 'Start Pro Plan',
        ctaText_ar: 'بدء باقة المحترف',
        ctaText_ph: 'Simulan ang Pro Plan',
        subCtaText: 'Dedicated Infrastructure • Priority Routing',
        subCtaText_ar: 'بنية تحتية مخصصة • توجيه ذو أولوية',
        featuresHeader: 'Everything in Growth plus:',
        featuresHeader_ar: 'كل شيء في خطة النمو بالإضافة إلى:',
        featuresHeader_ph: 'Lahat sa Growth kasama ang:',
        features: [
            '5,000 High-Speed AI Processing Credits',
            'Valid for 6 Months Long-Term Coverage',
            'Dedicated Zero-Latency Neural Inference',
            'Unlimited Strategy Backtesting & Optimization',
            'Institutional Order Flow & Volume Delta Telemetry',
            'Custom Risk-Reward Presets & Position Sizing',
            '24/7 VIP Quant Desk & 1-on-1 Onboarding'
        ],
        features_ar: [
            '5,000 رصيد معالجة فائق السرعة بالذكاء الاصطناعي',
            'صلاحية لمدة 6 أشهر مع تغطية شاملة',
            'استدلال عصبي مخصص فائق السرعة بدون تأخير',
            'اختبار رجعي وتحسين غير محدود للاستراتيجيات',
            'قياس تدفق الأوامر المؤسسية ودلتا الحجم',
            'إعدادات مسبقة مخصصة للمخاطر وتحديد حجم العقود',
            'مكتب VIP كمي على مدار 24/7 ودعم خاص'
        ],
        features_ph: [
            '5,000 High-Speed AI Processing Credits',
            'Valid for 6 Months Long-Term Coverage',
            'Dedicated Zero-Latency Neural Inference',
            'Unlimited Strategy Backtesting & Optimization',
            'Institutional Order Flow & Volume Delta Telemetry',
            'Custom Risk-Reward Presets & Position Sizing',
            '24/7 VIP Quant Desk & 1-on-1 Onboarding'
        ],
        badge: 'ELITE QUANT',
        badge_ar: 'النخبة الكمية',
        badge_ph: 'ELITE QUANT',
        is_best_value: false,
        is_featured: false,
        display_order: 3
    }
];

export async function fetchSubscriptionPlans() {
    if (!supabase) {
        return defaultSubscriptionPlans;
    }
    try {
        const { data, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error || !data || data.length === 0) {
            return defaultSubscriptionPlans;
        }

        return data.map((plan) => ({
            ...plan,
            features: Array.isArray(plan.features) ? plan.features : (typeof plan.features === 'string' ? JSON.parse(plan.features) : []),
            features_ar: Array.isArray(plan.features_ar) ? plan.features_ar : (typeof plan.features_ar === 'string' ? JSON.parse(plan.features_ar) : []),
            features_ph: Array.isArray(plan.features_ph) ? plan.features_ph : (typeof plan.features_ph === 'string' ? JSON.parse(plan.features_ph) : [])
        }));
    } catch (_) {
        return defaultSubscriptionPlans;
    }
}
