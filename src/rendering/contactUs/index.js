'use client'
import React, { useState } from 'react'
import styles from './contactUs.module.scss'
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/components/toast'
import Loader from '@/components/loader'
import { useLanguage } from '@/context/LanguageContext'

const MailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 6L12 13L2 6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const ClockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
        <path d="M12 6V12L16 14" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const GlobeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
        <path d="M2 12H22" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 2C14.5 4.73 15.94 8.28 16 12C15.94 15.72 14.5 19.27 12 22C9.5 19.27 8.06 15.72 8 12C8.06 8.28 9.5 4.73 12 2Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export default function ContactUs() {
    const { t } = useLanguage()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error(t('contact.fillRequired', 'Please fill in all required fields.'))
            return
        }

        if (!emailRegex.test(formData.email.trim())) {
            toast.error(t('contact.invalidEmail', 'Please enter a valid email address.'))
            return
        }

        if (!supabase) {
            toast.error('Contact form client is not initialized.')
            return
        }

        setSubmitting(true)
        try {
            const { error } = await supabase
                .from('contact_submissions')
                .insert([{
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    subject: formData.subject.trim(),
                    message: formData.message.trim()
                }])

            if (error) {
                toast.error(error.message || t('contact.submitError', 'Failed to send message.'))
            } else {
                toast.success(t('contact.submitSuccess', 'Your message has been sent successfully! We\'ll get back to you soon.'))
                setFormData({ name: '', email: '', subject: '', message: '' })
            }
        } catch (err) {
            toast.error(err.message || t('contact.unexpectedError', 'An unexpected error occurred.'))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={styles.contactUs}>
            <div className='container-xs'>
                {/* Hero */}
                <div className={styles.header}>
                    <span className={styles.badge}>{t('contact.badge', 'Get In Touch')}</span>
                    <h1>{t('contact.title', 'Contact Us')}</h1>
                    <p className={styles.subtitle}>
                        {t('contact.subtitle', 'Have a question, feedback, or need support? We\'d love to hear from you. Reach out and our team will get back to you as soon as possible.')}
                    </p>
                </div>

                {/* Main Content */}
                <div className={styles.contactGrid}>
                    {/* Contact Info Cards */}
                    <div className={styles.infoColumn}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <MailIcon />
                            </div>
                            <div className={styles.infoContent}>
                                <h3>{t('contact.emailSupport', 'Email Support')}</h3>
                                <p>{t('contact.emailDesc', 'Send us an email and we\'ll respond within 24 hours.')}</p>
                                <a href="mailto:support@trademaster.ai">support@trademaster.ai</a>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <ClockIcon />
                            </div>
                            <div className={styles.infoContent}>
                                <h3>{t('contact.supportHours', 'Support Hours')}</h3>
                                <p>{t('contact.supportHoursDesc', 'Our support team is available during market hours to assist you.')}</p>
                                <span className={styles.highlight}>{t('contact.hours', 'Monday – Friday, 9:00 AM – 6:00 PM (GMT)')}</span>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <GlobeIcon />
                            </div>
                            <div className={styles.infoContent}>
                                <h3>{t('contact.platform', 'Platform')}</h3>
                                <p>{t('contact.platformDesc', 'Access Trader Master from anywhere in the world.')}</p>
                                <span className={styles.highlight}>{t('contact.platformAvail', 'Available globally via web browser')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={styles.formColumn}>
                        <form className={styles.contactForm} onSubmit={handleSubmit}>
                            <h2>{t('contact.formTitle', 'Send us a message')}</h2>

                            <div className={styles.formGroup}>
                                <label htmlFor="contact-name">{t('contact.nameLabel', 'Full Name')} <span>*</span></label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    name="name"
                                    placeholder={t('contact.namePlaceholder', 'Enter your full name')}
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="contact-email">{t('contact.emailLabel', 'Email Address')} <span>*</span></label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    name="email"
                                    placeholder={t('contact.emailPlaceholder', 'Enter your email address')}
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="contact-subject">{t('contact.subjectLabel', 'Subject')}</label>
                                <input
                                    id="contact-subject"
                                    type="text"
                                    name="subject"
                                    placeholder={t('contact.subjectPlaceholder', 'What is this regarding?')}
                                    value={formData.subject}
                                    onChange={handleChange}
                                    disabled={submitting}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="contact-message">{t('contact.messageLabel', 'Message')} <span>*</span></label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    placeholder={t('contact.messagePlaceholder', 'Write your message here...')}
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    rows={5}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={submitting}
                            >
                                {submitting ? <Loader size="sm" /> : t('contact.sendButton', 'Send Message')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
