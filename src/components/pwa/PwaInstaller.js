'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import InstallModal from './InstallModal';

/**
 * PwaInstaller Component
 * Registers the Service Worker, captures beforeinstallprompt, and manages the center Install TraderMaster modal.
 */
export default function PwaInstaller() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // 1. Service worker registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] Service Worker registration failed:', error);
          });
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
      }
    }

    // 2. Capture install prompt
    if (typeof window !== 'undefined') {
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        window.deferredPwaPrompt = e;
        setDeferredPrompt(e);
        window.dispatchEvent(new CustomEvent('pwa:installable'));
      };

      const handleOpenModal = () => {
        if (!isAuthRoute) {
          setIsModalOpen(true);
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('TraderMaster:open-install-modal', handleOpenModal);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('TraderMaster:open-install-modal', handleOpenModal);
      };
    }
  }, [isAuthRoute]);

  if (isAuthRoute) {
    return null;
  }

  return (
    <InstallModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      deferredPrompt={deferredPrompt}
      onInstalled={() => {
        setIsModalOpen(false);
      }}
    />
  );
}
