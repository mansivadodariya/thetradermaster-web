'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getBidiProps, bidiMarkdownComponents } from '@/lib/bidi';
import { parseChatMessage } from '@/utils/chatParser';
import WelcomeActionView from './WelcomeActionView';
import ClarificationOptionButtons from './ClarificationOptionButtons';
import RenderMarkdownWithWidgets from './MarkdownWidgetRenderer';
import VisionAnalysisAccordions from './VisionAnalysisAccordions';
import { WarningIcon, ChatIcon, AnalyticsIcon, DownloadIcon } from '@/icons/visionIcons';
import { formatTechnicalProse, isTechnicalJsonPayload } from '@/utils/formatTechnicalProse';
import { exportAssistantMessageToPdf } from '../utils/exportAssistantPdf';
import { InteractiveErrorBubble, InteractiveErrorModal, categorizeChatError } from '@/components/interactiveError';
import styles from '../aiAssistant.module.scss';

const getAnalyzingPhrases = (t) => [
    t ? t('aiAssistant.analyzingPhrase1', 'Analyzing market structure & price action...') : 'Analyzing market structure & price action...',
    t ? t('aiAssistant.analyzingPhrase2', 'Evaluating technical indicators & key levels...') : 'Evaluating technical indicators & key levels...',
    t ? t('aiAssistant.analyzingPhrase3', 'Scanning liquidity pools & order imbalances...') : 'Scanning liquidity pools & order imbalances...',
    t ? t('aiAssistant.analyzingPhrase4', 'Synthesizing multi-timeframe trade outlook...') : 'Synthesizing multi-timeframe trade outlook...',
];

const ChatMessageList = React.memo(function ChatMessageList({
    chatMessages,
    isLoadingChat,
    pendingRequest,
    queuedCount = 0,
    selectedPair,
    chatEndRef,
    t,
    handleDeepAnalysisClick,
    handleGenerateFromImageClick,
    handleMacroNewsClick,
    setPreviewAttachment,
    handleDownloadFullReport,
    handleOptionClick,
    handleRetryMessage
}) {
    const [selectedModalError, setSelectedModalError] = React.useState(null);
    const [phraseIndex, setPhraseIndex] = React.useState(0);
    const analyzingPhrases = React.useMemo(() => getAnalyzingPhrases(t), [t]);

    React.useEffect(() => {
        if (!pendingRequest) {
            setPhraseIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % analyzingPhrases.length);
        }, 1600);

        return () => clearInterval(interval);
    }, [pendingRequest, analyzingPhrases.length]);

    return (
        <div 
            className={styles.chatBody}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
        >
            {chatMessages.length === 0 && !isLoadingChat ? (
                <WelcomeActionView
                    t={t}
                    handleDeepAnalysisClick={handleDeepAnalysisClick}
                    handleGenerateFromImageClick={handleGenerateFromImageClick}
                    handleMacroNewsClick={handleMacroNewsClick}
                />
            ) : (
                chatMessages.map((msg, index) => {
                    const isDeepAnalysis = msg.response_format === "deep_analysis" || msg.response_format === "deep_decision";
                    const isQueued = msg.role === 'user' && msg.status === 'queued';
                    const hasPair = msg.role === 'user' &&
                        msg.pair &&
                        typeof msg.pair === 'string' &&
                        msg.pair.trim() !== '' &&
                        msg.pair !== 'No Pair' &&
                        msg.pair !== 'NO_PAIR' &&
                        !msg.pair.toLowerCase().includes('no pair') &&
                        msg.pair.toLowerCase() !== 'none';

                    return (
                        <div
                            key={msg.id || index}
                            className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : ''} ${msg.fullReport ? styles.reportRow : ''} ${isQueued ? styles.userRowQueued : ''}`}
                        >
                            {msg.role === 'user' && (hasPair || isQueued) && (
                                <div className={styles.userHeaderBadges}>
                                    {hasPair && (
                                        <span className={styles.pairBadge}>
                                            <ChatIcon size={12} /> {msg.pair.toUpperCase()}
                                        </span>
                                    )}
                                    {isQueued && (
                                        <span className={styles.queuedBadge}>
                                            <span className={styles.queuedPulseDot} />
                                            {t ? t('aiAssistant.queued', 'Queued') : 'Queued'}
                                        </span>
                                    )}
                                </div>
                            )}
                            <div {...getBidiProps(msg.content, `${msg.role === 'user' ? styles.userMessage : styles.assistantMessage} ${isQueued ? styles.userMessageQueued : ''}`)}>
                                {msg.role === 'user' ? (
                                    <>
                                        {(msg.attachment?.url || msg.image_url) && (
                                            <div
                                                className={styles.userMsgAttachment}
                                                onClick={() => setPreviewAttachment(msg.attachment || { url: msg.image_url, name: 'Chart Image' })}
                                                title="Click to preview image"
                                            >
                                                <img src={msg.attachment?.url || msg.image_url} alt="Attached Chart" />
                                            </div>
                                        )}
                                        {msg.content}
                                    </>
                                ) : (() => {
                                    const userMsg = index > 0 ? chatMessages[index - 1] : null;
                                    const userPrompt = userMsg?.role === 'user' ? (userMsg.content || userMsg.text) : '';
                                    const enrichedMsg = { ...msg, user_prompt: msg.user_prompt || userPrompt };

                                    const isError =
                                        msg.role === 'error' ||
                                        msg.isError ||
                                        Boolean(msg.errorType) ||
                                        (typeof msg.content === 'string' && /^(failed to fetch|network error|load failed|error:)/i.test(msg.content.trim()));

                                    if (isError) {
                                        const errorData = msg.errorType ? msg : {
                                            ...msg,
                                            ...categorizeChatError(msg.content || msg.rawError || 'Failed to fetch', msg.status || 0),
                                            retryPayload: msg.retryPayload || {
                                                userMsgText: userPrompt || msg.user_prompt || ''
                                            }
                                        };

                                        return (
                                            <InteractiveErrorBubble
                                                error={errorData}
                                                onRetry={handleRetryMessage}
                                                isRetrying={pendingRequest}
                                                onOpenModal={(err) => setSelectedModalError(err)}
                                            />
                                        );
                                    }

                                    const parsed = parseChatMessage(msg.content, msg.fullReport);
                                    const sections = msg.chart_sections || (parsed.jsonData ? (parsed.jsonData.chart_sections || parsed.jsonData) : null);
                                    const disclaimerHeader = msg.disclaimer_header || parsed.disclaimerHeader;
                                    const disclaimerFooter = msg.disclaimer_footer || parsed.disclaimerFooter;
                                    let contentText = parsed.fallbackText || (typeof msg.content === 'string' && !msg.content.trim().startsWith('{') ? msg.content : '');

                                    // If contentText is still raw JSON (e.g. from historical sessions in DB), format it cleanly
                                    if ((!contentText || contentText.trim().startsWith('{')) && (msg.content || parsed.jsonData)) {
                                        try {
                                            const rawObj = parsed.jsonData || (typeof msg.content === 'string' && msg.content.trim().startsWith('{') ? JSON.parse(msg.content) : msg.content);
                                            if (rawObj && typeof rawObj === 'object' && isTechnicalJsonPayload(rawObj)) {
                                                contentText = formatTechnicalProse(rawObj, msg.detected_pair || selectedPair);
                                            }
                                        } catch (_) {}
                                    }

                                    const isVisionAnalysis = Boolean(
                                        msg.response_format === 'vision_analysis' ||
                                        msg.chat_type === 'With_Image' ||
                                        (sections && typeof sections === 'object' && (
                                            sections.overall_trend ||
                                            sections.market_structure ||
                                            sections.support_and_resistance ||
                                            sections.supply_and_demand_zones ||
                                            sections.trader_actionable_zones ||
                                            sections.volatility_and_price_behavior ||
                                            sections.session_behavior ||
                                            sections.market_mood ||
                                            sections.candlestick_behavior ||
                                            sections.chart_patterns ||
                                            sections.chart_sections ||
                                            (sections.is_valid_chart !== undefined && sections.overall_summary)
                                        ))
                                    );

                                    if (sections && isVisionAnalysis) {
                                        return (
                                            <>
                                                <VisionAnalysisAccordions
                                                    data={sections}
                                                    chartSections={sections}
                                                    textSummary={contentText || sections.overall_summary}
                                                    imageWarning={msg.image_warning}
                                                    disclaimerHeader={disclaimerHeader}
                                                    disclaimerFooter={disclaimerFooter}
                                                />
                                                {/* DOWNLOAD OPTION FOR VISION ANALYSIS */}
                                                <div className={styles.downloadReportRow} style={{ marginTop: 10 }}>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => exportAssistantMessageToPdf(enrichedMsg, selectedPair, e.currentTarget.closest('.' + styles.chatMessageBubble) || e.currentTarget.closest('.' + styles.analysisCenterCard))}
                                                        className={styles.downloadFullReportBtn}
                                                        style={{ color: '#FFFFFF' }}
                                                    >
                                                        <DownloadIcon size={14} />
                                                        <span style={{ color: '#FFFFFF' }}>Download Full Report (PDF)</span>
                                                    </button>
                                                </div>
                                            </>
                                        );
                                    }

                                    const displayContent = contentText || (typeof msg.content === 'string' && msg.content.trim().startsWith('{') ? formatTechnicalProse(msg.content, msg.detected_pair || selectedPair) : (msg.content || ''));

                                    return (
                                        <>
                                            {/* 1. Disclaimer Banner if present on plain message */}
                                            {disclaimerHeader && (
                                                <div className={styles.visionWarningCard} style={{ marginBottom: 12 }}>
                                                    <span className={styles.visionWarningIcon}>
                                                        <WarningIcon size={16} />
                                                    </span>
                                                    <div className={styles.chatMarkdown}>
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={bidiMarkdownComponents}>
                                                            {disclaimerHeader.replace(/^[>⚠️\s*]+/, '').replace(/^⚠️\s*/, '')}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 2. Structured Deep Analysis or Markdown Content */}
                                            {(msg.response_format === "deep_analysis" || isDeepAnalysis) && msg.fullReport ? (
                                                <div className={styles.deepAnalysisCardWrapper}>
                                                    {/* ANALYSIS CENTER */}
                                                    <div className={styles.analysisCenterCard}>
                                                        <div className={styles.analysisCenterHeader}>
                                                            <span className={styles.analysisCenterIcon}>
                                                                <AnalyticsIcon size={18} />
                                                            </span>
                                                            <span className={styles.analysisCenterTitle}>Analysis Center</span>
                                                        </div>

                                                        <RenderMarkdownWithWidgets
                                                            content={msg.fullReport}
                                                            visualData={msg.visualData}
                                                            defaultSymbol={msg.detected_pair || selectedPair}
                                                            isStreaming={Boolean(msg.isNewlyGenerated)}
                                                            onComplete={() => { msg.isNewlyGenerated = false; }}
                                                        />

                                                        {/* DOWNLOAD REPORT BUTTON */}
                                                        <div className={styles.downloadReportRow}>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => exportAssistantMessageToPdf(enrichedMsg, selectedPair, e.currentTarget.closest('.' + styles.chatMessageBubble) || e.currentTarget.closest('.' + styles.analysisCenterCard))}
                                                                className={styles.downloadFullReportBtn}
                                                                style={{ color: '#FFFFFF' }}
                                                            >
                                                                <DownloadIcon size={15} />
                                                                <span style={{ color: '#FFFFFF' }}>{t ? t('aiAssistant.downloadFullReportPdf', 'Download Full Report (PDF)') : 'Download Full Report (PDF)'}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <RenderMarkdownWithWidgets
                                                        content={displayContent}
                                                        visualData={msg.visualData}
                                                        defaultSymbol={msg.detected_pair || selectedPair}
                                                        isStreaming={Boolean(msg.isNewlyGenerated)}
                                                        onComplete={() => { msg.isNewlyGenerated = false; }}
                                                    />
                                                    {/* DOWNLOAD OPTION FOR STANDARD CHAT RESPONSES */}
                                                    {displayContent && (
                                                        <div className={styles.downloadReportRow} style={{ marginTop: 8 }}>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => exportAssistantMessageToPdf(enrichedMsg, selectedPair, e.currentTarget.closest('.' + styles.chatMessageBubble) || e.currentTarget.closest('.' + styles.analysisCenterCard))}
                                                                className={styles.downloadFullReportBtn}
                                                                style={{ padding: '6px 12px', fontSize: '11.5px', color: '#FFFFFF' }}
                                                            >
                                                                <DownloadIcon size={13} />
                                                                <span style={{ color: '#FFFFFF' }}>{t ? t('aiAssistant.downloadReportPdf', 'Download Report (PDF)') : 'Download Report (PDF)'}</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {/* 3. Disclaimer Footer if present on plain message */}
                                            {disclaimerFooter && (
                                                <div className={styles.visionOverviewCard} style={{ marginTop: 12, fontSize: '11.5px', fontStyle: 'italic' }}>
                                                    <div className={styles.chatMarkdown}>
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={bidiMarkdownComponents}>
                                                            {disclaimerFooter}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}

                                            {msg.response_format === "interactive_clarification" && (
                                                <ClarificationOptionButtons onSelect={handleOptionClick} />
                                            )}
                                        </>
                                    );
                                })()}

                            </div>
                        </div>
                    );
                })
            )}
            {/* When loading historical chat session: ONLY show clean loader dots */}
            {isLoadingChat && (
                <div className={styles.messageRow}>
                    <div className={styles.assistantMessage}>
                        <div className={styles.loadingDots}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            )}
            {/* When live generating new analysis: show loader dots with contextual status text */}
            {pendingRequest && (
                <div className={styles.messageRow}>
                    <div className={styles.assistantMessage}>
                        <div className={styles.analyzingStateWrapper}>
                            <div className={styles.loadingDots}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span className={styles.analyzingStatusText}>
                                {analyzingPhrases[phraseIndex]}
                            </span>
                            {queuedCount > 0 && (
                                <span className={styles.queueCountIndicator}>
                                    • {queuedCount} {t ? t('aiAssistant.inQueue', 'in queue') : 'in queue'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <InteractiveErrorModal
                isOpen={Boolean(selectedModalError)}
                onClose={() => setSelectedModalError(null)}
                error={selectedModalError}
                onRetry={handleRetryMessage}
                isRetrying={pendingRequest}
            />
            <div ref={chatEndRef} />
        </div>
    );
});

export default ChatMessageList;
