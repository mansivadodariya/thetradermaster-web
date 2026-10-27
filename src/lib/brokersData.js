import { supabase } from '@/lib/supabaseClient';

export const brokerList = [
    {
        id: 'avatrade',
        isDarkLogo: true,
        name: 'AvaTrade',
        subtitle: 'Global Multi-Asset Broker',
        logo: 'https://www.avatrade.com/favicon.ico',
        category: 'Brokers',
        description: 'A regulated global broker offering Forex, CFDs, stocks, commodities, indices, cryptocurrencies and multiple trading platforms.',
        features: [
            'Forex and CFD trading',
            'MT4 and MT5 platforms',
            'WebTrader and mobile trading',
            'Multiple global regulatory entities'
        ],
        highlights: [],
        websiteUrl: 'https://www.avatrade.com/',
        name_ar: 'أفاتريد',
        subtitle_ar: 'وسيط عالمي متعدد الأصول',
        description_ar: 'وسيط عالمي منظم يوفر تداول الفوركس والعقود مقابل الفروقات والأسهم والسلع والمؤشرات والعملات المشفرة ومنصات تداول متعددة.',
        features_ar: [
            'تداول الفوركس والعقود مقابل الفروقات',
            'منصات MT4 وMT5',
            'التداول عبر الويب والهاتف المحمول',
            'جهات تنظيمية عالمية متعددة'
        ],
        name_ph: 'AvaTrade',
        subtitle_ph: 'Global na Multi-Asset Broker',
        description_ph: 'Isang pandaigdigang regulated broker na nag-aalok ng Forex, CFDs, stocks, commodities, indices, cryptocurrencies at maraming trading platforms.',
        features_ph: [
            'Forex at CFD trading',
            'MT4 at MT5 platforms',
            'WebTrader at mobile trading',
            'Maramihang global regulatory entities'
        ]
    },
    {
        id: 'tickmill',
        name: 'Tickmill',
        subtitle: 'Global Forex & CFD Broker',
        logo: 'https://www.tickmill.com/favicon.ico',
        category: 'Brokers',
        description: 'Global online broker providing Forex and CFD trading with access to multiple financial markets and trading platforms.',
        features: [
            'Forex and CFD trading',
            'MT4 and MT5 platforms',
            'Competitive trading conditions',
            'Multiple financial markets'
        ],
        highlights: [],
        websiteUrl: 'https://www.tickmill.com/',
        name_ar: 'تيكميل',
        subtitle_ar: 'وسيط عالمي للفوركس والعقود مقابل الفروقات',
        description_ar: 'وسيط عالمي عبر الإنترنت يوفر تداول الفوركس والعقود مقابل الفروقات مع إمكانية الوصول إلى أسواق مالية متعددة ومنصات تداول مختلفة.',
        features_ar: [
            'تداول الفوركس والعقود مقابل الفروقات',
            'منصات MT4 وMT5',
            'شروط تداول تنافسية',
            'أسواق مالية متعددة'
        ],
        name_ph: 'Tickmill',
        subtitle_ph: 'Global na Forex at CFD Broker',
        description_ph: 'Isang global online broker na nagbibigay ng Forex at CFD trading na may access sa maraming financial markets at trading platforms.',
        features_ph: [
            'Forex at CFD trading',
            'MT4 at MT5 platforms',
            'Competitive trading conditions',
            'Maramihang financial markets'
        ]
    },
    {
        id: 'multibank',
        isDarkLogo: true,
        name: 'MultiBank Group',
        subtitle: 'Global Forex & CFD Broker',
        logo: 'https://multibankfx.com/favicon.ico',
        category: 'Brokers',
        description: 'Global financial broker offering Forex and CFD trading across multiple markets with access to MT4 and MT5 platforms.',
        features: [
            '55+ Forex currency pairs',
            'Up to 1000:1 leverage',
            'MT4 and MT5 platforms',
            'Forex and CFD markets'
        ],
        highlights: [],
        websiteUrl: 'https://multibankfx.com/en',
        name_ar: 'مجموعة مالتي بنك',
        subtitle_ar: 'وسيط عالمي للفوركس والعقود مقابل الفروقات',
        description_ar: 'وسيط مالي عالمي يوفر تداول الفوركس والعقود مقابل الفروقات عبر أسواق متعددة مع إمكانية الوصول إلى منصات MT4 وMT5.',
        features_ar: [
            'أكثر من 55 زوجاً من العملات',
            'رافعة مالية تصل إلى 1:1000',
            'منصات MT4 وMT5',
            'أسواق الفوركس والعقود مقابل الفروقات'
        ],
        name_ph: 'MultiBank Group',
        subtitle_ph: 'Global na Forex at CFD Broker',
        description_ph: 'Isang pandaigdigang financial broker na nag-aalok ng Forex at CFD trading sa maraming markets na may access sa MT4 at MT5 platforms.',
        features_ph: [
            '55+ Forex currency pairs',
            'Hanggang 1:1000 leverage',
            'MT4 at MT5 platforms',
            'Forex at CFD markets'
        ]
    },
    {
        id: 'blueberry',
        isDarkLogo: true,
        name: 'Blueberry Markets',
        subtitle: 'Online Forex & CFD Broker',
        logo: 'https://blueberrymarkets.com/favicon.ico',
        category: 'Brokers',
        description: 'Online broker offering Forex, indices, commodities, cryptocurrencies and stock CFDs through modern trading platforms.',
        features: [
            'Forex trading',
            'Indices and commodities CFDs',
            'Cryptocurrency and stock CFDs',
            'MT4 and MT5 platforms'
        ],
        highlights: [],
        websiteUrl: 'https://blueberrymarkets.com/',
        name_ar: 'بلو بيري ماركتس',
        isDarkLogo: true,
        name: 'Blueberry Markets',
        subtitle: 'Online Forex & CFD Broker',
        logo: 'https://blueberrymarkets.com/favicon.ico',
        category: 'Brokers',
        description: 'Online broker offering Forex, indices, commodities, cryptocurrencies and stock CFDs through modern trading platforms.',
        features: [
            'Forex trading',
            'Indices and commodities CFDs',
            'Cryptocurrency and stock CFDs',
            'MT4 and MT5 platforms'
        ],
        highlights: [],
        websiteUrl: 'https://blueberrymarkets.com/',
        name_ar: 'بلو بيري ماركتس',
        subtitle_ar: 'وسيط للفوركس والعقود مقابل الفروقات',
        description_ar: 'وسيط عبر الإنترنت يوفر تداول الفوركس والمؤشرات والسلع والعملات المشفرة وعقود الفروقات على الأسهم من خلال منصات تداول حديثة.',
        features_ar: [
            'تداول الفوركس',
            'عقود الفروقات على المؤشرات والسلع',
            'عقود الفروقات على العملات المشفرة والأسهم',
            'منصات MT4 وMT5'
        ],
        name_ph: 'Blueberry Markets',
        subtitle_ph: 'Online Forex at CFD Broker',
        description_ph: 'Isang online broker na nag-aalok ng Forex, indices, commodities, cryptocurrencies at stock CFDs gamit ang modern trading platforms.',
        features_ph: [
            'Forex trading',
            'Indices at commodities CFDs',
            'Cryptocurrency at stock CFDs',
            'MT4 at MT5 platforms'
        ]
    }
];

function safeArrayParse(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) return parsed;
        } catch (_) {
            return val.split(',').map((s) => s.trim()).filter(Boolean);
        }
    }
    return [];
}

export function formatBroker(item) {
    if (!item) return null;
    return {
        id: item.id,
        is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
        name: item.name,
        name_ar: item.name_ar || item.name,
        name_ph: item.name_ph || item.name,
        subtitle: item.subtitle || '',
        subtitle_ar: item.subtitle_ar || item.subtitle || '',
        subtitle_ph: item.subtitle_ph || item.subtitle || '',
        logo: item.logo || '',
        isDarkLogo: Boolean(item.is_dark_logo || item.isDarkLogo || item.dark_logo || item.darkLogo || (item.id && ['avatrade', 'blueberry', 'blueberrymarkets', 'multibank', 'multibankfx'].includes(String(item.id).toLowerCase()))),
        category: item.category || 'Brokers',
        description: item.description || '',
        description_ar: item.description_ar || item.description || '',
        description_ph: item.description_ph || item.description || '',
        features: safeArrayParse(item.features),
        features_ar: safeArrayParse(item.features_ar || item.features),
        features_ph: safeArrayParse(item.features_ph || item.features),
        highlights: safeArrayParse(item.highlights),
        websiteUrl: item.website_url || item.websiteUrl || '',
        website_url: item.website_url || item.websiteUrl || '',
        createdAt: item.created_at || item.createdAt || '',
        created_at: item.created_at || item.createdAt || ''
    };
}

let cachedBrokers = null;
let brokersFetchPromise = null;

export async function fetchBrokers() {
    if (cachedBrokers && cachedBrokers.length > 0) {
        return cachedBrokers;
    }
    if (brokersFetchPromise) {
        return brokersFetchPromise;
    }

    const fallback = brokerList.filter((b) => b.is_active !== false);
    if (!supabase) {
        return fallback;
    }

    brokersFetchPromise = (async () => {
        try {
            const { data, error } = await supabase
                .from('brokers')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true });

            if (error || !data || data.length === 0) {
                cachedBrokers = fallback;
                return fallback;
            }
            const formatted = data.map(formatBroker).filter((b) => b && b.is_active !== false);
            cachedBrokers = formatted;
            return formatted;
        } catch (err) {
            console.error('Error fetching brokers from Supabase:', err);
            return fallback;
        } finally {
            brokersFetchPromise = null;
        }
    })();

    return brokersFetchPromise;
}

export async function fetchBrokerById(id) {
    if (!id) return null;
    if (!supabase) {
        return getBrokerById(id);
    }
    try {
        const { data, error } = await supabase
            .from('brokers')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .maybeSingle();

        if (error || !data) {
            // Case-insensitive query fallback
            const { data: dataIlike } = await supabase
                .from('brokers')
                .select('*')
                .ilike('id', id)
                .eq('is_active', true)
                .maybeSingle();

            if (dataIlike) {
                const formatted = formatBroker(dataIlike);
                return (formatted && formatted.is_active !== false) ? formatted : null;
            }
            return getBrokerById(id);
        }
        const formatted = formatBroker(data);
        return (formatted && formatted.is_active !== false) ? formatted : null;
    } catch (err) {
        return getBrokerById(id);
    }
}

export function getBrokerById(id) {
    if (!id) return null;
    const item = brokerList.find((b) => b.id.toLowerCase() === String(id).toLowerCase());
    if (!item || item.is_active === false) return null;
    return formatBroker(item);
}
