'use client';

import React, { useState, useMemo } from 'react';
import styles from '../calculator.module.scss';
import { PAIRS_CONFIG, CURRENCIES, RATES_TO_USD } from '../config';
import CustomDropdown from './CustomDropdown';
import { useLanguage } from '@/context/LanguageContext';

export default function PipCalculator({ onCopy, copied }) {
    const { t } = useLanguage();
    const [pipPair, setPipPair] = useState('XAU/USD');
    const [pipAmount, setPipAmount] = useState('10');
    const [pipLots, setPipLots] = useState('1.0');
    const [pipCurrency, setPipCurrency] = useState('USD');
    const [customPipSize, setCustomPipSize] = useState('');

    const pairOptions = Object.keys(PAIRS_CONFIG);

    const pipResult = useMemo(() => {
        const pairData = PAIRS_CONFIG[pipPair] || PAIRS_CONFIG['EUR/USD'];
        const lots = parseFloat(pipLots) || 0;
        const pips = parseFloat(pipAmount) || 0;
        const pipSize = customPipSize ? parseFloat(customPipSize) : pairData.pipSize;
        const contractSize = pairData.contractSize;
        const quoteCurrency = pairData.quote || 'USD';

        // 1. Raw pip value in quote currency
        const rawOnePipInQuote = lots * contractSize * pipSize;

        // 2. Convert from quote currency to selected account base currency
        const quoteToUsd = RATES_TO_USD[quoteCurrency] ?? 1.0;
        const accToUsd = RATES_TO_USD[pipCurrency] ?? 1.0;
        const conversionFactor = quoteToUsd / accToUsd;

        const onePipVal = rawOnePipInQuote * conversionFactor;
        const totalVal = onePipVal * pips;

        return {
            total: totalVal,
            onePip: onePipVal,
            units: lots * contractSize,
            pipSize,
            quoteCurrency,
        };
    }, [pipPair, pipLots, pipAmount, customPipSize, pipCurrency]);

    return (
        <div className={styles.calculatorCardGrid}>
            <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                    <h2>{t('calculator.pipValueParams', 'Pip Value Parameters')}</h2>
                    <span>{t('calculator.realTimeFormula', 'REAL-TIME FORMULA')}</span>
                </div>

                <div className={styles.inputsGrid}>
                    <div className={styles.inputGroup}>
                        <label>{t('calculator.instrumentPair', 'Instrument / Currency Pair')}</label>
                        <CustomDropdown
                            options={pairOptions}
                            value={pipPair}
                            onChange={(val) => {
                                setPipPair(val);
                                setCustomPipSize('');
                            }}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('calculator.accountBaseCurrency', 'Account Base Currency')}</label>
                        <CustomDropdown
                            options={CURRENCIES}
                            value={pipCurrency}
                            onChange={setPipCurrency}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            {t('calculator.tradeSizeLots', 'Trade Size (Lots)')}
                            <span className={styles.hint}>{pipLots} Lot = {(parseFloat(pipLots || 0) * (PAIRS_CONFIG[pipPair]?.contractSize || 100000)).toLocaleString()} units</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={pipLots}
                            onChange={(e) => setPipLots(e.target.value)}
                            placeholder="e.g. 1.0"
                        />
                        <div className={styles.quickChips}>
                            {['0.01', '0.10', '0.50', '1.0', '5.0'].map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    className={`${styles.chipBtn} ${pipLots === l ? styles.activeChip : ''}`}
                                    onClick={() => setPipLots(l)}
                                >
                                    {l} Lot
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('calculator.numberOfPips', 'Number of Pips')}</label>
                        <input
                            type="number"
                            step="1"
                            min="1"
                            value={pipAmount}
                            onChange={(e) => setPipAmount(e.target.value)}
                            placeholder="e.g. 10"
                        />
                        <div className={styles.quickChips}>
                            {['10', '20', '50', '100'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`${styles.chipBtn} ${pipAmount === p ? styles.activeChip : ''}`}
                                    onClick={() => setPipAmount(p)}
                                >
                                    {p} Pips
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label>
                            {t('calculator.pipSizeStandard', 'Pip Size Standard')}
                            <span className={styles.hint}>Auto-detected: {PAIRS_CONFIG[pipPair]?.pipSize}</span>
                        </label>
                        <input
                            type="number"
                            step="0.0001"
                            value={customPipSize || PAIRS_CONFIG[pipPair]?.pipSize || '0.0001'}
                            onChange={(e) => setCustomPipSize(e.target.value)}
                            placeholder="e.g. 0.0001"
                        />
                    </div>
                </div>

                <div className={styles.actionBtnRow}>
                    <button type="button" className={styles.calculateBtn}>
                        <span>{t('calculator.calcPipValue', 'Calculate Pip Value')}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className={styles.resultsCard}>
                <div>
                    <div className={styles.resultHeader}>
                        <h3>{t('calculator.totalPipValue', 'Total Pip Value')}</h3>
                        <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={() => onCopy(`${pipCurrency} ${pipResult.total.toFixed(2)}`)}
                        >
                            {copied ? (
                                <>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    <span>{t('calculator.copied', 'Copied')}</span>
                                </>
                            ) : (
                                <>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                    <span>{t('calculator.copy', 'Copy')}</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className={styles.primaryResultBlock}>
                        <div className={styles.resultLabel}>{t('calculator.totalPipValue', 'Total Pip Value')} ({pipAmount} Pips)</div>
                        <div className={styles.resultValue}>
                            {pipCurrency} {pipResult.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={styles.resultSubtext}>
                            1 Pip = {pipCurrency} {pipResult.onePip.toFixed(2)}
                        </div>
                    </div>

                    <div className={styles.breakdownList}>
                        <div className={styles.breakdownItem}>
                            <span>{t('calculator.positionVolume', 'Position Volume')}</span>
                            <span>{pipResult.units.toLocaleString()} Units</span>
                        </div>
                        <div className={styles.breakdownItem}>
                            <span>{t('calculator.singlePipValue', 'Single Pip Value')}</span>
                            <span>{pipCurrency} {pipResult.onePip.toFixed(2)}</span>
                        </div>
                        <div className={styles.breakdownItem}>
                            <span>{t('calculator.decimalIncrement', 'Decimal Increment')}</span>
                            <span>{pipResult.pipSize}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
