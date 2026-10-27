'use client';

import React from 'react';
import { EyeIcon, EyeOffIcon, GearIcon, TrashIcon } from '@/icons/chartControlIcons';
import styles from '../aiAssistant.module.scss';

export default function SubPanesArea({
    hasSubPanes,
    activeIndicators,
    indicatorConfigs,
    indicatorVisibility,
    toggleIndicatorVisibility,
    openIndicatorSettings,
    removeIndicator,
    rsiContainerRef,
    macdContainerRef,
    stochContainerRef
}) {
    if (!hasSubPanes) return null;

    return (
        <div className={styles.subPanesWrapper}>
            {activeIndicators.rsi && (
                <div className={styles.subPaneItem}>
                    <div className={styles.subPaneHeader}>
                        <span className={styles.indicatorDot} style={{ background: indicatorConfigs.rsi.color }} />
                        <span className={styles.subPaneTitle}>RSI ({indicatorConfigs.rsi.length})</span>
                        <div className={styles.subPaneActions}>
                            <button
                                type="button"
                                className={`${styles.indicatorActionBtn} ${!indicatorVisibility.rsi ? styles.dimmed : ''}`}
                                onClick={() => toggleIndicatorVisibility('rsi')}
                                title={indicatorVisibility.rsi ? "Hide" : "Show"}
                            >
                                {indicatorVisibility.rsi ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                            <button
                                type="button"
                                className={styles.indicatorActionBtn}
                                onClick={() => openIndicatorSettings('rsi')}
                                title="Settings"
                            >
                                <GearIcon />
                            </button>
                            <button
                                type="button"
                                className={`${styles.indicatorActionBtn} ${styles.trashBtn}`}
                                onClick={() => removeIndicator('rsi')}
                                title="Remove"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                    <div ref={rsiContainerRef} className={styles.subPaneCanvas} />
                </div>
            )}

            {activeIndicators.macd && (
                <div className={styles.subPaneItem}>
                    <div className={styles.subPaneHeader}>
                        <span className={styles.indicatorDot} style={{ background: indicatorConfigs.macd.macdColor }} />
                        <span className={styles.subPaneTitle}>MACD ({indicatorConfigs.macd.fast}, {indicatorConfigs.macd.slow}, {indicatorConfigs.macd.signal})</span>
                        <div className={styles.subPaneActions}>
                            <button
                                type="button"
                                className={`${styles.indicatorActionBtn} ${!indicatorVisibility.macd ? styles.dimmed : ''}`}
                                onClick={() => toggleIndicatorVisibility('macd')}
                                title={indicatorVisibility.macd ? "Hide" : "Show"}
                            >
                                {indicatorVisibility.macd ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                            <button
                                type="button"
                                className={styles.indicatorActionBtn}
                                onClick={() => openIndicatorSettings('macd')}
                                title="Settings"
                            >
                                <GearIcon />
                            </button>
                            <button
                                type="button"
                                className={`${styles.indicatorActionBtn} ${styles.trashBtn}`}
                                onClick={() => removeIndicator('macd')}
                                title="Remove"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                    <div ref={macdContainerRef} className={styles.subPaneCanvas} />
                </div>
            )}

            {activeIndicators.stochastic && (
                <div className={styles.subPaneItem}>
                    <div className={styles.subPaneHeader}>
                        <span className={styles.indicatorDot} style={{ background: indicatorConfigs.stochastic.kColor }} />
                        <span className={styles.subPaneTitle}>Stochastic ({indicatorConfigs.stochastic.kPeriod}, {indicatorConfigs.stochastic.dPeriod})</span>
                        <div className={styles.subPaneActions}>
                            <button
                                type="button"
                                className={`${styles.indicatorActionBtn} ${!indicatorVisibility.stochastic ? styles.dimmed : ''}`}
                                onClick={() => toggleIndicatorVisibility('stochastic')}
                                title={indicatorVisibility.stochastic ? "Hide" : "Show"}
                            >
                                {indicatorVisibility.stochastic ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                            <button
                                type="button"
                                className={styles.indicatorActionBtn}
                                onClick={() => openIndicatorSettings('stochastic')}
                                title="Settings"
                            >
                                <GearIcon />
                            </button>
                            <button
                                type="button"
                                className={`${styles.indicatorActionBtn} ${styles.trashBtn}`}
                                onClick={() => removeIndicator('stochastic')}
                                title="Remove"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                    <div ref={stochContainerRef} className={styles.subPaneCanvas} />
                </div>
            )}
        </div>
    );
}
