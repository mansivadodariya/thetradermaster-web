'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import { CloseXIcon, SparklesMiniIcon, ChevronRightMiniIcon, ChevronDownIcon } from './StudioIcons';

export const WHAT_TO_INCLUDE_STEPS = [
    {
        id: 'asset_symbol',
        category: 'Asset / Symbol',
        shortLabel: 'Asset',
        question: 'Which MT5 pair or metal do you trade?',
        strategyKey: 'stock_name',
        options: [
            { label: '+ Gold (XAUUSD)', text: 'Trade Gold (XAUUSD)', value: 'XAUUSD', mapping: { stock_name: ['XAUUSD'] } },
            { label: '+ EURUSD', text: 'Trade EURUSD', value: 'EURUSD', mapping: { stock_name: ['EURUSD'] } },
            { label: '+ GBPUSD', text: 'Trade GBPUSD', value: 'GBPUSD', mapping: { stock_name: ['GBPUSD'] } },
            { label: '+ GBPJPY', text: 'Trade GBPJPY', value: 'GBPJPY', mapping: { stock_name: ['GBPJPY'] } },
            { label: '+ EURJPY', text: 'Trade EURJPY', value: 'EURJPY', mapping: { stock_name: ['EURJPY'] } },
            { label: '+ USDCAD', text: 'Trade USDCAD', value: 'USDCAD', mapping: { stock_name: ['USDCAD'] } }
        ]
    },
    {
        id: 'timeframe',
        category: 'Timeframe',
        shortLabel: 'Timeframe',
        question: 'What chart timeframe should the bot analyze?',
        strategyKey: 'interval',
        options: [
            { label: '+ 5min (Scalping)', text: '5min chart timeframe', value: '5min', mapping: { interval: '5min' } },
            { label: '+ 15min (Intraday)', text: '15min chart timeframe', value: '15min', mapping: { interval: '15min' } },
            { label: '+ 30min (Short Swing)', text: '30min chart timeframe', value: '30min', mapping: { interval: '30min' } },
            { label: '+ 1hour (Trend Swing)', text: '1hour chart timeframe', value: '1hour', mapping: { interval: '1hour' } },
            { label: '+ 4hour (Positional)', text: '4hour chart timeframe', value: '4hour', mapping: { interval: '4hour' } }
        ]
    },
    {
        id: 'trade_direction',
        category: 'Trade Direction',
        shortLabel: 'Direction',
        question: 'What is your trade direction / bias?',
        strategyKey: 'entry_type',
        options: [
            { label: '+ Buy / Long Only', text: 'Buy / Long Only', value: 'Buy', mapping: { entry_type: 0 } },
            { label: '+ Sell / Short Only', text: 'Sell / Short Only', value: 'Sell', mapping: { entry_type: 1 } },
            { label: '+ Both (Long & Short)', text: 'Both (Long & Short)', value: 'Both', mapping: { entry_type: null } }
        ]
    },
    {
        id: 'entry_strategy',
        category: 'Entry Strategy',
        shortLabel: 'Entry',
        question: 'Which indicator signal triggers market entry?',
        strategyKey: 'entry_conditions',
        options: [
            {
                label: '+ EMA 9 / 21 Crossover',
                text: 'EMA 9 / 21 Crossover',
                value: 'EMA 9/21 Crossover',
                mapping: {
                    entry_conditions: {
                        rules: [{ indicator1: 'ema-9', operator: 'crossover', indicator2: 'ema-21' }]
                    }
                }
            },
            {
                label: '+ EMA 20 / 50 Trend Cross',
                text: 'EMA 20 / 50 Trend Cross',
                value: 'EMA 20/50 Trend Cross',
                mapping: {
                    entry_conditions: {
                        rules: [{ indicator1: 'ema-20', operator: 'crossover', indicator2: 'ema-50' }]
                    }
                }
            },
            {
                label: '+ RSI Oversold Bounce (< 30)',
                text: 'RSI Oversold Bounce (< 30)',
                value: 'RSI Oversold Bounce',
                mapping: {
                    entry_conditions: {
                        rules: [{ indicator1: 'rsi-14', operator: '<', value: 30 }]
                    }
                }
            },
            {
                label: '+ Supertrend Flip (10, 3)',
                text: 'Supertrend Flip (10, 3)',
                value: 'Supertrend Flip',
                mapping: {
                    entry_conditions: {
                        rules: [{ indicator1: 'supertrend-10-3', operator: 'flip', value: 'bullish' }]
                    }
                }
            },
            {
                label: '+ MACD Signal Cross (12, 26, 9)',
                text: 'MACD Signal Cross (12, 26, 9)',
                value: 'MACD Signal Cross',
                mapping: {
                    entry_conditions: {
                        rules: [{ indicator1: 'macd-12-26', operator: 'crossover', indicator2: 'macd-signal-9' }]
                    }
                }
            }
        ]
    },
    {
        id: 'stop_loss',
        category: 'Stop Loss',
        shortLabel: 'Stop Loss',
        question: 'How do you want to protect downside risk?',
        strategyKey: 'exit_conditions.stoploss',
        options: [
            {
                label: '+ 25 Pips (250 Points)',
                text: '25 Pips (250 Points) SL',
                value: '25 Pips SL',
                mapping: { exit_conditions: { stoploss: 250, stoploss_type: 'points' } }
            },
            {
                label: '+ 50 Pips (500 Points)',
                text: '50 Pips (500 Points) SL',
                value: '50 Pips SL',
                mapping: { exit_conditions: { stoploss: 500, stoploss_type: 'points' } }
            },
            {
                label: '+ 1.5x ATR Dynamic SL',
                text: '1.5x ATR Dynamic SL',
                value: '1.5x ATR SL',
                mapping: { exit_conditions: { stoploss: 1.5, stoploss_type: 'atr', atr_length: 14 } }
            },
            {
                label: '+ 15 Pips Tight SL (150 Points)',
                text: '15 Pips Tight SL (150 Points)',
                value: '15 Pips SL',
                mapping: { exit_conditions: { stoploss: 150, stoploss_type: 'points' } }
            }
        ]
    },
    {
        id: 'take_profit',
        category: 'Take Profit',
        shortLabel: 'Take Profit',
        question: 'Where do you want to exit with profit?',
        strategyKey: 'exit_conditions.target',
        options: [
            {
                label: '+ 1:2 RR (50 Pips / 500 Points)',
                text: '1:2 RR (50 Pips / 500 Points) TP',
                value: '1:2 RR (500 Points)',
                mapping: { exit_conditions: { target: 500, target_type: 'points', trailing_stoploss: false } }
            },
            {
                label: '+ 1:3 RR (75 Pips / 750 Points)',
                text: '1:3 RR (75 Pips / 750 Points) TP',
                value: '1:3 RR (750 Points)',
                mapping: { exit_conditions: { target: 750, target_type: 'points', trailing_stoploss: false } }
            },
            {
                label: '+ 100 Pips Runner (1000 Points)',
                text: '100 Pips Runner (1000 Points)',
                value: '100 Pips Runner (1000 Points)',
                mapping: { exit_conditions: { target: 1000, target_type: 'points', trailing_stoploss: false } }
            },
            {
                label: '+ Trailing Stop (Follow Trend)',
                text: 'Trailing Stop (Follow Trend)',
                value: 'Trailing Stop',
                mapping: { exit_conditions: { trailing_stoploss: true } }
            }
        ]
    },
    {
        id: 'lot_sizing',
        category: 'Lot Sizing',
        shortLabel: 'Lot Sizing',
        question: 'What MT5 volume / lot size per trade?',
        strategyKey: 'quantity',
        options: [
            {
                label: '+ 0.01 Lots (Micro - Recommended)',
                text: '0.01 Lots (Micro)',
                value: '0.01 Lots',
                mapping: { quantity: 0.01, sizing_mode: 'lots', inital_capital: 10000.0 }
            },
            {
                label: '+ 0.05 Lots (Balanced)',
                text: '0.05 Lots (Balanced)',
                value: '0.05 Lots',
                mapping: { quantity: 0.05, sizing_mode: 'lots', inital_capital: 10000.0 }
            },
            {
                label: '+ 0.10 Lots (Mini Lot)',
                text: '0.10 Lots (Mini Lot)',
                value: '0.10 Lots',
                mapping: { quantity: 0.10, sizing_mode: 'lots', inital_capital: 10000.0 }
            },
            {
                label: '+ 1.00 Standard Lot',
                text: '1.00 Standard Lot',
                value: '1.00 Standard Lot',
                mapping: { quantity: 1.00, sizing_mode: 'lots', inital_capital: 10000.0 }
            }
        ]
    }
];

export default function WhatToIncludePopup({
    isOpen,
    onClose,
    onAppendText
}) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selectedLabels, setSelectedLabels] = useState(() => new Set());
    const popupRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                // If user clicked the toggle chip button in parent, let toggle handler manage it
                if (e.target.closest && e.target.closest(`.${styles.categoryChipsRow}`)) {
                    return;
                }
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const currentStep = WHAT_TO_INCLUDE_STEPS[currentStepIndex] || WHAT_TO_INCLUDE_STEPS[0];
    const totalSteps = WHAT_TO_INCLUDE_STEPS.length;

    const handleOptionSelect = (opt) => {
        // 1. Append plain-English sentence to input
        if (onAppendText && opt.text) {
            onAppendText(opt.text);
        }

        // 2. Mark this option as selected
        setSelectedLabels((prev) => new Set([...prev, opt.label]));

        // 3. Auto-swipe to next question
        if (currentStepIndex < totalSteps - 1) {
            setTimeout(() => {
                setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
            }, 180);
        }
    };

    return (
        <div ref={popupRef} className={styles.whatToIncludePopup}>
            {/* Header */}
            <div className={styles.wtiHeader}>
                <div className={styles.wtiHeaderLeft}>
                    <SparklesMiniIcon size={15} color="#18C98B" />
                    <span className={styles.wtiHeaderTitle}>What to include</span>
                </div>
                <div className={styles.wtiHeaderRight}>
                    <button
                        type="button"
                        className={styles.wtiCloseBtn}
                        onClick={onClose}
                        title="Close"
                    >
                        <CloseXIcon size={14} />
                    </button>
                </div>
            </div>

            {/* Full-width Equal-spaced Step Tabs Navigation */}
            <div className={styles.wtiStepTabs}>
                {WHAT_TO_INCLUDE_STEPS.map((step, idx) => {
                    const isActive = idx === currentStepIndex;
                    const isPassed = idx < currentStepIndex;
                    return (
                        <button
                            key={step.id}
                            type="button"
                            className={`${styles.wtiStepTab} ${isActive ? styles.wtiStepTabActive : ''} ${isPassed ? styles.wtiStepTabCompleted : ''}`}
                            onClick={() => setCurrentStepIndex(idx)}
                            title={`Step ${idx + 1}: ${step.shortLabel}`}
                        >
                            <span className={styles.wtiStepNum}>
                                {isPassed ? (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    idx + 1
                                )}
                            </span>
                            <span className={styles.wtiStepLabel}>{step.shortLabel}</span>
                        </button>
                    );
                })}
            </div>

            {/* Stepper Progress Line */}
            <div className={styles.wtiProgressTrack}>
                <div
                    className={styles.wtiProgressBar}
                    style={{
                        width: `${((currentStepIndex + 1) / totalSteps) * 100}%`
                    }}
                />
            </div>

            {/* Current Question & Options */}
            <div className={styles.wtiQuestionArea}>
                <div className={styles.wtiQuestionHeader}>
                    <h3 className={styles.wtiQuestionTitle}>
                        {currentStep.question}
                    </h3>
                    <div className={styles.wtiCategoryTag}>
                        {currentStep.category}
                    </div>
                </div>

                <div className={styles.wtiOptionsGrid}>
                    {currentStep.options.map((opt, i) => {
                        const isSelected = selectedLabels.has(opt.label);
                        return (
                            <button
                                key={i}
                                type="button"
                                className={`${styles.wtiOptionBtn} ${isSelected ? styles.wtiOptionBtnSelected : ''}`}
                                onClick={() => handleOptionSelect(opt)}
                            >
                                <span className={styles.wtiOptionPlus}>+</span>
                                <span className={styles.wtiOptionLabel}>
                                    {opt.label.replace(/^\+\s*/, '')}
                                </span>
                                {isSelected && (
                                    <span className={styles.wtiOptionCheck}><ChevronRightMiniIcon size={12} color="#18C98B" style={{marginRight: '4px', verticalAlign: 'middle'}} /> Added</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer Navigation & Note */}
            <div className={styles.wtiFooter}>
                <div className={styles.wtiFooterNav}>
                    <button
                        type="button"
                        className={styles.wtiNavBtn}
                        disabled={currentStepIndex === 0}
                        onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                    >
                        <ChevronDownIcon size={12} color="currentColor" style={{marginRight: '4px', verticalAlign: 'middle', transform: 'rotate(-90deg)'}} /> Back
                    </button>

                    {currentStepIndex < totalSteps - 1 ? (
                        <button
                            type="button"
                            className={styles.wtiNavBtn}
                            onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                        >
                            Skip <ChevronRightMiniIcon size={12} color="currentColor" style={{marginLeft: '4px', verticalAlign: 'middle'}} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className={`${styles.wtiNavBtn} ${styles.wtiDoneBtn}`}
                            onClick={onClose}
                        >
                            <ChevronRightMiniIcon size={12} color="#ffffff" style={{marginRight: '4px', verticalAlign: 'middle'}} /> Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
