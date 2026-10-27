'use client';

import React, { useState, useEffect } from 'react';
import styles from './InstallModal.module.scss';

export default function InstallModal({ isOpen, onClose, deferredPrompt, onInstalled }) {
  const [activeTab, setActiveTab] = useState('laptop');
  const [supportsOneTap, setSupportsOneTap] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installFeedback, setInstallFeedback] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setActiveTab('iphone');
      } else if (/android/.test(ua)) {
        setActiveTab('android');
      } else {
        setActiveTab('laptop');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const prompt = deferredPrompt || (typeof window !== 'undefined' ? window.deferredPwaPrompt : null);
    setSupportsOneTap(Boolean(prompt));
  }, [deferredPrompt, isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || (typeof window !== 'undefined' ? window.deferredPwaPrompt : null);
    if (prompt) {
      try {
        setIsInstalling(true);
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') {
          window.deferredPwaPrompt = null;
          setSupportsOneTap(false);
          onInstalled?.();
          onClose();
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      } finally {
        setIsInstalling(false);
      }
    } else {
      if (typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone)) {
        setInstallFeedback('TraderMaster is already installed on this device.');
      } else if (activeTab === 'iphone') {
        setInstallFeedback("Tap the Share icon in Safari's bottom toolbar, then tap 'Add to Home Screen' ➕");
      } else if (activeTab === 'android') {
        setInstallFeedback("Tap the 3-dot menu (⋮) at top-right of Chrome, then tap 'Install app'");
      } else {
        setInstallFeedback("Click the install icon (⊕ / ⤓) in the right side of your browser address bar.");
      }
      setTimeout(() => setInstallFeedback(''), 6000);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="install-modal-title">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.iconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h2 id="install-modal-title" className={styles.title}>Install TraderMaster</h2>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p className={styles.subtitle}>
            Add TraderMaster to your device for faster access, a full-screen experience, and an app-like feel.
          </p>
        </div>

        {/* Device Switcher Tabs */}
        <div className={styles.tabsContainer} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'iphone'}
            className={`${styles.tabBtn} ${activeTab === 'iphone' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('iphone')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span>iPhone</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'android'}
            className={`${styles.tabBtn} ${activeTab === 'android' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('android')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span>Android</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'laptop'}
            className={`${styles.tabBtn} ${activeTab === 'laptop' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('laptop')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <line x1="2" y1="20" x2="22" y2="20" />
            </svg>
            <span>Laptop</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        <div className={styles.stepsList}>
          {activeTab === 'laptop' && (
            <>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>1</span>
                <p className={styles.stepText}>
                  Open TraderMaster in <strong>Chrome</strong> or <strong>Edge</strong>.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>2</span>
                <p className={styles.stepText}>
                  Look for the <strong>install icon</strong>{' '}
                  <span className={styles.inlineIconWrap}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </span>{' '}
                  at the right end of the address bar.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>3</span>
                <p className={styles.stepText}>
                  Click it, then click <strong>Install</strong>.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>4</span>
                <p className={styles.stepText}>
                  TraderMaster opens in its own window and is added to your dock or taskbar.
                </p>
              </div>
            </>
          )}

          {activeTab === 'iphone' && (
            <>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>1</span>
                <p className={styles.stepText}>
                  Open TraderMaster in <strong>Safari</strong> on your iPhone or iPad.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>2</span>
                <p className={styles.stepText}>
                  Tap the <strong>Share</strong> button{' '}
                  <span className={styles.inlineIconWrap}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </span>{' '}
                  in the bottom toolbar.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>3</span>
                <p className={styles.stepText}>
                  Scroll down the share sheet and tap <strong>&apos;Add to Home Screen&apos;</strong> ➕.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>4</span>
                <p className={styles.stepText}>
                  Tap <strong>Add</strong> in the top-right corner to place TraderMaster on your home screen.
                </p>
              </div>
            </>
          )}

          {activeTab === 'android' && (
            <>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>1</span>
                <p className={styles.stepText}>
                  Open TraderMaster in <strong>Chrome</strong> on your Android device.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>2</span>
                <p className={styles.stepText}>
                  Tap the <strong>three dots</strong> (⋮) menu in the top-right corner.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>3</span>
                <p className={styles.stepText}>
                  Tap <strong>Install app</strong> or <strong>&apos;Add to Home screen&apos;</strong>.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepNumber}>4</span>
                <p className={styles.stepText}>
                  Confirm the prompt to install TraderMaster directly into your app drawer.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Primary Action Button */}
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.installNowBtn}
            onClick={handleInstallClick}
            disabled={isInstalling}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isInstalling ? 'Installing TraderMaster...' : 'Install TraderMaster App'}</span>
          </button>
          {installFeedback && (
            <p className={styles.actionHelpText}>{installFeedback}</p>
          )}
        </div>

        {/* Footer Badge */}
        <div className={styles.footer}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.footerCheck}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Works offline · No app store needed · Free</span>
        </div>
      </div>
    </div>
  );
}
