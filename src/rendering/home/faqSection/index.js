'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './faqSection.module.scss'
import LineText from '@/components/lineText'
import { useLanguage } from '@/context/LanguageContext'

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

const MinusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

export default function FaqSection() {
    const { t } = useLanguage()
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            question: t('home.faq1Q', 'What is Trader Master?'),
            answer: t('home.faq1A', 'Trader Master is an AI-powered Forex intelligence platform built exclusively for MT5 traders. It offers three core tools — AI Trade (chart analysis), AI Chat (market assistant), and AI Strategy (strategy generation) — all powered by proprietary visual analytics and institutional data feeds.'),
        },
        {
            question: t('home.faq2Q', 'Do I need an MT5 account to use Trader Master?'),
            answer: t('home.faq2A', 'While you can explore the platform without one, linking your Newera MT5 account unlocks the full credit system. Your trading activity on Newera automatically replenishes your AI analysis credits.'),
        },
        {
            question: t('home.faq3Q', 'How does the credit system work?'),
            answer: t('home.faq3A', 'Every AI interaction (chart analysis, chat query, strategy generation) costs credits. You earn credits by trading on your linked Newera account — each completed trade cycle automatically replenishes your balance. No subscription or upfront payment required.'),
        },
        {
            question: t('home.faq4Q', 'Is my trading data safe with Trader Master?'),
            answer: t('home.faq4A', 'Absolutely. Trader Master never accesses your brokerage account directly, does not hold client deposits, and does not execute trades on your behalf. We are a technology and research platform — not a broker. Your data is protected with industry-standard encryption and security measures.'),
        },
        {
            question: t('home.faq5Q', 'What currency pairs and markets are supported?'),
            answer: t('home.faq5A', 'Trader Master supports 50+ currency pairs including all major, minor, and exotic Forex pairs, plus commodities (Gold, Silver, Oil) and global indices (US30, NAS100, etc.). Market data is sourced from institutional feeds for analytical accuracy.'),
        },
        {
            question: t('home.faq6Q', 'Is Trader Master a broker or financial advisor?'),
            answer: t('home.faq6A', 'No. Trader Master operates exclusively as an AI technology and market research platform. We are not a registered broker-dealer, financial custodian, or investment advisor. All analysis is for informational and educational purposes only.'),
        },
        {
            question: t('home.faq7Q', 'How accurate is the AI chart analysis?'),
            answer: t('home.faq7A', 'Our AI models are trained on extensive historical market data and continuously refined. While no analysis tool can guarantee accuracy, Trader Master identifies structure, key levels, patterns, and risk/reward math that professional traders rely on daily. Always validate AI insights with your own analysis.'),
        },
        {
            question: t('home.faq8Q', 'Can I use Trader Master on my phone?'),
            answer: t('home.faq8A', 'Yes. Trader Master is a web-based platform accessible from any modern browser on desktop, tablet, or mobile. No app download is required — simply visit the website and log in to access all features.'),
        },
    ]

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className={styles.faqSection} id="faq">
            <div className="container">
                <LineText text={t('home.faqLine', 'FAQ')} />
                <div className={styles.title}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {t('home.faqTitle', 'Frequently asked questions')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {t('home.faqSubtitle', 'Everything you need to know about Trader Master and how it works.')}
                    </motion.p>
                </div>

                <div className={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.active : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <button
                                className={styles.faqQuestion}
                                onClick={() => toggleFaq(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{faq.question}</span>
                                <div className={styles.faqIcon}>
                                    {openIndex === index ? <MinusIcon /> : <PlusIcon />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        className={styles.faqAnswer}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <p>{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
