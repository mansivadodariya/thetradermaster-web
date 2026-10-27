'use client';

import React, { useRef, useEffect } from 'react';

import SymbolIcon from '@/icons/symbolIcon';
import TickerSearchDropdown from '@/components/TickerSearchDropdown';
import DownIcon from '@/icons/downIcon';
import AttachmentDraft from '../AttachmentDraft';
import { BrainIcon } from '@/icons/visionIcons';
import { useSpeechToText } from '../hooks/useSpeechToText';
import styles from '../aiAssistant.module.scss';

export default function ChatInputBar({
    textareaRef,
    chatInput,
    setChatInput,
    handleSendChatMessage,
    handlePaste,
    handleDrop,
    pendingRequest,
    queuedCount = 0,
    activeAnalysisMode,
    setActiveAnalysisMode,
    selectedPair,
    setSelectedPair,
    attachmentDraft,
    setAttachmentDraft,
    setPreviewAttachment,
    fileInputRef,
    handleFileSelect,
    attachDropdownRef,
    attachDropdownOpen,
    setAttachDropdownOpen,
    dropdownRef,
    dropdownOpen,
    setDropdownOpen,
    handleGenerateFromImageClick,
    handleDeepAnalysisClick,
    handleMacroNewsClick,
    isDark,
    t
}) {
    const baseInputRef = useRef('');

    const { isListening, toggleListening } = useSpeechToText({
        onStart: () => {
            baseInputRef.current = chatInput ? `${chatInput} ` : '';
            if (textareaRef?.current) {
                textareaRef.current.focus();
            }
        },
        onResult: (transcript, isFinal) => {
            const nextText = `${baseInputRef.current}${transcript}`;
            setChatInput(nextText);
            if (isFinal) {
                baseInputRef.current = `${nextText} `;
            }
        }
    });

    // Auto-grow input up to 4-5 lines (~115px), then scroll
    useEffect(() => {
        if (textareaRef?.current) {
            textareaRef.current.style.height = 'auto';
            const scrollH = textareaRef.current.scrollHeight;
            const newHeight = Math.min(Math.max(scrollH, 44), 115);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [chatInput, textareaRef]);
    const getPlaceholderText = () => {
        if (pendingRequest) return t('aiAssistant.queuePlaceholder', 'Type a follow-up to queue (will send after response)...');
        if (activeAnalysisMode === 'deep') {
            const raw = t('aiAssistant.deepPlaceholder', `Ask for deep technical structure, key levels, trade setup for ${selectedPair || 'market'}...`);
            if (!raw || raw === 'aiAssistant.deepPlaceholder') {
                return `Ask for deep technical structure, key levels, trade setup for ${selectedPair || 'market'}...`;
            }
            return raw.replace('{pair}', selectedPair || 'market');
        }
        if (activeAnalysisMode === 'news') {
            const raw = t('aiAssistant.newsPlaceholder', 'Ask about economic events, catalysts, news sentiment...');
            return (!raw || raw === 'aiAssistant.newsPlaceholder') ? 'Ask about economic events, catalysts, news sentiment...' : raw;
        }
        if (activeAnalysisMode === 'image') {
            const raw = t('aiAssistant.imagePlaceholder', 'Ask about technical patterns and diagnosis on this chart...');
            return (!raw || raw === 'aiAssistant.imagePlaceholder') ? 'Ask about technical patterns and diagnosis on this chart...' : raw;
        }
        const raw = t('aiAssistant.askAnythingPlaceholder', 'Ask anything about forex trading, chart and strategies...');
        return (!raw || raw === 'aiAssistant.askAnythingPlaceholder') ? 'Ask anything about forex trading, chart and strategies...' : raw;
    };

    return (
        <div
            className={styles.inputArea}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            {attachmentDraft && (
                <AttachmentDraft
                    attachment={attachmentDraft}
                    onRemove={() => setAttachmentDraft(null)}
                    onPreview={(att) => setPreviewAttachment(att)}
                />
            )}
            <textarea
                ref={textareaRef}
                placeholder={getPlaceholderText()}
                className={styles.textarea}
                value={chatInput}
                maxLength={500}
                onChange={(e) => setChatInput(e.target.value.trimStart().slice(0, 500))}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChatMessage();
                    }
                }}
            />
            <div className={styles.inputFooter}>
                <div className={styles.leftInputControls}>
                    {/* Floating Attachment Dropdown Menu */}
                    <div className={styles.attachDropdownContainer} ref={attachDropdownRef}>
                        <button
                            type="button"
                            className={`${styles.attachPlusBtn} ${attachDropdownOpen ? styles.attachPlusActive : ''}`}
                            onClick={() => setAttachDropdownOpen(!attachDropdownOpen)}
                            title={attachDropdownOpen ? t('aiAssistant.closeAttachmentMenu', 'Close attachment menu') : t('aiAssistant.addAttachment', 'Add attachment')}
                        >
                            <div className={styles.plusIconWrapper}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </div>
                        </button>

                        {attachDropdownOpen && (
                            <div className={styles.attachFloatingMenu}>
                                <button
                                    type="button"
                                    className={styles.attachMenuItem}
                                    onClick={() => {
                                        setAttachDropdownOpen(false);
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                    </svg>
                                    <span>{t('aiAssistant.uploadFiles', 'Upload files')}</span>
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.attachMenuItem} ${activeAnalysisMode === 'image' ? styles.attachMenuItemActive : ''}`}
                                    onClick={() => {
                                        setAttachDropdownOpen(false);
                                        handleGenerateFromImageClick();
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                    <span>{t('aiAssistant.chartSnapshot', 'Chart Snapshot')}</span>
                                    {activeAnalysisMode === 'image' && <span className={styles.activeModeDot} />}
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.attachMenuItem} ${activeAnalysisMode === 'deep' ? styles.attachMenuItemActive : ''}`}
                                    onClick={() => {
                                        setAttachDropdownOpen(false);
                                        handleDeepAnalysisClick();
                                    }}
                                >
                                    <BrainIcon size={16} />
                                    <span>{t('aiAssistant.deepMarketAnalysis', 'Deep Market Analysis')}</span>
                                    {activeAnalysisMode === 'deep' && <span className={styles.activeModeDot} />}
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.attachMenuItem} ${activeAnalysisMode === 'news' ? styles.attachMenuItemActive : ''}`}
                                    onClick={() => {
                                        setAttachDropdownOpen(false);
                                        handleMacroNewsClick();
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                                        <path d="M18 14h-8" />
                                        <path d="M15 18h-5" />
                                        <path d="M10 6h8v4h-8z" />
                                    </svg>
                                    <span>{t('aiAssistant.macroNews', 'Macro News & Economic Events')}</span>
                                    {activeAnalysisMode === 'news' && <span className={styles.activeModeDot} />}
                                </button>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />

                    {/* Custom Dropdown Trigger */}
                    <div className={styles.dropdownContainer} ref={dropdownRef}>
                        <button
                            className={styles.dropdownTrigger}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            type="button"
                        >
                            <SymbolIcon symbol={selectedPair} size={18} />
                            <span>{selectedPair}</span>
                            <span className={`${styles.chevron} ${dropdownOpen ? styles.rotated : ''}`}>
                                <DownIcon />
                            </span>
                        </button>
                        {dropdownOpen && (
                            <TickerSearchDropdown
                                selectedSymbol={selectedPair}
                                onSelectSymbol={(newSym) => setSelectedPair(newSym)}
                                onClose={() => setDropdownOpen(false)}
                                position="top"
                                isDark={isDark}
                                allowNoPair={true}
                            />
                        )}
                    </div>

                    {/* Active Analysis Mode Tab Badge */}
                    {activeAnalysisMode && (
                        <div className={`${styles.activeModeTab} ${styles[`mode_${activeAnalysisMode}`]}`}>
                            <span className={styles.activeModeIcon}>
                                {activeAnalysisMode === 'deep' && <BrainIcon size={14} />}
                                {activeAnalysisMode === 'news' && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                                        <path d="M18 14h-8" />
                                        <path d="M15 18h-5" />
                                        <path d="M10 6h8v4h-8z" />
                                    </svg>
                                )}
                                {activeAnalysisMode === 'image' && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                )}
                            </span>
                            <span className={styles.activeModeLabel}>
                                {activeAnalysisMode === 'deep' ? t('aiAssistant.deepAnalysis', 'Deep Analysis') : activeAnalysisMode === 'news' ? t('aiAssistant.macroNewsTab', 'Macro News') : t('aiAssistant.chartVision', 'Chart Vision')}
                            </span>
                            <button
                                type="button"
                                className={styles.activeModeCloseBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveAnalysisMode(null);
                                }}
                                title={t('aiAssistant.clearMode', 'Clear mode')}
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Input Controls: Voice button + Send button */}
                <div className={styles.rightInputControls}>
                    {chatInput && chatInput.length > 0 && (
                        <span className={`${styles.charCounter} ${chatInput.length >= 500 ? styles.atLimit : chatInput.length >= 450 ? styles.nearLimit : ''}`}>
                            {chatInput.length}/500
                        </span>
                    )}
                    <button
                        type="button"
                        className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ''}`}
                        onClick={toggleListening}
                        title={
                            isListening
                                ? t('aiAssistant.stopListening', 'Listening... Click to stop')
                                : t('aiAssistant.voiceInput', 'Voice Input (Click to speak)')
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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                        )}
                        {isListening && <span className={styles.voicePulseRing} />}
                    </button>

                    {/* Send / Queue trigger */}
                    <button
                        className={`${styles.sendBtn} ${pendingRequest ? styles.sendBtnQueue : ''}`}
                        onClick={handleSendChatMessage}
                        disabled={!chatInput.trim() && !attachmentDraft && !activeAnalysisMode}
                        title={pendingRequest ? t('aiAssistant.addToQueue', 'Queue message (will send after response)') : t('aiAssistant.send', 'Send message')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
