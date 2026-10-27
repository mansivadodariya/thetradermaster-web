'use client';

import styles from '@/rendering/aiStrategy/aiStrategy.module.scss';

// SVG Icon Components
export const ChevronIcon = ({ isOpen, className }) => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0
        }}
        className={className}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

export const TrendArrowIcon = ({ direction, className }) => {
    const isUp = direction?.toLowerCase().includes('bull') || direction?.toLowerCase().includes('buy') || direction?.toLowerCase().includes('up') || direction === 'Above';
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isUp ? '#10b981' : '#ef4444'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                transform: isUp ? 'rotate(0deg)' : 'rotate(180deg)',
                flexShrink: 0
            }}
            className={className}
        >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
        </svg>
    );
};

export const CircleCheckIcon = ({ color = '#10b981' }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: '8px', flexShrink: 0, marginTop: '2px' }}
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export const IndicatorIcon = ({ type }) => {
    switch (type) {
        case 'trend':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            );
        case 'momentum':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            );
        case 'volume':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            );
        case 'structure':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                </svg>
            );
        default:
            return null;
    }
};

export const BrainRobotIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 7.54 16.59A6 6 0 0 0 14 13h-4a6 6 0 0 0-5.54 5.59A10 10 0 0 1 12 2z" />
        <circle cx="12" cy="10" r="3" />
        <path d="M8 18h8" />
    </svg>
);

export const TrendBoxIcon = ({ isBullish }) => (
    <div className={`${styles.trendBoxIcon} ${isBullish ? styles.bullish : styles.bearish}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isBullish ? (
                <>
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                </>
            ) : (
                <>
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                    <polyline points="17 18 23 18 23 12" />
                </>
            )}
        </svg>
    </div>
);

// Helper functions for parsing colors and values
export function getScoreColor(label = '') {
    const l = label.toLowerCase();
    if (l.includes('bullish') || l.includes('buying') || l.includes('buy') || l.includes('oversold')) return '#10b981';
    if (l.includes('bearish') || l.includes('selling') || l.includes('sell') || l.includes('overbought')) return '#ef4444';
    return '#38BDF8'; // Neutral / Ranging
}

export function formatValue(val) {
    if (typeof val !== 'number' || isNaN(val)) return '-';
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 });
}

export function formatVolVal(val) {
    if (typeof val !== 'number' || isNaN(val)) return '-';
    if (val === 0) return '0';
    if (val >= 10000000) return `${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `${(val / 100000).toFixed(2)}L`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toString();
}

export const accordionVariants = {
    collapsed: { opacity: 0, height: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
    expanded: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
};
