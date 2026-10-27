'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { QUICK_PROMPTS } from '../constants/aiChatData';
import { authNavigate } from '@/lib/authRedirect';
import styles from '../aiChat.module.scss';

export default function LiveChatDemoSection({
    demoSectionRef,
    activePromptId,
    onSelectPrompt,
    isGenerating,
    onCopySetup,
    customInput,
    setCustomInput,
    onCustomSubmit
}) {
    const router = useRouter();
    const { t } = useLanguage();
    const selectedPrompt = QUICK_PROMPTS.find(p => p.id === activePromptId) || QUICK_PROMPTS[0];

    return (
        <section ref={demoSectionRef} className={`${styles.demoSection} ${styles.liveDemoSection}`}>
            <div className="container">
                <SectionHeader
                    badge={t('aiChat.demoBadge', 'LIVE INTERACTIVE SIMULATION')}
                    title1={t('aiChat.demoTitle1', 'EXPERIENCE THE')}
                    title2={t('aiChat.demoTitle2', 'INTELLIGENT TRADING COPILOT')}
                    description={t('aiChat.demoSubtitle', 'Select institutional prompt presets below to observe real-time MT5 tick analysis and execution calculations.')}
                    align="center"
                />

                {/* 3. PROMPT PRESET SELECTOR BUTTONS */}
                <div className={styles.presetButtonsRow}>
                    {QUICK_PROMPTS.map((prompt) => {
                        const isActive = activePromptId === prompt.id;
                        return (
                            <button
                                key={prompt.id}
                                type="button"
                                onClick={() => onSelectPrompt(prompt.id)}
                                className={`${styles.presetBtn} ${isActive ? styles.presetActive : ''}`}
                            >
                                <span className={styles.presetIcon}>{prompt.icon}</span>
                                <div className={styles.presetMeta}>
                                    <span className={styles.presetLabel}>{prompt.label || prompt.category}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* 4. LIVE INTERACTIVE CHAT TERMINAL / WORKSPACE */}
                <div className={`${styles.chatTerminalCard} ${styles.terminalCockpit}`}>
                    {/* Terminal Top Window Bar */}
                    <div className={`${styles.terminalWindowBar} ${styles.terminalHeader}`}>
                        <div className={`${styles.windowControls} ${styles.terminalControls}`}>
                            <span className={`${styles.dot} ${styles.dotRed} ${styles.controlDotRed}`} />
                            <span className={`${styles.dot} ${styles.dotYellow} ${styles.controlDotYellow}`} />
                            <span className={`${styles.dot} ${styles.dotGreen} ${styles.controlDotGreen}`} />
                        </div>
                        <div className={`${styles.terminalTitle} ${styles.terminalBrand}`}>
                            <span className={styles.terminalLiveDot} />
                            <span>CHRONOSX QUANT DESK // MT5 LIVE STREAM ({selectedPrompt.demoData.pair})</span>
                        </div>
                        <div className={`${styles.terminalStatus} ${styles.terminalLiveIndicator}`}>STATUS: READY</div>
                    </div>

                    {/* Terminal Message Stream Body */}
                    <div className={`${styles.terminalMessageStream} ${styles.chatStreamArea}`}>
                        {/* 1. Trader User Message */}
                        <div className={`${styles.userMessageRow} ${styles.traderMessageRow}`}>
                            <div className={styles.traderAvatar}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div className={styles.traderBubble}>
                                <div className={styles.bubbleSender}>{t('aiChat.demo.trader', 'Trader')}</div>
                                <p className={styles.bubbleText}>
                                    &ldquo;{selectedPrompt.demoData.userPrompt}&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* 2. AI Assistant Structured Institutional Setup */}
                        <div className={styles.aiMessageRow}>
                            <div className={styles.aiAvatar}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="10" rx="2" />
                                    <circle cx="12" cy="5" r="2" />
                                    <path d="M12 7v4" />
                                    <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
                                    <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
                                </svg>
                            </div>
                            <div className={styles.aiResponseCard}>
                                <div className={styles.aiCardHeader}>
                                    <div className={styles.aiSenderInfo}>
                                        <span className={styles.aiName}>{t('aiChat.demo.aiAssistant', 'AI Assistant')}</span>
                                        <span className={styles.aiTag}>{t('aiChat.demo.quantCopilot', 'QUANT COPILOT')}</span>
                                        <span className={styles.aiPairBadge}>{selectedPrompt.demoData.pair}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onCopySetup}
                                        className={styles.copyBtn}
                                        title={t('aiChat.demo.copySetupAria', 'Copy Trade Setup to Clipboard')}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                        <span>{t('aiChat.demo.copySetup', 'Copy Setup')}</span>
                                    </button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div
                                            key="loader"
                                            className={styles.aiGeneratingBox}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className={styles.typingIndicator}>
                                                <span />
                                                <span />
                                                <span />
                                            </div>
                                            <p>{t('aiChat.demo.analyzingTicks', 'Analyzing live MT5 tick streams & computing optimal parameters...')}</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="content"
                                            className={styles.aiSetupContent}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Main Setup Title */}
                                            <div className={styles.setupTitleRow}>
                                                <div className={styles.setupTitleIconBox}>
                                                    {selectedPrompt.icon}
                                                </div>
                                                <h4 className={styles.setupTitle}>
                                                    {selectedPrompt.demoData.title}
                                                </h4>
                                            </div>

                                            {/* Core Market Telemetry Grid */}
                                            <div className={styles.telemetryGrid}>
                                                <div className={styles.telemetryItem}>
                                                    <span className={styles.telLabel}>{t('aiChat.demo.currentLivePrice', 'Current Live Price')}</span>
                                                    <span className={styles.telPrice}>{selectedPrompt.demoData.price}</span>
                                                </div>

                                                <div className={styles.telemetryItem}>
                                                    <span className={styles.telLabel}>{t('aiChat.demo.trendDirection', 'Trend Direction')}</span>
                                                    <span className={selectedPrompt.demoData.trendType === 'bullish' ? styles.telBullish : styles.telNeutral}>
                                                        ● {selectedPrompt.demoData.trend}
                                                    </span>
                                                </div>

                                                <div className={styles.telemetryItem}>
                                                    <span className={styles.telLabel}>{t('aiChat.demo.resistanceLevels', 'Resistance Levels')}</span>
                                                    <span className={styles.telVal}>{selectedPrompt.demoData.resistance}</span>
                                                </div>

                                                <div className={styles.telemetryItem}>
                                                    <span className={styles.telLabel}>{t('aiChat.demo.supportLevels', 'Support Levels')}</span>
                                                    <span className={styles.telVal}>{selectedPrompt.demoData.support}</span>
                                                </div>
                                            </div>

                                            {/* Execution & Risk-to-Reward Plan Card */}
                                            <div className={styles.tradePlanBox}>
                                                <div className={styles.planHeader}>
                                                    <div className={styles.targetIconBox}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <circle cx="12" cy="6" r="2" />
                                                        </svg>
                                                    </div>
                                                    <h5>{t('aiChat.demo.setupPlan', 'TRADE SETUP PLAN:')}</h5>
                                                </div>

                                                <div className={styles.planItemsGrid}>
                                                    <div className={styles.planRow}>
                                                        <span className={styles.planKey}>{t('aiChat.demo.entryZone', 'Entry Zone:')}</span>
                                                        <span className={styles.planValHighlight}>{selectedPrompt.demoData.setup.entryZone}</span>
                                                    </div>

                                                    <div className={styles.planRow}>
                                                        <span className={styles.planKey}>{t('aiChat.demo.stopLoss', 'Stop Loss:')}</span>
                                                        <span className={styles.planValSl}>{selectedPrompt.demoData.setup.stopLoss}</span>
                                                    </div>

                                                    <div className={styles.planRow}>
                                                        <span className={styles.planKey}>{t('aiChat.demo.tp1', 'Take Profit 1:')}</span>
                                                        <span className={styles.planValTp}>{selectedPrompt.demoData.setup.takeProfit1}</span>
                                                    </div>

                                                    <div className={styles.planRow}>
                                                        <span className={styles.planKey}>{t('aiChat.demo.tp2', 'Take Profit 2:')}</span>
                                                        <span className={styles.planValTp}>{selectedPrompt.demoData.setup.takeProfit2}</span>
                                                    </div>

                                                    <div className={styles.planRow}>
                                                        <span className={styles.planKey}>{t('aiChat.demo.rrr', 'Risk-Reward Ratio:')}</span>
                                                        <span className={styles.planValRrr}>{selectedPrompt.demoData.setup.rrr}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Optional Indicator or Risk Calc Breakdown */}
                                            {selectedPrompt.demoData.calcMetrics && (
                                                <div className={styles.calcBreakdownBox}>
                                                    <div className={styles.calcHeader}>
                                                        <div className={styles.calcIconBox}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                                <polyline points="9 12 11 14 15 10" />
                                                            </svg>
                                                        </div>
                                                        <h5>{t('aiChat.demo.positionSizingAudit', 'POSITION SIZING & MATHEMATICAL AUDIT')}</h5>
                                                    </div>
                                                    <div className={styles.calcGrid}>
                                                        <div className={styles.calcItem}>
                                                            <span>{t('aiChat.demo.balance', 'Balance:')}</span>
                                                            <strong>{selectedPrompt.demoData.calcMetrics.accountBalance}</strong>
                                                        </div>
                                                        <div className={styles.calcItem}>
                                                            <span>{t('aiChat.demo.riskAllocation', 'Risk Allocation:')}</span>
                                                            <strong>{selectedPrompt.demoData.calcMetrics.riskPercent} ({selectedPrompt.demoData.calcMetrics.dollarRisk})</strong>
                                                        </div>
                                                        <div className={styles.calcItem}>
                                                            <span>{t('aiChat.demo.stopLoss', 'Stop Loss:')}</span>
                                                            <strong>{selectedPrompt.demoData.calcMetrics.stopLossPips}</strong>
                                                        </div>
                                                        <div className={styles.calcItem}>
                                                            <span>{t('aiChat.demo.exactLotSize', 'Exact Lot Size:')}</span>
                                                            <strong className={styles.lotHighlight}>{selectedPrompt.demoData.calcMetrics.recommendedLots}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedPrompt.demoData.indicators && (
                                                <div className={styles.indicatorsRow}>
                                                    {selectedPrompt.demoData.indicators.map((ind, i) => (
                                                        <div key={i} className={styles.indPill}>
                                                            <span className={styles.indName}>{ind.name}:</span>
                                                            <span className={styles.indStatus}>{ind.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Critical Economic Notice */}
                                            <div className={styles.alertNoteBox}>
                                                <div className={styles.alertIconBox}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                        <line x1="12" y1="9" x2="12" y2="13" />
                                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                                    </svg>
                                                </div>
                                                <p>
                                                    <strong>{t('aiChat.demo.note', 'Note:')}</strong> {selectedPrompt.demoData.note}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Input Command Bar */}
                    <div className={styles.terminalInputBar}>
                        <form onSubmit={onCustomSubmit} className={styles.inputForm}>
                            <div className={styles.inputPrefix}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder={t('aiChat.demo.inputPlaceholder', 'Type your trading question or pair analysis request here...')}
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                className={styles.chatInputField}
                            />
                            <button
                                type="button"
                                onClick={() => authNavigate(router, '/market-assistant')}
                                className={styles.launchFullDeskBtn}
                            >
                                <span>{t('aiChat.demo.openInDesk', 'Open in Live AI Desk')}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
