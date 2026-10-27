'use client';

import React from 'react';
import { BrainIcon } from '@/icons/visionIcons';
import styles from '../aiAssistant.module.scss';

export default function WelcomeActionView({
    t,
    handleDeepAnalysisClick,
    handleGenerateFromImageClick,
    handleMacroNewsClick
}) {
    return (
        <div className={styles.welcomeContainer}>
            <h2 className={styles.welcomeTitle}>
                What do you want <br />to <span className={styles.titleGradient}>analyze?</span>
            </h2>
            <p className={styles.welcomeSubtitle}>Select an analysis mode or ask any market question to start</p>
            <div className={styles.welcomeActionCards}>
                <button
                    type="button"
                    className={`${styles.welcomeActionCard} ${styles.deepCard}`}
                    onClick={handleDeepAnalysisClick}
                >
                    <div className={styles.cardIconWrapper}>
                        <BrainIcon size={22} />
                    </div>
                    <div className={styles.cardTextContent}>
                        <span className={styles.cardMainTitle}>{t('aiAssistant.deepMarketAnalysis', 'Deep Market Analysis')}</span>
                        <span className={styles.cardSubTitle}>Technical signals, key levels &amp; trend breakdown</span>
                    </div>
                    <div className={styles.cardArrow}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </div>
                </button>
                <button
                    type="button"
                    className={`${styles.welcomeActionCard} ${styles.imageCard}`}
                    onClick={handleGenerateFromImageClick}
                >
                    <div className={styles.cardIconWrapper}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </div>
                    <div className={styles.cardTextContent}>
                        <span className={styles.cardMainTitle}>{t('aiAssistant.generateFromImage', 'Generate From Image')}</span>
                        <span className={styles.cardSubTitle}>Upload chart photo or snapshot for AI diagnosis</span>
                    </div>
                    <div className={styles.cardArrow}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </div>
                </button>
                <button
                    type="button"
                    className={`${styles.welcomeActionCard} ${styles.newsCard}`}
                    onClick={handleMacroNewsClick}
                >
                    <div className={styles.cardIconWrapper}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                            <path d="M18 14h-8" />
                            <path d="M15 18h-5" />
                            <path d="M10 6h8v4h-8z" />
                        </svg>
                    </div>
                    <div className={styles.cardTextContent}>
                        <span className={styles.cardMainTitle}>{t('aiAssistant.macroNews', 'Macro News & Economic Events')}</span>
                        <span className={styles.cardSubTitle}>High-impact calendar catalysts &amp; market sentiment</span>
                    </div>
                    <div className={styles.cardArrow}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
}
