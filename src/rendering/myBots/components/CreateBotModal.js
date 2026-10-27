'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../myBots.module.scss';

export default function CreateBotModal({
    isOpen,
    onClose,
    hasAiBotPermission,
    hasCustomBotPermission,
    isSingleCard,
    onNavigate
}) {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} ${isSingleCard ? styles.singleModalContent : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>{t('myBots.modalTitle', 'Create New Trading Bot')}</h3>
                    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <p className={styles.modalSub}>{t('myBots.modalSub', 'Select your preferred bot creation method:')}</p>
                <div className={`${styles.modalCards} ${isSingleCard ? styles.singleModalCards : ''}`}>
                    {hasAiBotPermission && (
                        <div
                            className={styles.modalCardOption}
                            onClick={() => {
                                try {
                                    if (typeof window !== 'undefined') {
                                        sessionStorage.removeItem('active_selected_strategy');
                                        sessionStorage.setItem('strategy_studio_force_new', 'true');
                                        localStorage.removeItem('bot_builder_session_v1');
                                    }
                                } catch (_) {}
                                if (onClose) onClose();
                                onNavigate('/ai-bot-builder?new=true');
                            }}
                        >
                            <div className={styles.modalCardHeader}>
                                <div className={styles.modalIconBox}>
                                    <img src="/assets/images/botai.png" alt="AI Bot" className={styles.modalIllustrationImg} />
                                </div>
                                <span className={styles.modalBadge}>{t('myBots.aiCopilotBadge', 'AI Copilot')}</span>
                            </div>
                            <h4>{t('myBots.aiCardTitle', 'AI Bot Builder')}</h4>
                            <p>{t('myBots.aiCardDesc', 'Describe your trading strategy concept or archetype in plain English. ChronosX AI handles quantitative parameter formulas, indicator conditions, and backtest simulations instantly.')}</p>
                            <div className={styles.modalCardAction}>
                                <span>{t('myBots.launchAi', 'Launch AI Builder')}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    )}
                    {hasCustomBotPermission && (
                        <div className={styles.modalCardOption} onClick={() => onNavigate('/manual-bot-builder')}>
                            <div className={styles.modalCardHeader}>
                                <div className={styles.modalIconBox}>
                                    <img src="/assets/images/botcutom.png" alt="Custom Bot" className={styles.modalIllustrationImg} />
                                </div>
                                <span className={styles.modalBadge}>{t('myBots.visualStudioBadge', 'Visual Studio')}</span>
                            </div>
                            <h4>{t('myBots.customCardTitle', 'Custom Bot Builder')}</h4>
                            <p>{t('myBots.customCardDesc', 'Assemble technical indicators (RSI, EMA, MACD, Bollinger Bands, Order Blocks), define deterministic entry/exit triggers, position sizing, and risk-reward ratios step-by-step.')}</p>
                            <div className={styles.modalCardAction}>
                                <span>{t('myBots.launchStudio', 'Launch Studio')}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
