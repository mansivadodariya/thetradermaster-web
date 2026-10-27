'use client';

import React from 'react';
import { EyeIcon, EyeOffIcon, GearIcon, TrashIcon } from '@/icons/chartControlIcons';
import styles from '../aiAssistant.module.scss';

export default function FloatingIndicatorLegends({
    movingAverages,
    activeIndicators,
    indicatorConfigs,
    indicatorVisibility,
    toggleMAVisibility,
    openIndicatorSettings,
    removeMovingAverage,
    toggleIndicatorVisibility,
    removeIndicator
}) {
    if (movingAverages.length === 0 && !activeIndicators.bollinger && !activeIndicators.pivot) {
        return null;
    }

    return (
        <div className={styles.indicatorWidgetsContainer}>
            {/* Dynamic Moving Average Pills (EMA & SMA) */}
            {movingAverages.map(ma => (
                <div key={ma.id} className={styles.indicatorWidgetPill}>
                    <span className={styles.indicatorDot} style={{ background: ma.color }} />
                    <span className={styles.indicatorWidgetTitle}>
                        {ma.type} {ma.length} {ma.source}
                    </span>
                    <button
                        type="button"
                        className={`${styles.indicatorActionBtn} ${!ma.visible ? styles.dimmed : ''}`}
                        onClick={() => toggleMAVisibility(ma.id)}
                        title={ma.visible ? "Hide" : "Show"}
                    >
                        {ma.visible ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                    <button
                        type="button"
                        className={styles.indicatorActionBtn}
                        onClick={() => openIndicatorSettings(ma.id)}
                        title="Settings"
                    >
                        <GearIcon />
                    </button>
                    <button
                        type="button"
                        className={`${styles.indicatorActionBtn} ${styles.trashBtn}`}
                        onClick={() => removeMovingAverage(ma.id)}
                        title="Remove"
                    >
                        <TrashIcon />
                    </button>
                </div>
            ))}

            {activeIndicators.bollinger && (
                <div className={styles.indicatorWidgetPill}>
                    <span className={styles.indicatorDot} style={{ background: indicatorConfigs.bollinger.color }} />
                    <span className={styles.indicatorWidgetTitle}>BB {indicatorConfigs.bollinger.length} {indicatorConfigs.bollinger.stdDev}</span>
                    <button
                        type="button"
                        className={`${styles.indicatorActionBtn} ${!indicatorVisibility.bollinger ? styles.dimmed : ''}`}
                        onClick={() => toggleIndicatorVisibility('bollinger')}
                        title={indicatorVisibility.bollinger ? "Hide" : "Show"}
                    >
                        {indicatorVisibility.bollinger ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                    <button
                        type="button"
                        className={styles.indicatorActionBtn}
                        onClick={() => openIndicatorSettings('bollinger')}
                        title="Settings"
                    >
                        <GearIcon />
                    </button>
                    <button
                        type="button"
                        className={`${styles.indicatorActionBtn} ${styles.trashBtn}`}
                        onClick={() => removeIndicator('bollinger')}
                        title="Remove"
                    >
                        <TrashIcon />
                    </button>
                </div>
            )}

            {activeIndicators.pivot && (
                <div className={styles.indicatorWidgetPill}>
                    <span className={styles.indicatorDot} style={{ background: '#38BDF8' }} />
                    <span className={styles.indicatorWidgetTitle}>Pivot ({indicatorConfigs.pivot.type})</span>
                    <button
                        type="button"
                        className={`${styles.indicatorActionBtn} ${!indicatorVisibility.pivot ? styles.dimmed : ''}`}
                        onClick={() => toggleIndicatorVisibility('pivot')}
                        title={indicatorVisibility.pivot ? "Hide" : "Show"}
                    >
                        {indicatorVisibility.pivot ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                    <button
                        type="button"
                        className={styles.indicatorActionBtn}
                        onClick={() => openIndicatorSettings('pivot')}
                        title="Settings"
                    >
                        <GearIcon />
                    </button>
                    <button
                        type="button"
                        className={`${styles.indicatorActionBtn} ${styles.trashBtn}`}
                        onClick={() => removeIndicator('pivot')}
                        title="Remove"
                    >
                        <TrashIcon />
                    </button>
                </div>
            )}
        </div>
    );
}
