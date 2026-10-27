'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './aiStrategy.module.scss';
import { useLanguage } from '@/context/LanguageContext';

function ChevronDownIcon({ className, ...props }) {
    return (
        <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
            {...props}
        >
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );
}

export default function StrategyDropdown({ strategies: propStrategies = [], selectedStrategyId, onSelect, loading: propLoading = false }) {
    const { t } = useLanguage();
    const [strategies, setStrategies] = useState(propStrategies);
    const [loading, setLoading] = useState(propLoading);
    const [selectedId, setSelectedId] = useState(selectedStrategyId || '');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const initialSelectFiredRef = useRef(false);

    useEffect(() => {
        if (selectedStrategyId && selectedStrategyId !== selectedId) {
            setSelectedId(selectedStrategyId);
        }
    }, [selectedStrategyId]);

    useEffect(() => {
        if (propStrategies && propStrategies.length > 0) {
            const filtered = propStrategies.filter(st => {
                const text = `${st.name || ''} ${st.title || ''} ${st.strategy_name || ''} ${st.description || ''}`.toLowerCase();
                return (text.includes('pullback') || text.includes('ema pullback')) && !text.includes('eurusd');
            });
            const effectiveList = filtered.length > 0 ? filtered : [
                { id: propStrategies[0].id || propStrategies[0].strategy_id || '3e8d2b78-0e86-4fdf-9759-338276db1742', name: 'EMA Pullback', description: 'Trend Following EMA Pullback' }
            ];
            setStrategies(effectiveList);
            setLoading(false);
            if (!selectedId) {
                const firstId = effectiveList[0].id || effectiveList[0].strategy_id;
                setSelectedId(firstId);
                if (onSelect && !initialSelectFiredRef.current) {
                    initialSelectFiredRef.current = true;
                    onSelect(firstId);
                }
            }
            return;
        }

        async function fetchStrategies() {
            setLoading(true);
            try {
                const getApiBase = () => {
                    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
                        return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, '');
                    }
                    if (process.env.NEXT_PUBLIC_API_URL) {
                        return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
                    }
                    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WS_LIVE_URL;
                    if (wsUrl) {
                        try {
                            const parsed = new URL(wsUrl);
                            const proto = parsed.protocol === 'wss:' ? 'https:' : 'http:';
                            return `${proto}//${parsed.host}`;
                        } catch (_) {}
                    }
                    return '';
                };

                const apiBase = getApiBase();
                let res;
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 4000);
                    res = await fetch(`${apiBase}/api/v1/chart/strategies`, {
                        signal: controller.signal,
                        headers: { 
                            'accept': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });
                    clearTimeout(timeoutId);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                } catch (e) {
                    // Fallback to internal proxy
                    try {
                        res = await fetch('/api/v1/chart/strategies');
                        if (!res.ok) throw new Error('Proxy failed');
                    } catch (err2) {
                        res = await fetch(`${apiBase}/api/v1/chart/strategies`, {
                            headers: { 
                                'accept': 'application/json',
                                'ngrok-skip-browser-warning': 'true'
                            }
                        });
                    }
                }

                if (!res.ok) throw new Error('Failed to fetch strategies');
                const data = await res.json();
                
                // Handle various response wrappers
                const list = Array.isArray(data) ? data : (data.strategies || data.data || []);
                const pullbackList = list.filter(st => {
                    const text = `${st.name || ''} ${st.title || ''} ${st.strategy_name || ''} ${st.description || ''}`.toLowerCase();
                    return (text.includes('pullback') || text.includes('ema pullback')) && !text.includes('eurusd');
                });
                const effectiveList = pullbackList.length > 0 ? pullbackList : [
                    { id: '3e8d2b78-0e86-4fdf-9759-338276db1742', name: 'EMA Pullback', description: 'Trend Following EMA Pullback' }
                ];
                setStrategies(effectiveList);
                if (effectiveList.length > 0) {
                    const firstId = effectiveList[0].id || effectiveList[0].strategy_id;
                    setSelectedId(prev => prev || firstId);
                    if (onSelect && !initialSelectFiredRef.current) {
                        initialSelectFiredRef.current = true;
                        onSelect(firstId);
                    }
                }
            } catch (err) {
                console.error("Error fetching strategies:", err);
                const fallbackList = [
                    { id: '3e8d2b78-0e86-4fdf-9759-338276db1742', name: 'EMA Pullback', description: 'Trend Following EMA Pullback' }
                ];
                setStrategies(fallbackList);
                const firstId = fallbackList[0].id;
                setSelectedId(prev => prev || firstId);
                if (onSelect && !initialSelectFiredRef.current) {
                    initialSelectFiredRef.current = true;
                    onSelect(firstId);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchStrategies();
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectOption = (id) => {
        setSelectedId(id);
        setIsOpen(false);
        if (onSelect) {
            onSelect(id);
        }
    };

    const selectedStrategy = strategies.find(st => (st.id || st.strategy_id) === selectedId);
    const selectedLabel = selectedStrategy 
        ? (selectedStrategy.name || selectedStrategy.title || selectedStrategy.description || `Strategy ${selectedStrategy.id}`)
        : (loading ? 'Loading strategies...' : 'No Strategies Available');

    return (
        <div className={styles.strategyDropdownContainer} ref={dropdownRef}>
            <bdi className={styles.dropdownLabel}>{t('aiStrategy.activeStrategyLabel', 'Active Strategy:')}</bdi>
            
            <div className={styles.customSelectWrapper}>
                <button
                    type="button"
                    className={styles.customSelectTrigger}
                    onClick={() => !loading && strategies.length > 0 && setIsOpen(!isOpen)}
                    disabled={loading || strategies.length === 0}
                >
                    <span className={styles.selectedText}>{selectedLabel}</span>
                    <ChevronDownIcon className={`${styles.chevronIcon} ${isOpen ? styles.chevronRotated : ''}`} />
                </button>

                {isOpen && strategies.length > 0 && (
                    <div className={styles.customDropdownMenu}>
                        {strategies.map((st) => {
                            const optionId = st.id || st.strategy_id;
                            const optionLabel = st.name || st.title || st.description || `Strategy ${st.id}`;
                            const isSelected = optionId === selectedId;
                            
                            return (
                                <button
                                    key={optionId}
                                    type="button"
                                    className={`${styles.customDropdownItem} ${isSelected ? styles.itemSelected : ''}`}
                                    onClick={() => handleSelectOption(optionId)}
                                >
                                    <span>{optionLabel}</span>
                                    {isSelected && <span className={styles.checkmarkIcon}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
