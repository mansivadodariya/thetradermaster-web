'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './not-found.module.scss';

export default function ErrorBoundary({ error, reset }) {
  let t = (k, fallback) => fallback;
  try {
    const langCtx = useLanguage();
    if (langCtx?.t) t = langCtx.t;
  } catch (_) {}

  const [countdown, setCountdown] = useState(5);
  const [isRetrying, setIsRetrying] = useState(false);

  const performHardRefresh = useCallback(() => {
    setIsRetrying(true);
    if (typeof window === 'undefined') {
      reset();
      return;
    }

    try {
      // Clear CacheStorage (PWA / service worker / asset cache)
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        }).catch(() => {});
      }

      // Force browser to bypass disk cache by navigating with cache-buster
      const url = new URL(window.location.href);
      url.searchParams.set('_r', String(Date.now()));
      window.location.replace(url.toString());
    } catch (_) {
      window.location.reload();
    }
  }, [reset]);

  const handleRetry = useCallback(() => {
    performHardRefresh();
  }, [performHardRefresh]);

  useEffect(() => {
    console.error('ChronosX Segment Error caught:', error);

    const errorMessage = String(error?.message || '');
    const errorName = String(error?.name || '');
    const isChunkOrNetworkError =
      errorName === 'ChunkLoadError' ||
      errorMessage.includes('Loading chunk') ||
      errorMessage.includes('Failed to fetch dynamically imported module') ||
      errorMessage.includes('Load failed') ||
      errorMessage.includes('Unexpected token') ||
      errorMessage.includes('NetworkError');

    if (isChunkOrNetworkError && typeof window !== 'undefined') {
      const retryKey = 'chunk_err_retry_' + window.location.pathname;
      const lastRetry = sessionStorage.getItem(retryKey);
      const now = Date.now();
      // Auto-hard-refresh immediately for chunk errors (max once every 12 seconds per path)
      if (!lastRetry || now - Number(lastRetry) > 12000) {
        sessionStorage.setItem(retryKey, String(now));
        performHardRefresh();
        return;
      }
    }

    // Auto-countdown to reconnect automatically so the user is never permanently stuck
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [error, handleRetry]);

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowCenter} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      <main className={styles.mainContent}>
        <div className="container">
          <div className={styles.contentWrapper}>
            <div className={styles.syncStatusTag}>
              <span className={styles.pulseDotGreen} />
              <span>{t('errors.boundary.tag', 'AUTO-RECONNECTING • LIVE SYNC')}</span>
            </div>

            <div className={styles.reconnectVisualWrap} aria-hidden="true">
              <div className={styles.pulseWave} />
              <div className={styles.radarRingOuter} />
              <div className={styles.radarRingInner} />
              <div className={styles.reconnectOrbCore}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
              </div>
            </div>

            <h2 className={styles.heading}>
              {t('errors.boundary.headingPrefix', 'We Will')}{' '}
              <span className={styles.goldGradient}>{t('errors.boundary.headingHighlight', 'Connect Soon')}</span>
            </h2>

            <p className={styles.description}>
              {t('errors.boundary.description', 'Establishing a secure connection with the live telemetry engine. Your session and settings are safely preserved. You can retry connection or return to your main desk.')}
            </p>

            <div className={styles.actionButtons}>
              <button
                type="button"
                className={`${styles.btn} ${styles.primaryBtn}`}
                onClick={handleRetry}
                disabled={isRetrying}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                <span>
                  {isRetrying
                    ? (t('errors.boundary.reconnecting', 'RECONNECTING...'))
                    : `${t('errors.boundary.retry', 'RETRY CONNECTION')}${countdown > 0 ? ` (${countdown}s)` : ''}`}
                </span>
              </button>

              <Link href="/dashboard" className={`${styles.btn} ${styles.secondaryBtn}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
                <span>{t('errors.boundary.dashboard', 'DASHBOARD')}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
