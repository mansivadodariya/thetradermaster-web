'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Loader from '@/components/loader';
import styles from './pageLoader.module.scss';

export default function PageLoader() {
    const pathname = usePathname();
    const [isNavigating, setIsNavigating] = useState(false);
    const timeoutRef = useRef(null);
    const delayRef = useRef(null);
    const currentPathRef = useRef(pathname);

    // Stop loading when pathname changes
    useEffect(() => {
        if (delayRef.current) {
            clearTimeout(delayRef.current);
            delayRef.current = null;
        }
        setIsNavigating(false);
        currentPathRef.current = pathname;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, [pathname]);

    // Listen to link clicks across the application
    useEffect(() => {
        const scheduleLoading = () => {
            if (delayRef.current) clearTimeout(delayRef.current);
            // Wait 200ms before showing loader; instant/prefetched transitions complete without flashing
            delayRef.current = setTimeout(() => {
                setIsNavigating(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setIsNavigating(false);
                }, 4000);
            }, 200);
        };

        const handleClick = (e) => {
            const anchor = e.target.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            if (
                href.startsWith('http://') ||
                href.startsWith('https://') ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                anchor.target === '_blank' ||
                e.ctrlKey ||
                e.metaKey ||
                e.shiftKey ||
                e.altKey ||
                e.defaultPrevented
            ) {
                return;
            }

            const current = (currentPathRef.current || window.location.pathname).split('?')[0].replace(/\/$/, '') || '/';
            const target = href.split('?')[0].replace(/\/$/, '') || '/';

            if (current !== target) {
                scheduleLoading();
            }
        };

        const handleStartLoading = () => {
            scheduleLoading();
        };

        const handleStopLoading = () => {
            if (delayRef.current) {
                clearTimeout(delayRef.current);
                delayRef.current = null;
            }
            setIsNavigating(false);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };

        document.addEventListener('click', handleClick, true);
        window.addEventListener('page:loading:start', handleStartLoading);
        window.addEventListener('page:loading:stop', handleStopLoading);

        return () => {
            document.removeEventListener('click', handleClick, true);
            window.removeEventListener('page:loading:start', handleStartLoading);
            window.removeEventListener('page:loading:stop', handleStopLoading);
            if (delayRef.current) clearTimeout(delayRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <AnimatePresence>
            {isNavigating && (
                <motion.div
                    className={styles.navigationOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                    <motion.div
                        className={styles.loaderContent}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* High-Tech Orbital Core with Center CX Logo */}
                        <Loader size="xl" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
