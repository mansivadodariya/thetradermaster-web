import { notificationsApi } from '@/lib/api';
import { getVisibleTabNamesSync, checkPermissionInSet } from '@/lib/useTabPermission';

function isNotificationFeatureEnabled() {
    const tabs = getVisibleTabNamesSync();
    if (!tabs) return true;
    return checkPermissionInSet(tabs, 'notifications');
}

/**
 * 1. Fetch Website Updates Only (Announcements & Feature Releases)
 * Calls Backend API: GET /api/v1/notifications?category=website_updates
 */
export async function fetchWebsiteUpdates(page = 1, limit = 20) {
    if (!isNotificationFeatureEnabled()) {
        return { data: [], total: 0 };
    }
    try {
        const res = await notificationsApi.getWebsiteUpdates({ page, limit });
        const rawList = res?.data?.notifications || res?.data?.items || res?.data || res?.notifications || [];
        const total = res?.data?.total || res?.total || (Array.isArray(rawList) ? rawList.length : 0);
        return { data: Array.isArray(rawList) ? rawList : [], total };
    } catch (err) {
        console.error('Error fetching website updates from backend API:', err);
        return { data: [], total: 0 };
    }
}

/**
 * 2. Fetch User Notification Feed (User-Specific + Global Broadcasts)
 * Calls Backend API: GET /api/v1/notifications
 */
export async function fetchUserNotifications(userId, { page = 1, limit = 20, category = null, readStatus = null } = {}) {
    if (!isNotificationFeatureEnabled()) {
        return { data: [], total: 0 };
    }
    try {
        const res = await notificationsApi.getNotifications({ page, limit, category, readStatus });
        const rawList = res?.data?.notifications || res?.data?.items || res?.data || res?.notifications || [];
        const total = res?.data?.total || res?.total || (Array.isArray(rawList) ? rawList.length : 0);

        const list = Array.isArray(rawList) ? rawList : [];
        const formatted = list.map((item) => {
            const isBroadcast = item.user_id === null || item.is_broadcast === true;
            let cleanMessage = item.message || '';
            if (cleanMessage) {
                cleanMessage = cleanMessage
                    .replace(/successfully logged in from\s+(?:\d{1,3}\.){3}\d{1,3}\.?/gi, 'have successfully logged in to your account.')
                    .replace(/\s*(?:from\s+)?(?:\d{1,3}\.){3}\d{1,3}\.?/gi, '.')
                    .replace(/\.\.+/g, '.')
                    .trim();
            }
            return {
                ...item,
                message: cleanMessage,
                is_read: Boolean(item.is_read),
                is_broadcast: isBroadcast,
            };
        });

        const filtered = readStatus === 'unread'
            ? formatted.filter(item => !item.is_read)
            : readStatus === 'read'
                ? formatted.filter(item => item.is_read)
                : formatted;

        return { data: filtered, total };
    } catch (err) {
        console.error('Error fetching notifications from backend API:', err);
        return { data: [], total: 0 };
    }
}

/**
 * 3. Fetch Unread Count Badge
 * Calls Backend API: GET /api/v1/notifications/unread-count
 */
export async function getUnreadCount(userId) {
    if (!isNotificationFeatureEnabled()) {
        return 0;
    }
    try {
        const res = await notificationsApi.getUnreadCount();
        const count = res?.data?.unread_count ?? res?.data?.count ?? res?.unread_count ?? res?.count;
        if (typeof count === 'number') return count;
        if (typeof res?.data === 'number') return res.data;
        if (typeof res === 'number') return res;
        return 0;
    } catch (err) {
        console.error('Error getting unread count from backend API:', err);
        return 0;
    }
}

/**
 * 4. Mark Single Notification As Read via Backend API
 * Uses backend endpoint: POST /api/v1/notifications/:id/read
 */
export async function markNotificationAsRead(notificationId) {
    if (!notificationId) return;
    try {
        const res = await notificationsApi.markAsRead(notificationId);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('notification:updated'));
        }
        return res;
    } catch (err) {
        console.error('Error marking notification as read via API:', err);
    }
}

/**
 * 5. Mark All Notifications As Read via Backend API
 * Uses backend endpoint: POST /api/v1/notifications/read-all
 */
export async function markAllNotificationsAsRead() {
    try {
        const res = await notificationsApi.markAllAsRead();
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('notification:updated'));
        }
        return res;
    } catch (err) {
        console.error('Error marking all notifications as read via API:', err);
    }
}

const SUPPORTED_LOCALES = ['en', 'ar', 'ary', 'es', 'ru', 'zh', 'vi', 'id', 'fil', 'arabic', 'spanish', 'russian', 'chinese', 'vietnamese', 'indonesian', 'filipino', 'darija'];

const PROTECTED_PREFIXES = [
    '/dashboard',
    '/chart-scanner',
    '/trade-advisor',
    '/trade-audit',
    '/market-assistant',
    '/signal-terminal',
    '/live-scanner',
    '/strategy-core',
    '/trading-signal',
    '/ai-trading-signal',
    '/strategy-signal',
    '/predefined-strategies',
    '/strategy-hub',
    '/my-bots',
    '/ai-bot-builder',
    '/manual-bot-builder',
    '/bot-library',
    '/browse-bots',
    '/calendar',
    '/calculator',
    '/news',
    '/tools',
    '/credit-history',
    '/broker',
    '/brokers',
    '/profile',
    '/settings',
    '/onboarding',
    '/steper',
];

const VALID_APP_ROUTES = new Set([
    '/',
    '/dashboard',
    '/chart-scanner',
    '/live-scanner',
    '/signal-terminal',
    '/trade-advisor',
    '/trade-audit',
    '/market-assistant',
    '/strategy-core',
    '/trading-signal',
    '/ai-trading-signal',
    '/strategy-signal',
    '/predefined-strategies',
    '/strategy-hub',
    '/my-bots',
    '/ai-bot-builder',
    '/manual-bot-builder',
    '/bot-builder',
    '/bot-library',
    '/browse-bots',
    '/calendar',
    '/calculator',
    '/news',
    '/credit-history',
    '/broker',
    '/brokers',
    '/profile',
    '/settings',
    '/subscription-plans',
    '/affiliate',
    '/backtest',
    '/strategy-studio',
    '/pricing',
    '/plans',
    '/about-us',
    '/contact-us',
    '/terms-and-conditions',
    '/privacy-policy',
]);

export function isValidAppRoute(rawPath) {
    if (!rawPath || typeof rawPath !== 'string') return false;
    const trimmed = rawPath.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
        return true;
    }
    const clean = stripLocalePrefix(trimmed.split('?')[0]).replace(/\/$/, '') || '/';
    return VALID_APP_ROUTES.has(clean.toLowerCase());
}

export function validateNotificationRedirect(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return '/dashboard';
    const trimmed = rawUrl.trim();
    if (!trimmed) return '/dashboard';

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
        return trimmed;
    }

    const [pathname, search] = trimmed.split('?');
    const clean = stripLocalePrefix(pathname).replace(/\/$/, '') || '/';

    if (VALID_APP_ROUTES.has(clean.toLowerCase())) {
        return search ? `${clean}?${search}` : clean;
    }

    // Route does not exist in the app -> default to /dashboard
    return '/dashboard';
}

export function hasNotificationLink(notification) {
    return Boolean(getNotificationRedirectUrl(notification));
}

function stripLocalePrefix(path) {
    if (!path) return '/';
    const clean = path.split('?')[0].replace(/\/$/, '') || '/';
    const parts = clean.split('/').filter(Boolean);
    if (parts.length > 0 && SUPPORTED_LOCALES.includes(parts[0].toLowerCase())) {
        const withoutLocale = '/' + parts.slice(1).join('/');
        return withoutLocale === '' ? '/' : withoutLocale;
    }
    return clean;
}

export function getLocalizedHref(href, lang) {
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) return href;
    const [pathname, search] = href.split('?');
    const clean = stripLocalePrefix(pathname);
    const currentLang = lang || 'en';
    const localizedPath = clean === '/' ? `/${currentLang}` : `/${currentLang}${clean}`;
    return search ? `${localizedPath}?${search}` : localizedPath;
}

export function isProtectedRoute(path) {
    if (!path || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) return false;
    const clean = stripLocalePrefix(path.split('?')[0]);
    return PROTECTED_PREFIXES.some(prefix => clean === prefix || clean.startsWith(`${prefix}/`));
}

export function getNotificationRedirectUrl(notification) {
    if (!notification) return null;

    // 1. Direct properties on notification object
    const direct = notification.redirect_url || notification.url || notification.link || notification.route || notification.action_url || notification.href;
    if (direct && typeof direct === 'string' && direct.trim()) {
        return validateNotificationRedirect(direct.trim());
    }

    // 2. Properties in data payload
    let data = notification.data;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (_) {
            data = null;
        }
    }
    if (data && typeof data === 'object') {
        const dataUrl = data.redirect_url || data.url || data.link || data.route || data.action_url || data.href || data.target || data.path;
        if (dataUrl && typeof dataUrl === 'string' && dataUrl.trim()) {
            return validateNotificationRedirect(dataUrl.trim());
        }
    }

    // 3. Fallback based on category or event_type
    const cat = String(notification.category || notification.event_type || '').toLowerCase().trim();
    if (cat === 'trade_signals' || cat === 'trade_signal') return '/trading-signal';
    if (cat === 'ai_strategy' || cat === 'strategy') return '/my-bots';
    if (cat === 'chart_scanner' || cat === 'scanner') return '/chart-scanner';
    if (cat === 'live_scanner') return '/live-scanner';
    if (cat === 'trade_advisor' || cat === 'trade_audit') return '/trade-advisor';
    if (cat === 'market_assistant') return '/market-assistant';
    if (cat === 'brokers' || cat === 'associated_brokers') return '/brokers';
    if (cat === 'plans' || cat === 'subscription_plans') return '/subscription-plans';
    if (cat === 'affiliate' || cat === 'affiliate_program') return '/affiliate';
    if (cat === 'profile' || cat === 'settings') return '/profile';
    if (cat === 'tools' || cat === 'economic_calendar') return '/calendar';
    if (cat === 'forex_calculator') return '/calculator';

    return '/dashboard';
}

/**
 * Executes proper redirection for a notification click:
 * - If external URL: opens safely in a new tab.
 * - If logged in and internal route: navigates directly to localized destination.
 * - If NOT logged in and protected route: redirects to /login?redirect=<target> so user lands on target after login.
 */
export function executeNotificationRedirect(notification, { router, language, isLoggedIn, onComplete } = {}) {
    if (!notification) return;

    const targetUrl = getNotificationRedirectUrl(notification);
    if (!targetUrl) {
        onComplete?.();
        return;
    }

    // External link handling
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('//')) {
        onComplete?.();
        if (typeof window !== 'undefined') {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
        return;
    }

    const isUserLoggedIn = typeof isLoggedIn === 'boolean'
        ? isLoggedIn
        : Boolean(typeof window !== 'undefined' && (localStorage.getItem('user') || localStorage.getItem('user_id') || localStorage.getItem('access_token') || sessionStorage.getItem('access_token')));

    const isProtected = isProtectedRoute(targetUrl);

    let destination = targetUrl;
    if (isProtected && !isUserLoggedIn) {
        destination = `/login?redirect=${encodeURIComponent(targetUrl)}`;
    }

    const localizedDestination = getLocalizedHref(destination, language);

    onComplete?.();

    if (router && typeof router.push === 'function') {
        router.push(localizedDestination);
    } else if (typeof window !== 'undefined') {
        window.location.href = localizedDestination;
    }
}

