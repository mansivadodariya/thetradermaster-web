'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
import { getBidiProps } from '@/lib/bidi';

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

function formatSummary(text) {
    if (!text || typeof text !== 'string') return '';
    try {
        let decoded = text.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
            return String.fromCharCode(parseInt(grp, 16));
        });

        decoded = decoded.replace(/\\n/g, '\n');
        let formatted = decoded.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        if (formatted.startsWith('- ')) {
            formatted = '• ' + formatted.substring(2);
        } else if (formatted.startsWith('-\t')) {
            formatted = '• ' + formatted.substring(2);
        }

        formatted = formatted.replace(/\n-\s*/g, '<br />• ');
        formatted = formatted.replace(/\n/g, '<br />');

        return formatted;
    } catch (e) {
        console.error("Error formatting summary:", e);
        return text;
    }
}

const SparklineSVG = () => (
    <svg width="100" height="32" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <path d="M2 24C12 24 18 14 28 16C38 18 44 8 54 12C64 16 72 4 82 8C90 11.2 94 3 98 2" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 24C12 24 18 14 28 16C38 18 44 8 54 12C64 16 72 4 82 8C90 11.2 94 3 98 2V30H2V24Z" fill="url(#sparklineGrad)" opacity="0.15" />
        <defs>
            <linearGradient id="sparklineGrad" x1="50" y1="2" x2="50" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FF88" />
                <stop offset="1" stopColor="#00FF88" stopOpacity="0" />
            </linearGradient>
        </defs>
    </svg>
);

const BullBearGraphic = () => (
    <div className={styles.bannerGraphic}>
        <div className={styles.bullBearContainer}>
            <svg width="220" height="100" viewBox="0 0 220 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Bull & Bear silhouettes / chart glow */}
                <path d="M10 70 Q 40 40, 70 55 T 130 30 T 190 45 T 210 20" stroke="#00FF88" strokeWidth="2" fill="none" opacity="0.8" />
                <path d="M10 70 Q 40 40, 70 55 T 130 30 T 190 45 T 210 20 L 210 95 L 10 95 Z" fill="url(#bullGrad)" opacity="0.12" />
                <circle cx="210" cy="20" r="4" fill="#00FF88" />
                
                {/* Bull outline */}
                <path d="M40 60 C 45 45, 60 40, 75 48 C 85 52, 95 42, 105 50 C 115 58, 110 70, 95 72 C 80 74, 65 72, 40 60 Z" stroke="#00FF88" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
                
                {/* Bear outline */}
                <path d="M120 55 C 130 42, 150 42, 160 52 C 170 60, 180 50, 190 62 C 195 72, 180 75, 165 74 C 150 72, 135 70, 120 55 Z" stroke="#00CC6A" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />

                <defs>
                    <linearGradient id="bullGrad" x1="110" y1="20" x2="110" y2="95" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FF88" />
                        <stop offset="1" stopColor="#00FF88" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <div className={styles.bannerTagline}>
            <span>DISCIPLINE</span>
            <span>ANALYSIS</span>
            <span>BETTER TRADES</span>
        </div>
    </div>
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

export default function Dashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [userId, setUserId] = useState('');
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');
    const [name, setName] = useState('');

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
            label: t('dashboard.recent', 'Recent'),
            value: stats?.total_analysis_history ?? 0,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            )
        },
        {
            id: 2,
            label: t('nav.aiChat', 'AI Chat'),
            value: stats?.total_chat_history ?? 0,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                </svg>
            )
        },
        {
            id: 3,
            label: t('dashboard.availableCredits', 'Available AI Credits'),
            value: stats?.available_credits ?? 0,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 1l4 4-4 4" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <path d="M7 23l-4-4 4-4" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
            )
        },
        {
            id: 4,
            label: t('dashboard.credits', 'credits'),
            value: stats?.total_credits ?? 0,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            title: t('dashboard.snapChart', 'Upload Trade Screenshot'),
            desc: t('dashboard.snapDesc', 'Drag and drop your chart here or click to browse'),
            cta: t('common.exploreNow', 'Explore Now'),
            href: '/trade-snap',
            theme: styles.cardBlue,
            graphic: (
                <div className={styles.qaIconBox}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </div>
            )
        },
        {
            title: t('nav.aiStrategy', 'AI Strategy'),
            desc: t('nav.aiStrategyDesc', 'Build, test and optimize AI-powered trading strategies.'),
            cta: t('common.exploreNow', 'Explore Now'),
            href: '/ai-strategy',
            theme: styles.cardGreen,
            graphic: (
                <div className={styles.qaIconBox}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                    </svg>
                </div>
            )
        },
        {
            title: t('dashboard.askAssistant', 'Ask AI Chat'),
            desc: t('dashboard.askDesc', 'Ask questions about currency pairs, technical setups, economic news, or risk management.'),
            cta: t('common.exploreNow', 'Explore Now'),
            href: '/ai-assistant?tab=chat',
            theme: styles.cardPurple,
            graphic: (
                <div className={styles.qaIconBox}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <circle cx="8" cy="10" r="1" fill="currentColor" />
                        <circle cx="12" cy="10" r="1" fill="currentColor" />
                        <circle cx="16" cy="10" r="1" fill="currentColor" />
                    </svg>
                </div>
            )
        },
        {
            title: t('nav.aiTradeAnalysis', 'AI Past Trade Analyzer'),
            desc: t('dashboard.aiTradeAnalysisDesc', 'Upload your broker statement (MT4, MT5, cTrader, CSV) to reveal execution leaks, win-rate edge, and psychological biases.'),
            cta: t('common.exploreNow', 'Explore Now'),
            href: '/ai-trade-analysis',
            theme: styles.cardOrange,
            graphic: (
                <div className={styles.qaIconBox}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                </div>
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
                    summary = parsed?.short_response || "";
                } catch {
                    summary = item.summary
                        .replace('{"short_response":"', "")
                        .replace('{"short_response": "', "")
                        .replace(/"}$/, "")
                        .replace(/\\"/g, '"');
                }
            } else if (item?.summary?.short_response) {
                summary = item.summary.short_response;
            }

            return {
                type: normalizedType,
                id: item?.id || item?.activity_id || item?.chat_id || item?.created_at || index,
                title: item?.title || item?.question || item?.message || "Recent item",
                summary,
                pair: item?.pair || item?.symbol || "",
                created_at: item?.created_at || item?.createdAt || item?.time || "",
            };
        };

        return (Array.isArray(recentActivity) ? recentActivity : [])
            .map(normalize)
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
                <Image src="/assets/images/dashboard-bg.webp" alt="Dashboard Banner" fill priority fetchPriority="high" sizes="100vw" quality={85} className={styles.heroBgImg} />
                <div className={styles.heroContent}>
                    <div className={styles.kicker}>
                        {t('dashboard.bannerKicker', 'Trade Smarter With AI-Powered Forex Intelligence')}
                    </div>
                    <h1>
                        {greeting}, <span className={styles.neonText}>{name}</span>
                    </h1>
                    <p className={styles.tagline}>
                        Analyze &bull; Strategize &bull; Trade &bull; Grow
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
            <section className={styles.statsGrid}>
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
            </section>

            {/* Quick Actions Grid */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('dashboard.quickActions', 'Quick Actions')}</h2>
                <div className={styles.quickGrid}>
                    {quickActions.map((qa) => (
                        <div key={qa.title} className={`${styles.qaCard} ${qa.theme}`}>
                            <div className={styles.qaHeaderGraphic}>
                                {qa.graphic}
                            </div>
                            <div className={styles.qaBody}>
                                <h3>{qa.title}</h3>
                                <p>{qa.desc}</p>
                            </div>
                            <Link href={qa.href} className={styles.qaCtaBtn}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="7" y1="17" x2="17" y2="7" />
                                    <polyline points="7 7 17 7 17 17" />
                                </svg>
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
                                <thead>
                                    <tr>
                                        <th>{t('dashboard.time', 'Time')}</th>
                                        <th>{t('dashboard.title', 'Title')}</th>
                                        <th>{t('dashboard.summary', 'Summary')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recents.map((item) => (
                                        <tr
                                            key={`${item.type}-${item.id}`}
                                            onClick={() => openRecent(item)}
                                            className={styles.tableRow}
                                        >
                                            <td className={styles.recentTime}>{timeAgo(item.created_at)}</td>
                                            <td className={styles.recentTitle}>{item.title}</td>
                                            <td className={styles.recentSummary}>{item.summary || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

