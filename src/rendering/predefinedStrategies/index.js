'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CommonSectionHeader from '@/components/CommonSectionHeader';
import PredefinedStrategyCard from '@/components/strategyCard';
import { useLanguage } from '@/context/LanguageContext';
import styles from './predefinedStrategies.module.scss';

const TrophyHeaderIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
        <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const SearchIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const EmptyBoxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

export default function PredefinedStrategies() {
    const { t } = useLanguage();
    const [strategies, setStrategies] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchStrategies() {
            try {
                const res = await fetch('/api/v1/strategies/predefined');
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted && Array.isArray(json?.strategies)) {
                        setStrategies(json.strategies);
                    }
                }
            } catch (err) {
                console.warn('Failed to load predefined strategies:', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        fetchStrategies();
        return () => { isMounted = false; };
    }, []);

    const filteredStrategies = useMemo(() => {
        return strategies.filter((strat) => {
            const matchesFilter = filter === 'all' || 
                (strat.category || '').toLowerCase().includes(filter) ||
                (strat.risk_level || '').toLowerCase().includes(filter);

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q ||
                (strat.strategy_name || '').toLowerCase().includes(q) ||
                (strat.description || '').toLowerCase().includes(q) ||
                (strat.symbol || '').toLowerCase().includes(q) ||
                (strat.category || '').toLowerCase().includes(q);

            return matchesFilter && matchesSearch;
        });
    }, [strategies, filter, searchQuery]);

    const categories = ['all', 'institutional', 'scalping', 'conservative', 'moderate'];

    return (
        <div className={styles.predefinedStrategiesPage}>
            <CommonSectionHeader
                badge="TRADERMASTER ALGORITHMIC PLAYBOOKS"
                badgeIcon={<TrophyHeaderIcon />}
                title={t('nav.predefinedStrategies', 'Predefined Strategies')}
                subtitle={t('predefinedStrategies.subtitle', 'Explore institutional pre-configured trading strategies with verified backtest results, risk telemetry, and automated playbook parameters.')}
                isCard={true}
            />

            <div className={styles.controlsBar}>
                <div className={styles.searchBox}>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder={t('predefinedStrategies.searchPlaceholder', 'Search strategy, pair, or indicator...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filterPills}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`${styles.filterBtn} ${filter === cat ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat === 'all' ? 'All Strategies' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className={styles.strategiesGrid}>
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className={styles.skeletonCard} />
                    ))}
                </div>
            ) : filteredStrategies.length > 0 ? (
                <div className={styles.strategiesGrid}>
                    {filteredStrategies.map((strat) => (
                        <PredefinedStrategyCard
                            key={strat.id}
                            strategy={strat}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <EmptyBoxIcon />
                    </div>
                    <h4>{t('predefinedStrategies.noResultsTitle', 'No Strategies Found')}</h4>
                    <p>{t('predefinedStrategies.noResultsDesc', 'No predefined strategies matched your current filter criteria. Try selecting another category or clearing your search query.')}</p>
                </div>
            )}
        </div>
    );
}
