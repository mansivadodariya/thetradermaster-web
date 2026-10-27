'use client';

import React, { useState, useMemo } from 'react';
import styles from '../calculator.module.scss';
import { PAIRS_CONFIG, CURRENCIES, LEVERAGES, RATES_TO_USD } from '../config';
import CustomDropdown from './CustomDropdown';
import { useLanguage } from '@/context/LanguageContext';

export default function MarginCalculator({ onCopy, copied }) {
    const { t } = useLanguage();
    const [marginPair, setMarginPair] = useState('XAU/USD');
    const [marginLots, setMarginLots] = useState('1.0');
    const [marginLeverage, setMarginLeverage] = useState(100);
    const [marginCurrency, setMarginCurrency] = useState('USD');
    const [marginPrice, setMarginPrice] = useState(String(PAIRS_CONFIG['XAU/USD']?.defaultPrice || '4308.18'));

    const pairOptions = Object.keys(PAIRS_CONFIG);

    const marginResult = useMemo(() => {
        const pairData = PAIRS_CONFIG[marginPair] || PAIRS_CONFIG['EUR/USD'];
        const lots = parseFloat(marginLots) || 0;
        const leverage = parseInt(marginLeverage, 10) || 100;
        const price = parseFloat(marginPrice) || pairData.defaultPrice;
        const contractSize = pairData.contractSize;

        // Base currency (e.g. EUR in EUR/USD) vs Account Currency
        const notionalInQuoteOrUSD = lots * contractSize * price;
        const rawRequiredMarginInUSD = notionalInQuoteOrUSD / leverage;

        // Convert required margin to selected account base currency
        const accToUsd = RATES_TO_USD[marginCurrency] ?? 1.0;
        const requiredMargin = rawRequiredMarginInUSD / accToUsd;
        const notionalValue = notionalInQuoteOrUSD / accToUsd;
        const marginPct = (1 / leverage) * 100;

        return {
            requiredMargin,
            notionalValue,
            marginPct,
            leverage,
        };
    }, [marginPair, marginLots, marginLeverage, marginPrice, marginCurrency]);

    return (
        <div className={styles.calculatorCardGrid}>
            <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                    <h2>{t('calculator.marginRequirementParams', 'Margin Requirement Parameters')}</h2>
                    <span>{t('calculator.leverageCalc', 'LEVERAGE CALC')}</span>
                </div>

                <div className={styles.inputsGrid}>
                    <div className={styles.inputGroup}>
                        <label>{t('calculator.instrumentAsset', 'Instrument / Asset')}</label>
                        <CustomDropdown
                            options={pairOptions}
                            value={marginPair}
                            onChange={(val) => {
                                setMarginPair(val);
                                setMarginPrice(String(PAIRS_CONFIG[val]?.defaultPrice || '1.0850'));
                            }}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('calculator.accountBaseCurrency', 'Account Base Currency')}</label>
                        <CustomDropdown
                            options={CURRENCIES}
                            value={marginCurrency}
                            onChange={setMarginCurrency}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('calculator.accountLeverage', 'Account Leverage')}</label>
                        <CustomDropdown
                            options={LEVERAGES}
                            value={marginLeverage}
                            onChange={(val) => setMarginLeverage(Number(val))}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('calculator.tradeSizeLots', 'Trade Size (Lots)')}</label>
                        <input
                            type="number"
                            step="0.01"
                            value={marginLots}
                            onChange={(e) => setMarginLots(e.target.value)}
                            placeholder="e.g. 1.0"
                        />
                        <div className={styles.quickChips}>
                            {['0.01', '0.10', '0.50', '1.0', '5.0'].map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    className={`${styles.chipBtn} ${marginLots === l ? styles.activeChip : ''}`}
                                    onClick={() => setMarginLots(l)}
                                >
                                    {l} Lot
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label>{t('calculator.currentMarketPrice', 'Current Market Price')}</label>
                        <input
                            type="number"
                            step="0.0001"
                            value={marginPrice}
                            onChange={(e) => setMarginPrice(e.target.value)}
                            placeholder="e.g. 1.0850"
                        />
                    </div>
                </div>

                <div className={styles.actionBtnRow}>
                    <button type="button" className={styles.calculateBtn}>
                        <span>{t('calculator.calcRequiredMargin', 'Calculate Required Margin')}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className={styles.resultsCard}>
                <div>
                    <div className={styles.resultHeader}>
                        <h3>{t('calculator.requiredMarginLabel', 'Required Margin')}</h3>
                        <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={() => onCopy(`${marginCurrency} ${marginResult.requiredMargin.toFixed(2)}`)}
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
                        <div className={styles.resultLabel}>
                            {t('calculator.requiredMarginLabel', 'Required Margin')} ({marginLots} Lot @ 1:{marginLeverage})
                        </div>
                        <div className={styles.resultValue}>
                            {marginCurrency} {marginResult.requiredMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={styles.resultSubtext}>
                            Margin Rate: {marginResult.marginPct.toFixed(2)}%
                        </div>
                    </div>

                    <div className={styles.breakdownList}>
                        <div className={styles.breakdownItem}>
                            <span>{t('calculator.notionalPositionValue', 'Notional Position Value')}</span>
                            <span>{marginCurrency} {marginResult.notionalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className={styles.breakdownItem}>
                            <span>{t('calculator.effectiveLeverage', 'Effective Leverage')}</span>
                            <span>1 : {marginResult.leverage}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
