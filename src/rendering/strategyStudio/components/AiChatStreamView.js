'use client';

import React, { useState, useCallback } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import BacktestResultsView from './BacktestResultsView';
import ChatProgressSteps from './ChatProgressSteps';
import ReadyToProceedCard from './ReadyToProceedCard';
import { useStreamingText } from '../utils/streamingRenderer';
import { sanitizeRawJsonText } from '../utils/chatTextFormatter';
import {
    LightningIcon,
    RefreshResetIcon,
    ArrowUpIcon,
    ArrowLeftBackIcon,
    PlayBacktestIcon
} from './StudioIcons';

/**
 * StreamingAiBubble — Renders a single AI message with GPT-like streaming
 * Only the latest AI message gets streaming; older messages render instantly.
 */
function StreamingAiBubble({ text, shouldStream, onStreamComplete, onStreamProgress }) {
    const cleanText = React.useMemo(() => sanitizeRawJsonText(text), [text]);

    const { displayedText, isStreaming, skipToEnd } = useStreamingText(cleanText, {
        msPerChar: 18,
        enabled: shouldStream,
        onComplete: onStreamComplete,
        onProgress: onStreamProgress
    });

    const renderedText = shouldStream ? displayedText : cleanText;

    return (
        <div 
            className={styles.chatAiBubble}
            onClick={isStreaming ? skipToEnd : undefined}
            title={isStreaming ? "Click to reveal immediately" : undefined}
        >
            {renderedText}
            {isStreaming && (
                <span className={styles.streamingCursorChar}>▌</span>
            )}
        </div>
    );
}

export default function AiChatStreamView({
    chatContainerRef,
    chatScrollRef,
    messages,
    advisorLoading,
    currentDraft,
    symbol,
    interval,
    capital,
    results,
    roundTrips,
    generatingStrategy,
    simulationLoading,
    chatInput,
    setChatInput,
    onSendMessage,
    onGenerateStrategy,
    onRunBacktest,
    onResetSession,
    onBackToExplore
}) {
    // Set of message keys that have completed their initial streaming (they NEVER stream again)
    const completedStreamsRef = React.useRef(new Set());
    // Track which message key is currently actively streaming (only the latest incoming message)
    const [activeStreamingKey, setActiveStreamingKey] = useState(null);
    // Track whether current stream is complete
    const [streamComplete, setStreamComplete] = useState(true);
    const bottomTextareaRef = React.useRef(null);

    // Auto-grow input up to 4-5 lines (~115px), then scroll
    React.useEffect(() => {
        if (bottomTextareaRef?.current) {
            bottomTextareaRef.current.style.height = 'auto';
            const scrollH = bottomTextareaRef.current.scrollHeight;
            const newHeight = Math.min(Math.max(scrollH, 44), 115);
            bottomTextareaRef.current.style.height = `${newHeight}px`;
        }
    }, [chatInput]);

    // ONLY the very last message in the chat can EVER stream, and ONLY if it's an incoming AI message
    React.useEffect(() => {
        if (!messages || messages.length === 0) {
            completedStreamsRef.current.clear();
            setActiveStreamingKey(null);
            setStreamComplete(true);
            return;
        }

        const lastIdx = messages.length - 1;
        const lastMsg = messages[lastIdx];

        // If the last message is NOT an AI message (e.g. user message or progress steps),
        // or is not marked as isStreaming, no streaming should be active.
        if (!lastMsg || lastMsg.role !== 'ai' || lastMsg.progressType || !lastMsg.isStreaming) {
            setActiveStreamingKey(null);
            setStreamComplete(true);
            return;
        }

        const msgKey = lastMsg.id || `ai_${lastIdx}_${(lastMsg.text || '').slice(0, 20)}`;

        // If this message has ALREADY completed streaming in the past, do not stream again
        if (completedStreamsRef.current.has(msgKey)) {
            setActiveStreamingKey(null);
            setStreamComplete(true);
            return;
        }

        // Fresh incoming AI message: stream it
        setActiveStreamingKey(msgKey);
        setStreamComplete(false);
    }, [messages]);

    const handleStreamComplete = useCallback((msgKey) => {
        if (msgKey) {
            completedStreamsRef.current.add(msgKey);
        }
        setActiveStreamingKey(null);
        setStreamComplete(true);
    }, []);

    // Smoothly scroll to bottom
    const scrollToBottom = useCallback((behavior = 'smooth') => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTo({
                top: chatScrollRef.current.scrollHeight,
                behavior
            });
        }
    }, [chatScrollRef]);

    // Keep scrolled to bottom on new messages, loading state, or streaming completion (chips pop in)
    React.useEffect(() => {
        const raf = requestAnimationFrame(() => {
            scrollToBottom('smooth');
        });
        const timer = setTimeout(() => {
            scrollToBottom('smooth');
        }, 120);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(timer);
        };
    }, [messages, advisorLoading, streamComplete, results, scrollToBottom]);

    const lastScrollHeightRef = React.useRef(0);

    // Follow streaming text down smoothly when new lines wrap
    const handleStreamProgress = useCallback(() => {
        if (chatScrollRef.current) {
            const el = chatScrollRef.current;
            if (el.scrollHeight !== lastScrollHeightRef.current) {
                lastScrollHeightRef.current = el.scrollHeight;
                const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 300;
                if (isNearBottom) {
                    el.scrollTop = el.scrollHeight;
                }
            }
        }
    }, [chatScrollRef]);

    // Forward mouse wheel from bottom floating bar smoothly to the chat scroll area
    const handleBottomBarWheel = useCallback((e) => {
        if (chatScrollRef.current) {
            const target = e.target;
            if (target && target.tagName === 'TEXTAREA' && target.scrollHeight > target.clientHeight) {
                return;
            }
            chatScrollRef.current.scrollBy({
                top: e.deltaY,
                behavior: 'smooth'
            });
        }
    }, [chatScrollRef]);

    // Handle chip clicks — replicate all cases from reference HTML
    const handleChipClick = useCallback((label) => {
        // Dismiss active stream immediately
        setActiveStreamingKey(null);
        setStreamComplete(true);

        const lower = label.toLowerCase();

        // Backtest triggers
        if (lower.includes('run backtest') || lower.includes('backtest now')) {
            onSendMessage('Run Backtest Now');
            return;
        }

        // JSON viewing triggers
        if (lower.includes('strategy json') || lower.includes('view json')) {
            onSendMessage(label);
            return;
        }

        // Default: send as message
        onSendMessage(label);
    }, [onSendMessage]);

    return (
        <div 
            ref={chatContainerRef}
            className={styles.tradezeeChatViewContainer}
            data-lenis-prevent="true"
        >
            {/* Chat Stream Messages Area */}
            <div 
                className={styles.tradezeeChatScrollArea} 
                ref={chatScrollRef}
                data-lenis-prevent="true"
            >
                <div className={styles.tradezeeChatStream} data-lenis-prevent="true">
                    {messages.map((msg, idx) => {
                        const msgKey = msg.id || `${msg.role}_${idx}_${(msg.text || '').slice(0, 20)}`;
                        const isThisStreaming = activeStreamingKey === msgKey;

                        return (
                            <React.Fragment key={msgKey}>
                                {msg.role === 'user' ? (
                                    <div className={styles.chatUserRow}>
                                        <div className={styles.chatUserBubble}>{msg.text}</div>
                                    </div>
                                ) : msg.progressType ? (
                                    /* Progress Steps Message (generating/backtesting) */
                                    <div className={styles.chatAiRow}>
                                        <div className={styles.chatAiContentWrap}>
                                            <ChatProgressSteps
                                                 type={msg.progressType}
                                                 isActive={msg.isActive !== false}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.chatAiRow}>
                                        <div className={styles.chatAiContentWrap}>
                                            {/* AI Message Bubble — ONLY streams if isThisStreaming is true */}
                                            <StreamingAiBubble
                                                text={msg.text}
                                                shouldStream={isThisStreaming}
                                                onStreamComplete={() => handleStreamComplete(msgKey)}
                                                onStreamProgress={handleStreamProgress}
                                            />

                                            {/* Suggestion Chips — only hidden if THIS message is actively streaming */}
                                            {msg.suggestions && msg.suggestions.length > 0 && (
                                                (!isThisStreaming || streamComplete) && (
                                                    <div className={styles.chatSuggestionChipsRow}>
                                                        {msg.suggestions.map((sug, sIdx) => (
                                                            <button
                                                                key={sIdx}
                                                                type="button"
                                                                className={styles.chatSuggestionChip}
                                                                onClick={() => handleChipClick(sug)}
                                                            >
                                                                {sug}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )
                                            )}

                                            {/* Strategy Draft Blueprint Card */}
                                            {msg.draft && (!isThisStreaming || streamComplete) && (
                                                <div className={styles.chatBlueprintCard}>
                                                    <div className={styles.chatBlueprintHeader}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <LightningIcon size={14} color="#18C98B" />
                                                            <span>Strategy Blueprint Ready</span>
                                                        </div>
                                                        <span style={{ fontSize: '11px', color: '#18C98B', fontWeight: '600' }}>Validated</span>
                                                    </div>

                                                    <div className={styles.chatBlueprintParams}>
                                                        <div className={styles.chatBlueprintParamBadge}>
                                                            Asset: <strong>{msg.draft?.instrument || symbol}</strong>
                                                        </div>
                                                        <div className={styles.chatBlueprintParamBadge}>
                                                            Interval: <strong>{msg.draft?.timeframe || interval}</strong>
                                                        </div>
                                                        <div className={styles.chatBlueprintParamBadge}>
                                                            Pattern: <strong>{msg.draft?.entry_pattern || msg.draft?.pattern || 'Breakout'}</strong>
                                                        </div>
                                                        <div className={styles.chatBlueprintParamBadge}>
                                                            TP: <strong>{msg.draft?.target_pips || 50} pts</strong>
                                                        </div>
                                                        <div className={styles.chatBlueprintParamBadge}>
                                                            SL: <strong>{msg.draft?.stoploss_pips || 25} pts</strong>
                                                        </div>
                                                    </div>

                                                    <div className={styles.chatBlueprintActions}>
                                                        <button
                                                            type="button"
                                                            className={styles.btnChatBlueprintPrimary}
                                                            onClick={() => onGenerateStrategy(msg.draft)}
                                                            disabled={generatingStrategy}
                                                        >
                                                            <LightningIcon size={13} color="#040605" />
                                                            <span>{generatingStrategy ? 'Generating JSON...' : 'Generate Strategy JSON'}</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={styles.btnChatBlueprintSecondary}
                                                            onClick={() => onRunBacktest()}
                                                            disabled={simulationLoading}
                                                        >
                                                            <PlayBacktestIcon size={13} color="#18C98B" />
                                                            <span>{simulationLoading ? 'Simulating...' : 'Run Backtest Now'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {advisorLoading && (
                        <div className={styles.chatAiRow}>
                            <div className={styles.chatLoadingBubble}>
                                <span className={styles.typingDot} />
                                <span className={styles.typingDot} />
                                <span className={styles.typingDot} />
                            </div>
                        </div>
                    )}

                    {/* Backtest Simulation Results */}
                    {results && (
                        <div style={{ marginTop: '16px', width: '100%' }}>
                            <BacktestResultsView
                                results={results}
                                roundTrips={roundTrips || []}
                                initialCapital={Number(capital) || 10000}
                                symbol={symbol || 'EURUSD'}
                                interval={interval || '15min'}
                                quantity={0.01}
                            />
                        </div>
                    )}

                    {/* Generous bottom spacer so content never overlaps behind the input field */}
                    <div className={styles.chatBottomSpacer} aria-hidden="true" />
                </div>
            </div>

            {/* Pinned Bottom Floating Glass Input Bar */}
            <div 
                className={styles.tradezeeChatBottomBar}
                data-lenis-prevent="true"
                onWheel={handleBottomBarWheel}
            >
                <div className={styles.tradezeeChatBottomCard} data-lenis-prevent="true">
                    <textarea
                        ref={bottomTextareaRef}
                        className={styles.inputPromptTextarea}
                        placeholder="Describe your trading strategy idea..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSendMessage();
                            }
                        }}
                        rows={1}
                    />
                    <div className={styles.cardBottomActions}>
                        <div className={styles.cardBottomActionsLeft}>
                            <button
                                type="button"
                                className={styles.btnBottomAction}
                                onClick={onBackToExplore}
                                title="Back to Explore"
                            >
                                <ArrowLeftBackIcon size={12} />
                                <span>Explore</span>
                            </button>
                            <button
                                type="button"
                                className={styles.btnBottomAction}
                                onClick={onResetSession}
                                title="New Chat"
                            >
                                <RefreshResetIcon size={12} />
                                <span>New Chat</span>
                            </button>
                        </div>
                        <button
                            type="button"
                            className={`${styles.circleSendButton} ${chatInput.trim() ? styles.hasValue : ''}`}
                            onClick={() => onSendMessage()}
                            title="Send Message"
                        >
                            <ArrowUpIcon size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
