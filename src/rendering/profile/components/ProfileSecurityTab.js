'use client';

import React from 'react';
import styles from '../profile.module.scss';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfileSecurityTab({
    setShowPasswordModal,
}) {
    const { t } = useLanguage();
    return (
        <div className={styles.tabContentPanel}>
            <div className={styles.panelHeaderRow}>
                <h3>{t('profile.securityTab', 'Security Settings')}</h3>
            </div>
            <div className={styles.securityBannerCard}>
                <div className={styles.securityBannerLeft}>
                    <div className={styles.shieldIconWrap}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <div className={styles.bannerTexts}>
                        <h4>{t('profile.accountPasswordEncryption', 'Account Password & Encryption')}</h4>
                        <p>{t('profile.securityBannerDesc', 'Change your account password regularly to keep your trading account secure.')}</p>
                    </div>
                </div>
                <button
                    type="button"
                    className={styles.bannerActionBtn}
                    onClick={() => setShowPasswordModal(true)}
                >
                    {t('profile.changePassword', 'Change Password')}
                </button>
            </div>
        </div>
    );
}
