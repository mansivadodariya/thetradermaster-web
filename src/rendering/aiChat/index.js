'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './aiChat.module.scss';
import LineText from '@/components/lineText';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';

export default function AiChat() {
    const router = useRouter();
    const { t } = useLanguage();
    const [prompt, setPrompt] = useState('');

    const handleSend = (textToSend) => {
        const query = typeof textToSend === 'string' ? textToSend : prompt;
        authNavigate(router, `/ai-assistant${query ? `?prompt=${encodeURIComponent(query)}` : ''}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedPrompts = [
        t('aiChat.suggestedQuestion1', 'Analyze EUR/USD key levels for today'),
        t('aiChat.suggestedQuestion2', 'What is the impact of the upcoming NFP release?'),
        t('aiChat.suggestedQuestion3', 'Explain how to calculate position size for 1% risk'),
        t('aiChat.suggestedQuestion4', 'Gold (XAU/USD) technical outlook & order blocks'),
        t('aiChat.suggestedQuestion5', 'Explain Smart Money Concepts (SMC)')
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className={styles.aiChat}>
            <div className='container-xs'>
                <motion.div 
                    className={styles.titleWrapper}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.badgeWrapper}>
                        <LineText text={t('aiChat.lineText', 'Hello, I am AI Chat your creative assistant')} />
                    </div>
                    <div className={styles.title}>
                        <h1>
                            {t('aiChat.titlePart1', 'AI FOREX')}{' '}
                            <span className={styles.neonText}>{t('aiChat.titlePart2', 'ASSISTANT')}</span>
                        </h1>
                        <p>
                            {t('aiChat.subtitle', 'Ask questions about currency pairs, technical setups, economic news, or risk management with institutional accuracy.')}
                        </p>
                    </div>
                </motion.div>

                <div className={styles.chatWrapper}>
                    <motion.div 
                        className={styles.textbox}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className={styles.chatContainer}>
                            <div className={styles.inputWrapper}>
                                <textarea
                                    placeholder={t('aiChat.inputPlaceholder', 'Ask AI about any pair, indicator, economic news, or market setup...')}
                                    className={styles.chatInput}
                                    rows={3}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <div className={styles.bottomRow}>
                                <div className={styles.suggestionsWrapper}>
                                    <div className={styles.suggestionsLabel}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                        <span>{t('aiChat.suggestedPrompts', 'Popular Prompts:')}</span>
                                    </div>
                                    <div className={styles.suggestions}>
                                        {suggestedPrompts.map((item, idx) => (
                                            <button 
                                                key={idx} 
                                                type="button" 
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    className={styles.sendButton} 
                                    type="button" 
                                    aria-label="Send prompt"
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 12H20M20 12L13 5M20 12L13 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Interactive AI Forex Assistant Quick Feature Cards */}
                    <motion.div 
                        className={styles.cardsGrid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div 
                            className={styles.card} 
                            variants={itemVariants} 
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                        <polyline points="17 6 23 6 23 12"></polyline>
                                    </svg>
                                </div>
                                <h3>{t('aiChat.feature1Title', 'Real-Time FX Intelligence')}</h3>
                            </div>
                            <p>{t('aiChat.feature1Desc', 'Ask AI for instant multi-timeframe trend breakdowns, key support/resistance zones, and order block setups across 28+ Forex pairs and Spot Gold.')}</p>
                          
                        </motion.div>

                        <motion.div 
                            className={styles.card} 
                            variants={itemVariants} 
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                                <h3>{t('aiChat.feature2Title', 'Macro News & Calendar')}</h3>
                            </div>
                            <p>{t('aiChat.feature2Desc', 'Get immediate AI interpretations of NFP releases, CPI reports, FOMC rate decisions, and high-impact central bank announcements.')}</p>
                         
                        </motion.div>

                        <motion.div 
                            className={styles.card} 
                            variants={itemVariants} 
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                </div>
                                <h3>{t('aiChat.feature3Title', 'Risk & Position Sizing')}</h3>
                            </div>
                            <p>{t('aiChat.feature3Desc', 'Calculate precise position sizes, stop-loss distance, and risk-to-reward ratios customized to your exact account equity.')}</p>
            
                        </motion.div>
                    </motion.div>

                    {/* NEW SECTION 1: What You Can Ask Trader Master AI */}
                    <motion.div 
                        className={styles.capabilitiesSection}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.sectionHeader}>
                            <h2>
                                {t('aiChat.capabilitiesTitlePart1', 'What You Can Ask')}{' '}
                                <span className={styles.neonText}>{t('aiChat.capabilitiesTitlePart2', 'Trader Master AI')}</span>
                            </h2>
                            <p>{t('aiChat.capabilitiesSubtitle', 'From instant market sentiment to complex macro news breakdowns, your AI assistant provides structured data.')}</p>
                        </div>

                        <div className={styles.capabilitiesGrid}>
                            <div className={styles.capCard}>
                                <div className={styles.capIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                        <polyline points="17 6 23 6 23 12"></polyline>
                                    </svg>
                                </div>
                                <h3>{t('aiChat.cap1Title', 'Real-Time Market Analysis')}</h3>
                                <p>{t('aiChat.cap1Desc', 'Query key support and resistance levels, trend strength, and multi-timeframe candle structures for any asset class.')}</p>
                            </div>

                            <div className={styles.capCard}>
                                <div className={styles.capIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                                <h3>{t('aiChat.cap2Title', 'Economic News & Events')}</h3>
                                <p>{t('aiChat.cap2Desc', 'Get immediate breakdowns of FOMC meetings, CPI releases, NFP reports, and how they impact currency volatility.')}</p>
                            </div>

                            <div className={styles.capCard}>
                                <div className={styles.capIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                </div>
                                <h3>{t('aiChat.cap3Title', 'Risk Management Rules')}</h3>
                                <p>{t('aiChat.cap3Desc', 'Calculate precise position sizing, stop-loss distance, and risk/reward ratios customized to your account equity.')}</p>
                            </div>

                            <div className={styles.capCard}>
                                <div className={styles.capIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                                <h3>{t('aiChat.cap4Title', 'Smart Money Concepts')}</h3>
                                <p>{t('aiChat.cap4Desc', 'Deconstruct Order Blocks, Liquidity Sweeps, Fair Value Gaps (FVG), and institutional market structure.')}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* NEW SECTION 2: Live AI Conversation Showcase */}
                    <motion.div 
                        className={styles.conversationShowcase}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.sectionHeader}>
                            <h2>
                                {t('aiChat.previewTitlePart1', 'Experience Interactive')}{' '}
                                <span className={styles.neonText}>{t('aiChat.previewTitlePart2', 'Conversations')}</span>
                            </h2>
                            <p>{t('aiChat.previewSubtitle', 'Here is how Trader Master AI responds with structured, actionable insights.')}</p>
                        </div>

                        <div className={styles.chatPreviewBox}>
                            <div className={styles.chatMessageUser}>
                                <div className={styles.avatarUser}>Trader</div>
                                <div className={styles.msgBubbleUser}>
                                    <p>Is GBP/JPY a buy at current price on H4 timeframe?</p>
                                </div>
                            </div>

                            <div className={styles.chatMessageAi}>
                                <div className={styles.avatarAi}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#04100B" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/></svg>
                                </div>
                                <div className={styles.msgBubbleAi}>
                                    <div className={styles.aiBadge}>Trader Master AI</div>
                                    <p><strong>Structure:</strong> Bullish on H4 — price holds above the 188.40 swing low with higher highs.</p>
                                    <p><strong>Momentum:</strong> RSI cooling from 72 toward 58 suggests healthy pullback complete.</p>
                                    <p><strong>Plan:</strong> Wait for a rejection wick at 189.20–189.40. Stop below 188.60 (-10 pips), Target: 191.00. <strong>RR = 4.5</strong>.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* NEW SECTION 3: CTA Box */}
                    <motion.div 
                        className={styles.ctaCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.ctaContent}>
                            <h2>{t('aiChat.ctaTitle', 'Ready to Chat with Trader Master AI?')}</h2>
                            <p>{t('aiChat.ctaDesc', 'Join thousands of traders using AI to analyze market setups and improve win rate.')}</p>
                            <Button
                                text={t('aiChat.startAskingNow', 'Start Asking Now')}
                                icon="/assets/icons/arrow.svg"
                                href="/ai-assistant"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}


