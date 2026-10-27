'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { QUICK_PROMPTS } from '../constants/aiChatData';
import styles from '../aiChat.module.scss';

export default function PromptStartersSection({ selectedPrompt, onSelectPrompt }) {
    const { t } = useLanguage();

    return (
        <section className={styles.quickPromptsSection}>
            <div className="container">
                <SectionHeader
                    badge={t('aiChat.promptsBadge', 'INSTANT CLICKABLE PROMPTS')}
                    title1={t('aiChat.promptsTitle1', 'PRE-BUILT QUICK')}
                    title2={t('aiChat.promptsTitle2', 'PROMPT STARTERS')}
                    description={t('aiChat.promptsSubtitle', 'Click any institutional prompt idea below to test live in our interactive AI Copilot engine:')}
                    align="center"
                />

                <div className={styles.promptsGrid}>
                    {QUICK_PROMPTS.map((item, index) => {
                        const isSelected = selectedPrompt.id === item.id;
                        return (
                            <motion.div
                                key={item.id}
                                className={`${styles.promptCard} ${isSelected ? styles.promptCardActive : ''}`}
                                onClick={() => onSelectPrompt(item)}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            >
                                <div className={styles.promptCardTop}>
                                    <div className={styles.promptIconBox}>
                                        {item.icon}
                                    </div>
                                    <span className={styles.promptBadge}>{item.badge}</span>
                                </div>

                                <h3 className={styles.promptCategory}>{item.category}</h3>
                                <p className={styles.promptText}>&ldquo;{item.presetText}&rdquo;</p>

                                <div className={styles.promptCardFooter}>
                                    <span className={styles.actionPromptText}>
                                        {isSelected ? 'Currently Loaded in Demo' : 'Click to Load in AI Demo'}
                                    </span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
