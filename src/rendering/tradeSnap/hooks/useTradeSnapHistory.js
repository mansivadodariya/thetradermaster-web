'use client';

import { useState } from 'react';
import { toast } from '@/components/toast';
import { tradeSnapApi } from '@/lib/api';
import { historyDeletes } from '@/lib/historyDeletes';
import { extractTradesFromPayload } from '@/lib/tradeSnapApi';
import { getStoredUserId } from '@/lib/authSession';

export default function useTradeSnapHistory({ setError }) {
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [pendingDeleteHistory, setPendingDeleteHistory] = useState(null);

    const normalizeHistory = (payload) => {
        const list = Array.isArray(payload) ? payload : (payload?.data || payload?.items || []);
        return (Array.isArray(list) ? list : []).map((item, idx) => {
            const ts = item?.created_at || item?.createdAt || item?.timestamp || item?.time || item?.date || new Date().toISOString();
            const trades = extractTradesFromPayload(item);
            return {
                id: item?.id || item?.analysis_id || item?.history_id || ts || idx,
                deleteId: item?.id || item?.analysis_id || item?.history_id || null,
                timestamp: ts,
                data: trades,
            };
        });
    };

    const openHistory = async () => {
        const userId = getStoredUserId();
        if (!userId) {
            setError('User not found. Please login again.');
            return;
        }
        setHistoryOpen(true);
        setHistoryLoading(true);
        try {
            const res = await tradeSnapApi.getAnalysisHistory(userId);
            let rawList = Array.isArray(res) ? res : (res?.data || res?.items || []);
            rawList = rawList.filter(item => item?.is_delete !== true);
            setHistoryItems(normalizeHistory(rawList));
        } catch (e) {
            setError(e?.message || 'Failed to load history');
            setHistoryItems([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const requestDeleteHistory = (item) => {
        setPendingDeleteHistory(item);
        setConfirmDeleteOpen(true);
        setHistoryOpen(false);
    };

    const closeDeleteHistoryModal = () => {
        setConfirmDeleteOpen(false);
        setPendingDeleteHistory(null);
    };

    const confirmDeleteHistory = async () => {
        if (!pendingDeleteHistory) return;
        if (!pendingDeleteHistory.deleteId) {
            toast.error('Unable to delete this history item.');
            closeDeleteHistoryModal();
            return;
        }

        const userId = getStoredUserId();
        if (!userId) {
            toast.error('User not found. Please login again.');
            closeDeleteHistoryModal();
            return;
        }

        try {
            await historyDeletes.deleteAnalysisHistoryItem({
                userId,
                id: pendingDeleteHistory.deleteId,
            });
            setHistoryItems((prev) => prev.filter((item) => item.id !== pendingDeleteHistory.id));
            toast.success('History deleted successfully.');
        } catch (e) {
            toast.error(e?.message || 'Failed to delete history item.');
        } finally {
            closeDeleteHistoryModal();
        }
    };

    return {
        historyOpen,
        setHistoryOpen,
        historyLoading,
        historyItems,
        confirmDeleteOpen,
        setConfirmDeleteOpen,
        openHistory,
        requestDeleteHistory,
        closeDeleteHistoryModal,
        confirmDeleteHistory,
    };
}
