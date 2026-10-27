'use client';

import React from 'react';
import styles from '../customBotBuilder.module.scss';
import { TRADING_PAIRS, TIMEFRAMES } from '../constants';
import CustomSelect from './CustomSelect';

function ErrorAlertIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function StepBasics({ data, errors = {}, onChange }) {
    const selectedPair = TRADING_PAIRS.find(p => p.value === data.tradingPair);
    const selectedTimeframe = TIMEFRAMES.find(t => t.value === data.timeframe);

    return (
        <div className={styles.stepContentWrapper}>
            <div className={styles.inputCard}>
                {/* Bot Name */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        Bot Name <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                        type="text"
                        maxLength={50}
                        className={`${styles.textInput} ${errors.botName ? styles.inputError : ''}`}
                        placeholder="e.g. BTC Momentum Scalper"
                        value={data.botName}
                        onChange={(e) => onChange('botName', e.target.value)}
                    />
                    {errors.botName && (
                        <span className={styles.errorHelperText}>
                            <ErrorAlertIcon />
                            {errors.botName}
                        </span>
                    )}
                </div>

                {/* Description (Optional) */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea
                        className={styles.textareaInput}
                        rows={3}
                        maxLength={300}
                        placeholder="Describe your strategy logic, execution rules, or purpose (optional)..."
                        value={data.description}
                        onChange={(e) => onChange('description', e.target.value)}
                    />
                </div>

                {/* Trading Pair & Timeframe Grid */}
                <div className={styles.gridTwoCols}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Trading Pair <span className={styles.requiredStar}>*</span>
                        </label>
                        <CustomSelect
                            value={data.tradingPair}
                            onChange={(val) => onChange('tradingPair', val)}
                            options={TRADING_PAIRS}
                            placeholder="Select Trading Pair..."
                            hasError={Boolean(errors.tradingPair)}
                        />
                        {errors.tradingPair && (
                            <span className={styles.errorHelperText}>
                                <ErrorAlertIcon />
                                {errors.tradingPair}
                            </span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Timeframe <span className={styles.requiredStar}>*</span>
                        </label>
                        <CustomSelect
                            value={data.timeframe}
                            onChange={(val) => onChange('timeframe', val)}
                            options={TIMEFRAMES}
                            placeholder="Select Timeframe..."
                            hasError={Boolean(errors.timeframe)}
                        />
                        {errors.timeframe && (
                            <span className={styles.errorHelperText}>
                                <ErrorAlertIcon />
                                {errors.timeframe}
                            </span>
                        )}
                    </div>
                </div>

                {/* Market Summary Confirmation */}
                {selectedPair && selectedTimeframe && (
                    <div className={styles.marketSummaryBox}>
                        <div className={styles.summaryBadges}>
                            <span className={styles.highlightBadge}>{selectedPair.value}</span>
                            <span className={styles.highlightBadgeMuted}>{selectedTimeframe.value.toUpperCase()}</span>
                        </div>
                        <span className={styles.marketSummaryText}>
                            Your bot will monitor and execute trades on {selectedPair.label} using {selectedTimeframe.label} candles.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
