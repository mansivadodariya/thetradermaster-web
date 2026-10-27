'use client';

import React from 'react';
import Input from '@/components/input';
import PhoneInput from '@/components/phoneInput';
import Button from '@/components/button';
import ProfileOnboardingSurveyCard from './ProfileOnboardingSurveyCard';
import TradingProfileAnalysisCard from './TradingProfileAnalysisCard';
import styles from '../profile.module.scss';

export default function ProfileDetailsTab({
    isEditing,
    setIsEditing,
    initials,
    fullName,
    form,
    displayUid,
    userCreatedAt,
    errors,
    handleChange,
    handlePhoneChange,
    handleSave,
    saving,
    onboardingData,
    tradingProfileData,
    onOpenTradingProfileModal,
    t
}) {
    return (
        <div className={styles.profileTabWrapper}>
            {/* Unified Personal Details & Profile Information Card */}
            <div className={styles.personalDetailsCard}>
                <div className={styles.detailsCardHeader}>
                    <div className={styles.heroCardHeaderLeft}>
                        <div className={styles.cardHeaderIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div className={styles.cardHeaderTexts}>
                            <h3>{t('profile.personalDetailsTitle', 'Personal Details')}</h3>
                            <p>{t('profile.profileInfoDesc', 'View and update your personal details and account preferences')}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.editProfileBtn}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? t('common.cancel', 'Cancel') : t('profile.editProfile', 'Edit Profile')}
                    </button>
                </div>

                {/* Profile Hero Header: Avatar, Name, Email, UID, Join Date */}
                <div className={styles.heroCardBody}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatarCircle}>
                            <span className={styles.avatarInitialsText}>{initials}</span>
                        </div>
                    </div>

                    <div className={styles.userMetaDetails}>
                        <div className={styles.userNameRow}>
                            <h2>{fullName}</h2>
                        </div>
                        <div className={styles.userEmailRow}>
                            <span className={styles.emailText}>{form.email || 'johndoe@email.com'}</span>
                            <span className={styles.verifiedPill}>
                                {t('profile.verified', 'Verified ✓')}
                            </span>
                        </div>
                        <div className={styles.metaBadgesRow}>
                            <span className={styles.uidBadge}>{displayUid}</span>
                            <div className={styles.joinedBadge}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span>{t('profile.joinedOn', 'Joined on {{date}}', { date: userCreatedAt })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.cardDivider} />

                {/* Main Details Body: View or Edit Mode */}
                {!isEditing ? (
                    <div className={styles.detailsViewGrid}>
                        <div className={styles.detailFieldItem}>
                            <span className={styles.fieldLabel}>{t('profile.firstName', 'First Name')}</span>
                            <span className={styles.fieldValue}>{form.first_name || '—'}</span>
                        </div>
                        <div className={styles.detailFieldItem}>
                            <span className={styles.fieldLabel}>{t('profile.lastName', 'Last Name')}</span>
                            <span className={styles.fieldValue}>{form.last_name || '—'}</span>
                        </div>
                        <div className={styles.detailFieldItem}>
                            <span className={styles.fieldLabel}>{t('profile.emailAddress', 'Email Address')}</span>
                            <span className={styles.fieldValue}>{form.email || '—'}</span>
                        </div>
                        <div className={styles.detailFieldItem}>
                            <span className={styles.fieldLabel}>{t('profile.phoneNumber', 'Phone Number')}</span>
                            <span className={styles.fieldValue}>{form.phone_number || t('profile.notProvided', 'Not provided')}</span>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className={styles.editDetailsForm}>
                        <div className={styles.formInputsGrid}>
                            <div className={styles.inputCol}>
                                <Input
                                    label={t('profile.firstName', 'First Name')}
                                    placeholder={t('profile.enterFirstName', 'Enter your first name')}
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    error={errors.first_name}
                                />
                            </div>
                            <div className={styles.inputCol}>
                                <Input
                                    label={t('profile.lastName', 'Last Name')}
                                    placeholder={t('profile.enterLastName', 'Enter your last name')}
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    error={errors.last_name}
                                />
                            </div>
                            <div className={styles.inputCol}>
                                <Input
                                    label={t('profile.emailAddress', 'Email Address')}
                                    placeholder={t('profile.enterEmail', 'Enter your email')}
                                    name="email"
                                    value={form.email}
                                    disabled={true}
                                />
                            </div>
                            <div className={styles.inputCol}>
                                <PhoneInput
                                    label={t('profile.phoneNumber', 'Phone Number')}
                                    placeholder={t('profile.enterPhone', 'Enter your phone number')}
                                    value={form.phone_number}
                                    onChange={handlePhoneChange}
                                    error={errors.phone_number}
                                />
                            </div>
                        </div>

                        <div className={styles.formActionFooter}>
                            <Button
                                text={t('common.cancel', 'Cancel')}
                                variant="secondary"
                                type="button"
                                onClick={() => setIsEditing(false)}
                            />
                            <Button
                                text={saving ? t('profile.saving', 'Saving...') : t('profile.saveChanges', 'Save Changes')}
                                type="submit"
                                disabled={saving}
                            />
                        </div>
                    </form>
                )}
            </div>

            {/* Card 2: AI Trading Profile & Strategy Alignment Analysis */}
            <TradingProfileAnalysisCard
                tradingProfileData={tradingProfileData}
                onOpenModal={onOpenTradingProfileModal}
                t={t}
            />

            {/* Card 3: Trader Onboarding Survey & Strategy Profile */}
            <ProfileOnboardingSurveyCard
                onboardingData={onboardingData}
                t={t}
            />
        </div>
    );
}
