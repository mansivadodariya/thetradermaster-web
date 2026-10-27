/**
 * Shared auth session helpers — login, Google login, and API calls must use the same shape.
 */

/** Read access_token from login / google-login API bodies (nested or flat). */
export function extractAccessToken(payload) {
    if (!payload || typeof payload !== 'object') return null;

    const candidates = [
        payload?.data?.access_token,
        payload?.data?.token,
        payload?.access_token,
        payload?.token,
    ];

    for (const token of candidates) {
        if (typeof token === 'string' && token.trim()) return token.trim();
    }
    return null;
}

/** True when API indicates a new Google user waiting for admin approval (no tokens). */
export function isGooglePendingApproval(payload) {
    if (extractAccessToken(payload)) return false;

    const data = payload?.data ?? payload ?? {};
    if (data.pending_approval || data.requires_approval || data.is_approved === false) {
        return true;
    }

    const message = String(payload?.message || data?.message || '');
    return /awaiting|approval|pending|admin/i.test(message);
}

export function getAuthRedirectTarget(searchParams) {
    if (!searchParams) return '/dashboard';
    const target = (
        searchParams.get('redirect') ||
        searchParams.get('from') ||
        '/dashboard'
    );
    if (target === '/onboarding' || target === '/steper' || target.startsWith('/onboarding') || target.startsWith('/steper')) {
        return '/dashboard';
    }
    return target;
}

export function getStoredUserId() {
    if (typeof window === 'undefined') return '';
    try {
        const stored = localStorage.getItem('user');
        if (stored && stored !== 'undefined' && stored !== 'null') {
            const parsed = JSON.parse(stored);
            const id = parsed?.id || parsed?.user_id;
            if (id && id !== 'undefined' && id !== 'null') return String(id);
        }
    } catch {
        /* ignore */
    }
    const standalone = localStorage.getItem('user_id');
    return (standalone && standalone !== 'undefined' && standalone !== 'null') ? String(standalone) : '';
}

export function getStoredUser() {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem('user');
        if (stored && stored !== 'undefined' && stored !== 'null') return JSON.parse(stored);
    } catch {
        /* ignore */
    }
    return null;
}

import { supabase } from '@/lib/supabaseClient';
import { trackUserLogin } from '@/lib/gtag';

/**
 * Hydrate missing user identity fields (first_name, last_name, email, profile_picture)
 * from Supabase or backend API and update localStorage & fire user:updated event.
 */
let inFlightHydrationPromise = null;

export async function hydrateUserFromProfile(userId, currentUser = null) {
    if (typeof window === 'undefined') return currentUser;
    const uid = userId || getStoredUserId();
    if (!uid) return currentUser;

    const existing = currentUser || getStoredUser() || {};
    const hasIdentity = Boolean(
        existing?.first_name || existing?.last_name || existing?.name || existing?.email
    );

    // If identity fields already exist, return existing user
    if (hasIdentity) {
        return existing;
    }

    if (inFlightHydrationPromise) {
        return inFlightHydrationPromise;
    }

    inFlightHydrationPromise = (async () => {
        try {
            let profileData = null;

            if (supabase) {
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .select('first_name, last_name, email, name, phone_number, profile_picture')
                        .eq('id', uid)
                        .maybeSingle();

                    if (data && !error) {
                        profileData = data;
                    }
                } catch (sbErr) {
                    console.warn('Supabase profile hydration warning:', sbErr);
                }
            }

            if (!profileData || (!profileData.first_name && !profileData.last_name && !profileData.name && !profileData.email)) {
                const token = localStorage.getItem('access_token');
                const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1` : '';
                if (token && baseUrl) {
                    try {
                        const res = await fetch(`${baseUrl}/profile`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                                'ngrok-skip-browser-warning': 'true',
                            },
                        });
                        if (res.ok) {
                            const resJson = await res.json();
                            profileData = resJson?.data || resJson;
                        }
                    } catch (apiErr) {
                        console.warn('Backend profile fetch error:', apiErr);
                    }
                }
            }

            if (profileData) {
                const fullName = profileData.name || profileData.full_name || '';
                const nameParts = fullName.trim().split(/\s+/);
                const firstName = profileData.first_name || (nameParts[0] !== '' ? nameParts[0] : '') || existing.first_name || '';
                const lastName = profileData.last_name || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '') || existing.last_name || '';

                const mergedUser = {
                    ...existing,
                    id: uid,
                    user_id: uid,
                    first_name: firstName,
                    last_name: lastName,
                    name: profileData.name || existing.name || (firstName || lastName ? `${firstName} ${lastName}`.trim() : ''),
                    email: profileData.email || existing.email || '',
                    phone_number: profileData.phone_number || existing.phone_number || '',
                    profile_picture: profileData.profile_picture || profileData.picture || existing.profile_picture || '',
                };

                localStorage.setItem('user', JSON.stringify(mergedUser));
                window.dispatchEvent(new CustomEvent('user:updated'));
                return mergedUser;
            }
        } catch (e) {
            console.warn('Failed to hydrate user profile:', e);
        } finally {
            inFlightHydrationPromise = null;
        }

        return existing;
    })();

    return inFlightHydrationPromise;
}

/**
 * Persist tokens + user after email or Google login.
 * @param {object} payload API body (`{ data: { access_token, user_id, user?, ... } }` or flat)
 */
export function persistAuthSession(payload) {
    if (typeof window === 'undefined') return null;

    const data = payload?.data ?? payload ?? {};
    const userId = String(
        data.user_id || data.user?.id || data.user?.user_id || ''
    ).trim();

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        document.cookie = `auth_token=${accessToken}; path=/; SameSite=Lax`;
    }
    if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
    }
    if (userId) {
        localStorage.setItem('user_id', userId);
    }

    const user = data.user || {};
    const fullName = user.name || data.name || user.full_name || data.full_name || '';
    const nameParts = fullName.trim().split(/\s+/);

    let existingLogins = [];
    try {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed?.last_logins)) existingLogins = parsed.last_logins;
        }
    } catch (_) {}

    const incomingLogins = Array.isArray(user.last_logins || data.last_logins)
        ? (user.last_logins || data.last_logins)
        : existingLogins;

    const now = new Date().toISOString();
    let updatedLogins = [...incomingLogins];
    if (updatedLogins.length === 0 || updatedLogins[updatedLogins.length - 1] !== now) {
        updatedLogins.push(now);
    }
    updatedLogins = updatedLogins.slice(-5);

    const sessionUser = {
        id: userId || user.id || user.user_id || '',
        user_id: userId || user.user_id || user.id || '',
        first_name: user.first_name || data.first_name || (nameParts[0] !== '' ? nameParts[0] : '') || '',
        last_name: user.last_name || data.last_name || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '') || '',
        email: user.email || data.email || '',
        phone_number: user.phone_number || data.phone_number || '',
        referral_code: user.referral_code || data.referral_code || '',
        onboarding_completed: user.onboarding_completed !== undefined
            ? Boolean(user.onboarding_completed)
            : (data.onboarding_completed !== undefined ? Boolean(data.onboarding_completed) : false),
        last_logins: updatedLogins,
    };

    document.cookie = 'has_phone=true; path=/; SameSite=Lax';
    if (sessionUser.onboarding_completed) {
        document.cookie = 'has_completed_onboarding=true; path=/; SameSite=Lax';
        localStorage.setItem('has_completed_onboarding', 'true');
    }

    localStorage.setItem('user', JSON.stringify(sessionUser));
    trackUserLogin('auth_session', sessionUser);
    window.dispatchEvent(new CustomEvent('user:updated'));

    // If sessionUser is missing identity info, trigger async profile hydration
    if (sessionUser.id && (!sessionUser.first_name && !sessionUser.last_name && !sessionUser.name)) {
        hydrateUserFromProfile(sessionUser.id, sessionUser);
    }

    return sessionUser;
}

export function isUserOnboardingCompleted(user = null) {
    if (typeof window === 'undefined') return false;
    const u = user || getStoredUser();
    if (u?.onboarding_completed === true) return true;
    const localFlag = localStorage.getItem('has_completed_onboarding');
    if (localFlag === 'true') return true;
    return false;
}

export function setOnboardingCompletedInSession() {
    if (typeof window === 'undefined') return;
    document.cookie = 'has_completed_onboarding=true; path=/; SameSite=Lax';
    localStorage.setItem('has_completed_onboarding', 'true');
    const stored = localStorage.getItem('user');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            parsed.onboarding_completed = true;
            localStorage.setItem('user', JSON.stringify(parsed));
        } catch (_) {}
    }
    window.dispatchEvent(new CustomEvent('user:updated'));
}

export function clearOnboardingInSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('has_completed_onboarding');
    document.cookie = 'has_completed_onboarding=false; path=/; SameSite=Lax';
    const stored = localStorage.getItem('user');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            parsed.onboarding_completed = false;
            localStorage.setItem('user', JSON.stringify(parsed));
        } catch (_) {}
    }
    window.dispatchEvent(new CustomEvent('user:updated'));
}

/**
 * Primary source of truth: queries users.onboarding_completed from Supabase.
 * Checks by user ID and/or email to ensure robust match.
 * Returns { exists: boolean, onboarding_completed: boolean, is_active: boolean, user: object|null }
 */
export async function fetchUserOnboardingStatus(userId, email) {
    if (!supabase) {
        const localFlag = typeof window !== 'undefined' && localStorage.getItem('has_completed_onboarding') === 'true';
        return { exists: false, onboarding_completed: localFlag, is_active: true, user: null };
    }
    try {
        const cleanUid = userId ? String(userId).trim() : '';
        const cleanEmail = email ? String(email).trim().toLowerCase() : '';
        if (!cleanUid && !cleanEmail) {
            return { exists: false, onboarding_completed: false, is_active: true, user: null };
        }

        let query = supabase.from('users').select('id, email, phone_number, is_phone_verified, is_active, onboarding_completed');
        if (cleanUid && cleanEmail) {
            query = query.or(`id.eq.${cleanUid},email.eq.${cleanEmail}`);
        } else if (cleanUid) {
            query = query.eq('id', cleanUid);
        } else {
            query = query.eq('email', cleanEmail);
        }

        const { data, error } = await query.maybeSingle();
        if (error || !data) {
            return { exists: false, onboarding_completed: false, is_active: true, user: null };
        }

        const isCompleted = data.onboarding_completed === true;
        const isActive = data.is_active !== false;
        const isPhoneVerified = data.is_phone_verified === true;

        return {
            exists: true,
            is_phone_verified: isPhoneVerified,
            onboarding_completed: isCompleted,
            is_active: isActive,
            user: data,
        };
    } catch (e) {
        console.warn('fetchUserOnboardingStatus error:', e);
        return { exists: false, onboarding_completed: false, is_active: true, user: null };
    }
}

export function clearAuthSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('has_completed_onboarding');
    localStorage.removeItem('visible_tab_names');
    
    const cookieNames = ['auth_token', 'has_phone', 'has_completed_onboarding', 'sb-access-token', 'sb-refresh-token'];
    cookieNames.forEach(name => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        if (typeof window !== 'undefined' && window.location.hostname) {
            document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        }
    });

    window.dispatchEvent(new CustomEvent('user:updated'));
    window.dispatchEvent(new CustomEvent('auth:logout'));
}

export function setPhoneVerifiedInSession(phoneNumber) {
    if (typeof window === 'undefined') return;
    if (phoneNumber) {
        document.cookie = 'has_phone=true; path=/; SameSite=Lax';
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                parsed.phone_number = phoneNumber;
                parsed.is_phone_verified = true;
                localStorage.setItem('user', JSON.stringify(parsed));
            } catch (_) {}
        }
        window.dispatchEvent(new CustomEvent('user:updated'));
    }
}

