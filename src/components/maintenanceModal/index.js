'use client';

import React from 'react';
import Link from 'next/link';
import styles from './maintenanceModal.module.scss';

export default function MaintenanceModal({ onRecheck }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modalCard}>
                <div className={styles.glowBg} />

                <div className={styles.iconWrapper}>
                    <svg
                        className={styles.iconSvg}
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M24 12C26.7614 12 29 14.2386 29 17C29 19.7614 26.7614 22 24 22C21.2386 22 19 19.7614 19 17C19 14.2386 21.2386 12 24 12Z"
                            stroke="#00FF88"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M16 35C16.8 28.5 20 25 24 25C28 25 31.2 28.5 32 35"
                            stroke="#00FF88"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                        />
                        <circle cx="16" cy="35" r="2.2" fill="#00FF88" />
                        <circle cx="32" cy="35" r="2.2" fill="#00FF88" />
                    </svg>
                </div>

                <div className={styles.statusBadge}>
                    <span className={styles.pulseDot} />
                    SYSTEM MAINTENANCE
                </div>

                <h2 className={styles.title}>Website Under Maintenance</h2>

                <p className={styles.description}>
                    The website is currently under maintenance. Please try again later.
                </p>

                <div className={styles.buttonGroup}>
                    <Link href="/" className={styles.primaryBtn}>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Back to Home Page
                    </Link>

                    {onRecheck && (
                        <button type="button" onClick={onRecheck} className={styles.secondaryBtn}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Check Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
