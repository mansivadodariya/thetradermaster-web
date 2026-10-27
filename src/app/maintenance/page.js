'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from './maintenance.module.scss';
import { supabase } from '@/lib/supabaseClient';

export default function MaintenancePage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [isChecking, setIsChecking] = useState(false);
  const [pollCountdown, setPollCountdown] = useState(15);
  const [systemRecovered, setSystemRecovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  // Pointer glow mouse tracker
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Dynamic Return to Last Visited Page
  const navigateToLastPage = useCallback(() => {
    if (typeof window === 'undefined') {
      router.push('/');
      return;
    }

    // 1. Check URL redirect parameter (e.g. ?redirect=/chart-scanner)
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect') || urlParams.get('from') || urlParams.get('return_to');
    if (redirectParam && !redirectParam.includes('/maintenance')) {
      router.push(redirectParam);
      return;
    }

    // 2. Check stored last visited page
    const storedPage = sessionStorage.getItem('chronosx_last_visited_page') || localStorage.getItem('chronosx_last_visited_page');
    if (storedPage && !storedPage.includes('/maintenance')) {
      router.push(storedPage);
      return;
    }

    // 3. Check document referrer from same origin
    if (document.referrer && document.referrer.startsWith(window.location.origin)) {
      try {
        const refUrl = new URL(document.referrer);
        if (!refUrl.pathname.includes('/maintenance')) {
          router.push(refUrl.pathname + refUrl.search);
          return;
        }
      } catch (_) {}
    }

    // 4. Fallback: go back in history if available, else root
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  // Check health endpoint
  const checkHealth = useCallback(async (isManual = false) => {
    if (isManual) setIsChecking(true);
    try {
      const res = await fetch('/api/health?detailed=true', {
        cache: 'no-store',
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.status === 'operational') {
        setSystemRecovered(true);
        setTimeout(() => {
          navigateToLastPage();
        }, 800);
      }
    } catch (_) {
      // Offline / still in maintenance
    } finally {
      if (isManual) {
        setTimeout(() => setIsChecking(false), 500);
      }
    }
  }, [navigateToLastPage]);

  // Supabase Realtime Listener for instant reactive recovery
  useEffect(() => {
    if (!supabase) return;
    try {
      const channel = supabase
        .channel('realtime:maintenance_mode_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'system_settings' },
          (payload) => {
            const val = payload?.new?.value;
            if (val !== undefined && val !== null) {
              const raw = String(val).trim().toLowerCase();
              const isEnabled = raw === 'true' || raw === '1' || raw === 'on' || raw.includes('"is_enabled":true') || raw.includes('"is_enabled": true');
              if (!isEnabled) {
                setSystemRecovered(true);
                setTimeout(() => {
                  navigateToLastPage();
                }, 800);
              }
            }
            checkHealth();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('[Maintenance] Supabase realtime error:', err);
    }
  }, [checkHealth, navigateToLastPage]);

  // Periodic Auto-Polling
  useEffect(() => {
    checkHealth();
    const interval = setInterval(() => {
      setPollCountdown((prev) => {
        if (prev <= 1) {
          checkHealth();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  return (
    <div className={styles.maintenancePoster} onMouseMove={handleMouseMove}>
      {/* Interactive Pointer Glow Spotlight */}
      <div
        className={styles.pointerGlow}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
        aria-hidden="true"
      />

      {/* Ambient background glows */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowCenter} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      <main className={styles.posterMain}>
        <motion.div
          className={styles.fullPageContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brand Logo Header */}
          <div className={styles.logoRow}>
            <Image
              src="/assets/logo/logo.png"
              alt="ChronosX"
              width={190}
              height={44}
              priority
              className={styles.brandLogo}
            />
          </div>

          {/* Construction Icon with Emerald Pulse */}
          <div className={styles.heroVisualWrap}>
            <div className={styles.pulseRingWave} />
            <div className={styles.radarRing1} />
            <div className={styles.radarRing2} />
            
            <div className={styles.coreReactor}>
              <Image
                src="/assets/images/construction.png"
                alt="Under Maintenance"
                width={56}
                height={56}
                priority
                className={styles.constructionIcon}
              />
            </div>
          </div>

          {/* Big Impressive Heading */}
          <h1 className={styles.bigHeading}>
            {t('maintenance.titlePrefix', 'Under')}{' '}
            <span className={styles.emeraldGradient}>
              {t('maintenance.titleHighlight', 'Maintenance')}
            </span>
          </h1>

          {/* Reassuring Subtitle */}
          <p className={styles.subtext}>
            {t(
              'maintenance.desc',
              'We are deploying high-frequency model updates and database synchronizations to ensure zero-latency execution and optimal pattern recognition. All trading terminals and features will resume automatically.'
            )}
          </p>

          {/* Action Control Button */}
          <div className={styles.actionWrap}>
            <button
              type="button"
              className={styles.statusBtn}
              onClick={() => checkHealth(true)}
              disabled={isChecking || systemRecovered}
            >
              <svg
                className={isChecking ? styles.spinIcon : ''}
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              <span>{isChecking ? 'CHECKING CONNECTIVITY...' : 'CHECK STATUS NOW'}</span>
            </button>
          </div>

          {/* Auto Sync Timer Row */}
          <div className={styles.autoSyncRow}>
            <span className={styles.syncPulseDot} />
            <span>Automatic reconnection check in {pollCountdown}s</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
