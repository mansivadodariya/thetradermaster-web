'use client';

import CommonSectionHeader from '@/components/CommonSectionHeader';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './tradeSnap.module.scss';
import HistoryButton from '@/components/historyButton';
import { analyzeTradeScreenshots, dataUrlToBlob, extractTradesFromPayload, notifyBrowserTradeSnapReady } from '@/lib/tradeSnapApi';
import { getStoredUserId } from '@/lib/authSession';
import { toast } from '@/components/toast';
import { notifyCreditsUpdated, openCreditsModal } from '@/lib/credits';
import { useLanguage } from '@/context/LanguageContext';
import { MonitorIcon } from '@/icons/tradeSnapIcons';
import TradeSnapMobileNotice from './components/TradeSnapMobileNotice';
import TradeSnapScannerPanel from './components/TradeSnapScannerPanel';
import TradeSnapSnapshotPanel from './components/TradeSnapSnapshotPanel';
import TradeSnapResultsPanel from './components/TradeSnapResultsPanel';
import TradeSnapModals from './components/TradeSnapModals';
import TradeSnapGuidePanel from './components/TradeSnapGuidePanel';
import useTradeSnapHistory from './hooks/useTradeSnapHistory';
import { useTradeSnapStore } from '@/context/toolState';

const AUTO_CAPTURE_OPTIONS = [
    { value: '', label: 'Off' },
    { value: '1', label: 'Every 1 min' },
    { value: '5', label: 'Every 5 min' },
    { value: '30', label: 'Every 30 min' },
    { value: '60', label: 'Every 1 hour' },
    { value: '90', label: 'Every 1.5 hour' },
    { value: '120', label: 'Every 2 hour' },
];

function getUserId() {
    return getStoredUserId();
}

export default function TradeSnap() {
    const { t } = useLanguage();
    const [error, setError] = useState(null);

    const {
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
        setIsDetailModalOpen
    } = useTradeSnapStore();

    const [isDesktop, setIsDesktop] = useState(true);
    const [isScreenShareSupported, setIsScreenShareSupported] = useState(true);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // History management hook
    const {
        historyOpen,
        setHistoryOpen,
        historyLoading,
        historyItems,
        confirmDeleteOpen,
        setConfirmDeleteOpen,
        openHistory,
        requestDeleteHistory,
        confirmDeleteHistory,
    } = useTradeSnapHistory({ setError });

    useEffect(() => {
        const check = () => {
            const userAgent = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
            const isSmallMobile = window.innerWidth < 768 && /iPhone|iPod|Android.*Mobile/i.test(userAgent);
            
            const hasDisplayMedia = typeof navigator !== 'undefined' &&
                !!navigator.mediaDevices &&
                typeof navigator.mediaDevices.getDisplayMedia === 'function';

            // Allow desktop and wide viewports (including 1440px screens) full access to AI Chart Scanner
            setIsDesktop(window.innerWidth >= 768 || !isSmallMobile);
            setIsScreenShareSupported(hasDisplayMedia);
        };
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (error) {
            toast.dismiss();
            toast.error(error);
            setError(null);
        }
    }, [error]);

    const [analysisError, setAnalysisError] = useState(null);

    const stopScreenShare = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
            setStream(null);
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsSharing(false);
        // Preserved: Captured screenshot & analyses stay intact across screen sharing sessions
        setAutoCaptureInterval(null);
        setNextScreenshotEndTime(null);
        setAnalysisError(null);
    }, [stream, setStream, setIsSharing, setAutoCaptureInterval, setNextScreenshotEndTime]);

    const startScreenShare = useCallback(async () => {
        try {
            setAutoCaptureInterval(null);
            setNextScreenshotEndTime(null);
            setAnalysisError(null);

            if (!isScreenShareSupported || !navigator.mediaDevices?.getDisplayMedia) {
                toast.dismiss();
                throw new Error('Screen sharing is not supported on mobile devices or in Safari on iOS. Please use desktop Chrome, Edge, or Safari on Mac.');
            }
            let mediaStream;
            try {
                mediaStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: { ideal: 1920, max: 1920 },
                        height: { ideal: 1080, max: 1080 },
                        frameRate: { ideal: 30, max: 60 },
                    },
                    audio: true,
                    selfBrowserSurface: 'include',
                });
            } catch (constraintErr) {
                if (constraintErr?.name === 'NotAllowedError') throw constraintErr;
                mediaStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                });
            }
            setStream(mediaStream);
            setIsSharing(true);
            mediaStream.getVideoTracks()[0].addEventListener('ended', stopScreenShare);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play().catch(console.error);
            }
            setTimeout(() => window.focus(), 100);
        } catch (err) {
            if (err?.name === 'NotAllowedError') {
                setError('Screen sharing permission was denied.');
            } else if (err?.name === 'NotFoundError') {
                setError('No screen sharing source was selected.');
            } else {
                setError(err?.message || 'Failed to start screen sharing');
            }
        }
    }, [stopScreenShare, isScreenShareSupported, setAutoCaptureInterval, setNextScreenshotEndTime, setStream, setIsSharing]);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
        }
    }, [stream]);

    const captureFromVideo = useCallback((videoEl) => {
        const canvas = canvasRef.current;
        if (!videoEl || !canvas) return null;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        canvas.width = videoEl.videoWidth || videoEl.clientWidth;
        canvas.height = videoEl.videoHeight || videoEl.clientHeight;
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png', 1.0);
    }, []);

    const captureScreenshot = useCallback(() => {
        const image = captureFromVideo(videoRef.current);
        if (!image) {
            setError('Unable to capture screenshot');
            return;
        }
        setCapturedImage(image);
        setShowSnapshot(true);
        setAnalysisError(null);
    }, [captureFromVideo, setCapturedImage, setShowSnapshot]);

    const pushAnalysis = useCallback((analysisData) => {
        const trades = Array.isArray(analysisData)
            ? analysisData
            : extractTradesFromPayload({ ai_response: analysisData });
        if (!trades.length) return;

        setAllAnalyses([
            { data: trades, timestamp: new Date().toISOString() },
        ]);
        setShowAnalysis(true);
    }, [setAllAnalyses, setShowAnalysis]);

    const applyAnalyzeResult = useCallback((result, { onInvalidChart } = {}) => {
        const trades = extractTradesFromPayload(result);
        if (trades[0]?.error) {
            const errText = t('tradeSnap.pleaseAddGraphScreenshot', 'Please add a graph screenshot to analyze');
            setError(errText);
            setAnalysisError(errText);
            onInvalidChart?.();
            return false;
        }
        if (!trades.length) {
            const errText = t('tradeSnap.pleaseAddGraphScreenshot', 'Please add a graph screenshot to analyze');
            setError(errText);
            setAnalysisError(errText);
            onInvalidChart?.();
            return false;
        }
        pushAnalysis(trades);
        return true;
    }, [pushAnalysis, t]);

    const analyzeImage = useCallback(async () => {
        if (!capturedImage) {
            setError(t('tradeSnap.pleaseAddGraphScreenshot', 'Please add a graph screenshot to analyze'));
            return;
        }
        setIsAnalyzing(true);
        setAnalysisError(null);
        setShowAnalysis(true);

        if (typeof window !== 'undefined') {
            try {
                if ('Notification' in window && Notification.permission === 'default') {
                    Notification.requestPermission().catch(() => {});
                }
                sessionStorage.setItem('tradermaster_tradesnap_active_job', JSON.stringify({
                    startedAt: Date.now(),
                    isRunning: true
                }));
            } catch (_) {}
        }

        try {
            const blob = await dataUrlToBlob(capturedImage);
            const result = await analyzeTradeScreenshots([blob], getUserId());
            if (applyAnalyzeResult(result, { onInvalidChart: () => setShowSnapshot(true) })) {
                setShowSnapshot(false);
                setAnalysisError(null);
                notifyBrowserTradeSnapReady(
                    t('tradeSnap.scannerTitle', 'AI Live Chart Scanner'),
                    t('tradeSnap.analysisReadyNotification', 'AI Chart analysis complete! Trade setup generated.')
                );
                toast.success(t('tradeSnap.analysisSuccessToast', 'AI Chart analysis complete! Trade setup generated.'));
                if (typeof window !== 'undefined') {
                    try { sessionStorage.removeItem('tradermaster_tradesnap_active_job'); } catch (_) {}
                }
            }
        } catch (err) {
            if (typeof window !== 'undefined') {
                try { sessionStorage.removeItem('tradermaster_tradesnap_active_job'); } catch (_) {}
            }

            if (err?.message?.includes('timed out') || err?.name === 'AbortError') {
                const timeoutMsg = err?.message || 'Analysis timed out after 75s. The server is under high load. Please retry.';
                setAnalysisError(timeoutMsg);
                setError(timeoutMsg);
                return;
            }

            if (err?.detail?.error_code === 'INSUFFICIENT_CREDITS' || err?.message?.toLowerCase().includes('insufficient credits')) {
                const creditMsg = t('tradeSnap.insufficientCredits', 'Insufficient credits. Connect a broker to earn credits.');
                setAnalysisError(creditMsg);
                setError(creditMsg);
                notifyCreditsUpdated(0);
                setTimeout(() => openCreditsModal(), 400);
                return;
            }
            if (err?.status === 401 || err?.message?.toLowerCase().includes('session expired') || err?.message?.toLowerCase().includes('log in')) {
                const authMsg = err?.message || 'Session expired. Please log in again.';
                setAnalysisError(authMsg);
                setError(authMsg);
                return;
            }

            // User-friendly toast message for non-chart/invalid images or backend vision processing failures
            const friendlyMsg = err?.message || t('tradeSnap.pleaseAddGraphScreenshot', 'Please add a graph screenshot to analyze');
            setAnalysisError(friendlyMsg);
            setError(friendlyMsg);
        } finally {
            setIsAnalyzing(false);
        }
    }, [capturedImage, applyAnalyzeResult, setShowSnapshot, setIsAnalyzing, setShowAnalysis, t]);

    const handleScreenshot = () => {
        captureScreenshot();
        if (autoCaptureInterval) {
            setNextScreenshotEndTime(Date.now() + autoCaptureInterval * 60 * 1000);
        }
    };

    // Auto-capture: single
    useEffect(() => {
        if (!autoCaptureInterval || !isSharing) return;
        let lastCapture = Date.now();
        const timer = setInterval(async () => {
            if (Date.now() - lastCapture >= autoCaptureInterval * 60 * 1000) {
                captureScreenshot();
                lastCapture = Date.now();
                setNextScreenshotEndTime(Date.now() + autoCaptureInterval * 60 * 1000);
                setShouldAutoAnalyze(true);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [autoCaptureInterval, isSharing, captureScreenshot, setNextScreenshotEndTime, setShouldAutoAnalyze]);

    useEffect(() => {
        if (autoCaptureInterval && isSharing) {
            setNextScreenshotEndTime(Date.now() + autoCaptureInterval * 60 * 1000);
        } else {
            setNextScreenshotEndTime(null);
        }
    }, [autoCaptureInterval, isSharing, setNextScreenshotEndTime]);

    useEffect(() => {
        if (shouldAutoAnalyze && capturedImage && !isAnalyzing) {
            analyzeImage();
            setShouldAutoAnalyze(false);
        }
    }, [shouldAutoAnalyze, capturedImage, isAnalyzing, analyzeImage, setShouldAutoAnalyze]);

    const renderVideoPlaceholder = (sharing, loadingText) => (
        <div className={styles.videoPlaceholder}>
            <MonitorIcon className={styles.placeholderIcon} />
            <h3>
                {sharing 
                    ? loadingText 
                    : (isScreenShareSupported ? t('tradeSnap.noScreenSharing', 'No screen sharing active') : t('tradeSnap.screenShareNotSupported', 'Screen sharing not supported'))}
            </h3>
            <p>
                {sharing 
                    ? t('tradeSnap.waitScreenLoading', 'Please wait while we load your screen') 
                    : (isScreenShareSupported 
                        ? t('tradeSnap.clickStartSharing', 'Click "Start Sharing" to begin') 
                        : t('tradeSnap.desktopRequiredDesc', 'Screen sharing is not supported on mobile Safari or iOS devices. Please open on desktop Chrome, Edge, or Mac Safari.'))}
            </p>
        </div>
    );

    const openDetailModal = (analysis) => {
        setSelectedAnalysis(analysis);
        setHistoryOpen(false);
        setIsDetailModalOpen(true);
    };

    if (!isDesktop) {
        return <TradeSnapMobileNotice t={t} />;
    }

    return (
        <div className={styles.tradeSnap}>
            <canvas ref={canvasRef} className={styles.hiddenCanvas} aria-hidden="true" />

            <CommonSectionHeader
                badge="VISION NEURAL OCR APERTURE"
                badgeIcon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="3" x2="12" y2="7" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                        <line x1="3" y1="12" x2="7" y2="12" />
                        <line x1="17" y1="12" x2="21" y2="12" />
                        <circle cx="12" cy="12" r="3" fill="#18C98B" />
                    </svg>
                }
                title={t('tradeSnap.scannerTitle', 'AI Live Chart Scanner')}
                subtitle={t('tradeSnap.scannerDesc', 'Share your live chart screen or capture snapshots to get real-time AI technical analysis, key levels, and trade setups.')}
                isCard={true}
                rightAction={
                    <HistoryButton
                        text={t('tradeSnap.history', 'History')}
                        onClick={openHistory}
                    />
                }
            />

            <div className={styles.workspace}>
                <div className={styles.mainColumn}>
                    <TradeSnapScannerPanel
                        isSharing={isSharing}
                        stream={stream}
                        videoRef={videoRef}
                        autoCaptureInterval={autoCaptureInterval}
                        setAutoCaptureInterval={setAutoCaptureInterval}
                        autoCaptureOptions={AUTO_CAPTURE_OPTIONS}
                        nextScreenshotEndTime={nextScreenshotEndTime}
                        stopScreenShare={stopScreenShare}
                        handleScreenshot={handleScreenshot}
                        startScreenShare={startScreenShare}
                        renderVideoPlaceholder={renderVideoPlaceholder}
                        t={t}
                    />
                </div>

                {!isSharing && !capturedImage && allAnalyses.length === 0 && (
                    <TradeSnapGuidePanel onStartSharing={startScreenShare} t={t} />
                )}

                {capturedImage && (showSnapshot || isAnalyzing || allAnalyses.length === 0) && (
                    <TradeSnapSnapshotPanel
                        capturedImage={capturedImage}
                        isAnalyzing={isAnalyzing}
                        analyzeImage={analyzeImage}
                        error={analysisError}
                        retryAnalysis={analyzeImage}
                        onDiscard={discardSnapshot}
                    />
                )}

                {allAnalyses.length > 0 && !isAnalyzing && (!showSnapshot || !capturedImage) && (
                    <TradeSnapResultsPanel
                        isAnalyzing={isAnalyzing}
                        allAnalyses={allAnalyses}
                        error={analysisError}
                        retryAnalysis={analyzeImage}
                    />
                )}
            </div>

            <TradeSnapModals
                isDetailModalOpen={isDetailModalOpen}
                setIsDetailModalOpen={setIsDetailModalOpen}
                selectedAnalysis={selectedAnalysis}
                historyOpen={historyOpen}
                setHistoryOpen={setHistoryOpen}
                historyLoading={historyLoading}
                historyItems={historyItems}
                openDetailModal={openDetailModal}
                handleDeleteHistoryItem={requestDeleteHistory}
                confirmDeleteOpen={confirmDeleteOpen}
                setConfirmDeleteOpen={setConfirmDeleteOpen}
                confirmDeleteHistoryItem={confirmDeleteHistory}
                t={t}
            />
        </div>
    );
}
