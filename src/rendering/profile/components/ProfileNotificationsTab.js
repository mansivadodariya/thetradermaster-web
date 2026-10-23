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
import styles from '../profile.module.scss';

export default function ProfileNotificationsTab({ userId, t, onUnreadCountChanged }) {
    const router = useRouter();
    const { language } = useLanguage();
    const activeUserId = userId || (typeof window !== 'undefined' ? getStoredUserId() : '');
    const [activeTab, setActiveTab] = useState('unread'); // 'unread' | 'read'
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);
    const [dismissingIds, setDismissingIds] = useState(new Set());

    const loadNotifications = useCallback(async () => {
        if (!activeUserId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data } = await fetchUserNotifications(activeUserId, {
                readStatus: activeTab,
                limit: 100
            });
            setNotifications(data || []);
        } catch (err) {
            console.warn('Failed to load profile notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [activeUserId, activeTab]);

    useEffect(() => {
        if (activeUserId) {
            loadNotifications();
        }
    }, [activeUserId, loadNotifications]);

    useEffect(() => {
        const onNotifUpdated = () => {
            if (activeUserId) {
                loadNotifications();
            }
        };
        window.addEventListener('notification:updated', onNotifUpdated);
        return () => window.removeEventListener('notification:updated', onNotifUpdated);
    }, [activeUserId, loadNotifications]);

    // Dynamically derive categories from actual notification records
    const dynamicCategories = useMemo(() => {
        const catMap = new Map();
        notifications.forEach((item) => {
            const raw = item.category || item.event_type;
            if (!raw) return;
            const normalized = String(raw).toLowerCase().trim();
            catMap.set(normalized, (catMap.get(normalized) || 0) + 1);
        });

        const list = [
            { id: 'all', label: t ? t('notifications.all', 'All') : 'All', count: notifications.length }
        ];

        catMap.forEach((count, catId) => {
            const label = catId
                .replace(/[_-]+/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());
            list.push({ id: catId, label, count });
        });

        return list;
    }, [notifications, t]);

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
            await markNotificationAsRead(item.id, activeUserId, item.is_broadcast);
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
        const targetUrl = getNotificationRedirectUrl(item);
        if (!item.is_read) {
            handleMarkAsRead(item);
        }
        if (targetUrl) {
            executeNotificationRedirect(item, {
                router,
                language,
                isLoggedIn: Boolean(activeUserId),
            });
        }
    };

    const handleMarkAllRead = async () => {
        if (notifications.length === 0 || markingAll) return;
        setMarkingAll(true);
        const currentList = [...notifications];
        if (activeTab === 'unread') {
            setNotifications([]);
        } else {
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        }
        await markAllNotificationsAsRead(activeUserId, currentList);
        setMarkingAll(false);
        onUnreadCountChanged?.();
    };

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

    return (
        <div className={styles.tabContentPanel}>
            {/* Header section */}
            <div className={styles.tabHeaderRow}>
                <div>
                    <h3 className={styles.tabTitle}>{t ? t('notifications.title', 'Notifications') : 'Notifications'}</h3>
                    <p className={styles.tabSubtitle}>
                        {t ? t('notifications.subtitle', 'Manage your account updates, broadcast alerts, and platform announcements.') : 'Manage your account updates, broadcast alerts, and platform announcements.'}
                    </p>
                </div>
                {activeTab === 'unread' && notifications.length > 0 && (
                    <button
                        type="button"
                        className={styles.markAllNotificationsBtn}
                        onClick={handleMarkAllRead}
                        disabled={markingAll}
                    >
                        {markingAll ? (t ? t('notifications.marking', 'Marking...') : 'Marking...') : (t ? t('notifications.markAllRead', 'Mark all as read') : 'Mark all as read')}
                    </button>
                )}
            </div>

            {/* Subtabs: Unread / Read */}
            <div className={styles.notificationStatusTabs}>
                <button
                    type="button"
                    className={`${styles.notifTabBtn} ${activeTab === 'unread' ? styles.activeNotifTab : ''}`}
                    onClick={() => setActiveTab('unread')}
                >
                    {t ? t('notifications.unread', 'Unread') : 'Unread'}
                </button>
                <button
                    type="button"
                    className={`${styles.notifTabBtn} ${activeTab === 'read' ? styles.activeNotifTab : ''}`}
                    onClick={() => setActiveTab('read')}
                >
                    {t ? t('notifications.read', 'Read') : 'Read'}
                </button>
            </div>

            {/* Category Filter Pills */}
            {dynamicCategories.length > 1 && (
                <div className={styles.notificationCategoryFilterRow}>
                    {dynamicCategories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`${styles.notifCategoryPill} ${selectedCategory === cat.id ? styles.activeCategoryPill : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            <span>{cat.label}</span>
                            {cat.count > 0 && cat.id !== 'all' && (
                                <span className={styles.notifCountBadge}>{cat.count}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Notifications Feed */}
            <div className={styles.notificationsFeedArea}>
                {loading ? (
                    <div className={styles.notificationsLoader}>
                        <span>{t ? t('notifications.loading', 'Loading notifications...') : 'Loading notifications...'}</span>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className={styles.notificationsEmptyState}>
                        <div className={styles.emptyBellWrap}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <h4>{t ? t('notifications.noNotifications', 'No notifications yet') : 'No notifications yet'}</h4>
                        <p>{t ? t('notifications.caughtUp', "You're all caught up!") : "You're all caught up!"}</p>
                    </div>
                ) : (
                    <div className={styles.notificationsList}>
                        {filteredNotifications.map((item) => {
                            const redirectUrl = getNotificationRedirectUrl(item);
                            const isExternal = Boolean(redirectUrl && (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://') || redirectUrl.startsWith('//')));
                            return (
                                <div
                                    key={item.id}
                                    className={`${styles.profileNotifCard} ${!item.is_read ? styles.unreadProfileNotif : ''} ${redirectUrl ? styles.clickableProfileNotif : ''} ${dismissingIds.has(item.id) ? styles.slidingOut : ''}`}
                                    onClick={() => handleItemClick(item)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className={styles.notifCardHeader}>
                                        <span className={styles.notifCategoryTag}>{item.category || item.event_type || 'SYSTEM'}</span>
                                        <div className={styles.cardHeaderRight}>
                                            <span className={styles.notifTime}>{formatTime(item.created_at)}</span>
                                            {!item.is_read && (
                                                <button
                                                    type="button"
                                                    className={styles.profileNotifDismissBtn}
                                                    onClick={(e) => handleDismissItem(e, item)}
                                                    title={t ? t('notifications.dismiss', 'Mark as read & close') : 'Mark as read & close'}
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
                                    <h5 className={styles.notifCardTitle}>{item.title}</h5>
                                    <p className={styles.notifCardMessage}>{item.message}</p>
                                    {redirectUrl && (
                                        <div className={styles.notifCardFooter}>
                                            <button
                                                type="button"
                                                className={styles.notifActionBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleItemClick(item);
                                                }}
                                                title={isExternal ? 'Open external link' : 'Visit now'}
                                            >
                                                <span>{t ? t('notifications.visitNow', 'Visit Now') : 'Visit Now'}</span>
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
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
