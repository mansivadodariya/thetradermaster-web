'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PageLoader from '@/components/pageLoader';
import BackToTop from '@/components/backToTop';
import WhatsappButton from '@/components/whatsappButton';
import MaintenanceGuard from '@/components/maintenanceGuard';
import NotificationPopup from '@/components/notificationPopup';
import PwaInstaller from '@/components/pwa/PwaInstaller';
import { useTabPermission } from '@/lib/useTabPermission';

import styles from './ClientOnlyWidgets.module.scss';

const SUPPORTED_LOCALES = ['en', 'ar', 'ary', 'es', 'ru', 'zh', 'vi', 'id', 'fil', 'arabic', 'spanish', 'russian', 'chinese', 'vietnamese', 'indonesian', 'filipino', 'darija'];

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

export default function ClientOnlyWidgets() {
    const pathname = usePathname();

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
        if (typeof window !== 'undefined' && pathname && !pathname.includes('/maintenance') && !pathname.startsWith('/api/')) {
            try {
                const full = window.location.pathname + window.location.search;
                sessionStorage.setItem('tradermaster_last_visited_page', full);
                localStorage.setItem('tradermaster_last_visited_page', full);
            } catch (_) {}
        }
    }, [pathname]);

    const publicLandingPages = [
        '/',
        '/capabilities',
        '/economic-calendar',
        '/forex-calculator',
        '/market-news',
        '/blogs',
        '/about-us',
        '/contact-us',
        '/terms-and-conditions',
        '/privacy-policy',
        '/risk-disclosure',
        '/plans',
        '/white-label',
        '/affiliate-program',
        '/ai-chart-scanner',
        '/ai-market-assistant',
        '/ai-strategy-core',
        '/ai-strategy-hub',
        '/ai-trade-advisor',
        '/ai-trade-audit',
        '/ai-trading-signal',
        '/backtesting',
        '/custom-bot-builder',
        '/live-market-scanner',
        '/no-refund-policy',
        '/supported-brokers'
    ];

    const cleanPath = stripLocalePrefix(pathname);

    const isPublicPage = Boolean(
        cleanPath && (
            publicLandingPages.includes(cleanPath) ||
            publicLandingPages.some(page => page !== '/' && cleanPath.startsWith(page))
        )
    );

    const hasNotificationsPermission = useTabPermission('notifications');

    return (
        <>
            <MaintenanceGuard />
            <PageLoader />
            <BackToTop />
            <WhatsappButton />
            {!isAuthRoute && (
                <>
                    <PwaInstaller />
                    {hasNotificationsPermission && (
                        <div className={`${styles.bottomWidgetsStack} ${isPublicPage ? styles.aboveWhatsapp : styles.standalone}`}>
                            <NotificationPopup />
                        </div>
                    )}
                </>
            )}
        </>
    );
}
