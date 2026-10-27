"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../contactUs.module.scss';
import { getContactFaqs } from '../contactData';

export default function ContactFaqSection({ t }) {
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const faqs = getContactFaqs(t);

    const toggleFaq = (index) => {
        setOpenFaqIndex(prev => (prev === index ? null : index));
    };

    return (
        <motion.section
            className={styles.faqSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
        >
            <div className={styles.faqHeader}>
                <div className={styles.faqBadge}>
                    <span>{t('contactUs.faqBadge', 'SUPPORT FAQ')}</span>
                </div>
                <h2 className={styles.faqTitle}>{t('contactUs.faqTitle', 'Frequently Asked Questions')}</h2>
                <p className={styles.faqSubtitle}>
                    {t('contactUs.faqSubtitle', 'Quick answers to common questions about ChronosX AI tools, account setup, and features.')}
                </p>
            </div>

            <div className={styles.faqAccordionList}>
                {faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                        <div
                            key={index}
                            className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ''}`}
                        >
                            <button
                                type="button"
                                className={styles.faqQuestionBtn}
                                onClick={() => toggleFaq(index)}
                                aria-expanded={isOpen}
                            >
                                <span className={styles.faqQuestionText}>{faq.q}</span>
                                <span className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ''}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </span>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        className={styles.faqAnswerWrapper}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div className={styles.faqAnswerContent}>
                                            <p>{faq.a}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
}
