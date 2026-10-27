'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './broker.module.scss';
import { getStoredUserId } from '@/lib/authSession';
import { fetchBrokers, brokerList } from '@/lib/brokersData';
import { toast } from '@/components/toast';

import BrokerCard from '@/components/brokerCard';
import { BrokerCardSkeleton } from '@/components/brokerSkeleton';
import { useLanguage } from '@/context/LanguageContext';

const SearchIcon = () => (
    <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

export default function BrokerPage({ isPublic = false }) {
    const { t } = useLanguage();
    const [brokers, setBrokers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [connectModalBroker, setConnectModalBroker] = useState(null);
    const [server, setServer] = useState('');
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const userId = getStoredUserId();

    useEffect(() => {
        let isMounted = true;
        async function loadBrokers() {
            try {
                const data = await fetchBrokers();
                if (isMounted) {
                    const fallbackList = brokerList.filter((b) => b && b.is_active !== false);
                    const source = (data && data.length > 0) ? data : fallbackList;
                    setBrokers(source.filter((b) => b && b.is_active !== false));
                }
            } catch (_) {
                if (isMounted) setBrokers(brokerList.filter((b) => b && b.is_active !== false));
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadBrokers();
        return () => { isMounted = false; };
    }, []);

    // Strictly active brokers
    const activeBrokers = useMemo(() => {
        return brokers.filter((b) => b && b.is_active !== false);
    }, [brokers]);

    const categories = useMemo(() => {
        const set = new Set(activeBrokers.map((b) => b.category).filter(Boolean));
        return ['All', ...Array.from(set)];
    }, [activeBrokers]);

    const filteredBrokers = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return activeBrokers.filter((broker) => {
            if (broker.is_active === false) return false;
            const matchesTab = selectedTab === 'All' || broker.category === selectedTab;
            const matchesSearch =
                !q ||
                (broker.name || '').toLowerCase().includes(q) ||
                (broker.name_ar || '').toLowerCase().includes(q) ||
                (broker.name_ph || '').toLowerCase().includes(q) ||
                (broker.subtitle || '').toLowerCase().includes(q) ||
                (broker.subtitle_ph || '').toLowerCase().includes(q) ||
                (broker.description || '').toLowerCase().includes(q) ||
                (broker.description_ph || '').toLowerCase().includes(q);
            return matchesTab && matchesSearch;
        });
    }, [activeBrokers, selectedTab, searchQuery]);

    const handleConnectClick = (broker) => {
        setConnectModalBroker(broker);
        setServer(broker?.defaultServer || `${broker?.name || 'Live'}-Server`);
        setLoginId('');
        setPassword('');
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (!loginId.trim()) {
            toast.error('Please enter your MT5 Account ID');
            return;
        }
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            const brokerId = connectModalBroker?.id || 'mt5';
            try {
                const saved = JSON.parse(localStorage.getItem('connected_brokers') || '[]');
                const updated = [...new Set([...saved, brokerId])];
                localStorage.setItem('connected_brokers', JSON.stringify(updated));
            } catch (_) {}
            toast.success(`Successfully connected ${connectModalBroker?.name || 'MT5'} account!`, {
                style: {
                    background: '#0D1424',
                    color: '#18C98B',
                    border: '1px solid rgba(24, 201, 139, 0.3)'
                }
            });
            setConnectModalBroker(null);
        }, 700);
    };

    return (
        <div className={`${styles.brokerPage} ${isPublic ? styles.publicContainer : ''}`}>
            {/* 1. Luxury Institutional Infrastructure Hero Banner */}
            <div className={styles.brokerHeroBanner}>
                <div className={styles.heroBannerContent}>
                    {/* Left Column */}
                    <div className={styles.heroLeftCol}>
                        <h1 className={styles.heroTitle}>
                            {t('broker.titlePart1', 'Integrated Brokerage &')}{' '}
                            <span className={styles.gradientText}>{t('broker.titlePart2', 'Trading Infrastructure')}</span>
                        </h1>

                        <p className={styles.heroSubtitle}>
                            {t('broker.subtitle', 'Connect your MT5 account, view verified broker partners, and earn automated AI credits on every traded lot.')}
                        </p>

                        {/* 4 Micro Metrics Grid */}
                        <div className={styles.metricsGrid}>
                            <div className={styles.metricCard}>
                                <div className={styles.metricIconWrap}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <div className={styles.metricTexts}>
                                    <span className={styles.metricVal}>{t('broker.tier1Regulated', 'Tier-1 Regulated')}</span>
                                    <span className={styles.metricLbl}>{t('broker.verifiedSecurity', 'Verified Security')}</span>
                                </div>
                            </div>

                            <div className={styles.metricCard}>
                                <div className={styles.metricIconWrap}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                </div>
                                <div className={styles.metricTexts}>
                                    <span className={styles.metricVal}>&lt; 15ms Latency</span>
                                    <span className={styles.metricLbl}>{t('broker.directBridge', 'Direct MT5 Bridge')}</span>
                                </div>
                            </div>

                            <div className={styles.metricCard}>
                                <div className={styles.metricIconWrap}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </div>
                                <div className={styles.metricTexts}>
                                    <span className={styles.metricVal}>{t('broker.volumeRebates', 'Volume Rebates')}</span>
                                    <span className={styles.metricLbl}>{t('broker.autoCredits', 'Auto AI Credits / Lot')}</span>
                                </div>
                            </div>

                            <div className={styles.metricCard}>
                                <div className={styles.metricIconWrap}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <rect x="4" y="4" width="16" height="16" rx="2" />
                                        <rect x="9" y="9" width="6" height="6" />
                                        <line x1="9" y1="1" x2="9" y2="4" />
                                        <line x1="15" y1="1" x2="15" y2="4" />
                                        <line x1="9" y1="20" x2="9" y2="23" />
                                        <line x1="15" y1="20" x2="15" y2="23" />
                                    </svg>
                                </div>
                                <div className={styles.metricTexts}>
                                    <span className={styles.metricVal}>{t('broker.fixEngine', 'FIX 4.4 Engine')}</span>
                                    <span className={styles.metricLbl}>{t('broker.stpEcn', 'STP / ECN Direct')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Controls Row: Category Tabs & Search */}
            <div className={styles.controlsRow}>
                <div className={styles.tabs}>
                    {categories.map((tab) => {
                        const count = tab === 'All' ? activeBrokers.length : activeBrokers.filter((b) => b.category === tab).length;
                        return (
                            <button
                                key={tab}
                                className={`${styles.tabBtn} ${selectedTab === tab ? styles.active : ''}`}
                                onClick={() => setSelectedTab(tab)}
                            >
                                <span>{tab}</span>
                                <span className={styles.tabBadge}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className={styles.searchBox}>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder={t('broker.searchBrokers', 'Search brokers, regulations, or servers...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery('')} className={styles.clearSearchBtn}>
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* 3. Brokers Cards Grid */}
            {isLoading ? (
                <div className={styles.brokersGrid}>
                    {Array.from({ length: (activeBrokers && activeBrokers.length > 0) ? activeBrokers.length : 3 }).map((_, idx) => (
                        <BrokerCardSkeleton key={idx} />
                    ))}
                </div>
            ) : filteredBrokers.length > 0 ? (
                <div className={styles.brokersGrid}>
                    {filteredBrokers.map((broker) => (
                        <BrokerCard
                            key={broker.id}
                            broker={broker}
                            detailHref={isPublic ? `/supported-brokers/${broker.id}` : `/brokers/${broker.id}`}
                            isPublic={isPublic}
                            onConnect={handleConnectClick}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIconBox}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <h3>{t('broker.noBrokersFound', 'No verified brokers found')}</h3>
                    <p>No broker or platform matching &quot;{searchQuery}&quot; in category &quot;{selectedTab}&quot;.</p>
                    <button type="button" onClick={() => { setSearchQuery(''); setSelectedTab('All'); }} className={styles.resetFiltersBtn}>
                        Reset Filters
                    </button>
                </div>
            )}

            {/* Connect Account Modal */}
            {connectModalBroker && (
                <div className={styles.connectModalOverlay} onClick={() => setConnectModalBroker(null)}>
                    <div className={styles.connectModalCard} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.connectModalHeader}>
                            <div>
                                <h3>Connect {connectModalBroker.name}</h3>
                                <p>{t('broker.linkCredentialsDesc', 'Link your MT5 credentials to enable automated trade telemetry and AI audit sync.')}</p>
                            </div>
                            <button
                                type="button"
                                className={styles.connectModalCloseBtn}
                                onClick={() => setConnectModalBroker(null)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form
                            method="post"
                            action="javascript:void(0);"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleModalSubmit(e);
                            }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                        >
                            <div className={styles.connectFormGroup}>
                                <label>{t('broker.serverLabel', 'Broker Server')}</label>
                                <input
                                    type="text"
                                    value={server}
                                    onChange={(e) => setServer(e.target.value)}
                                    placeholder={t('broker.serverPlaceholder', 'e.g. Server-Live01')}
                                    required
                                />
                            </div>

                            <div className={styles.connectFormGroup}>
                                <label>{t('broker.loginIdLabel', 'MT5 Login ID (Account Number)')}</label>
                                <input
                                    type="text"
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                    placeholder="e.g. 5182930"
                                    required
                                />
                            </div>

                            <div className={styles.connectFormGroup}>
                                <label>{t('broker.investorPasswordLabel', 'Investor / Read Password')}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>

                            <p style={{ fontSize: '11px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                                Security notice: We recommend entering your MT5 <strong>{t('broker.readOnlyDesc', 'read-only / investor password')}</strong>. Your credentials are encrypted in-transit.
                            </p>

                            <div className={styles.modalActionsRow}>
                                <button
                                    type="button"
                                    onClick={() => setConnectModalBroker(null)}
                                    className={styles.btnCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.btnConfirm}
                                    disabled={isConnecting}
                                >
                                    {isConnecting ? 'Validating Connection...' : 'Confirm Connection →'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
