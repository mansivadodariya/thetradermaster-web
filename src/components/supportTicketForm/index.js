'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInputLib from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from '@/components/toast';
import { useLanguage } from '@/context/LanguageContext';
import { getStoredUser } from '@/lib/authSession';
import { createSupportTicket, supportTicketLimits } from '@/services/supportTicketService';
import styles from './supportTicketForm.module.scss';

const INITIAL_FORM = {
    name: '',
    email: '',
    contact_no: '',
    description: '',
};

function formatBytes(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Shared Support Ticket Form component.
 * Used by both the user dashboard (/customer-support) and the public outer page (/customer-support).
 */
export default function SupportTicketForm() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const user = getStoredUser();
        if (!user) return;
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || '';
        setFormData((prev) => ({
            ...prev,
            name: prev.name || fullName,
            email: prev.email || user.email || '',
            contact_no: prev.contact_no || user.phone_number || user.phone || '',
        }));
    }, []);

    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl('');
            return undefined;
        }
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    const maxMbLabel = useMemo(
        () => Math.round(supportTicketLimits.maxImageBytes / (1024 * 1024)),
        []
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (val) => {
        setFormData((prev) => ({ ...prev, contact_no: val || '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!supportTicketLimits.allowedImageTypes.includes(file.type)) {
            toast.error(t('technicalSupport.errImageType', 'Please upload a JPEG, PNG, WebP, or GIF image.'));
            e.target.value = '';
            return;
        }
        if (file.size > supportTicketLimits.maxImageBytes) {
            toast.error(t('technicalSupport.errImageSize', `Image must be ${maxMbLabel} MB or smaller.`));
            e.target.value = '';
            return;
        }
        setImageFile(file);
    };

    const clearImage = (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        setImageFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error(t('technicalSupport.errName', 'Please enter your full name.'));
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            toast.error(t('technicalSupport.errEmail', 'Please enter a valid email address.'));
            return;
        }
        if (!formData.contact_no || formData.contact_no.trim().length < 4) {
            toast.error(t('technicalSupport.errPhone', 'Please enter a valid contact number.'));
            return;
        }
        if (!formData.description.trim() || formData.description.trim().length < 10) {
            toast.error(t('technicalSupport.errDesc', 'Please describe the issue with at least 10 characters.'));
            return;
        }

        setIsSubmitting(true);
        try {
            await createSupportTicket({
                project_id: 1,
                name: formData.name,
                email: formData.email,
                contact_no: formData.contact_no,
                description: formData.description,
                image: imageFile,
            });
            setIsSubmitted(true);
            toast.success(
                t('technicalSupport.toastSuccess', 'Support query submitted. Our team will get back to you shortly.')
            );
        } catch (err) {
            console.error('Support ticket submit error:', err);
            toast.error(err?.message || t('technicalSupport.toastError', 'Failed to submit query. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        const user = getStoredUser();
        const fullName = user
            ? [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || ''
            : '';
        setFormData({
            name: fullName,
            email: user?.email || '',
            contact_no: user?.phone_number || user?.phone || '',
            description: '',
        });
        setImageFile(null);
        setIsSubmitted(false);
    };

    return (
        <AnimatePresence mode="wait">
            {!isSubmitted ? (
                <motion.form
                    key="ticket-form"
                    className={styles.form}
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="support-name">
                                {t('technicalSupport.labelName', 'Full Name')}
                                <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.inputWrap}>
                                <span className={styles.fieldIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    id="support-name"
                                    className={styles.input}
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={t('technicalSupport.phName', 'Enter your full name')}
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="support-email">
                                {t('technicalSupport.labelEmail', 'Email')}
                                <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.inputWrap}>
                                <span className={styles.fieldIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </span>
                                <input
                                    id="support-email"
                                    className={styles.input}
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={t('technicalSupport.phEmail', 'you@example.com')}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="support-phone">
                            {t('technicalSupport.labelPhone', 'Contact Number')}
                            <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.phoneWrap}>
                            <PhoneInputLib
                                international
                                limitMaxLength
                                defaultCountry="AE"
                                value={formData.contact_no}
                                onChange={handlePhoneChange}
                                placeholder={t('technicalSupport.phPhone', 'Phone / mobile number')}
                                numberInputProps={{
                                    id: 'support-phone',
                                    required: true,
                                    autoComplete: 'tel',
                                    maxLength: 20,
                                }}
                            />
                        </div>
                    </div>

                    <div className={styles.descImageRow}>
                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label className={styles.label} htmlFor="support-description">
                                    {t('technicalSupport.labelDescription', 'Issue Description')}
                                    <span className={styles.required}>*</span>
                                </label>
                                <span className={styles.charCount}>{formData.description.length}/2000</span>
                            </div>
                            <textarea
                                id="support-description"
                                className={styles.textarea}
                                name="description"
                                maxLength={2000}
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder={t(
                                    'technicalSupport.phDescription',
                                    'Describe the problem, steps to reproduce, and any error messages…'
                                )}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label className={styles.label} htmlFor="support-image">
                                    {t('technicalSupport.labelImage', 'Screenshot / Attachment')}
                                </label>
                                <span className={styles.optional}>{t('common.optional', 'Optional')}</span>
                            </div>
                            <label className={styles.uploadBox} htmlFor="support-image">
                                <input
                                    id="support-image"
                                    className={styles.fileInput}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleFileChange}
                                />
                                {imageFile && previewUrl ? (
                                    <div className={styles.previewRow}>
                                        <img
                                            src={previewUrl}
                                            alt={t('technicalSupport.previewAlt', 'Attachment preview')}
                                            className={styles.previewThumb}
                                        />
                                        <div className={styles.previewMeta}>
                                            <span className={styles.previewName}>{imageFile.name}</span>
                                            <span className={styles.previewSize}>{formatBytes(imageFile.size)}</span>
                                        </div>
                                        <button type="button" className={styles.clearFileBtn} onClick={clearImage}>
                                            {t('common.remove', 'Remove')}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className={styles.uploadIcon}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                        </span>
                                        <span className={styles.uploadText}>
                                            {t('technicalSupport.uploadCta', 'Click to upload a screenshot')}
                                        </span>
                                        <span className={styles.uploadHint}>
                                            {t('technicalSupport.uploadHint', `JPEG, PNG, WebP or GIF · max ${maxMbLabel} MB`)}
                                        </span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className={styles.spinner} />
                                    {t('technicalSupport.btnSending', 'Submitting…')}
                                </>
                            ) : (
                                <>
                                    {t('technicalSupport.btnSubmit', 'Submit Query')}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                </>
                            )}
                        </button>
                        <p className={styles.helperNote}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>
                                {t(
                                    'technicalSupport.helperNote',
                                    'Our technical desk typically responds within a few hours during business days.'
                                )}
                            </span>
                        </p>
                    </div>
                </motion.form>
            ) : (
                <motion.div
                    key="ticket-success"
                    className={styles.success}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className={styles.successIcon}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <h2 className={styles.successTitle}>
                        {t('technicalSupport.successTitle', 'Query Submitted')}
                    </h2>
                    <p className={styles.successDesc}>
                        {t('technicalSupport.thankYou', 'Thank you')},{' '}
                        <span className={styles.highlight}>{formData.name}</span>.{' '}
                        {t('technicalSupport.successDesc', 'We received your query and will reply at')}{' '}
                        <span className={styles.highlight}>{formData.email}</span>.
                    </p>
                    <button type="button" className={styles.resetBtn} onClick={handleReset}>
                        {t('technicalSupport.btnAnother', 'Submit Another Query')}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
