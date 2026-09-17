'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LineText from '@/components/lineText';
import styles from './pastTradeFaq.module.scss';

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const MinusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export default function PastTradeFaq() {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is Past Trade Analyzer?",
            answer: "Past Trade Analyzer is an AI-powered trade review feature that analyzes completed trades and provides structured feedback on execution, market context, risk management, and potential mistakes.",
        },
        {
            question: "What can I upload?",
            answer: "You can upload a screenshot of a completed trade or provide the supported trade information required by the analyzer. The clearer and more complete the information, the more useful the analysis can be.",
        },
        {
            question: "What does the AI analyze?",
            answer: "The analyzer can review areas such as:\n• Entry and exit\n• Market structure\n• Price action\n• Key levels\n• Stop-loss and take-profit\n• Risk/reward\n• Trade outcome\n• Execution quality",
        },
        {
            question: "Can it tell me why I lost a trade?",
            answer: "It can identify potential factors that may have contributed to the trade outcome, such as premature entries, weak confirmation, poor risk/reward, stop placement, or other execution issues visible in the available trade information.",
        },
        {
            question: "Can it analyze winning trades?",
            answer: "Yes. Reviewing winning trades can be just as useful as reviewing losing ones. It can help you understand what elements of your execution and setup worked well.",
        },
        {
            question: "Does Past Trade Analyzer automatically know my trading strategy?",
            answer: "Not necessarily. The analysis is based on the information available from your trade and chart. For more meaningful comparisons, you should use your own strategy rules and trading context where the product supports them.",
        },
        {
            question: "Can it identify repeated trading mistakes?",
            answer: "A single trade can reveal an issue, but repeated trade reviews are much more useful for identifying recurring patterns in your execution.",
        },
        {
            question: "Does it give me a trading signal for my next trade?",
            answer: "Past Trade Analyzer is primarily a review and learning tool. Its purpose is to analyze completed trades and provide feedback, rather than guarantee what a future trade will do.",
        },
        {
            question: "Can beginners use Past Trade Analyzer?",
            answer: "Yes. It can help newer traders understand what happened in a completed trade and learn concepts such as market structure, entry timing, risk/reward, and stop-loss placement.",
        },
        {
            question: "Can experienced traders use it?",
            answer: "Yes. Experienced traders can use it as an additional review layer for checking execution quality and identifying recurring weaknesses or patterns.",
        },
        {
            question: "Is a losing trade always a bad trade?",
            answer: "Not necessarily. A trade can follow a well-defined process and still lose because markets are uncertain. Reviewing the quality of the decision and execution can therefore be more useful than judging the trade only by its profit or loss.",
        },
        {
            question: "Is a winning trade always a good trade?",
            answer: "Not necessarily. A profitable outcome does not automatically mean the entry, risk management, or execution was optimal. Reviewing the process helps separate outcome from decision quality.",
        },
        {
            question: "Does the analyzer guarantee better trading results?",
            answer: "No. AI analysis cannot guarantee improved profits or future trading performance. The feature is designed to provide analytical and educational feedback.",
        },
        {
            question: "How can I use the analyzer as part of my trading routine?",
            answer: "A simple workflow is:\nTake Trade → Record Trade → Analyze Trade → Identify Lessons → Update Your Process\nRegular review can help turn your trading history into a continuous learning loop.",
        },
        {
            question: "Is my trade analysis financial advice?",
            answer: "No. The analyzer should be treated as an analytical and educational tool. Trading involves substantial financial risk, and users remain responsible for their own trading decisions and risk management.",
        },
    ];

    return (
        <section className={styles.pastTradeFaq}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text="FAQ" />
                    <h2>
                        Frequently Asked <span className={styles.neonText}>Questions</span>
                    </h2>
                    <p>Everything you need to know about Past Trade Analyzer.</p>
                </div>

                <div className={styles.faqList}>
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            className={`${styles.faqItem} ${openFaqIndex === idx ? styles.active : ''}`}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: idx * 0.03 }}
                        >
                            <button
                                className={styles.faqQuestion}
                                onClick={() => toggleFaq(idx)}
                                aria-expanded={openFaqIndex === idx}
                            >
                                <span>{faq.question}</span>
                                <div className={styles.faqIcon}>
                                    {openFaqIndex === idx ? <MinusIcon /> : <PlusIcon />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openFaqIndex === idx && (
                                    <motion.div
                                        className={styles.faqAnswer}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        {faq.answer.includes('\n•') ? (
                                            <div>
                                                <p>{faq.answer.split('\n•')[0]}</p>
                                                <ul>
                                                    {faq.answer.split('\n•').slice(1).map((item, i) => (
                                                        <li key={i}>{item.trim()}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <p>{faq.answer}</p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
