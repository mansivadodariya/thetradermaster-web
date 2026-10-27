'use client';

import React from 'react';
import styles from './loader.module.scss';
import { useTheme } from '@/context/ThemeContext';

/**
 * High-tech Dual-Ring Orbital Loader with Center CX Logo
 * size: 'sm' | 'md' (default) | 'lg' | 'xl' | '2xl'
 * centered: wraps in a flex container that fills available space
 * showLogo: whether to display the central CX logo (default: true)
 * text: optional status label rendered below the spinner
 */
export default function Loader({
    size = 'md',
    centered = false,
    className = '',
    showLogo = false,
    text = null
}) {
    let isLight = false;
    try {
        const themeCtx = useTheme();
        isLight = themeCtx?.theme === 'light';
    } catch (_) {}

    const sizeClass = size === '2xl' ? styles.size2xl : (styles[size] || styles.md);

    const spinner = (
        <div
            className={`${styles.loaderWrapper} ${sizeClass} ${isLight ? styles.themeLight : ''} ${className}`}
            aria-label="Loading"
            role="status"
        >
            <div className={styles.outerRing} />
            <div className={styles.innerRing} />
        </div>
    );

    if (text) {
        const withText = (
            <div className={styles.loaderWithText}>
                {spinner}
                <span className={styles.loaderText}>{text}</span>
            </div>
        );
        return centered ? <div className={styles.centered}>{withText}</div> : withText;
    }

    if (centered) {
        return <div className={styles.centered}>{spinner}</div>;
    }

    return spinner;
}
