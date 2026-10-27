'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/components/toast';
import { fxApi } from '@/lib/api';
import { getStoredUserId } from '@/lib/authSession';
import { syncCreditsAfterAction, notifyCreditsUpdated } from '@/lib/credits';
import { historyDeletes } from '@/lib/historyDeletes';
import { ALL_PAIRS, normalizeSymbol } from '@/rendering/aiAssistant/TradingViewChartPane';
import { parseAssistantResponse, buildAssistantMessage } from '@/rendering/aiAssistant/utils/chatResponseParser';
import { categorizeChatError } from '@/components/interactiveError';

function extractChatId(raw) {
    if (!raw) return null;
    const envelope = raw?.data || raw;

    const findId = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        return (
            obj.session_id ||
            obj.sessionId ||
            obj.conversation_id ||
            obj.chat_id ||
            obj.chatId ||
            obj.id ||
            obj._id ||
            obj.question_id ||
            obj.history_id ||
            obj.uuid ||
            null
        );
    };

    let id = findId(raw) || findId(envelope);
    if (id) return id;

    const chats = (Array.isArray(envelope?.chats) && envelope.chats) || (Array.isArray(raw?.chats) && raw.chats) || null;
    if (chats && chats.length > 0) {
        id = findId(chats[chats.length - 1]) || findId(chats[0]);
        if (id) return id;
    }

    return null;
}

export function useCreateAiAssistantStore() {
    const [userId, setUserId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [selectedPair, setSelectedPair] = useState('XAU/USD');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [attachDropdownOpen, setAttachDropdownOpen] = useState(false);
    const [attachmentDraft, setAttachmentDraft] = useState(null);
    const [previewAttachment, setPreviewAttachment] = useState(null);

    const [loadingHistory, setLoadingHistory] = useState(false);
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [pendingRequest, setPendingRequest] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);

    const [activeAnalysisMode, setActiveAnalysisMode] = useState(null);
    const [chatWidthPercent, setChatWidthPercent] = useState(46);
    const [exportData, setExportData] = useState(null);

    // Queue state and references for sequential message handling
    const [queuedCount, setQueuedCount] = useState(0);
    const messageQueueRef = useRef([]);
    const isProcessingQueueRef = useRef(false);

    const activeRequestIdRef = useRef(null);
    const currentConversationIdRef = useRef(null);

    useEffect(() => {
        currentConversationIdRef.current = currentConversationId;
    }, [currentConversationId]);

    // Sync User ID
    useEffect(() => {
        const syncUserId = () => {
            const id = getStoredUserId();
            if (id) setUserId(id);
        };
        syncUserId();
        window.addEventListener('user:updated', syncUserId);
        return () => window.removeEventListener('user:updated', syncUserId);
    }, []);

    const fetchChatHistory = useCallback(async (uid) => {
        const activeUid = uid || userId || getStoredUserId();
        if (!activeUid) return [];
        setLoadingHistory(true);
        try {
            const data = await fxApi.getQuestionHistory(activeUid);
            let historyList = Array.isArray(data) ? data : (data?.data || data?.questions || []);
            historyList = historyList.filter(item => item?.is_delete !== true);
            setChatHistory(historyList);
            return historyList;
        } catch (err) {
            console.warn('Could not fetch chat history:', err.message);
            setChatHistory([]);
            return [];
        } finally {
            setLoadingHistory(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchChatHistory(userId);
        }
    }, [userId, fetchChatHistory]);

    const handleCreateNew = useCallback(() => {
        activeRequestIdRef.current = null;
        messageQueueRef.current = [];
        isProcessingQueueRef.current = false;
        setQueuedCount(0);
        setIsLoadingChat(false);
        setPendingRequest(false);
        setHistoryModalOpen(false);
        setSelectedChat(null);
        setCurrentConversationId(null);
        currentConversationIdRef.current = null;
        setChatMessages([]);
        setChatInput('');
        setActiveAnalysisMode(null);
        setAttachmentDraft(null);
        setPreviewAttachment(null);
        setChatWidthPercent(35);
        if (typeof window !== 'undefined' && window.history?.replaceState) {
            const url = new URL(window.location.href);
            url.searchParams.delete('open');
            window.history.replaceState({}, '', url.toString());
        }
        [100, 200, 300, 400].forEach((ms) => {
            setTimeout(() => window.dispatchEvent(new Event('resize')), ms);
        });
    }, []);

    const handleSelectChat = useCallback(async (item) => {
        messageQueueRef.current = [];
        isProcessingQueueRef.current = false;
        setQueuedCount(0);
        const convId = extractChatId(item);
        setHistoryModalOpen(false);
        setSelectedChat(item);
        setCurrentConversationId(convId || null);
        currentConversationIdRef.current = convId || null;
        setChatWidthPercent(60);
        [100, 200, 300, 400].forEach((ms) => {
            setTimeout(() => window.dispatchEvent(new Event('resize')), ms);
        });

        const fallbackFromItem = () => {
            const loaded = [];
            let latestPair = item?.pair || item?.detected_pair || null;

            if (Array.isArray(item?.chats) && item.chats.length > 0) {
                item.chats.forEach((c) => {
                    const q = c.question || c.message || c.input_data || c.prompt;
                    const a = c.response || c.answer || c.output_data || c.output || c.result;
                    const p = c.pair || c.detected_pair || latestPair;
                    if (p) latestPair = p;
                    if (q) loaded.push({ role: 'user', content: q, pair: p || null });
                    if (a) {
                        let res = a;
                        if (typeof res === 'string') { try { res = JSON.parse(res); } catch {} }
                        loaded.push(buildAssistantMessage(parseAssistantResponse(res)));
                    }
                });
            } else if (Array.isArray(item?.messages) && item.messages.length > 0) {
                item.messages.forEach((m) => {
                    const q = m.question || m.message || (m.role === 'user' ? (m.content || m.text) : null);
                    const a = m.answer || m.response || (m.role === 'assistant' ? (m.answer || m.content || m.text) : null);
                    const p = m.pair || m.detected_pair || latestPair;
                    if (p) latestPair = p;
                    if (q) loaded.push({ role: 'user', content: q, pair: p || null });
                    if (a) {
                        let res = a;
                        if (typeof res === 'string') { try { res = JSON.parse(res); } catch {} }
                        loaded.push(buildAssistantMessage(parseAssistantResponse(res)));
                    }
                });
            }

            if (loaded.length === 0) {
                const question = item.question || item.message || item.first_question || item.input_data || item.input || item.prompt || item.title || item.name || '';
                const rawResponse = item.response || item.answer || item.output_data || item.output || item.result || item.full_report || item.ai_response || item.data || item.text || item.description || null;

                if (question) {
                    loaded.push({ role: 'user', content: question, pair: latestPair || null });
                }
                if (rawResponse) {
                    let resolved = rawResponse;
                    if (typeof resolved === 'string') {
                        try { resolved = JSON.parse(resolved); } catch {}
                    }
                    loaded.push(buildAssistantMessage(parseAssistantResponse(resolved)));
                } else if (question) {
                    loaded.push({ role: 'assistant', content: 'Historical analysis data loaded.' });
                }
            }

            if (loaded.length > 0) {
                setChatMessages(loaded);
            }
            if (latestPair && ALL_PAIRS.includes(latestPair)) {
                setSelectedPair(latestPair);
            }
        };

        if (convId) {
            setIsLoadingChat(true);
            try {
                const res = await fxApi.getConversationHistory(convId);
                const fullData = res?.data || res;
                const rawMessages = fullData?.messages || fullData?.chats || fullData?.history || fullData?.conversation || fullData?.items || (Array.isArray(fullData?.data) ? fullData.data : (Array.isArray(fullData) ? fullData : []));

                const loadedMessages = [];
                let latestPair = item?.pair || item?.detected_pair || null;

                if (Array.isArray(rawMessages) && rawMessages.length > 0) {
                    rawMessages.forEach((m) => {
                        const userText = m.question || m.message || m.input_data || m.input || m.prompt || m.first_question || m.user_query || (m.role === 'user' ? (m.content || m.text) : null);
                        const ans = m.answer || m.response || m.output_data || m.output || m.result || m.full_report || m.ai_response || (m.role === 'assistant' ? (m.answer || m.content || m.text || m.response) : null);
                        const p = m.pair || m.detected_pair || latestPair;
                        if (p) latestPair = p;

                        if (userText) {
                            loadedMessages.push({
                                role: 'user',
                                content: userText,
                                pair: p || null,
                                timeframe: m.timeframe || null
                            });
                        }

                        if (ans) {
                            let resolved = ans;
                            if (typeof resolved === 'string') {
                                try { resolved = JSON.parse(resolved); } catch {}
                            }
                            const parsed = parseAssistantResponse(resolved);
                            loadedMessages.push(buildAssistantMessage(parsed));
                        } else if (m.role === 'assistant' && (m.content || m.text)) {
                            loadedMessages.push({
                                role: 'assistant',
                                content: m.content || m.text
                            });
                        }
                    });
                }

                if (loadedMessages.length > 0) {
                    setChatMessages(loadedMessages);
                    if (latestPair && ALL_PAIRS.includes(latestPair)) {
                        setSelectedPair(latestPair);
                    }
                } else {
                    fallbackFromItem();
                }
            } catch (err) {
                console.error('Failed to load conversation history:', err);
                fallbackFromItem();
            } finally {
                setIsLoadingChat(false);
            }
        } else {
            fallbackFromItem();
        }
    }, []);

    const processQueue = useCallback(async () => {
        if (isProcessingQueueRef.current) return;
        if (!messageQueueRef.current || messageQueueRef.current.length === 0) {
            setPendingRequest(false);
            setQueuedCount(0);
            return;
        }

        isProcessingQueueRef.current = true;
        setPendingRequest(true);

        const nextItem = messageQueueRef.current.shift();
        setQueuedCount(messageQueueRef.current.length);

        // Update message status in chatMessages from 'queued' to 'active'
        setChatMessages(prev =>
            prev.map(msg =>
                msg.id === nextItem.msgId ? { ...msg, status: 'active' } : msg
            )
        );

        const requestId = Date.now();
        activeRequestIdRef.current = requestId;

        try {
            const activeUid = userId || getStoredUserId();
            const activeConvId = currentConversationIdRef.current || currentConversationId;
            const chatPayload = {
                message: nextItem.userMsgText,
                ...(nextItem.cleanPair ? { pair: nextItem.cleanPair, timeframe: '15m' } : {}),
                image_base64: nextItem.activeAttachment?.url || null,
                stream: false,
                ...(activeUid ? { user_id: activeUid } : {}),
                ...(activeConvId ? { id: activeConvId } : {})
            };

            const rawResp = await fxApi.chat(chatPayload);

            setChatMessages(prev =>
                prev.map(msg =>
                    msg.id === nextItem.msgId ? { ...msg, status: 'delivered' } : msg
                )
            );

            const parsed = parseAssistantResponse(rawResp);
            const assistantMsg = buildAssistantMessage(parsed);
            setChatMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content && assistantMsg.content && lastMsg.content.trim() === assistantMsg.content.trim()) {
                    return prev;
                }
                return [...prev, {
                    ...assistantMsg,
                    pair: nextItem.cleanPair || assistantMsg.detected_pair || selectedPair,
                    user_prompt: nextItem.userMsgText,
                    isNewlyGenerated: true
                }];
            });

            // Capture chat id from first message response to use for subsequent messages
            const newChatId = extractChatId(rawResp);
            if (newChatId) {
                currentConversationIdRef.current = newChatId;
                setCurrentConversationId(newChatId);
            }

            if (activeUid) {
                syncCreditsAfterAction(activeUid);
                notifyCreditsUpdated();
                fetchChatHistory(activeUid).then((updatedList) => {
                    if (!currentConversationIdRef.current && Array.isArray(updatedList) && updatedList.length > 0) {
                        const topId = extractChatId(updatedList[0]);
                        if (topId) {
                            currentConversationIdRef.current = topId;
                            setCurrentConversationId(topId);
                        }
                    }
                }).catch(() => {});
            }
        } catch (err) {
            console.error('AI Assistant request error:', err);
            const errorDetail = categorizeChatError(err, err?.status || 0);
            setChatMessages(prev => [
                ...prev,
                {
                    id: 'err_' + Date.now(),
                    role: 'error',
                    isError: true,
                    ...errorDetail,
                    rawError: err?.message || 'Failed to fetch',
                    user_prompt: nextItem.userMsgText,
                    retryPayload: {
                        userMsgText: nextItem.userMsgText,
                        cleanPair: nextItem.cleanPair,
                        activeAttachment: nextItem.activeAttachment,
                        customMode: nextItem.customMode
                    }
                }
            ]);
            toast.error(errorDetail?.message || 'AI request failed');
        } finally {
            isProcessingQueueRef.current = false;
            if (messageQueueRef.current && messageQueueRef.current.length > 0) {
                setTimeout(() => {
                    processQueue();
                }, 80);
            } else {
                setPendingRequest(false);
                setQueuedCount(0);
            }
        }
    }, [userId, currentConversationId, fetchChatHistory]);

    const handleSendChatMessage = useCallback(async (customText, customAttachment, customMode) => {
        const text = (customText !== undefined ? customText : chatInput).trim();
        const activeAttachment = customAttachment !== undefined ? customAttachment : attachmentDraft;
        const currentMode = customMode !== undefined ? customMode : activeAnalysisMode;

        if (!text && !activeAttachment && !currentMode) return;

        const isNoPair = !selectedPair || selectedPair === 'No Pair' || selectedPair === 'NO_PAIR' || String(selectedPair).toLowerCase().includes('no pair') || String(selectedPair).toLowerCase() === 'none';
        const cleanPair = isNoPair ? null : (normalizeSymbol(selectedPair) || null);
        const sym = cleanPair || 'the market';

        let userMsgText = text;
        if (!userMsgText) {
            if (currentMode === 'deep') {
                userMsgText = `Perform a Deep Pro Analysis for ${sym} including multi-timeframe market structure, pivot points, key indicators, macro drivers, and complete risk-reward trade setup`;
            } else if (currentMode === 'news') {
                userMsgText = `Show latest financial news, market sentiment, and central bank stance for ${sym}`;
            } else if (currentMode === 'image') {
                userMsgText = `Analyze this chart screenshot and identify technical patterns, key levels & breakouts for ${sym}`;
            } else {
                userMsgText = `Analyze chart setup and market outlook for ${sym}`;
            }
        } else {
            if (currentMode === 'deep' && !userMsgText.toLowerCase().includes('deep')) {
                userMsgText = `[Deep Market Analysis for ${sym}] ${userMsgText}`;
            } else if (currentMode === 'news' && !userMsgText.toLowerCase().includes('news') && !userMsgText.toLowerCase().includes('macro')) {
                userMsgText = `[Macro News & Events for ${sym}] ${userMsgText}`;
            }
        }

        const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const isCurrentlyBusy = pendingRequest || isProcessingQueueRef.current;

        const newUserMsg = {
            id: msgId,
            role: 'user',
            content: userMsgText,
            pair: cleanPair,
            attachment: activeAttachment ? { ...activeAttachment } : null,
            status: isCurrentlyBusy ? 'queued' : 'active'
        };

        setChatMessages(prev => [...prev, newUserMsg]);
        setChatInput('');
        setAttachmentDraft(null);
        setActiveAnalysisMode(null);

        const queueItem = {
            msgId,
            userMsgText,
            cleanPair,
            activeAttachment: activeAttachment ? { ...activeAttachment } : null,
            currentMode
        };

        messageQueueRef.current.push(queueItem);
        setQueuedCount(messageQueueRef.current.length);

        if (!isCurrentlyBusy) {
            processQueue();
        }
    }, [chatInput, attachmentDraft, activeAnalysisMode, selectedPair, pendingRequest, processQueue]);

    const handleConfirmDelete = useCallback(async () => {
        if (!pendingDeleteItem) return;
        const convId = pendingDeleteItem.id || pendingDeleteItem.conversation_id || pendingDeleteItem.history_id || pendingDeleteItem._id || pendingDeleteItem.question_id || pendingDeleteItem.uuid;
        const activeUid = userId || getStoredUserId();

        if (convId && activeUid) {
            try {
                await historyDeletes.deleteAiAssistantItem({ userId: activeUid, conversationId: convId });
                setChatHistory(prev => prev.filter(c => {
                    const cId = c.id || c.conversation_id || c.history_id || c._id || c.question_id || c.uuid;
                    return cId !== convId;
                }));
                if (currentConversationId === convId) {
                    handleCreateNew();
                }
                setConfirmDeleteOpen(false);
                setPendingDeleteItem(null);
                toast.success('History item deleted');
            } catch (err) {
                console.error('Failed to delete history item:', err);
                toast.error('Failed to delete history item');
            }
        }
    }, [pendingDeleteItem, userId, currentConversationId, handleCreateNew]);

    const handleRetryMessage = useCallback((retryPayload) => {
        if (!retryPayload) return;
        setChatMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && (last.role === 'error' || last.isError)) {
                return prev.slice(0, -1);
            }
            return prev;
        });
        handleSendChatMessage(
            retryPayload.userMsgText,
            retryPayload.activeAttachment,
            retryPayload.customMode
        );
    }, [handleSendChatMessage]);

    return {
        userId,
        setUserId,
        chatHistory,
        setChatHistory,
        selectedChat,
        setSelectedChat,
        currentConversationId,
        setCurrentConversationId,
        chatMessages,
        setChatMessages,
        chatInput,
        setChatInput,
        selectedPair,
        setSelectedPair,
        dropdownOpen,
        setDropdownOpen,
        attachDropdownOpen,
        setAttachDropdownOpen,
        attachmentDraft,
        setAttachmentDraft,
        previewAttachment,
        setPreviewAttachment,
        loadingHistory,
        setLoadingHistory,
        isLoadingChat,
        setIsLoadingChat,
        pendingRequest,
        setPendingRequest,
        queuedCount,
        confirmDeleteOpen,
        setConfirmDeleteOpen,
        pendingDeleteItem,
        setPendingDeleteItem,
        historyModalOpen,
        setHistoryModalOpen,
        activeAnalysisMode,
        setActiveAnalysisMode,
        chatWidthPercent,
        setChatWidthPercent,
        exportData,
        setExportData,
        fetchChatHistory,
        handleCreateNew,
        handleSelectChat,
        handleSendChatMessage,
        handleRetryMessage,
        handleConfirmDelete
    };
}
