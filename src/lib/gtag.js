import { getOrCreateDeviceId } from './deviceId';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-SLH8FX3W6R';

/**
 * Extracts comprehensive device and browser metadata from the client browser.
 * Captures device type, OS, browser, screen dimensions, orientation, and device ID.
 */
export function getDeviceMetadata() {
    if (typeof window === 'undefined') {
        return {
            category: 'Unknown',
            os: 'Unknown',
            browser: 'Unknown',
            screenResolution: 'Unknown',
            viewport: 'Unknown',
            deviceId: 'Unknown',
            touchSupport: false,
            orientation: 'Unknown',
            language: 'Unknown',
            timezone: 'Unknown',
        };
    }

    const ua = navigator.userAgent || '';
    const width = window.screen?.width || 0;
    const height = window.screen?.height || 0;
    const innerW = window.innerWidth || 0;
    const innerH = window.innerHeight || 0;
    const touchSupport = Boolean(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    );

    // 1. Device Category Detection
    let category = 'Desktop';
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
    const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua);

    if (isTablet) {
        category = 'Tablet';
    } else if (isMobile) {
        category = 'Mobile';
    }

    // 2. Operating System Detection
    let os = 'Unknown';
    if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
    else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6.2/i.test(ua)) os = 'Windows 8';
    else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7';
    else if (/Windows/i.test(ua)) os = 'Windows';
    else if (/iPhone|iPad|iPod/i.test(ua)) {
        const match = ua.match(/OS (\d+[_.\d]+)/i);
        os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
    } else if (/Android/i.test(ua)) {
        const match = ua.match(/Android (\d+([._]\d+)?)/i);
        os = match ? `Android ${match[1]}` : 'Android';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
        const match = ua.match(/Mac OS X (\d+[_.\d]+)/i);
        os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
    } else if (/CrOS/i.test(ua)) os = 'Chrome OS';
    else if (/Linux/i.test(ua)) os = 'Linux';

    // 3. Browser Detection
    let browser = 'Unknown';
    if (/Edg\//i.test(ua)) {
        const m = ua.match(/Edg\/(\d+)/i);
        browser = m ? `Edge ${m[1]}` : 'Edge';
    } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
        const m = ua.match(/(?:OPR|Opera)\/(\d+)/i);
        browser = m ? `Opera ${m[1]}` : 'Opera';
    } else if (/Chrome\//i.test(ua) && !/Chromium|Edg|OPR/i.test(ua)) {
        const m = ua.match(/Chrome\/(\d+)/i);
        browser = m ? `Chrome ${m[1]}` : 'Chrome';
    } else if (/Safari\//i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua)) {
        const m = ua.match(/Version\/(\d+)/i);
        browser = m ? `Safari ${m[1]}` : 'Safari';
    } else if (/Firefox\//i.test(ua)) {
        const m = ua.match(/Firefox\/(\d+)/i);
        browser = m ? `Firefox ${m[1]}` : 'Firefox';
    } else if (/MSIE|Trident/i.test(ua)) {
        browser = 'Internet Explorer';
    }

    // 4. Orientation & Timezone
    const orientation = width > height ? 'landscape' : 'portrait';
    let timezone = 'Unknown';
    try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    } catch (_) {}

    return {
        category,
        os,
        browser,
        screenResolution: `${width}x${height}`,
        viewport: `${innerW}x${innerH}`,
        deviceId: getOrCreateDeviceId() || 'anonymous_device',
        touchSupport,
        orientation,
        language: navigator.language || 'en',
        timezone,
    };
}

/**
 * Initializes and updates user identity + device information in Google Analytics.
 * @param {object|null} user User object containing id, email, name, etc.
 */
export function syncUserToGA(user = null) {
    if (typeof window === 'undefined' || !window.gtag) return;

    const device = getDeviceMetadata();
    const userId = user?.id || user?.user_id || '';
    const userEmail = user?.email || '';
    const userName = user?.name || (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '');
    const isAuthenticated = Boolean(userId);

    const userProperties = {
        user_id: userId || 'anonymous',
        user_email: userEmail || 'anonymous',
        user_name: userName || 'Guest',
        is_authenticated: isAuthenticated ? 'true' : 'false',
        device_category: device.category,
        device_os: device.os,
        device_browser: device.browser,
        device_screen: device.screenResolution,
        device_viewport: device.viewport,
        device_id: device.deviceId,
        device_touch: device.touchSupport ? 'true' : 'false',
        device_timezone: device.timezone,
        device_language: device.language,
    };

    if (userId) {
        window.gtag('set', 'user_id', String(userId));
    } else {
        window.gtag('set', 'user_id', null);
    }

    window.gtag('set', 'user_properties', userProperties);

    if (GA_MEASUREMENT_ID) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            user_id: userId || undefined,
            user_properties: userProperties,
            send_page_view: false, // Page views handled separately on route transitions
        });
    }
}

/**
 * Track page views with comprehensive device and user metadata
 */
export function trackPageView(url) {
    if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

    const device = getDeviceMetadata();
    let storedUser = null;
    try {
        const raw = localStorage.getItem('user');
        if (raw && raw !== 'undefined' && raw !== 'null') {
            storedUser = JSON.parse(raw);
        }
    } catch (_) {}

    const userId = storedUser?.id || storedUser?.user_id || localStorage.getItem('user_id') || '';

    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
        user_id: userId || undefined,
        device_category: device.category,
        device_os: device.os,
        device_browser: device.browser,
        device_screen: device.screenResolution,
        device_id: device.deviceId,
    });
}

/**
 * Track user login event with device and authentication metadata
 */
export function trackUserLogin(method = 'email', user = null) {
    if (typeof window === 'undefined' || !window.gtag) return;

    const device = getDeviceMetadata();
    const userId = user?.id || user?.user_id || '';
    const userEmail = user?.email || '';

    syncUserToGA(user);

    window.gtag('event', 'login', {
        method,
        user_id: userId,
        user_email: userEmail,
        device_category: device.category,
        device_os: device.os,
        device_browser: device.browser,
        device_screen: device.screenResolution,
        device_id: device.deviceId,
        login_timestamp: new Date().toISOString(),
    });
}

/**
 * Track user signup event with device metadata
 */
export function trackUserSignup(method = 'email', user = null) {
    if (typeof window === 'undefined' || !window.gtag) return;

    const device = getDeviceMetadata();
    const userId = user?.id || user?.user_id || '';
    const userEmail = user?.email || '';

    syncUserToGA(user);

    window.gtag('event', 'sign_up', {
        method,
        user_id: userId,
        user_email: userEmail,
        device_category: device.category,
        device_os: device.os,
        device_browser: device.browser,
        device_screen: device.screenResolution,
        device_id: device.deviceId,
        signup_timestamp: new Date().toISOString(),
    });
}

/**
 * Track user logout event
 */
export function trackUserLogout() {
    if (typeof window === 'undefined' || !window.gtag) return;

    const device = getDeviceMetadata();

    window.gtag('event', 'logout', {
        device_category: device.category,
        device_os: device.os,
        device_browser: device.browser,
        device_id: device.deviceId,
        logout_timestamp: new Date().toISOString(),
    });

    syncUserToGA(null);
}

/**
 * Track generic custom event
 */
export function trackEvent(action, params = {}) {
    if (typeof window === 'undefined' || !window.gtag) return;

    const device = getDeviceMetadata();
    window.gtag('event', action, {
        ...params,
        device_category: device.category,
        device_os: device.os,
        device_browser: device.browser,
        device_id: device.deviceId,
    });
}
