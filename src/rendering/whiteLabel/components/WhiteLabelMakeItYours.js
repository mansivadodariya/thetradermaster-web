'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../whiteLabel.module.scss';

const CUSTOMIZATION_POINTS = [
    {
        title: 'Your Logo & Visual Identity',
        desc: 'Place your brand identity at the absolute center of the user experience. Adapt the interface around your brand colors, typography, and dark/light design systems.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
        )
    },
    {
        title: 'Custom Domain & Ecosystem',
        desc: 'Seamlessly host on your own domain (e.g. app.yourbrand.com) and position the platform as part of your existing website, application, and customer journey.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        )
    },
    {
        title: 'Flexible Feature Configuration',
        desc: 'Structure platform modules around your business model. Enable or disable AI Chart Vision, Market Copilot, Past Trade Audit, or Backtesting as desired.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        )
    },
    {
        title: 'Direct Customer Relationships',
        desc: 'Retain 100% ownership of your customer data, signups, user credentials, and engagement metrics within your private enterprise database.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        )
    }
];

export default function WhiteLabelMakeItYours() {
    const { t } = useLanguage();
    return (
        <section className={styles.customizationSection}>
            <div className={styles.container}>
                {/* Centered Section Header */}
                <SectionHeader
                    badge={t('whiteLabel.makeItYoursBadge', 'Your Brand, Your Platform')}
                    title="Make the Experience Yours."
                    description={t('whiteLabel.makeItYoursSubtitle', "Your users shouldn't feel like they're using someone else's product. The experience should belong completely to your brand.")}
                    align="center"
                    className={styles.makeItYoursHeader}
                />

                <div className={styles.customizationSplitGrid}>
                    {/* Left Points */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                        className={styles.customizationTextCol}
                    >
                        <div className={styles.customizationPointsList}>
                            {CUSTOMIZATION_POINTS.map((point) => (
                                <div key={point.title} className={styles.customizationPointItem}>
                                    <div className={styles.pointIconWrap}>
                                        {point.icon}
                                    </div>
                                    <div className={styles.pointContent}>
                                        <h4>{point.title}</h4>
                                        <p>{point.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Brand Customization Visual Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className={styles.customizationVisualCol}
                    >
                        <div className={styles.customizationMockupWrap}>
                            <Image
                                src="/assets/images/customization-suite.png"
                                alt={t('whiteLabel.mockupAlt', 'ChronosX Brand Customization Suite Mockup')}
                                width={800}
                                height={600}
                                priority
                                className={styles.customizationMockupImg}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
