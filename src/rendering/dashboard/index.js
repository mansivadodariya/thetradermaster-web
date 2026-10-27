'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.scss';
import { dashboardApi } from '@/lib/api';
import { CREDITS_UPDATED_EVENT } from '@/lib/credits';
import { getStoredUserId } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';
import {
    getUserNameFromLocalStorage,
    extractCleanText,
    exportDashboardPdf
} from './utils/dashboardHelpers';
import DashboardHeroSection from './components/DashboardHeroSection';
import DashboardStatsCards from './components/DashboardStatsCards';
import DashboardMarketOverview from './components/DashboardMarketOverview';
import DashboardRecentActivities from './components/DashboardRecentActivities';
import DashboardToolsGrid from './components/DashboardToolsGrid';
import DashboardFeaturedBrokers from './components/DashboardFeaturedBrokers';

export default function Dashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [userId, setUserId] = useState('');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');
    const [name, setName] = useState('');
    const [activityFilter, setActivityFilter] = useState('all');
    const [chartTimeframe, setChartTimeframe] = useState('7D');
    const [activeHoverPoint, setActiveHoverPoint] = useState(null);

    const getGreeting = useCallback(() => {
        return t('dashboard.hello', 'Hello');
    }, [t]);

    useEffect(() => {
        const syncUser = () => {
            setUserId(getStoredUserId());
            setName(getUserNameFromLocalStorage());
            setGreeting(getGreeting());
        };
        syncUser();
        window.addEventListener('user:updated', syncUser);
        return () => window.removeEventListener('user:updated', syncUser);
    }, [getGreeting]);

    const isInitialMount = React.useRef(true);

    // Single unified API fetch for user dashboard
    const fetchDashboardData = useCallback(async (uid, tf = '7D', isInitial = false) => {
        if (!uid) {
            setLoading(false);
            return;
        }
        if (isInitial) {
            setLoading(true);
        }
        try {
            const res = await dashboardApi.getStats(uid, tf);
            const payload = res?.data ?? res ?? null;
            if (payload) {
                setStats((prev) => {
                    if (!prev) return payload;
                    return {
                        ...prev,
                        ...payload,
                        // Side credit numbers & lifetime history counts must stay constant across graph timeframe changes
                        available_credits: payload.available_credits ?? prev.available_credits,
                        total_credits: payload.total_credits ?? prev.total_credits,
                        total_analysis_history: prev.total_analysis_history ?? payload.total_analysis_history,
                        total_chat_history: prev.total_chat_history ?? payload.total_chat_history,
                        daily_usage: payload.daily_usage ?? prev.daily_usage,
                        total_credits_used: payload.total_credits_used ?? prev.total_credits_used,
                        wallet: payload.wallet ?? prev.wallet,
                    };
                });
            }
        } catch (err) {
            console.warn('Dashboard stats fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!userId) return;
        const isFirst = isInitialMount.current;
        if (isFirst) {
            isInitialMount.current = false;
        }
        fetchDashboardData(userId, chartTimeframe, isFirst);
    }, [userId, chartTimeframe, fetchDashboardData]);

    // Live update when credits are updated anywhere across the app
    useEffect(() => {
        if (!userId) return;
        const refetchStats = (e) => {
            if (e?.detail?.available_credits !== undefined) {
                setStats(prev => prev ? { ...prev, available_credits: e.detail.available_credits } : prev);
            }
            fetchDashboardData(userId, chartTimeframe, false);
        };
        window.addEventListener(CREDITS_UPDATED_EVENT, refetchStats);
        return () => window.removeEventListener(CREDITS_UPDATED_EVENT, refetchStats);
    }, [userId, chartTimeframe, fetchDashboardData]);

    const handleExportPdf = () => {
        exportDashboardPdf({ name, stats });
    };

    // Normalized Recent Activity from API response
    const recents = useMemo(() => {
        const rawList = stats?.recent_activity || [];
        if (!Array.isArray(rawList)) return [];

        const normalized = rawList.map((item, index) => {
            const rawType = String(item?.type || item?.activity_type || 'analysis').toLowerCase();
            const normalizedType = (rawType.includes('chat') || rawType.includes('assistant')) ? 'chat' : 'analysis';

            const rawSummary = item?.summary || item?.description || item?.response || '';
            const summary = extractCleanText(rawSummary);
            const rawTitle = item?.title || item?.pair || item?.symbol || 'Recent Item';
            const title = extractCleanText(rawTitle);

            return {
                type: normalizedType,
                id: item?.id || item?.activity_id || index,
                title: typeof title === 'string' && title.length > 0 ? title : 'Recent Item',
                summary,
                description: item?.description || summary,
                signal: item?.signal || item?.action || null,
                timeframe: item?.timeframe || '',
                pair: item?.pair || item?.symbol || '',
                created_at: item?.created_at || item?.createdAt || '',
            };
        });

        if (activityFilter === 'chat') {
            return normalized.filter(i => i.type === 'chat').slice(0, 5);
        }
        if (activityFilter === 'analysis' || activityFilter === 'blog') {
            return normalized.filter(i => i.type === 'analysis').slice(0, 5);
        }
        return normalized.slice(0, 5);
    }, [stats?.recent_activity, activityFilter]);

    const openRecent = (item) => {
        if (item.type === 'analysis') {
            router.push('/chart-scanner');
        } else {
            const params = new URLSearchParams();
            params.set('tab', 'chat');
            if (item.id) params.set('open', String(item.id));
            if (item.pair) params.set('pair', String(item.pair));
            router.push(`/market-assistant?${params.toString()}`);
        }
    };

    // Daily Credit Consumption Chart spline points calculation
    const dailyCreditChartData = useMemo(() => {
        let rawPoints = [];

        // 1. Primary: Use daily_usage array from backend API response
        if (Array.isArray(stats?.daily_usage) && stats.daily_usage.length > 0) {
            rawPoints = stats.daily_usage.map((item, idx) => {
                const creditsVal = Number(item?.credits_used ?? item?.credits ?? 0);
                const isToday = item?.label === 'Today' || item?.is_today === true || idx === stats.daily_usage.length - 1;
                return {
                    dateFormatted: item?.label || item?.date || `Day ${idx + 1}`,
                    dateKey: item?.date || `day-${idx}`,
                    credits: creditsVal,
                    isToday,
                    idx,
                };
            });
        } else {
            // 2. Fallback: Generate timeframe-based baseline dates
            const today = new Date();
            const numDays = chartTimeframe === '90D' ? 90 : chartTimeframe === '30D' ? 30 : 7;
            for (let i = numDays - 1; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dayNum = d.getDate();
                const monthShort = d.toLocaleString('en-US', { month: 'short' });
                const dateFormatted = i === 0 ? t('dashboard.today', 'Today') : `${dayNum} ${monthShort}`;
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');

                rawPoints.push({
                    dateFormatted,
                    dateKey: `${year}-${month}-${day}`,
                    credits: 0,
                    isToday: i === 0,
                    idx: numDays - 1 - i,
                });
            }
        }

        const maxVal = Math.max(...rawPoints.map((p) => p.credits), 10);
        const totalPoints = rawPoints.length;

        const points = rawPoints.map((p, idx) => {
            const ratio = totalPoints > 1 ? idx / (totalPoints - 1) : 0;
            const x = 50 + ratio * 900; // 50 to 950 across viewBox 1000
            const xPercent = ratio * 90 + 5; // 5% to 95%
            const y = 145 - (p.credits / maxVal) * 110; // 35 to 145 in viewBox 170
            const yPercent = (y / 170) * 100;
            return {
                ...p,
                x,
                y,
                xPercent,
                yPercent
            };
        });

        let pathLine = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cx = (curr.x + next.x) / 2;
            pathLine += ` C ${cx} ${curr.y}, ${cx} ${next.y}, ${next.x} ${next.y}`;
        }

        const pathArea = `${pathLine} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`;
        const totalUsed = stats?.total_credits_used ?? points.reduce((sum, p) => sum + p.credits, 0);

        // Compute evenly distributed labels for x-axis so they don't crowd
        const labelStep = totalPoints > 14 ? Math.ceil(totalPoints / 6) : 1;
        const labels = points.filter((_, idx) => idx % labelStep === 0 || idx === totalPoints - 1);

        // For data point markers on 30D/90D, display fewer markers so they don't overlap densely
        const displayStep = totalPoints > 35 ? Math.ceil(totalPoints / 25) : 1;
        const displayPoints = points.filter((_, idx) => idx % displayStep === 0 || idx === totalPoints - 1);

        return {
            points,
            displayPoints,
            labels,
            pathLine,
            pathArea,
            totalUsed
        };
    }, [stats?.daily_usage, stats?.total_credits_used, chartTimeframe, t]);

    return (
        <div className={styles.modernDashboard}>
            {/* 1. Holographic Hero Terminal & Daily Stats Side Card */}
            <div className={styles.topHeroRowGrid}>
                <DashboardHeroSection
                    greeting={greeting}
                    name={name}
                    dailyCreditChartData={dailyCreditChartData}
                    chartTimeframe={chartTimeframe}
                    setChartTimeframe={setChartTimeframe}
                    activeHoverPoint={activeHoverPoint}
                    setActiveHoverPoint={setActiveHoverPoint}
                />

                <DashboardStatsCards
                    loading={loading}
                    stats={stats}
                    totalAccountCredits={stats?.total_credits ?? 10002}
                    handleExportPdf={handleExportPdf}
                    router={router}
                />
            </div>

            {/* Featured Brokers Row — Immediately visible without scrolling */}
            <DashboardFeaturedBrokers />

            {/* 2. Full-Width Row: Quick Actions Hub (All cards in one row) */}
            <div className={styles.quickActionsRowFull}>
                <DashboardToolsGrid />
            </div>

            {/* 3. Split Row: Market Overview & Recent Activity Feed side by side */}
            <div className={styles.splitMarketFeedGrid}>
                <DashboardMarketOverview
                    initialItems={stats?.market_overview}
                    userId={userId}
                />

                <DashboardRecentActivities
                    loading={loading}
                    recents={recents}
                    activityFilter={activityFilter}
                    setActivityFilter={setActivityFilter}
                    openRecent={openRecent}
                />
            </div>
        </div>
    );
}
