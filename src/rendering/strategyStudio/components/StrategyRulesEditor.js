'use client';

import React from 'react';
import styles from '../styles/strategyStudio.module.scss';
import StrategyOperandEditor, { getDefaultParamsForIndicator } from './StrategyOperandEditor';
import CustomSelect from './CustomSelect';

export default function StrategyRulesEditor({
    title,
    conditions,
    isExit = false,
    target,
    targetType,
    stoploss,
    stoplossType,
    conditionTypes = [],
    operators = [],
    indicatorGroups = [],
    indIndex = {},
    onChange,
}) {
    const cond = conditions || { condition_type: isExit ? 'any' : 'all', rules: [] };
    const rules = cond.rules || [];

    // Ensure condition_type options always include the current value
    const condTypeOpts = [...conditionTypes];
    const currentCondType = cond.condition_type || (isExit ? 'any' : 'all');
    if (condTypeOpts.length === 0) {
        condTypeOpts.push({ value: 'all', label: 'All conditions must match (AND)' });
        condTypeOpts.push({ value: 'any', label: 'Any condition matches (OR)' });
    } else if (!condTypeOpts.some((ct) => ct.value === currentCondType)) {
        condTypeOpts.unshift({ value: currentCondType, label: currentCondType });
    }

    // Ensure operator options always include current rule operators
    const operatorOpts = [...operators];
    if (operatorOpts.length === 0) {
        const defaultOps = [
            { value: 'crossover', label: 'crosses above' },
            { value: 'crossdown', label: 'crosses below' },
            { value: '>', label: 'is greater than (>)' },
            { value: '>=', label: 'is greater than or equal to (>=)' },
            { value: '<', label: 'is less than (<)' },
            { value: '<=', label: 'is less than or equal to (<=)' },
            { value: '==', label: 'equals (==)' },
        ];
        operatorOpts.push(...defaultOps);
    }

    rules.forEach((r) => {
        if (r.operator && !operatorOpts.some((o) => o.value === r.operator)) {
            operatorOpts.push({ value: r.operator, label: r.operator });
        }
    });

    const handleUpdateRule = (index, updatedRule) => {
        const nextRules = [...rules];
        nextRules[index] = updatedRule;
        onChange({
            ...cond,
            rules: nextRules,
        });
    };

    const handleRemoveRule = (index) => {
        const nextRules = rules.filter((_, i) => i !== index);
        onChange({
            ...cond,
            rules: nextRules,
        });
    };

    const handleAddRule = () => {
        const smaSpec = indIndex['sma'];
        const defaultSmaParams = getDefaultParamsForIndicator(smaSpec);
        const newRule = {
            indicator1: { name: 'close', parameters: {} },
            operator: '>',
            indicator2: { name: 'sma', parameters: defaultSmaParams },
        };
        onChange({
            ...cond,
            rules: [...rules, newRule],
        });
    };

    // Resolve exit targets from props or cond
    const effectiveTarget = target !== undefined ? target : cond.target;
    const effectiveTargetType = targetType || cond.target_type || 'points';
    const effectiveStoploss = stoploss !== undefined ? stoploss : cond.stoploss;
    const effectiveStoplossType = stoplossType || cond.stoploss_type || 'points';

    return (
        <div style={{ marginTop: '16px' }}>
            <div className={styles.sectionSubheader}>{title}</div>

            {/* If this is Exit Rules, display the active Exit Conditions summary */}
            {isExit && (
                <div
                    style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(24, 201, 139, 0.08)',
                        border: '1px solid rgba(24, 201, 139, 0.25)',
                        marginBottom: '14px',
                        fontSize: '12.5px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, color: '#18c98b' }}>Active Exit Conditions:</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Configured via Targets above</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#f1f5f9' }}>
                        <div>
                            <span style={{ color: '#94a3b8' }}>Take Profit: </span>
                            <strong style={{ color: effectiveTarget != null ? '#18c98b' : '#94a3b8' }}>
                                {effectiveTarget != null ? `${effectiveTarget} ${effectiveTargetType}` : 'Off'}
                            </strong>
                        </div>
                        <div>
                            <span style={{ color: '#94a3b8' }}>Stop Loss: </span>
                            <strong style={{ color: effectiveStoploss != null ? '#f59e0b' : '#94a3b8' }}>
                                {effectiveStoploss != null ? `${effectiveStoploss} ${effectiveStoplossType}` : 'Off'}
                            </strong>
                        </div>
                    </div>
                    {rules.length === 0 && (
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                            Trades will exit when Take Profit or Stop Loss is reached. You can also add indicator exit rules below to close trades early on technical signals (e.g. reverse crossover).
                        </div>
                    )}
                </div>
            )}

            {/* Combine Rules Logic Selector - only show when there are 2 or more rules */}
            {rules.length > 1 && (
                <div className={styles.formField} style={{ marginBottom: '10px' }}>
                    <label>Combine rules</label>
                    <CustomSelect
                        value={currentCondType}
                        onChange={(val) =>
                            onChange({
                                ...cond,
                                condition_type: val,
                            })
                        }
                        options={condTypeOpts}
                        width="100%"
                    />
                </div>
            )}

            {/* List of Rules */}
            {rules.map((rule, idx) => (
                <div key={idx} className={styles.ruleEditBox}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                        }}
                    >
                        <strong className={styles.ruleTitle}>
                            Rule {idx + 1}
                        </strong>
                        <button
                            type="button"
                            className={styles.btnDangerAction}
                            onClick={() => handleRemoveRule(idx)}
                        >
                            Remove
                        </button>
                    </div>

                    {/* Indicator 1 Operand */}
                    <StrategyOperandEditor
                        operand={rule.indicator1}
                        indicatorGroups={indicatorGroups}
                        indIndex={indIndex}
                        onChange={(nextInd1) =>
                            handleUpdateRule(idx, { ...rule, indicator1: nextInd1 })
                        }
                    />

                    {/* Operator Select */}
                    <div className={styles.formField} style={{ margin: '8px 0' }}>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Operator
                        </label>
                        <CustomSelect
                            value={rule.operator || '>'}
                            onChange={(val) =>
                                handleUpdateRule(idx, { ...rule, operator: val })
                            }
                            options={operatorOpts}
                            width="100%"
                        />
                    </div>

                    {/* Indicator 2 Operand */}
                    <StrategyOperandEditor
                        operand={rule.indicator2}
                        indicatorGroups={indicatorGroups}
                        indIndex={indIndex}
                        onChange={(nextInd2) =>
                            handleUpdateRule(idx, { ...rule, indicator2: nextInd2 })
                        }
                    />
                </div>
            ))}

            {/* Empty state for rules */}
            {rules.length === 0 && !isExit && (
                <div style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 10px 0' }}>
                    No entry rules added. Click below to add an entry condition rule.
                </div>
            )}

            {/* Add Rule Button */}
            <button
                type="button"
                className={styles.btnGhostAction}
                style={{ marginTop: '6px', fontSize: '12px', padding: '6px 12px' }}
                onClick={handleAddRule}
            >
                {isExit ? '+ Add indicator exit rule' : '+ Add entry rule'}
            </button>
        </div>
    );
}
