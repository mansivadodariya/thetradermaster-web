'use client';

import React from 'react';
import styles from '../aiStrategy.module.scss';

function BellIcon({ filled = false, size = 13 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path strokeLinecap="round" d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

function SpinnerIcon({ size = 13 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ animation: 'notifySpinner 0.8s linear infinite' }}
        >
            <path strokeLinecap="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
        </svg>
    );
}

/**
 * NotifyMeButton
 *
 * Props:
 *   symbol        — e.g. "EURUSD"
 *   strategyId    — e.g. "ema_pullback"
 *   isActive      — boolean — whether this symbol is subscribed
 *   isLoading     — boolean — currently toggling
 *   disabled      — boolean
 *   onClick       — () => void — call handleToggle from useTelegramSignal
 */
export default function NotifyMeButton({ symbol, strategyId, isActive, isLoading, disabled, onClick }) {
    const btnClass = [
        styles.notifyMeBtn,
        isActive ? styles.active : '',
        isLoading ? styles.loading : '',
    ].filter(Boolean).join(' ');

    const label = isActive ? 'Notifying' : 'Notify Me';
    const ariaLabel = isActive
        ? `Mute Telegram alerts for ${symbol}`
        : `Enable Telegram alerts for ${symbol}`;

    return (
        <button
            type="button"
            id={`notify-me-btn-${symbol}-${strategyId}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')}
            className={btnClass}
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-pressed={isActive}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {isLoading ? (
                <SpinnerIcon size={13} />
            ) : (
                <BellIcon filled={isActive} size={13} />
            )}
            <span className={styles.notifyBtnText}>{label}</span>
        </button>
    );
}
