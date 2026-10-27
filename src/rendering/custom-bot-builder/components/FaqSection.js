"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../customBotBuilder.module.scss';

const FAQS = [
  {
    q: "What is the TraderMaster AI Custom Bot Builder?",
    a: "The TraderMaster AI Custom Bot Builder lets you discover existing bots, create bots with AI assistance, or manually build your own bot through a guided workflow."
  },
  {
    q: "Can I create a bot using AI?",
    a: "Yes. You can describe your trading idea through conversational AI and refine the resulting configuration through chat."
  },
  {
    q: "Can I build a bot manually?",
    a: "Yes. The guided builder allows you to configure your bot through Basics, Entry Rules, Exit Rules, Risk, and Review."
  },
  {
    q: "Do I need coding knowledge?",
    a: "The bot builder is designed around a no-code configuration workflow, allowing you to create your bot through AI or guided settings."
  },
  {
    q: "Can I use a bot from the marketplace?",
    a: "Yes. You can explore available bots, review their information, and use supported bots as part of your trading workflow."
  },
  {
    q: "Can I backtest a bot I create?",
    a: "Yes. Created bots can be sent directly to the TraderMaster Backtesting workflow for historical simulation."
  },
  {
    q: "Can I modify a bot after backtesting?",
    a: "Yes. You can refine supported bot settings and run another backtest as part of an iterative testing workflow."
  },
  {
    q: "What can I configure?",
    a: "Depending on the available builder options, you can configure the market, timeframe, entry conditions, exit conditions, and risk-management settings."
  },
  {
    q: "Does backtesting guarantee future performance?",
    a: "No. Backtesting evaluates historical behavior based on historical data and selected assumptions. Historical results do not guarantee future live-market performance."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className="container">
        <SectionHeader
          badge="FREQUENTLY ASKED QUESTIONS"
          title1="Everything You Need to Know"
          title2="About Bot Builder"
          description="Have questions? Here is everything you need to know about creating, customizing, and backtesting bots on TraderMaster."
        />

        <div className={styles.faqAccordionList}>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`${styles.faqItem} ${isOpen ? styles.activeFaq : ''}`}
              >
                <button
                  className={styles.faqQuestionBtn}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`${styles.chevronIcon} ${isOpen ? styles.rotated : ''}`}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className={styles.faqAnswerBody}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
