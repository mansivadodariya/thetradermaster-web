'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../myBots.module.scss';

export default function MyBotsEmptyState({
    hasAiBotPermission,
    hasCustomBotPermission,
    hasLibraryPermission,
    isSingleCard,
    onNavigate
}) {
    const { t } = useLanguage();

    return (
        <div className={styles.emptyStateSection}>
            <div className={styles.emptyStateHeader}>
                <h2 className={styles.emptyTitle}>{t('myBots.emptyTitle', 'Ready to automate? Create your first trading bot.')}</h2>
                <p className={styles.emptySubtitle}>
                    {t('myBots.emptySubtitle', 'Get started in seconds. Choose whether you want to generate a bot automatically using AI or design custom rules step-by-step.')}
                </p>
            </div>

            {/* Creation Cards Grid */}
            <div className={`${styles.twoCardsGrid} ${isSingleCard ? styles.singleCardGrid : ''}`}>
                {/* CARD 1: Generate with AI (AI Bot Builder) */}
                {hasAiBotPermission && (
                    <div
                        className={`${styles.creationHeroCard} ${styles.aiCard}`}
                        onClick={() => {
                            try {
                                if (typeof window !== 'undefined') {
                                    sessionStorage.removeItem('active_selected_strategy');
                                    sessionStorage.setItem('strategy_studio_force_new', 'true');
                                    localStorage.removeItem('bot_builder_session_v1');
                                }
                            } catch (_) {}
                            onNavigate('/ai-bot-builder?new=true');
                        }}
                    >
                        <div className={styles.botGlowOverlay} />

                        {/* 3D Illustration Graphic in Card BG on Right */}
                        <div className={styles.botIllustrationBg}>
                            <img
                                src="/assets/images/botai.png"
                                alt="AI Bot Builder"
                                className={styles.IllustrationImg}
                            />
                        </div>

                        <div className={styles.botHeaderRow}>
                            <div className={styles.botIconBox}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                    <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
                                </svg>
                            </div>
                            <h3 className={styles.botTitle}>{t('myBots.aiCardTitle', 'AI Bot Builder')}</h3>
                        </div>

                        <div className={styles.botBody}>
                            <p className={styles.botDescription}>
                                {t('myBots.aiCardDesc', 'Describe your trading strategy concept or archetype in plain English. TraderMaster AI handles quantitative parameter formulas, indicator conditions, and backtest simulations instantly.')}
                            </p>

                            <div className={styles.featureList}>
                                <div className={styles.botList}><span className={styles.checkIcon}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></span><span>{t('myBots.aiCardFeat1', 'Instant hypothesis to algorithmic rule conversion')}</span></div>
                                <div className={styles.botList}><span className={styles.checkIcon}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></span><span>{t('myBots.aiCardFeat2', 'Multi-market MT5 simulation & metrics backtest')}</span></div>
                                <div className={styles.botList}><span className={styles.checkIcon}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></span><span>{t('myBots.aiCardFeat3', 'Interactive AI Copilot parameter tuning')}</span></div>
                            </div>
                        </div>

                        <div className={styles.botFooter}>
                            <button type="button" className={styles.primaryActionBtn}>
                                <span>{t('myBots.aiCardBtn', 'Launch AI Bot Builder')}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* CARD 2: Custom Bot Builder */}
                {hasCustomBotPermission && (
                    <div
                        className={`${styles.creationHeroCard} ${styles.customCard}`}
                        onClick={() => onNavigate('/manual-bot-builder')}
                    >
                        <div className={styles.botGlowOverlay} />

                        {/* 3D Illustration Graphic in Card BG on Right */}
                        <div className={styles.botIllustrationBg}>
                            <img
                                src="/assets/images/botcutom.png"
                                alt="Custom Bot Builder"
                                className={styles.IllustrationImg}
                            />
                        </div>

                        <div className={styles.botHeaderRow}>
                            <div className={styles.botIconBox}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                                    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                                    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
                                </svg>
                            </div>
                            <h3 className={styles.botTitle}>{t('myBots.customCardTitle', 'Custom Bot Builder')}</h3>
                        </div>

                        <div className={styles.botBody}>
                            <p className={styles.botDescription}>
                                {t('myBots.customCardDesc', 'Assemble technical indicators (RSI, EMA, MACD, Bollinger Bands, Order Blocks), define deterministic entry/exit triggers, position sizing, and risk-reward ratios step-by-step.')}
                            </p>

                            <div className={styles.featureList}>
                                <div className={styles.botList}><span className={styles.checkIcon}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></span><span>{t('myBots.customCardFeat1', '20+ Technical indicator trigger & filter blocks')}</span></div>
                                <div className={styles.botList}><span className={styles.checkIcon}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></span><span>{t('myBots.customCardFeat2', 'Dynamic Take Profit, Stop Loss & Trailing Stops')}</span></div>
                                <div className={styles.botList}><span className={styles.checkIcon}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></span><span>{t('myBots.customCardFeat3', 'Custom execution logic & lot size formulas')}</span></div>
                            </div>
                        </div>

                        <div className={styles.botFooter}>
                            <button type="button" className={styles.primaryActionBtn}>
                                <span>{t('myBots.customCardBtn', 'Open Custom Bot Builder')}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Shortcut to Browse Library */}
            {hasLibraryPermission && (
                <div className={styles.libraryBanner}>
                    <div className={styles.libraryBannerContent}>
                        <div className={styles.bannerIconBox}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                <path d="M14 17.5h7M17.5 14v7" />
                            </svg>
                        </div>
                        <div>
                            <h4>{t('myBots.libraryBannerTitle', 'Want ready-made institutional bots?')}</h4>
                            <p>{t('myBots.libraryBannerDesc', 'Explore verified pre-built algorithmic templates in our community library.')}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.libraryLinkBtn}
                        onClick={() => onNavigate('/bot-library')}
                    >
                        <span>{t('myBots.libraryBannerBtn', 'Browse Bots Library →')}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
