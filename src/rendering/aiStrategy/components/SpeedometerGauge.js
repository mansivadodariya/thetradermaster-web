'use client';

import React, { useState, useEffect, useId } from 'react';
import styles from '../aiStrategy.module.scss';
import { useTheme } from '@/context/ThemeContext';

export default function SpeedometerGauge({
    score = 50,
    label = '',
    confidence = '',
    size = 'normal',
    showLabels = true,
    customMax = 100,
    mode = 'labels' // 'numeric' (0 to 100 numbers) or 'labels' (Bull/Bear strings)
}) {
    const { theme } = useTheme();
    const isDark = theme !== 'light';

    const trackColor = isDark ? '#1F242C' : '#E2E8F0';
    const needleColor = isDark ? '#FFFFFF' : '#1E293B';
    const defaultTextColor = isDark ? '#94A3B8' : '#64748B';
    const textPrimary = isDark ? '#FFFFFF' : '#0F172A';

    const rawTargetScore = Math.max(0, Math.min(customMax, Number(score) || 0));
    // Normalize to 0-100 scale
    let normalizedScore = customMax === 100 ? rawTargetScore : Math.round((rawTargetScore / customMax) * 100);

    // If mode === 'labels' and an explicit sentiment label is provided, calibrate needle to the correct semantic zone:
    const normalizedLabel = (label || '').toUpperCase();
    if (mode === 'labels' && normalizedLabel) {
        if (normalizedLabel === 'BULLISH' || (normalizedLabel.includes('BULL') && !normalizedLabel.includes('STRONG'))) {
            // "BULLISH" zone is centered around 74%. Prevent overflow into Strong Bullish (>80%)
            if (normalizedScore > 80 || normalizedScore < 60) {
                normalizedScore = 74;
            }
        } else if (normalizedLabel === 'BEARISH' || (normalizedLabel.includes('BEAR') && !normalizedLabel.includes('STRONG'))) {
            // "BEARISH" zone is centered around 26%. Prevent underflow into Strong Bearish (<20%)
            if (normalizedScore > 40 || normalizedScore < 20) {
                normalizedScore = 26;
            }
        } else if (normalizedLabel === 'NEUTRAL') {
            if (normalizedScore > 60 || normalizedScore < 40) {
                normalizedScore = 50;
            }
        } else if (normalizedLabel.includes('STRONG') && normalizedLabel.includes('BULL')) {
            if (normalizedScore < 85) {
                normalizedScore = 96;
            }
        } else if (normalizedLabel.includes('STRONG') && normalizedLabel.includes('BEAR')) {
            if (normalizedScore > 15) {
                normalizedScore = 8;
            }
        }
    }

    const [animatedScore, setAnimatedScore] = useState(0);
    const gradientId = useId().replace(/:/g, '_') + 'speedometerGrad';

    // Growing animation on first load or when score changes
    useEffect(() => {
        let frameId;
        const start = 0;
        const target = normalizedScore;
        const duration = 850;
        const startTime = performance.now();

        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(start + (target - start) * ease));

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);
        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [normalizedScore]);

    // Determine Bullish / Bearish Sentiment State
    let activeZone = 'neutral';
    let activeName = 'NEUTRAL';
    let activeColor = '#EAB308';

    if (normalizedLabel.includes('STRONG') && (normalizedLabel.includes('BEAR') || normalizedLabel.includes('SELL'))) {
        activeZone = 'strong_bearish';
        activeName = 'STRONG BEARISH';
        activeColor = '#EF4444';
    } else if (normalizedLabel.includes('BEAR') || normalizedLabel.includes('SELL')) {
        activeZone = 'bearish';
        activeName = 'BEARISH';
        activeColor = '#EF4444';
    } else if (normalizedLabel.includes('STRONG') && (normalizedLabel.includes('BULL') || normalizedLabel.includes('BUY'))) {
        activeZone = 'strong_bullish';
        activeName = 'STRONG BULLISH';
        activeColor = '#18C98B';
    } else if (normalizedLabel.includes('BULL') || normalizedLabel.includes('BUY')) {
        activeZone = 'bullish';
        activeName = 'BULLISH';
        activeColor = '#18C98B';
    } else {
        if (animatedScore < 20) {
            activeZone = 'strong_bearish';
            activeName = 'STRONG BEARISH';
            activeColor = '#EF4444';
        } else if (animatedScore < 40) {
            activeZone = 'bearish';
            activeName = 'BEARISH';
            activeColor = '#EF4444';
        } else if (animatedScore <= 60) {
            activeZone = 'neutral';
            activeName = 'NEUTRAL';
            activeColor = '#EAB308';
        } else if (animatedScore <= 80) {
            activeZone = 'bullish';
            activeName = 'BULLISH';
            activeColor = '#18C98B';
        } else {
            activeZone = 'strong_bullish';
            activeName = 'STRONG BULLISH';
            activeColor = '#18C98B';
        }
    }

    // Needle Angle: -90deg at 0 score, 0deg at 50, +90deg at 100 score
    const needleAngle = (animatedScore / 100) * 180 - 90;

    // SVG arc dimensions - Sized and spaced for clear, non-overlapping labels
    const cx = 195;
    const cy = 126;
    const r = 78;
    const arcCircumference = Math.PI * r; // ~245.0
    const filledLength = (animatedScore / 100) * arcCircumference;

    const displayScore = customMax === 100 ? animatedScore : Math.round((animatedScore / 100) * customMax);

    return (
        <div className={styles.speedometerContainer}>
            <div className={styles.speedometerSvgWrapper}>
                <svg
                    viewBox="0 0 390 215"
                    className={styles.speedometerSvg}
                >
                    <defs>
                        {/* Rich Multi-zone Gradient Arc: Red (Bearish) to Theme Green (Bullish) */}
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="25%" stopColor="#F97316" />
                            <stop offset="50%" stopColor="#EAB308" />
                            <stop offset="75%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#18C98B" />
                        </linearGradient>
                    </defs>

                    {showLabels && (
                        mode === 'numeric' ? (
                            <>
                                {/* TECHNICAL SCORE: 0 to 100 Numeric Scale Markers */}
                                <text x={cx - r - 16} y={cy} textAnchor="end" dominantBaseline="central" fontSize="13" fontWeight="700" fill={animatedScore <= 10 ? '#EF4444' : defaultTextColor} fontFamily="monospace">0</text>
                                <text x="120" y="66" textAnchor="middle" fontSize="13" fontWeight="700" fill={animatedScore > 10 && animatedScore <= 30 ? '#F97316' : defaultTextColor} fontFamily="monospace">20</text>
                                <text x="160" y="35" textAnchor="middle" fontSize="13" fontWeight="700" fill={animatedScore > 30 && animatedScore <= 50 ? '#EAB308' : defaultTextColor} fontFamily="monospace">40</text>
                                <text x="230" y="35" textAnchor="middle" fontSize="13" fontWeight="700" fill={animatedScore > 50 && animatedScore <= 70 ? '#84CC16' : defaultTextColor} fontFamily="monospace">60</text>
                                <text x="270" y="66" textAnchor="middle" fontSize="13" fontWeight="700" fill={animatedScore > 70 && animatedScore <= 90 ? '#10B981' : defaultTextColor} fontFamily="monospace">80</text>
                                <text x={cx + r + 16} y={cy} textAnchor="start" dominantBaseline="central" fontSize="13" fontWeight="700" fill={animatedScore > 90 ? '#18C98B' : defaultTextColor} fontFamily="monospace">100</text>
                            </>
                        ) : (
                            <>
                                {/* TREND SPEEDOMETER: Sentiment Zone Labels with ample clearance */}
                                <text
                                    x={cx - r - 18}
                                    y={cy}
                                    textAnchor="end"
                                    dominantBaseline="central"
                                    fontSize="11.5"
                                    fontWeight={activeZone === 'strong_bearish' ? '800' : '700'}
                                    fill={activeZone === 'strong_bearish' ? '#EF4444' : defaultTextColor}
                                    letterSpacing="0.2px"
                                >
                                    Strong Bearish
                                </text>

                                <text
                                    x="120"
                                    y="51"
                                    textAnchor="middle"
                                    fontSize="12.5"
                                    fontWeight={activeZone === 'bearish' ? '800' : '700'}
                                    fill={activeZone === 'bearish' ? '#EF4444' : defaultTextColor}
                                >
                                    Bearish
                                </text>

                                <text
                                    x={cx}
                                    y="25"
                                    textAnchor="middle"
                                    fontSize="13"
                                    fontWeight={activeZone === 'neutral' ? '800' : '700'}
                                    fill={activeZone === 'neutral' ? '#EAB308' : defaultTextColor}
                                >
                                    Neutral
                                </text>

                                <text
                                    x="270"
                                    y="51"
                                    textAnchor="middle"
                                    fontSize="12.5"
                                    fontWeight={activeZone === 'bullish' ? '800' : '700'}
                                    fill={activeZone === 'bullish' ? '#18C98B' : defaultTextColor}
                                >
                                    Bullish
                                </text>

                                <text
                                    x={cx + r + 18}
                                    y={cy}
                                    textAnchor="start"
                                    dominantBaseline="central"
                                    fontSize="11.5"
                                    fontWeight={activeZone === 'strong_bullish' ? '800' : '700'}
                                    fill={activeZone === 'strong_bullish' ? '#18C98B' : defaultTextColor}
                                    letterSpacing="0.2px"
                                >
                                    Strong Bullish
                                </text>
                            </>
                        )
                    )}

                    {/* Background Arc Track */}
                    <path
                        d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                        fill="none"
                        stroke={trackColor}
                        strokeWidth="9.5"
                        strokeLinecap="round"
                    />

                    {/* Active Gradient Colored Arc */}
                    <path
                        d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="9.5"
                        strokeLinecap="round"
                        strokeDasharray={`${filledLength} ${arcCircumference}`}
                        style={{
                            transition: 'stroke-dasharray 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                            filter: `drop-shadow(0 0 8px ${activeColor}66)`
                        }}
                    />

                    {/* Rotating Indicator Needle with Center Pin - TradeSnap Style */}
                    <g
                        transform={`translate(${cx}, ${cy}) rotate(${needleAngle})`}
                        style={{
                            transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                            transformOrigin: '0px 0px'
                        }}
                    >
                        {/* Invisible symmetrical boundary to lock bounding box center to (0, 0) */}
                        <circle cx="0" cy="0" r={r - 10} fill="none" opacity="0" pointerEvents="none" />

                        {/* Needle stem pointer */}
                        <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2={-(r - 14)}
                            stroke={needleColor}
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            style={{
                                filter: isDark
                                    ? 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))'
                                    : 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.35))'
                            }}
                        />

                        {/* Sleek needle tip pointer */}
                        <polygon
                            points={`-3,-10 3,-10 0,${-(r - 13)}`}
                            fill={needleColor}
                        />

                        {/* Attached Center Pivot Dot */}
                        <circle
                            cx="0"
                            cy="0"
                            r="6.5"
                            fill={activeColor}
                            style={{
                                filter: isDark
                                    ? `drop-shadow(0 0 6px ${activeColor}99)`
                                    : 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.2))'
                            }}
                        />
                        <circle
                            cx="0"
                            cy="0"
                            r="2.6"
                            fill={isDark ? '#FFFFFF' : '#0F172A'}
                        />
                    </g>

                    {/* Status Label below needle pivot (e.g. BULLISH) */}
                    <text
                        x={cx}
                        y={cy + 30}
                        textAnchor="middle"
                        fontSize="17.5"
                        fontWeight="800"
                        fill={activeColor}
                        letterSpacing="0.8px"
                        fontFamily="'Euclid-Bold', 'Inter', sans-serif"
                    >
                        {activeName}
                    </text>

                    {/* Numeric Score readout (e.g. 75/100) */}
                    <text
                        x={cx}
                        y={cy + 52}
                        textAnchor="middle"
                        fontFamily="monospace"
                    >
                        <tspan fontSize="20" fontWeight="800" fill={textPrimary}>{displayScore}</tspan>
                        <tspan fontSize="14" fontWeight="600" fill={defaultTextColor}>/{customMax}</tspan>
                    </text>

                    {/* Confidence Footer (e.g. CONFIDENCE: 50%) */}
                    {confidence && confidence !== '-' && (
                        <text
                            x={cx}
                            y={cy + 70}
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight="700"
                            letterSpacing="0.5px"
                            fontFamily="'Euclid-Bold', 'Inter', sans-serif"
                        >
                            <tspan fill={defaultTextColor}>CONFIDENCE: </tspan>
                            <tspan fill={activeColor} fontWeight="800">{confidence}</tspan>
                        </text>
                    )}
                </svg>
            </div>
        </div>
    );
}
