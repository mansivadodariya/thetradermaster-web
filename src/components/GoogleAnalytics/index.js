'use client';

import React, { useEffect, Suspense } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    GA_MEASUREMENT_ID,
    getDeviceMetadata,
    syncUserToGA,
    trackPageView,
    trackUserLogout,
} from '@/lib/gtag';
import { getStoredUser } from '@/lib/authSession';

/**
 * Inner component to track path and search parameter changes safely within Suspense
 */
function AnalyticsRouteTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!pathname) return;
        const query = searchParams?.toString();
        const url = query ? `${pathname}?${query}` : pathname;
        trackPageView(url);
    }, [pathname, searchParams]);

    useEffect(() => {
        // Initial sync on mount
        const initialUser = getStoredUser();
        syncUserToGA(initialUser);

        // Listen for user login / profile hydration updates
        const handleUserUpdate = () => {
            const updatedUser = getStoredUser();
            syncUserToGA(updatedUser);
        };

        // Listen for user logout
        const handleUserLogout = () => {
            trackUserLogout();
        };

        window.addEventListener('user:updated', handleUserUpdate);
        window.addEventListener('auth:logout', handleUserLogout);

        return () => {
            window.removeEventListener('user:updated', handleUserUpdate);
            window.removeEventListener('auth:logout', handleUserLogout);
        };
    }, []);

    return null;
}

/**
 * Google Analytics 4 Script and Session Initializer
 */
export default function GoogleAnalytics() {
    // If no measurement ID is configured, return null gracefully
    if (!GA_MEASUREMENT_ID) {
        return null;
    }

    return (
        <>
            {/* Global Site Tag (gtag.js) */}
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        window.gtag = gtag;
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            send_page_view: false,
                            anonymize_ip: false
                        });
                    `,
                }}
            />
            <Suspense fallback={null}>
                <AnalyticsRouteTracker />
            </Suspense>
        </>
    );
}
