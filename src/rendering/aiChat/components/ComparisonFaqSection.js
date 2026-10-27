'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { COMPARISON_DATA, FAQS } from '../constants/aiChatData';
import styles from '../aiChat.module.scss';

export default function ComparisonFaqSection({ openFaq, setOpenFaq }) {
    const { t } = useLanguage();

    return (
        <>
            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 6. WHY USE OUR AI TRADING ASSISTANT? (COMPARISON TABLE) */}
            <section className={styles.comparisonSection}>
                <div className="container">
                    <SectionHeader
                        badge={t('aiChat.comparisonBadge', 'SYSTEM COMPARISON MATRIX')}
                        title1={t('aiChat.comparisonTitle1', 'WHY USE OUR')}
                        title2={t('aiChat.comparisonTitle2', 'SPECIALIZED AI COPILOT?')}
                        description={t('aiChat.comparisonSubtitle', 'See how ChronosX compares against generic, uncalibrated language models in live trading conditions.')}
                        align="center"
                    />

                    <div className={styles.tableCard}>
                        <div className={styles.tableResponsive}>
                            <table className={styles.comparisonTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.thFeature}>{t('aiChat.faq.coreCapability', 'CORE CAPABILITY')}</th>
                                        <th className={styles.thGeneric}>{t('aiChat.faq.genericBots', 'GENERIC CHATBOTS (ChatGPT / Free AI)')}</th>
                                        <th className={styles.thChronosX}>
                                            <div className={styles.chronosHeaderBadge}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#18C98B" fillOpacity="0.3" />
                                                </svg>
                                                <span>{t('aiChat.faq.specializedCopilot', 'OUR SPECIALIZED AI COPILOT')}</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON_DATA.map((row, idx) => (
                                        <tr key={idx} className={row.highlight ? styles.rowHighlight : ''}>
                                            <td className={styles.tdFeature}>
                                                <strong>{row.feature}</strong>
                                            </td>
                                            <td className={styles.tdGeneric}>
                                                <div className={styles.statusRow}>
                                                    {row.generic.status === 'cross' && (
                                                        <span className={styles.statusIconCross}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                                <line x1="6" y1="6" x2="18" y2="18" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    {row.generic.status === 'warn' && (
                                                        <span className={styles.statusIconWarn}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    <span className={styles.genericText}>{row.generic.text}</span>
                                                </div>
                                            </td>
                                            <td className={styles.tdChronosX}>
                                                <div className={styles.chronosTextWrap}>
                                                    <span className={styles.statusIconCheck}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </span>
                                                    <span className={styles.chronosText}>{row.chronosx.text}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ SECTION) */}
            <section className={styles.faqSection}>
                <div className="container-xs4">
                    <SectionHeader
                        badge={t('aiChat.faqBadge', 'FREQUENTLY ASKED QUESTIONS')}
                        title1={t('aiChat.faqTitle1', 'ANSWERS TO')}
                        title2={t('aiChat.faqTitle2', 'YOUR QUESTIONS')}
                        description={t('aiChat.faqSubtitle', 'Everything you need to know about ChronosX AI Chat, MT5 feeds, and risk calculation.')}
                        align="center"
                    />

                    <div className={styles.faqAccordion}>
                        {FAQS.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <motion.div
                                    key={index}
                                    className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                >
                                    <button
                                        type="button"
                                        className={styles.faqQuestionBtn}
                                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className={styles.qIcon}>Q:</span>
                                        <span className={styles.qText}>{faq.question}</span>
                                        <span className={styles.faqToggleIcon}>
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                className={isOpen ? styles.iconRotated : ''}
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                className={styles.faqAnswerWrapper}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <div className={styles.faqAnswerContent}>
                                                    <p>{faq.answer}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
