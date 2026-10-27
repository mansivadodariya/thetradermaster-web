'use client';

import React from 'react';
import styles from '../styles/strategyStudio.module.scss';
import QuoteTicker from './QuoteTicker';
import {
    ArrowUpIcon,
    ArrowUpRightIcon,
    CloseXIcon,
    SparklesMiniIcon
} from './StudioIcons';

export default function AiExploreView({
    greetingWord,
    userName,
    homeQuery,
    setHomeQuery,
    selectedCategory,
    setSelectedCategory,
    categoryData,
    symbol,
    onSendMessage
}) {
    return (
        <div className={styles.tradezeeHomeWrapper}>
            {/* Center Hero: Rotating Quotes Ticker + Greeting + Floating Input Card + Interactive Category Dropdown / Pills */}
            <div className={styles.centerHeroArea}>
                {/* 5 Rotating Trading Quotes Banner */}
                <QuoteTicker />

                <h1 className={styles.greetingTitle}>
                    <span>{greetingWord}</span>
                    {userName && userName.toLowerCase() !== 'trader' && (
                        <>
                            <span>•</span>
                            <span className={styles.greetingNameMuted}>{userName || 'Trader'}</span>
                        </>
                    )}
                </h1>

                {/* Floating Dark Glass Input Card */}
                <div className={styles.floatingInputCard}>
                    <textarea
                        className={styles.inputPromptTextarea}
                        placeholder="What would you like to explore?"
                        value={homeQuery}
                        maxLength={500}
                        onChange={(e) => setHomeQuery(e.target.value.slice(0, 500))}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSendMessage();
                            }
                        }}
                        rows={2}
                    />
                    <div className={styles.cardBottomActions}>
                        <button
                            type="button"
                            className={`${styles.circleSendButton} ${homeQuery.trim() ? styles.hasValue : ''}`}
                            onClick={() => onSendMessage()}
                            title="Send Message"
                        >
                            <ArrowUpIcon size={16} />
                        </button>
                    </div>
                </div>

                {/* Category Dropdown List Card */}
                {selectedCategory && categoryData[selectedCategory] && (
                    <div className={styles.categoryDropdownCard}>
                        <div className={styles.categoryDropdownHeader}>
                            <div className={styles.categoryDropdownHeaderLeft}>
                                {categoryData[selectedCategory].icon}
                                <span>{categoryData[selectedCategory].title}</span>
                            </div>
                            <button
                                type="button"
                                className={styles.categoryDropdownCloseBtn}
                                onClick={() => setSelectedCategory(null)}
                                title="Close"
                            >
                                <CloseXIcon size={14} />
                            </button>
                        </div>
                        {categoryData[selectedCategory].options.map((opt, i) => (
                            <div
                                key={i}
                                className={styles.categoryDropdownItem}
                                onClick={() => onSendMessage(opt)}
                            >
                                <span className={styles.itemSparkleIcon}>
                                    <SparklesMiniIcon size={14} />
                                </span>
                                <span>{opt}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Category Mode Pills */}
                <div className={styles.quickPillsRow}>
                    <button
                        type="button"
                        className={`${styles.quickPill} ${selectedCategory === 'analyse' ? styles.selected : ''}`}
                        onClick={() => setSelectedCategory(prev => prev === 'analyse' ? null : 'analyse')}
                    >
                        Analyse
                    </button>
                    <button
                        type="button"
                        className={`${styles.quickPill} ${selectedCategory === 'strategy' ? styles.selected : ''}`}
                        onClick={() => setSelectedCategory(prev => prev === 'strategy' ? null : 'strategy')}
                    >
                        Strategy
                    </button>
                    <button
                        type="button"
                        className={`${styles.quickPill} ${selectedCategory === 'auditor' ? styles.selected : ''}`}
                        onClick={() => setSelectedCategory(prev => prev === 'auditor' ? null : 'auditor')}
                    >
                        Account Auditor
                    </button>
                </div>
            </div>

            {/* Bottom 2 Feature Cards */}
            <div className={styles.bottomFeatureCardsGrid}>
                <div
                    className={styles.featureCard}
                    onClick={() => onSendMessage(`Configure automated trade execution and scheduled quantitative analysis for ${symbol}`)}
                >
                    <div className={styles.cardTagHeader}>
                        <span>AUTO-ANALYSIS & TRADE</span>
                        <ArrowUpRightIcon size={14} color="#64748B" />
                    </div>
                    <h3 className={styles.cardHeading}>Run scheduled analyses, auto-place trades</h3>
                    <p className={styles.cardParagraph}>
                        Pick an agent, set a cycle, and we'll fire a trade on your broker the moment the analyzer's confidence clears your threshold.
                    </p>
                </div>

                <div
                    className={styles.featureCard}
                    onClick={() => onSendMessage(`Subscribe to curated periodic trading signals, trend indicators and trade ideas`)}
                >
                    <div className={styles.cardTagHeader}>
                        <span>TRADE IDEAS</span>
                        <ArrowUpRightIcon size={14} color="#64748B" />
                    </div>
                    <h3 className={styles.cardHeading}>Subscribe to curated periodic ideas</h3>
                    <p className={styles.cardParagraph}>
                        Browse live signals from our analyzers and one-click follow the configs whose track record fits how you trade.
                    </p>
                </div>
            </div>
        </div>
    );
}
