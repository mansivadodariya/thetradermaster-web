'use client';

import React from 'react';
import styles from '../styles/strategyStudio.module.scss';
import Loader from '@/components/loader';
import { ChartTrendIcon, AreaChartIcon, PieChartIcon, LightningIcon } from './StudioIcons';

/**
 * High-tech animated chart skeleton and state loader
 */
export default function ChartSkeletonLoader({
    type = 'candlestick',
    symbol = 'EURUSD',
    interval = '15min',
    label = ''
}) {
    if (type === 'candlestick') {
        return (
            <div className={styles.candlestickLoaderStage}>
                {/* Horizontal dashed grid lines */}
                <div className={styles.chartGridLines}>
                    <div className={styles.gridLine} />
                    <div className={styles.gridLine} />
                    <div className={styles.gridLine} />
                    <div className={styles.gridLine} />
                    <div className={styles.gridLine} />
                </div>

                {/* Sweeping laser radar scanline */}
                <div className={styles.scanRadarLine} />

                {/* Overlay with high-tech spinning orbital loader */}
                <div className={styles.chartLoaderOverlay}>
                    <Loader size="md" />
                    <div className={styles.chartLoaderLabel}>
                        <ChartTrendIcon size={14} color="#18C98B" />
                        <span>{label || `Rendering ${symbol} (${interval}) Candlesticks...`}</span>
                    </div>
                    <div className={styles.chartLoaderSub}>
                        Synchronizing trade entry and exit milestones
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'area') {
        return (
            <div className={styles.areaLoaderStage}>
                {/* Horizontal dashed grid lines */}
                <div className={styles.chartGridLines}>
                    <div className={styles.gridLine} />
                    <div className={styles.gridLine} />
                    <div className={styles.gridLine} />
                </div>

                {/* Shimmering wave polygon fill */}
                <div className={styles.waveSkeletonPath} />

                {/* Animated neon spline line */}
                <div className={styles.waveLineTop}>
                    <svg viewBox="0 0 500 120" preserveAspectRatio="none">
                        <path d="M 0,95 Q 75,80 150,100 T 300,65 T 420,35 T 500,18" />
                    </svg>
                </div>

                {/* Centered micro spinner */}
                <div className={styles.chartLoaderOverlay}>
                    <Loader size="md" />
                    <div className={styles.chartLoaderLabel}>
                        <AreaChartIcon size={14} color="#18C98B" />
                        <span>{label || 'Compiling Equity Progression Curve...'}</span>
                    </div>
                    <div className={styles.chartLoaderSub}>
                        Calculating cumulative account balance across executions
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'donut') {
        return (
            <div className={styles.donutLoaderStage}>
                <div className={styles.donutRingWrap}>
                    <svg viewBox="0 0 100 100">
                        <circle className={styles.track} cx="50" cy="50" r="38" />
                        <circle className={styles.segmentWin} cx="50" cy="50" r="38" />
                        <circle className={styles.segmentLoss} cx="50" cy="50" r="38" />
                    </svg>
                    <div className={styles.donutCenterValue}>
                        <span className={styles.donutValTitle}>ANALYZING</span>
                        <span className={styles.donutValNumber}>...</span>
                    </div>
                </div>

                <div className={styles.chartLoaderTextWrap}>
                    <div className={`${styles.chartLoaderLabel} ${styles.chartLoaderCentered}`}>
                        <PieChartIcon size={14} color="#18C98B" />
                        <span>{label || 'Aggregating Trade Outcomes...'}</span>
                    </div>
                    <div className={`${styles.chartLoaderSub} ${styles.chartLoaderSubMargin}`}>
                        Measuring win/loss ratios and risk factor
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.chartLoaderContainer}>
            <Loader size="md" />
            <div className={`${styles.chartLoaderLabel} ${styles.chartLoaderMarginTop12}`}>
                <span>Loading Chart Data...</span>
            </div>
        </div>
    );
}
