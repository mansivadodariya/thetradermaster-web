'use client';

import React, { useState, useMemo } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import { useLanguage } from '@/context/LanguageContext';

export const TrashBinIcon = ({ size = 15, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

export const ClockHistoryIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export const CloseDrawerIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export const PlusMiniIcon = ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export const SearchMiniIcon = ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (_) {
        return dateStr;
    }
};

export default function ChatHistoryDrawer({
    isOpen,
    onClose,
    historyList = [],
    loading = false,
    currentSessionId = null,
    onSelectSession,
    onDeleteSession,
    onNewChat
}) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredList = useMemo(() => {
        if (!searchQuery.trim()) return historyList;
        const q = searchQuery.toLowerCase().trim();
        return historyList.filter((item) => {
            const title = (item.title || item.name || item.session_id || '').toLowerCase();
            return title.includes(q);
        });
    }, [historyList, searchQuery]);

    if (!isOpen) return null;

    return (
        <div className={styles.historyDrawerOverlay} onClick={onClose}>
            <div
                className={styles.historyDrawerContent}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.historyDrawerHeader}>
                    <div className={styles.historyHeaderTitleWrap}>
                        <ClockHistoryIcon size={18} color="#18C98B" />
                        <span className={styles.historyDrawerTitle}>
                            {t('strategyStudio.chatHistory', 'Chat History')}
                        </span>
                        {historyList.length > 0 && (
                            <span className={styles.historyCountBadge}>
                                {historyList.length}
                            </span>
                        )}
                    </div>
                    <div className={styles.historyHeaderActions}>
                        <button
                            type="button"
                            className={styles.historyNewChatBtn}
                            onClick={() => {
                                onNewChat();
                                onClose();
                            }}
                            title="Start New Chat"
                        >
                            <PlusMiniIcon size={13} />
                            <span>{t('strategyStudio.newChat', 'New Chat')}</span>
                        </button>
                        <button
                            type="button"
                            className={styles.historyCloseBtn}
                            onClick={onClose}
                            title="Close"
                        >
                            <CloseDrawerIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {historyList.length > 3 && (
                    <div className={styles.historySearchWrapper}>
                        <SearchMiniIcon size={14} color="#64748B" />
                        <input
                            type="text"
                            className={styles.historySearchInput}
                            placeholder={t('strategyStudio.searchHistory', 'Search chats...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className={styles.clearSearchBtn}
                                onClick={() => setSearchQuery('')}
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}

                {/* List Body */}
                <div className={styles.historyDrawerBody}>
                    {loading ? (
                        <div className={styles.historyLoadingState}>
                            <div className={styles.historySkeletonItem} />
                            <div className={styles.historySkeletonItem} />
                            <div className={styles.historySkeletonItem} />
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className={styles.historyEmptyState}>
                            <div className={styles.historyEmptyIconWrap}>
                                <ClockHistoryIcon size={28} color="#64748B" />
                            </div>
                            <div className={styles.historyEmptyTitle}>
                                {searchQuery
                                    ? t('strategyStudio.noSearchResults', 'No chats matched your search')
                                    : t('strategyStudio.noHistory', 'No previous chats found')}
                            </div>
                            <p className={styles.historyEmptySubtitle}>
                                {t('strategyStudio.noHistoryDesc', 'Your strategy conversations and models will appear here.')}
                            </p>
                            <button
                                type="button"
                                className={styles.historyEmptyStartBtn}
                                onClick={() => {
                                    onNewChat();
                                    onClose();
                                }}
                            >
                                <PlusMiniIcon size={14} />
                                <span>{t('strategyStudio.startChat', 'Start a New Chat')}</span>
                            </button>
                        </div>
                    ) : (
                        <div className={styles.historySessionList}>
                            {filteredList.map((item) => {
                                const sessionId = item.session_id || item.id;
                                const isActive = currentSessionId && currentSessionId === sessionId;
                                const title = item.title || item.name || 'Strategy Conversation';
                                const timeStr = formatTimestamp(item.updated_at || item.created_at);

                                return (
                                    <div
                                        key={sessionId || Math.random()}
                                        className={`${styles.historySessionCard} ${isActive ? styles.historyCardActive : ''}`}
                                        onClick={() => onSelectSession(sessionId)}
                                    >
                                        <div className={styles.historyCardMain}>
                                            <div className={styles.historyCardTitleRow}>
                                                <span className={styles.historyCardTitle}>{title}</span>
                                            </div>
                                            {timeStr && (
                                                <div className={styles.historyCardTime}>{timeStr}</div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.historyDeleteBtn}
                                            onClick={(e) => onDeleteSession(sessionId, e)}
                                            title={t('strategyStudio.deleteChat', 'Delete chat')}
                                        >
                                            <TrashBinIcon size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
