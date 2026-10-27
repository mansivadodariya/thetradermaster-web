import React from 'react';
import styles from '../customBotBuilder.module.scss';
import { INDICATOR_DEFINITIONS, getConditionParams, getNextEmaDefaults, validateEntryCondition } from '../constants';
import CustomSelect from './CustomSelect';

export default function StepEntryRules({ data, errors = {}, onChange, indicators }) {
    const { triggerMode, entryConditions = [] } = data;
    const activeIndicators = indicators || {};

    const indicatorOptions = Object.keys(activeIndicators)
        .filter(key => activeIndicators[key] && activeIndicators[key].isActive !== false)
        .map(key => ({
            value: key,
            label: activeIndicators[key].name || key
        }));

    const handleAddCondition = () => {
        if (entryConditions.length >= 10) return;
        const availableKeys = Object.keys(activeIndicators);
        const defaultKey = activeIndicators.ema_crossover ? 'ema_crossover' : (availableKeys[0] || 'ema_crossover');
        const emaDefaults = defaultKey === 'ema_crossover' ? getNextEmaDefaults(entryConditions, -1, false) : {};
        const def = activeIndicators[defaultKey] || INDICATOR_DEFINITIONS[defaultKey] || INDICATOR_DEFINITIONS.ema_crossover;
        const defaultCond = (def.conditions && def.conditions[0]) || 'Golden Cross (Fast > Slow)';
        const condParams = getConditionParams(defaultKey, defaultCond, entryConditions, -1);

        const newCondition = {
            id: 'cond_' + Date.now(),
            indicatorKey: defaultKey,
            condition: defaultCond,
            params: { ...(condParams.defaultParams || {}), ...emaDefaults }
        };
        onChange('entryConditions', [...entryConditions, newCondition]);
    };

    const handleRemoveCondition = (indexToRemove) => {
        const updated = entryConditions.filter((_, idx) => idx !== indexToRemove);
        onChange('entryConditions', updated);
    };

    const handleIndicatorChange = (index, newKey) => {
        const def = activeIndicators[newKey] || activeIndicators.ema_crossover || INDICATOR_DEFINITIONS.ema_crossover;
        const defaultCond = (def.conditions && def.conditions[0]) || 'Standard Signal';
        const condParams = getConditionParams(newKey, defaultCond, entryConditions, index);
        const updated = [...entryConditions];
        updated[index] = {
            ...updated[index],
            indicatorKey: newKey,
            condition: defaultCond,
            params: { ...condParams.defaultParams }
        };
        onChange('entryConditions', updated);
    };

    const handleConditionChange = (index, newCondition) => {
        const indicatorKey = entryConditions[index]?.indicatorKey || 'ema_crossover';
        const currentCond = entryConditions[index]?.condition || '';
        const currentParams = entryConditions[index]?.params || {};
        const isOldSingle = currentCond.includes('Price Above') || currentCond.includes('Price Below');
        const isNewSingle = newCondition.includes('Price Above') || newCondition.includes('Price Below');

        let newParams;
        if (indicatorKey === 'ema_crossover' && isOldSingle === isNewSingle) {
            newParams = { ...currentParams };
        } else {
            const condParams = getConditionParams(indicatorKey, newCondition, entryConditions, index);
            newParams = { ...condParams.defaultParams };
        }

        const updated = [...entryConditions];
        updated[index] = {
            ...updated[index],
            condition: newCondition,
            params: newParams
        };
        onChange('entryConditions', updated);
    };

    const handleParamChange = (index, paramKey, value, step = 1, maxLimit = 1000) => {
        const updated = [...entryConditions];
        let parsedVal = value;
        if (value !== '') {
            const clean = String(value).replace(step < 1 ? /[^0-9.]/g : /[^0-9]/g, '');
            const num = step < 1 ? parseFloat(clean) : parseInt(clean, 10);
            parsedVal = isNaN(num) ? '' : Math.min(maxLimit, Math.max(0, num));
        }
        updated[index] = {
            ...updated[index],
            params: {
                ...updated[index].params,
                [paramKey]: parsedVal
            }
        };
        onChange('entryConditions', updated);
    };

    return (
        <div className={styles.stepContentWrapper}>
            {/* Trigger Switcher Row (Shown when 2+ conditions configured) */}
            {entryConditions.length > 1 && (
                <div className={styles.triggerSwitchRow}>
                    <span className={styles.triggerLabel}>Trigger when</span>
                    <div className={styles.triggerButtonGroup}>
                        <button
                            type="button"
                            className={`${styles.triggerBtn} ${triggerMode === 'ALL' ? styles.triggerBtnActive : ''}`}
                            onClick={() => onChange('triggerMode', 'ALL')}
                        >
                            ALL conditions met
                        </button>
                        <button
                            type="button"
                            className={`${styles.triggerBtn} ${triggerMode === 'ANY' ? styles.triggerBtnActive : ''}`}
                            onClick={() => onChange('triggerMode', 'ANY')}
                        >
                            ANY condition met
                        </button>
                    </div>
                </div>
            )}

            {errors.entryConditions && (
                <span className={styles.errorHelperText}>
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {errors.entryConditions}
                </span>
            )}

            {/* Empty State when no conditions added */}
            {entryConditions.length === 0 && (
                <div className={styles.emptyConditionsCard}>
                    <div className={styles.emptyIconWrap}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    </div>
                    <div className={styles.emptyTextWrap}>
                        <h5>No Entry Conditions Configured</h5>
                        <p>Click "+ Add Entry Condition" below to configure your technical entry signals (e.g. EMA, RSI, MACD).</p>
                    </div>
                </div>
            )}

            {/* List of Condition Cards */}
                <div className={styles.conditionsList}>
                    {entryConditions.map((cond, index) => {
                        const def = activeIndicators[cond.indicatorKey] || activeIndicators.ema_crossover || INDICATOR_DEFINITIONS.ema_crossover;
                        const conditionOptions = (def?.conditions || ['Standard Signal']).map(c => ({ value: c, label: c }));
                        const condParams = getConditionParams(cond.indicatorKey, cond.condition, entryConditions, index);
                        const condError = validateEntryCondition(cond, entryConditions, index);

                        return (
                            <div key={cond.id || index} className={styles.conditionCard}>
                                {/* Card Header */}
                                <div className={styles.conditionCardHeader}>
                                    <div className={styles.headerLeft}>
                                        <span className={styles.dragHandle} title="Reorder condition">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <circle cx="9" cy="6" r="1.5" />
                                                <circle cx="15" cy="6" r="1.5" />
                                                <circle cx="9" cy="12" r="1.5" />
                                                <circle cx="15" cy="12" r="1.5" />
                                                <circle cx="9" cy="18" r="1.5" />
                                                <circle cx="15" cy="18" r="1.5" />
                                            </svg>
                                        </span>
                                        <span className={styles.condIndex}>{index + 1}</span>
                                        <span className={styles.condHeaderTitle}>{def.name}</span>
                                        <span className={styles.condHeaderCondition}>— {cond.condition}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.deleteCondBtn}
                                        onClick={() => handleRemoveCondition(index)}
                                        title="Delete Condition"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Dropdowns Row: Indicator & Condition using CustomSelect */}
                            <div className={styles.gridTwoCols}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Indicator</label>
                                    <CustomSelect
                                        value={cond.indicatorKey}
                                        onChange={(val) => handleIndicatorChange(index, val)}
                                        options={indicatorOptions}
                                        placeholder="Select Indicator..."
                                    />
                                    <span className={styles.fieldHelper}>{def.desc}</span>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Condition Signal</label>
                                    <CustomSelect
                                        value={cond.condition}
                                        onChange={(val) => handleConditionChange(index, val)}
                                        options={conditionOptions}
                                        placeholder="Select Condition..."
                                    />
                                </div>
                            </div>

                            {/* Dynamic Parameters Grid */}
                            <div className={styles.paramGrid}>
                                {(condParams.fields || []).map(field => {
                                    const { key: paramKey, label, min = 1, max = 1000, step = 1, default: defaultVal } = field;
                                    const val = cond.params?.[paramKey] !== undefined ? cond.params[paramKey] : defaultVal;
                                    const isInvalid = Boolean(condError);

                                    return (
                                        <div key={paramKey} className={styles.paramItem}>
                                            <label className={styles.paramLabel}>{label}</label>
                                            <input
                                                type="number"
                                                min={Math.max(0, min)}
                                                max={max}
                                                step={step}
                                                onKeyDown={(e) => {
                                                    if (['-', '+', 'e', 'E'].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className={`${styles.paramInput} ${isInvalid ? styles.inputError : ''}`}
                                                placeholder={String(defaultVal)}
                                                value={val}
                                                onChange={(e) => handleParamChange(index, paramKey, e.target.value, step, max)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Inline Condition Error Message */}
                            {condError && (
                                <div className={styles.conditionErrorMsg}>
                                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>{condError}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
                </div>
          

            {/* Add Condition Button */}
            <button
                type="button"
                className={styles.addConditionBtn}
                onClick={handleAddCondition}
            >
                <span className={styles.plusIcon}>+</span>
                <span>Add Entry Condition</span>
            </button>
        </div>
    );
}
