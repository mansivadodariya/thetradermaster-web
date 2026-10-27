'use client';

import { useState, useEffect, useCallback } from 'react';
import { strategyStudioApi, interactiveCopilotApi } from '../utils/strategyApi';
import { getStoredUserId } from '@/lib/authSession';
import { toast } from '@/components/toast';

export default function useStrategyChatHistory({ setMessages, setCurrentDraft, setCurrentStrategy }) {
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [historyList, setHistoryList] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);

    /**
     * Action 3: Load Sidebar History List
     * GET /backtest/v1/interactive-sessions?user_id={user_id}
     */
    const loadHistoryList = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const { ok, body } = await interactiveCopilotApi.getSessions();
            if (ok && body && Array.isArray(body.data)) {
                setHistoryList(body.data);
            } else {
                const userId = getStoredUserId();
                if (userId) {
                    const res = await strategyStudioApi.getChatSessions(userId, 30);
                    if (res && (res.status === 'success' || Array.isArray(res.data))) {
                        const sessions = Array.isArray(res.data) ? res.data : (res.data?.sessions || []);
                        setHistoryList(sessions);
                    }
                }
            }
        } catch (err) {
            console.warn('[useStrategyChatHistory] loadHistoryList error:', err);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistoryList();
    }, [loadHistoryList]);

    /**
     * Action 1: When User Clicks "+ New Chat"
     */
    const handleNewChat = useCallback(() => {
        setCurrentSessionId(null);
        if (setMessages) setMessages([]);
        if (setCurrentDraft) setCurrentDraft(null);
        if (setCurrentStrategy) setCurrentStrategy(null);
        setIsHistoryOpen(false);
    }, [setMessages, setCurrentDraft, setCurrentStrategy]);

    /**
     * Action 4: When User Clicks a Chat in History
     * GET /backtest/v1/interactive-sessions?session_id={sessionId}
     */
    const handleSelectHistorySession = useCallback(async (sessionId) => {
        if (!sessionId) return;
        setCurrentSessionId(sessionId);
        setIsHistoryOpen(false);

        // Instantly mark current messages as fromHistory so any active stream stops immediately
        if (setMessages) {
            setMessages((prev) => (Array.isArray(prev) ? prev.map((m) => ({ ...m, fromHistory: true })) : []));
        }

        try {
            const { ok, body } = await interactiveCopilotApi.getSessionState(sessionId);
            if (ok && body) {
                const sData = body.data || body;
                const rawMessages = sData.messages || sData.history || body.messages || body.history || [];
                let normalized = [];
                if (Array.isArray(rawMessages) && rawMessages.length > 0) {
                    normalized = rawMessages.map((m, idx) => {
                        const rawText = typeof m.content === 'string'
                            ? m.content
                            : (m.text || m.message || m.reply || (m.content ? JSON.stringify(m.content) : ''));
                        const rawButtons = m.cta_buttons || m.options || m.buttons || [];
                        return {
                            id: m.id || `hist_${idx}_${Date.now()}`,
                            role: (m.role === 'user' || m.role === 'human') ? 'user' : 'ai',
                            text: rawText,
                            cta_buttons: Array.isArray(rawButtons) ? rawButtons : [],
                            options: Array.isArray(rawButtons) ? rawButtons : [],
                            buttons: Array.isArray(rawButtons) ? rawButtons : [],
                            fromHistory: true
                        };
                    });
                } else if (sData.reply || body.reply) {
                    const rawButtons = sData.cta_buttons || sData.options || body.cta_buttons || body.options || [];
                    normalized.push({
                        id: `hist_0_${Date.now()}`,
                        role: 'ai',
                        text: sData.reply || body.reply,
                        cta_buttons: Array.isArray(rawButtons) ? rawButtons : [],
                        options: Array.isArray(rawButtons) ? rawButtons : [],
                        buttons: Array.isArray(rawButtons) ? rawButtons : [],
                        fromHistory: true
                    });
                }

                if (setMessages) setMessages(normalized);
                if (setCurrentDraft && (sData.draft || sData.strategy)) {
                    setCurrentDraft(sData.draft || sData.strategy);
                }
                if (setCurrentStrategy && sData.strategy) {
                    setCurrentStrategy(sData.strategy);
                }
                return;
            }

            const userId = getStoredUserId();
            if (userId) {
                const res = await strategyStudioApi.getSessionMessages(userId, sessionId);
                if (res && (res.status === 'success' || res.data || Array.isArray(res))) {
                    let rawMessages = [];
                    let sessionData = {};

                    if (Array.isArray(res)) {
                        rawMessages = res;
                    } else if (Array.isArray(res.data)) {
                        rawMessages = res.data;
                    } else if (res.data && typeof res.data === 'object') {
                        sessionData = res.data;
                        rawMessages = sessionData.messages || sessionData.chat_history || sessionData.history || [];
                    } else if (Array.isArray(res.messages)) {
                        rawMessages = res.messages;
                    } else if (Array.isArray(res.chat_history)) {
                        rawMessages = res.chat_history;
                    }

                    if (Array.isArray(rawMessages) && rawMessages.length > 0) {
                        const normalized = rawMessages.map((m) => {
                            const rawText = typeof m.content === 'string'
                                ? m.content
                                : (m.text || m.message || m.reply || (m.content ? JSON.stringify(m.content) : ''));
                            return {
                                role: (m.role === 'user' || m.role === 'human') ? 'user' : 'ai',
                                text: rawText,
                                draft: m.draft || null,
                                qaList: m.answers || m.qaList || null,
                                fromHistory: true
                            };
                        });
                        if (setMessages) setMessages(normalized);
                    }

                    if (sessionData.draft && setCurrentDraft) {
                        setCurrentDraft(sessionData.draft);
                    }
                    if (sessionData.strategy && setCurrentStrategy) {
                        setCurrentStrategy(sessionData.strategy);
                    }
                }
            }
        } catch (err) {
            console.warn('[useStrategyChatHistory] handleSelectHistorySession error:', err);
            toast.error('Failed to load chat history session.');
        }
    }, [setMessages, setCurrentDraft, setCurrentStrategy]);

    /**
     * Action 5: Delete a Chat Session
     * DELETE /backtest/v1/wizard/chat-sessions/{user_id}/{sessionId}
     */
    const handleDeleteSession = useCallback(async (sessionId, e) => {
        if (e) e.stopPropagation();
        const userId = getStoredUserId();
        if (!userId || !sessionId) return;

        try {
            await strategyStudioApi.deleteChatSession(userId, sessionId);
            // If deleted active session, reset chat window
            if (currentSessionId === sessionId) {
                handleNewChat();
            }
            // Refresh history list
            loadHistoryList();
            toast.success('Chat session deleted.');
        } catch (err) {
            console.warn('[useStrategyChatHistory] handleDeleteSession error:', err);
            toast.error('Failed to delete chat session.');
        }
    }, [currentSessionId, handleNewChat, loadHistoryList]);

    return {
        currentSessionId,
        setCurrentSessionId,
        historyList,
        isHistoryOpen,
        setIsHistoryOpen,
        historyLoading,
        loadHistoryList,
        handleNewChat,
        handleSelectHistorySession,
        handleDeleteSession
    };
}
