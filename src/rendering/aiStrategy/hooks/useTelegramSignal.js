'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    fetchTelegramConfig,
    fetchTelegramStatus,
    toggleNotifyMe,
    generateConnectToken,
    disconnectTelegram,
} from '@/services/telegramSignalService';

import { supabase } from '@/lib/supabaseClient';

/**
 * useTelegramSignal
 *
 * Central hook that manages:
 *  - Global Telegram bot config (enabled, bot_username, dynamic channel_url)
 *  - User connection status + subscribed symbols
 *  - Per-symbol toggle action (with auto-open-modal when not connected)
 *  - Connect modal state (deep_link, OTP, polling while waiting for bot /start)
 */
export function useTelegramSignal() {
    // ── Config ────────────────────────────────────────────────────────────────
    const [config, setConfig] = useState({
        enabled: true,
        bot_username: 'TraderMasterSignalBot',
        channel_url: 'https://t.me/TraderMaster_Signals'
    });

    // ── User Status ───────────────────────────────────────────────────────────
    const [status, setStatus] = useState({
        is_connected: false,
        telegram_chat_id: null,
        telegram_username: null,
        auth_method: null,
        subscribed_symbols: [],
        subscribed_strategies: [],
    });
    const [statusLoading, setStatusLoading] = useState(true);

    // ── Per-symbol loading set ─────────────────────────────────────────────────
    const [togglingSymbols, setTogglingSymbols] = useState(new Set());

    // ── Connect Modal ─────────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null); // { token, otp_code, deep_link, pending_symbol, pending_strategy_id, expires_in_seconds }
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState('');

    // Context symbol/strategy that triggered the modal open
    const pendingRef = useRef({ symbol: '', strategy_id: '' });

    // Polling interval ref (used while modal is open)
    const pollRef = useRef(null);

    // ── Load dynamic config and listen to Supabase updates ────────────────────
    useEffect(() => {
        let isMounted = true;
        const loadConfig = async () => {
            const cfg = await fetchTelegramConfig();
            if (isMounted && cfg) {
                setConfig(cfg);
            }
        };

        loadConfig();

        let channel = null;
        if (supabase) {
            try {
                channel = supabase
                    .channel('public:notify_me_telegram_config')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'social_links' },
                        () => {
                            loadConfig();
                        }
                    )
                    .subscribe();
            } catch (_) {}
        }

        return () => {
            isMounted = false;
            if (channel && supabase) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    // ── Load status on mount ──────────────────────────────────────────────────
    const refreshStatus = useCallback(async () => {
        setStatusLoading(true);
        const s = await fetchTelegramStatus();
        setStatus(s);
        setStatusLoading(false);
        return s;
    }, []);

    useEffect(() => {
        refreshStatus();
    }, [refreshStatus]);

    // ── Poll while modal is open (every 3 s) ──────────────────────────────────
    useEffect(() => {
        if (!modalOpen) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            return;
        }

        pollRef.current = setInterval(async () => {
            const s = await fetchTelegramStatus();
            setStatus(s);
            if (s.is_connected) {
                clearInterval(pollRef.current);
                pollRef.current = null;
                setModalOpen(false);
                setModalData(null);
            }
        }, 3000);

        return () => {
            clearInterval(pollRef.current);
            pollRef.current = null;
        };
    }, [modalOpen]);

    // ── Open modal: generate deep-link token ─────────────────────────────────
    const openConnectModal = useCallback(async (symbol = '', strategy_id = '') => {
        pendingRef.current = { symbol, strategy_id };
        setModalOpen(true);
        setModalLoading(true);
        setModalError('');
        setModalData(null);
        try {
            const data = await generateConnectToken({ symbol, strategy_id });
            setModalData(data);
        } catch (err) {
            setModalError(err?.message ?? 'Failed to generate connection link. Please try again.');
        } finally {
            setModalLoading(false);
        }
    }, []);

    const closeConnectModal = useCallback(() => {
        setModalOpen(false);
        setModalData(null);
        setModalError('');
        clearInterval(pollRef.current);
        pollRef.current = null;
    }, []);

    // ── Toggle helper (called from each card's Notify Me button) ─────────────
    const handleToggle = useCallback(async (symbol, strategy_id, currentlyActive) => {
        const symKey = `${symbol}:${strategy_id}`;
        setTogglingSymbols(prev => new Set([...prev, symKey]));

        const result = await toggleNotifyMe({
            symbol,
            strategy_id,
            is_active: !currentlyActive,
        });

        setTogglingSymbols(prev => {
            const next = new Set(prev);
            next.delete(symKey);
            return next;
        });

        if (result.requireConnection) {
            // User has no linked Telegram → open modal
            await openConnectModal(symbol, strategy_id);
            return;
        }

        if (result.ok) {
            // Optimistically update local status from response
            const d = result.data;
            if (d.subscribed_symbols || d.subscribed_strategies) {
                setStatus(prev => ({
                    ...prev,
                    subscribed_symbols: d.subscribed_symbols ?? prev.subscribed_symbols,
                    subscribed_strategies: d.subscribed_strategies ?? prev.subscribed_strategies,
                }));
            }
        }
    }, [openConnectModal]);

    // ── Disconnect helper ─────────────────────────────────────────────────────
    const handleDisconnect = useCallback(async () => {
        try {
            await disconnectTelegram();
        } finally {
            await refreshStatus();
        }
    }, [refreshStatus]);

    // ── Derived helpers ───────────────────────────────────────────────────────
    const isSymbolActive = useCallback((symbol, strategy_id) => {
        if (!status.is_connected) return false;
        return status.subscribed_strategies.some(
            s => s.symbol === symbol && s.strategy_id === strategy_id
        );
    }, [status]);

    const isToggling = useCallback((symbol, strategy_id) => {
        return togglingSymbols.has(`${symbol}:${strategy_id}`);
    }, [togglingSymbols]);

    return {
        config,
        status,
        statusLoading,
        // Modal
        modalOpen,
        modalData,
        modalLoading,
        modalError,
        openConnectModal,
        closeConnectModal,
        // Actions
        handleToggle,
        handleDisconnect,
        refreshStatus,
        // Derived
        isSymbolActive,
        isToggling,
    };
}
