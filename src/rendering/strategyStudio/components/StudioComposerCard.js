'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import {
    SparklesMiniIcon,
    PlusIcon,
    ArrowUpIcon,
    ChevronDownIcon
} from './StudioIcons';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export default function StudioComposerCard({
    isExploreMode = false,
    input,
    setInput,
    placeholder = 'What would you like to explore?',
    onSend,
    loading = false,
    onNewChat,
    typedSuggestions = [],
    showTypedSuggestions = false,
    activeSuggestionIndex = 0,
    setActiveSuggestionIndex,
    onKeyDown,
    t
}) {
    const textareaRef = useRef(null);
    const baseInputRef = useRef('');
    const [isExpanded, setIsExpanded] = useState(() => Boolean(input && input.trim()));

    const { isListening, toggleListening, stopListening } = useSpeechToText({
        onStart: () => {
            setIsExpanded(true);
            baseInputRef.current = input ? `${input.trim()} ` : '';
            if (textareaRef?.current) {
                textareaRef.current.focus();
            }
        },
        onResult: (spokenText) => {
            if (typeof spokenText !== 'string') return;
            const nextText = `${baseInputRef.current}${spokenText}`.slice(0, 500);
            setInput(nextText);
            if (textareaRef?.current) {
                textareaRef.current.value = nextText;
                textareaRef.current.style.height = 'auto';
                const scrollH = textareaRef.current.scrollHeight;
                const newHeight = Math.min(Math.max(scrollH, 44), 115);
                textareaRef.current.style.height = `${newHeight}px`;
            }
        }
    });

    const handleVoiceClick = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        baseInputRef.current = input ? `${input.trim()} ` : '';
        if (!isExpanded) {
            handleExpand();
        }
        toggleListening();
    };

    // Keep expanded if user has written text, collapse when reset unless actively listening
    useEffect(() => {
        if (input && input.trim()) {
            if (!isExpanded) setIsExpanded(true);
        } else if (!isListening) {
            setIsExpanded(false);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    }, [input, isListening]);

    // Auto-grow input up to 4-5 lines (~115px), then scroll
    useEffect(() => {
        if (textareaRef?.current && isExpanded) {
            textareaRef.current.style.height = 'auto';
            const scrollH = textareaRef.current.scrollHeight;
            const newHeight = Math.min(Math.max(scrollH, 44), 115);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [input, isExpanded]);

    const handleExpand = () => {
        setIsExpanded(true);
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.style.height = 'auto';
                const scrollH = textareaRef.current.scrollHeight;
                const newHeight = Math.min(Math.max(scrollH, 44), 115);
                textareaRef.current.style.height = `${newHeight}px`;
            }
        }, 50);
    };

    const handleCollapse = (e) => {
        if (e) e.stopPropagation();
        if (isListening) stopListening();
        setIsExpanded(false);
    };

    const handleSendAction = () => {
        if (loading || !input.trim()) return;
        if (isListening) stopListening();
        onSend(input);
        setIsExpanded(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleInternalKeyDown = (e) => {
        if (onKeyDown) {
            onKeyDown(e);
            if (e.defaultPrevented) return;
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            handleSendAction();
        }
    };

    const containerClass = isExploreMode
        ? `${styles.exploreInputCard} ${isExpanded ? styles.inputCardExpanded : styles.inputCardCollapsed}`
        : `${styles.chatInputWrapper} ${isExpanded ? styles.inputCardExpanded : styles.inputCardCollapsed}`;

    const textareaClass = isExploreMode ? styles.explorePromptTextarea : styles.chatTextarea;
    const bottomRowClass = isExploreMode ? styles.exploreCardBottom : styles.chatCardBottom;
    const dropdownClass = isExploreMode
        ? styles.typedSuggestionDropdown
        : `${styles.typedSuggestionDropdown} ${styles.typedSuggestionDropdownAbove}`;

    return (
        <div
            className={containerClass}
            onClick={() => {
                if (!isExpanded) handleExpand();
            }}
        >
            {!isExpanded ? (
                <>
                    <div className={styles.collapsedPlaceholderWrap}>
                        <SparklesMiniIcon size={15} color="#18C98B" />
                        <span className={styles.collapsedPlaceholderText}>
                            {placeholder}
                        </span>
                    </div>
                    <div className={styles.composerCollapsedActions}>
                        {onNewChat && !isExploreMode && (
                            <button
                                type="button"
                                className={styles.btnNewChatMini}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNewChat();
                                }}
                                title={t ? t('strategyStudio.newChat', 'New Chat') : 'New Chat'}
                                aria-label="New Chat"
                            >
                                <PlusIcon size={13} />
                                <span>{t ? t('strategyStudio.newChat', 'New Chat') : 'New Chat'}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ''}`}
                            onClick={handleVoiceClick}
                            title={
                                isListening
                                    ? (t ? t('aiAssistant.stopListening', 'Listening... Click to stop') : 'Listening... Click to stop')
                                    : (t ? t('aiAssistant.voiceInput', 'Voice Input (Click to speak)') : 'Voice Input (Click to speak)')
                            }
                            aria-label={isListening ? 'Stop Voice Input' : 'Start Voice Input'}
                        >
                            {isListening ? (
                                <div className={styles.voiceListeningWaves}>
                                    <span className={styles.waveBar} />
                                    <span className={styles.waveBar} />
                                    <span className={styles.waveBar} />
                                    <span className={styles.waveBar} />
                                </div>
                            ) : (
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="23" />
                                    <line x1="8" y1="23" x2="16" y2="23" />
                                </svg>
                            )}
                            {isListening && <span className={styles.voicePulseRing} />}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <textarea
                        ref={textareaRef}
                        className={textareaClass}
                        placeholder={placeholder}
                        value={input}
                        maxLength={500}
                        onChange={(e) => {
                            const val = e.target.value.slice(0, 500);
                            setInput(val);
                            if (setActiveSuggestionIndex) setActiveSuggestionIndex(0);
                        }}
                        onKeyDown={handleInternalKeyDown}
                        rows={1}
                    />

                    {/* As-you-type suggestion dropdown */}
                    {showTypedSuggestions && (
                        <div className={dropdownClass}>
                            {typedSuggestions.map((sug, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`${styles.typedSuggestionItem} ${i === activeSuggestionIndex ? styles.typedSuggestionActive : ''}`}
                                    onMouseEnter={() => setActiveSuggestionIndex && setActiveSuggestionIndex(i)}
                                    onClick={() => {
                                        setInput(sug.slice(0, 500));
                                        if (setActiveSuggestionIndex) setActiveSuggestionIndex(0);
                                        if (textareaRef.current) textareaRef.current.focus();
                                    }}
                                >
                                    <div className={styles.suggestionIconWrap}>
                                        <SparklesMiniIcon size={14} color="currentColor" />
                                    </div>
                                    <span className={styles.suggestionText}>{sug}</span>
                                    <span className={styles.suggestionHintBadge}>Tab</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className={bottomRowClass}>
                        <div className={styles.cardBottomActionsLeft}>
                            {onNewChat && !isExploreMode && (
                                <button
                                    type="button"
                                    className={styles.btnNewChat}
                                    onClick={(e) => {
                                        if (e && e.stopPropagation) e.stopPropagation();
                                        setIsExpanded(false);
                                        onNewChat();
                                    }}
                                    title="Start a new chat session"
                                >
                                    <PlusIcon size={14} />
                                    <span>{t ? t('strategyStudio.newChat', 'New Chat') : 'New Chat'}</span>
                                </button>
                            )}
                            <button
                                type="button"
                                className={styles.btnCollapseInput}
                                onClick={handleCollapse}
                                title={t ? t('strategyStudio.collapse', 'Collapse input') : 'Collapse input'}
                            >
                                <ChevronDownIcon size={16} />
                            </button>
                        </div>
                        <div className={styles.cardBottomActionsRight}>
                            {input && input.length > 0 && (
                                <span className={`${styles.charCounter} ${input.length >= 500 ? styles.atLimit : input.length >= 450 ? styles.nearLimit : ''}`}>
                                    {input.length}/500
                                </span>
                            )}
                            <button
                                type="button"
                                className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ''}`}
                                onClick={handleVoiceClick}
                                title={
                                    isListening
                                        ? (t ? t('aiAssistant.stopListening', 'Listening... Click to stop') : 'Listening... Click to stop')
                                        : (t ? t('aiAssistant.voiceInput', 'Voice Input (Click to speak)') : 'Voice Input (Click to speak)')
                                }
                                aria-label={isListening ? 'Stop Voice Input' : 'Start Voice Input'}
                            >
                                {isListening ? (
                                    <div className={styles.voiceListeningWaves}>
                                        <span className={styles.waveBar} />
                                        <span className={styles.waveBar} />
                                        <span className={styles.waveBar} />
                                        <span className={styles.waveBar} />
                                    </div>
                                ) : (
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" y1="19" x2="12" y2="23" />
                                        <line x1="8" y1="23" x2="16" y2="23" />
                                    </svg>
                                )}
                                {isListening && <span className={styles.voicePulseRing} />}
                            </button>
                            <button
                                type="button"
                                className={`${styles.circularSubmitBtn} ${input.trim() ? styles.activeBtn : ''}`}
                                onClick={handleSendAction}
                                disabled={loading || !input.trim()}
                                title="Send Message"
                            >
                                <ArrowUpIcon size={20} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
