'use client';

import React from 'react';

import styles from '../profile.module.scss';

export default function ProfileRightSidebar({
    referralCount,
    credits,
    canViewPlans,
    router,
    setShowPasswordModal,
    setActiveTab,
    setShowLogoutConfirm,
    isPhoneVerified,
    onVerifyPhoneClick,
    t
}) {
    return (
        <div className={styles.rightSidebar}>
            {/* Card 1: Account Summary */}
            <div className={styles.rightCard}>
                <h4 className={styles.rightCardTitle}>{t('profile.accountSummary', 'Account Summary')}</h4>

                <div className={styles.summaryMetaRows}>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>{t('profile.accountStatus', 'Account Status')}</span>
                        <span className={styles.summaryActiveTag}>{t('profile.activeStatus', 'Active ✓')}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>{t('profile.totalReferrals', 'Total Referrals')}</span>
                        <span className={styles.summaryProTag}>{t('profile.referralsCount', '{{count}} Refs', { count: referralCount })}</span>
                    </div>
                </div>

                {/* Real Dynamic Credits Box */}
                <div className={styles.creditsCardBox}>
                    <div className={styles.creditsHead}>
                        <span className={styles.creditsLabel}>{t('topbar.credits', 'credits')}</span>
                        {canViewPlans() && (
                            <button type="button" onClick={() => router.push('/plans')} className={styles.viewPlansBtn}>
                                {t('sidebar.proAccount', 'View Plans')} →
                            </button>
                        )}
                    </div>

                    <div className={styles.creditsValueRow}>
                        <div className={styles.creditsNumbers}>
                            <h3 className={styles.creditsAmount}>
                                {credits} <span>{t('topbar.credits', 'credits')}</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Verification Status */}
            <div className={styles.rightCard}>
                <h4 className={styles.rightCardTitle}>{t('profile.verificationStatus', 'Verification Status')}</h4>
                <div className={styles.verificationList}>
                    {/* Email Verification */}
                    <div className={styles.verifItem}>
                        <div className={styles.verifLeft}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>{t('profile.emailVerification', 'Email Verification')}</span>
                        </div>
                        <span className={styles.verifStatusGreen}>{t('profile.verified', 'Verified ✓')}</span>
                    </div>

                    {/* Phone Number Verification */}
                    <div className={styles.verifItem}>
                        <div className={styles.verifLeft}>
                            {isPhoneVerified ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            )}
                            <span>{t('profile.phoneVerification', 'Phone Verification')}</span>
                        </div>
                        {isPhoneVerified ? (
                            <span className={styles.verifStatusGreen}>{t('profile.verified', 'Verified ✓')}</span>
                        ) : (
                            <button
                                type="button"
                                className={styles.verifActionBtn}
                                onClick={onVerifyPhoneClick}
                            >
                                {t('profile.verifyNow', 'Verify Now →')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Card 3: Quick Actions */}
            <div className={styles.rightCard}>
                <h4 className={styles.rightCardTitle}>{t('profile.quickActions', 'Quick Actions')}</h4>
                <div className={styles.quickActionsGrid}>
                    <button type="button" className={styles.actionGridBtn} onClick={() => setShowPasswordModal(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>{t('profile.changePassword', 'Change Password')}</span>
                    </button>

                    <button type="button" className={styles.actionGridBtn} onClick={() => setActiveTab('credit_history')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        <span>{t('creditHistory.title', 'Credit History')}</span>
                    </button>

                    <button type="button" className={styles.actionGridBtn} onClick={() => setActiveTab('activity_log')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{t('profile.recentActivity', 'Activity Log')}</span>
                    </button>

                    <button type="button" className={styles.actionGridBtn} onClick={() => setActiveTab('profile')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>{t('profile.editProfile', 'Edit Profile')}</span>
                    </button>

                    <button type="button" className={`${styles.actionGridBtn}`} onClick={() => setShowLogoutConfirm(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>{t('profile.logOut', 'Log Out')}</span>
                    </button>

                    <button type="button" className={styles.actionGridBtn} onClick={() => setActiveTab('preferences')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        <span>{t('profile.preferences', 'Preferences')}</span>
                    </button>
                </div>
            </div>

            {/* Security Priority Banner */}
            <div className={styles.securityPriorityCard}>
                <div className={styles.securityPriorityLeft}>
                    <div className={styles.secShieldIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <div className={styles.secPriorityTexts}>
                        <h5>{t('profile.securityPriorityTitle', 'Your security is our priority')}</h5>
                        <p>{t('profile.securityPriorityDesc', 'We use bank-level encryption to protect your data.')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
