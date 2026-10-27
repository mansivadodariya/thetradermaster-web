'use client';

import CommonSectionHeader from '@/components/CommonSectionHeader';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './profile.module.scss';
import CreditHistory from '@/rendering/creditHistory';
import { supabase } from '@/lib/supabaseClient';
import { fetchVisibleTabNames, getVisibleTabNamesSync, checkPermissionInSet } from '@/lib/useTabPermission';
import { toast } from '@/components/toast';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { profileApi, dashboardApi } from '@/lib/api';
import { CREDITS_UPDATED_EVENT } from '@/lib/credits';
import { useLanguage } from '@/context/LanguageContext';

import ProfileSidebarNav from './components/ProfileSidebarNav';
import ProfileDetailsTab from './components/ProfileDetailsTab';
import ProfileSecurityTab from './components/ProfileSecurityTab';
import ProfileActivityLogTab from './components/ProfileActivityLogTab';
import ProfileRightSidebar from './components/ProfileRightSidebar';
import ProfileModals from './components/ProfileModals';
import ProfilePaymentHistoryTab from './components/ProfilePaymentHistoryTab';
import ProfilePreferencesTab from './components/ProfilePreferencesTab';
import ProfileNotificationsTab from './components/ProfileNotificationsTab';
import TradingProfileModal from './components/TradingProfileModal';
import ProfileSkeleton from './components/ProfileSkeleton';
import { tradingAnalysisApi } from '@/lib/tradingAnalysisApi';
import { getUnreadCount } from '@/services/notificationService';

function getUserFromStorage() {
    try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

function parseLogins(rawLogins) {
    if (!rawLogins) return [];
    if (Array.isArray(rawLogins)) return rawLogins;
    if (typeof rawLogins === 'string') {
        const trimmed = rawLogins.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                return JSON.parse(trimmed);
            } catch (_) {}
        }
        if (trimmed) return [trimmed];
    }
    return [];
}

export default function Profile() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab');
    const { t, language } = useLanguage();

    const [activeTab, setActiveTab] = useState(tabParam || 'profile');
    const [userId, setUserId] = useState('');
    const [userCreatedAt, setUserCreatedAt] = useState('May 12, 2024');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [credits, setCredits] = useState(0);
    const [lastLogins, setLastLogins] = useState([]);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [initialPhone, setInitialPhone] = useState('');
    const [referralCount, setReferralCount] = useState(0);
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);
    const [visibleTabNames, setVisibleTabNames] = useState(() => getVisibleTabNamesSync());
    const [onboardingData, setOnboardingData] = useState(null);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const refreshUnreadNotifs = async (uid) => {
        if (!uid || (visibleTabNames && !checkPermissionInSet(visibleTabNames, 'notifications'))) return;
        try {
            const count = await getUnreadCount(uid);
            setUnreadNotifCount(count || 0);
        } catch (_) {}
    };

    // Modals
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
    const [passwordUpdating, setPasswordUpdating] = useState(false);
    const [tradingProfileData, setTradingProfileData] = useState(() => {
        try {
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem('tradermaster_trading_profile_data');
                return cached ? JSON.parse(cached) : null;
            }
        } catch (_) {}
        return null;
    });
    const [showTradingProfileModal, setShowTradingProfileModal] = useState(false);

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        referral_code: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchVisibleTabNames().then(set => {
            if (set) setVisibleTabNames(set);
        });
        const onTabPerms = (e) => {
            if (e?.detail) setVisibleTabNames(e.detail);
        };
        window.addEventListener('tab_permissions:updated', onTabPerms);
        return () => window.removeEventListener('tab_permissions:updated', onTabPerms);
    }, []);

    useEffect(() => {
        if (tabParam && ['profile', 'security', 'activity_log', 'credit_history', 'payment_history', 'preferences', 'notifications'].includes(tabParam)) {
            if (tabParam === 'notifications' && visibleTabNames && !checkPermissionInSet(visibleTabNames, 'notifications')) {
                setActiveTab('profile');
            } else {
                setActiveTab(tabParam);
            }
        }
    }, [tabParam, visibleTabNames]);

    useEffect(() => {
        if (visibleTabNames && !checkPermissionInSet(visibleTabNames, 'notifications') && activeTab === 'notifications') {
            setActiveTab('profile');
        }
    }, [visibleTabNames, activeTab]);

    const canViewPlans = () => {
        if (!visibleTabNames) return true;
        return (
            visibleTabNames.has('subscription plans') ||
            visibleTabNames.has('subscription_plans') ||
            visibleTabNames.has('plans') ||
            visibleTabNames.has('subscription') ||
            visibleTabNames.has('proAccount')
        );
    };

    useEffect(() => {
        const user = getUserFromStorage();
        if (!user) { router.replace('/login'); return; }
        const id = user.id || user.user_id || '';
        setUserId(id);
        setInitialPhone(user.phone_number || '');
        setIsPhoneVerified(user.is_phone_verified === true);

        if (user.created_at) {
            try {
                const d = new Date(user.created_at);
                if (!isNaN(d.getTime())) {
                    setUserCreatedAt(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                }
            } catch (_) {}
        }

        setForm({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            referral_code: user.referral_code || id || '',
        });

        const initialLogins = parseLogins(user.last_logins);
        if (initialLogins.length > 0) {
            setLastLogins(initialLogins.slice(-5));
        }

        try {
            const cachedOnboarding = localStorage.getItem('tradermaster_onboarding');
            if (cachedOnboarding) {
                setOnboardingData(JSON.parse(cachedOnboarding));
            }
        } catch (_) {}

        refreshUnreadNotifs(id);
        fetchProfile(id);
    }, []);

    useEffect(() => {
        const onCreditsUpdated = (e) => {
            const next = e?.detail?.available_credits;
            if (next !== undefined && next !== null) {
                setCredits(next);
            }
        };
        window.addEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
        const onNotifUpdated = () => {
            if (userId) refreshUnreadNotifs(userId);
        };
        window.addEventListener('notification:updated', onNotifUpdated);
        return () => {
            window.removeEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
            window.removeEventListener('notification:updated', onNotifUpdated);
        };
    }, [userId]);

    const fetchProfile = async (id) => {
        setLoading(true);
        try {
            if (supabase && id) {
                try {
                    const { data } = await supabase
                        .from('users')
                        .select('first_name, last_name, email, phone_number, is_phone_verified, referral_code, last_logins, created_at, experience_level, trading_styles, help_goals, preferred_markets, onboarding_completed, onboarding_completed_at')
                        .eq('id', id)
                        .maybeSingle();

                    if (data) {
                        if (typeof data.is_phone_verified === 'boolean') {
                            setIsPhoneVerified(data.is_phone_verified);
                        }
                        const parsedDbLogins = parseLogins(data.last_logins);
                        if (parsedDbLogins.length > 0) {
                            setLastLogins(parsedDbLogins.slice(-5));
                        }
                        if (data.created_at) {
                            const d = new Date(data.created_at);
                            if (!isNaN(d.getTime())) {
                                setUserCreatedAt(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                            }
                        }
                        if (data.phone_number) setInitialPhone(data.phone_number);
                        setForm((prev) => ({
                            ...prev,
                            first_name: data.first_name || prev.first_name || '',
                            last_name: data.last_name || prev.last_name || '',
                            email: data.email || prev.email || '',
                            phone_number: data.phone_number || prev.phone_number || '',
                            referral_code: data.referral_code || prev.referral_code || id || '',
                        }));

                        if (data.experience_level || data.trading_styles || data.help_goals || data.preferred_markets || data.onboarding_completed) {
                            const parseArr = (val) => {
                                if (Array.isArray(val)) return val;
                                if (typeof val === 'string') {
                                    try {
                                        const parsed = JSON.parse(val);
                                        if (Array.isArray(parsed)) return parsed;
                                    } catch (_) {}
                                    return [val];
                                }
                                return [];
                            };

                            const surveyObj = {
                                experience: data.experience_level || '',
                                tradingStyles: parseArr(data.trading_styles),
                                helpGoals: parseArr(data.help_goals),
                                markets: parseArr(data.preferred_markets),
                                completed: !!data.onboarding_completed,
                                completedAt: data.onboarding_completed_at || null,
                            };
                            setOnboardingData(surveyObj);
                            try {
                                localStorage.setItem('tradermaster_onboarding', JSON.stringify(surveyObj));
                            } catch (_) {}
                        }
                    }

                    const { count: refCount, error: countErr } = await supabase
                        .from('users')
                        .select('id', { count: 'exact', head: true })
                        .eq('referred_by_id', id);

                    if (!countErr && typeof refCount === 'number') {
                        setReferralCount(refCount);
                    }
                } catch (sbErr) {
                    console.warn('Supabase profile fetch error:', sbErr);
                }
            }

            const apiRes = await profileApi.getProfile();
            const profileData = apiRes?.data || apiRes || {};
            if (profileData) {
                if (profileData.phone_number) setInitialPhone(profileData.phone_number);
                setForm((prev) => ({
                    ...prev,
                    first_name: profileData.first_name || prev.first_name || '',
                    last_name: profileData.last_name || prev.last_name || '',
                    email: profileData.email || prev.email || '',
                    phone_number: profileData.phone_number || prev.phone_number || '',
                    referral_code: profileData.referral_code || prev.referral_code || id || '',
                }));

                const apiRefCount = profileData.referral_count ?? profileData.referred_count ?? profileData.total_referrals;
                if (typeof apiRefCount === 'number') {
                    setReferralCount(apiRefCount);
                }

                const fetchedLogins = parseLogins(profileData.last_logins);
                if (fetchedLogins.length > 0) {
                    setLastLogins(fetchedLogins.slice(-5));
                }

                const stored = getUserFromStorage() || {};
                const updated = {
                    ...stored,
                    first_name: profileData.first_name || stored.first_name || '',
                    last_name: profileData.last_name || stored.last_name || '',
                    email: profileData.email || stored.email || '',
                    phone_number: profileData.phone_number || stored.phone_number || '',
                    last_logins: fetchedLogins.length > 0 ? fetchedLogins.slice(-5) : stored.last_logins || [],
                };
                localStorage.setItem('user', JSON.stringify(updated));
                window.dispatchEvent(new Event('user:updated'));
            }

            if (id) {
                try {
                    const statsRes = await dashboardApi.getStats(id);
                    if (statsRes?.data?.available_credits !== undefined) {
                        setCredits(statsRes.data.available_credits);
                    }
                } catch (statsErr) {
                    console.warn('Credits fetch error:', statsErr);
                }
            }

            // Fetch Trading Profile Analysis via GET API
            try {
                const analysisRes = await tradingAnalysisApi.getTradingAnalysis();
                const tData = analysisRes?.data || (analysisRes?.has_saved_profile || analysisRes?.preferences || analysisRes?.latest_analysis || analysisRes?.analysis || analysisRes?.assessment ? analysisRes : null);
                if (tData) {
                    setTradingProfileData(tData);
                    try {
                        localStorage.setItem('tradermaster_trading_profile_data', JSON.stringify(tData));
                    } catch (_) {}
                }
            } catch (analysisErr) {
                console.warn('Trading analysis fetch error:', analysisErr);
            }
        } catch (err) {
            console.warn('Profile fetch warning:', err);
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const errs = {};
        const firstName = form.first_name.trim();
        const lastName = form.last_name.trim();

        if (!firstName) {
            errs.first_name = t('profile.firstNameRequired', 'First name is required.');
        } else if (firstName.length < 2) {
            errs.first_name = t('profile.firstNameMinLength', 'First name must be at least 2 characters.');
        }

        if (!lastName) {
            errs.last_name = t('profile.lastNameRequired', 'Last name is required.');
        } else if (lastName.length < 2) {
            errs.last_name = t('profile.lastNameMinLength', 'Last name must be at least 2 characters.');
        }

        if (!form.phone_number) {
            errs.phone_number = t('profile.phoneRequired', 'Phone number is required.');
        } else if (!isValidPhoneNumber(form.phone_number)) {
            errs.phone_number = t('profile.phoneInvalid', 'Enter a valid phone number.');
        }

        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitized = value;
        if (name === 'first_name' || name === 'last_name') {
            sanitized = value.replace(/[^a-zA-Z\s]/g, '');
        }
        setForm((prev) => ({ ...prev, [name]: sanitized }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handlePhoneChange = (value) => {
        setForm((prev) => ({ ...prev, phone_number: value || '' }));
        setErrors((prev) => ({ ...prev, phone_number: '' }));
    };

    const performSaveProfile = async () => {
        setSaving(true);
        try {
            const apiRes = await profileApi.updateProfile({
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                phone_number: form.phone_number,
            });

            const stored = getUserFromStorage() || {};
            if (supabase && stored?.id) {
                try {
                    await supabase
                        .from('users')
                        .update({
                            phone_number: form.phone_number,
                            is_phone_verified: true
                        })
                        .eq('id', stored.id);
                } catch (dbErr) {
                    console.warn("Supabase direct phone update error:", dbErr);
                }
            }

            const updated = {
                ...stored,
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                phone_number: form.phone_number,
                is_phone_verified: true
            };
            localStorage.setItem('user', JSON.stringify(updated));
            setInitialPhone(form.phone_number);
            setIsPhoneVerified(true);
            setIsEditing(false);
            window.dispatchEvent(new Event('user:updated'));

            toast.success(apiRes?.message || 'Profile updated successfully.');
        } catch (err) {
            toast.error(err.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
            setShowOtpModal(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        performSaveProfile();
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    const displayLogins = (lastLogins.length > 0 ? [...lastLogins] : []).reverse();
    const fullName = `${form.first_name || 'John'} ${form.last_name || 'Doe'}`.trim();
    const displayUid = userId ? `UID: CHX${userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 9).toUpperCase()}` : 'UID: CHX789456123';
    const initials = [form.first_name, form.last_name]
        .filter(Boolean)
        .map((n) => n.charAt(0).toUpperCase())
        .join('') || (form.email ? form.email.charAt(0).toUpperCase() : 'U');

    const hasNotificationsPermission = !visibleTabNames || checkPermissionInSet(visibleTabNames, 'notifications');

    const subMenuItems = [
        {
            id: 'profile',
            title: t('profile.profileTab', 'My Profile'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        },
        {
            id: 'security',
            title: t('profile.securityTab', 'Security'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            )
        },
        {
            id: 'activity_log',
            title: t('profile.recentActivity', 'Activity Log'),
            count: displayLogins.length,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            )
        },
        {
            id: 'credit_history',
            title: t('creditHistory.title', 'Credit History'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
            )
        },
        {
            id: 'payment_history',
            title: t('profile.paymentHistory', 'Payment History'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            )
        },
        {
            id: 'preferences',
            title: t('profile.preferences', 'Preferences'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            )
        },
        ...(hasNotificationsPermission ? [{
            id: 'notifications',
            title: t('notifications.title', 'Notifications'),
            count: unreadNotifCount,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
            )
        }] : [])
    ];

    return (
        <div className={styles.profile}>
            {/* Top Page Header */}
            <CommonSectionHeader
                badge={t('profile.badge', 'TRADER PROFILE & SECURITY SUITE')}
                badgeIcon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                }
                title={t('profile.mySettings', 'Settings')}
                subtitle={t('profile.settingsSubtitle', 'Manage your personal profile, security settings, and account preferences')}
                isCard={true}
            />

            {/* 3-Column Profile Layout */}
            <div className={styles.profileLayoutGrid}>
                {/* 1. Left Sidebar Navigation */}
                <ProfileSidebarNav
                    subMenuItems={subMenuItems}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {/* 2. Middle Column: Main Profile Area */}
                <div className={styles.mainContentColumn}>
                    {activeTab === 'profile' && (
                        <ProfileDetailsTab
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            initials={initials}
                            fullName={fullName}
                            form={form}
                            displayUid={displayUid}
                            userCreatedAt={userCreatedAt}
                            errors={errors}
                            handleChange={handleChange}
                            handlePhoneChange={handlePhoneChange}
                            handleSave={handleSave}
                            saving={saving}
                            onboardingData={onboardingData}
                            tradingProfileData={tradingProfileData}
                            onOpenTradingProfileModal={() => setShowTradingProfileModal(true)}
                            t={t}
                        />
                    )}

                    {activeTab === 'security' && (
                        <ProfileSecurityTab
                            setShowPasswordModal={setShowPasswordModal}
                            t={t}
                        />
                    )}

                    {activeTab === 'activity_log' && (
                        <ProfileActivityLogTab
                            displayLogins={displayLogins}
                            t={t}
                        />
                    )}

                    {activeTab === 'credit_history' && (
                        <div className={styles.tabContentPanel}>
                            <CreditHistory embedded={true} />
                        </div>
                    )}

                    {activeTab === 'payment_history' && (
                        <div className={styles.tabContentPanel}>
                            <ProfilePaymentHistoryTab t={t} />
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className={styles.tabContentPanel}>
                            <ProfilePreferencesTab t={t} />
                        </div>
                    )}

                    {activeTab === 'notifications' && hasNotificationsPermission && (
                        <ProfileNotificationsTab
                            userId={userId}
                            t={t}
                            onUnreadCountChanged={() => refreshUnreadNotifs(userId)}
                        />
                    )}
                </div>

                {/* 3. Right Sidebar: Account Summary & Quick Actions */}
                <ProfileRightSidebar
                    referralCount={referralCount}
                    credits={credits}
                    canViewPlans={canViewPlans}
                    router={router}
                    setShowPasswordModal={setShowPasswordModal}
                    setActiveTab={setActiveTab}
                    setShowLogoutConfirm={setShowLogoutConfirm}
                    isPhoneVerified={isPhoneVerified}
                    onVerifyPhoneClick={() => setShowOtpModal(true)}
                    t={t}
                />
            </div>

            {/* Modals: Password, Logout, Firebase Phone OTP */}
            <ProfileModals
                showPasswordModal={showPasswordModal}
                setShowPasswordModal={setShowPasswordModal}
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                passwordUpdating={passwordUpdating}
                setPasswordUpdating={setPasswordUpdating}
                userId={userId}
                email={form.email}
                showLogoutConfirm={showLogoutConfirm}
                setShowLogoutConfirm={setShowLogoutConfirm}
                showOtpModal={showOtpModal}
                setShowOtpModal={setShowOtpModal}
                phoneNumber={form.phone_number}
                performSaveProfile={performSaveProfile}
                router={router}
                t={t}
            />

            {/* Trading Profile & Strategy Analysis Modal */}
            <TradingProfileModal
                isOpen={showTradingProfileModal}
                onClose={() => setShowTradingProfileModal(false)}
                onSuccess={(updated) => {
                    setTradingProfileData(updated);
                    try {
                        localStorage.setItem('tradermaster_trading_profile_data', JSON.stringify(updated));
                    } catch (_) {}
                }}
                initialPreferences={tradingProfileData?.preferences}
                onboardingData={onboardingData}
                user={form}
                t={t}
            />
        </div>
    );
}

