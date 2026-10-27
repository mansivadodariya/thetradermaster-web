'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './customerSupport.module.scss';
import Button from '@/components/button';
import PhoneInput from '@/components/phoneInput';
import { supportApi } from '@/lib/api';
import { toast } from '@/components/toast';
import Loader from '@/components/loader';
import { useLanguage } from '@/context/LanguageContext';

// Icons
const HeadsetIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
);

const ClockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const UploadCloudIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        <polyline points="16 16 12 12 8 16" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const CopyIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const SendIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const AlertCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const FAQ_ITEMS = [
    {
        q: 'MT5 account connection issue?',
        a: 'Ensure your MT5 account number, investor/master password, and exact broker server name match in Settings.'
    },
    {
        q: 'Broker lot verification delay?',
        a: 'Trading lot volumes sync automatically upon MT5 order closure. Please allow up to 10 minutes during high-volatility sessions.'
    },
    {
        q: 'Credits & subscription queries?',
        a: 'Subscription credits are credited immediately upon transaction confirmation by the gateway.'
    },
    {
        q: 'How do I track my submitted ticket?',
        a: 'Save your unique Ticket ID (e.g. CX-XXXX). Our specialists reply directly via your provided contact details.'
    }
];

export default function CustomerSupport({ isDashboard: propIsDashboard }) {
    const { t } = useLanguage();
    const pathname = usePathname();
    const fileInputRef = useRef(null);

    // Auto-detect dashboard vs public mode:
    // If explicitly passed, use prop. Otherwise detect if route is within (user) dashboard (/customer-support)
    const isDashboard = propIsDashboard !== undefined
        ? propIsDashboard
        : pathname?.startsWith('/customer-support') || !pathname?.startsWith('/support');

    const [form, setForm] = useState({
        name: '',
        email: '',
        contact_no: '',
        description: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [submittedTicket, setSubmittedTicket] = useState(null);
    const [copied, setCopied] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);

    // Auto-prefill if user is logged in
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('user');
                if (stored) {
                    const user = JSON.parse(stored);
                    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || '';
                    setForm(prev => ({
                        ...prev,
                        name: prev.name || fullName,
                        email: prev.email || user.email || '',
                        contact_no: prev.contact_no || user.phone_number || '',
                    }));
                }
            }
        } catch (_) {}
    }, []);

    // Clean up preview URL on unmount or file change
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errorMessage) setErrorMessage('');
    };

    const handlePhoneChange = (val) => {
        setForm(prev => ({ ...prev, contact_no: val || '' }));
        if (errorMessage) setErrorMessage('');
    };

    const handleFileSelect = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error(t('support.fileInvalidType', 'Please upload an image file (PNG, JPG, JPEG, WEBP).'));
            return;
        }

        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            toast.error(t('support.fileTooLarge', 'File size exceeds 10MB limit.'));
            return;
        }

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        if (errorMessage) setErrorMessage('');
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('support@thetradermaster.com');
        toast.success('Support email copied to clipboard!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.name.trim()) {
            toast.error('Please enter your full name.');
            return;
        }

        if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
            toast.error(t('support.invalidEmail', 'Please enter a valid email address.'));
            return;
        }

        if (!form.contact_no || form.contact_no.trim().length < 6) {
            toast.error(t('support.invalidPhone', 'Please enter a valid contact number.'));
            return;
        }

        if (!form.description.trim()) {
            toast.error('Please describe the issue in detail.');
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', form.name.trim());
            formData.append('email', form.email.trim());
            formData.append('contact_no', form.contact_no.trim());
            
            formData.append('description', form.description.trim());
            formData.append('project_id', '2');

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await supportApi.createTicket(formData);
            const ticketData = response?.data || response;

            const createdTicket = {
                ticket_id: ticketData?.ticket_id || ticketData?.id || 'CX-' + Math.floor(1000 + Math.random() * 9000),
                name: ticketData?.name || form.name.trim(),
                email: ticketData?.email || form.email.trim(),
                contact_no: ticketData?.contact_no || form.contact_no.trim(),
                description: form.description.trim(),
                image_url: ticketData?.image_url || imagePreview,
                status: ticketData?.status || 'OPEN',
                created_at: ticketData?.created_at || new Date().toISOString(),
            };

            setSubmittedTicket(createdTicket);
            toast.success(response?.message || 'Support ticket created successfully!');
        } catch (err) {
            console.error('Support ticket submission error:', err);
            const msg = err.message || 'Failed to submit support ticket. Please check your network and try again.';
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCopyTicketId = () => {
        if (!submittedTicket?.ticket_id) return;
        navigator.clipboard.writeText(submittedTicket.ticket_id);
        setCopied(true);
        toast.success(t('support.copied', 'Copied ticket ID to clipboard!'));
        setTimeout(() => setCopied(false), 3000);
    };

    const handleReset = () => {
        setSubmittedTicket(null);
        setForm(prev => ({
            ...prev,
            description: '',
        }));
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview(null);
        setErrorMessage('');
    };

    return (
        <div className={`${styles.supportWrapper} ${isDashboard ? styles.dashboardMode : styles.publicMode}`}>
            <div className={styles.containerInner}>
                {/* Header */}
                <div className={styles.pageHeader}>
                    {isDashboard ? (
                        <>
                            <div className={styles.headerLeft}>
                                <h1>
                                    <HeadsetIcon className={styles.titleIcon} />
                                    Customer Support & Help Desk
                                </h1>
                                <p>Submit technical tickets, MT5 connectivity inquiries, or broker questions directly to our support team.</p>
                            </div>
                          
                        </>
                    ) : (
                        <>
                            <div className={styles.badge}>
                                <span className={styles.pulse} />
                                {t('support.badge', '24/7 Assistance')}
                            </div>
                            <h1>{t('support.title', 'Customer Support')}</h1>
                            <p>
                                {t('support.subtitle', 'Need assistance with your account, trading tools, or platform features? Submit a ticket below and our support team will assist you.')}
                            </p>
                        </>
                    )}
                </div>

                {/* Two-Column Layout */}
                <div className={styles.layoutGrid}>
                    {/* Left Column: Sidebar / Help Hub */}
                    <div className={styles.sidebarCol}>
                        {/* Desk Status Card */}
                        <div className={styles.sideCard}>
                            <h3 className={styles.cardTitle}>
                                <ClockIcon />
                                Support Operations
                            </h3>
                            <div className={styles.metricsGrid}>
                                <div className={styles.metricItem}>
                                    <div className={styles.metricLabel}>Avg Response</div>
                                    <div className={styles.metricVal}>&lt; 2 Hours</div>
                                </div>
                                <div className={styles.metricItem}>
                                    <div className={styles.metricLabel}>Coverage</div>
                                    <div className={styles.metricVal}>24/5 Live</div>
                                </div>
                            </div>
                            <div className={styles.directEmailBox}>
                                <span className={styles.emailText}>support@thetradermaster.com</span>
                                <button
                                    type="button"
                                    className={styles.copyMiniBtn}
                                    onClick={handleCopyEmail}
                                    title="Copy support email"
                                >
                                    <CopyIcon />
                                </button>
                            </div>
                        </div>

                        {/* Quick Solution FAQs */}
                        <div className={styles.sideCard}>
                            <h3 className={styles.cardTitle}>
                                <HeadsetIcon />
                                Quick Help Topics
                            </h3>
                            <div className={styles.faqList}>
                                {FAQ_ITEMS.map((item, idx) => {
                                    const isOpen = activeFaq === idx;
                                    return (
                                        <div
                                            key={idx}
                                            className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ''}`}
                                        >
                                            <button
                                                type="button"
                                                className={`${styles.faqQuestion} ${isOpen ? styles.isOpen : ''}`}
                                                onClick={() => setActiveFaq(isOpen ? null : idx)}
                                            >
                                                <span>{item.q}</span>
                                                <ChevronDownIcon />
                                            </button>
                                            {isOpen && (
                                                <div className={styles.faqAnswer}>
                                                    {item.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Submission Checklist */}
                        <div className={styles.sideCard}>
                            <h3 className={styles.cardTitle}>
                                <CheckCircleIcon />
                                Submission Tips
                            </h3>
                            <ul className={styles.guidanceList}>
                                <li>
                                    <CheckCircleIcon />
                                    <span>Provide exact error messages or unexpected behaviour.</span>
                                </li>
                                <li>
                                    <CheckCircleIcon />
                                    <span>Attach full-screen screenshot showing your chart/settings.</span>
                                </li>
                                <li>
                                    <CheckCircleIcon />
                                    <span>Keep your generated Ticket ID handy for follow-ups.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Main Form or Ticket Success State */}
                    <div className={styles.mainCol}>
                        {!submittedTicket ? (
                            <div className={styles.formCard}>
                                <div className={styles.cardHeader}>
                                    <h2>
                                        <SendIcon />
                                        {t('support.formTitle', 'Submit a Support Ticket')}
                                    </h2>
                                    <p>{t('support.formDesc', 'Fill in the details below. Our technical specialists review incoming requests around the clock.')}</p>
                                </div>

                                <form className={styles.ticketForm} onSubmit={handleSubmit} noValidate>
                                    {/* Row 1: Name & Email */}
                                    <div className={styles.twoColRow}>
                                        <div className={styles.fieldGroup}>
                                            <label htmlFor="sup-name" className={styles.fieldLabel}>
                                                <span>{t('support.nameLabel', 'Full Name')} <span className={styles.req}>*</span></span>
                                            </label>
                                            <input
                                                id="sup-name"
                                                name="name"
                                                type="text"
                                                placeholder={t('support.namePlaceholder', 'e.g. John Doe')}
                                                value={form.name}
                                                onChange={handleInputChange}
                                                disabled={submitting}
                                                required
                                            />
                                        </div>

                                        <div className={styles.fieldGroup}>
                                            <label htmlFor="sup-email" className={styles.fieldLabel}>
                                                <span>{t('support.emailLabel', 'Email Address')} <span className={styles.req}>*</span></span>
                                            </label>
                                            <input
                                                id="sup-email"
                                                name="email"
                                                type="email"
                                                placeholder={t('support.emailPlaceholder', 'e.g. johndoe@example.com')}
                                                value={form.email}
                                                onChange={handleInputChange}
                                                disabled={submitting}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Contact Number */}
                                    <div className={styles.twoColRow}>
                                        <div className={styles.fieldGroup}>
                                            <label htmlFor="sup-phone" className={styles.fieldLabel}>
                                                <span>{t('support.contactNoLabel', 'Contact Number')} <span className={styles.req}>*</span></span>
                                            </label>
                                            <PhoneInput
                                                id="sup-phone"
                                                value={form.contact_no}
                                                onChange={handlePhoneChange}
                                                placeholder={t('support.contactNoPlaceholder', 'Enter phone number')}
                                                disabled={submitting}
                                            />
                                        </div>

                                        <div className={styles.fieldGroup}>
                                            <div className={styles.fieldLabel}>
                                                <span>&nbsp;</span>
                                            </div>
                                            <div className={styles.emptyFieldSpacer} aria-hidden="true" />
                                        </div>
                                    </div>

                                    {/* Row 3: Description */}
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor="sup-desc" className={styles.fieldLabel}>
                                            <span>{t('support.descriptionLabel', 'Issue Description')} <span className={styles.req}>*</span></span>
                                            <span className={styles.charCount}>{form.description.length} chars</span>
                                        </label>
                                        <textarea
                                            id="sup-desc"
                                            name="description"
                                            rows={4}
                                            placeholder={t('support.descriptionPlaceholder', 'Describe the issue you are experiencing in detail...')}
                                            value={form.description}
                                            onChange={handleInputChange}
                                            disabled={submitting}
                                            required
                                        />
                                    </div>

                                    {/* Row 4: Screenshot Upload (Fixed double optional bug) */}
                                    <div className={styles.fieldGroup}>
                                        <div className={styles.fieldLabel}>
                                            <span>Screenshot / Attachment</span>
                                            <span className={styles.optionalPill}>(Optional)</span>
                                        </div>

                                        {!imagePreview ? (
                                            <div
                                                className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                                    className={styles.hiddenInput}
                                                    onChange={handleFileInputChange}
                                                    disabled={submitting}
                                                />
                                                <div className={styles.dropzoneContent}>
                                                    <div className={styles.uploadIcon}>
                                                        <UploadCloudIcon />
                                                    </div>
                                                    <div className={styles.dropzoneText}>
                                                        <div className={styles.mainText}>
                                                            <span>Click to browse</span> or drag & drop screenshot
                                                        </div>
                                                        <div className={styles.hintText}>
                                                            PNG, JPG, or WebP up to 10MB
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={styles.filePreview}>
                                                <div className={styles.fileLeft}>
                                                    <img src={imagePreview} alt="Screenshot preview" className={styles.thumb} />
                                                    <div className={styles.fileMeta}>
                                                        <div className={styles.fileName}>{imageFile?.name || 'Attached Screenshot'}</div>
                                                        <div className={styles.fileSize}>
                                                            {imageFile?.size ? `${(imageFile.size / 1024).toFixed(1)} KB` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.removeBtn}
                                                    onClick={handleRemoveImage}
                                                    disabled={submitting}
                                                    aria-label="Remove image"
                                                >
                                                    <TrashIcon />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Error Banner */}
                                    {errorMessage && (
                                        <div className={styles.errorBanner}>
                                            <AlertCircleIcon />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    {/* Submit Action */}
                                    <div className={styles.submitAction}>
                                        <Button
                                            text={submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
                                            icon="/assets/icons/arrow.svg"
                                            type="submit"
                                            disabled={submitting}
                                            fullWidth
                                        />
                                    </div>
                                </form>
                            </div>
                        ) : (
                            /* Success State Card */
                            <div className={styles.successCard}>
                                <div className={styles.successIcon}>
                                    <CheckCircleIcon />
                                </div>
                                <h2>{t('support.successTitle', 'Support Ticket Created!')}</h2>
                                <p className={styles.successDesc}>
                                    {t('support.successSubtitle', 'Your ticket has been logged in our system. Please keep your Ticket ID handy for reference.')}
                                </p>

                                {/* Ticket ID Banner */}
                                <div className={styles.ticketBanner}>
                                    <div className={styles.ticketLeft}>
                                        <div className={styles.label}>
                                            {t('support.ticketIdLabel', 'Your Ticket ID')}
                                        </div>
                                        <div className={styles.valId}>
                                            {submittedTicket.ticket_id}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                                        onClick={handleCopyTicketId}
                                    >
                                        {copied ? <CheckCircleIcon /> : <CopyIcon />}
                                        <span>{copied ? 'Copied!' : 'Copy Ticket ID'}</span>
                                    </button>
                                </div>

                                {/* Summary Box */}
                                <div className={styles.detailsBox}>
                                    <div className={styles.detailRow}>
                                        <span className={styles.key}>Status</span>
                                        <span className={styles.statusBadge}>
                                            {submittedTicket.status || 'OPEN'}
                                        </span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.key}>Submitted By</span>
                                        <span className={styles.val}>{submittedTicket.name}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.key}>Email Address</span>
                                        <span className={styles.val}>{submittedTicket.email}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.key}>Contact Number</span>
                                        <span className={styles.val}>{submittedTicket.contact_no}</span>
                                    </div>
                                    {submittedTicket.created_at && (
                                        <div className={styles.detailRow}>
                                            <span className={styles.key}>Timestamp</span>
                                            <span className={styles.val}>
                                                {new Date(submittedTicket.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className={styles.descRow}>
                                        <span className={styles.key}>Description</span>
                                        <div className={styles.valDesc}>{submittedTicket.description}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className={styles.actionsRow}>
                                    <button
                                        type="button"
                                        className={styles.submitAnotherBtn}
                                        onClick={handleReset}
                                    >
                                        <SendIcon />
                                        <span>Submit Another Ticket</span>
                                    </button>
                                    <Link
                                        href={isDashboard ? "/dashboard" : "/"}
                                        className={styles.returnBtn}
                                    >
                                        {isDashboard ? "Back to Dashboard" : "Back to Home"}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
