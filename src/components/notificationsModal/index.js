'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
    fetchUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    executeNotificationRedirect,
    getNotificationRedirectUrl
} from '@/services/notificationService';
import { getStoredUserId } from '@/lib/authSession';
import Loader from '@/components/loader';
import styles from './notificationsModal.module.scss';

export default function NotificationsModal({ isOpen, onClose, userId, onUnreadCountChanged }) {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('unread'); // 'unread' | 'read'
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);
    const [dismissingIds, setDismissingIds] = useState(new Set());

    const loadNotifications = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const { data } = await fetchUserNotifications(userId, {
                readStatus: activeTab,
                limit: 100
            });
            setNotifications(data || []);
        } catch (err) {
            console.warn('Failed to load notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [userId, activeTab]);

    useEffect(() => {
        if (isOpen && userId) {
            loadNotifications();
        }
    }, [isOpen, userId, loadNotifications]);

    useEffect(() => {
        const onNotifUpdated = () => {
            if (isOpen && userId) {
                loadNotifications();
            }
        };
        window.addEventListener('notification:updated', onNotifUpdated);
        return () => window.removeEventListener('notification:updated', onNotifUpdated);
    }, [isOpen, userId, loadNotifications]);

    // Dynamically derive only the categories that actually exist in notifications
    const dynamicCategories = useMemo(() => {
        const catMap = new Map();
        notifications.forEach((item) => {
            const raw = item.category || item.event_type;
            if (!raw) return;
            const normalized = String(raw).toLowerCase().trim();
            catMap.set(normalized, (catMap.get(normalized) || 0) + 1);
        });

        const list = [
            { id: 'all', label: t('notifications.all', 'All'), count: notifications.length }
        ];

        catMap.forEach((count, catId) => {
            const label = catId
                .replace(/[_-]+/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());
            list.push({ id: catId, label, count });
        });

        return list;
    }, [notifications, t]);

    // Filter notifications by selected dynamic category
    const filteredNotifications = useMemo(() => {
        if (selectedCategory === 'all') return notifications;
        return notifications.filter((item) => {
            const raw = String(item.category || item.event_type || '').toLowerCase().trim();
            return raw === selectedCategory;
        });
    }, [notifications, selectedCategory]);

    const handleDismissItem = async (e, item) => {
        e?.stopPropagation?.();
        if (!item || dismissingIds.has(item.id)) return;

        // Start slide-out animation
        setDismissingIds((prev) => new Set([...prev, item.id]));

        setTimeout(async () => {
            setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n)).filter((n) => (activeTab === 'unread' ? n.id !== item.id : true))
            );
            setDismissingIds((prev) => {
                const next = new Set(prev);
                next.delete(item.id);
                return next;
            });
            await markNotificationAsRead(item.id, userId, item.is_broadcast);
            onUnreadCountChanged?.();
            window.dispatchEvent(new CustomEvent('notification:updated'));
        }, 280);
    };

    const handleMarkAsRead = async (item) => {
        if (!item || item.is_read) return;
        handleDismissItem(null, item);
    };

    const handleItemClick = (item) => {
        if (!item) return;
        if (!item.is_read) {
            handleMarkAsRead(item);
        }
        onClose?.();
        executeNotificationRedirect(item, {
            router,
            language,
            isLoggedIn: Boolean(userId || getStoredUserId()),
        });
    };

    const handleMarkAllRead = async () => {
        if (notifications.length === 0 || markingAll) return;
        setMarkingAll(true);
        const currentList = [...notifications];
        // Optimistic UI update
        if (activeTab === 'unread') {
            setNotifications([]);
        } else {
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        }
        await markAllNotificationsAsRead(userId, currentList);
        setMarkingAll(false);
        onUnreadCountChanged?.();
    };

    // Format relative time (e.g. 5m ago, 2h ago, Yesterday)
    const formatTime = (isoString) => {
        if (!isoString) return '';
        try {
            const d = new Date(isoString);
            const now = new Date();
            const diffMs = now - d;
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours}h ago`;
            const diffDays = Math.floor(diffHours / 24);
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays}d ago`;
            return d.toLocaleDateString();
        } catch (_) {
            return '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose} data-lenis-prevent="true">
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} data-lenis-prevent="true">
                {/* Header */}
                <div className={styles.headerRow}>
                    <h3 className={styles.modalTitle}>{t('notifications.title', 'Notifications')}</h3>
                    <div className={styles.headerActions}>
                        {activeTab === 'unread' && notifications.length > 0 && (
                            <button
                                type="button"
                                className={styles.markAllBtn}
                                onClick={handleMarkAllRead}
                                disabled={markingAll}
                            >
                                {markingAll ? t('notifications.marking', 'Marking...') : t('notifications.markAllRead', 'Mark all as read')}
                            </button>
                        )}
                        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>

                {/* Status Tabs: Unread / Read */}
                <div className={styles.statusTabsRow}>
                    <button
                        type="button"
                        className={`${styles.statusTab} ${activeTab === 'unread' ? styles.activeStatusTab : ''}`}
                        onClick={() => setActiveTab('unread')}
                    >
                        {t('notifications.unread', 'Unread')}
                    </button>
                    <button
                        type="button"
                        className={`${styles.statusTab} ${activeTab === 'read' ? styles.activeStatusTab : ''}`}
                        onClick={() => setActiveTab('read')}
                    >
                        {t('notifications.read', 'Read')}
                    </button>
                </div>

                {/* Body: Left Categories + Right Feed */}
                <div className={styles.modalBody} data-lenis-prevent="true">
                    {/* Left Category Sidebar (Only shows existing categories) */}
                    <div className={styles.categorySidebar} data-lenis-prevent="true">
                        {dynamicCategories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.activeCategory : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <span>{cat.label}</span>
                                {cat.count > 0 && cat.id !== 'all' && (
                                    <span className={styles.categoryBadge}>{cat.count}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Right Content Area */}
                    <div className={styles.contentArea} data-lenis-prevent="true">
                        {loading ? (
                            <Loader centered text={t('notifications.loading', 'Loading notifications...')} />
                        ) : filteredNotifications.length === 0 ? (
                            <div className={styles.emptyStateWrap}>
                                <div className={styles.emptyBellWrap}>
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                </div>
                                <h4 className={styles.emptyTitle}>{t('notifications.noNotifications', 'No notifications yet')}</h4>
                                <p className={styles.emptySubtitle}>{t('notifications.caughtUp', "You're all caught up!")}</p>
                            </div>
                        ) : (
                            filteredNotifications.map((item) => {
                                const redirectUrl = getNotificationRedirectUrl(item);
                                const isExternal = Boolean(redirectUrl && (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://') || redirectUrl.startsWith('//')));
                                return (
                                    <div
                                        key={item.id}
                                        className={`${styles.notificationCard} ${!item.is_read ? styles.unreadCard : ''} ${redirectUrl ? styles.clickableCard : ''} ${dismissingIds.has(item.id) ? styles.slidingOut : ''}`}
                                        onClick={() => handleItemClick(item)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className={styles.cardHeader}>
                                            <span className={styles.cardCatTag}>{item.category || item.event_type || 'SYSTEM'}</span>
                                            <div className={styles.cardHeaderRight}>
                                                <span className={styles.cardTime}>{formatTime(item.created_at)}</span>
                                                {!item.is_read && (
                                                    <button
                                                        type="button"
                                                        className={styles.cardDismissBtn}
                                                        onClick={(e) => handleDismissItem(e, item)}
                                                        title={t('notifications.dismiss', 'Mark as read & close')}
                                                        aria-label="Dismiss notification"
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="18" y1="6" x2="6" y2="18" />
                                                            <line x1="6" y1="6" x2="18" y2="18" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <h5 className={styles.cardTitle}>{item.title}</h5>
                                        <p className={styles.cardMessage}>{item.message}</p>
                                        {redirectUrl && (
                                            <div className={styles.cardFooter}>
                                                <button
                                                    type="button"
                                                    className={styles.visitNowBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleItemClick(item);
                                                    }}
                                                    title={isExternal ? 'Open external link' : 'Visit now'}
                                                >
                                                    <span>{t('notifications.visitNow', 'Visit Now')}</span>
                                                    {isExternal ? (
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                            <polyline points="15 3 21 3 21 9" />
                                                            <line x1="10" y1="14" x2="21" y2="3" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="5" y1="12" x2="19" y2="12" />
                                                            <polyline points="12 5 19 12 12 19" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
