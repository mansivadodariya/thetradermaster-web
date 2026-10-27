'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import WhiteLabelCustomSelect from './WhiteLabelCustomSelect';
import { toast } from '@/components/toast';
import { supabase } from '@/lib/supabaseClient';
import styles from '../whiteLabel.module.scss';

// Error Alert Icon for form validations
function ErrorAlertIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
        </svg>
    );
}

const BUSINESS_TYPES = [
    'Forex Broker',
    'Prop Trading Firm',
    'Fintech Company',
    'Trading Platform',
    'Investment / Financial Technology Company',
    'Trading Community',
    'Other'
];

const ACTIVE_USERS_OPTIONS = [
    'Pre-launch',
    'Under 1,000',
    '1,000 – 10,000',
    '10,000 – 50,000',
    '50,000+',
    'Not applicable'
];

const CAPABILITIES_OPTIONS = [
    'AI Chart Scanner',
    'AI Market Assistant',
    'AI Trading Signals',
    'AI Past Trade Analyzer',
    'Strategy Builder',
    'Custom Bot Builder',
    'Backtesting',
    'Economic Calendar',
    'Forex Calculator',
    'MT5 Integration',
    'Custom AI Features',
    'Other'
];

const COUNTRIES = [
    'United Arab Emirates',
    'United States',
    'United Kingdom',
    'Singapore',
    'Switzerland',
    'Germany',
    'France',
    'Australia',
    'Canada',
    'India',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'South Africa',
    'Nigeria',
    'Egypt',
    'Turkey',
    'Malaysia',
    'Indonesia',
    'Thailand',
    'Vietnam',
    'Philippines',
    'Japan',
    'South Korea',
    'Hong Kong',
    'Netherlands',
    'Sweden',
    'Norway',
    'Spain',
    'Italy',
    'Brazil',
    'Mexico',
    'Other'
];

const INITIAL_FORM_STATE = {
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    website: '',
    businessType: '',
    activeUsers: '',
    capabilities: [],
    message: ''
};

export default function WhiteLabelInquiryForm() {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleCapability = (cap) => {
        setFormData(prev => {
            const exists = prev.capabilities.includes(cap);
            const updated = exists
                ? prev.capabilities.filter(c => c !== cap)
                : [...prev.capabilities, cap];
            return { ...prev, capabilities: updated };
        });
        if (errors.capabilities) {
            setErrors(prev => ({ ...prev, capabilities: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Business / Company name is required';
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Valid corporate email is required';
        }
        if (!formData.phone.trim() || formData.phone.trim().length < 4) {
            newErrors.phone = 'Valid Phone / WhatsApp number is required';
        }
        if (!formData.country.trim()) {
            newErrors.country = 'Please select a country';
        }
        if (!formData.businessType) {
            newErrors.businessType = 'Please select your type of business';
        }
        if (!formData.activeUsers) {
            newErrors.activeUsers = 'Please select your active users range';
        }
        if (!formData.capabilities || formData.capabilities.length === 0) {
            newErrors.capabilities = 'Please select at least one capability of interest';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields marked in red.');
            return;
        }

        setIsSubmitting(true);

        try {
            let submitted = false;

            // Strategy 1: Server-side API Route (Secure & robust)
            try {
                const response = await fetch('/api/v1/white-label-inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: formData.fullName.trim(),
                        companyName: formData.companyName.trim(),
                        email: formData.email.trim(),
                        phone: formData.phone.trim(),
                        country: formData.country.trim(),
                        website: formData.website.trim(),
                        businessType: formData.businessType,
                        activeUsers: formData.activeUsers,
                        capabilities: formData.capabilities,
                        message: formData.message.trim()
                    })
                });

                const result = await response.json();
                if (response.ok && result?.success) {
                    submitted = true;
                } else if (result?.error) {
                    console.warn('API endpoint submission warning:', result.error);
                }
            } catch (apiErr) {
                console.warn('API endpoint error, attempting client-side fallback:', apiErr);
            }

            // Strategy 2: Client-side Supabase RPC / insert fallback
            if (!submitted && supabase) {
                const { data: rpcData, error: rpcError } = await supabase.rpc('submit_white_label_inquiry', {
                    p_full_name: formData.fullName.trim(),
                    p_company_name: formData.companyName.trim(),
                    p_email: formData.email.trim(),
                    p_phone: formData.phone.trim(),
                    p_country: formData.country.trim(),
                    p_website: formData.website.trim(),
                    p_business_type: formData.businessType,
                    p_active_users: formData.activeUsers,
                    p_capabilities: formData.capabilities,
                    p_message: formData.message.trim()
                });

                if (!rpcError && rpcData?.success !== false) {
                    submitted = true;
                } else {
                    console.warn('Direct RPC failed, trying direct table insert:', rpcError?.message || rpcData?.error);
                    const { error: insertError } = await supabase
                        .from('white_label_inquiries')
                        .insert([{
                            full_name: formData.fullName.trim(),
                            company_name: formData.companyName.trim(),
                            email: formData.email.trim(),
                            phone: formData.phone.trim(),
                            country: formData.country.trim(),
                            website: formData.website.trim(),
                            business_type: formData.businessType,
                            active_users: formData.activeUsers,
                            capabilities: formData.capabilities,
                            message: formData.message.trim(),
                            status: 'unread',
                            created_at: new Date().toISOString()
                        }]);

                    if (!insertError) {
                        submitted = true;
                    }
                }
            }

            if (!submitted) {
                throw new Error('Failed to record inquiry in database. Please check your network or try again.');
            }

            setIsSubmitting(false);
            setIsSubmitted(true);
            toast.success('Your white-label inquiry has been submitted! Our team will contact you shortly.');
        } catch (err) {
            console.error('White-label inquiry error:', err);
            setIsSubmitting(false);
            toast.error(err?.message || 'Failed to submit inquiry. Please try again or email support@thetradermaster.com');
        }
    };

    const handleReset = () => {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setIsSubmitted(false);
    };

    return (
        <section id="whiteLabelInquiryForm" className={styles.inquirySection}>
            <div className={styles.inquiryContainer}>
                {/* Section Header outside the card */}
                <SectionHeader
                    badge="Enterprise Partnership"
                    title="Deploy Your White-Label Platform"
                    description="Tell us about your business requirements and target capabilities. Our institutional solutions team will assemble a tailored platform architecture and schedule a private demonstration."
                    align="center"
                />

                <div className={styles.inquiryCard}>
                    <div className={styles.cardAmbientGlow} />

                    <div className={styles.inquirySplitLayout}>
                        {/* Visual Showcase with partition border */}
                        <div className={styles.inquiryVisualCol}>
                            <div className={styles.inquiryVisualImageWrapper}>
                                <Image
                                    src="/assets/images/white-label-showcase.jpg"
                                    alt="Institutional White-Label Platform Architecture"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 30vw"
                                    priority
                                    className={styles.inquiryVisualImage}
                                />
                            </div>
                        </div>

                        {/* Inquiry Form Column */}
                        <div className={styles.inquiryFormCol}>
                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.form
                                        key="white-label-form"
                                        onSubmit={handleSubmit}
                                        className={styles.inquiryForm}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Row 1: Full Name, Business Name, Work Email, Phone Number (4 in one line) */}
                                <div className={styles.formGridFourCols}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Full Name <span className={styles.requiredStar}>*</span>
                                        </label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.fieldIcon}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                name="fullName"
                                                placeholder="e.g. Alex Henderson"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className={`${styles.textInput} ${styles.withIcon} ${errors.fullName ? styles.inputError : ''}`}
                                            />
                                        </div>
                                        {errors.fullName && (
                                            <span className={styles.errorHelperText}>
                                                <ErrorAlertIcon />
                                                {errors.fullName}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Business / Company Name <span className={styles.requiredStar}>*</span>
                                        </label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.fieldIcon}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                name="companyName"
                                                placeholder="e.g. Apex Global Markets LLC"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                className={`${styles.textInput} ${styles.withIcon} ${errors.companyName ? styles.inputError : ''}`}
                                            />
                                        </div>
                                        {errors.companyName && (
                                            <span className={styles.errorHelperText}>
                                                <ErrorAlertIcon />
                                                {errors.companyName}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Work Email <span className={styles.requiredStar}>*</span>
                                        </label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.fieldIcon}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                                </svg>
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="alex@company.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`${styles.textInput} ${styles.withIcon} ${errors.email ? styles.inputError : ''}`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <span className={styles.errorHelperText}>
                                                <ErrorAlertIcon />
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Phone / WhatsApp Number <span className={styles.requiredStar}>*</span>
                                        </label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.fieldIcon}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                name="phone"
                                                placeholder="+971 50 123 4567"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`${styles.textInput} ${styles.withIcon} ${errors.phone ? styles.inputError : ''}`}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <span className={styles.errorHelperText}>
                                                <ErrorAlertIcon />
                                                {errors.phone}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Country, Type of Business, Active Users, Company Website (4 in one line) */}
                                <div className={styles.formGridFourCols}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Country <span className={styles.requiredStar}>*</span>
                                        </label>
                                        <WhiteLabelCustomSelect
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            options={COUNTRIES}
                                            placeholder="Select Country..."
                                            hasError={!!errors.country}
                                            icon={
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="2" y1="12" x2="22" y2="12" />
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                </svg>
                                            }
                                        />
                                        {errors.country && (
                                            <span className={styles.errorHelperText}>
                                                <ErrorAlertIcon />
                                                {errors.country}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Type of Business <span className={styles.requiredStar}>*</span>
                                        </label>
                                        <WhiteLabelCustomSelect
                                            name="businessType"
                                            value={formData.businessType}
                                            onChange={handleInputChange}
                                            options={BUSINESS_TYPES}
                                            placeholder="Select Type..."
                                            hasError={!!errors.businessType}
                                            icon={
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                                </svg>
                                            }
                                        />
                                        {errors.businessType && (
                                            <span className={styles.errorHelperText}>
                                                <ErrorAlertIcon />
                                                {errors.businessType}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Active Users <span className={styles.requiredStar}>*</span>
                                        </label>
                                        <WhiteLabelCustomSelect
                                            name="activeUsers"
                                            value={formData.activeUsers}
                                            onChange={handleInputChange}
                                            options={ACTIVE_USERS_OPTIONS}
                                            placeholder="Select User Base..."
                                            hasError={!!errors.activeUsers}
                                            icon={
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                            }
                                        />
                                        {errors.activeUsers && (
                                            <span className={styles.errorHelperText}>
                                                <ErrorAlertIcon />
                                                {errors.activeUsers}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Company Website <span className={styles.optionalTag}>(optional)</span>
                                        </label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.fieldIcon}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M8 12h8" />
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                name="website"
                                                placeholder="https://yourcompany.com"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                className={`${styles.textInput} ${styles.withIcon}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3: Message & Which capabilities are you interested in? (Side-by-side equal height) */}
                                <div className={styles.bottomSplitRow}>
                                    <div className={styles.messageColumnGroup}>
                                        <label className={styles.formLabel}>
                                            Message <span className={styles.optionalTag}>(optional details or timeline)</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            placeholder="Describe your current platform setup, timeline, or specific customization requirements..."
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className={styles.messageTextarea}
                                        />
                                    </div>

                                    <div className={styles.inquiryCapabilitiesSection}>
                                        <div className={styles.inquiryCapabilitiesHeader}>
                                            <label className={styles.formLabel}>
                                                Which capabilities are you interested in? <span className={styles.requiredStar}>*</span>
                                            </label>
                                            <span className={styles.inquiryCapabilitiesCounter}>
                                                {formData.capabilities.length} selected
                                            </span>
                                        </div>

                                        <div className={styles.inquiryCapabilitiesGrid}>
                                            {CAPABILITIES_OPTIONS.map(cap => {
                                                const isChecked = formData.capabilities.includes(cap);
                                                return (
                                                    <div
                                                        key={cap}
                                                        className={`${styles.capabilityPill} ${isChecked ? styles.capabilityPillActive : ''}`}
                                                        onClick={() => toggleCapability(cap)}
                                                    >
                                                        <span className={styles.customCheckSquare}>
                                                            {isChecked && (
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                        <span className={styles.capabilityLabel}>{cap}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {errors.capabilities && (
                                            <span className={styles.errorHelperText}>
                                                <ErrorAlertIcon />
                                                {errors.capabilities}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Action */}
                                <div className={styles.submitActionArea}>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={styles.submitBtn}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className={styles.submitSpinner} />
                                                <span>Submitting Inquiry...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Submit White-Label Inquiry</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="22" y1="2" x2="11" y2="13" />
                                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    <div className={styles.privacyNote}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        <span>Confidential data privacy guaranteed.</span>
                                    </div>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success-state"
                                className={styles.successCard}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                            >
                                <div className={styles.successIconWrap}>
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>

                                <h3 className={styles.successHeading}>Inquiry Received Successfully!</h3>
                                <p className={styles.successMessage}>
                                    Thank you, <strong>{formData.fullName}</strong> from <strong>{formData.companyName}</strong>. Our institutional solutions director will reach out to you via WhatsApp/Phone at <strong>{formData.phone}</strong> within 24 hours to schedule your platform demonstration.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className={styles.resetFormBtn}
                                >
                                    Submit Another Inquiry
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
