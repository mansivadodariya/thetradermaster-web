'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { interactiveCopilotApi, getInteractiveApiBase, categorizeChatError } from '../utils/strategyApi';
import { notifyCreditsUpdated, openCreditsModal } from '@/lib/credits';

const generateSessionId = () =>
    'sess_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export default function useStrategyCopilot() {
    const [sessionId, setSessionId] = useState(generateSessionId);
    const [metadata, setMetadata] = useState(null);
    const [indIndex, setIndIndex] = useState({});
    const [resp, setResp] = useState(null);
    const [messages, setMessages] = useState([]);
    const [mode, setMode] = useState('view'); // 'view' | 'edit'
    const [editDraft, setEditDraft] = useState(null);
    const [formErrors, setFormErrors] = useState([]);
    const [result, setResult] = useState(null);
    const [busy, setBusy] = useState(false);
    const [apiBase, setApiBase] = useState('');
    const [bootError, setBootError] = useState(null);

    const isInitializedRef = useRef(false);

    // Initialize apiBase on mount
    useEffect(() => {
        setApiBase(getInteractiveApiBase());
    }, []);

    // Apply Copilot Response to state and chat messages
    const applyResponse = useCallback((r, withMessage = true) => {
        setResp(r);
        const replyText = r?.reply || r?.text || r?.message || '';
        const rawButtons =
            (Array.isArray(r?.cta_buttons) && r.cta_buttons.length > 0)
                ? r.cta_buttons
                : (Array.isArray(r?.options) && r.options.length > 0)
                    ? r.options
                    : (Array.isArray(r?.buttons) && r.buttons.length > 0)
                        ? r.buttons
                        : (Array.isArray(r?.ctaButtons) && r.ctaButtons.length > 0)
                            ? r.ctaButtons
                            : [];

        if (withMessage && (replyText || rawButtons.length > 0)) {
            setMessages((prev) => [
                ...prev,
                {
                    id: 'ai_' + Date.now() + Math.random(),
                    role: 'ai',
                    text: replyText,
                    cta_buttons: rawButtons,
                    options: rawButtons,
                    buttons: rawButtons,
                    ...(typeof r === 'object' ? r : {})
                },
            ]);
        }
    }, []);

    // Core Chat invocation
    const chat = useCallback(
        async (payload, userText, sid = sessionId, extra = {}) => {
            if (busy) return;
            if (userText) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: 'usr_' + Date.now() + Math.random(),
                        role: 'user',
                        text: userText,
                        ...extra
                    },
                ]);
            }
            setBusy(true);

            try {
                const { ok, status, body } = await interactiveCopilotApi.chat({
                    session_id: sid,
                    ...payload,
                });

                setBusy(false);

                if (!ok || !body?.success) {
                    const errorDetail = categorizeChatError(body, status);
                    if (errorDetail?.errorType === 'credits') {
                        notifyCreditsUpdated(0);
                        setTimeout(() => openCreditsModal(), 400);
                    }
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: 'err_' + Date.now(),
                            role: 'error',
                            ...errorDetail,
                            retryPayload: { payload, userText, sid, extra }
                        },
                    ]);
                    return;
                }

                // If backend returned a new or normalized session_id
                if (body.session_id && body.session_id !== sid) {
                    setSessionId(body.session_id);
                }

                // Merge body and body.data to ensure cta_buttons / options are never missed
                const combinedData = {
                    ...(typeof body === 'object' ? body : {}),
                    ...(typeof body?.data === 'object' ? body.data : {})
                };

                const buttons =
                    (Array.isArray(combinedData.cta_buttons) && combinedData.cta_buttons.length > 0)
                        ? combinedData.cta_buttons
                        : (Array.isArray(combinedData.options) && combinedData.options.length > 0)
                            ? combinedData.options
                            : (Array.isArray(body?.cta_buttons) && body.cta_buttons.length > 0)
                                ? body.cta_buttons
                                : (Array.isArray(body?.data?.cta_buttons) && body.data.cta_buttons.length > 0)
                                    ? body.data.cta_buttons
                                    : (Array.isArray(body?.options) && body.options.length > 0)
                                        ? body.options
                                        : (Array.isArray(body?.data?.options) && body.data.options.length > 0)
                                            ? body.data.options
                                            : [];

                combinedData.cta_buttons = buttons;
                combinedData.options = buttons;
                combinedData.buttons = buttons;

                applyResponse(combinedData, true);
            } catch (err) {
                setBusy(false);
                const errorDetail = categorizeChatError(err.message, 0);
                if (errorDetail?.errorType === 'credits') {
                    notifyCreditsUpdated(0);
                    setTimeout(() => openCreditsModal(), 400);
                }
                setMessages((prev) => [
                    ...prev,
                    {
                        id: 'err_' + Date.now(),
                        role: 'error',
                        ...errorDetail,
                        retryPayload: { payload, userText, sid, extra }
                    },
                ]);
            }
        },
        [busy, sessionId, applyResponse]
    );

    // Retry a failed message seamlessly
    const retryMessage = useCallback(
        (retryPayload) => {
            if (!retryPayload || busy) return;
            const { payload, sid, extra } = retryPayload;
            // Remove previous error bubble
            setMessages((prev) => prev.filter((m) => m.role !== 'error'));
            chat(payload, null, sid || sessionId, extra);
        },
        [busy, chat, sessionId]
    );

    // Send a message typed by user or clicked via CTA
    const sendMessage = useCallback(
        (text, extra = {}) => {
            const trimmed = (text || '').trim();
            if (!trimmed || busy) return;
            chat({ message: trimmed, ...extra }, trimmed, sessionId, extra);
        },
        [busy, chat, sessionId]
    );

    // Boot fresh session (resets to initial clean state)
    const boot = useCallback(async (shouldStartChat = false) => {
        const nextSid = generateSessionId();
        setSessionId(nextSid);
        setResp(null);
        setResult(null);
        setMode('view');
        setFormErrors([]);
        setMessages([]);
        setBootError(null);
        setBusy(true);

        try {
            const metaRes = await interactiveCopilotApi.getMetadata();
            let m = null;
            if (metaRes.ok && metaRes.body?.success) {
                m = metaRes.body;
            } else {
                console.warn('[useStrategyCopilot] Metadata fetch unsuccessful, using local fallback catalog.');
            }

            const rawData = m || {};
            // API may return indicator_groups at top level or nested under .data
            const metaData = {
                ...rawData,
                pairs: rawData.pairs || rawData.data?.pairs || [],
                timeframes: rawData.timeframes || rawData.data?.timeframes || [],
                directions: rawData.directions || rawData.data?.directions || [],
                exit_value_types: rawData.exit_value_types || rawData.data?.exit_value_types || [],
                condition_types: rawData.condition_types || rawData.data?.condition_types || [],
                operators: rawData.operators || rawData.data?.operators || [],
                indicator_groups: rawData.indicator_groups || rawData.data?.indicator_groups || [],
            };
            setMetadata(metaData);

            // Build indicator index
            const index = {};
            (metaData.indicator_groups || []).forEach((g) => {
                (g.indicators || []).forEach((ind) => {
                    index[ind.name] = ind;
                });
            });
            setIndIndex(index);
            setBusy(false);

            // Only trigger starting chat if explicitly requested
            if (shouldStartChat) {
                await chat({ action: 'start' }, null, nextSid);
            }
        } catch (err) {
            setBootError(err.message);
            setBusy(false);
        }
    }, [chat]);

    // Initial boot on mount: loads metadata in background, leaves messages empty for explore screen
    useEffect(() => {
        if (!isInitializedRef.current) {
            isInitializedRef.current = true;
            boot(false);
        }
    }, [boot]);

    // Save manual modifications from form
    const saveDraft = useCallback(
        async (strategyData) => {
            setBusy(true);
            try {
                const { ok, body } = await interactiveCopilotApi.modify({
                    sessionId,
                    strategy: strategyData,
                });
                setBusy(false);

                if (ok && body?.success) {
                    setMode('view');
                    setFormErrors([]);
                    applyResponse(body.data, false);
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: 'sys_' + Date.now(),
                            role: 'sys',
                            text: 'Strategy updated and saved from the form.',
                        },
                    ]);
                    return { success: true };
                } else {
                    const errs =
                        body?.errors ||
                        body?.data?.errors ||
                        [body?.error || body?.message || 'Failed to save strategy changes'];
                    setFormErrors(Array.isArray(errs) ? errs : [String(errs)]);
                    return { success: false, errors: errs };
                }
            } catch (err) {
                setBusy(false);
                const errs = [err.message || 'Network error saving strategy'];
                setFormErrors(errs);
                return { success: false, errors: errs };
            }
        },
        [sessionId, applyResponse]
    );

    // Run Backtest
    const runBacktest = useCallback(
        async ({ includePlot = true, strategy: customStrat, strategy_json: customJson, strategy_id: customStratId, strategyId, userId } = {}) => {
            setBusy(true);
            try {
                const stratToRun = customJson || customStrat || resp?.strategy || {};
                const effectiveStratId = customStratId || strategyId || stratToRun?.strategy_id || stratToRun?.id || resp?.strategy_id || resp?.id;
                const { ok, body } = await interactiveCopilotApi.run({
                    sessionId,
                    strategy_id: effectiveStratId,
                    includePlot,
                    strategy: stratToRun,
                    strategy_json: stratToRun,
                    userId,
                });
                setBusy(false);
                setResult(body);

                if (ok && body?.success) {
                    const total = body.total_trades ?? 0;
                    const winRate = Number(body.win_rate ?? 0).toFixed(2);
                    const pnl = Number(body.pnl ?? 0).toFixed(2);
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: 'sys_' + Date.now(),
                            role: 'sys',
                            text: `Backtest finished: ${total} trades, win rate ${winRate}%, PnL $${pnl}.`,
                        },
                    ]);
                } else {
                    const errMsg = body?.error || body?.message || 'Backtest execution failed';
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: 'sys_' + Date.now(),
                            role: 'sys',
                            text: `Backtest error: ${errMsg}`,
                        },
                    ]);
                }
                return { ok, body };
            } catch (err) {
                setBusy(false);
                setResult({ success: false, error: err.message });
                setMessages((prev) => [
                    ...prev,
                    {
                        id: 'sys_' + Date.now(),
                        role: 'sys',
                        text: `Backtest network error: ${err.message}`,
                    },
                ]);
                return { ok: false, error: err.message };
            }
        },
        [sessionId, resp]
    );

    const handleUpdateApiBase = useCallback(
        (newBase) => {
            const clean = (newBase || '').trim().replace(/\/+$/, '');
            if (typeof window !== 'undefined') {
                localStorage.setItem('copilot_api', clean);
            }
            setApiBase(clean);
            boot();
        },
        [boot]
    );

    const [historyList, setHistoryList] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Load user chat sessions from /interactive-sessions
    const loadHistoryList = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const { ok, body } = await interactiveCopilotApi.getSessions();
            if (ok && body) {
                const sessions = Array.isArray(body.data) ? body.data : (Array.isArray(body) ? body : []);
                setHistoryList(sessions);
            }
        } catch (err) {
            console.warn('[useStrategyCopilot] loadHistoryList error:', err);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    // Load past session messages and strategy state from /interactive-sessions?session_id=...
    const loadSession = useCallback(async (sid) => {
        if (!sid) return;
        setBusy(true);
        try {
            const { ok, body } = await interactiveCopilotApi.getSessionState(sid);
            setBusy(false);
            if (ok && body) {
                setSessionId(sid);
                const sData = body.data || body;
                setResp(sData);

                const rawMsgs = sData.messages || sData.history || body.messages || body.history || [];
                let normalized = [];
                if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
                    normalized = rawMsgs.map((m, idx) => {
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
                            fromHistory: true,
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
                        fromHistory: true,
                    });
                }

                setMessages(normalized);
                if (sData.draft || sData.strategy) {
                    setEditDraft(sData.draft || sData.strategy);
                }
            }
        } catch (err) {
            setBusy(false);
            console.warn('[useStrategyCopilot] loadSession error:', err);
        }
    }, []);

    // Start a fresh new chat session
    const newChat = useCallback(() => {
        setSessionId(generateSessionId());
        setMessages([]);
        setResp(null);
        setResult(null);
        setEditDraft(null);
    }, []);

    return {
        sessionId,
        metadata,
        indIndex,
        resp,
        messages,
        mode,
        setMode,
        editDraft,
        setEditDraft,
        formErrors,
        setFormErrors,
        result,
        busy,
        apiBase,
        bootError,
        boot,
        sendMessage,
        retryMessage,
        saveDraft,
        runBacktest,
        handleUpdateApiBase,
        historyList,
        setHistoryList,
        historyLoading,
        loadHistoryList,
        loadSession,
        newChat,
    };
}
