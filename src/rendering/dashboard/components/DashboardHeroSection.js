'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../dashboard.module.scss';

export default function DashboardHeroSection({
    greeting,
    name,
    dailyCreditChartData,
    chartTimeframe,
    setChartTimeframe,
    activeHoverPoint,
    setActiveHoverPoint
}) {
    const { t } = useLanguage();

    return (
        <section className={styles.hologramHero}>
            <div className={styles.heroGrid}>
                {/* Left: Greeting & Fast Action Triggers */}
                <div className={styles.heroLeftCol}>
           

                    <h1 className={styles.heroHeadline}>
                        {greeting}, <span className={styles.nameGradient}>{name || t('dashboard.traderFallback', 'Trader')}!</span> 
                    </h1>

                    <p className={styles.heroSubtext}>
                        {t('dashboard.heroSubtext', 'Real-time multi-timeframe algorithmic pattern detection, neural OCR chart vision, and automated institutional trade setups.')}
                    </p>
                </div>

                {/* Dynamic Daily AI Credit Consumption Graph */}
                <div className={styles.heroChartSection}>
                    <div className={styles.chartHeaderRow}>
                        <div className={styles.chartTitleGroup}>
                            <span className={styles.chartPulseDot} />
                            <div className={styles.titleTextCol}>
                                <span className={styles.chartTitle}>{t('dashboard.creditChartTitle', 'Daily AI Credit Consumption')}</span>
                                <span className={styles.chartSubtitle}>{t('dashboard.creditChartSubtitle', 'Track credit usage per day across AI Chart Scanner & AI Market Assistant')}</span>
                            </div>
                        </div>

                        <div className={styles.headerRightGroup}>
                            <div className={styles.chartSubBadge}>
                                <span>{t('dashboard.totalCreditsUsedPrefix', 'Total:')} {dailyCreditChartData.totalUsed} {t('dashboard.totalCreditsUsedSuffix', 'Credits Used')}</span>
                            </div>

                            <div className={styles.timeframeFilterGroup}>
                                {['7D', '30D', '90D'].map((tf) => (
                                    <button
                                        key={tf}
                                        type="button"
                                        className={`${styles.tfBtn} ${chartTimeframe === tf ? styles.activeTf : ''}`}
                                        onClick={() => setChartTimeframe && setChartTimeframe(tf)}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Interactive Distortion-Free SVG Spline Canvas */}
                    <div className={styles.splineCanvasWrap}>
                        {activeHoverPoint && (
                            <div
                                className={styles.floatingChartTooltip}
                                style={{
                                    left: `${activeHoverPoint.xPercent}%`,
                                    top: `${Math.max(10, activeHoverPoint.yPercent - 15)}%`
                                }}
                            >
                                <span className={styles.tooltipDay}>{activeHoverPoint.dateFormatted}:</span>
                                <span className={styles.tooltipVal}>{activeHoverPoint.credits} {t('dashboard.credits', 'Credits')}</span>
                            </div>
                        )}

                        <div className={styles.chartCanvasInner} onMouseLeave={() => setActiveHoverPoint(null)}>
                            <svg viewBox="0 0 1000 170" preserveAspectRatio="none" className={styles.splineSvg}>
                                <defs>
                                    <linearGradient id="creditAreaGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#18C98B" stopOpacity="0.32" />
                                        <stop offset="60%" stopColor="#18C98B" stopOpacity="0.05" />
                                        <stop offset="100%" stopColor="#18C98B" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="creditLineStroke" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#00F2FE" />
                                        <stop offset="50%" stopColor="#18C98B" />
                                        <stop offset="100%" stopColor="#6EE7B7" />
                                    </linearGradient>
                                </defs>

                                {/* Subtle Horizontal Gridlines */}
                                <line x1="0" y1="35" x2="1000" y2="35" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="5 5" />
                                <line x1="0" y1="85" x2="1000" y2="85" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="5 5" />
                                <line x1="0" y1="135" x2="1000" y2="135" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="5 5" />

                                {/* Smooth Bezier Spline Area Fill & Stroke */}
                                <path d={dailyCreditChartData.pathArea} fill="url(#creditAreaGlow)" />
                                <path d={dailyCreditChartData.pathLine} fill="none" stroke="url(#creditLineStroke)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            {/* Crisp HTML Data Point Markers (100% Round & Distortion-Free) */}
                            <div className={styles.chartPointsOverlay}>
                                {(dailyCreditChartData.displayPoints || dailyCreditChartData.points || []).map((pt) => {
                                    const isHovered = activeHoverPoint?.dateKey === pt.dateKey;
                                    return (
                                        <div
                                            key={pt.dateKey}
                                            className={`${styles.dataPointMarker} ${isHovered ? styles.activeMarker : ''} ${pt.isToday ? styles.todayMarker : ''}`}
                                            style={{ left: `${pt.xPercent}%`, top: `${pt.yPercent}%` }}
                                            onMouseEnter={() => setActiveHoverPoint(pt)}
                                        >
                                            <span className={styles.pointHalo} />
                                            <span className={styles.pointDot} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* X-Axis Time Labels displaying Clean Dates */}
                        <div className={styles.chartTimeLabels}>
                            {(dailyCreditChartData.labels || dailyCreditChartData.points || []).map((pt) => (
                                <div key={pt.dateKey} className={`${styles.dayLabelItem} ${pt.isToday ? styles.todayLabel : ''}`}>
                                    <span className={styles.dayName}>{pt.dateFormatted}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
