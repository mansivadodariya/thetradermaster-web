'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './newsletterSection.module.scss'
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/components/toast'
import Loader from '@/components/loader'
import { useLanguage } from '@/context/LanguageContext'

export default function NewsletterSection() {
    const { t } = useLanguage()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubscribe = async (e) => {
        e.preventDefault()

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.trim() || !emailRegex.test(email.trim())) {
            toast.error(t('footer.invalidEmail', 'Please enter a valid email address.'))
            return
        }

        if (!supabase) {
            toast.error('Newsletter client is not initialized.')
            return
        }

        setIsLoading(true)

        try {
            const { data: existingSubs, error: checkError } = await supabase
                .from('newsletter_subscribers')
                .select('id')
                .eq('email', email.trim())

            if (checkError) {
                toast.error(t('footer.subError', 'An error occurred. Please try again.'))
                setIsLoading(false)
                return
            }

            if (existingSubs && existingSubs.length > 0) {
                toast.success(t('footer.alreadySubscribed', 'You are already subscribed to our newsletter!'))
                setEmail('')
                setIsLoading(false)
                return
            }

            const { error: insertError } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email: email.trim() }])

            if (insertError) {
                toast.error(t('footer.subError', 'An error occurred. Please try again.'))
            } else {
                toast.success(t('footer.subSuccess', 'Successfully subscribed to the newsletter!'))
                setEmail('')
            }
        } catch (err) {
            toast.error(t('footer.subError', 'An error occurred. Please try again.'))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className={styles.newsletterSection}>
            <div className="container-xs">
                <motion.div
                    className={styles.banner}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.content}>
                        <h2>
                            {t('home.newsletterTitlePart1', 'Stay Updated With')}{' '}
                            <span className={styles.neonText}>
                                {t('home.newsletterTitlePart2', 'Trading Insights')}
                            </span>
                        </h2>
                        <p>{t('home.newsletterSubtitle', 'Join thousands of traders receiving our latest AI updates, feature releases, and market strategies directly in their inbox.')}</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubscribe}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                placeholder={t('footer.emailPlaceholder', 'Enter your email address')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !email.trim()}
                                className={styles.submitBtn}
                            >
                                {isLoading ? (
                                    <Loader size="sm" color="#FFF" />
                                ) : (
                                    <span>{t('footer.subscribe', 'Subscribe')}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    )
}
