'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import { useStreamingText } from '../utils/streamingRenderer';
import { sanitizeRawJsonText } from '../utils/chatTextFormatter';
import { renderFormattedMarkdown } from '../utils/markdownRenderer';
import { getStoredUser, getStoredUserId, hydrateUserFromProfile } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';
import InteractiveQuestionWizard from './InteractiveQuestionWizard';
import ReadyToProceedCard from './ReadyToProceedCard';
import StudioComposerCard from './StudioComposerCard';
import { getDynamicStepInfo, DYNAMIC_LOADING_STAGES } from '../utils/chatUiHelpers';
import {
    BotBrainIcon,
    LightningIcon,
    RocketRunIcon,
    ShieldCheckIcon,
    SendPaperAirplaneIcon,
    SlidersTuneIcon,
    LockOutlineIcon,
    ArrowUpIcon,
    CloseXIcon,
    CpuChipIcon,
    SparklesMiniIcon,
    AreaChartIcon,
    HomeBreadcrumbIcon,
    ChevronRightMiniIcon,
    InfoCircleIcon,
    RightArrowSelectedIcon,
    PlusIcon,
    ClockIntervalIcon,
    TacticalRouteIcon
} from './StudioIcons';
import { fetchIndicatorsFromSupabase, getStrategyExploreSuggestions } from '@/lib/indicatorsData';

const EXPLORE_TAGLINES = [
    'Start with a message, TraderMaster takes it from there',
    'Trade with data. Execute with discipline.',
    'Build smarter strategies. Trade with confidence.',
    'Every great trade starts with a clear plan.',
    'Turn your strategy into an intelligent trading bot.',
    'Analyze. Automate. Adapt. Repeat.'
];



function DynamicChatLoader() {
    const [stageIdx, setStageIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStageIdx((prev) => (prev + 1) % DYNAMIC_LOADING_STAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.dynamicChatLoader}>
            <div className={styles.loaderPulseWrap}>
                <span className={styles.loaderDot} />
                <span className={styles.loaderDot} />
                <span className={styles.loaderDot} />
            </div>
            <span key={stageIdx} className={styles.loaderText}>
                {DYNAMIC_LOADING_STAGES[stageIdx]}
            </span>
        </div>
    );
}

/**
 * StreamingAiBubble — Renders an AI message with fluid character typewriter effect
 */
function StreamingAiBubble({ text, shouldStream, onStreamComplete, onStreamProgress }) {
    const cleanText = useMemo(() => sanitizeRawJsonText(text), [text]);

    const { displayedText, isStreaming, skipToEnd } = useStreamingText(cleanText, {
        msPerChar: 14,
        enabled: Boolean(shouldStream),
        onComplete: onStreamComplete,
        onProgress: onStreamProgress
    });

    const activeText = shouldStream ? displayedText : cleanText;
    const showCursor = Boolean(shouldStream && isStreaming);

    return (
        <div
            className={`${styles.bubble} ${styles.aiBubble}`}
            onClick={showCursor ? skipToEnd : undefined}
            style={{ cursor: showCursor ? 'pointer' : 'default' }}
            title={showCursor ? 'Click to reveal immediately' : undefined}
        >
            {renderFormattedMarkdown(activeText)}
            {showCursor && <span className={styles.streamingCursorChar}>▌</span>}
        </div>
    );
}

export default function AdvisorChatView({
    messages,
    input,
    setInput,
    onSend,
    onNewChat,
    onOpenHistory,
    historyCount = 0,
    loading,
    currentDraft,
    onGenerateFromDraft,
    generatingStrategy,
    onChipClick,
    onRunBacktestFromCard,
    marketMode = 'Forex',
    setMarketMode,
    currentStep = 2,
    totalSteps = 4
}) {
    const chatScrollContainerRef = useRef(null);
    const completedStreamsRef = useRef(new Set());
    const [, forceUpdate] = useState(0);
    const { t } = useLanguage();

    // Explore / Strategy popup states
    const [isStrategyMenuOpen, setIsStrategyMenuOpen] = useState(false);
    const [isOptionBoxDismissed, setIsOptionBoxDismissed] = useState(false);
    const [user, setUser] = useState(null);

    const [dynamicOptions, setDynamicOptions] = useState(() => getStrategyExploreSuggestions());

    useEffect(() => {
        let isMounted = true;
        fetchIndicatorsFromSupabase().then((indicators) => {
            if (isMounted && indicators) {
                setDynamicOptions(getStrategyExploreSuggestions(indicators));
            }
        }).catch(() => {});
        return () => { isMounted = false; };
    }, []);

    // As-you-type suggestion dropdown
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const typedSuggestions = useMemo(() => {
        const trimmed = input.trim().toLowerCase();
        if (!trimmed) return [];
        return dynamicOptions.filter((opt) => {
            const optLower = opt.toLowerCase();
            return optLower.includes(trimmed) && optLower !== trimmed;
        }).slice(0, 5);
    }, [input, dynamicOptions]);
    const showTypedSuggestions = typedSuggestions.length > 0;

    useEffect(() => {
        if (messages.length === 0) {
            completedStreamsRef.current.clear();
            setIsOptionBoxDismissed(false);
            setIsStrategyMenuOpen(false);
        } else {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg?.role === 'ai') {
                setIsOptionBoxDismissed(false);
            }
            messages.forEach((msg, idx) => {
                if (msg.fromHistory) {
                    completedStreamsRef.current.add(`msg_${idx}_${(msg.text || '').slice(0, 15)}`);
                }
            });
        }
    }, [messages]);

    useEffect(() => {
        async function loadUser() {
            const stored = getStoredUser();
            if (stored) setUser(stored);

            const uid = getStoredUserId();
            if (uid && (!stored?.first_name && !stored?.last_name && !stored?.name)) {
                const hydrated = await hydrateUserFromProfile(uid, stored);
                if (hydrated) setUser(hydrated);
            }
        }
        loadUser();

        window.addEventListener('user:updated', loadUser);
        return () => window.removeEventListener('user:updated', loadUser);
    }, []);

    // Retrieve user's display name
    const userName = useMemo(() => {
        const firstName = user?.first_name || '';
        const lastName = user?.last_name || '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        return fullName || user?.name || user?.full_name || user?.email?.split('@')[0] || 'Trader';
    }, [user]);

    // Dynamic greeting based on current time of day
    const dynamicGreeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return t('strategyStudio.greetingMorning', 'Good morning, trader');
        }
        if (hour >= 12 && hour < 17) {
            return t('strategyStudio.greetingAfternoon', 'Good afternoon, trader');
        }
        return t('strategyStudio.greetingEvening', 'Good evening, trader');
    }, [t]);

    const scrollToBottom = useCallback((smooth = true) => {
        if (chatScrollContainerRef.current) {
            if (smooth) {
                chatScrollContainerRef.current.scrollTo({
                    top: chatScrollContainerRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            } else {
                chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
            }
        }
    }, []);

    const handleStreamProgress = useCallback(() => {
        if (chatScrollContainerRef.current) {
            chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
        }
    }, []);

    const isSendingRef = useRef(false);

    useEffect(() => {
        scrollToBottom(true);
    }, [messages, loading, scrollToBottom]);

    const handleSend = useCallback((textToSend, extraData) => {
        if (isSendingRef.current || loading) return;
        isSendingRef.current = true;
        setIsOptionBoxDismissed(true);
        onSend(textToSend, extraData);
        setTimeout(() => {
            isSendingRef.current = false;
        }, 500);
    }, [onSend, loading]);

    const handleKeyDown = (e) => {
        if (showTypedSuggestions) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestionIndex((prev) => (prev + 1) % typedSuggestions.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestionIndex((prev) => (prev - 1 + typedSuggestions.length) % typedSuggestions.length);
                return;
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                const chosen = typedSuggestions[activeSuggestionIndex] || typedSuggestions[0];
                if (chosen) {
                    setInput(chosen);
                    setActiveSuggestionIndex(0);
                }
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                setActiveSuggestionIndex(0);
                return;
            }
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            if (input.trim() && !loading && !isSendingRef.current) {
                handleSend(input);
            }
        }
    };

    const isInitialStartingView = messages.length === 0;
    const isLatestAiMessage = messages.length > 0 && messages[messages.length - 1]?.role === 'ai';
    const latestAiMsgIndex = isLatestAiMessage ? messages.length - 1 : -1;
    const latestAiMessage = isLatestAiMessage ? messages[latestAiMsgIndex] : null;

    const latestAiMsgKey = latestAiMsgIndex >= 0
        ? `msg_${latestAiMsgIndex}_${(messages[latestAiMsgIndex].text || '').slice(0, 15)}`
        : null;

    const isLatestAiStreamCompleted = Boolean(
        latestAiMsgKey && (completedStreamsRef.current.has(latestAiMsgKey) || latestAiMessage?.fromHistory)
    );

    // Rotating Taglines at top of explore screen
    const [taglineIndex, setTaglineIndex] = useState(0);
    const [taglineFading, setTaglineFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTaglineFading(true);
            setTimeout(() => {
                setTaglineIndex((prev) => (prev + 1) % EXPLORE_TAGLINES.length);
                setTaglineFading(false);
            }, 300);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Render User Message: Format as clean answer bubble or standard markdown
    const renderUserBubbleContent = (msg) => {
        if (msg.qaList && Array.isArray(msg.qaList) && msg.qaList.length > 0) {
            return (
                <div className={styles.qaListBlock}>
                    {msg.qaList.map((item, idx) => (
                        <div key={idx} className={styles.qaPairItem}>
                            <div className={styles.qaAnswerValue}>{item.answer || item.label}</div>
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof msg.text === 'string' && msg.text.includes('\n') && msg.text.includes('?')) {
            const blocks = msg.text.split(/\n\s*\n/);
            const hasStructuredQa = blocks.some((b) => b.includes('?') && b.includes('\n'));
            if (hasStructuredQa) {
                return (
                    <div className={styles.qaListBlock}>
                        {blocks.map((block, bIdx) => {
                            const lines = block.trim().split('\n');
                            if (lines.length >= 2) {
                                const answerLine = lines.slice(1).join(' ').trim();
                                return (
                                    <div key={bIdx} className={styles.qaPairItem}>
                                        <div className={styles.qaAnswerValue}>{answerLine}</div>
                                    </div>
                                );
                            }
                            return <div key={bIdx}>{block}</div>;
                        })}
                    </div>
                );
            }
        }

        return renderFormattedMarkdown(msg.text);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
            {/* ── TOP RIGHT HEADER ACTIONS (History) ── */}
            <div className={styles.advisorChatTopHeader}>
                <div className={styles.advisorChatTopRight}>
                    {onOpenHistory && (
                        <button
                            type="button"
                            className={styles.btnHistory}
                            onClick={onOpenHistory}
                            title="View chat history"
                        >
                            <ClockIntervalIcon size={15} color="#18C98B" />
                            <span>{t('strategyStudio.history', 'History')}</span>
                        </button>
                    )}
                </div>
            </div>

            {isInitialStartingView ? (
                /* ── INITIAL EXPLORE HOME SCREEN (IMAGE 1 & 2) ── */
                <div className={styles.studioHomeWrapper}>
                    <div className={styles.exploreHeroArea}>
                        {/* Rotating Tagline Header */}
                        <div className={styles.rotatingTaglineWrap}>
                            <div className={`${styles.taglineText} ${taglineFading ? styles.taglineFadeOut : styles.taglineFadeIn}`}>
                                {EXPLORE_TAGLINES[taglineIndex]}
                            </div>
                        </div>

                        {/* Greeting Hero */}
                        <h1 className={styles.greetingTitleLarge}>
                            {dynamicGreeting}
                        </h1>
                        <div className={styles.greetingSubName}>
                            {userName}
                        </div>

                        {/* Centered Explore Input Card */}
                        <StudioComposerCard
                            isExploreMode={true}
                            input={input}
                            setInput={setInput}
                            placeholder={t('strategyStudio.inputPlaceholder', 'What would you like to explore?')}
                            onSend={handleSend}
                            loading={loading}
                            onNewChat={null}
                            typedSuggestions={typedSuggestions}
                            showTypedSuggestions={showTypedSuggestions}
                            activeSuggestionIndex={activeSuggestionIndex}
                            setActiveSuggestionIndex={setActiveSuggestionIndex}
                            onKeyDown={handleKeyDown}
                            t={t}
                        />

                        {/* Category Chips Underneath Input Card */}
                        <div className={styles.categoryChipsRow}>
                            <button
                                type="button"
                                className={`${styles.categoryChipBtn} ${isStrategyMenuOpen ? styles.activeChip : ''}`}
                                onClick={() => setIsStrategyMenuOpen((prev) => !prev)}
                            >
                                <CpuChipIcon size={13} color="#18C98B" />
                                <span>Strategy</span>
                            </button>
                        </div>

                        {/* Strategy Options Popup (IMAGE 2) */}
                        {isStrategyMenuOpen && (
                            <div className={styles.strategyMenuPopup}>
                                <div className={styles.popupHeader}>
                                    <div className={styles.popupHeaderTitle}>
                                        <CpuChipIcon size={15} color="#18C98B" />
                                        <span>Strategy</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.popupCloseBtn}
                                        onClick={() => setIsStrategyMenuOpen(false)}
                                        title="Close"
                                    >
                                        <CloseXIcon size={14} />
                                    </button>
                                </div>
                                <div className={styles.popupOptionsList}>
                                    {dynamicOptions.map((opt, optIdx) => (
                                        <button
                                            key={optIdx}
                                            type="button"
                                            className={styles.popupOptionItem}
                                            onClick={() => {
                                                setIsStrategyMenuOpen(false);
                                                onChipClick(opt);
                                            }}
                                        >
                                            <SparklesMiniIcon size={14} color="#18C98B" />
                                            <span>{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* ── ACTIVE CONVERSATION CHAT VIEW (IMAGE 3) ── */
                <div className={styles.activeChatInnerContainer}>
                    <div className={styles.chatMessagesArea} ref={chatScrollContainerRef}>
                        {messages.map((msg, index) => {
                            const isUser = msg.role === 'user';
                            const isLatestAi = !isUser && index === messages.length - 1;
                            const isFirstAiResponse = !isUser && messages.findIndex((m) => m.role === 'ai') === index;
                            const msgKey = `msg_${index}_${(msg.text || '').slice(0, 15)}`;
                            const hasCompleted = completedStreamsRef.current.has(msgKey);
                            const shouldStream = isLatestAi && !hasCompleted && !msg.fromHistory;
                            const showActionOptions = isUser || !isLatestAi || hasCompleted || !shouldStream;

                            return (
                                <React.Fragment key={index}>
                                    {/* Futuristic Circuit Strategy Divider on First AI Message Only */}
                                    {isFirstAiResponse && (
                                        <div className={styles.circuitStrategyDivider}>
                                            <div className={styles.circuitLineLeft}>
                                                <svg className={styles.circuitSvg} viewBox="0 0 160 18" fill="none">
                                                    <path d="M 4 15 L 38 6 L 160 6" stroke="url(#circuitGradGreenLeft)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                    <circle cx="4" cy="15" r="2.5" fill="#18C98B" />
                                                    <defs>
                                                        <linearGradient id="circuitGradGreenLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#18C98B" stopOpacity="0.8" />
                                                            <stop offset="40%" stopColor="#18C98B" stopOpacity="0.9" />
                                                            <stop offset="100%" stopColor="#18C98B" stopOpacity="1" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <div className={styles.circuitBadge}>
                                                <span>Strategy</span>
                                            </div>
                                            <div className={styles.circuitLineRight}>
                                                <svg className={styles.circuitSvg} viewBox="0 0 160 18" fill="none">
                                                    <path d="M 0 6 L 122 6 L 156 1" stroke="url(#circuitGradGreenRight)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                    <circle cx="156" cy="1" r="2.5" fill="#18C98B" />
                                                    <defs>
                                                        <linearGradient id="circuitGradGreenRight" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#18C98B" stopOpacity="1" />
                                                            <stop offset="60%" stopColor="#18C98B" stopOpacity="0.9" />
                                                            <stop offset="100%" stopColor="#18C98B" stopOpacity="0.8" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    <div className={`${styles.messageRow} ${isUser ? styles.userRow : ''}`}>
                                        {isUser ? (
                                            <div className={`${styles.bubble} ${styles.userBubble}`}>
                                                {renderUserBubbleContent(msg)}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '86%' }}>
                                                <StreamingAiBubble
                                                    text={msg.text}
                                                    shouldStream={shouldStream}
                                                    onStreamProgress={handleStreamProgress}
                                                    onStreamComplete={() => {
                                                        completedStreamsRef.current.add(msgKey);
                                                        setIsOptionBoxDismissed(false);
                                                        forceUpdate((n) => n + 1);
                                                        setTimeout(() => scrollToBottom(true), 60);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Ready to Proceed Card — Appears BEFORE strategy generation at the review/confirm question step */}
                                    {(() => {
                                        const isAlreadyGenerated = Boolean(
                                            (msg.text || '').toLowerCase().includes('generated successfully') ||
                                            (msg.text || '').toLowerCase().includes('configured and calibrated') ||
                                            (msg.text || '').toLowerCase().includes('strategy ready') ||
                                            (msg.text || '').toLowerCase().includes("what's next? run a backtest") ||
                                            msg.isGeneratedStrategy ||
                                            msg.step === 5 ||
                                            msg.step_number === 5 ||
                                            (msg.step_title || '').toLowerCase().includes('strategy ready') ||
                                            (msg.step_badge || '').toLowerCase().includes('step 5')
                                        );

                                        const isReviewOrConfirmStage = !isAlreadyGenerated && !msg.isError && Boolean(
                                            msg.complete === true
                                        );

                                        const hasSubsequentCreation = messages.slice(index + 1).some((m) =>
                                            (m.text || '').toLowerCase().includes('create strategy') ||
                                            (m.text || '').toLowerCase().includes('generated successfully')
                                        );

                                        const showReadyToProceedCard = showActionOptions &&
                                            !isUser &&
                                            !msg.isError &&
                                            msg.complete === true &&
                                            !isAlreadyGenerated &&
                                            !hasSubsequentCreation &&
                                            !generatingStrategy;

                                        if (!showReadyToProceedCard) return null;

                                        const effectiveDraft = msg.draft || currentDraft || {};
                                        const dynName = msg.strategy_name || effectiveDraft?.strategy_name || effectiveDraft?.suggested_strategy_name;

                                        return (
                                            <ReadyToProceedCard
                                                draft={effectiveDraft}
                                                strategyName={dynName}
                                                onCreateStrategy={(name) => onGenerateFromDraft(effectiveDraft, name)}
                                                onEnhance={(name) => onSend(`Enhance and optimize strategy rules for ${name}`)}
                                                onModifyStrategy={(name) => onSend(`Modify strategy parameters for ${name}`)}
                                                generatingStrategy={false}
                                            />
                                        );
                                    })()}
                                </React.Fragment>
                            );
                        })}

                        {/* Active Strategy Generation Stepper Card (Bottom of Chat) */}
                        {generatingStrategy && (
                            <div className={styles.messageRow}>
                                <ReadyToProceedCard generatingStrategy={true} />
                            </div>
                        )}

                        {loading && !generatingStrategy && (<div className={styles.messageRow}>
                            <DynamicChatLoader />
                        </div>
                        )}
                    </div>

                    {/* ── BOTTOM CHAT BAR WITH DOCKED INTERACTIVE QUESTION WIZARD (IMAGE 1 & 2) ── */}
                    <div className={styles.bottomChatInputBar}>
                        {/* Interactive Step-by-Step Question Wizard Docked Above Input Field */}
                        {(() => {
                            const isReadyStage = Boolean(
                                latestAiMessage?.complete === true ||
                                String(latestAiMessage?.complete) === 'true' ||
                                latestAiMessage?.json_fulfilled === true ||
                                String(latestAiMessage?.json_fulfilled) === 'true' ||
                                latestAiMessage?.is_complete === true ||
                                latestAiMessage?.ready_for_backtest === true ||
                                latestAiMessage?.asking_for === 'none' ||
                                resp?.complete === true ||
                                resp?.json_fulfilled === true ||
                                resp?.ready_for_backtest === true ||
                                resp?.asking_for === 'none' ||
                                (resp?.strategy && (
                                    (Array.isArray(resp.strategy?.stock_name) && resp.strategy.stock_name.length > 0) ||
                                    (Array.isArray(resp.strategy?.symbols) && resp.strategy.symbols.length > 0)
                                ))
                            );
                            if (isReadyStage || isOptionBoxDismissed || loading || !isLatestAiMessage || !isLatestAiStreamCompleted || latestAiMessage?.isError) {
                                return null;
                            }
                            return (
                                <InteractiveQuestionWizard
                                    latestAiMessage={latestAiMessage}
                                    messages={messages}
                                    onComplete={(summaryText, qaList) => {
                                        handleSend(summaryText, { qaList });
                                    }}
                                    onDismiss={() => setIsOptionBoxDismissed(true)}
                                    loading={loading}
                                />
                            );
                        })()}

                        {/* Bottom Textarea + Send Button (Card Layout Matching Image 2) */}
                        <StudioComposerCard
                            isExploreMode={false}
                            input={input}
                            setInput={setInput}
                            placeholder={t('strategyStudio.inputPlaceholder', 'What would you like to explore?')}
                            onSend={handleSend}
                            loading={loading}
                            onNewChat={onNewChat}
                            typedSuggestions={typedSuggestions}
                            showTypedSuggestions={showTypedSuggestions}
                            activeSuggestionIndex={activeSuggestionIndex}
                            setActiveSuggestionIndex={setActiveSuggestionIndex}
                            onKeyDown={handleKeyDown}
                            t={t}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
