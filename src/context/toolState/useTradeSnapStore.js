'use client';

import { useState, useEffect, useCallback } from 'react';

const SNAP_KEYS = {
    ANALYSES: 'chronosx_tradesnap_analyses',
    SELECTED: 'chronosx_tradesnap_selected',
    SHOW: 'chronosx_tradesnap_show_analysis',
    CAPTURED: 'chronosx_tradesnap_captured_image',
    ACTIVE_JOB: 'chronosx_tradesnap_active_job'
};

export function useCreateTradeSnapStore() {
    const [isSharing, setIsSharing] = useState(false);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImageState] = useState(null);
    const [showSnapshot, setShowSnapshotState] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAnalysis, setShowAnalysisState] = useState(false);
    const [allAnalyses, setAllAnalysesState] = useState([]);
    const [autoCaptureInterval, setAutoCaptureInterval] = useState(null);
    const [nextScreenshotEndTime, setNextScreenshotEndTime] = useState(null);
    const [shouldAutoAnalyze, setShouldAutoAnalyze] = useState(false);
    const [selectedAnalysis, setSelectedAnalysisState] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [activeJob, setActiveJob] = useState(null);

    // Rehydrate tradeSnap persisted state on mount (analyses + captured image session)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const savedAnalyses = localStorage.getItem(SNAP_KEYS.ANALYSES);
            if (savedAnalyses) {
                const parsed = JSON.parse(savedAnalyses);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setAllAnalysesState(parsed);
                }
            }

            const savedSelected = localStorage.getItem(SNAP_KEYS.SELECTED);
            if (savedSelected) {
                const parsedSelected = JSON.parse(savedSelected);
                if (parsedSelected) {
                    setSelectedAnalysisState(parsedSelected);
                    setShowAnalysisState(true);
                }
            }

            // Restore captured screenshot so it never disappears on stop-sharing or navigation
            const savedCaptured = sessionStorage.getItem(SNAP_KEYS.CAPTURED) || localStorage.getItem(SNAP_KEYS.CAPTURED);
            if (savedCaptured) {
                setCapturedImageState(savedCaptured);
                setShowSnapshotState(true);
            }

            // Restore in-flight active job if user refreshed/navigated within 75s
            const savedJobStr = sessionStorage.getItem(SNAP_KEYS.ACTIVE_JOB);
            if (savedJobStr) {
                const job = JSON.parse(savedJobStr);
                if (job && job.startedAt && Date.now() - job.startedAt < 75000) {
                    setIsAnalyzing(true);
                    setActiveJob(job);
                } else {
                    sessionStorage.removeItem(SNAP_KEYS.ACTIVE_JOB);
                }
            }
        } catch (err) {
            console.warn('Could not rehydrate tradeSnap analyses from storage:', err);
        }
    }, []);

    const setCapturedImage = useCallback((img) => {
        setCapturedImageState(img);
        if (typeof window !== 'undefined') {
            try {
                if (img) {
                    sessionStorage.setItem(SNAP_KEYS.CAPTURED, img);
                } else {
                    sessionStorage.removeItem(SNAP_KEYS.CAPTURED);
                    localStorage.removeItem(SNAP_KEYS.CAPTURED);
                }
            } catch (_) {
                // If quota exceeded in sessionStorage, keep in React state
            }
        }
    }, []);

    const setShowSnapshot = useCallback((show) => {
        setShowSnapshotState(show);
    }, []);

    const discardSnapshot = useCallback(() => {
        setCapturedImageState(null);
        setShowSnapshotState(false);
        if (typeof window !== 'undefined') {
            try {
                sessionStorage.removeItem(SNAP_KEYS.CAPTURED);
                localStorage.removeItem(SNAP_KEYS.CAPTURED);
            } catch (_) {}
        }
    }, []);

    const setAllAnalyses = useCallback((updater) => {
        setAllAnalysesState((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(SNAP_KEYS.ANALYSES, JSON.stringify(next));
                } catch (e) {
                    console.warn('Failed to save tradeSnap analyses to localStorage:', e);
                }
            }
            return next;
        });
    }, []);

    const setSelectedAnalysis = useCallback((item) => {
        setSelectedAnalysisState(item);
        if (typeof window !== 'undefined') {
            try {
                if (item) {
                    localStorage.setItem(SNAP_KEYS.SELECTED, JSON.stringify(item));
                } else {
                    localStorage.removeItem(SNAP_KEYS.SELECTED);
                }
            } catch (e) {
                // Ignore
            }
        }
    }, []);

    const setShowAnalysis = useCallback((show) => {
        setShowAnalysisState(show);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(SNAP_KEYS.SHOW, JSON.stringify(show));
            } catch (e) {
                // Ignore
            }
        }
    }, []);

    return {
        isSharing,
        setIsSharing,
        stream,
        setStream,
        capturedImage,
        setCapturedImage,
        discardSnapshot,
        showSnapshot,
        setShowSnapshot,
        isAnalyzing,
        setIsAnalyzing,
        showAnalysis,
        setShowAnalysis,
        allAnalyses,
        setAllAnalyses,
        autoCaptureInterval,
        setAutoCaptureInterval,
        nextScreenshotEndTime,
        setNextScreenshotEndTime,
        shouldAutoAnalyze,
        setShouldAutoAnalyze,
        selectedAnalysis,
        setSelectedAnalysis,
        isDetailModalOpen,
        setIsDetailModalOpen,
        activeJob,
        setActiveJob
    };
}
