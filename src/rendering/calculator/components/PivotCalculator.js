'use client';

import React, { useState, useMemo } from 'react';
import styles from '../calculator.module.scss';
import { PAIRS_CONFIG } from '../config';
import CustomDropdown from './CustomDropdown';
import { useLanguage } from '@/context/LanguageContext';

export default function PivotCalculator() {
    const { t } = useLanguage();
    const pairOptions = Object.keys(PAIRS_CONFIG);
    const defaultP = PAIRS_CONFIG['XAU/USD']?.defaultPrice || 4308.18;
    const [pivotPair, setPivotPair] = useState('XAU/USD');
    const [pivotType, setPivotType] = useState('standard'); // 'standard' | 'fibonacci' | 'camarilla' | 'woodie'
    const [pivotHigh, setPivotHigh] = useState(String((defaultP * 1.008).toFixed(2)));
    const [pivotLow, setPivotLow] = useState(String((defaultP * 0.992).toFixed(2)));
    const [pivotClose, setPivotClose] = useState(String((defaultP * 1.002).toFixed(2)));
    const [pivotOpen, setPivotOpen] = useState(String(defaultP.toFixed(2)));

    const PIVOT_MODELS = [
        { value: 'standard', label: t('calculator.modelStandard', 'Standard Floor Pivot') },
        { value: 'fibonacci', label: t('calculator.modelFib', 'Fibonacci Pivot Points') },
        { value: 'camarilla', label: t('calculator.modelCamarilla', 'Camarilla High-Frequency') },
    ];

    const pivotResult = useMemo(() => {
        const h = parseFloat(pivotHigh) || 0;
        const l = parseFloat(pivotLow) || 0;
        const c = parseFloat(pivotClose) || 0;
        const o = parseFloat(pivotOpen) || 0;
        const range = h - l;

        if (pivotType === 'fibonacci') {
            const pp = (h + l + c) / 3;
            return {
                pp,
                r1: pp + (range * 0.382),
                r2: pp + (range * 0.618),
                r3: pp + (range * 1.000),
                s1: pp - (range * 0.382),
                s2: pp - (range * 0.618),
                s3: pp - (range * 1.000),
            };
        }

        if (pivotType === 'camarilla') {
            const pp = (h + l + c) / 3;
            return {
                pp,
                r4: c + (range * (1.1 / 2)),
                r3: c + (range * (1.1 / 4)),
                r2: c + (range * (1.1 / 6)),
                r1: c + (range * (1.1 / 12)),
                s1: c - (range * (1.1 / 12)),
                s2: c - (range * (1.1 / 6)),
                s3: c - (range * (1.1 / 4)),
                s4: c - (range * (1.1 / 2)),
            };
        }

        if (pivotType === 'woodie') {
            const pp = (h + l + (2 * o)) / 4;
            return {
                pp,
                r1: (2 * pp) - l,
                r2: pp + range,
                r3: h + (2 * (pp - l)),
                s1: (2 * pp) - h,
                s2: pp - range,
                s3: l - (2 * (h - pp)),
            };
        }

        // Standard Floor Pivots
        const pp = (h + l + c) / 3;
        const r1 = (2 * pp) - l;
        const s1 = (2 * pp) - h;
        const r2 = pp + (h - l);
        const s2 = pp - (h - l);
        const r3 = h + 2 * (pp - l);
        const s3 = l - 2 * (h - pp);

        return { pp, r1, r2, r3, s1, s2, s3 };
    }, [pivotType, pivotHigh, pivotLow, pivotClose, pivotOpen]);

    return (
        <div className={styles.calculatorCardGrid}>
            <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                    <h2>{t('calculator.pivotParams', 'Pivot Point Parameters')}</h2>
                    <span>{t('calculator.multiFormula', 'MULTI-FORMULA')}</span>
                </div>

                <div className={styles.inputsGrid}>
                    <div className={styles.inputGroup}>
                        <label>{t('calculator.instrumentPreset', 'Instrument / Asset Preset')}</label>
                        <CustomDropdown
                            options={pairOptions}
                            value={pivotPair}
                            onChange={(val) => {
                                setPivotPair(val);
                                const pairData = PAIRS_CONFIG[val] || PAIRS_CONFIG['EUR/USD'];
                                const p = pairData?.defaultPrice || 1.08450;
                                const decimals = (pairData?.type === 'crypto' || pairData?.type === 'metal' || pairData?.type === 'jpy') ? 2 : 5;
                                setPivotHigh(String((p * 1.008).toFixed(decimals)));
                                setPivotLow(String((p * 0.992).toFixed(decimals)));
                                setPivotClose(String((p * 1.002).toFixed(decimals)));
                                setPivotOpen(String(p.toFixed ? p.toFixed(decimals) : p));
                            }}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('calculator.calculationModel', 'Pivot Calculation Model')}</label>
                        <CustomDropdown
                            options={PIVOT_MODELS}
                            value={pivotType}
                            onChange={setPivotType}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('calculator.highPrice', 'Session High (H)')}</label>
                        <input
                            type="number"
                            step="0.0001"
                            value={pivotHigh}
                            onChange={(e) => setPivotHigh(e.target.value)}
                            placeholder="e.g. 1.0920"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('calculator.lowPrice', 'Session Low (L)')}</label>
                        <input
                            type="number"
                            step="0.0001"
                            value={pivotLow}
                            onChange={(e) => setPivotLow(e.target.value)}
                            placeholder="e.g. 1.0830"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t('calculator.closePrice', 'Session Close (C)')}</label>
                        <input
                            type="number"
                            step="0.0001"
                            value={pivotClose}
                            onChange={(e) => setPivotClose(e.target.value)}
                            placeholder="e.g. 1.0875"
                        />
                    </div>

                    {pivotType === 'woodie' && (
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>{t('calculator.openPrice', 'Session Open (O)')} <span className={styles.hint}>({t('calculator.woodieHint', 'Required for Woodie Model')})</span></label>
                            <input
                                type="number"
                                step="0.0001"
                                value={pivotOpen}
                                onChange={(e) => setPivotOpen(e.target.value)}
                                placeholder="e.g. 1.0850"
                            />
                        </div>
                    )}
                </div>

                <div className={styles.actionBtnRow}>
                    <button type="button" className={styles.calculateBtn}>
                        <span>{t('calculator.calculateBtn', 'Calculate Pivot Levels')}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className={styles.resultsCard}>
                <div>
                    <div className={styles.resultHeader}>
                        <h3>{pivotType.toUpperCase()} {t('calculator.pivotPoints', 'Pivot Levels')}</h3>
                    </div>

                    <table className={styles.levelsTable}>
                        <thead>
                            <tr>
                                <th>{t('calculator.levelHeader', 'Level')}</th>
                                <th>{t('calculator.priceTargetHeader', 'Price Target')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pivotResult.r4 !== undefined && (
                                <tr className={styles.resistanceRow}>
                                    <td>{t('calculator.resistance', 'Resistance')} 4 (R4)</td>
                                    <td>{pivotResult.r4.toFixed(4)}</td>
                                </tr>
                            )}
                            {pivotResult.r3 !== undefined && (
                                <tr className={styles.resistanceRow}>
                                    <td>{t('calculator.resistance', 'Resistance')} 3 (R3)</td>
                                    <td>{pivotResult.r3.toFixed(4)}</td>
                                </tr>
                            )}
                            <tr className={styles.resistanceRow}>
                                <td>{t('calculator.resistance', 'Resistance')} 2 (R2)</td>
                                <td>{pivotResult.r2.toFixed(4)}</td>
                            </tr>
                            <tr className={styles.resistanceRow}>
                                <td>{t('calculator.resistance', 'Resistance')} 1 (R1)</td>
                                <td>{pivotResult.r1.toFixed(4)}</td>
                            </tr>
                            <tr className={styles.pivotRow}>
                                <td>{t('calculator.pivotLevel', 'Pivot Point (PP)')}</td>
                                <td>{pivotResult.pp.toFixed(4)}</td>
                            </tr>
                            <tr className={styles.supportRow}>
                                <td>{t('calculator.support', 'Support')} 1 (S1)</td>
                                <td>{pivotResult.s1.toFixed(4)}</td>
                            </tr>
                            <tr className={styles.supportRow}>
                                <td>{t('calculator.support', 'Support')} 2 (S2)</td>
                                <td>{pivotResult.s2.toFixed(4)}</td>
                            </tr>
                            {pivotResult.s3 !== undefined && (
                                <tr className={styles.supportRow}>
                                    <td>{t('calculator.support', 'Support')} 3 (S3)</td>
                                    <td>{pivotResult.s3.toFixed(4)}</td>
                                </tr>
                            )}
                            {pivotResult.s4 !== undefined && (
                                <tr className={styles.supportRow}>
                                    <td>{t('calculator.support', 'Support')} 4 (S4)</td>
                                    <td>{pivotResult.s4.toFixed(4)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={styles.formulaNote}>
                    <strong>{t('calculator.usageLabel', 'Usage:')}</strong> {t('calculator.pivotUsageNote', 'Levels above PP act as intraday resistance, levels below act as institutional support.')}
                </div>
            </div>
        </div>
    );
}
