'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '../whiteLabel.module.scss';

export default function WhiteLabelHero({ onContactClick }) {
    return (
        <section className={styles.heroSection}>
            <div className={styles.container}>
                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.heroBadge}
                >
                    <span className={styles.pulseIndicator} />
                    <span>White Label Solutions</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className={styles.heroTitle}
                >
                    Your Brand. Our <span className={styles.gradientText}>AI Trading Intelligence.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className={styles.heroSubtitle}
                >
                    Launch a powerful AI-driven trading platform under your own brand. Give your clients access to advanced market intelligence, AI-powered chart analysis, quantitative trading tools, and performance analytics — all through a platform designed around your business.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.25 }}
                    className={styles.heroFoundationNote}
                >
                    With TraderMaster White Label, you get the technology foundation to build a modern trading experience without starting your AI infrastructure from scratch.
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.3 }}
                    className={styles.heroCtaGroup}
                >
                    <button
                        type="button"
                        onClick={onContactClick}
                        className={styles.primaryCtaBtn}
                    >
                        <span>Build Your White-Label Platform</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={onContactClick}
                        className={styles.secondaryCtaBtn}
                    >
                        <span>Talk to Our Team</span>
                    </button>
                </motion.div>

                <div className={styles.heroPoweredTag}>
                    <span>Powered by</span> TraderMaster AI Infrastructure
                </div>

                {/* 3D Dashboard Showcase Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className={styles.heroVisualContainer}
                >
                    <div className={styles.heroVisualInner}>
                        <Image
                            src="/assets/images/hero-whitelabel.png"
                            alt="TraderMaster White Label Trading Platform Dashboard Mockup"
                            width={1200}
                            height={675}
                            priority
                            quality={95}
                        />

                        {/* Floating telemetry pills */}
                        
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
