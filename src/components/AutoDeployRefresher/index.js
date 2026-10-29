'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * AutoDeployRefresher
 * 
 * Automatically detects when a new deployment goes live and reloads
 * the browser for all active users so they immediately receive the latest build
 * and never run outdated cached code or encounter ChunkLoadErrors.
 */
export default function AutoDeployRefresher() {
    const initialVersionRef = useRef(null);
    const isReloadingRef = useRef(false);
    const [updatingNotice, setUpdatingNotice] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const CHECK_INTERVAL_MS = 30000; // Check every 30 seconds
        let isMounted = true;
        let timer = null;

        const performHardReload = (reason = '') => {
            if (isReloadingRef.current) return;
            isReloadingRef.current = true;
            setUpdatingNotice(true);

            console.log(`[AutoDeploy] ${reason} -> refreshing to latest deployment...`);

            // Clear CacheStorage to ensure no stale SW/browser caches survive
            if ('caches' in window) {
                try {
                    caches.keys().then((keys) => {
                        return Promise.all(keys.map((k) => caches.delete(k)));
                    }).catch(() => {});
                } catch (_) {}
            }

            // Signal Service Worker to update/skip waiting
            if ('serviceWorker' in navigator) {
                try {
                    navigator.serviceWorker.getRegistrations().then((regs) => {
                        regs.forEach((r) => {
                            if (r.waiting) r.waiting.postMessage({ type: 'SKIP_WAITING' });
                            r.update().catch(() => {});
                        });
                    }).catch(() => {});
                } catch (_) {}
            }

            // Brief delay to allow notice to render, then hard reload
            setTimeout(() => {
                window.location.reload();
            }, 800);
        };

        const checkDeploymentVersion = async () => {
            if (isReloadingRef.current || !navigator.onLine) return;

            try {
                const res = await fetch(`/api/version?_t=${Date.now()}`, {
                    method: 'GET',
                    cache: 'no-store',
                    headers: {
                        'Pragma': 'no-cache',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                    },
                });

                if (!res.ok) return;
                const data = await res.json();
                const remoteVersion = data?.version;

                if (!remoteVersion || !isMounted) return;

                if (!initialVersionRef.current) {
                    // First check on mount: record the current deployment baseline
                    initialVersionRef.current = remoteVersion;
                } else if (initialVersionRef.current !== remoteVersion) {
                    // New deployment detected!
                    performHardReload(`New version detected (${initialVersionRef.current} -> ${remoteVersion})`);
                }
            } catch (_) {
                // Silently ignore network hiccups
            }
        };

        // 1. Initial check baseline
        checkDeploymentVersion();

        // 2. Periodic background polling
        timer = setInterval(checkDeploymentVersion, CHECK_INTERVAL_MS);

        // 3. Instant check when user switches back to this tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkDeploymentVersion();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', checkDeploymentVersion);

        // 4. ChunkLoadError recovery (when new build replaces chunk hashes on server)
        const handleError = (e) => {
            const msg = (e?.message || '').toLowerCase();
            if (msg.includes('chunkloaderror') || msg.includes('loading chunk') || msg.includes('failed to fetch dynamically imported module')) {
                performHardReload('Chunk hash mismatch after deployment');
            }
        };

        const handleUnhandledRejection = (e) => {
            const reasonMsg = (e?.reason?.message || e?.reason?.name || '').toLowerCase();
            if (reasonMsg.includes('chunkloaderror') || reasonMsg.includes('loading chunk') || reasonMsg.includes('failed to fetch dynamically imported module')) {
                performHardReload('ChunkLoadError promise rejection');
            }
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        // 5. Service Worker controllerchange listener
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!isReloadingRef.current) {
                    performHardReload('Service worker updated');
                }
            });
        }

        return () => {
            isMounted = false;
            if (timer) clearInterval(timer);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', checkDeploymentVersion);
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    if (!updatingNotice) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                background: 'rgba(8, 20, 15, 0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '999px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.25)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                pointerEvents: 'none',
                animation: 'pulse 1.5s infinite',
            }}
        >
            <span
                style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                }}
            />
            <span>New version deployed. Refreshing to latest build...</span>
        </div>
    );
}
