'use client';

import React, { useState, useEffect } from 'react';
import PredefinedStrategyCard from '@/components/strategyCard';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../dashboard.module.scss';

const TrophyIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
        <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

export default function DashboardPredefinedStrategies() {
    const { t } = useLanguage();
    const [strategies, setStrategies] = useState([]);
    const [filter, setFilter] = useState('all');
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

    const filteredStrategies = strategies.filter((strat) => {
        if (filter === 'all') return true;
        const f = filter.toLowerCase();
        const sym = (strat.symbol || '').toLowerCase();
        const tf = (strat.timeframe || '').toLowerCase();
        const name = (strat.strategy_name || '').toLowerCase();
        const category = (strat.category || '').toLowerCase();
        const risk = (strat.risk_level || '').toLowerCase();
        return sym.includes(f) || tf.includes(f) || name.includes(f) || category.includes(f) || risk.includes(f);
    });

    return (
        <section className={styles.predefinedStrategiesSection}>
            <div className={styles.predefinedStrategiesHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.iconBadge}>
                        <TrophyIcon />
                    </div>
                    <h3 className={styles.titleText}>
                        {t('dashboard.topStrategies', 'Top Performing Algorithmic Strategies')}
                    </h3>
                </div>

                <div className={styles.filterPills}>
                    {['all', 'XAUUSD', 'EURJPY', 'EURUSD', '15min'].map((f) => (
                        <button
                            key={f}
                            type="button"
                            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'All' : f}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.strategiesGrid}>
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, idx) => (
                        <div key={idx} className={styles.skeletonCard} />
                    ))
                ) : (
                    filteredStrategies.map((strat) => (
                        <PredefinedStrategyCard
                            key={strat.id}
                            strategy={strat}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
