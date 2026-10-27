'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './botLibrary.module.scss';
import CommonSectionHeader from '@/components/CommonSectionHeader';
import { BotLibraryIcon } from '@/icons/sidebarIcons';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/components/toast';

const BOT_TEMPLATES = [
    {
        id: 'lib_gold_scalper',
        name: 'Gold Donchian Momentum Scalper',
        category: 'Gold Scalping',
        symbol: 'XAUUSD',
        timeframe: '5m',
        winRate: '68.4%',
        profitFactor: '2.14',
        maxDrawdown: '4.8%',
        tradesCount: '342',
        description: 'High-frequency Donchian breakout model targeting volatility expansions during London & NY overlaps.',
        badge: 'TOP PERFORMER'
    },
    {
        id: 'lib_btc_trend',
        name: 'BTC Multi-EMA Dynamic Trend Rider',
        category: 'Crypto Trend',
        symbol: 'BTCUSD',
        timeframe: '1h',
        winRate: '61.2%',
        profitFactor: '1.92',
        maxDrawdown: '6.2%',
        tradesCount: '188',
        description: 'Follows medium-term momentum trends using EMA 20/50/200 cloud with dynamic ATR trailing stops.',
        badge: 'TREND FOLLOWING'
    },
    {
        id: 'lib_ict_sweep',
        name: 'ICT Liquidity Sweep & Order Block EA',
        category: 'ICT Models',
        symbol: 'EURUSD',
        timeframe: '15m',
        winRate: '71.0%',
        profitFactor: '2.35',
        maxDrawdown: '3.9%',
        tradesCount: '215',
        description: 'Detects liquidity sweeps at previous session highs/lows and enters on fair value gap retracements.',
        badge: 'INSTITUTIONAL'
    },
    {
        id: 'lib_fx_mean_rev',
        name: 'Forex Mean Reversion Bollinger Scalper',
        category: 'Mean Reversion',
        symbol: 'GBPUSD',
        timeframe: '15m',
        winRate: '65.8%',
        profitFactor: '1.81',
        maxDrawdown: '5.1%',
        tradesCount: '410',
        description: 'Fades statistical extremes when price deviates 2.5 standard deviations outside Bollinger Bands with RSI confirmation.',
        badge: 'POPULAR'
    },
    {
        id: 'lib_us30_breakout',
        name: 'US30 Opening Bell Breakout Bot',
        category: 'Indices',
        symbol: 'US30',
        timeframe: '5m',
        winRate: '63.5%',
        profitFactor: '2.05',
        maxDrawdown: '5.8%',
        tradesCount: '156',
        description: 'Captures Wall Street opening momentum breakouts using volume spikes and 15-minute opening range boundaries.',
        badge: 'VOLATILITY'
    },
    {
        id: 'lib_eth_momentum',
        name: 'ETH MACD Squeeze & Volume Surge',
        category: 'Crypto Trend',
        symbol: 'ETHUSD',
        timeframe: '15m',
        winRate: '62.0%',
        profitFactor: '1.88',
        maxDrawdown: '5.5%',
        tradesCount: '230',
        description: 'Triggers algorithmic long/short positions on MACD histogram zero-line crossovers confirmed by OBV surges.',
        badge: 'ALGO SCALPER'
    }
];

const CATEGORIES = ['All', 'Gold Scalping', 'Crypto Trend', 'ICT Models', 'Mean Reversion', 'Indices'];

export default function BotLibraryView() {
    const router = useRouter();
    const { t } = useLanguage();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const handleCloneBot = (template) => {
        const cloned = {
            id: 'bot_' + Date.now(),
            name: `${template.name} (Copy)`,
            symbol: template.symbol,
            timeframe: template.timeframe,
            type: 'Cloned Template',
            status: 'paused',
            winRate: template.winRate,
            profitFactor: template.profitFactor,
            totalPnl: '+$0.00',
            createdAt: new Date().toISOString()
        };

        try {
            const current = JSON.parse(localStorage.getItem('chronosx_user_bots') || '[]');
            current.unshift(cloned);
            localStorage.setItem('chronosx_user_bots', JSON.stringify(current));
            toast.success(`"${template.name}" cloned to My Bots!`);
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('page:loading:start'));
            }
            router.push('/my-bots');
        } catch (e) {
            console.error('Clone error:', e);
        }
    };

    const handleBacktest = (template) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('page:loading:start'));
        }
        router.push('/ai-bot-builder');
    };

    const filteredTemplates = BOT_TEMPLATES.filter((tpl) => {
        const matchCat = selectedCategory === 'All' || tpl.category === selectedCategory;
        const matchSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tpl.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className={styles.libraryContainer}>
            {/* Common Section Header */}
            <CommonSectionHeader
                badge="CHRONOSX AI TRADING BOT SUITE"
                icon={<BotLibraryIcon width={28} height={28} />}
                title={t('nav.botLibrary', 'Browse Bots Library')}
                subtitle="Explore, backtest, and clone verified algorithmic trading bot templates across forex, crypto, and commodities."
            />

            {/* Filter & Search Bar */}
            <div className={styles.filterRow}>
                <div className={styles.categoriesTrack}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`${styles.catBtn} ${selectedCategory === cat ? styles.catActive : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className={styles.searchBox}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search templates, indicators, pairs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Templates Grid */}
            <div className={styles.templatesGrid}>
                {filteredTemplates.map((tpl) => (
                    <div key={tpl.id} className={styles.templateCard}>
                        <div className={styles.cardTop}>
                            <div className={styles.tagGroup}>
                                <span className={styles.symbolTag}>{tpl.symbol}</span>
                                <span className={styles.timeframeTag}>{tpl.timeframe}</span>
                                {tpl.badge && <span className={styles.featureBadge}>{tpl.badge}</span>}
                            </div>
                        </div>

                        <h3 className={styles.tplName}>{tpl.name}</h3>
                        <p className={styles.tplDesc}>{tpl.description}</p>

                        <div className={styles.metricsGrid}>
                            <div className={styles.metricItem}>
                                <span className={styles.mLabel}>Win Rate</span>
                                <span className={`${styles.mVal} ${styles.winRateColor}`}>{tpl.winRate}</span>
                            </div>
                            <div className={styles.metricItem}>
                                <span className={styles.mLabel}>Profit Factor</span>
                                <span className={styles.mVal}>{tpl.profitFactor}</span>
                            </div>
                            <div className={styles.metricItem}>
                                <span className={styles.mLabel}>Max Drawdown</span>
                                <span className={styles.mVal}>{tpl.maxDrawdown}</span>
                            </div>
                        </div>

                        <div className={styles.cardActions}>
                            <button
                                type="button"
                                className={styles.cloneBtn}
                                onClick={() => handleCloneBot(tpl)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                <span>Clone to My Bots</span>
                            </button>
                            <button
                                type="button"
                                className={styles.backtestBtn}
                                onClick={() => handleBacktest(tpl)}
                            >
                                Backtest
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
