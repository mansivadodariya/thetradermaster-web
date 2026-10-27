'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
    fetchUserNotifications,
    fetchWebsiteUpdates,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    executeNotificationRedirect,
    getNotificationRedirectUrl
} from '@/services/notificationService';
import { getStoredUserId } from '@/lib/authSession';
import { useTabPermission } from '@/lib/useTabPermission';
import styles from './notificationPopup.module.scss';

function getDismissedGuestUpdates() {
    try {
        if (typeof window === 'undefined') return [];
        const raw = localStorage.getItem('tradermaster_dismissed_updates');
        return raw ? JSON.parse(raw) : [];
    } catch (_) {
        return [];
    }
}

function saveDismissedGuestUpdate(id) {
    try {
        if (typeof window === 'undefined' || !id) return;
        const current = getDismissedGuestUpdates();
        if (!current.includes(id)) {
            current.push(id);
            localStorage.setItem('tradermaster_dismissed_updates', JSON.stringify(current));
        }
    } catch (_) { }
}

function formatCategory(raw) {
    if (!raw) return 'Website Update';
    const s = String(raw).trim().toLowerCase();
    if (s === 'website_updates' || s === 'website_update') return 'Website Update';
    if (s === 'trade_signals' || s === 'trade_signal') return 'Trade Signal';
    if (s === 'ai_strategy' || s === 'strategy') return 'AI Strategy';
    if (s === 'chart_scanner' || s === 'scanner') return 'Chart Scanner';
    if (s === 'system_alert' || s === 'system') return 'System Alert';
    if (s === 'announcement' || s === 'announcements') return 'Announcement';
    return s.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function NotificationPopup({ userId: propUserId, onOpenFullModal }) {
    const hasNotificationsPermission = useTabPermission('notifications');
    const pathname = usePathname();
    const router = useRouter();
    const { language } = useLanguage();
    const [unreadQueue, setUnreadQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSlidingOut, setIsSlidingOut] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [activeUserId, setActiveUserId] = useState(propUserId || '');
    const [isHovered, setIsHovered] = useState(false);

    const isAuthRoute = Boolean(
        pathname && (
            pathname.includes('/login') ||
            pathname.includes('/signup') ||
            pathname.includes('/register') ||
            pathname.includes('/forgot-password') ||
            pathname.includes('/reset-password') ||
            pathname.includes('/verify-email') ||
            pathname.includes('/verify-otp') ||
            pathname.includes('/onboarding') ||
            pathname.includes('/steper') ||
            pathname.includes('/maintenance')
        )
    );

    useEffect(() => {
        const uid = propUserId || getStoredUserId();
        setActiveUserId(uid || '');
    }, [propUserId]);

    const loadUnreadPopups = useCallback(async () => {
        if (!hasNotificationsPermission) return;
        if (isAuthRoute) return;
        if (typeof window !== 'undefined' && sessionStorage.getItem('tradermaster_popup_dismissed') === 'true') {
            return;
        }

        const uid = activeUserId || getStoredUserId();
        try {
            if (uid) {
                const { data } = await fetchUserNotifications(uid, {
                    readStatus: 'unread',
                    limit: 15
                });
                const dismissed = getDismissedGuestUpdates();
                const fresh = (data || []).filter((item) => !dismissed.includes(item.id));
                if (fresh.length > 0) {
                    setUnreadQueue(fresh);
                    setCurrentIndex(0);
                    setTimeout(() => {
                        setIsVisible(true);
                    }, 800);
                }
            } else {
                const { data } = await fetchWebsiteUpdates(1, 8);
                const dismissed = getDismissedGuestUpdates();
                const fresh = (data || []).filter((item) => !dismissed.includes(item.id));
                if (fresh.length > 0) {
                    setUnreadQueue(fresh);
                    setCurrentIndex(0);
                    setTimeout(() => {
                        setIsVisible(true);
                    }, 1200);
                }
            }
        } catch (err) {
            console.warn('Failed to load popup notifications:', err);
        }
    }, [activeUserId, isAuthRoute, hasNotificationsPermission]);

    useEffect(() => {
        if (!hasNotificationsPermission) {
            setIsVisible(false);
            setUnreadQueue([]);
            return;
        }
        loadUnreadPopups();
    }, [hasNotificationsPermission, loadUnreadPopups]);

    useEffect(() => {
        const onNotifSync = () => {
            if (hasNotificationsPermission) {
                loadUnreadPopups();
            }
        };
        window.addEventListener('notification:updated', onNotifSync);
        return () => window.removeEventListener('notification:updated', onNotifSync);
    }, [hasNotificationsPermission, loadUnreadPopups]);

    const currentItem = unreadQueue[currentIndex];
    const isActuallyShowing = Boolean(isVisible && !isSlidingOut && currentItem);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('notification:popup:visibility', {
                detail: { visible: isActuallyShowing }
            }));
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('notification:popup:visibility', {
                    detail: { visible: false }
                }));
            }
        };
    }, [isActuallyShowing]);

    // Close all notifications on top 'X' button click
    const dismissAll = async (e) => {
        e?.stopPropagation?.();
        if (isSlidingOut || !isVisible) return;

        setIsSlidingOut(true);

        const uid = activeUserId || getStoredUserId();
        if (uid) {
            markAllNotificationsAsRead(uid).catch(() => {});
            unreadQueue.forEach((item) => {
                if (item?.id) markNotificationAsRead(item.id).catch(() => {});
            });
        }

        unreadQueue.forEach((item) => {
            if (item?.id) saveDismissedGuestUpdate(item.id);
        });

        try {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('tradermaster_popup_dismissed', 'true');
            }
        } catch (_) {}

        setTimeout(() => {
            setIsVisible(false);
            setUnreadQueue([]);
            setIsSlidingOut(false);
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('notification:popup:visibility', { detail: { visible: false } }));
                window.dispatchEvent(new CustomEvent('notification:updated'));
            }
        }, 380);
    };

    // Advance to next notification or dismiss if last
    const dismissCurrent = async (e) => {
        e?.stopPropagation?.();
        if (!currentItem || isSlidingOut) return;

        setIsSlidingOut(true);

        const uid = activeUserId || getStoredUserId();
        if (uid) {
            markNotificationAsRead(currentItem.id)
                .then(() => {
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('notification:updated'));
                    }
                })
                .catch(() => {});
        }
        saveDismissedGuestUpdate(currentItem.id);

        setTimeout(() => {
            if (currentIndex + 1 < unreadQueue.length) {
                setCurrentIndex((prev) => prev + 1);
                setIsSlidingOut(false);
            } else {
                setIsVisible(false);
                setUnreadQueue([]);
                setIsSlidingOut(false);
                try {
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('tradermaster_popup_dismissed', 'true');
                        window.dispatchEvent(new CustomEvent('notification:popup:visibility', { detail: { visible: false } }));
                    }
                } catch (_) {}
            }
        }, 380);
    };

    // Auto-dismiss popup after 6 seconds (pauses on hover)
    useEffect(() => {
        if (!isActuallyShowing || isHovered) return;

        const autoDismissTimer = setTimeout(() => {
            dismissCurrent();
        }, 6000);

        return () => clearTimeout(autoDismissTimer);
    }, [isActuallyShowing, isHovered, currentIndex, currentItem?.id]);

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

    if (!hasNotificationsPermission || isAuthRoute || !isVisible || !currentItem) return null;

    const remainingCount = unreadQueue.length - currentIndex;

    const handleCardClick = (e) => {
        e?.stopPropagation?.();
        const itemToRedirect = currentItem;
        if (!itemToRedirect) return;

        const uid = activeUserId || getStoredUserId();
        if (uid) {
            markNotificationAsRead(itemToRedirect.id).catch(() => {});
        }
        saveDismissedGuestUpdate(itemToRedirect.id);

        setIsVisible(false);
        setUnreadQueue([]);
        try {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('tradermaster_popup_dismissed', 'true');
                window.dispatchEvent(new CustomEvent('notification:popup:visibility', { detail: { visible: false } }));
            }
        } catch (_) {}

        const hasRedirect = Boolean(getNotificationRedirectUrl(itemToRedirect));
        executeNotificationRedirect(itemToRedirect, {
            router,
            language,
            isLoggedIn: Boolean(activeUserId),
            onComplete: () => {
                if (!hasRedirect) {
                    onOpenFullModal?.();
                }
            }
        });
    };

    return (
        <aside className={styles.popupContainer} aria-label="Notification Popup">
            <div
                className={`${styles.slideNotify} ${isVisible && !isSlidingOut ? styles.slideIn : styles.slideOut}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Top Row: Category Tag + Progress Counter Pill + Close Button */}
                <div className={styles.topRow}>
                    <div className={styles.badgeWrap}>
                        <span className={styles.categoryTag}>
                            <span className={styles.pulsingDot} />
                            {formatCategory(currentItem.category || currentItem.event_type)}
                        </span>

                        {unreadQueue.length > 1 && (
                            <div className={styles.counterPill}>
                                <span className={styles.counterText}>
                                    {currentIndex + 1} of {unreadQueue.length}
                                </span>
                                <div className={styles.dotsRow}>
                                    {unreadQueue.slice(0, 5).map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.actionButtons}>
                        <button
                            type="button"
                            className={styles.slideCloseBtn}
                            onClick={dismissAll}
                            aria-label="Close notification popup"
                            title="Close all"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content Row: Glowing Icon Box + Title & Message */}
                <div
                    className={styles.contentRow}
                    onClick={handleCardClick}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open update: ${currentItem.title}`}
                >
                    <div className={styles.iconBox}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                            <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
                        </svg>
                    </div>

                    <div className={styles.textCol}>
                        <h4 className={styles.popupTitle}>{currentItem.title}</h4>
                        <p className={styles.popupMessage}>{currentItem.message}</p>
                    </div>
                </div>

                {/* Divider Line */}
                <div className={styles.divider} />

                {/* Bottom Row: Timestamp + Glowing 'Next update →' / 'Dismiss' Pill Button */}
                <div className={styles.bottomRow}>
                    <span className={styles.timeText}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formatTime(currentItem.created_at)}
                    </span>

                    <div className={styles.bottomActions}>
                        <button
                            type="button"
                            className={styles.markReadBtn}
                            onClick={dismissCurrent}
                            aria-label={remainingCount > 1 ? 'Go to next update' : 'Dismiss update'}
                        >
                            <span>{remainingCount > 1 ? 'Next update' : 'Dismiss'}</span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
