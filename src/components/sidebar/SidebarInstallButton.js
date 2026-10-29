'use client';

import React, { useState, useEffect } from 'react';
import InstallModal from '@/components/pwa/InstallModal';
import { useLanguage } from '@/context/LanguageContext';
import styles from './SidebarInstallButton.module.scss';

export default function SidebarInstallButton({ isCollapsed }) {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        document.referrer.includes('android-app://');

      setIsStandalone(Boolean(standalone));

      // Check if global prompt already caught
      if (window.deferredPwaPrompt) {
        setDeferredPrompt(window.deferredPwaPrompt);
      }

      const handlePrompt = (e) => {
        e.preventDefault();
        window.deferredPwaPrompt = e;
        setDeferredPrompt(e);
      };

      const handleInstallableEvent = () => {
        if (window.deferredPwaPrompt) {
          setDeferredPrompt(window.deferredPwaPrompt);
        }
      };

      window.addEventListener('beforeinstallprompt', handlePrompt);
      window.addEventListener('pwa:installable', handleInstallableEvent);

      return () => {
        window.removeEventListener('beforeinstallprompt', handlePrompt);
        window.removeEventListener('pwa:installable', handleInstallableEvent);
      };
    }
  }, []);

  if (isStandalone) {
    return null;
  }

  return (
    <>
      <div className={isCollapsed ? styles.installWrapperCollapsed : styles.installWrapper}>
        {isCollapsed ? (
          <button
            type="button"
            className={styles.collapsedBtn}
            onClick={() => setShowModal(true)}
            aria-label={t('sidebar.installApp', 'Install App')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className={styles.tooltip}>{t('sidebar.installTraderMasterApp', 'Install TraderMaster App')}</span>
          </button>
        ) : (
          <button
            type="button"
            className={styles.installBtn}
            onClick={() => setShowModal(true)}
            id="sidebar-install-app-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={styles.downloadIcon}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className={styles.btnText}>{t('sidebar.installApp', 'Install App')}</span>
          </button>
        )}
      </div>

      <InstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        deferredPrompt={deferredPrompt}
        onInstalled={() => {
          setIsStandalone(true);
          setShowModal(false);
        }}
      />
    </>
  );
}
