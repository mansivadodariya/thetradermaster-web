'use client'
import React from 'react'
import { motion } from 'framer-motion';
import styles from './tradingDesk.module.scss';
import LineText from '@/components/lineText';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';

const MessageIcon = '/assets/icons/message.svg';
const TechnicalIcon = '/assets/icons/Technical.svg';
const StructuredIcon = '/assets/icons/Structured.svg';
const BuiltIcon = '/assets/icons/Built.svg';
const ArrowIcon = '/assets/icons/arrow.svg';
const DeskImage = '/assets/images/desk-main-image.png';

export default function TradingDesk() {
    const router = useRouter();
    const { t } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const boxVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { 
            opacity: 1, 
            x: 0, 
            transition: { duration: 0.5, ease: "easeOut" } 
        },
        hover: {
            x: 10,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    const iconVariants = {
        hover: {
            scale: 1.15,
            rotate: 5,
            transition: { type: "spring", stiffness: 300 }
        }
    };

    return (
        <div className={styles.tradingDesk}>
            <div className='container-xs'>
                <div className={styles.mainContainer}>
                    <div className={styles.grid}>
                        <div className={styles.leftColumn}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <LineText text={t('home.tradingDeskLine', 'Try The Prompt')} start />
                            </motion.div>

                            <div className={styles.contentHeader}>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    {t('home.tradingDeskTitlePart1', 'A Trading Desk That')}{' '}
                                    <span className={styles.neonText}>
                                        {t('home.tradingDeskTitlePart2', 'Talks Back')}
                                    </span>
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    {t('home.tradingDeskSubtitle', 'A glimpse of how a typical Trader Master conversation flows. Specific, structured, and always tied to risk.')}
                                </motion.p>
                            </div>

                            <motion.div 
                                className={styles.featureList}
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <motion.div 
                                    className={styles.featureCard}
                                    variants={boxVariants}
                                    whileHover="hover"
                                >
                                    <div className={styles.iconBox}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div className={styles.featureText}>
                                        <h3>{t('home.deskBox1Title', 'Real time market answers')}</h3>
                                        <p>{t('home.deskBox1Desc', 'Get instant answers about any currency pair, asset, or market condition.')}</p>
                                    </div>
                                    <div className={styles.arrowBox}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    className={styles.featureCard}
                                    variants={boxVariants}
                                    whileHover="hover"
                                >
                                    <div className={styles.iconBox}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                        </svg>
                                    </div>
                                    <div className={styles.featureText}>
                                        <h3>{t('home.deskBox2Title', 'Technical analysis made easy')}</h3>
                                        <p>{t('home.deskBox2Desc', 'Ask for trend, support & resistance, patterns, indicators, and more instantly.')}</p>
                                    </div>
                                    <div className={styles.arrowBox}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    className={styles.featureCard}
                                    variants={boxVariants}
                                    whileHover="hover"
                                >
                                    <div className={styles.iconBox}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="3" y1="9" x2="21" y2="9"></line>
                                            <line x1="9" y1="21" x2="9" y2="9"></line>
                                        </svg>
                                    </div>
                                    <div className={styles.featureText}>
                                        <h3>{t('home.deskBox3Title', 'Structured & reliable insights')}</h3>
                                        <p>{t('home.deskBox3Desc', 'The Trader Master provides clear, well structured analysis backed by data and logic.')}</p>
                                    </div>
                                    <div className={styles.arrowBox}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    className={styles.featureCard}
                                    variants={boxVariants}
                                    whileHover="hover"
                                >
                                    <div className={styles.iconBox}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="8.5" cy="7" r="4"></circle>
                                            <polyline points="17 11 19 13 23 9"></polyline>
                                        </svg>
                                    </div>
                                    <div className={styles.featureText}>
                                        <h3>{t('home.deskBox4Title', 'Built for traders')}</h3>
                                        <p>{t('home.deskBox4Desc', 'Whether you’re a beginner or pro, The Trader Master helps you trade smarter with confidence.')}</p>
                                    </div>
                                    <div className={styles.arrowBox}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* CTA Action Area below Feature Cards */}
                            <motion.div 
                                className={styles.ctaWrapper}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Button 
                                    text={t('home.startAskingNow', 'Start Asking Now')}
                                    icon={ArrowIcon}
                                    onClick={() => authNavigate(router, '/ai-chat')}
                                />
                                <span className={styles.ctaTagline}>
                                    SMART INSIGHTS | LOWER RISK | BETTER TRADES
                                </span>
                            </motion.div>
                        </div>

                        <div className={styles.rightColumn}>
                            <motion.div 
                                className={styles.imageShowcase}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                            >
                                {/* Background Watermark Text */}
                                {/* <div className={styles.watermarkText}>
                                    <span>Trade</span>
                                    <span>Smarter</span>
                                    <span>Everyday</span>
                                </div> */}

                                {/* Floating Badge 1: Top Left */}
                                <motion.div 
                                    className={`${styles.floatingBadge} ${styles.badgeTopLeft}`}
                                    animate={{ y: [-6, 6, -6] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className={styles.badgeIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20V10M18 20V4M6 20v-4" />
                                        </svg>
                                    </div>
                                    <div className={styles.badgeText}>
                                        <span className={styles.badgeTitle}>ANALYZE</span>
                                        <span className={styles.badgeSub}>ANY MARKET</span>
                                    </div>
                                </motion.div>

                                {/* Floating Badge 2: Top Right */}
                                <motion.div 
                                    className={`${styles.floatingBadge} ${styles.badgeTopRight}`}
                                    animate={{ y: [6, -6, 6] }}
                                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className={styles.pointerLineTopRight}></div>
                                    <div className={styles.badgeIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </div>
                                    <div className={styles.badgeText}>
                                        <span className={styles.badgeTitle}>INSTANT</span>
                                        <span className={styles.badgeSub}>INSIGHTS</span>
                                    </div>
                                </motion.div>

                                {/* Floating Badge 3: Bottom Left */}
                                <motion.div 
                                    className={`${styles.floatingBadge} ${styles.badgeBottomLeft}`}
                                    animate={{ y: [-5, 5, -5] }}
                                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className={styles.badgeIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                            <polyline points="17 6 23 6 23 12" />
                                        </svg>
                                    </div>
                                    <div className={styles.badgeText}>
                                        <span className={styles.badgeTitle}>TRADE</span>
                                        <span className={styles.badgeSub}>SMARTER</span>
                                    </div>
                                </motion.div>

                                {/* Floating Badge 4: Bottom Right */}
                                <motion.div 
                                    className={`${styles.floatingBadge} ${styles.badgeBottomRight}`}
                                    animate={{ y: [5, -5, 5] }}
                                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className={styles.pointerLineBottomRight}></div>
                                    <div className={styles.badgeIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            <path d="M9 12l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div className={styles.badgeText}>
                                        <span className={styles.badgeTitle}>RISK</span>
                                        <span className={styles.badgeSub}>AWARE</span>
                                    </div>
                                </motion.div>

                                <img src={DeskImage} alt="Trading Desk Conversation Preview" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
