"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import styles from './publicAffiliate.module.scss';

const FAQS = [
  {
    q: "How do I join the affiliate program?",
    a: "Create or sign in to your TraderMaster account and complete the available affiliate onboarding process."
  },
  {
    q: "How much can I earn?",
    a: "The current affiliate structure provides a 10% Tier 1 commission and a 20% Tier 2 Pro Partner commission, subject to the applicable qualification and program terms."
  },
  {
    q: "When do I get paid?",
    a: "Eligible commissions become available for withdrawal after the applicable settlement or verification period and once the relevant withdrawal requirements are met."
  },
  {
    q: "What payment methods are available?",
    a: "Available payout methods depend on the current TraderMaster Affiliate Program configuration and supported withdrawal options."
  },
  {
    q: "Is there a minimum traffic requirement?",
    a: "Eligibility and tier requirements depend on the official TraderMaster Affiliate Program terms. No specific traffic requirement is enforced unless stated in the program terms."
  },
  {
    q: "Can I promote TraderMaster on social media?",
    a: "Yes, affiliates can share their referral links through permitted social media channels, communities, websites, content platforms, and other approved promotional channels."
  },
  {
    q: "Do you provide marketing materials?",
    a: "TraderMaster provides promotional assets, referral links, product information, and materials to support affiliate promotion."
  },
  {
    q: "Who can I contact for support?",
    a: "Affiliate partners can use the available TraderMaster support channels for questions related to their partner account, referrals, commissions, and withdrawals."
  }
];

export default function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className="container">
        <SectionHeader
          badge={t('publicAffiliate.faqBadge', 'FAQ')}
          title1="Common"
          title2="Questions"
          description={t('publicAffiliate.faqSubtitle', 'Find answers to the most frequently asked questions about the TraderMaster Affiliate Program.')}
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
