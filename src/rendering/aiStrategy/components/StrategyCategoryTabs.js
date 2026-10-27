'use client';

import React, { useMemo } from 'react';
import styles from '../aiStrategy.module.scss';
import { useLanguage } from '@/context/LanguageContext';

export default function StrategyCategoryTabs({
    strategies = [],
    selectedStrategyId,
    onSelectStrategyId,
    activeCategory,
    onSelectCategory
}) {
    const { t } = useLanguage();

    // Dynamically build category / strategy tabs from the API response (keeping only EMA Pullback)
    const dynamicTabs = useMemo(() => {
        const tabs = [];
        const seenLabels = new Set();
        if (Array.isArray(strategies) && strategies.length > 0) {
            const pullbackStrategies = strategies.filter(st => {
                const text = `${st.name || ''} ${st.title || ''} ${st.strategy_name || ''} ${st.description || ''}`.toLowerCase();
                return (text.includes('pullback') || text.includes('ema pullback')) && !text.includes('eurusd');
            });
            const listToUse = pullbackStrategies.length > 0 ? pullbackStrategies : [
                { id: strategies[0].id || strategies[0].strategy_id || '3e8d2b78-0e86-4fdf-9759-338276db1742', name: 'EMA Pullback' }
            ];
            listToUse.forEach(st => {
                const id = st.id || st.strategy_id;
                let rawLabel = st.name || st.title || st.strategy_name || st.description || 'EMA Pullback';
                let label = rawLabel.replace(/\bEURUSD\b/gi, '').replace(/\bStrategy\b/gi, '').trim() || 'EMA Pullback';
                if (!seenLabels.has(label)) {
                    seenLabels.add(label);
                    tabs.push({ id, label });
                }
            });
        } else {
            tabs.push({ id: '3e8d2b78-0e86-4fdf-9759-338276db1742', label: 'EMA Pullback' });
        }
        return tabs;
    }, [strategies]);

    const isTabActive = (tabId, index) => {
        if (!selectedStrategyId && !activeCategory) {
            return index === 0;
        }
        return selectedStrategyId === tabId || activeCategory === tabId;
    };

    const handleTabClick = (tab) => {
        if (onSelectCategory) onSelectCategory(tab.id);
        if (onSelectStrategyId) onSelectStrategyId(tab.id);
    };

    return (
        <div className={styles.strategyCategoryFilterBar} role="toolbar" aria-label="Strategy Category Filter">
            {/* Filter by Category Header */}
            <div className={styles.filterTitleGroup}>
                <svg
                    className={styles.filterIcon}
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>{t('aiStrategy.filterByCategory', 'Filter by Strategy')}</span>
            </div>

            {/* Category Pills Track */}
            <div className={styles.categoryPillsTrack}>
                {dynamicTabs.map((tab, idx) => {
                    const isActive = isTabActive(tab.id, idx);

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            className={`${styles.categoryPill} ${isActive ? styles.activeCategoryPill : ''}`}
                            onClick={() => handleTabClick(tab)}
                            aria-pressed={isActive}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

