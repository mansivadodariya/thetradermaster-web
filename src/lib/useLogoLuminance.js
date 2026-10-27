'use client';

import { useState, useEffect } from 'react';

// Cache detection results so multiple cards with same logo or re-renders don't re-compute
const luminanceCache = new Map();

/**
 * Fast synchronous check for known SVG / flags / IDs
 */
export function checkIsDarkLogoFallback(broker) {
    if (!broker) return false;
    if (typeof broker.isDarkLogo === 'boolean') return broker.isDarkLogo;
    if (typeof broker.darkLogo === 'boolean') return broker.darkLogo;
    if (typeof broker.is_dark_logo === 'boolean') return broker.is_dark_logo;
    if (typeof broker.dark_logo === 'boolean') return broker.dark_logo;

    const id = String(broker.id || '').toLowerCase();
    const name = String(broker.name || '').toLowerCase();
    const logo = String(broker.logo || '');

    // Known dark logo brokers
    if (
        id.includes('avatrade') || name.includes('avatrade') ||
        id.includes('blueberry') || name.includes('blueberry') ||
        id.includes('multibank') || name.includes('multibank')
    ) {
        return true;
    }

    // Check SVG data URL directly
    if (logo.startsWith('data:image/svg+xml')) {
        try {
            const base64Part = logo.split(',')[1];
            if (base64Part && typeof atob !== 'undefined') {
                const svgText = atob(base64Part);
                return analyzeSvgColors(svgText);
            }
        } catch (_) {}
    }

    return false;
}

function analyzeSvgColors(svgString) {
    const colorMatches = svgString.match(/#(?:[0-9a-fA-F]{3,8})|rgba?\([^)]+\)|(?:fill|stroke)=["']([a-zA-Z]+)["']/g) || [];
    let darkCount = 0;
    let lightCount = 0;

    colorMatches.forEach(c => {
        let hex = c.replace(/^(?:fill|stroke)=["']|["']$/g, '');
        if (hex === 'none' || hex === 'transparent') return;
        if (hex === 'white') { lightCount++; return; }
        if (hex === 'black') { darkCount++; return; }
        if (hex.startsWith('#')) {
            let r, g, b;
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            } else if (hex.length >= 7) {
                r = parseInt(hex.substring(1, 3), 16);
                g = parseInt(hex.substring(3, 5), 16);
                b = parseInt(hex.substring(5, 7), 16);
            }
            if (r !== undefined) {
                const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                if (lum < 140) darkCount++;
                else lightCount++;
            }
        }
    });

    return darkCount > lightCount;
}

/**
 * Hook to dynamically detect if a broker logo has dark colors and needs a white background
 */
export function useLogoLuminance(broker) {
    const logoUrl = broker?.logo || '';
    const initialFallback = checkIsDarkLogoFallback(broker);

    const [isDarkLogo, setIsDarkLogo] = useState(() => {
        if (!logoUrl) return initialFallback;
        if (luminanceCache.has(logoUrl)) {
            return luminanceCache.get(logoUrl);
        }
        return initialFallback;
    });

    useEffect(() => {
        if (!logoUrl) {
            setIsDarkLogo(initialFallback);
            return;
        }

        if (luminanceCache.has(logoUrl)) {
            setIsDarkLogo(luminanceCache.get(logoUrl));
            return;
        }

        // Try SVG detection if SVG data URI
        if (logoUrl.startsWith('data:image/svg+xml')) {
            try {
                const base64Part = logoUrl.split(',')[1];
                if (base64Part && typeof window !== 'undefined') {
                    const svgText = window.atob(base64Part);
                    const isDark = analyzeSvgColors(svgText);
                    luminanceCache.set(logoUrl, isDark);
                    setIsDarkLogo(isDark);
                    return;
                }
            } catch (_) {}
        }

        // Try HTML5 Canvas sampling for raster formats (PNG, WebP, JPEG, etc.)
        if (typeof window !== 'undefined') {
            const img = new Image();
            if (!logoUrl.startsWith('data:')) {
                img.crossOrigin = 'anonymous';
            }

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    if (!ctx) return;

                    const w = Math.min(img.naturalWidth || 60, 60);
                    const h = Math.min(img.naturalHeight || 30, 30);
                    if (w <= 0 || h <= 0) return;

                    canvas.width = w;
                    canvas.height = h;
                    ctx.drawImage(img, 0, 0, w, h);

                    const imgData = ctx.getImageData(0, 0, w, h);
                    const d = imgData.data;
                    let totalLum = 0;
                    let visiblePixels = 0;
                    let darkPixels = 0;

                    for (let i = 0; i < d.length; i += 4) {
                        const alpha = d[i + 3];
                        if (alpha > 40) {
                            const r = d[i];
                            const g = d[i + 1];
                            const b = d[i + 2];
                            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                            totalLum += lum;
                            visiblePixels++;
                            if (lum < 140) darkPixels++;
                        }
                    }

                    if (visiblePixels > 0) {
                        const avgLum = totalLum / visiblePixels;
                        const darkRatio = darkPixels / visiblePixels;
                        const detectedDark = avgLum < 140 || darkRatio > 0.5;
                        luminanceCache.set(logoUrl, detectedDark);
                        setIsDarkLogo(detectedDark);
                    }
                } catch (e) {
                    // If tainted canvas or CORS issue, fall back to initial heuristic
                    luminanceCache.set(logoUrl, initialFallback);
                }
            };

            img.onerror = () => {
                luminanceCache.set(logoUrl, initialFallback);
            };

            img.src = logoUrl;
        }
    }, [logoUrl, initialFallback]);

    return isDarkLogo;
}
