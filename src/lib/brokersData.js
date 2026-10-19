import { supabase } from '@/lib/supabaseClient';

let cachedBrokers = null;
let fetchBrokersPromise = null;

export const brokerList = [
    {
        id: 'forex__cfd_trading',
        name: 'Forex & CFD Trading',
        name_ar: 'تيكميل',
        name_ph: 'Tickmill',
        subtitle: 'Forex & CFD Trading',
        subtitle_ar: 'تداول الفوركس والعقود مقابل الفروقات',
        subtitle_ph: 'Forex at CFD Trading',
        logo: '/assets/images/site-logo-20y-on-light.svg',
        category: 'Brokers',
        description: 'Tickmill provides access to global Forex and CFD markets with competitive pricing, fast execution and a range of desktop, web and mobile trading platforms.',
        description_ar: 'توفر تيكميل إمكانية الوصول إلى أسواق الفوركس والعقود مقابل الفروقات العالمية مع أسعار تنافسية وتنفيذ سريع ومجموعة من منصات التداول المكتبية والويب والهاتف المحمول.',
        description_ph: 'Nagbibigay ang Tickmill ng access sa global Forex at CFD markets na may competitive pricing, mabilis na execution at maraming desktop, web at mobile trading platforms.',
        features: [
            '60+ Forex currency pairs',
            '0.15s average CFD execution',
            'MT4, MT5, TradingView and Tickmill Trader'
        ],
        features_ar: [
            'أكثر من 60 زوجاً من العملات',
            'متوسط تنفيذ العقود مقابل الفروقات 0.15 ثانية',
            'MT4 وMT5 وTradingView وTickmill Trader'
        ],
        features_ph: [
            '60+ Forex currency pairs',
            '0.15s average CFD execution',
            'MT4, MT5, TradingView at Tickmill Trader'
        ],
        highlights: [
            { id: '1', type: 'link', title: 'Best Arbitrage Brokers', title_ar: 'أفضل وسطاء المراجحة', sub: 'Ultra-low latency arbitrage', sub_ar: 'تداول مراجحة بفترة كمون فائقة الانخفاض' },
            { id: '2', type: 'server', title: 'Best IB Rewards', title_ar: 'أفضل مكافآت IB', sub: 'High volume rebate structure', sub_ar: 'هيكل عمولات حوافز أحجام تداول عالية' },
            { id: '3', type: 'shield', title: 'Best Spreads', title_ar: 'أفضل فروق أسعار', sub: 'Raw ECN tightest spreads', sub_ar: 'أضيق فروق أسعار حسابات ECN المباشرة' }
        ],
        website_url: 'https://my.tickmill.com?utm_campaign=ib_link&utm_content=IB46442482&utm_medium=Open+Account&utm_source=link&lp=https%3A%2F%2Fmy.tickmill.com%2Fen%2Fsign-up',
        websiteUrl: 'https://my.tickmill.com?utm_campaign=ib_link&utm_content=IB46442482&utm_medium=Open+Account&utm_source=link&lp=https%3A%2F%2Fmy.tickmill.com%2Fen%2Fsign-up'
    },
    {
        id: 'avatrade',
        name: 'AvaTrade',
        name_ar: 'أفاتريد',
        name_ph: 'AvaTrade',
        subtitle: 'Forex & CFD Broker',
        subtitle_ar: 'وسيط الفوركس والعقود مقابل الفروقات',
        subtitle_ph: 'Forex & CFD Broker',
        logo: '/assets/images/site-logo-20y-on-light.svg',
        category: 'Brokers',
        description: 'A leading global broker, highly secure and regulated, offering diverse instruments, advanced platforms, and strong trading conditions for every trader.',
        description_ar: 'وسيط عالمي رائد، آمن للغاية ومنظم، يقدم أدوات تداول متنوعة ومنصات متقدمة وشروط تداول قوية لكل متداول.',
        description_ph: 'Isang nangungunang pandaigdigang broker, lubos na ligtas at kinokontrol, nag-aalok ng magkakaibang mga instrumento, mga advanced na platform, at matibay na mga kondisyon sa pag-trade para sa bawat mangangalakal.',
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
        website_url: 'https://www.avatrade.com/?tag=226362',
        websiteUrl: 'https://www.avatrade.com/?tag=226362'
    },
];

export function formatBroker(item) {
    if (!item) return null;
    let logoUrl = item.logo || '';
    if (logoUrl.includes('Img1.svg') || !logoUrl) {
        logoUrl = '/assets/images/site-logo-20y-on-light.svg';
    }

    return {
        id: item.id,
        name: item.name,
        name_ar: item.name_ar || item.name,
        name_ph: item.name_ph || item.name,
        subtitle: item.subtitle || '',
        subtitle_ar: item.subtitle_ar || item.subtitle || '',
        subtitle_ph: item.subtitle_ph || item.subtitle || '',
        logo: logoUrl,
        category: item.category || 'Brokers',
        description: item.description || '',
        description_ar: item.description_ar || item.description || '',
        description_ph: item.description_ph || item.description || '',
        features: typeof item.features === 'string' ? JSON.parse(item.features) : (item.features || []),
        features_ar: typeof item.features_ar === 'string' ? JSON.parse(item.features_ar) : (item.features_ar || item.features || []),
        features_ph: typeof item.features_ph === 'string' ? JSON.parse(item.features_ph) : (item.features_ph || item.features || []),
        highlights: typeof item.highlights === 'string' ? JSON.parse(item.highlights) : (item.highlights || []),
        website_url: item.website_url || item.websiteUrl || '',
        websiteUrl: item.website_url || item.websiteUrl || ''
    };
}

export async function fetchBrokers(forceRefresh = false) {
    if (!forceRefresh && cachedBrokers) {
        return cachedBrokers;
    }
    if (!forceRefresh && fetchBrokersPromise) {
        return fetchBrokersPromise;
    }
    if (!supabase) {
        return brokerList;
    }
    fetchBrokersPromise = (async () => {
        try {
            const { data, error } = await supabase
                .from('brokers')
                .select('*')
                .order('created_at', { ascending: true });

            if (error || !data || data.length === 0) {
                cachedBrokers = brokerList;
                return brokerList;
            }
            cachedBrokers = data.map(formatBroker).filter(b => b.id !== 'newera' && !b.name?.toLowerCase().includes('newera'));
            return cachedBrokers;
        } catch (err) {
            console.error('Error fetching brokers from Supabase:', err);
            return brokerList;
        } finally {
            fetchBrokersPromise = null;
        }
    })();

    return fetchBrokersPromise;
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


