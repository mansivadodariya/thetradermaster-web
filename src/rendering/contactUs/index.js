"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/toast';
import PhoneInputLib from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useContactInfo } from '@/services/contactInfoService';
import CommonCta from '@/components/commonCta';
import ContactFaqSection from './components/ContactFaqSection';
import { COUNTRIES } from './contactData';
import styles from './contactUs.module.scss';

export default function ContactUs() {
    const { t } = useLanguage();
    const { contactInfo } = useContactInfo();
    // Form State (Exact 5 fields requested: Full name, Email, Country, Phone, Message)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: 'United Arab Emirates',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (val) => {
        setFormData(prev => ({ ...prev, phone: val || '' }));
    };

    const handleCopy = (text, fieldName) => {
        if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            toast.success(`Copied ${fieldName} to clipboard!`);
            setTimeout(() => setCopiedField(null), 2500);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Please enter your full name.');
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            toast.error('Please enter a valid email address.');
            return;
        }
        if (!formData.country.trim()) {
            toast.error('Please select your country.');
            return;
        }
        if (!formData.phone || formData.phone.trim().length < 4) {
            toast.error('Please enter a valid phone number with country code.');
            return;
        }
        if (!formData.message.trim() || formData.message.trim().length < 10) {
            toast.error('Please provide a message with at least 10 characters.');
            return;
        }

        setIsSubmitting(true);

        try {
            let submitted = false;

            // Strategy 1: Server-side API Route (Secure & bypasses any client-side RLS/adblock issues)
            try {
                const response = await fetch('/api/v1/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim().toLowerCase(),
                        country: formData.country.trim(),
                        phone: formData.phone.trim(),
                        message: formData.message.trim()
                    })
                });

                const result = await response.json();
                if (response.ok && result?.success) {
                    submitted = true;
                } else if (result?.error) {
                    console.warn('API route submission warning:', result.error);
                }
            } catch (apiErr) {
                console.warn('API route unreachable, falling back to direct Supabase submission:', apiErr);
            }

            // Strategy 2: Direct Client-Side Supabase RPC or Insert (if Strategy 1 did not complete)
            if (!submitted && supabase) {
                const { data: rpcData, error: rpcError } = await supabase.rpc('submit_contact_inquiry', {
                    p_name: formData.name.trim(),
                    p_email: formData.email.trim().toLowerCase(),
                    p_country: formData.country.trim(),
                    p_phone: formData.phone.trim(),
                    p_message: formData.message.trim()
                });

                if (!rpcError) {
                    submitted = true;
                } else {
                    console.warn('Direct RPC failed, trying direct table insert:', rpcError.message);
                    const { error: insertError } = await supabase
                        .from('contact_inquiries')
                        .insert([
                            {
                                name: formData.name.trim(),
                                email: formData.email.trim().toLowerCase(),
                                country: formData.country.trim(),
                                phone: formData.phone.trim(),
                                message: formData.message.trim(),
                                status: 'unread',
                                created_at: new Date().toISOString()
                            }
                        ]);

                    if (!insertError) {
                        submitted = true;
                    } else {
                        console.error('Direct table insert also failed:', insertError.message);
                    }
                }
            }

            // Success Transition
            setIsSubmitting(false);
            setIsSubmitted(true);
            toast.success('Your message has been sent successfully! Our team will contact you shortly.');
        } catch (err) {
            console.error('Contact submission error:', err);
            setIsSubmitting(false);
            toast.error(err?.message || 'Failed to send message. Please try again or email support@thetradermaster.com directly.');
        }
    };

    const handleResetForm = () => {
        setFormData({
            name: '',
            email: '',
            country: 'United Arab Emirates',
            phone: '',
            message: ''
        });
        setIsSubmitted(false);
    };

    return (
        <div className={styles.contactPage}>
            {/* Ambient Atmosphere Glows */}
            <div className={styles.ambientGlowTop} aria-hidden="true" />
            <div className={styles.ambientGlowCenter} aria-hidden="true" />
            <div className={styles.ambientGlowBottom} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            <div className="container">
                {/* 1. Header & Hero Section */}
                <motion.header
                    className={styles.heroSection}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Live Status Pill */}
                    <div className={styles.statusPillWrapper}>
                        <div className={styles.statusPill}>
                            <span className={styles.pulseDot}>
                                <span className={styles.pulseRing} />
                            </span>
                            <span className={styles.pillTag}>{t('contactUs.liveDeskBadge', 'LIVE DESK')}</span>
                            <span className={styles.pillDivider}>|</span>
                            <span className={styles.pillText}>{t('contactUs.liveDeskText', '24/7 Quantitative Support & Assistance')}</span>
                            <span className={styles.pillBadge}>{t('contactUs.onlineBadge', 'ONLINE')}</span>
                        </div>
                    </div>

                    <h1 className={styles.mainTitle}>
                        {t('contactUs.mainTitle', 'Get in Touch with our')} <br />
                        <span className={styles.goldGradient}>{t('contactUs.mainTitleGradient', 'AI Trading Desk & Global Team')}</span>
                    </h1>

                    <p className={styles.mainSubtitle}>
                        {t('contactUs.mainSubtitle', 'Have questions about our algorithmic models, predictive signals, or custom indicators? Reach out to us directly or fill out the message form below.')}
                    </p>
                </motion.header>

                {/* 2. Main 2-Column Section: Left Info Card + Right Modern Form */}
                <section className={styles.mainSection}>
                    <div className={styles.contactLayout}>
                        {/* LEFT COLUMN: Email, Contact Number, Address */}
                        <motion.div
                            className={styles.infoColumn}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className={styles.infoCard}>
                                <div className={styles.infoCardGlow} />

                                <div className={styles.infoHeader}>
                                    <div className={styles.infoBadge}>
                                        <span>{t('contactUs.directContactBadge', 'DIRECT CONTACT')}</span>
                                    </div>
                                    <h2 className={styles.infoTitle}>{t('contactUs.connectTitle', 'Connect With Us')}</h2>
                                    <p className={styles.infoSubtitle}>
                                        {t('contactUs.connectSubtitle', 'Reach out through any of our direct contact points. Our team is available around the clock.')}
                                    </p>
                                </div>

                                <div className={styles.infoItemsList}>
                                    {/* 1. EMAIL */}
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </div>
                                        <div className={styles.infoContent}>
                                            <span className={styles.infoLabel}>{contactInfo?.email?.label || t('contactUs.labelEmail', 'EMAIL')}</span>
                                            <a href={`mailto:${contactInfo?.email?.value || 'support@thetradermaster.com'}`} className={styles.infoValue}>
                                                {contactInfo?.email?.value || 'support@thetradermaster.com'}
                                            </a>
                                            <span className={styles.infoHelper}>{contactInfo?.email?.helper || t('contactUs.emailHelper', 'Average response time: < 15 mins')}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.itemCopyBtn}
                                            onClick={() => handleCopy(contactInfo?.email?.value || 'support@thetradermaster.com', 'Email')}
                                            title="Copy email"
                                            aria-label="Copy Email"
                                        >
                                            {copiedField === 'Email' ? (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* 2. CONTACT NUMBER */}
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </div>
                                        <div className={styles.infoContent}>
                                            <span className={styles.infoLabel}>{contactInfo?.phone?.label || t('contactUs.labelPhone', 'PHONE')}</span>
                                            <a href={`tel:${(contactInfo?.phone?.value || '+971 56 884 0900').replace(/[^+\d]/g, '')}`} className={styles.infoValue}>
                                                {contactInfo?.phone?.value || '+971 56 884 0900'}
                                            </a>
                                            <span className={styles.infoHelper}>{contactInfo?.phone?.helper || t('contactUs.phoneHelper', 'WhatsApp & Phone Support (24/7)')}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.itemCopyBtn}
                                            onClick={() => handleCopy(contactInfo?.phone?.value || '+971568840900', 'Phone Number')}
                                            title="Copy phone number"
                                            aria-label="Copy Phone Number"
                                        >
                                            {copiedField === 'Phone Number' ? (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* 3. ADDRESS */}
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIconBox}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div className={styles.infoContent}>
                                            <span className={styles.infoLabel}>{contactInfo?.address?.label || t('contactUs.labelAddress', 'OFFICE ADDRESS')}</span>
                                            <p className={styles.addressValue}>
                                                {contactInfo?.address?.value || 'Dubai, UAE'}
                                            </p>
                                            <span className={styles.infoHelper}>{contactInfo?.address?.helper || t('contactUs.addressHelper', 'Global Financial Intelligence Centre')}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.itemCopyBtn}
                                            onClick={() => handleCopy(contactInfo?.address?.value || 'Dubai, UAE', 'Office Address')}
                                            title="Copy office address"
                                            aria-label="Copy Office Address"
                                        >
                                            {copiedField === 'Office Address' ? (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.infoCardFooter}>
                                    <div className={styles.activeStatusPill}>
                                        <span className={styles.greenDot} />
                                        <span>{t('contactUs.footerDeskStatus', '24/7 Global Trading Desk Online')}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN: Modern Form (Full Name, Email, Country, Phone, Message) */}
                        <motion.div
                            className={styles.formColumn}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className={styles.formGlassCard}>
                                <div className={styles.cardGlowBorder} />

                                <div className={styles.formHeader}>
                                    <div className={styles.formHeaderBadge}>
                                        <span>{t('contactUs.sendMessageBadge', 'SEND MESSAGE')}</span>
                                    </div>
                                    <h2 className={styles.formTitle}>{t('contactUs.formTitle', 'Send Us a Message')}</h2>
                                    <p className={styles.formSubtitle}>
                                        {t('contactUs.formSubtitle', 'Fill out the details below and our team will get back to you promptly.')}
                                    </p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {!isSubmitted ? (
                                        <motion.form
                                            key="form-fields"
                                            onSubmit={handleSubmit}
                                            className={styles.contactForm}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Row 1: Full Name & Email */}
                                            <div className={styles.formRow}>
                                                {/* 1. Full Name */}
                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="name">
                                                        {t('contactUs.labelFullName', 'Full Name')} <span className={styles.required}>*</span>
                                                    </label>
                                                    <div className={styles.inputWrapper}>
                                                        <span className={styles.fieldIcon}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                                <circle cx="12" cy="7" r="4" />
                                                            </svg>
                                                        </span>
                                                        <input
                                                            id="name"
                                                            type="text"
                                                            name="name"
                                                            placeholder={t('contactUs.placeholderName', 'Enter your full name')}
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            required
                                                            autoComplete="name"
                                                        />
                                                    </div>
                                                </div>

                                                {/* 2. Email */}
                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="email">
                                                        {t('contactUs.labelEmail', 'Email')} <span className={styles.required}>*</span>
                                                    </label>
                                                    <div className={styles.inputWrapper}>
                                                        <span className={styles.fieldIcon}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                                <polyline points="22,6 12,13 2,6" />
                                                            </svg>
                                                        </span>
                                                        <input
                                                            id="email"
                                                            type="email"
                                                            name="email"
                                                            placeholder={t('contactUs.placeholderEmail', 'example@thetradermaster.com')}
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            required
                                                            autoComplete="email"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 2: Country & Phone */}
                                            <div className={styles.formRow}>
                                                {/* 3. Country */}
                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="country">
                                                        {t('contactUs.labelCountry', 'Country')} <span className={styles.required}>*</span>
                                                    </label>
                                                    <div className={styles.inputWrapper}>
                                                        <span className={styles.fieldIcon}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <line x1="2" y1="12" x2="22" y2="12" />
                                                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                            </svg>
                                                        </span>
                                                        <select
                                                            id="country"
                                                            name="country"
                                                            value={formData.country}
                                                            onChange={handleInputChange}
                                                            className={styles.selectInput}
                                                            required
                                                        >
                                                            {COUNTRIES.map((c) => (
                                                                <option key={c} value={c}>
                                                                    {c}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <span className={styles.dropdownChevron}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                <polyline points="6 9 12 15 18 9" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 4. Phone (Custom Styled Phone Input) */}
                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="phone">
                                                        {t('contactUs.labelPhone', 'Phone')} <span className={styles.required}>*</span>
                                                    </label>
                                                    <div className={styles.phoneInputWrapper}>
                                                        <PhoneInputLib
                                                            international
                                                            limitMaxLength
                                                            defaultCountry="AE"
                                                            value={formData.phone}
                                                            onChange={handlePhoneChange}
                                                            placeholder={t('contactUs.placeholderPhone', 'Phone number')}
                                                            className={styles.phoneCustomInput}
                                                            numberInputProps={{
                                                                id: 'phone',
                                                                required: true,
                                                                autoComplete: 'tel',
                                                                maxLength: 20
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 3: 5. Message */}
                                            <div className={styles.inputGroup}>
                                                <div className={styles.labelRow}>
                                                    <label htmlFor="message">
                                                        {t('contactUs.labelMessage', 'Message')} <span className={styles.required}>*</span>
                                                    </label>
                                                    <span className={styles.charCounter}>
                                                        {formData.message.length}/1000
                                                    </span>
                                                </div>
                                                <div className={styles.textareaWrapper}>
                                                    <textarea
                                                        id="message"
                                                        name="message"
                                                        rows={5}
                                                        maxLength={1000}
                                                        placeholder={t('contactUs.placeholderMessage', 'Write your message here...')}
                                                        value={formData.message}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Security Guarantee & Submit Button */}
                                            <div className={styles.submitSection}>
                                                <motion.button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className={styles.submitButton}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {isSubmitting ? (
                                                        <span className={styles.loadingSpinnerWrap}>
                                                            <span className={styles.spinner} />
                                                            <span>{t('contactUs.btnSending', 'Sending Message...')}</span>
                                                        </span>
                                                    ) : (
                                                        <span className={styles.btnContent}>
                                                            <span>{t('contactUs.btnSend', 'Send Message')}</span>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                <line x1="22" y1="2" x2="11" y2="13" />
                                                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </motion.form>
                                    ) : (
                                        <motion.div
                                            key="success-message"
                                            className={styles.successState}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className={styles.successIconBox}>
                                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                    <polyline points="22 4 12 14.01 9 11.01" />
                                                </svg>
                                            </div>

                                            <h3 className={styles.successTitle}>{t('contactUs.successTitle', 'Message Sent Successfully!')}</h3>
                                            <p className={styles.successDesc}>
                                                {t('contactUs.thankYou', 'Thank you')}, <strong className={styles.highlightName}>{formData.name}</strong>. {t('contactUs.successDesc', 'Our team has received your message and will reach out to you at')} <span className={styles.highlightEmail}>{formData.email}</span> {t('contactUs.shortly', 'shortly.')}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={handleResetForm}
                                                className={styles.resetBtn}
                                            >
                                                {t('contactUs.btnSendAnother', 'Send Another Message')}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 3. Interactive FAQ Section */}
                <ContactFaqSection t={t} />
            </div>
            {/* 4. Bottom Call to Action Banner (Common CTA) */}
            <CommonCta
                badge={t('contactUs.ctaBadge', 'READY FOR INSTITUTIONAL EXECUTION?')}
                title1={t('contactUs.ctaTitle1', 'Ready to Trade with')}
                title2={t('contactUs.ctaTitle2', 'Institutional AI Intelligence?')}
                description={t('contactUs.ctaDesc', 'Join thousands of elite forex and crypto traders leveraging TraderMaster real-time neural vision and high-probability signals.')}
                primaryBtnText={t('contactUs.ctaBtn', 'GET STARTED NOW')}
                primaryBtnAction="/signup"
            />

        </div>
    );
}
