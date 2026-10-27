'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './not-found.module.scss';

export default function NotFound() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <div className={styles.notFoundContainer}>
            <Header />

            <main className={styles.mainContent}>
                {/* Background Atmosphere */}
                <div className={styles.ambientGlowTop} aria-hidden="true" />
                <div className={styles.ambientGlowCenter} aria-hidden="true" />
                <div className={styles.gridOverlay} aria-hidden="true" />

                <div className="container">
                    <motion.div 
                        className={styles.contentWrapper}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Status Tag */}
                        <div className={styles.statusTag}>
                            <span className={styles.pulseDot} />
                            <span>{t('notFound.signalDisconnected', 'SIGNAL DISCONNECTED • ERROR 404')}</span>
                        </div>

                        {/* Giant 404 Visual */}
                        <div className={styles.visual404Wrap}>
                            <h1 className={styles.glitch404}>404</h1>
                            <div className={styles.radarRing} />
                        </div>

                        {/* Title & Description */}
                        <h2 className={styles.heading}>
                            {t('notFound.headingPrefix', 'Lost in the')}{' '}
                            <span className={styles.goldGradient}>{t('notFound.headingHighlight', 'Market Telemetry?')}</span>
                        </h2>

                        <p className={styles.description}>
                            {t('notFound.description', 'The coordinates you requested do not exist in our neural routing engine. The page may have been moved, archived, or recalibrated.')}
                        </p>

                        {/* Action Buttons */}
                        <div className={styles.actionButtons}>
                            <Link href="/" className={`${styles.btn} ${styles.primaryBtn}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                <span>{t('notFound.returnHome', 'RETURN TO HOME')}</span>
                            </Link>

                            <button 
                                type="button" 
                                className={`${styles.btn} ${styles.secondaryBtn}`}
                                onClick={() => router.push('/dashboard')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="7" height="9" x="3" y="3" rx="1" />
                                    <rect width="7" height="5" x="14" y="3" rx="1" />
                                    <rect width="7" height="9" x="14" y="12" rx="1" />
                                    <rect width="7" height="5" x="3" y="16" rx="1" />
                                </svg>
                                <span>{t('notFound.viewDashboard', 'ACCESS DASHBOARD')}</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
