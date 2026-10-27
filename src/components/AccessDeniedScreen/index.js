'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './accessDenied.module.scss';

const DarkLogo = "/assets/logo/logoWhite.svg";
const LightLogo = "/assets/logo/logo.svg";

export default function AccessDeniedScreen() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const router = useRouter();

    const logoSrc = theme === 'light' ? LightLogo : DarkLogo;

    return (
        <div className={styles.accessDeniedContainer}>
            {/* Ambient Background Lights */}
            <div className={styles.ambientGlowTop} aria-hidden="true" />
            <div className={styles.ambientGlowCenter} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            {/* Main Content Glass Card */}
            <motion.div 
                className={styles.cardWrapper}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Brand Logo */}
                <Link href="/" className={styles.logoLink} title="TraderMaster">
                    <img src={logoSrc} alt="TraderMaster Logo" className={styles.logoImg} />
                </Link>

                {/* Status Badge */}
                <div className={styles.statusBadge}>
                    <span className={styles.pulseDot} />
                    <span>{t('accessDenied.badge', 'MODULE OFFLINE • ACCESS RESTRICTED')}</span>
                </div>

                {/* Cyber Lock Visual */}
                <div className={styles.iconContainer}>
                    <svg 
                        className={styles.lockIcon}
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                {/* Headings */}
                <h1 className={styles.title}>
                    {t('accessDenied.titlePrefix', 'Feature Offline or')}{' '}
                    <span className={styles.emeraldGradient}>{t('accessDenied.titleHighlight', 'Access Restricted')}</span>
                </h1>

                <p className={styles.description}>
                    {t('accessDenied.description', 'This tool or module is currently disabled by administrator or undergoing scheduled recalibration.')}
                </p>

                {/* Action Buttons */}
                <div className={styles.buttonGroup}>
                    <Link href="/dashboard" className={styles.primaryButton}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                        <span>{t('accessDenied.backToDashboard', 'Back to Dashboard')}</span>
                    </Link>

                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className={styles.secondaryButton}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        <span>{t('accessDenied.goBack', 'Go Back')}</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
