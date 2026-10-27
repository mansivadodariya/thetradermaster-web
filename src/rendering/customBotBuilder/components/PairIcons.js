'use client';

import React from 'react';

// Crisp, scalable SVG vector icons for currencies, commodities, crypto & indices
export const ASSET_ICONS = {
    EUR: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <circle cx="10" cy="10" r="10" fill="#003399" />
            <circle cx="10" cy="3.5" r="0.9" fill="#FFCC00" />
            <circle cx="10" cy="16.5" r="0.9" fill="#FFCC00" />
            <circle cx="3.5" cy="10" r="0.9" fill="#FFCC00" />
            <circle cx="16.5" cy="10" r="0.9" fill="#FFCC00" />
            <circle cx="5.4" cy="5.4" r="0.9" fill="#FFCC00" />
            <circle cx="14.6" cy="5.4" r="0.9" fill="#FFCC00" />
            <circle cx="5.4" cy="14.6" r="0.9" fill="#FFCC00" />
            <circle cx="14.6" cy="14.6" r="0.9" fill="#FFCC00" />
        </svg>
    ),
    USD: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <clipPath id="usdCircleClip">
                <circle cx="10" cy="10" r="10" />
            </clipPath>
            <g clipPath="url(#usdCircleClip)">
                <rect width="20" height="20" fill="#B22234" />
                <path d="M0 2.8h20v2.8H0zm0 5.6h20v2.8H0zm0 5.6h20v2.8H0z" fill="#FFFFFF" />
                <rect width="9" height="10" fill="#3C3B6E" />
                <circle cx="2.5" cy="3" r="0.8" fill="#FFFFFF" />
                <circle cx="6.5" cy="3" r="0.8" fill="#FFFFFF" />
                <circle cx="4.5" cy="5.5" r="0.8" fill="#FFFFFF" />
                <circle cx="2.5" cy="8" r="0.8" fill="#FFFFFF" />
                <circle cx="6.5" cy="8" r="0.8" fill="#FFFFFF" />
            </g>
        </svg>
    ),
    GBP: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <clipPath id="gbpCircleClip">
                <circle cx="10" cy="10" r="10" />
            </clipPath>
            <g clipPath="url(#gbpCircleClip)">
                <rect width="20" height="20" fill="#012169" />
                <path d="M0 0l20 20M20 0L0 20" stroke="#FFFFFF" strokeWidth="3.2" />
                <path d="M0 0l20 20M20 0L0 20" stroke="#C8102E" strokeWidth="1.6" />
                <path d="M10 0v20M0 10h20" stroke="#FFFFFF" strokeWidth="5.5" />
                <path d="M10 0v20M0 10h20" stroke="#C8102E" strokeWidth="3.2" />
            </g>
        </svg>
    ),
    JPY: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
            <circle cx="10" cy="10" r="4.8" fill="#BC002D" />
        </svg>
    ),
    AUD: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <clipPath id="audCircleClip">
                <circle cx="10" cy="10" r="10" />
            </clipPath>
            <g clipPath="url(#audCircleClip)">
                <rect width="20" height="20" fill="#00008B" />
                <rect width="9" height="8" fill="#012169" />
                <path d="M0 0l9 8M9 0L0 8" stroke="#FFFFFF" strokeWidth="1.8" />
                <path d="M0 0l9 8M9 0L0 8" stroke="#C8102E" strokeWidth="0.9" />
                <path d="M4.5 0v8M0 4h9" stroke="#FFFFFF" strokeWidth="2.8" />
                <path d="M4.5 0v8M0 4h9" stroke="#C8102E" strokeWidth="1.6" />
                <circle cx="4.5" cy="13.5" r="1.5" fill="#FFFFFF" />
                <circle cx="14.5" cy="5" r="1" fill="#FFFFFF" />
                <circle cx="16" cy="9.5" r="0.8" fill="#FFFFFF" />
                <circle cx="14.5" cy="14" r="1" fill="#FFFFFF" />
                <circle cx="12" cy="10" r="0.8" fill="#FFFFFF" />
            </g>
        </svg>
    ),
    CAD: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <clipPath id="cadCircleClip">
                <circle cx="10" cy="10" r="10" />
            </clipPath>
            <g clipPath="url(#cadCircleClip)">
                <rect width="20" height="20" fill="#FF0000" />
                <rect x="5" width="10" height="20" fill="#FFFFFF" />
                <path d="M10 4.5l1 2.2 2-.5-1 2 2 1.2-2.5.8.5 2-2-1-.5 2-.5-2-2 1 .5-2-2.5-.8 2-1.2-1-2 2 .5z" fill="#FF0000" />
            </g>
        </svg>
    ),
    CHF: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <circle cx="10" cy="10" r="10" fill="#D52B1E" />
            <rect x="8.5" y="4.5" width="3" height="11" fill="#FFFFFF" />
            <rect x="4.5" y="8.5" width="11" height="3" fill="#FFFFFF" />
        </svg>
    ),
    XAU: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <defs>
                <linearGradient id="goldGradSelect" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
            </defs>
            <circle cx="10" cy="10" r="10" fill="url(#goldGradSelect)" />
            <path d="M5.5 8h9l-1.5 5h-6z" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="10" cy="6.5" r="1" fill="#FFFFFF" opacity="0.85" />
        </svg>
    ),
    BTC: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <circle cx="10" cy="10" r="10" fill="#F7931A" />
            <path d="M12.8 9.1c.3-.8.1-1.7-.7-2-.5-.2-1.2-.2-1.8-.2V5.5h-.9v1.3H8.3v.9h.6c.3 0 .4.1.4.3v4c0 .2-.1.3-.4.3h-.6v.9h1.1v1.3h.9v-1.3c.7 0 1.5 0 2.2-.4.9-.5 1.1-1.6.8-2.5-.2-.5-.6-.9-1.1-1.1.6-.2 1-.7 1.1-1.3zm-2.8-.8h1.1c.5 0 .9.2.9.7 0 .5-.4.7-.9.7h-1.1V8.3zm1.4 3.7h-1.4v-1.7h1.4c.6 0 1 .2 1 .8 0 .6-.4.9-1 .9z" fill="#FFFFFF" />
        </svg>
    ),
    ETH: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <circle cx="10" cy="10" r="10" fill="#627EEA" />
            <path d="M10 4l-4.5 7.5L10 14l4.5-2.5L10 4z" fill="#FFFFFF" opacity="0.8" />
            <path d="M10 4v10l4.5-2.5L10 4z" fill="#FFFFFF" opacity="0.95" />
            <path d="M10 14.8l-4.5-2.6L10 16.5l4.5-4.3-4.5 2.6z" fill="#FFFFFF" opacity="0.8" />
        </svg>
    ),
    US30: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <circle cx="10" cy="10" r="10" fill="#1E3A8A" />
            <text x="10" y="13.5" textAnchor="middle" fill="#60A5FA" fontSize="8" fontWeight="900" fontFamily="sans-serif">30</text>
        </svg>
    ),
    NAS100: (
        <svg viewBox="0 0 20 20" width="100%" height="100%">
            <circle cx="10" cy="10" r="10" fill="#0369A1" />
            <text x="10" y="13.5" textAnchor="middle" fill="#38BDF8" fontSize="7" fontWeight="900" fontFamily="sans-serif">100</text>
        </svg>
    ),
    TIMEFRAME: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    INDICATOR: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    )
};

const PAIR_MAP = {
    'EUR/USD': { base: 'EUR', quote: 'USD' },
    'GBP/USD': { base: 'GBP', quote: 'USD' },
    'GBP/JPY': { base: 'GBP', quote: 'JPY' },
    'EUR/JPY': { base: 'EUR', quote: 'JPY' },
    'USD/CAD': { base: 'USD', quote: 'CAD' },
    'USD/JPY': { base: 'USD', quote: 'JPY' },
    'AUD/USD': { base: 'AUD', quote: 'USD' },
    'USD/CHF': { base: 'USD', quote: 'CHF' },
    'XAU/USD': { base: 'XAU', quote: 'USD' },
    'BTC/USD': { base: 'BTC', quote: 'USD' },
    'ETH/USD': { base: 'ETH', quote: 'USD' },
    'US30': { base: 'US30', quote: 'USD' },
    'NAS100': { base: 'NAS100', quote: 'USD' }
};

export function PairDualIcon({ pairKey, size = 18 }) {
    if (!pairKey) return null;
    const cleanKey = String(pairKey).split(' ')[0].trim();
    const config = PAIR_MAP[cleanKey] || PAIR_MAP[pairKey];

    if (!config) {
        return null;
    }

    const baseSvg = ASSET_ICONS[config.base];
    const quoteSvg = config.quote ? ASSET_ICONS[config.quote] : null;
    const overlap = Math.round(size * 0.35);
    const totalWidth = quoteSvg ? (size * 2 - overlap) : size;

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                position: 'relative',
                flexShrink: 0,
                width: `${totalWidth}px`,
                height: `${size}px`,
                marginRight: '8px',
                verticalAlign: 'middle'
            }}
        >
            <span
                style={{
                    display: 'inline-flex',
                    width: `${size}px`,
                    height: `${size}px`,
                    position: 'relative',
                    zIndex: 2,
                    borderRadius: '50%',
                    boxShadow: '0 0 3px rgba(0,0,0,0.5)',
                    flexShrink: 0
                }}
            >
                {baseSvg}
            </span>
            {quoteSvg && (
                <span
                    style={{
                        display: 'inline-flex',
                        width: `${size}px`,
                        height: `${size}px`,
                        position: 'relative',
                        marginLeft: `-${overlap}px`,
                        zIndex: 1,
                        borderRadius: '50%',
                        boxShadow: '0 0 3px rgba(0,0,0,0.5)',
                        flexShrink: 0
                    }}
                >
                    {quoteSvg}
                </span>
            )}
        </span>
    );
}

export function TimeframeIcon({ size = 16 }) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${size}px`,
                height: `${size}px`,
                marginRight: '8px',
                flexShrink: 0,
                color: '#18C98B'
            }}
        >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        </span>
    );
}
