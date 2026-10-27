"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import styles from './publicAffiliate.module.scss';

const TESTIMONIALS = [
  {
    quote: "The TraderMaster affiliate program gives me a simple way to share the platform with my trading audience while keeping track of my referral activity in one place.",
    author: "Daniel Carter",
    role: "Forex Educator",
    stars: "★★★★★"
  },
  {
    quote: "I've been sharing TraderMaster with my trading community and the dashboard makes it easy to monitor referrals and commissions.",
    author: "Sarah Khan",
    role: "Trading Community Manager",
    stars: "★★★★★"
  },
  {
    quote: "The referral process is simple, and having everything available through one dashboard makes managing my affiliate activity much easier.",
    author: "Michael Torres",
    role: "Content Creator",
    stars: "★★★★★"
  }
];

export default function TestimonialsSection() {
  const { t } = useLanguage();
  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <SectionHeader
          badge={t('publicAffiliate.testimonialsBadge', 'SUCCESS STORIES')}
          title1="What Our"
          title2="Affiliates Say"
          description={t('publicAffiliate.testimonialsSubtitle', 'Hear from partners using the TraderMaster Affiliate Program to share the platform with their audience and manage their referral activity.')}
        />

        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={idx}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div>
                <div className={styles.ratingStars}>{item.stars}</div>
                <p className={styles.quoteText}>"{item.quote}"</p>
              </div>

              <div className={styles.authorInfo}>
                <div className={styles.avatarCircle}>{item.author.charAt(0)}</div>
                <div>
                  <div className={styles.authorName}>{item.author}</div>
                  <div className={styles.authorRole}>{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
