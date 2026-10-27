"use client";
import Sidebar from '@/components/sidebar';
import Topbar from '@/components/topbar';
import AuthGuard from '@/components/authGuard';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ToolStateProvider } from '@/context/toolState';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { extractAvailableCredits, CREDITS_UPDATED_EVENT, notifyCreditsUpdated, refreshCreditsFromServer } from '@/lib/credits';
import { captureUtmParameters } from '@/lib/utm';
import { getStoredUserId } from '@/lib/authSession';
import { dashboardApi, neweraApi } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import { fetchVisibleTabNames, checkPermissionInSet } from '@/lib/useTabPermission';
import './layout.scss';

const safeDynamic = (importFn) =>
    dynamic(() => importFn().catch((err) => {
        console.warn('Chunk load failed, fallback applied:', err);
        return { default: () => null };
    }), { ssr: false });

const NeweraCreditsModal = safeDynamic(() => import('@/components/neweraCreditsModal'));
const RiskDisclosureModal = safeDynamic(() => import('@/components/riskDisclosureModal'));
const FirebasePhoneModal = safeDynamic(() => import('@/components/firebasePhoneModal'));
const AccessDeniedScreen = safeDynamic(() => import('@/components/AccessDeniedScreen'));

const TOOL_ROUTES = [
    '/chart-scanner',
    '/ai-chart-scanner',
    '/trade-audit',
    '/ai-trade-audit',
    '/trade-advisor',
    '/ai-trade-advisor',
    '/market-assistant',
    '/ai-market-assistant',
    '/live-scanner',
    '/live-market-scanner',
    '/signal-terminal',
    '/trading-signal',
    '/ai-trading-signal',
    '/strategy-hub',
    '/ai-strategy-hub',
    '/strategy-core',
    '/ai-strategy-core',
    '/strategy-signal',
    '/predefined-strategies',
    '/strategy-studio',
    '/ai-strategy-studio',
    '/ai-bot-builder',
    '/bot-builder',
];

const ROUTE_TAB_MAP = {
    '/dashboard': 'Dashboard',
    '/chart-scanner': 'AI Chart Scanner',
    '/ai-chart-scanner': 'AI Chart Scanner',
    '/trade-audit': 'AI Past Trade Analyzer',
    '/ai-trade-audit': 'AI Past Trade Analyzer',
    '/trade-advisor': 'AI Past Trade Analyzer',
    '/ai-trade-advisor': 'AI Past Trade Analyzer',
    '/market-assistant': 'AI Market Assistant',
    '/ai-market-assistant': 'AI Market Assistant',
    '/live-scanner': 'Signal Terminal',
    '/live-market-scanner': 'Signal Terminal',
    '/signal-terminal': 'Signal Terminal',
    '/trading-signal': 'AI Trading Signal',
    '/ai-trading-signal': 'AI Trading Signal',
    '/strategy-hub': 'AI Trading Signal',
    '/ai-strategy-hub': 'AI Trading Signal',
    '/strategy-core': 'AI Trading Signal',
    '/ai-strategy-core': 'AI Trading Signal',
    '/my-bots': 'My Bots',
    '/ai-bot-builder': 'AI Bot Builder',
    '/manual-bot-builder': 'Custom Bot Builder',
    '/custom-bot-builder': 'Custom Bot Builder',
    '/bot-library': 'Browse Bots Library',
    '/browse-bots': 'Browse Bots Library',
    '/bot-builder': 'AI Bot Builder',
    '/strategy-studio': 'AI Bot Builder',
    '/ai-strategy-studio': 'AI Bot Builder',
    '/backtest': 'Backtest',
    '/backtesting': 'Backtest',
    '/strategy-hub/live': 'Signal Terminal',
    '/strategy-hub/strategy': 'Strategy Signal',
    '/strategy-signal': 'Strategy Signal',
    '/predefined-strategies': 'Predefined Strategies',
    '/tools': 'Tools',
    '/calendar': 'Economic Calendar',
    '/economic-calendar': 'Economic Calendar',
    '/calculator': 'Forex Calculator',
    '/forex-calculator': 'Forex Calculator',
    '/news': 'Market News',
    '/market-news': 'Market News',
    '/credit-history': 'Credit History',
    '/plans': 'Subscription Plans',
    '/subscription-plans': 'Subscription Plans',
    '/broker': 'Associated Brokers',
    '/brokers': 'Associated Brokers',
    '/affiliate': 'Affiliate',
    '/dashboard/affiliate': 'Affiliate',
    '/profile': 'Profile',
    '/settings': 'Profile',
    '/customer-support': 'Customer Support',
    '/technical-support': 'Customer Support',
    '/support': 'Customer Support',
};

const layout = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showCreditsModal, setShowCreditsModal] = useState(false);
    const [showRiskModal, setShowRiskModal] = useState(false);
    const [userId, setUserId] = useState('');
    const [isTabAllowed, setIsTabAllowed] = useState(true);
    const [showPhoneVerifyModal, setShowPhoneVerifyModal] = useState(false);
    const [userPhoneNumber, setUserPhoneNumber] = useState('');

    // Check Risk Disclosure acceptance when user navigates to any Tool route
    useEffect(() => {
        const isTool = TOOL_ROUTES.some(r => pathname === r || pathname.startsWith(`${r}/`));
        if (!isTool) {
            setShowRiskModal(false);
            return;
        }

        const activeUid = userId || getStoredUserId();
        try {
            const acceptedKey = activeUid ? `risk_disclosure_accepted_${activeUid}` : null;
            const hasLocalAccepted = (acceptedKey && localStorage.getItem(acceptedKey)) || localStorage.getItem('risk_disclosure_accepted_global');

            if (hasLocalAccepted) {
                setShowRiskModal(false);
                return;
            }

            if (activeUid && supabase) {
                supabase
                    .from('users')
                    .select('risk_accepted_at')
                    .eq('id', activeUid)
                    .maybeSingle()
                    .then(({ data }) => {
                        if (data?.risk_accepted_at) {
                            try {
                                if (acceptedKey) localStorage.setItem(acceptedKey, data.risk_accepted_at);
                                localStorage.setItem('risk_disclosure_accepted_global', data.risk_accepted_at);
                            } catch { /* ignore */ }
                            setShowRiskModal(false);
                        } else {
                            setShowRiskModal(true);
                        }
                    })
                    .catch(() => {
                        setShowRiskModal(true);
                    });
            } else {
                setShowRiskModal(true);
            }
        } catch {
            setShowRiskModal(true);
        }
    }, [pathname, userId]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1200);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('sidebar_collapsed');
            if (stored === 'true') {
                setIsCollapsed(true);
            }
        } catch { /* ignore */ }
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem('sidebar_collapsed', String(next));
            } catch { /* ignore */ }
            return next;
        });
    };

    const handleMenuClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth <= 1200) {
            setIsSidebarOpen(true);
        } else {
            toggleCollapse();
        }
    };

    const checkAndShowModalIfZero = (currentCredits) => {
        if (currentCredits !== undefined && currentCredits !== null) {
            const isBrokerPage = pathname === '/broker' || pathname === '/brokers';
            if (Number(currentCredits) <= 0 && !isBrokerPage) {
                setShowCreditsModal(true);
            } else {
                setShowCreditsModal(false);
            }
        }
    };

    useEffect(() => {
        if (pathname === '/broker' || pathname === '/brokers') {
            setShowCreditsModal(false);
        }
    }, [pathname]);

    useEffect(() => {
        captureUtmParameters();
        const uid = getStoredUserId();
        setUserId(uid);

        if (uid) {
            const syncUtmToDb = async () => {
                try {
                    const { getUtmParameters } = await import('@/lib/utm');
                    const utmParams = getUtmParameters();
                    if ((utmParams.utm_source || utmParams.utm_medium || utmParams.utm_campaign) && supabase) {
                        const { data: dbUser } = await supabase
                            .from('users')
                            .select('utm_source, utm_medium, utm_campaign')
                            .eq('id', uid)
                            .maybeSingle();

                        if (dbUser && !dbUser.utm_source && !dbUser.utm_medium && !dbUser.utm_campaign) {
                            await supabase
                                .from('users')
                                .update({
                                    utm_source: utmParams.utm_source || null,
                                    utm_medium: utmParams.utm_medium || null,
                                    utm_campaign: utmParams.utm_campaign || null
                                })
                                .eq('id', uid);
                        }
                    }
                } catch (e) {
                    console.warn("Failed to sync UTM parameters:", e);
                }
            };
            syncUtmToDb();

            const checkPhoneStatus = async () => {
                if (!supabase || !uid) return;
                try {
                    const hasSkipped = typeof window !== 'undefined' && sessionStorage.getItem('skipPhoneVerification') === 'true';
                    if (hasSkipped) {
                        return;
                    }

                    const { data: dbUser } = await supabase
                        .from('users')
                        .select('phone_number, is_phone_verified')
                        .eq('id', uid)
                        .maybeSingle();

                    if (dbUser) {
                        const isVerified = dbUser.is_phone_verified === true;
                        setUserPhoneNumber(dbUser.phone_number || '');
                        setShowPhoneVerifyModal(!isVerified);
                    }
                } catch (err) {
                    console.warn("Failed to check user phone verification:", err);
                }
            };
            checkPhoneStatus();

            dashboardApi.getStats(uid)
                .then((res) => {
                    const currentCredits = res?.data?.available_credits;
                    checkAndShowModalIfZero(currentCredits);
                })
                .catch((err) => {
                    console.warn("Failed to check initial credits on layout mount:", err);
                });
        }

        let lastVisibilityCheckTime = Date.now();
        const handleTabVisibilityChange = () => {
            const now = Date.now();
            if (document.visibilityState === 'visible' && (now - lastVisibilityCheckTime > 60000)) {
                lastVisibilityCheckTime = now;
                const activeUid = getStoredUserId();
                if (activeUid) {
                    dashboardApi.getStats(activeUid)
                        .then((res) => {
                            const currentCredits = res?.data?.available_credits;
                            checkAndShowModalIfZero(currentCredits);
                        })
                        .catch((err) => {
                            console.warn("Failed to check credits on tab switch:", err);
                        });
                }
            }
        };

        const onCreditsUpdated = (e) => {
            const currentCredits = e?.detail?.available_credits;
            checkAndShowModalIfZero(currentCredits);
        };

        window.addEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
        document.addEventListener('visibilitychange', handleTabVisibilityChange);
        return () => {
            window.removeEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
            document.removeEventListener('visibilitychange', handleTabVisibilityChange);
        };
    }, []);

    const handleCloseOrSkipPhoneModal = () => {
        setShowPhoneVerifyModal(false);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('skipPhoneVerification', 'true');
            if (window.location.pathname !== '/dashboard') {
                window.location.assign('/dashboard');
            }
        }
    };

    const handlePhoneVerifySuccess = (verifiedPhone) => {
        setShowPhoneVerifyModal(false);
        setUserPhoneNumber(verifiedPhone);
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('skipPhoneVerification');
            try {
                const parsed = JSON.parse(localStorage.getItem('user') || '{}');
                parsed.phone_number = verifiedPhone;
                parsed.is_phone_verified = true;
                localStorage.setItem('user', JSON.stringify(parsed));
                document.cookie = 'has_phone=true; path=/; SameSite=Lax';
                window.dispatchEvent(new CustomEvent('user:updated'));
            } catch (_) {}
        }
    };

    useEffect(() => {
        const checkPermission = async () => {
            const currentTabName = Object.entries(ROUTE_TAB_MAP).find(([route]) =>
                pathname === route || (route !== '/' && pathname.startsWith(`${route}/`))
            )?.[1];

            if (
                !currentTabName ||
                currentTabName === 'Dashboard' ||
                currentTabName === 'Affiliate' ||
                currentTabName === 'Profile' ||
                currentTabName === 'Customer Support' ||
                currentTabName === 'Technical Support'
            ) {
                setIsTabAllowed(true);
                return;
            }

            try {
                const visibleNames = await fetchVisibleTabNames();
                if (visibleNames) {
                    const currentLower = (currentTabName || '').toLowerCase().trim();
                    const isAllowed =
                        checkPermissionInSet(visibleNames, currentLower) ||
                        (currentLower === 'backtest' && checkPermissionInSet(visibleNames, 'ai bot builder'));
                    setIsTabAllowed(isAllowed);
                } else {
                    setIsTabAllowed(true);
                }
            } catch (e) {
                console.warn("Failed to check tab permissions:", e);
                setIsTabAllowed(true);
            }
        };

        checkPermission();
    }, [pathname]);

    if (!isTabAllowed) {
        return (
            <AuthGuard>
                <AccessDeniedScreen />
            </AuthGuard>
        );
    }

    const effectiveCollapsed = isMobile ? false : isCollapsed;

    return (
        <AuthGuard>
            <SubscriptionProvider>
                <ToolStateProvider>
                    <div className={`user-layout ${effectiveCollapsed ? 'collapsed' : ''}`}>
                        <div className={`sidebar-wrapper ${effectiveCollapsed ? 'collapsed' : ''} ${isSidebarOpen ? 'open' : ''}`}>
                            <Sidebar
                                onClose={() => setIsSidebarOpen(false)}
                                isCollapsed={effectiveCollapsed}
                                onToggleCollapse={toggleCollapse}
                            />
                        </div>
                        {isSidebarOpen && (
                            <div className='sidebar-overlay' onClick={() => setIsSidebarOpen(false)} />
                        )}
                        <div className='children-wrapper'>
                            <Topbar onMenuClick={handleMenuClick} />
                            <div className='children-spacing'>
                                {children}
                            </div>
                        </div>
                    </div>

                    {showCreditsModal && (
                        <NeweraCreditsModal
                            userId={userId}
                            onClose={() => setShowCreditsModal(false)}
                            onSuccess={(creditsVal) => {
                                setShowCreditsModal(false);
                                if (creditsVal !== undefined && creditsVal !== null) {
                                    notifyCreditsUpdated(creditsVal);
                                } else {
                                    refreshCreditsFromServer();
                                }
                            }}
                        />
                    )}
                    {showRiskModal && (
                        <RiskDisclosureModal
                            isOpen={showRiskModal}
                            userId={userId}
                            onAccept={() => setShowRiskModal(false)}
                        />
                    )}
                    {showPhoneVerifyModal && (
                        <FirebasePhoneModal
                            isOpen={showPhoneVerifyModal}
                            phoneNumber={userPhoneNumber}
                            autoTriggerSend={false}
                            onSuccess={handlePhoneVerifySuccess}
                            onClose={handleCloseOrSkipPhoneModal}
                            onSkip={handleCloseOrSkipPhoneModal}
                        />
                    )}
                </ToolStateProvider>
            </SubscriptionProvider>
        </AuthGuard>
    );
}

export default layout;
