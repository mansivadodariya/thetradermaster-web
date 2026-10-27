import React from 'react';

/**
 * Shared hero feature list for Auth screens (Login, Signup)
 */
export const getHeroFeatures = (t) => [
    {
        title: t('auth.heroFeatures.scannerTitle', 'AI Chart Scanner'),
        desc: t('auth.heroFeatures.scannerDesc', 'Instant neural OCR pattern detection'),
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m7 14 4-4 4 2 5-6" />
                <circle cx="7" cy="14" r="1.2" fill="currentColor" />
                <circle cx="11" cy="10" r="1.2" fill="currentColor" />
                <circle cx="15" cy="12" r="1.2" fill="currentColor" />
                <circle cx="20" cy="6" r="1.2" fill="currentColor" />
            </svg>
        ),
        badge: '98.4%'
    },
    {
        title: t('auth.heroFeatures.terminalTitle', 'Signal Terminal'),
        desc: t('auth.heroFeatures.terminalDesc', 'Real-time breakout & momentum radar'),
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
        badge: 'LIVE'
    },
    {
        title: t('auth.heroFeatures.assistantTitle', 'AI Market Assistant'),
        desc: t('auth.heroFeatures.assistantDesc', '24/7 conversational market copilot'),
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <circle cx="9" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="15" cy="12" r="1.2" fill="currentColor" />
            </svg>
        ),
        badge: 'COPILOT'
    },
    {
        title: t('auth.heroFeatures.signalTitle', 'AI Trading Signal'),
        desc: t('auth.heroFeatures.signalDesc', 'Algorithmic quantitative playbooks'),
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h3l3-7 4 14 3-8 2 4h4" />
                <circle cx="9" cy="5" r="1.2" fill="currentColor" />
                <circle cx="13" cy="19" r="1.2" fill="currentColor" />
            </svg>
        ),
        badge: 'QUANT'
    },
    {
        title: t('auth.heroFeatures.encryptionTitle', 'Bank-Level Encryption'),
        desc: t('auth.heroFeatures.encryptionDesc', '256-bit non-custodial protocol security'),
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        badge: 'SECURE'
    }
];
