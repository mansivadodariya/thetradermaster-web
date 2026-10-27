'use client';

import React from 'react';
import styles from '../customBotBuilder.module.scss';
import { RISK_LEVELS } from '../constants';

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

export default function StepRisk({ data, errors = {}, onChange }) {
    const { riskLevel, lotSize, maxOpenPositions, riskPerTrade, maxDailyLoss } = data;

    const preventNegativeKeys = (e) => {
        if (['-', '+', 'e', 'E'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const handlePositiveNumber = (field, rawVal, isInt = false) => {
        if (rawVal === '') {
            onChange(field, '');
            return;
        }
        const clean = String(rawVal).replace(isInt ? /[^0-9]/g : /[^0-9.]/g, '');
        const num = isInt ? parseInt(clean, 10) : parseFloat(clean);
        if (!isNaN(num)) {
            const maxVal = field === 'lotSize' ? 50 : field === 'maxOpenPositions' ? 50 : 100;
            const clamped = Math.min(maxVal, Math.max(0, num));
            onChange(field, clamped);
        } else {
            onChange(field, '');
        }
    };

    const handleSelectPreset = (preset) => {
        onChange('riskLevel', preset.id);
        onChange('lotSize', preset.lotSize);
        onChange('maxOpenPositions', preset.maxOpen);
        onChange('riskPerTrade', preset.riskPerTrade);
        onChange('maxDailyLoss', preset.maxDailyLoss);
    };

    return (
        <div className={styles.stepContentWrapper}>
            {/* Overall Risk Level Preset Selector */}
            <div className={styles.riskPresetSection}>
                <h4 className={styles.sectionSubtitle}>Overall Risk Preset</h4>
                <div className={styles.riskPresetGrid}>
                    {RISK_LEVELS.map(preset => {
                        const isSelected = riskLevel === preset.id;
                        return (
                            <div
                                key={preset.id}
                                className={`${styles.riskPresetCard} ${isSelected ? styles.riskPresetActive : ''}`}
                                onClick={() => handleSelectPreset(preset)}
                            >
                                <span className={styles.presetTitle}>{preset.title}</span>
                                <span className={styles.presetSubtitle}>{preset.subtitle}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 4 Risk Parameter Cards (2x2 Grid) */}
            <div className={styles.gridTwoCols}>
                {/* 1. Lot Size */}
                <div className={styles.riskParamCard}>
                    <div className={styles.riskCardHeader}>
                        <span className={styles.riskIconGreen}>$</span>
                        <h4 className={styles.riskCardTitle}>Lot Size *</h4>
                    </div>
                    <div className={styles.riskInputRow}>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="50.0"
                            onKeyDown={preventNegativeKeys}
                            className={`${styles.riskNumberInput} ${errors.lotSize ? styles.inputError : ''}`}
                            placeholder="e.g. 0.10 (max 50)"
                            value={lotSize}
                            onChange={(e) => handlePositiveNumber('lotSize', e.target.value)}
                        />
                    </div>
                    {errors.lotSize && (
                        <span className={styles.errorHelperText}>
                            <ErrorAlertIcon />
                            {errors.lotSize}
                        </span>
                    )}
                    <div className={styles.sliderContainer}>
                        <input
                            type="range"
                            min="0.01"
                            max="5.0"
                            step="0.01"
                            className={styles.rangeSlider}
                            value={Number(lotSize) || 0.01}
                            onChange={(e) => onChange('lotSize', parseFloat(e.target.value))}
                        />
                    </div>
                    <span className={styles.riskHelperText}>
                        Volume per trade. Standard 1.0 lot = 100,000 currency units.
                    </span>
                </div>

                {/* 2. Max Open Positions */}
                <div className={styles.riskParamCard}>
                    <div className={styles.riskCardHeader}>
                        <span className={styles.riskIconCyan}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                <polyline points="2 17 12 22 22 17" />
                                <polyline points="2 12 12 17 22 12" />
                            </svg>
                        </span>
                        <h4 className={styles.riskCardTitle}>Max Open Positions *</h4>
                    </div>
                    <div className={styles.riskInputRow}>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            step="1"
                            onKeyDown={preventNegativeKeys}
                            className={`${styles.riskNumberInput} ${errors.maxOpenPositions ? styles.inputError : ''}`}
                            placeholder="e.g. 3 (max 50)"
                            value={maxOpenPositions}
                            onChange={(e) => handlePositiveNumber('maxOpenPositions', e.target.value, true)}
                        />
                    </div>
                    {errors.maxOpenPositions && (
                        <span className={styles.errorHelperText}>
                            <ErrorAlertIcon />
                            {errors.maxOpenPositions}
                        </span>
                    )}
                    <div className={styles.sliderContainer}>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            className={styles.rangeSlider}
                            value={Number(maxOpenPositions) || 1}
                            onChange={(e) => onChange('maxOpenPositions', parseInt(e.target.value, 10))}
                        />
                    </div>
                    <span className={styles.riskHelperText}>
                        Maximum number of concurrent trades open at any time.
                    </span>
                </div>

                {/* 3. Risk Per Trade */}
                <div className={styles.riskParamCard}>
                    <div className={styles.riskCardHeader}>
                        <span className={styles.riskIconGreen}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </span>
                        <h4 className={styles.riskCardTitle}>Risk Per Trade *</h4>
                    </div>
                    <div className={styles.riskInputRow}>
                        <div className={styles.inputWithUnit}>
                            <input
                                type="number"
                                min="0.1"
                                max="100"
                                step="0.5"
                                onKeyDown={preventNegativeKeys}
                                className={`${styles.riskNumberInput} ${errors.riskPerTrade ? styles.inputError : ''}`}
                                placeholder="e.g. 2.0 (max 100%)"
                                value={riskPerTrade}
                                onChange={(e) => handlePositiveNumber('riskPerTrade', e.target.value)}
                            />
                            <span className={styles.unitSuffix}>%</span>
                        </div>
                    </div>
                    {errors.riskPerTrade && (
                        <span className={styles.errorHelperText}>
                            <ErrorAlertIcon />
                            {errors.riskPerTrade}
                        </span>
                    )}
                    <div className={styles.sliderContainer}>
                        <input
                            type="range"
                            min="0.5"
                            max="10.0"
                            step="0.5"
                            className={styles.rangeSlider}
                            value={Number(riskPerTrade) || 0.5}
                            onChange={(e) => onChange('riskPerTrade', parseFloat(e.target.value))}
                        />
                    </div>
                    <span className={styles.riskHelperText}>
                        Percentage of account equity risked on each individual trade.
                    </span>
                </div>

                {/* 4. Max Daily Loss */}
                <div className={styles.riskParamCard}>
                    <div className={styles.riskCardHeader}>
                        <span className={styles.riskIconRed}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                                <polyline points="17 18 23 18 23 12" />
                            </svg>
                        </span>
                        <h4 className={styles.riskCardTitle}>Max Daily Loss *</h4>
                    </div>
                    <div className={styles.riskInputRow}>
                        <div className={styles.inputWithUnit}>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                step="1"
                                onKeyDown={preventNegativeKeys}
                                className={`${styles.riskNumberInput} ${errors.maxDailyLoss ? styles.inputError : ''}`}
                                placeholder="e.g. 5.0 (max 100%)"
                                value={maxDailyLoss}
                                onChange={(e) => handlePositiveNumber('maxDailyLoss', e.target.value)}
                            />
                            <span className={styles.unitSuffix}>%</span>
                        </div>
                    </div>
                    {errors.maxDailyLoss && (
                        <span className={styles.errorHelperText}>
                            <ErrorAlertIcon />
                            {errors.maxDailyLoss}
                        </span>
                    )}
                    <div className={styles.sliderContainer}>
                        <input
                            type="range"
                            min="1"
                            max="25"
                            step="1"
                            className={styles.rangeSlider}
                            value={Number(maxDailyLoss) || 1}
                            onChange={(e) => onChange('maxDailyLoss', parseFloat(e.target.value))}
                        />
                    </div>
                    <span className={styles.riskHelperText}>
                        Bot halts automated trading for the day if drawdown reaches this threshold.
                    </span>
                </div>
            </div>
        </div>
    );
}
