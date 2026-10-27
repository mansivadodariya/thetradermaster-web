"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import styles from './publicAffiliate.module.scss';

export default function ReferralLinkWidget() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const referralLink = "https://thetradermaster.com/signup?ref=YOUR-CODE";

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSocialShare = (platform) => {
    const encodedUrl = encodeURIComponent(referralLink);
    const text = encodeURIComponent("Join TraderMaster - The Next-Gen AI Trading Platform!");
    let url = "";

    if (platform === 'x') url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`;
    if (platform === 'telegram') url = `https://t.me/share/url?url=${encodedUrl}&text=${text}`;
    if (platform === 'whatsapp') url = `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`;
    if (platform === 'linkedin') url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    if (url) window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <section className={styles.referralWidgetSection}>
      <div className="container">
        <SectionHeader
          badge={t('publicAffiliate.referralLinkBadge', 'YOUR REFERRAL LINK')}
          title1="One-Click Instant"
          title2="Social Sharing"
          description={t('publicAffiliate.referralLinkSubtitle', 'Share your unique referral link across social media, trading communities, websites, and direct channels. Make it easy to share TraderMaster wherever your audience is active.')}
        />

        <div className={styles.widgetContainer}>
          {/* Link Box */}
          <div className={styles.linkDisplayBox}>
            <div className={styles.linkText}>{referralLink}</div>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? 'COPIED! ✓' : 'COPY LINK'}
            </button>
          </div>

          {/* Code & QR Actions Row */}
          <div className={styles.widgetActionsRow}>
            <div className={styles.codeText}>
              Referral Code: <strong>YOUR-CODE</strong>
            </div>

            <button
              className={`${styles.heroSecondaryBtn} ${styles.qrTriggerBtn}`}
              onClick={() => setShowQrModal(true)}
            >
              SHOW QR CODE
            </button>

            <div className={styles.socialShareGroup}>
              <span className={styles.shareLabel}>Share On:</span>
              <button className={styles.sociallinks} onClick={() => handleSocialShare('x')}>𝕏 (Twitter)</button>
              <button className={styles.sociallinks} onClick={() => handleSocialShare('telegram')}>Telegram</button>
              <button className={styles.sociallinks} onClick={() => handleSocialShare('whatsapp')}>WhatsApp</button>
              <button className={styles.sociallinks} onClick={() => handleSocialShare('linkedin')}>LinkedIn</button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.qrModalOverlay}
            onClick={() => setShowQrModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={styles.qrModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.qrModalTitle}>Your Referral QR Code</h3>
              <p className={styles.qrModalDesc}>Scan with smartphone camera to join TraderMaster</p>

              <div className={styles.qrCodeWrapper}>
                <svg width="180" height="180" viewBox="0 0 100 100" fill="#060B0E">
                  <path d="M0,0 h30 v30 h-30 z M40,0 h20 v10 h-20 z M70,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M80,10 h10 v10 h-10 z M0,40 h10 v20 h-10 z M30,40 h40 v10 h-40 z M80,40 h20 v20 h-20 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,70 h20 v30 h-20 z M70,70 h30 v30 h-30 z M80,80 h10 v10 h-10 z" />
                </svg>
              </div>

              <div>
                <button
                  className={`${styles.heroPrimaryBtn} ${styles.qrModalCloseBtn}`}
                  onClick={() => setShowQrModal(false)}
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
