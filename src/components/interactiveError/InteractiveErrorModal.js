'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { openCreditsModal } from '@/lib/credits';
import styles from './interactiveError.module.scss';

const CoinsCapitalIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const AlertTriangleIcon = ({ size = 18, color = 'currentColor' }) => (
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

const CloseXIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export function InteractiveErrorModal({
    isOpen,
    onClose,
    error,
    onRetry,
    isRetrying = false,
}) {
    const router = useRouter();

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !error) return null;

    const isCredits = error?.errorType === 'credits';
    const isApiOffline = error?.errorType === 'api_unavailable';

    const handlePrimaryClick = () => {
        if (isCredits) {
            onClose?.();
            openCreditsModal();
        } else if (onRetry && error?.retryPayload) {
            onClose?.();
            onRetry(error.retryPayload);
        } else if (onRetry) {
            onClose?.();
            onRetry();
        }
    };

    const variantClass = isCredits
        ? styles.errorModalCredits
        : isApiOffline
        ? styles.errorModalApi
        : '';

    return (
        <div
            className={styles.errorModalOverlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="interactive-error-modal-title"
        >
            <div className={`${styles.errorModalCard} ${variantClass}`}>
                {/* Modal Header */}
                <div className={styles.errorModalHeader}>
                    <div className={styles.errorModalHeaderLeft}>
                        <div className={styles.errorIconBadge}>
                            {isCredits ? (
                                <CoinsCapitalIcon size={18} color="currentColor" />
                            ) : (
                                <AlertTriangleIcon size={18} color="currentColor" />
                            )}
                        </div>
                        <div>
                            <div id="interactive-error-modal-title" className={styles.errorModalTitle}>
                                {error?.title || (isCredits ? 'Insufficient AI Credits' : 'AI Service Temporarily Unavailable')}
                            </div>
                            <span className={styles.errorTag} style={{ marginTop: 4, display: 'inline-block' }}>
                                {error?.statusTag || (isCredits ? 'No Credits' : 'Service Offline')}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.errorModalCloseBtn}
                        onClick={onClose}
                        aria-label="Close error modal"
                    >
                        <CloseXIcon size={16} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className={styles.errorModalBody}>
                    <div className={styles.errorModalDesc}>
                        {error?.message || error?.text || (isCredits
                            ? 'You do not have enough AI compute credits to continue chatting and generating analyses.'
                            : 'Unable to communicate with the TraderMaster Copilot backend API. The service may be offline or restarting.')}
                    </div>

                    {error?.suggestion && (
                        <div className={styles.errorModalSuggestionCard}>
                            <span>💡</span>
                            <span>{error.suggestion}</span>
                        </div>
                    )}

                    {error?.rawError && (
                        <div>
                            <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                                Diagnostics / System Notice:
                            </div>
                            <div className={styles.errorModalDetailsAccordion}>
                                {typeof error.rawError === 'object'
                                    ? JSON.stringify(error.rawError, null, 2)
                                    : String(error.rawError)}
                                {error?.statusCode ? `\nStatus Code: ${error.statusCode}` : ''}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer Actions */}
                <div className={styles.errorModalFooter}>
                    <button
                        type="button"
                        className={styles.errorSecondaryBtn}
                        onClick={onClose}
                    >
                        Dismiss
                    </button>

                    {isCredits ? (
                        <>
                            <button
                                type="button"
                                className={styles.errorSecondaryBtn}
                                onClick={() => {
                                    onClose?.();
                                    router.push(error?.actionUrl || '/broker');
                                }}
                            >
                                Associated Brokers
                            </button>
                            <button
                                type="button"
                                className={styles.errorPrimaryBtn}
                                onClick={handlePrimaryClick}
                            >
                                <SparklesMagicIcon size={14} color="#000000" />
                                <span>{error?.actionLabel || 'Connect Broker for Credits'}</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className={styles.errorSecondaryBtn}
                                onClick={() => {
                                    onClose?.();
                                    router.push('/support');
                                }}
                            >
                                Contact Support
                            </button>
                            <button
                                type="button"
                                className={styles.errorPrimaryBtn}
                                onClick={handlePrimaryClick}
                                disabled={isRetrying}
                            >
                                <RefreshResetIcon size={14} color="currentColor" />
                                <span>{isRetrying ? 'Retrying…' : (error?.actionLabel || 'Try Again')}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InteractiveErrorModal;
