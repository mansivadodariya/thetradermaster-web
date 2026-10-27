'use client';

import React from 'react';
import NextScreenshotTimer from '../NextScreenshotTimer';
import {
    LiveIcon,
    MonitorOffIcon,
    StopIcon,
    CameraIcon,
    PlayIcon
} from '@/icons/tradeSnapIcons';
import styles from '../tradeSnap.module.scss';

export default function TradeSnapScannerPanel({
    isSharing,
    stream,
    videoRef,
    autoCaptureInterval,
    setAutoCaptureInterval,
    autoCaptureOptions,
    nextScreenshotEndTime,
    stopScreenShare,
    handleScreenshot,
    startScreenShare,
    renderVideoPlaceholder,
    t
}) {
    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <h3>
                    {isSharing ? (
                        <>
                            <LiveIcon />
                            {t('tradeSnap.liveScreenShare', 'Live Screen Share')}
                        </>
                    ) : (
                        <>
                            <MonitorOffIcon />
                            {t('tradeSnap.screenPreview', 'Screen Preview')}
                        </>
                    )}
                </h3>
                {isSharing && (
                    <div className={styles.autoCapture}>
                        <label htmlFor="auto-capture-single">{t('tradeSnap.autoCapture', 'Auto Capture')}</label>
                        <select
                            id="auto-capture-single"
                            value={autoCaptureInterval ?? ''}
                            onChange={(e) => setAutoCaptureInterval(e.target.value ? Number(e.target.value) : null)}
                        >
                            {autoCaptureOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div className={styles.videoFrame}>
                {isSharing && stream ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className={styles.video}
                        onLoadedMetadata={() => videoRef.current?.play().catch(console.error)}
                    />
                ) : (
                    renderVideoPlaceholder(isSharing, t('tradeSnap.loadingScreenShare', 'Loading screen share...'))
                )}
            </div>
            <div className={styles.panelActions}>
                {isSharing ? (
                    <>
                        <button type="button" className={styles.btnDanger} onClick={stopScreenShare}>
                            <StopIcon />
                            Stop Sharing
                        </button>
                        {autoCaptureInterval ? (
                            <NextScreenshotTimer
                                intervalMinutes={autoCaptureInterval}
                                isActive={isSharing}
                                endTime={nextScreenshotEndTime}
                            />
                        ) : (
                            <button type="button" className={styles.btnPrimary} onClick={handleScreenshot}>
                                <CameraIcon />
                                {t('tradeSnap.captureScreenshot', 'Capture Screenshot')}
                            </button>
                        )}
                    </>
                ) : (
                    <button type="button" className={styles.btnPrimaryWide} onClick={startScreenShare}>
                        <PlayIcon />
                        {t('tradeSnap.startSharing', 'Start Sharing')}
                    </button>
                )}
            </div>
        </div>
    );
}
