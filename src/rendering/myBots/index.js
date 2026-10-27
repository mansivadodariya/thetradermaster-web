'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './myBots.module.scss';
import CommonSectionHeader from '@/components/CommonSectionHeader';
import { MyBotsIcon } from '@/icons/sidebarIcons';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/components/toast';
import { getStoredUserId } from '@/lib/authSession';

import DeleteBotModal from './components/DeleteBotModal';
import StrategyDetailModal from './components/StrategyDetailModal';
import MyBotsStats from './components/MyBotsStats';
import MyBotsFilterBar from './components/MyBotsFilterBar';
import MyBotCard from './components/MyBotCard';
import CreateBotModal from './components/CreateBotModal';
import MyBotsEmptyState from './components/MyBotsEmptyState';
import { fetchVisibleTabNames, getVisibleTabNamesSync, checkPermissionInSet } from '@/lib/useTabPermission';
import { mapStrategyToBot } from './utils/botHelpers';

const resolveBacktestApiBase = () => {
    const raw = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKTEST_API_URL || '').replace(/\/+$/, '');
    if (!raw) return '/backtest/v1';
    return raw.endsWith('/backtest/v1') ? raw : `${raw}/backtest/v1`;
};

let inFlightBotsFetch = null;

export default function MyBots() {
    const router = useRouter();
    const { t } = useLanguage();
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCreationType, setFilterCreationType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedStrategyDetail, setSelectedStrategyDetail] = useState(null);
    const [botToDelete, setBotToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [visibleTabNames, setVisibleTabNames] = useState(() => getVisibleTabNamesSync());

    const hasFetchedRef = React.useRef(false);
    const isFetchingRef = React.useRef(false);

    useEffect(() => {
        fetchVisibleTabNames().then(set => {
            if (set) setVisibleTabNames(set);
        });

        if (typeof window !== 'undefined') {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const filter = urlParams.get('filter') || urlParams.get('type') || sessionStorage.getItem('myBots_filter');
                if (filter === 'manual' || filter === 'custom') {
                    setFilterCreationType('manual');
                } else if (filter === 'ai') {
                    setFilterCreationType('ai');
                }
                sessionStorage.removeItem('myBots_filter');
            } catch (_) {}
        }
    }, []);

    // Load Strategies dynamically from backend API & locally created bots
    const loadUserStrategies = useCallback(async (force = false) => {
        if (isFetchingRef.current) return;
        if (!force && hasFetchedRef.current) return;
        isFetchingRef.current = true;
        hasFetchedRef.current = true;
        setLoading(true);
        try {
            const uid = getStoredUserId() || 'test_user';
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('access_token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const apiBase = resolveBacktestApiBase();
            const endpoint = `${apiBase}/ai-bot-builder/${encodeURIComponent(uid)}`;

            if (!inFlightBotsFetch || force) {
                inFlightBotsFetch = fetch(endpoint, {
                    method: 'GET',
                    headers,
                    cache: 'no-store'
                }).then(async (res) => {
                    if (res && res.ok) {
                        return await res.json();
                    }
                    return null;
                }).catch(() => null).finally(() => {
                    inFlightBotsFetch = null;
                });
            }

            const json = await inFlightBotsFetch;

            let apiBots = [];
            if (json) {
                const rawList = Array.isArray(json.data)
                    ? json.data
                    : (Array.isArray(json) ? json : (json.strategies || []));

                if (Array.isArray(rawList) && rawList.length > 0) {
                    apiBots = rawList.map((item, idx) => mapStrategyToBot(item, idx));
                }
            }

            // Also merge user custom bots saved in localStorage
            let localCustomBots = [];
            try {
                if (typeof window !== 'undefined') {
                    const saved = JSON.parse(localStorage.getItem('chronosx_user_bots') || '[]');
                    if (Array.isArray(saved) && saved.length > 0) {
                        localCustomBots = saved.map((item, idx) => ({
                            id: item.id || `local_custom_${idx}`,
                            strategyId: item.strategyId || item.id,
                            name: item.name || 'Custom Algo Bot',
                            symbol: item.symbol || 'EUR/USD',
                            timeframe: item.timeframe || '1h',
                            type: item.type || 'Custom Bot',
                            direction: item.direction || 'Long',
                            status: item.status || 'active',
                            sl: item.sl || (item.stopLossPips ? `${item.stopLossPips} pips` : '50 pips'),
                            tp: item.tp || (item.takeProfitPips ? `${item.takeProfitPips} pips` : '100 pips'),
                            riskReward: item.riskReward || '1:2.0',
                            lots: item.lotSize || item.lots || 0.1,
                            pattern: item.pattern || 'Technical Rules',
                            description: item.description || 'Custom user created algorithmic bot.',
                            createdAt: item.createdAt || new Date().toISOString(),
                            creationType: 'manual',
                            creation_type: 'manual',
                            winRate: item.winRate || '68.4%',
                            profitFactor: item.profitFactor || '1.92',
                            totalPnl: item.totalPnl || '+$0.00',
                            rawStrategy: item.rawStrategy || item,
                            source: 'local'
                        }));
                    }
                }
            } catch (storageErr) {
                console.warn('Error loading local custom bots:', storageErr);
            }

            const existingIds = new Set(apiBots.map(b => String(b.id || b.strategyId)));
            const uniqueLocal = localCustomBots.filter(b => !existingIds.has(String(b.id || b.strategyId)));

            setBots([...uniqueLocal, ...apiBots]);
        } catch (err) {
            console.warn('Could not fetch strategies from backend:', err);
            setBots([]);
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUserStrategies();
    }, [loadUserStrategies]);

    const saveBots = (newBots) => {
        setBots(newBots);
    };

    const handleToggleBotStatus = (botId) => {
        const updated = bots.map((b) => {
            if (b.id === botId) {
                const newStatus = b.status === 'active' ? 'paused' : 'active';
                toast.success(`Bot "${b.name}" is now ${newStatus.toUpperCase()}`);
                return { ...b, status: newStatus };
            }
            return b;
        });
        saveBots(updated);
    };

    const handleConfirmDelete = async () => {
        if (!botToDelete) return;
        setIsDeleting(true);
        const { id: botId, name: botName, strategyId } = botToDelete;

        const sid = strategyId || botId;
        if (sid) {
            try {
                const apiBase = resolveBacktestApiBase();
                const headers = { 'Accept': 'application/json' };
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem('access_token');
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                }
                await fetch(`${apiBase}/user-strategies/${encodeURIComponent(sid)}`, {
                    method: 'DELETE',
                    headers
                }).catch(() => null);
            } catch (err) {
                console.warn('Backend delete error:', err);
            }
        }

        try {
            if (typeof window !== 'undefined') {
                const current = JSON.parse(localStorage.getItem('chronosx_user_bots') || '[]');
                const filtered = current.filter(b => b.id !== botId && b.strategyId !== botId);
                localStorage.setItem('chronosx_user_bots', JSON.stringify(filtered));
            }
        } catch (_) {}

        const updated = bots.filter((b) => b.id !== botId);
        saveBots(updated);
        toast.success(`Strategy "${botName}" deleted`);
        setIsDeleting(false);
        setBotToDelete(null);
    };

    const handleNavigate = (path) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('page:loading:start'));
        }
        router.push(path);
    };

    const handleSimulateEdit = (bot) => {
        try {
            if (bot?.rawStrategy) {
                sessionStorage.setItem('active_selected_strategy', JSON.stringify(bot.rawStrategy));
            }
        } catch (_) { }
        handleNavigate('/ai-bot-builder');
    };

    const handleRunBacktestBot = (bot) => {
        const stratId = bot?.strategyId || bot?.id || bot?.rawStrategy?.strategy_id || bot?.rawStrategy?.id || 'user_bot';
        const stratSymbol = bot?.symbol || (Array.isArray(bot?.rawStrategy?.stock_name) ? bot.rawStrategy.stock_name[0] : bot?.rawStrategy?.stock_name) || 'BTCUSD';
        const stratInterval = bot?.timeframe || bot?.rawStrategy?.interval || bot?.rawStrategy?.timeframe || '15min';
        const stratCapital = bot?.capital || bot?.rawStrategy?.inital_capital || bot?.rawStrategy?.initial_capital || 10000;
        const stratQuantity = bot?.lots || bot?.quantity || bot?.rawStrategy?.quantity || 0.01;
        const stratFromDate = bot?.rawStrategy?.from_date || '';
        const stratToDate = bot?.rawStrategy?.to_date || '';

        try {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('pending_backtest_run', JSON.stringify({
                    strategy_id: stratId,
                    name: bot?.name || 'Custom Bot Strategy',
                    source: 'user_strategies',
                    symbol: stratSymbol,
                    interval: stratInterval,
                    capital: stratCapital,
                    quantity: stratQuantity,
                    from_date: stratFromDate,
                    to_date: stratToDate,
                    raw_strategy: bot?.rawStrategy || bot
                }));
                window.dispatchEvent(new CustomEvent('page:loading:start'));
            }
        } catch (_) { }

        router.push(`/backtest?strategy_id=${encodeURIComponent(stratId)}&name=${encodeURIComponent(bot?.name || '')}&source=user_strategies`);
    };

    const filteredBots = bots.filter((b) => {
        const matchCreationType = filterCreationType === 'all' || b.creationType === filterCreationType;
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = !q ||
            (b.name && b.name.toLowerCase().includes(q)) ||
            (b.symbol && b.symbol.toLowerCase().includes(q)) ||
            (b.type && b.type.toLowerCase().includes(q)) ||
            (b.pattern && b.pattern.toLowerCase().includes(q)) ||
            (b.creationType && b.creationType.toLowerCase().includes(q));
        return matchCreationType && matchSearch;
    });

    const hasAiBotPermission = checkPermissionInSet(visibleTabNames, 'ai bot builder');
    const hasCustomBotPermission = checkPermissionInSet(visibleTabNames, 'custom bot builder');
    const hasLibraryPermission = checkPermissionInSet(visibleTabNames, 'browse bots library');
    const isSingleCard = (hasAiBotPermission ? 1 : 0) + (hasCustomBotPermission ? 1 : 0) === 1;

    const activeCount = bots.filter((b) => b.status === 'active').length;
    const aiCount = bots.filter((b) => b.creationType === 'ai').length;
    const manualCount = bots.filter((b) => b.creationType === 'manual').length;
    const totalPnL = bots.reduce((acc, b) => {
        const numeric = parseFloat(String(b.totalPnl).replace(/[^0-9.-]+/g, '')) || 0;
        return acc + numeric;
    }, 0);

    return (
        <div className={styles.container}>
            {/* Common Section Header */}
            <CommonSectionHeader
                badge={t('myBots.headerBadge', 'CHRONOSX AI TRADING BOT SUITE')}
                icon={<MyBotsIcon width={28} height={28} />}
                title={t('nav.myBots', 'My Trading Bots')}
                subtitle={t('myBots.headerSubtitle', 'Manage, monitor, and deploy your algorithmic trading bots with real-time performance analytics.')}
                rightAction={
                    <div className={styles.headerActions}>
                        <button
                            type="button"
                            className={styles.createBtn}
                            onClick={() => setShowCreateModal(true)}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>{t('myBots.createBtn', 'Create New Bot')}</span>
                        </button>
                    </div>
                }
            />

            {/* Loading Skeleton */}
            {loading && bots.length === 0 ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.statsSkeleton}>
                        <div className={styles.skeletonBox} />
                        <div className={styles.skeletonBox} />
                        <div className={styles.skeletonBox} />
                    </div>
                    <div className={styles.botsSkeletonGrid}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className={styles.botCardSkeleton}>
                                <div className={styles.skeletonLine} style={{ width: '40%' }} />
                                <div className={styles.skeletonLine} style={{ width: '70%', height: '22px' }} />
                                <div className={styles.skeletonLine} style={{ width: '100%', height: '50px' }} />
                                <div className={styles.skeletonLine} style={{ width: '90%' }} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : bots.length === 0 ? (
                <MyBotsEmptyState
                    hasAiBotPermission={hasAiBotPermission}
                    hasCustomBotPermission={hasCustomBotPermission}
                    hasLibraryPermission={hasLibraryPermission}
                    isSingleCard={isSingleCard}
                    onNavigate={handleNavigate}
                />
            ) : (
                <div className={styles.dashboardSection}>
                    <MyBotsStats
                        totalCount={bots.length}
                        aiCount={aiCount}
                        manualCount={manualCount}
                    />

                    <MyBotsFilterBar
                        botsCount={bots.length}
                        aiCount={aiCount}
                        manualCount={manualCount}
                        filterCreationType={filterCreationType}
                        setFilterCreationType={setFilterCreationType}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    {/* Bot Cards Grid or No Found State */}
                    {filteredBots.length > 0 ? (
                        <div className={styles.botsGrid}>
                            {filteredBots.map((bot) => (
                                <MyBotCard
                                    key={bot.id}
                                    bot={bot}
                                    onToggleStatus={handleToggleBotStatus}
                                    onRunBacktest={handleRunBacktestBot}
                                    onSelectDetail={setSelectedStrategyDetail}
                                    onSelectDelete={setBotToDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noResultsBox}>
                            <div className={styles.noResultsIcon}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    <line x1="8" y1="11" x2="14" y2="11" />
                                </svg>
                            </div>
                            <h3 className={styles.noResultsTitle}>{t('myBots.noResultsTitle', 'No Matching Strategies Found')}</h3>
                            <p className={styles.noResultsDesc}>
                                {searchQuery
                                    ? <>No trading strategies matched your search &ldquo;<strong>{searchQuery}</strong>&rdquo;{filterCreationType !== 'all' ? ` in ${filterCreationType === 'ai' ? t('myBots.filterAi', 'AI Bots') : t('myBots.filterManual', 'Manual / Custom Bots')}` : ''}.</>
                                    : <>No trading strategies found in &ldquo;<strong>{filterCreationType === 'ai' ? t('myBots.filterAi', 'AI Bots') : t('myBots.filterManual', 'Manual / Custom Bots')}</strong>&rdquo;.</>
                                }
                            </p>
                            <div className={styles.noResultsActions}>
                                <button
                                    type="button"
                                    className={styles.clearSearchBtn}
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilterCreationType('all');
                                    }}
                                >
                                    <span>{t('myBots.resetFilters', 'Reset Filters & Search')}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create Bot Modal Dialog */}
            <CreateBotModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                hasAiBotPermission={hasAiBotPermission}
                hasCustomBotPermission={hasCustomBotPermission}
                isSingleCard={isSingleCard}
                onNavigate={handleNavigate}
            />

            {/* Strategy Detail View Modal */}
            <StrategyDetailModal
                strategy={selectedStrategyDetail}
                onClose={() => setSelectedStrategyDetail(null)}
                onSimulate={handleSimulateEdit}
                onRunBacktest={handleRunBacktestBot}
            />

            {/* Custom Delete Confirmation Modal */}
            <DeleteBotModal
                isOpen={!!botToDelete}
                bot={botToDelete}
                onClose={() => setBotToDelete(null)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
