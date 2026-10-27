import React from 'react';
import styles from '../aiStrategy.module.scss';
import { EyeToggleIcon } from '../utils/chartHelpers';

export default function ChartLegend({ visibleIndicators, toggleIndicator }) {
    return (
        <div className={styles.chartLegendContainer}>
            <div className={styles.chartLegend}>
                <button
                    type="button"
                    className={`${styles.legendItem} ${!visibleIndicators.ema20 ? styles.legendDisabled : ''}`}
                    onClick={() => toggleIndicator('ema20')}
                    title={visibleIndicators.ema20 ? 'Hide EMA 20' : 'Show EMA 20'}
                >
                    <span className={`${styles.legendColor} ${styles.ema20}`} />
                    <span>EMA 20</span>
                    <EyeToggleIcon visible={visibleIndicators.ema20} className={styles.eyeIcon} />
                </button>
                <button
                    type="button"
                    className={`${styles.legendItem} ${!visibleIndicators.ema50 ? styles.legendDisabled : ''}`}
                    onClick={() => toggleIndicator('ema50')}
                    title={visibleIndicators.ema50 ? 'Hide EMA 50' : 'Show EMA 50'}
                >
                    <span className={`${styles.legendColor} ${styles.ema50}`} />
                    <span>EMA 50</span>
                    <EyeToggleIcon visible={visibleIndicators.ema50} className={styles.eyeIcon} />
                </button>
                <button
                    type="button"
                    className={`${styles.legendItem} ${!visibleIndicators.supertrend ? styles.legendDisabled : ''}`}
                    onClick={() => toggleIndicator('supertrend')}
                    title={visibleIndicators.supertrend ? 'Hide SuperTrend' : 'Show SuperTrend'}
                >
                    <span className={`${styles.legendColor} ${styles.supertrend}`} />
                    <span>SuperTrend</span>
                    <EyeToggleIcon visible={visibleIndicators.supertrend} className={styles.eyeIcon} />
                </button>
            </div>
        </div>
    );
}
