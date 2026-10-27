'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MonitorIcon } from '@/icons/tradeSnapIcons';
import styles from '../tradeSnap.module.scss';

export default function TradeSnapMobileNotice({ t }) {
    return (
        <div className={styles.tradeSnap}>
            <div className={styles.mobileNotice}>
                <motion.div
                    className={styles.mobileCard}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.mobileIconWrap}>
                        <MonitorIcon className={styles.mobileMonitor} />
                    </div>
                    <h3>{t('tradeSnap.desktopViewRequired', 'Desktop View Required')}</h3>
                    <p>
                        {t('tradeSnap.mobileNoticeText', 'AI Trade uses screen sharing and requires a desktop or laptop computer with Chrome, Edge, or macOS Safari. Screen sharing is not supported on mobile devices or iOS Safari.')}
                    </p>
                    <Link href="/dashboard" className={styles.mobileBackBtn}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                        <span>{t('accessDenied.backToDashboard', 'Back to Dashboard')}</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
