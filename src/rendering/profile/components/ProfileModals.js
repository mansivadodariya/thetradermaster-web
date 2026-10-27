'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/input';
import Button from '@/components/button';
import FirebasePhoneModal from '@/components/firebasePhoneModal';
import { toast } from '@/components/toast';
import { profileApi } from '@/lib/api';
import { clearAuthSession } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../profile.module.scss';

const Lock = '/assets/icons/lock.svg';

export default function ProfileModals({
    showPasswordModal,
    setShowPasswordModal,
    passwordForm,
    setPasswordForm,
    passwordUpdating,
    setPasswordUpdating,
    userId,
    email,
    showLogoutConfirm,
    setShowLogoutConfirm,
    showOtpModal,
    setShowOtpModal,
    phoneNumber,
    performSaveProfile,
    router,
    t: parentT
}) {
    const { t: localT } = useLanguage();
    const t = parentT || localT;

    const handleUpdatePassword = async () => {
        if (!passwordForm.current) {
            toast.error('Please enter your current password');
            return;
        }
        if (!passwordForm.newPass) {
            toast.error('Please enter a new password');
            return;
        }
        if (passwordForm.newPass.length < 8) {
            toast.error('New password must be at least 8 characters long');
            return;
        }
        if (passwordForm.newPass !== passwordForm.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwordForm.current === passwordForm.newPass) {
            toast.error('New password must be different from current password');
            return;
        }

        setPasswordUpdating(true);
        try {
            await profileApi.changePassword({
                userId,
                email,
                currentPassword: passwordForm.current,
                newPassword: passwordForm.newPass,
            });
            toast.success('Password updated successfully!');
            setShowPasswordModal(false);
            setPasswordForm({ current: '', newPass: '', confirm: '' });
        } catch (err) {
            toast.error(err.message || 'Failed to update password. Please check your current password.');
        } finally {
            setPasswordUpdating(false);
        }
    };

    return (
        <>
            {/* Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
                        <motion.div
                            className={styles.modalContent}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3>{t('profile.changePassword', 'Change Password')}</h3>
                                <button type="button" onClick={() => setShowPasswordModal(false)} className={styles.closeBtn}>✕</button>
                            </div>
                            <div className={styles.modalBody}>
                                <Input
                                    label={t('profile.currentPassword', 'Current Password')}
                                    icon={Lock}
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.current}
                                    onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                                    placeholder="••••••••"
                                />
                                <Input
                                    label={t('profile.newPassword', 'New Password')}
                                    icon={Lock}
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPass}
                                    onChange={(e) => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                                    placeholder="••••••••"
                                />
                                <Input
                                    label={t('profile.confirmPassword', 'Confirm Password')}
                                    icon={Lock}
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirm}
                                    onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className={styles.modalFooter}>
                                <button 
                                    type="button" 
                                    className={styles.cancelFormBtn} 
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordForm({ current: '', newPass: '', confirm: '' });
                                    }}
                                    disabled={passwordUpdating}
                                >
                                    {t('common.cancel', 'Cancel')}
                                </button>
                                <button
                                    type="button"
                                    className={styles.submitModalBtn}
                                    disabled={passwordUpdating}
                                    onClick={handleUpdatePassword}
                                >
                                    {passwordUpdating ? t('common.updating', 'Updating...') : t('profile.updatePassword', 'Update Password')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Logout Confirm Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className={styles.modalOverlay} onClick={() => setShowLogoutConfirm(false)}>
                        <motion.div
                            className={styles.modalContent}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3>{t('sidebar.logoutTitle', 'Confirm Logout')}</h3>
                                <button type="button" onClick={() => setShowLogoutConfirm(false)} className={styles.closeBtn}>✕</button>
                            </div>
                            <div className={styles.modalBody}>
                                <p>
                                    {t('sidebar.logoutConfirm', 'Are you sure you want to sign out of your account?')}
                                </p>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelFormBtn} onClick={() => setShowLogoutConfirm(false)}>
                                    {t('common.cancel', 'Cancel')}
                                </button>
                                <button
                                    type="button"
                                    className={styles.confirmLogoutBtn}
                                    onClick={() => {
                                        clearAuthSession();
                                        router.push('/login');
                                    }}
                                >
                                    {t('sidebar.logout', 'Log Out')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <FirebasePhoneModal
                isOpen={showOtpModal}
                phoneNumber={phoneNumber}
                onClose={() => setShowOtpModal(false)}
                onSuccess={performSaveProfile}
            />
        </>
    );
}
