/**
 * Shared Authentication & Redirection Helper
 * Handles consistent checking of both localStorage and cookies,
 * and builds resilient redirect URLs that return the user to their
 * intended destination after logging in.
 */

export function isUserLoggedIn() {
    if (typeof window === 'undefined') return false;
    try {
        const localToken = localStorage.getItem('access_token');
        const hasLocalToken = Boolean(
            localToken && localToken.trim() && localToken !== 'undefined' && localToken !== 'null'
        );

        const hasCookieToken = Boolean(
            document.cookie
                .split(';')
                .some((c) => {
                    const trimmed = c.trim();
                    if (!trimmed.startsWith('auth_token=')) return false;
                    const parts = trimmed.split('=');
                    const val = parts.length > 1 ? parts.slice(1).join('=') : '';
                    return Boolean(val && val.trim() && val !== 'undefined' && val !== 'null');
                })
        );

        // Check if user identity exists in localStorage
        const storedUser = localStorage.getItem('user');
        const storedUserId = localStorage.getItem('user_id');
        let hasValidUser = false;

        if (storedUserId && storedUserId.trim() && storedUserId !== 'undefined' && storedUserId !== 'null') {
            hasValidUser = true;
        } else if (storedUser && storedUser.trim() && storedUser !== 'undefined' && storedUser !== 'null') {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed && (parsed.id || parsed.user_id || parsed.email)) {
                    hasValidUser = true;
                }
            } catch (_) {}
        }

        // To be considered logged in, the client must have an active token AND an associated user profile
        return (hasLocalToken || hasCookieToken) && hasValidUser;
    } catch {
        return false;
    }
}

function getActiveLocalePrefix() {
    if (typeof window === 'undefined') return '';
    try {
        const segments = window.location.pathname.split('/').filter(Boolean);
        const first = segments[0]?.toLowerCase();
        const known = [
            'en', 'ar', 'ary', 'es', 'ru', 'zh', 'vi', 'id', 'fil',
            'arabic', 'spanish', 'russian', 'chinese', 'vietnamese',
            'indonesian', 'filipino', 'darija', 'english'
        ];
        if (first && known.includes(first)) {
            return `/${first}`;
        }
    } catch (_) {}
    return '';
}

/**
 * Returns the destination href for a CTA button or link.
 * If the user is logged in, returns the target path directly (with locale prefix if present).
 * Otherwise returns /login?redirect=<target> so login bounces them back.
 */
export function getAuthHref(targetPath = '/dashboard') {
    const cleanTarget = targetPath && targetPath !== '/' ? targetPath : '/dashboard';
    return cleanTarget;
}

/**
 * Navigates to targetPath if logged in, otherwise to login with redirect param.
 * Pass a Next.js router instance or fallback to window.location.
 */
export function authNavigate(router, targetPath = '/dashboard') {
    const prefix = getActiveLocalePrefix();
    const cleanTarget = targetPath && targetPath !== '/' ? targetPath : '/dashboard';
    const localizedTarget = cleanTarget.startsWith(prefix) ? cleanTarget : `${prefix}${cleanTarget}`;
    const loginPath = `${prefix}/login`;
    const destination = isUserLoggedIn() ? localizedTarget : `${loginPath}?redirect=${encodeURIComponent(localizedTarget)}`;
    if (router && typeof router.push === 'function') {
        router.push(destination);
    } else if (typeof window !== 'undefined') {
        window.location.assign(destination);
    }
}

/**
 * Returns the destination href for a feature link:
 * - If user is logged in: dashboardPath (e.g. /trade-snap)
 * - If user is logged out: publicPath (e.g. /ai-trade)
 */
export function getFeatureHref(publicPath, dashboardPath) {
    const prefix = getActiveLocalePrefix();
    const target = isUserLoggedIn() ? dashboardPath : publicPath;
    if (!target) return prefix || '/';
    return target.startsWith(prefix) ? target : `${prefix}${target}`;
}

/**
 * Navigates to dashboardPath if user is logged in,
 * otherwise navigates to publicPath if user is logged out.
 */
export function navigateFeature(router, publicPath, dashboardPath) {
    const destination = getFeatureHref(publicPath, dashboardPath);
    if (router && typeof router.push === 'function') {
        router.push(destination);
    } else if (typeof window !== 'undefined') {
        window.location.assign(destination);
    }
}


