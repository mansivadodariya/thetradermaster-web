import { supabase } from '@/lib/supabaseClient';

export const brokerList = [
    {
        id: 'newera',
        name: 'Newera Brokerage',
        name_ar: 'وساطة نيو ايرا',
        subtitle: 'Forex & CFD Broker',
        subtitle_ar: 'وسيط الفوركس والعقود مقابل الفروقات',
        logo: '/assets/images/logo-light1.webp',
        category: 'Brokers',
        description: 'Newera is a multi-asset broker providing access to global financial markets through MetaTrader 5 and WebTrader, with flexible account options and competitive trading conditions.',
        description_ar: 'نيو ايرا هو وسيط متعدد الأصول يوفر الوصول إلى الأسواق المالية العالمية من خلال MetaTrader 5 و WebTrader، مع خيارات حسابات مرنة وشروط تداول تنافسية.',
        features: [
            'Forex & multi-asset trading',
            '2,000+ trading instruments',
            'MetaTrader 5 & WebTrader',
            'Spreads from 0.0 pips',
            'Leverage up to 1:500',
            'Standard, Raw & Pro accounts'
        ],
        features_ar: [
            'تداول الفوركس والأصول المتعددة',
            'أكثر من 2000 أداة تداول',
            'منصتا MetaTrader 5 و WebTrader',
            'فروق أسعار تبدأ من 0.0 نقطة',
            'رافعة مالية تصل إلى 1:500',
            'حسابات Standard و Raw و Pro'
        ],
        highlights: [
            { id: '1', type: 'link', title: 'Best Arbitrage Brokers', title_ar: 'أفضل وسطاء المراجحة', sub: 'Ultra-low latency arbitrage', sub_ar: 'تداول مراجحة بفترة كمون فائقة الانخفاض' },
            { id: '2', type: 'server', title: 'Best IB Rewards', title_ar: 'أفضل مكافآت IB', sub: 'High volume rebate structure', sub_ar: 'هيكل عمولات حوافز أحجام تداول عالية' },
            { id: '3', type: 'shield', title: 'Best Spreads', title_ar: 'أفضل فروق أسعار', sub: 'Raw ECN tightest spreads', sub_ar: 'أضيق فروق أسعار حسابات ECN المباشرة' }
        ],
        websiteUrl: 'https://trade.newera365.com/client/register/6a68798de0aaa'
    },
];

export function formatBroker(item) {
    if (!item) return null;
    let logoUrl = item.logo || '';
    if (item.id === 'newera' || logoUrl.includes('Img1.svg') || !logoUrl) {
        logoUrl = '/assets/images/logo-light1.webp';
    }
    const defaultNewera = brokerList.find((b) => b.id === 'newera');
    const isNewera = item.id === 'newera';

    return {
        id: item.id,
        name: item.name,
        name_ar: item.name_ar || item.name,
        name_ph: item.name_ph || item.name,
        subtitle: isNewera ? (defaultNewera?.subtitle || item.subtitle) : (item.subtitle || ''),
        subtitle_ar: isNewera ? (defaultNewera?.subtitle_ar || item.subtitle_ar) : (item.subtitle_ar || item.subtitle || ''),
        subtitle_ph: isNewera ? (defaultNewera?.subtitle || item.subtitle_ph) : (item.subtitle_ph || item.subtitle || ''),
        logo: logoUrl,
        category: item.category || 'Brokers',
        description: isNewera ? (defaultNewera?.description || item.description) : (item.description || ''),
        description_ar: isNewera ? (defaultNewera?.description_ar || item.description_ar) : (item.description_ar || item.description || ''),
        description_ph: isNewera ? (defaultNewera?.description || item.description_ph) : (item.description_ph || item.description || ''),
        features: isNewera ? (defaultNewera?.features || item.features) : (typeof item.features === 'string' ? JSON.parse(item.features) : (item.features || [])),
        features_ar: isNewera ? (defaultNewera?.features_ar || item.features_ar) : (typeof item.features_ar === 'string' ? JSON.parse(item.features_ar) : (item.features_ar || item.features || [])),
        features_ph: isNewera ? (defaultNewera?.features || item.features_ph) : (typeof item.features_ph === 'string' ? JSON.parse(item.features_ph) : (item.features_ph || item.features || [])),
        highlights: typeof item.highlights === 'string' ? JSON.parse(item.highlights) : (item.highlights || []),
        websiteUrl: item.website_url || item.websiteUrl || ''
    };
}

export async function fetchBrokers() {
    if (!supabase) {
        return brokerList;
    }
    try {
        const { data, error } = await supabase
            .from('brokers')
            .select('*')
            .order('created_at', { ascending: true });

        if (error || !data || data.length === 0) {
            return brokerList;
        }
        return data.map(formatBroker);
    } catch (err) {
        console.error('Error fetching brokers from Supabase:', err);
        return brokerList;
    }
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
            .maybeSingle();

        if (error || !data) {
            return getBrokerById(id);
        }
        return formatBroker(data);
    } catch (err) {
        return getBrokerById(id);
    }
}

export function getBrokerById(id) {
    if (!id) return null;
    return brokerList.find((b) => b.id.toLowerCase() === String(id).toLowerCase()) || null;
}


