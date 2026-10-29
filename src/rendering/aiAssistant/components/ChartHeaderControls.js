'use client';

import React from 'react';
import { formatPrice } from '../utils/indicatorCalculations';
import styles from '../aiAssistant.module.scss';

export default function ChartHeaderControls({
    currentPrice,
    chartSymbol,
    isUp,
    flashClass,
    changePercent,
    cameraDropdownRef,
    cameraDropdownOpen,
    toggleCameraDropdown,
    attachChartToChat,
    downloadChartImage,
    copyChartImageToClipboard,
    t
}) {
    return (
        <div className={styles.chartHeaderControls}>
            <div className={styles.leftControlsGroup}>
                {/* Live Real-time Price Display (Top Left Header with 1-Second Tick Stream) */}
                {currentPrice > 0 && (
                    <div 
                        className={`${styles.headerLivePriceBadge} ${isUp ? styles.badgeUp : styles.badgeDown}`}
                        style={{ background: 'transparent', backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}
                    >
                        <span className={styles.livePriceText}>{formatPrice(currentPrice, chartSymbol)}</span>
                        {isUp ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                <polyline points="17 6 23 6 23 12" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                                <polyline points="17 18 23 18 23 12" />
                            </svg>
                        )}
                        <span className={styles.livePctTag}>
                            {isUp ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`}
                        </span>
                        <div
                            className={styles.chartFeedBadge}
                            title={t ? t('aiAssistant.feedTooltip', 'Streaming via WebSocket MT5 Bridge (standard 15m delay may apply during non-liquid or off-market hours)') : 'Streaming via WebSocket MT5 Bridge (standard 15m delay may apply during non-liquid or off-market hours)'}
                        >
                            <span className={styles.chartFeedDot} />
                            <span>{t ? t('aiAssistant.liveFeed', 'LIVE FEED') : 'LIVE FEED'}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.rightControlsGroup}>
                {/* Right Camera Screenshot Action Menu */}
                <div className={styles.controlDropdownWrapper} ref={cameraDropdownRef}>
                    <button
                        type="button"
                        className={styles.iconControlBtn}
                        title={t ? t('aiAssistant.cameraActions', 'Camera Screenshot Actions') : 'Camera Screenshot Actions'}
                        onClick={toggleCameraDropdown}
                    >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </button>

                    {cameraDropdownOpen && (
                        <div className={`${styles.dropdownMenuFloating} ${styles.rightAligned}`}>
                            <button type="button" className={styles.dropdownMenuItem} onClick={attachChartToChat}>
                                <span>{t('aiAssistant.attachToChat', 'Attach to Chat')}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                </svg>
                            </button>
                            <button type="button" className={styles.dropdownMenuItem} onClick={downloadChartImage}>
                                <span>{t('aiAssistant.downloadImage', 'Download Image')}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                            <button type="button" className={styles.dropdownMenuItem} onClick={copyChartImageToClipboard}>
                                <span>{t('aiAssistant.copyImage', 'Copy Image')}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
