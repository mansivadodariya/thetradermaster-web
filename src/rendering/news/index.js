'use client';

import CommonSectionHeader from '@/components/CommonSectionHeader';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './news.module.scss';
import Loader from '@/components/loader';
import { useLanguage } from '@/context/LanguageContext';

const DEFAULT_API_URL = 'https://fxnews-b.aistocksagent.com/api/news';

export default function MarketNews() {
    const { t } = useLanguage();
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [excludeNoisy, setExcludeNoisy] = useState(true);
    const [todayOnly, setTodayOnly] = useState(false);

    // Active modal for deep-dive
    const [selectedNews, setSelectedNews] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_FXNEWS_API_URL || DEFAULT_API_URL;

    const fetchNews = useCallback(async (currentOffset = 0, isAppend = false) => {
        try {
            if (isAppend) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const url = new URL(apiUrl);
            url.searchParams.set('limit', '21');
            url.searchParams.set('offset', String(currentOffset));
            url.searchParams.set('exclude_noisy', String(excludeNoisy));
            url.searchParams.set('today_only', String(todayOnly));

            const res = await fetch(url.toString(), {
                headers: {
                    'Accept': '*/*',
                    'ngrok-skip-browser-warning': '1',
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const json = await res.json();
            const items = json.data || [];

            if (isAppend) {
                setNewsItems(prev => [...prev, ...items]);
            } else {
                setNewsItems(items);
            }

            setTotalCount(json.total_count || items.length);
            setHasNext(json.has_next ?? false);
            setOffset(currentOffset);
        } catch (err) {
            console.error('Error fetching market news:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, [apiUrl, excludeNoisy, todayOnly]);

    useEffect(() => {
        fetchNews(0, false);
    }, [fetchNews]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchNews(0, false);
    };

    const handleLoadMore = () => {
        if (hasNext && !loadingMore) {
            fetchNews(offset + 21, true);
        }
    };

    // Client-side filtering by category & search
    const filteredNews = newsItems.filter(item => {
        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchTitle = item.title?.toLowerCase().includes(q);
            const matchDesc = item.description?.toLowerCase().includes(q);
            const matchSource = item.source?.toLowerCase().includes(q);
            const matchPairs = item.affected_forex_pairs?.some(p => p.toLowerCase().includes(q));
            if (!matchTitle && !matchDesc && !matchSource && !matchPairs) return false;
        }

        // Category filter
        if (selectedCategory === 'FOREX') {
            return item.news_category?.includes('forex') || (item.affected_markets?.forex > 0) || (item.affected_forex_pairs && item.affected_forex_pairs.length > 0);
        }
        if (selectedCategory === 'CRYPTO') {
            return item.news_relevance === 'Crypto Focus' || item.news_category?.includes('crypto') || (item.affected_markets?.crypto > 0);
        }
        if (selectedCategory === 'EQUITIES') {
            return (item.affected_markets?.global_equities > 0) || item.news_category?.includes('equities');
        }
        if (selectedCategory === 'HIGH_IMPACT') {
            return (item.impact_score >= 3);
        }

        return true;
    });

    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return '';
        try {
            const diff = Date.now() - new Date(dateStr).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 1) return 'Just now';
            if (mins < 60) return `${mins}m ago`;
            const hours = Math.floor(mins / 60);
            if (hours < 24) return `${hours}h ago`;
            return `${Math.floor(hours / 24)}d ago`;
        } catch {
            return '';
        }
    };

    return (
        <div className={styles.newsContainer}>
            {/* Hero Header */}
            <CommonSectionHeader
                as="h1"
                badge={t('news.liveFeed', 'LIVE MACRO CATALYST FEED')}
                badgeIcon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                        <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
                    </svg>
                }
                title={t('nav.marketNews', 'Market Intelligence & Live Financial News')}
                subtitle={t('news.subtitle', 'Live macro catalyst tracking, multi-asset directional bias & AI scenario modeling.')}
                isCard={true}
                rightAction={
                    <div className={styles.liveIndicator}>
                        <span className={styles.liveDot}></span>
                        <span>LIVE STREAM ({totalCount} CATALYSTS)</span>
                    </div>
                }
            />

            {/* Controls Bar */}
            <div className={styles.controlBar}>
                <div className={styles.topControls}>
                    <div className={styles.searchBox}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder={t('news.searchPlaceholder', 'Search by currency pair, symbol, or macro event (e.g. USD/CAD, Oil, Fed)...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.toggleGroup}>
                        <button
                            type="button"
                            className={`${styles.togglePill} ${excludeNoisy ? styles.activeToggle : ''}`}
                            onClick={() => setExcludeNoisy(!excludeNoisy)}
                        >
                            <span>Exclude Noise: {excludeNoisy ? 'ON' : 'OFF'}</span>
                        </button>

                        <button
                            type="button"
                            className={`${styles.togglePill} ${todayOnly ? styles.activeToggle : ''}`}
                            onClick={() => setTodayOnly(!todayOnly)}
                        >
                            <span>Today Only: {todayOnly ? 'ON' : 'OFF'}</span>
                        </button>

                        <button
                            type="button"
                            className={styles.refreshBtn}
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            <svg className={refreshing ? styles.spinning : ''} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                            </svg>
                            <span>{t('news.refresh', 'Refresh')}</span>
                        </button>
                    </div>
                </div>

                <div className={styles.categoryPills}>
                    {[
                        { id: 'ALL', label: 'All Catalysts' },
                        { id: 'HIGH_IMPACT', label: 'High Impact (Score 3-5)' },
                        { id: 'FOREX', label: 'Forex Markets' },
                        { id: 'CRYPTO', label: 'Digital Assets & Web3' },
                        { id: 'EQUITIES', label: 'Global Equities' },
                    ].map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`${styles.catBtn} ${selectedCategory === cat.id ? styles.activeCat : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* News Grid */}
            {loading ? (
                <div className={styles.loadingState}>
                    <Loader size="lg" />
                    <p>{t('news.loadingFeed', 'Loading real-time institutional intelligence stream...')}</p>
                </div>
            ) : filteredNews.length === 0 ? (
                <div className={styles.emptyState}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <h3>No market events match your filters</h3>
                    <p>{t('news.tryClearing', 'Try clearing search keywords or enabling all categories.')}</p>
                    <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}>
                        Reset Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.newsGrid}>
                        {filteredNews.map((item) => {
                            const impactClass = item.impact_score >= 4
                                ? styles.impactHigh
                                : item.impact_score === 3
                                    ? styles.impactMed
                                    : styles.impactLow;

                            const usdDirection = item.usd_bias?.toLowerCase();

                            return (
                                <article key={item.id} className={styles.newsCard}>
                                    <div>
                                        <div className={styles.cardTopRow}>
                                            <span className={styles.sourceBadge}>{item.source || 'Intelligence Desk'}</span>
                                            <div className={styles.metaRight}>
                                                <span className={styles.timeAgo}>{formatTimeAgo(item.published || item.created_at)}</span>
                                                {item.impact_score && (
                                                    <span className={`${styles.impactBadge} ${impactClass}`}>
                                                        Impact {item.impact_score}/5
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className={styles.cardTitle}>{item.title}</h3>

                                        <p className={styles.cardDesc}>
                                            {item.description ? item.description.replace(/&nbsp;/g, ' ') : (item.impact_summary || '')}
                                        </p>

                                        {/* Tickers & Bias Row */}
                                        <div className={styles.tickersRow}>
                                            {item.affected_forex_pairs?.map(p => (
                                                <span key={p} className={styles.tickerTag}>{p}</span>
                                            ))}
                                            {item.usd_bias && (
                                                <span className={`${styles.biasTag} ${usdDirection === 'bullish' ? styles.bullish : usdDirection === 'bearish' ? styles.bearish : styles.neutral}`}>
                                                    USD: {item.usd_bias}
                                                </span>
                                            )}
                                            {item.market_mode && (
                                                <span className={styles.tickerTag}>{item.market_mode}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <button
                                            type="button"
                                            className={styles.deepDiveBtn}
                                            onClick={() => setSelectedNews(item)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 16v-4M12 8h.01" />
                                            </svg>
                                            <span>{t('news.aiDeepDive', 'AI Deep-Dive')}</span>
                                        </button>

                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.sourceLink}
                                                title={t('news.viewSource', 'View Original Source')}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* Pagination Load More */}
                    <div className={styles.paginationWrap}>
                        {hasNext && (
                            <button
                                type="button"
                                className={styles.loadMoreBtn}
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader size="sm" showLogo={false} />
                                        <span>{t('news.loadingMore', 'Loading More Catalysts...')}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{t('news.loadMore', 'Load More Catalysts')}</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M12 5v14M5 12l7 7 7-7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                        <span className={styles.countText}>
                            Showing {filteredNews.length} of {totalCount} market events
                        </span>
                    </div>
                </>
            )}

            {/* AI Intelligence Deep-Dive Modal */}
            {selectedNews && (
                <div className={styles.modalBackdrop} onClick={() => setSelectedNews(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={() => setSelectedNews(null)}
                        >
                            ✕
                        </button>

                        <div className={styles.modalHeader}>
                            <div className={styles.modalBadgeRow}>
                                <span className={styles.source}>{selectedNews.source}</span>
                                <span className={styles.time}>{formatTimeAgo(selectedNews.published || selectedNews.created_at)}</span>
                                {selectedNews.impact_score && (
                                    <span className={styles.source}>Impact {selectedNews.impact_score}/5</span>
                                )}
                            </div>
                            <h2>{selectedNews.title}</h2>
                        </div>

                        {/* Executive Summary */}
                        {selectedNews.analysis_data?.executive_summary && (
                            <div className={styles.modalSection}>
                                <h4>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    </svg>
                                    <span>AI Executive Macro Breakdown</span>
                                </h4>
                                <p>{selectedNews.analysis_data.executive_summary}</p>
                            </div>
                        )}

                        {/* AI Trade Setups / Suggestions */}
                        {selectedNews.analysis_data?.suggestions && (
                            <div className={styles.modalSection}>
                                <h4>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                    <span>Actionable Asset Setups</span>
                                </h4>

                                <div className={styles.suggestionsGrid}>
                                    {selectedNews.analysis_data.suggestions.buy?.map((s, idx) => (
                                        <div key={`buy-${idx}`} className={`${styles.suggestionCard} ${styles.buy}`}>
                                            <div className={styles.sugHeader}>
                                                <span className={styles.asset}>{s.asset}</span>
                                                <span className={`${styles.direction} ${styles.bullish}`}>BUY / {s.direction}</span>
                                            </div>
                                            <p className={styles.reasoning}>{s.reasoning}</p>
                                        </div>
                                    ))}

                                    {selectedNews.analysis_data.suggestions.sell?.map((s, idx) => (
                                        <div key={`sell-${idx}`} className={`${styles.suggestionCard} ${styles.sell}`}>
                                            <div className={styles.sugHeader}>
                                                <span className={styles.asset}>{s.asset}</span>
                                                <span className={`${styles.direction} ${styles.bearish}`}>SELL / {s.direction}</span>
                                            </div>
                                            <p className={styles.reasoning}>{s.reasoning}</p>
                                        </div>
                                    ))}

                                    {selectedNews.analysis_data.suggestions.watch?.map((s, idx) => (
                                        <div key={`watch-${idx}`} className={`${styles.suggestionCard} ${styles.watch}`}>
                                            <div className={styles.sugHeader}>
                                                <span className={styles.asset}>{s.asset}</span>
                                                <span className={`${styles.direction} ${styles.neutral}`}>WATCH / {s.direction}</span>
                                            </div>
                                            <p className={styles.reasoning}>{s.reasoning}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Scenario Analysis */}
                        {selectedNews.analysis_data?.scenario_analysis && (
                            <div className={styles.modalSection}>
                                <h4>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                    <span>Scenario Modeling & Risk Triggers</span>
                                </h4>

                                <div className={styles.scenariosBox}>
                                    {selectedNews.analysis_data.scenario_analysis.if_event_strengthens && (
                                        <div className={styles.scenarioItem}>
                                            <strong>{t('news.ifStrengthens', '[+] If Event Strengthens:')}</strong>
                                            <span>{selectedNews.analysis_data.scenario_analysis.if_event_strengthens}</span>
                                        </div>
                                    )}
                                    {selectedNews.analysis_data.scenario_analysis.if_event_fades && (
                                        <div className={styles.scenarioItem}>
                                            <strong>{t('news.ifFades', '[-] If Event Fades:')}</strong>
                                            <span>{selectedNews.analysis_data.scenario_analysis.if_event_fades}</span>
                                        </div>
                                    )}
                                    {selectedNews.analysis_data.scenario_analysis.invalidation_trigger && (
                                        <div className={styles.scenarioItem}>
                                            <strong style={{ color: '#F87171' }}>[!] Invalidation Trigger:</strong>
                                            <span>{selectedNews.analysis_data.scenario_analysis.invalidation_trigger}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Fallback Article Summary / Description when analysis_data is absent */}
                        {(!selectedNews.analysis_data ||
                          (!selectedNews.analysis_data.executive_summary &&
                           !selectedNews.analysis_data.suggestions &&
                           !selectedNews.analysis_data.scenario_analysis)) && (
                            <div className={styles.modalSection}>
                                <h4>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                    </svg>
                                    <span>Market Event Summary</span>
                                </h4>
                                <p className={styles.fallbackArticleText}>
                                    {selectedNews.description ? selectedNews.description.replace(/&nbsp;/g, ' ') : (selectedNews.impact_summary || selectedNews.summary || "Full real-time financial market coverage is available directly from the original publisher below.")}
                                </p>
                            </div>
                        )}

                        <div className={styles.modalFooter}>
                            {selectedNews.link && (
                                <a
                                    href={selectedNews.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.externalLinkBtn}
                                >
                                    <span>Read Full Article on {selectedNews.source}</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
