'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './interactiveError.module.scss';

const CoinsCapitalIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const AlertTriangleIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const RefreshResetIcon = ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
);

const SparklesMagicIcon = ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

const InfoCircleIcon = ({ size = 13, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

export function InteractiveErrorBubble({
    error,
    onRetry,
    isRetrying = false,
    onOpenModal,
    showDetailsBtn = true,
}) {
    const router = useRouter();
    const isCredits = error?.errorType === 'credits';
    const isApiOffline = error?.errorType === 'api_unavailable';

    const handlePrimaryClick = () => {
        if (isCredits) {
            router.push('/subscription-plans');
        } else if (onRetry && error?.retryPayload) {
            onRetry(error.retryPayload);
        } else if (onRetry) {
            onRetry();
        }
    };

    const variantClass = isCredits
        ? styles.errorCredits
        : isApiOffline
        ? styles.errorApi
        : styles.errorGeneral;

    return (
        <div className={`${styles.errorBubble} ${variantClass}`} role="alert">
            <div className={styles.errorHeader}>
                <div className={styles.errorHeaderLeft}>
                    <div className={styles.errorIconBadge}>
                        {isCredits ? (
                            <CoinsCapitalIcon size={16} color="currentColor" />
                        ) : (
                            <AlertTriangleIcon size={16} color="currentColor" />
                        )}
                    </div>
                    <span className={styles.errorTitle}>
                        {error?.title || (isCredits ? 'Insufficient AI Credits' : 'AI Service Temporarily Unavailable')}
                    </span>
                </div>
                <span className={styles.errorTag}>
                    {error?.statusTag || (isCredits ? 'No Credits' : 'Service Offline')}
                </span>
            </div>

            <div className={styles.errorBody}>
                <div className={styles.errorDesc}>
                    {error?.message || error?.text || (isCredits
                        ? 'You do not have enough AI compute credits to continue.'
                        : 'Unable to communicate with the ChronosX Copilot API. The service may be temporarily unavailable.')}
                </div>
                {error?.suggestion && (
                    <div className={styles.errorSuggestion}>{error.suggestion}</div>
                )}
            </div>

            <div className={styles.errorActions}>
                {isCredits ? (
                    <>
                        <button
                            type="button"
                            className={styles.errorPrimaryBtn}
                            onClick={handlePrimaryClick}
                        >
                            <SparklesMagicIcon size={14} color="#000000" />
                            <span>Upgrade Plan &amp; AI Credits</span>
                        </button>
                        <button
                            type="button"
                            className={styles.errorSecondaryBtn}
                            onClick={() => router.push('/profile')}
                        >
                            <span>Check Balance</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            className={styles.errorPrimaryBtn}
                            onClick={handlePrimaryClick}
                            disabled={isRetrying}
                        >
                            <RefreshResetIcon size={14} color="currentColor" />
                            <span>{isRetrying ? 'Retrying…' : (error?.actionLabel || 'Try Again')}</span>
                        </button>
                        <button
                            type="button"
                            className={styles.errorSecondaryBtn}
                            onClick={() => router.push('/support')}
                        >
                            <span>Contact Support</span>
                        </button>
                    </>
                )}

                {showDetailsBtn && onOpenModal && (
                    <button
                        type="button"
                        className={styles.errorGhostBtn}
                        onClick={() => onOpenModal(error)}
                        title="View details & diagnostics"
                    >
                        <InfoCircleIcon size={13} color="currentColor" />
                        <span>Details</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default InteractiveErrorBubble;
