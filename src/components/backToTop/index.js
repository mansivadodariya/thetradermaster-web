"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import styles from './backToTop.module.scss';

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

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const circleRef = React.useRef(null);
    const pathname = usePathname();
    const { t } = useLanguage();

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

    const isWhatsAppVisible = Boolean(
        cleanPath && (
            publicLandingPages.includes(cleanPath) ||
            publicLandingPages.some(page => page !== '/' && cleanPath.startsWith(page))
        )
    );

    // Circle radius & stroke calculation for 50x50 SVG (desktop) & 44x44 (mobile)
    const radius = 22;
    const circumference = 2 * Math.PI * radius;

    const handleScroll = useCallback(() => {
        if (typeof window === 'undefined') return;

        const childrenWrapper = document.querySelector('.children-wrapper');
        const childrenScrollTop = childrenWrapper ? childrenWrapper.scrollTop : 0;
        const windowScrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const scrollTop = Math.max(windowScrollTop, childrenScrollTop);

        const scrollHeight = (document.documentElement.scrollHeight - document.documentElement.clientHeight) ||
            (childrenWrapper ? childrenWrapper.scrollHeight - childrenWrapper.clientHeight : 0);

        if (scrollHeight > 0 && circleRef.current) {
            const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
            const offset = circumference - (progress / 100) * circumference;
            circleRef.current.style.strokeDashoffset = `${offset}px`;
        }

        const shouldBeVisible = scrollTop > 250;
        setIsVisible((prev) => (prev === shouldBeVisible ? prev : shouldBeVisible));
    }, [circumference]);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        handleScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('scroll', onScroll, { passive: true });
        const childrenWrapper = document.querySelector('.children-wrapper');
        if (childrenWrapper) {
            childrenWrapper.addEventListener('scroll', onScroll, { passive: true });
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('scroll', onScroll);
            if (childrenWrapper) {
                childrenWrapper.removeEventListener('scroll', onScroll);
            }
        };
    }, [handleScroll]);

    const [isNotifPopupOpen, setIsNotifPopupOpen] = useState(false);

    useEffect(() => {
        const handleNotifVis = (e) => {
            setIsNotifPopupOpen(Boolean(e?.detail?.visible));
        };
        window.addEventListener('notification:popup:visibility', handleNotifVis);
        return () => window.removeEventListener('notification:popup:visibility', handleNotifVis);
    }, []);

    const scrollToTop = () => {
        if (typeof window === 'undefined') return;

        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
            try {
                window.lenis.scrollTo(0, { immediate: false, duration: 0.8 });
            } catch (err) {
                console.warn('Lenis scroll error:', err);
            }
        }

        try {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        } catch (_) {
            window.scrollTo(0, 0);
        }

        try {
            document.documentElement.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        } catch (_) {}

        try {
            document.body.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        } catch (_) {}

        const childrenWrapper = document.querySelector('.children-wrapper');
        if (childrenWrapper && childrenWrapper.scrollTop > 0) {
            try {
                childrenWrapper.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            } catch (_) {
                childrenWrapper.scrollTop = 0;
            }
        }
    };

    const positionClass = isNotifPopupOpen
        ? (isWhatsAppVisible ? styles.aboveNotifAndWhatsapp : styles.aboveNotification)
        : (isWhatsAppVisible ? styles.aboveWhatsapp : styles.standalone);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`${styles.backToTopWrapper} ${positionClass}`}
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 15 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                    <button
                        type="button"
                        onClick={scrollToTop}
                        className={styles.backToTopBtn}
                        aria-label={t('common.backToTop', 'Back to top')}
                    >
                        <div className={styles.tooltip}>
                            {t('common.backToTop', 'Back to top')}
                        </div>

                        <svg
                            className={styles.progressRing}
                            width="50"
                            height="50"
                            viewBox="0 0 50 50"
                            aria-hidden="true"
                        >
                            <circle
                                className={styles.progressRingTrack}
                                strokeWidth="2.5"
                                fill="transparent"
                                r={radius}
                                cx="25"
                                cy="25"
                            />
                            <circle
                                ref={circleRef}
                                className={styles.progressRingIndicator}
                                strokeWidth="2.5"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference}
                                strokeLinecap="round"
                                fill="transparent"
                                r={radius}
                                cx="25"
                                cy="25"
                            />
                        </svg>

                        <div className={styles.arrowIconWrap}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={styles.arrowIcon}
                            >
                                <path d="M6 14.5L12 8.5L18 14.5" />
                            </svg>
                        </div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
