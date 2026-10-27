'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { useTheme } from '@/context/ThemeContext';
import Loader from '@/components/loader';
import styles from '../aiStrategy.module.scss';

/* ── Inline SVG Icons ────────────────────────────────────────────────────── */
function TelegramIcon({ size = 22 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M22.26 2.27a1.6 1.6 0 0 0-1.63-.22L2.1 9.55a1.6 1.6 0 0 0 .1 3.01l4.08 1.35 1.56 4.9a1 1 0 0 0 1.7.4l2.46-2.46 4.35 3.25a1.6 1.6 0 0 0 2.49-1.02l2.9-15.2a1.6 1.6 0 0 0-.58-1.51ZM10.2 15.2l-.9 2.66-.97-3.02 8.44-7.3-6.57 7.66Z"
                fill="white"
            />
        </svg>
    );
}

function QrCodeIcon({ size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M10 7h1" />
            <path d="M7 10h1" />
            <path d="M14 10h1" />
            <path d="M10 14h1" />
            <path d="M10 17h1" />
            <path d="M7 17h1" />
        </svg>
    );
}

function CheckCircleIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="9" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
        </svg>
    );
}

function BellIcon({ size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path strokeLinecap="round" d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

function ExternalLinkIcon({ size = 12 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    );
}

/* ── OTP Copy Button ─────────────────────────────────────────────────────── */
function OtpCopyButton({ code }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard not available
        }
    }, [code]);

    return (
        <button
            type="button"
            className={`${styles.otpCopyBtn}${copied ? ` ${styles.copied}` : ''}`}
            onClick={handleCopy}
        >
            {copied ? '✓ Copied' : 'Copy'}
        </button>
    );
}

/* ── Countdown from expires_in_seconds ───────────────────────────────────── */
function ExpiresCountdown({ expiresInSeconds, isLight = false }) {
    const [remaining, setRemaining] = useState(expiresInSeconds ?? 600);

    useEffect(() => {
        if (!expiresInSeconds) return;
        setRemaining(expiresInSeconds);
        const id = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [expiresInSeconds]);

    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');

    const defaultColor = isLight ? '#475569' : 'rgba(255,255,255,0.5)';

    return (
        <p className={styles.expiresRow}>
            This link expires in <strong style={{ color: remaining < 60 ? '#F87171' : defaultColor }}>{m}:{s}</strong>
        </p>
    );
}

/* ════════════════════════════════════════════════════════════════════════════
   TelegramConnectModal
   ════════════════════════════════════════════════════════════════════════════ */
export default function TelegramConnectModal({
    open,
    onClose,
    modalData,      // { token, otp_code, deep_link, bot_username, pending_symbol, pending_strategy_id, expires_in_seconds }
    modalLoading,
    modalError,
    isConnected,    // from status.is_connected (true after bot sends /start)
    channelUrl,     // public community channel link
    onDisconnect,
}) {
    const [mounted, setMounted] = useState(false);
    const [connectMethod, setConnectMethod] = useState('qr'); // 'qr' | 'link'
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [isLightMode, setIsLightMode] = useState(false);

    let themeFromCtx = 'dark';
    try {
        const themeCtx = useTheme();
        themeFromCtx = themeCtx?.theme || 'dark';
    } catch {}

    // Check DOM class/attribute to reliably match light theme
    useEffect(() => {
        const checkTheme = () => {
            if (typeof document === 'undefined') return;
            const root = document.documentElement;
            const isLight = root.classList.contains('light') ||
                root.getAttribute('data-theme') === 'light' ||
                themeFromCtx === 'light';
            setIsLightMode(isLight);
        };
        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
        return () => observer.disconnect();
    }, [themeFromCtx]);

    useEffect(() => { setMounted(true); }, []);

    // Ensure scanner is active by default whenever modal opens
    useEffect(() => {
        if (open) {
            setConnectMethod('qr');
        }
    }, [open]);

    /* Close on Escape */
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    /* Lock body scroll while open */
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    const symbol = modalData?.pending_symbol ?? '';
    const strategyId = modalData?.pending_strategy_id ?? '';
    const deepLink = modalData?.deep_link ?? '';
    const otpCode = modalData?.otp_code ?? '';

    // Generate crisp QR code whenever deepLink changes
    useEffect(() => {
        if (!deepLink) {
            setQrDataUrl('');
            return;
        }

        let isCancelled = false;
        try {
            QRCode.toDataURL(deepLink, {
                errorCorrectionLevel: 'H', // 30% error correction allows central logo overlay
                margin: 1,
                width: 340,
                color: {
                    dark: '#0F172A',
                    light: '#FFFFFF',
                },
            })
                .then((url) => {
                    if (!isCancelled) setQrDataUrl(url);
                })
                .catch((err) => {
                    console.error('Failed to generate Telegram QR code:', err);
                    if (!isCancelled) {
                        setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(deepLink)}`);
                    }
                });
        } catch (_) {
            if (!isCancelled) {
                setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(deepLink)}`);
            }
        }

        return () => { isCancelled = true; };
    }, [deepLink]);

    if (!mounted || !open) return null;

    const content = (
        <div
            className={`${styles.telegramModalOverlay} ${isLightMode ? styles.themeLight : ''}`}
            onClick={onClose}
        >
            <div
                className={`${styles.telegramModal} ${isLightMode ? styles.themeLight : ''}`}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Connect Telegram"
            >
                {/* ── Header ── */}
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderLeft}>
                        <div className={styles.tgLogoWrap}>
                            <TelegramIcon size={22} />
                        </div>
                        <div className={styles.modalTitleGroup}>
                            <h3>Connect Telegram</h3>
                            <p>Receive personal signal alerts in your DMs</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.modalCloseBtn}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className={styles.modalDivider} />

                {/* ── Already connected success ── */}
                {isConnected ? (
                    <div className={styles.connectedState}>
                        <div className={styles.connectedIcon}>
                            <CheckCircleIcon />
                        </div>
                        <h4>Telegram Connected!</h4>
                        <p>Your account is linked. Personal signal alerts are active.</p>
                        {onDisconnect && (
                            <button
                                type="button"
                                className={styles.disconnectLink}
                                onClick={onDisconnect}
                            >
                                Disconnect Telegram
                            </button>
                        )}
                    </div>
                ) : modalLoading ? (
                    /* ── Loading ── */
                    <div className={styles.modalLoadingWrap}>
                        <Loader size="md" />
                        <p>Generating your personal connection link…</p>
                    </div>
                ) : modalError ? (
                    /* ── Error ── */
                    <p className={styles.modalErrorMsg}>{modalError}</p>
                ) : (
                    /* ── Main flow ── */
                    <>
                        {/* Symbol badge */}
                        {symbol && (
                            <div className={styles.symbolBadgeRow}>
                                <div className={styles.pendingSymbolBadge}>
                                    <BellIcon size={13} />
                                    <span className={styles.symbolLabel}>Alerts for:</span>
                                    <strong>{symbol}</strong>
                                </div>
                            </div>
                        )}

                        {/* Scanner / Direct Link Switch */}
                        {deepLink && (
                            <div className={styles.methodToggle}>
                                <button
                                    type="button"
                                    className={`${styles.methodBtn} ${connectMethod === 'qr' ? styles.activeMethod : ''}`}
                                    onClick={() => setConnectMethod('qr')}
                                >
                                    <QrCodeIcon size={14} />
                                    Scan QR Code
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.methodBtn} ${connectMethod === 'link' ? styles.activeMethod : ''}`}
                                    onClick={() => setConnectMethod('link')}
                                >
                                    <TelegramIcon size={14} />
                                    Direct Link
                                </button>
                            </div>
                        )}

                        {/* QR Code Scanner (Default, easiest for users) */}
                        {deepLink && connectMethod === 'qr' ? (
                            <div className={styles.qrCodeWrapper}>
                                <div className={styles.qrContainer}>
                                    {qrDataUrl ? (
                                        <img
                                            src={qrDataUrl}
                                            alt="Scan QR code to connect Telegram"
                                            className={styles.qrImage}
                                        />
                                    ) : (
                                        <div className={styles.qrPlaceholder}>
                                            <Loader size="md" />
                                        </div>
                                    )}
                                    <div className={styles.qrCenterLogoWrap}>
                                        <img
                                            src="/assets/logo/cx-mark.png"
                                            alt="ChronosX"
                                            className={styles.qrCenterLogo}
                                            onError={(e) => {
                                                e.currentTarget.src = '/assets/logo/smallLogo.png';
                                            }}
                                        />
                                    </div>
                                </div>
                                <p className={styles.qrHintText}>
                                    Point your phone camera or Telegram scanner at this QR code to connect <strong>instantly</strong>.
                                </p>
                            </div>
                        ) : null}

                        {/* Step-by-step instructions for Direct Link */}
                        {deepLink && connectMethod === 'link' ? (
                            <div className={styles.connectionSteps}>
                                <div className={styles.stepRow}>
                                    <span className={styles.stepNum}>1</span>
                                    <p className={styles.stepText}>
                                        Tap <strong>Open in Telegram</strong> below. Your browser will launch the ChronosX bot.
                                    </p>
                                </div>
                                <div className={styles.stepRow}>
                                    <span className={styles.stepNum}>2</span>
                                    <p className={styles.stepText}>
                                        Press <strong>START</strong> inside Telegram to instantly link your account.
                                    </p>
                                </div>
                                <div className={styles.stepRow}>
                                    <span className={styles.stepNum}>3</span>
                                    <p className={styles.stepText}>
                                        This page will automatically update once the bot confirms your connection.
                                    </p>
                                </div>
                            </div>
                        ) : null}

                        {/* Deep-link CTA */}
                        {deepLink ? (
                            <a
                                href={deepLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.deepLinkBtn}
                                id="tg-deep-link-btn"
                            >
                                <TelegramIcon size={18} />
                                Open in Telegram
                                <ExternalLinkIcon size={13} />
                            </a>
                        ) : null}

                        {/* OTP fallback */}
                        {otpCode ? (
                            <div className={styles.otpSection}>
                                <p className={styles.otpLabel}>
                                    Can&apos;t use the link? Send this code to the bot manually:
                                </p>
                                <div className={styles.otpCodeRow}>
                                    <div className={styles.otpCode}>
                                        <span className={styles.otpDigits}>{otpCode}</span>
                                    </div>
                                    <OtpCopyButton code={otpCode} />
                                </div>
                            </div>
                        ) : null}

                        {/* Expires countdown */}
                        {modalData?.expires_in_seconds ? (
                            <ExpiresCountdown expiresInSeconds={modalData.expires_in_seconds} isLight={isLightMode} />
                        ) : null}

                        {/* Polling indicator */}
                        <div className={styles.pollingRow}>
                            <span className={styles.pollingDot} />
                            Waiting for Telegram confirmation…
                        </div>
                    </>
                )}

                {/* ── Community channel CTA ── */}
                {channelUrl && !isConnected && !modalLoading && (
                    <>
                        <div className={styles.modalDivider} />
                        <div className={styles.channelCtaStrip}>
                            <p className={styles.channelCtaText}>
                                <strong>Join the public channel</strong> to see every signal broadcast in real-time.
                            </p>
                            <a
                                href={channelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.channelCtaLink}
                            >
                                <TelegramIcon size={12} />
                                Join Channel
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
