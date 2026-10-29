'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { unifiedSocket, cleanPairSymbol } from '@/lib/unifiedSocket';
import InstrumentIcon from './InstrumentIcon';
import styles from '../dashboard.module.scss';

export const DEFAULT_MARKET_OVERVIEW_ITEMS = [
    // Popular
    {
        symbol: 'EURUSD',
        pair_name: 'EUR/USD',
        display_name: 'Euro / U.S. Dollar',
        price: 1.12110,
        change_24h: 0.05,
        change_24h_display: '+0.05%',
        trend: [1.1190, 1.1195, 1.1202, 1.1208, 1.1205, 1.1210, 1.12110],
        category: 'Forex',
        is_popular: true,
        icon: 'EUR/USD'
    },
    {
        symbol: 'GBPUSD',
        pair_name: 'GBP/USD',
        display_name: 'British Pound / U.S. Dollar',
        price: 1.33480,
        change_24h: -0.18,
        change_24h_display: '-0.18%',
        trend: [1.3380, 1.3372, 1.3364, 1.3355, 1.3358, 1.3350, 1.33480],
        category: 'Forex',
        is_popular: true,
        icon: 'GBP/USD'
    },
    {
        symbol: 'XAUUSD',
        pair_name: 'XAU/USD',
        display_name: 'Gold / U.S. Dollar',
        price: 4015.00,
        change_24h: 0.35,
        change_24h_display: '+0.35%',
        trend: [3995.0, 4002.5, 4008.0, 4012.4, 4010.2, 4014.9, 4015.00],
        category: 'Commodities',
        is_popular: true,
        icon: 'GOLD'
    },
    {
        symbol: 'USDJPY',
        pair_name: 'USD/JPY',
        display_name: 'U.S. Dollar / Japanese Yen',
        price: 155.673,
        change_24h: 0.12,
        change_24h_display: '+0.12%',
        trend: [155.20, 155.35, 155.48, 155.40, 155.55, 155.62, 155.673],
        category: 'Forex',
        is_popular: true,
        icon: 'USD/JPY'
    },
    {
        symbol: 'BTCUSD',
        pair_name: 'BTC/USD',
        display_name: 'Bitcoin / U.S. Dollar',
        price: 66542.21,
        change_24h: -1.34,
        change_24h_display: '-1.34%',
        trend: [67400.0, 67250.0, 67000.0, 66850.0, 66720.0, 66600.0, 66542.21],
        category: 'Crypto',
        is_popular: true,
        icon: 'BTC'
    },
    {
        symbol: 'ETHUSD',
        pair_name: 'ETH/USD',
        display_name: 'Ethereum / U.S. Dollar',
        price: 3485.50,
        change_24h: 2.15,
        change_24h_display: '+2.15%',
        trend: [3410.0, 3425.0, 3445.0, 3460.0, 3452.0, 3470.0, 3485.50],
        category: 'Crypto',
        is_popular: true,
        icon: 'ETH'
    },
    {
        symbol: 'SOLUSD',
        pair_name: 'SOL/USD',
        display_name: 'Solana / U.S. Dollar',
        price: 158.40,
        change_24h: 4.82,
        change_24h_display: '+4.82%',
        trend: [150.2, 152.0, 154.5, 153.8, 156.2, 157.5, 158.40],
        category: 'Crypto',
        is_popular: true,
        icon: 'SOL'
    },

    // Forex Extended
    {
        symbol: 'AUDUSD',
        pair_name: 'AUD/USD',
        display_name: 'Australian Dollar / U.S. Dollar',
        price: 0.65420,
        change_24h: 0.31,
        change_24h_display: '+0.31%',
        trend: [0.6510, 0.6520, 0.6532, 0.6528, 0.6536, 0.6540, 0.65420],
        category: 'Forex',
        is_popular: false,
        icon: 'AUD/USD'
    },
    {
        symbol: 'USDCAD',
        pair_name: 'USD/CAD',
        display_name: 'U.S. Dollar / Canadian Dollar',
        price: 1.38120,
        change_24h: -0.18,
        change_24h_display: '-0.18%',
        trend: [1.3850, 1.3842, 1.3835, 1.3828, 1.3822, 1.3815, 1.38120],
        category: 'Forex',
        is_popular: false,
        icon: 'USD/CAD'
    },
    {
        symbol: 'USDCHF',
        pair_name: 'USD/CHF',
        display_name: 'U.S. Dollar / Swiss Franc',
        price: 0.88450,
        change_24h: 0.05,
        change_24h_display: '+0.05%',
        trend: [0.8835, 0.8838, 0.8841, 0.8839, 0.8843, 0.8844, 0.88450],
        category: 'Forex',
        is_popular: false,
        icon: 'USD/CHF'
    },
    {
        symbol: 'EURGBP',
        pair_name: 'EUR/GBP',
        display_name: 'Euro / British Pound',
        price: 0.85230,
        change_24h: 0.18,
        change_24h_display: '+0.18%',
        trend: [0.8505, 0.8512, 0.8518, 0.8515, 0.8520, 0.85230],
        category: 'Forex',
        is_popular: false,
        icon: 'EUR/GBP'
    },
    {
        symbol: 'GBPJPY',
        pair_name: 'GBP/JPY',
        display_name: 'British Pound / Japanese Yen',
        price: 201.450,
        change_24h: -0.32,
        change_24h_display: '-0.32%',
        trend: [202.10, 201.85, 201.70, 201.60, 201.450],
        category: 'Forex',
        is_popular: false,
        icon: 'GBP/JPY'
    },

    // Crypto Extended
    {
        symbol: 'BNBUSD',
        pair_name: 'BNB/USD',
        display_name: 'BNB / U.S. Dollar',
        price: 584.20,
        change_24h: 0.76,
        change_24h_display: '+0.76%',
        trend: [578.0, 579.5, 581.0, 582.5, 581.8, 583.4, 584.20],
        category: 'Crypto',
        is_popular: false,
        icon: 'BNB'
    },

    // Commodities Extended
    {
        symbol: 'XAGUSD',
        pair_name: 'XAG/USD',
        display_name: 'Silver / U.S. Dollar',
        price: 29.85,
        change_24h: 1.42,
        change_24h_display: '+1.42%',
        trend: [29.20, 29.35, 29.50, 29.62, 29.55, 29.74, 29.85],
        category: 'Commodities',
        is_popular: false,
        icon: 'SILVER'
    },
    {
        symbol: 'USOIL',
        pair_name: 'US Oil',
        display_name: 'WTI Crude Oil / USD',
        price: 78.42,
        change_24h: -0.65,
        change_24h_display: '-0.65%',
        trend: [79.20, 78.90, 78.75, 78.60, 78.50, 78.42],
        category: 'Commodities',
        is_popular: false,
        icon: 'OIL'
    }
];

function MiniSparkline({ data = [], isPositive = true }) {
    if (!Array.isArray(data) || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 72;
    const height = 20;
    const padding = 2;

    const points = data
        .map((val, idx) => {
            const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
            const y = height - padding - ((val - min) / range) * (height - padding * 2);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');

    const strokeColor = isPositive ? '#10B981' : '#F43F5E';

    return (
        <svg width={width} height={height} className={styles.overviewSparklineSvg} viewBox={`0 0 ${width} ${height}`}>
            <polyline
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
}

function formatPrice(val) {
    const num = Number(val);
    if (isNaN(num)) return '—';
    if (num >= 1000) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (num >= 10) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 5 });
}

export default function DashboardMarketOverview({ initialItems = [], userId = '' }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Forex');
    const [items, setItems] = useState(() => {
        if (Array.isArray(initialItems) && initialItems.length > 0) {
            const disallowed = ['USOIL', 'UKOIL', 'US30', 'US500', 'SPX500', 'USTEC', 'NAS100', 'GER40'];
            return initialItems.filter(i => !disallowed.includes(cleanPairSymbol(i.symbol)) && (i.category || '').toLowerCase() !== 'indices');
        }
        return DEFAULT_MARKET_OVERVIEW_ITEMS;
    });

    const [priceFlashMap, setPriceFlashMap] = useState({});
    const flashTimersRef = useRef({});
    const itemsRef = useRef(items);
    itemsRef.current = items;

    // Helper: apply price tick with flash & sparkline animation
    const applyPriceTick = (symbol, rawPrice, changePercent) => {
        const symClean = cleanPairSymbol(symbol);
        const newPrice = Number(rawPrice);
        if (isNaN(newPrice) || newPrice <= 0) return;

        setItems((prev) =>
            prev.map((item) => {
                if (cleanPairSymbol(item.symbol) === symClean) {
                    const oldPrice = item.price;
                    const flashDir = newPrice > oldPrice ? 'up' : newPrice < oldPrice ? 'down' : null;

                    if (flashDir) {
                        setPriceFlashMap(m => ({ ...m, [symClean]: flashDir }));
                        if (flashTimersRef.current[symClean]) clearTimeout(flashTimersRef.current[symClean]);
                        flashTimersRef.current[symClean] = setTimeout(() => {
                            setPriceFlashMap(m => ({ ...m, [symClean]: null }));
                        }, 700);
                    }

                    const changeNum = changePercent !== undefined ? changePercent : item.change_24h;
                    const changeDisplay = changeNum !== undefined
                        ? (changeNum >= 0 ? `+${changeNum.toFixed(2)}%` : `${changeNum.toFixed(2)}%`)
                        : item.change_24h_display;

                    return {
                        ...item,
                        price: newPrice,
                        change_24h: typeof changeNum === 'number' ? changeNum : item.change_24h,
                        change_24h_display: changeDisplay,
                        // Preserve 24-Hour / 4-Hour historical trend array intact from backend
                        trend: item.trend
                    };
                }
                return item;
            })
        );
    };

    // Sync if initialItems updates from stats API
    useEffect(() => {
        if (Array.isArray(initialItems) && initialItems.length > 0) {
            setItems((prev) => {
                const map = new Map(initialItems.map(i => [cleanPairSymbol(i.symbol), i]));
                return prev.map(p => {
                    const found = map.get(cleanPairSymbol(p.symbol));
                    if (!found) return p;
                    return {
                        ...p,
                        ...found,
                        trend: (found.trend && found.trend.length > 0) ? found.trend : (found.sparkline && found.sparkline.length > 0 ? found.sparkline : p.trend)
                    };
                });
            });
        }
    }, [initialItems]);

    // WebSocket Live Updates + Multi-Pair Dynamic Stream
    useEffect(() => {
        let isMounted = true;

        fetch('/api/v1/market/tickers')
            .then(res => res.json())
            .then(json => {
                if (json?.success && json?.data && isMounted) {
                    const live = json.data;
                    setItems(prev => prev.map(item => {
                        const sym = cleanPairSymbol(item.symbol);
                        const match = live[sym];
                        if (match) {
                            const raw = typeof match.rawPrice === 'number' ? match.rawPrice : parseFloat(String(match.price).replace(/,/g, ''));
                            if (!isNaN(raw) && raw > 0) {
                                return {
                                    ...item,
                                    price: raw,
                                    change_24h_display: match.change || item.change_24h_display
                                };
                            }
                        }
                        return item;
                    }));
                }
            })
            .catch(() => {});

        // Ensure shared unified socket singleton is running
        unifiedSocket.ensureConnected();

        // 1. Bulk market overview update listener
        const handleMarketOverview = (e) => {
            if (!isMounted) return;
            const data = e?.detail;
            const newOverview = data?.all || (Array.isArray(data) ? data : null);
            if (Array.isArray(newOverview) && newOverview.length > 0) {
                setItems((prev) => {
                    const updateMap = new Map(newOverview.map(item => [cleanPairSymbol(item.symbol), item]));
                    return prev.map(oldItem => {
                        const found = updateMap.get(cleanPairSymbol(oldItem.symbol));
                        if (found) {
                            const newTrend = (Array.isArray(found.trend) && found.trend.length > 0)
                                ? found.trend
                                : ((Array.isArray(found.sparkline) && found.sparkline.length > 0) ? found.sparkline : oldItem.trend);
                            return {
                                ...oldItem,
                                ...found,
                                trend: newTrend
                            };
                        }
                        return oldItem;
                    });
                });
            }
        };
        window.addEventListener('liveMarketOverviewUpdate', handleMarketOverview);

        // 2. Global window livePriceUpdate listener for real MT5 ticks
        const handleGlobalPrice = (e) => {
            if (!isMounted) return;
            const detail = e?.detail;
            if (detail?.symbol && detail?.price !== undefined) {
                applyPriceTick(detail.symbol, detail.price, detail.change_percent ?? detail.changePercent);
            }
        };
        window.addEventListener('livePriceUpdate', handleGlobalPrice);

        return () => {
            isMounted = false;
            window.removeEventListener('liveMarketOverviewUpdate', handleMarketOverview);
            window.removeEventListener('livePriceUpdate', handleGlobalPrice);
            Object.values(flashTimersRef.current).forEach(t => clearTimeout(t));
        };
    }, []);

    // Filter items based on active tab
    const filteredItems = useMemo(() => {
        if (activeTab === 'Popular') {
            return items.filter(i => i.is_popular);
        }
        return items.filter(i => (i.category || '').toLowerCase() === activeTab.toLowerCase());
    }, [items, activeTab]);

    const categories = [
        { id: 'Popular', label: t('dashboard.popular', 'Popular') },
        { id: 'Forex', label: t('dashboard.forex', 'Forex') },
        { id: 'Crypto', label: t('dashboard.crypto', 'Crypto') },
        { id: 'Commodities', label: t('dashboard.commodities', 'Commodities') }
    ];

    return (
        <div className={styles.marketOverviewColumn}>
            {/* 1. Header Row (Outside table background) */}
            <div className={styles.overviewHeader}>
                <div className={styles.overviewTitleWrap}>
                    <div className={styles.overviewIconPulse}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </div>
                    <div className={styles.overviewTitleText}>
                        <h3>{t('dashboard.marketOverviewTitle', 'Market Overview')}</h3>
                        <span className={styles.liveStreamBadge}>{t('dashboard.liveStream', 'LIVE STREAM')}</span>
                    </div>
                </div>

                {/* 2. Category Filter Tabs */}
                <div className={styles.overviewTabsRow}>
                    {categories.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`${styles.overviewTabBtn} ${activeTab === tab.id ? styles.overviewTabActive : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Instruments Table Card (Card background only in table container) */}
            <div className={styles.marketOverviewCard}>
                <div className={styles.overviewTableWrapper}>
                    <div className={styles.overviewTableHeader}>
                        <div className={styles.colInstrument}>{t('dashboard.instrument', 'Instrument')}</div>
                        <div className={styles.colPrice}>{t('dashboard.price', 'Price')}</div>
                        <div className={styles.colTrend}>{t('dashboard.sparklineTrend', 'Sparkline Trend')}</div>
                        <div className={styles.colChange}>{t('dashboard.change24h', '24h Change')}</div>
                    </div>

                    <div className={styles.overviewTableBody}>
                        {filteredItems.map((item) => {
                            const isPositive = (item.change_24h ?? 0) >= 0;
                            const symClean = cleanPairSymbol(item.symbol);
                            const flashState = priceFlashMap[symClean];

                            return (
                                <Link
                                    href="/signal-terminal"
                                    key={item.symbol}
                                    className={`${styles.overviewRow} ${flashState === 'up' ? styles.flashUp : flashState === 'down' ? styles.flashDown : ''}`}
                                >
                                    {/* Instrument info */}
                                    <div className={styles.colInstrument}>
                                        <InstrumentIcon symbol={item.symbol} />
                                        <div className={styles.instrumentMeta}>
                                            <span className={styles.instrumentPair}>{item.pair_name || item.symbol}</span>
                                            <span className={styles.instrumentDisplay}>{item.display_name}</span>
                                        </div>
                                    </div>

                                    {/* Live Price */}
                                    <div className={`${styles.colPrice} ${flashState === 'up' ? styles.priceUp : flashState === 'down' ? styles.priceDown : ''}`}>
                                        {formatPrice(item.price)}
                                    </div>

                                    {/* Sparkline */}
                                    <div className={styles.colTrend}>
                                        <MiniSparkline data={item.trend} isPositive={isPositive} />
                                    </div>

                                    {/* 24h Change */}
                                    <div className={styles.colChange}>
                                        <span className={`${styles.changePill} ${isPositive ? styles.pillPositive : styles.pillNegative}`}>
                                            {item.change_24h_display || (isPositive ? `+${(item.change_24h || 0).toFixed(2)}%` : `${(item.change_24h || 0).toFixed(2)}%`)}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Footer Link */}
                <div className={styles.overviewFooter}>
                    <Link href="/signal-terminal" className={styles.viewAllMarketsLink}>
                        <span>{t('dashboard.viewAllMarkets', 'View All Markets')}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
