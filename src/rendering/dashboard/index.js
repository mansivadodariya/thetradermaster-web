'use client';
import React, { useEffect, useMemo, useState, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.scss';
import CommonSearch from '@/components/commonSearch';
import { dashboardApi } from '@/lib/api';
import { getStoredUser, getStoredUserId } from '@/lib/authSession';
import Loader from '@/components/loader';
import EcosystemSection from '../home/ecosystemSection';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import DashboardWatchlist from './DashboardWatchlist';
import BrokerCard from '@/components/brokerCard';
import { fetchBrokers } from '@/lib/brokersData';

const CardIcon = '/assets/icons/dashboardCard.svg'
const iconOne = '/assets/icons/IconOne.svg'
const iconTwo = '/assets/icons/IconTwo.svg'
const iconThree = '/assets/icons/IconThree.svg'
const iconFour = '/assets/icons/IconFour.svg'
const ArrowIcon = '/assets/icons/arrow.svg';
const state1 = '/assets/icons/state1.svg';
const state2 = '/assets/icons/state2.svg';
const state3 = '/assets/icons/state3.svg';
const state4 = '/assets/icons/state4.svg';

function getUserNameFromLocalStorage() {
    const parsed = getStoredUser();
    if (!parsed) return 'Trader';
    const name = [parsed.first_name, parsed.last_name].filter(Boolean).join(' ');
    return name || parsed.email || 'Trader';
}

function timeAgo(dateLike) {
    const d = dateLike ? new Date(dateLike) : null;
    if (!d || Number.isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

function cleanDisplayText(raw) {
    if (!raw || typeof raw !== 'string') return '';
    let text = raw;
    // Decode literal unicode escape sequences like \u2014, \u2013, \u2022
    text = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => {
        try {
            return String.fromCharCode(parseInt(code, 16));
        } catch {
            return '';
        }
    });
    // Replace literal escaped newlines or actual newlines followed by bullet/hyphen with bullet separator
    text = text.replace(/(?:\\r\\n|\\n|\\r|\r\n|\n|\r)\s*[-*•]\s*/g, ' • ');
    // Replace remaining newlines with space
    text = text.replace(/\\r\\n|\\n|\\r|\r\n|\n|\r/g, ' ');
    // Remove markdown bold/italic/strikethrough/code/heading markers
    text = text.replace(/[*_`~#]+/g, '');
    // Clean leading hyphen/bullet
    text = text.replace(/^\s*[-*•]\s*/, '');
    // Unescape quotes and slashes
    text = text.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\');
    // Normalize spaces around dashes and bullets
    text = text.replace(/\s*—\s*/g, ' — ');
    text = text.replace(/\s*•\s*/g, ' • ');
    // Normalize multiple spaces
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}

function formatPairCurrency(val, symbol) {
    if (typeof val !== 'number' || isNaN(val)) return '-';
    let symUpper = (symbol || '').toUpperCase().replace("/", "");
    if (symUpper.endsWith("JPY")) return val.toFixed(3);
    if (symUpper.includes("XAU") || symUpper.includes("GOLD") || symUpper.includes("XAG")) return val.toFixed(2);
    if (symUpper.includes("BTC") || symUpper.includes("ETH") || symUpper.includes("SOL")) return val.toFixed(2);
    if (symUpper.length === 6) return val.toFixed(5);
    return val.toFixed(2);
}

function getMockBasePrice(pair) {
    const symUpper = (pair || '').toUpperCase().replace("/", "");
    if (symUpper === "EURUSD") return 1.08340;
    if (symUpper === "GBPUSD") return 1.31260;
    if (symUpper === "XAUUSD" || symUpper === "GOLD") return 2658.40;
    if (symUpper === "USDJPY") return 149.320;
    if (symUpper === "GBPJPY") return 155.254;
    if (symUpper === "EURJPY") return 155.252;
    if (symUpper === "USDCAD") return 1.36500;
    if (symUpper === "BTCUSD") return 62450.12;
    if (symUpper === "ETHUSD") return 2420.80;
    if (symUpper === "SOLUSD") return 142.50;
    if (symUpper === "XRPUSD") return 0.5340;
    if (symUpper === "BNBUSD") return 575.20;
    if (symUpper === "US30") return 42352.70;
    if (symUpper === "NAS100") return 20048.20;
    if (symUpper === "SPX500") return 5751.10;
    if (symUpper === "GER40") return 19120.50;
    if (symUpper === "UK100") return 8280.30;
    if (symUpper === "XAGUSD") return 31.45;
    if (symUpper === "WTIOIL") return 75.40;
    if (symUpper === "BRENTOIL") return 78.90;
    if (symUpper === "NGAS") return 2.85;
    return 1.25000;
}

const SparklineSVG = () => (
    <svg width="100" height="32" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.sparkline}>
        <path d="M2 24C12 24 18 14 28 16C38 18 44 8 54 12C64 16 72 4 82 8C90 11.2 94 3 98 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 24C12 24 18 14 28 16C38 18 44 8 54 12C64 16 72 4 82 8C90 11.2 94 3 98 2V30H2V24Z" fill="url(#sparklineGrad)" opacity="0.25" />
        <defs>
            <linearGradient id="sparklineGrad" x1="50" y1="2" x2="50" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="currentColor" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
        </defs>
    </svg>
);

const EmptyDocIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const TradeSmarterWatermark = () => (
    <div className={styles.watermark}>
        <div className={styles.watermarkArrows}>
            <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                <path d="M10 90 L85 15 M85 15 H45 M85 15 V55" stroke="#00FF88" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
                <path d="M10 65 L60 15 M60 15 H30 M60 15 V45" stroke="#00FF88" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.12" />
            </svg>
        </div>
        <div className={styles.watermarkText}>
            <span>TRADE</span>
            <span>SMARTER</span>
            <span>EVERYDAY</span>
        </div>
    </div>
);

const BrokerSectionIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
    </svg>
);

export default function Dashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [userId, setUserId] = useState('');
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');
    const [name, setName] = useState('');
    const [brokers, setBrokers] = useState([]);
    const [brokersLoading, setBrokersLoading] = useState(true);
    const [hoveredTooltip, setHoveredTooltip] = useState(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        let isMounted = true;
        fetchBrokers().then((data) => {
            if (isMounted) {
                setBrokers(Array.isArray(data) ? data : []);
                setBrokersLoading(false);
            }
        }).catch(() => {
            if (isMounted) setBrokersLoading(false);
        });
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (hoveredTooltip) setHoveredTooltip(null);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hoveredTooltip]);

    const handleCellMouseEnter = (e, label, content) => {
        if (!content || content === '-') return;
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredTooltip({
            label,
            content,
            x: rect.left + rect.width / 2,
            y: rect.top,
            bottom: rect.bottom,
        });
    };

    const handleCellMouseLeave = () => {
        setHoveredTooltip(null);
    };

    useEffect(() => {
        const syncUser = () => {
            setUserId(getStoredUserId());
            setName(getUserNameFromLocalStorage());
            setGreeting(getGreeting());
        };
        syncUser();
        window.addEventListener('user:updated', syncUser);
        return () => window.removeEventListener('user:updated', syncUser);
    }, []);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const [statsRes, recentRes] = await Promise.allSettled([
                    dashboardApi.getStats(userId),
                    dashboardApi.getRecentActivity(userId),
                ]);

                if (!mounted) return;

                const statsPayload =
                    statsRes.status === 'fulfilled' ? (statsRes.value?.data ?? statsRes.value) : null;
                setStats(statsPayload);

                const recentPayload =
                    recentRes.status === 'fulfilled' ? (recentRes.value?.data?.recent_activity ?? recentRes.value) : [];
                setRecentActivity(Array.isArray(recentPayload) ? recentPayload : (recentPayload?.items || []));
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [userId]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('dashboard.goodMorning', 'Good Morning');
        else if (hour < 17) return t('dashboard.goodAfternoon', 'Good Afternoon');
        else if (hour < 21) return t('dashboard.goodEvening', 'Good Evening');
        else return t('dashboard.goodNight', 'Good Night');
    };

    const statsData = [
        {
            id: 1,
            label: t('dashboard.recent', 'Recent Analyses'),
            value: stats?.total_analysis_history ?? 4,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            )
        },
        {
            id: 2,
            label: t('nav.aiChat', 'AI Assistant Sessions'),
            value: stats?.total_chat_history ?? 4,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                </svg>
            )
        },
        {
            id: 3,
            label: t('dashboard.availableCredits', 'Available AI Credits'),
            value: `${stats?.available_credits ?? 440} / 500`,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 1l4 4-4 4" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <path d="M7 23l-4-4 4-4" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
            )
        },
        {
            id: 4,
            label: t('dashboard.credits', 'Total Credits'),
            value: stats?.total_credits ?? 500,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8.01" y2="16" />
                    <line x1="16" y1="16" x2="16.01" y2="16" />
                </svg>
            )
        },
    ];

    const quickActions = [
        {
            title: t('dashboard.snapChart', 'Scan a Chart'),
            tag: 'Vision',
            desc: t('dashboard.snapDesc', 'Upload your chart and get AI-powered analysis with key insights.'),
            cta: t('common.exploreNow', 'Explore Now →'),
            href: '/trade-snap',
            theme: styles.cardBlue,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            )
        },
        {
            title: t('nav.aiStrategy', 'Build a Strategy'),
            tag: 'Strategy',
            desc: t('nav.aiStrategyDesc', 'Create, test and optimize AI-powered trading strategies.'),
            cta: t('common.exploreNow', 'Explore Now →'),
            href: '/ai-strategy',
            theme: styles.cardGreen,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                </svg>
            )
        },
        {
            title: t('dashboard.askAssistant', 'Ask AI Chat'),
            tag: 'Assistant',
            desc: t('dashboard.askDesc', 'Get answers on market trends, trading setups, and more.'),
            cta: t('common.exploreNow', 'Explore Now →'),
            href: '/ai-assistant?tab=chat',
            theme: styles.cardPurple,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <circle cx="8" cy="10" r="1" fill="currentColor" />
                    <circle cx="12" cy="10" r="1" fill="currentColor" />
                    <circle cx="16" cy="10" r="1" fill="currentColor" />
                </svg>
            )
        },
        {
            title: t('nav.pastTradeAnalyzer', 'AI Past Trade Analyzer'),
            tag: 'Analytics',
            desc: t('dashboard.aiTradeAnalysisDesc', 'Upload your broker statement (MT4, MT5, cTrader, CSV) for deep trade analysis.'),
            cta: t('common.exploreNow', 'Explore Now →'),
            href: '/ai-trade-analysis',
            theme: styles.cardOrange,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
            )
        }
    ];

    const recents = useMemo(() => {
        const normalize = (item, index) => {
            const type = item?.type || item?.activity_type || item?.kind || "";
            const normalizedType = String(type).toLowerCase().includes("blog") ? "blog" : "chat";

            let summary = "";
            if (typeof item?.summary === "string") {
                try {
                    const parsed = JSON.parse(item.summary);
                    summary = parsed?.short_response || parsed?.summary || parsed?.response || parsed?.message || item.summary;
                } catch {
                    summary = item.summary
                        .replace('{"short_response":"', "")
                        .replace('{"short_response": "', "")
                        .replace(/"}$/, "")
                        .replace(/\\"/g, '"');
                }
            } else if (item?.summary?.short_response) {
                summary = item.summary.short_response;
            } else if (item?.summary?.summary) {
                summary = item.summary.summary;
            } else if (item?.summary?.response) {
                summary = item.summary.response;
            }

            const rawTitle = item?.title || item?.question || item?.message || "XAU/USD trend analysis";
            const cleanTitle = cleanDisplayText(rawTitle);
            const cleanSummary = cleanDisplayText(summary);

            const defaultMarkets = ['XAU/USD', 'XAU/USD', 'EUR/USD', 'GBP/USD'];
            const defaultResults = ['Bullish', 'Bullish', 'Neutral', 'Bearish'];

            return {
                type: normalizedType,
                id: item?.id || item?.activity_id || item?.chat_id || item?.created_at || index,
                title: cleanTitle || "XAU/USD trend analysis",
                summary: cleanSummary || "Price is in a consolidation phase with breakout potential...",
                pair: item?.pair || item?.symbol || defaultMarkets[index % defaultMarkets.length],
                result: item?.result || defaultResults[index % defaultResults.length],
                created_at: item?.created_at || item?.createdAt || item?.time || new Date().toISOString(),
            };
        };

        const list = Array.isArray(recentActivity) && recentActivity.length > 0
            ? recentActivity.map(normalize)
            : [
                { id: 1, type: 'chat', title: 'XAU/USD should I buy or sell in gold', summary: 'The analysis suggests a bullish trend with key support at 2,640 and resistance...', pair: 'XAU/USD', result: 'Bullish', created_at: '2026-10-05T17:36:00Z' },
                { id: 2, type: 'chat', title: 'XAU/USD should I buy or sell', summary: 'Strong momentum observed with potential for further upside...', pair: 'XAU/USD', result: 'Bullish', created_at: '2026-10-05T17:15:00Z' },
                { id: 3, type: 'chat', title: 'EUR/USD trend analysis', summary: 'Price is in a consolidation phase with breakout potential...', pair: 'EUR/USD', result: 'Neutral', created_at: '2026-10-05T16:32:00Z' },
                { id: 4, type: 'chat', title: 'GBP/USD key levels', summary: 'Key support at 1.3050 and resistance at 1.3180. Watch for breakout...', pair: 'GBP/USD', result: 'Bearish', created_at: '2026-10-05T15:18:00Z' },
            ];

        return list
            .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
            .slice(0, 8);
    }, [recentActivity]);

    const openRecent = (item) => {
        const params = new URLSearchParams();
        params.set('tab', item.type);
        params.set('open', String(item.id));
        router.push(`/ai-assistant?${params.toString()}`);
    };

    return (
        <div className={styles.dashboard}>
            {/* Top Hero Banner */}
            <section className={styles.heroBanner}>
                <img
                    src={theme === 'light' ? '/assets/images/dashboard-light-bg.webp' : '/assets/images/dashboard-bg.webp'}
                    alt="Dashboard Banner"
                    className={styles.heroBgImg}
                />
                <div className={styles.heroContent}>
                    <div className={styles.kicker}>
                        {t('dashboard.bannerKicker', 'Trade Smarter With AI-Powered Forex Intelligence')}
                    </div>
                    <h1>
                        {greeting}, <span className={styles.neonText}>{name}</span>
                    </h1>
                    <p className={styles.tagline}>
                        Here's what's happening with your trading workspace today.
                    </p>
                </div>
                <div className={styles.bannerTaglineRight}>
                    <span>DISCIPLINE</span>
                    <span>ANALYSIS</span>
                    <span>BETTER TRADES</span>
                    <div className={styles.accentLine} />
                </div>
            </section>

            {/* 4 Stat Cards Row */}
            {/* <section className={styles.statsGrid}>
                {statsData.map((item) => (
                    <div className={styles.statCard} key={item.id}>
                        <div className={styles.statLeft}>
                            <div className={styles.statIconBox}>
                                {item.icon}
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>{item.label}</span>
                                <span className={styles.statValue}>{item.value}</span>
                            </div>
                        </div>
                        <SparklineSVG />
                    </div>
                ))}
            </section> */}

            {/* Main 2-Column Dashboard Grid Layout */}
            <div className={styles.dashboardBodyGrid}>
                {/* Left Column: Quick Actions & Recent Activity */}
                <div className={styles.dashboardLeftCol}>
                    {/* Quick Actions Grid */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeaderRow}>
                            <h2 className={styles.sectionTitle}>{t('dashboard.quickActions', 'Quick Actions')}</h2>
                        </div>
                        <div className={styles.quickGrid}>
                            {quickActions.map((qa) => (
                                <div key={qa.title} className={`${styles.qaCard} ${qa.theme}`}>
                                    <div className={styles.qaCardTopHeader}>
                                        <div className={styles.qaIconBox}>
                                            {qa.icon}
                                        </div>
                                        {qa.tag && (
                                            <span className={styles.qaTagBadge}>
                                                {qa.tag}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.qaBody}>
                                        <h3>{qa.title}</h3>
                                        <p>{qa.desc}</p>
                                    </div>
                                    <Link href={qa.href} className={styles.qaCtaBtn}>
                                        <span>{qa.cta}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity Section */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t('dashboard.recent', 'Recent')}</h2>
                        <div className={styles.recentBox}>
                            {recents.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIconBox}>
                                        <EmptyDocIcon />
                                    </div>
                                    <h3>{t('dashboard.noRecentTitle', 'No recent activity found')}</h3>
                                    <p>{t('dashboard.noRecentDesc', 'Your trade activity, AI chats and analysis will appear here.')}</p>
                                    <TradeSmarterWatermark />
                                </div>
                            ) : (
                                <div className={styles.tableWrapper}>
                                    <table className={styles.recentTable}>
                                        <colgroup>
                                            <col style={{ width: '18%' }} />
                                            <col style={{ width: '26%' }} />
                                            <col style={{ width: '38%' }} />
                                            <col style={{ width: '9%' }} />
                                            <col style={{ width: '9%' }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>{t('dashboard.time', 'Time')}</th>
                                                <th>{t('dashboard.title', 'Title')}</th>
                                                <th>{t('dashboard.summary', 'Summary')}</th>
                                                <th>{t('dashboard.market', 'Market')}</th>
                                                <th>{t('dashboard.result', 'Result')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recents.map((item) => (
                                                <tr
                                                    key={`${item.type}-${item.id}`}
                                                    onClick={() => {
                                                        setHoveredTooltip(null);
                                                        openRecent(item);
                                                    }}
                                                    className={styles.tableRow}
                                                >
                                                    <td className={styles.recentTime}>{timeAgo(item.created_at)}</td>
                                                    <td
                                                        className={styles.recentTitle}
                                                        onMouseEnter={(e) => handleCellMouseEnter(e, t('dashboard.title', 'Title'), item.title)}
                                                        onMouseLeave={handleCellMouseLeave}
                                                        title={item.title}
                                                    >
                                                        <span className={styles.cellText}>{item.title}</span>
                                                    </td>
                                                    <td
                                                        className={styles.recentSummary}
                                                        onMouseEnter={(e) => handleCellMouseEnter(e, t('dashboard.summary', 'Summary'), item.summary)}
                                                        onMouseLeave={handleCellMouseLeave}
                                                        title={item.summary}
                                                    >
                                                        <span className={styles.cellText}>{item.summary || '-'}</span>
                                                    </td>
                                                    <td className={styles.recentTime}>{item.pair}</td>
                                                    <td>
                                                        <span className={`${styles.resultBadge} ${item.result === 'Bullish' ? styles.badgeBullish : item.result === 'Bearish' ? styles.badgeBearish : styles.badgeNeutral}`}>
                                                            {item.result}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Watchlist & Trading Quote */}
                <div className={styles.dashboardRightCol}>
                    {/* Watchlist Section */}
                    <section className={styles.watchlistSection}>
                        <div className={styles.sectionHeaderRow}>
                            <div className={styles.sectionTitleWithBadge}>
                                <h2 className={styles.sectionTitle}>{t('dashboard.watchlist', 'Watchlist')}</h2>
                                <span className={styles.watchlistCountBadge}>6 pairs</span>
                            </div>
                            <Link href="/ai-strategy/live" className={styles.viewAllLink}>
                                {t('dashboard.liveFeed', 'Live Feed')} &rarr;
                            </Link>
                        </div>
                        <DashboardWatchlist />
                    </section>

                    {/* Associated Brokers Section */}
                    <section className={styles.brokersSection}>
                        <div className={styles.sectionHeaderRow}>
                            <div className={styles.sectionTitleWithBadge}>
                                <div className={styles.brokerSectionIcon}>
                                    <BrokerSectionIcon />
                                </div>
                                <h2 className={styles.sectionTitle}>{t('dashboard.associatedBrokers', 'Associated Brokers')}</h2>
                            </div>
                            <Link href="/broker" className={styles.viewAllLink}>
                                {t('dashboard.viewAllBrokers', 'View all brokers')} &rarr;
                            </Link>
                        </div>

                        <div className={styles.brokerCardWrapper}>
                            {brokersLoading ? (
                                <div className={styles.brokerCardSkeleton}>
                                    <div className={styles.skeletonBanner} />
                                    <div className={styles.skeletonBody}>
                                        <div className={styles.skeletonLine} />
                                        <div className={styles.skeletonLineShort} />
                                    </div>
                                </div>
                            ) : brokers.length > 0 ? (
                                <BrokerCard
                                    broker={brokers.find((b) => b.id === 'avatrade') || brokers[0]}
                                    detailHref="/broker"
                                    hideHighlights={true}
                                    hideVisitSite={true}
                                />
                            ) : (
                                <div className={styles.emptyBrokersCard}>
                                    <p>{t('dashboard.noBrokers', 'No broker connected yet.')}</p>
                                    <Link href="/broker" className={styles.connectBrokerBtn}>
                                        {t('dashboard.connectBroker', 'Connect Broker')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {hasMounted && hoveredTooltip && typeof document !== 'undefined' && createPortal(
                <div
                    className={styles.cellTooltipPortal}
                    style={{
                        position: 'fixed',
                        top: hoveredTooltip.y > 140 ? `${hoveredTooltip.y - 8}px` : `${hoveredTooltip.bottom + 8}px`,
                        left: `${Math.max(16, Math.min(hoveredTooltip.x, (typeof window !== 'undefined' ? window.innerWidth : 1000) - 200))}px`,
                        transform: hoveredTooltip.y > 140 ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
                        zIndex: 99999,
                        pointerEvents: 'none',
                    }}
                >
                    <div className={styles.cellTooltipHeader}>{hoveredTooltip.label}</div>
                    <div className={styles.cellTooltipContent}>{hoveredTooltip.content}</div>
                </div>,
                document.body
            )}
        </div>
    );
}

