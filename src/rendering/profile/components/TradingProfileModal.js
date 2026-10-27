'use client';

import React, { useState, useEffect } from 'react';
import styles from '../profile.module.scss';
import {
    EXPERIENCE_LEVELS,
    TRADING_STYLES,
    RISK_TOLERANCES,
    PRIMARY_GOALS,
    AVAILABLE_PAIRS,
    AVAILABLE_SESSIONS,
    buildInitialTradingProfileForm
} from '../utils/tradingAnalysisMapper';
import { tradingAnalysisApi } from '@/lib/tradingAnalysisApi';
import { toast } from '@/components/toast';
import AiAssessmentCard from './AiAssessmentCard';
import ProfileCustomSelect from './ProfileCustomSelect';
import { TradingViewPairIcon, SessionIcon } from './TradingViewPairIcon';

const STEPS = [
    { id: 1, title: 'Trader Identity', label: 'Identity' },
    { id: 2, title: 'Capital Allocation', label: 'Capital' },
    { id: 3, title: 'Risk Profile', label: 'Risk' },
    { id: 4, title: 'Financial Goals', label: 'Goals' },
    { id: 5, title: 'Markets & Sessions', label: 'Markets' },
];

export default function TradingProfileModal({
    isOpen,
    onClose,
    onSuccess,
    initialPreferences,
    onboardingData,
    user,
    t
}) {
    const [form, setForm] = useState(() => buildInitialTradingProfileForm({
        apiPreferences: initialPreferences,
        onboardingData,
        user
    }));
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState('form');
    const [resultData, setResultData] = useState(null);

    // Sync form whenever modal opens or initial data updates
    useEffect(() => {
        if (isOpen) {
            setForm(buildInitialTradingProfileForm({
                apiPreferences: initialPreferences,
                onboardingData,
                user
            }));
            setCurrentStep(1);
            setViewMode('form');
            setResultData(null);
        }
    }, [isOpen, initialPreferences, onboardingData, user]);

    // Handle explicit immediate close from any step or button
    const handleCloseModal = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (submitting) return;
        if (onClose) {
            onClose();
        }
    };

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !submitting) {
                handleCloseModal(e);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, submitting]);

    if (!isOpen) return null;

    const handleTextChange = (section, field, value) => {
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNumberChange = (section, field, value) => {
        const num = parseFloat(value) || 0;
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: num
            }
        }));
    };

    const togglePair = (pair) => {
        setForm((prev) => {
            const current = prev.preferences?.preferred_currency_pairs || [];
            const exists = current.includes(pair);
            const next = exists ? current.filter((p) => p !== pair) : [...current, pair];
            return {
                ...prev,
                preferences: {
                    ...prev.preferences,
                    preferred_currency_pairs: next.length > 0 ? next : [pair]
                }
            };
        });
    };

    const toggleSession = (session) => {
        setForm((prev) => {
            const current = prev.preferences?.preferred_sessions || [];
            const exists = current.includes(session);
            const next = exists ? current.filter((s) => s !== session) : [...current, session];
            return {
                ...prev,
                preferences: {
                    ...prev.preferences,
                    preferred_sessions: next.length > 0 ? next : [session]
                }
            };
        });
    };

    const handleNextStep = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (currentStep === 1) {
            if (!form.personal.full_name?.trim()) {
                toast.error('Please enter your full name');
                return;
            }
        }
        if (currentStep === 2) {
            if (!form.investment.total_investment_capital || Number(form.investment.total_investment_capital) <= 0) {
                toast.error('Please enter a valid investment capital amount');
                return;
            }
        }
        if (currentStep < 5) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevStep = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (submitting) return;
        setSubmitting(true);

        const payload = {
            personal: {
                full_name: form.personal.full_name || 'Trader',
                experience_level: form.personal.experience_level || 'Intermediate',
                trading_style: form.personal.trading_style || 'Day Trading'
            },
            investment: {
                total_investment_capital: parseFloat(form.investment.total_investment_capital) || 5000,
                monthly_top_up: parseFloat(form.investment.monthly_top_up) || 0
            },
            risk: {
                risk_tolerance: form.risk.risk_tolerance || 'Moderate',
                max_acceptable_drawdown: form.risk.max_acceptable_drawdown || '15%',
                max_risk_per_trade: form.risk.max_risk_per_trade || '1-2%'
            },
            goals: {
                primary_goal: form.goals.primary_goal || 'Wealth Building',
                monthly_return_target: form.goals.monthly_return_target || '5%',
                profit_goal: parseFloat(form.goals.profit_goal) || 25000,
                timeframe: parseInt(form.goals.timeframe, 10) || 12,
                describe_goals: form.goals.describe_goals || 'Achieve consistent risk-adjusted returns.'
            },
            preferences: {
                preferred_currency_pairs: form.preferences.preferred_currency_pairs || ['EUR/USD', 'GBP/USD', 'XAU/USD'],
                preferred_sessions: form.preferences.preferred_sessions || ['London Session', 'New York Session']
            },
            generate_ai: true
        };

        try {
            const res = await tradingAnalysisApi.saveAndAnalyzeTradingProfile(payload);
            if (res.status === 'success' || res.success || res.data) {
                toast.success('AI Trading Profile Analysis generated successfully!');
                const updatedData = res.data || res;
                if (onSuccess) {
                    onSuccess(updatedData);
                }
                // Auto-close the modal — results are shown on the profile page directly
                if (onClose) {
                    onClose();
                }
            } else {
                toast.error(res.message || 'Failed to save profile analysis');
            }
        } catch (err) {
            toast.error(err.message || 'Error communicating with backend');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className={styles.tradingAnalysisModalOverlay} onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(e); }}>
            <div className={styles.tradingAnalysisModalCard}>
                {/* Header (Always at the very top) */}
                <div className={styles.modalHeaderRow}>
                    <div className={styles.headerTitleGroup}>
                        <div className={styles.headerIconWrap}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#18C98B">
                                <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
                                <path d="M19 16L20.2 19.3L23.5 20.5L20.2 21.7L19 25L17.8 21.7L14.5 20.5L17.8 19.3L19 16Z" opacity="0.85" />
                                <path d="M5 2L5.8 4.2L8 5L5.8 5.8L5 8L4.2 5.8L2 5L4.2 4.2L5 2Z" opacity="0.85" />
                            </svg>
                        </div>
                        <div>
                            <h3>Trading Profile & AI Strategy Analysis</h3>
                            <p>Calibrate your personal risk metrics, capital parameters, and trading objectives.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.modalCloseBtn}
                        onClick={handleCloseModal}
                        disabled={submitting}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Stepper Progress Bar (Directly below header) */}
                {viewMode === 'form' && (
                    <div className={styles.stepperContainer}>
                        {STEPS.map((step, idx) => {
                            const isCompleted = step.id < currentStep;
                            const isActive = step.id === currentStep;
                            return (
                                <React.Fragment key={step.id}>
                                    <button
                                        type="button"
                                        className={`${styles.stepperItem} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
                                        onClick={() => {
                                            if (step.id <= currentStep) {
                                                setCurrentStep(step.id);
                                            }
                                        }}
                                        disabled={step.id > currentStep || submitting}
                                        title={`Step ${step.id}: ${step.title}`}
                                    >
                                        <span className={styles.stepCircle}>
                                            {isCompleted ? (
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (
                                                step.id
                                            )}
                                        </span>
                                        <span className={styles.stepLabel}>{step.label}</span>
                                    </button>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`${styles.stepLine} ${step.id < currentStep ? styles.completed : ''}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                {/* Content Body: Result View or 5-Step Form */}
                {viewMode === 'result' ? (
                    <div className={styles.modalScrollBody}>
                        <AiAssessmentCard
                            analysis={resultData?.analysis || resultData?.latest_analysis || resultData}
                            preferences={form}
                            user={user}
                        />
                        <div className={`${styles.modalFooterRow} ${styles.resultFooterRow}`}>
                            <button
                                type="button"
                                className={styles.btnCancel}
                                onClick={() => setViewMode('form')}
                            >
                                ← Edit Parameters
                            </button>
                            <button
                                type="button"
                                className={styles.btnAnalyzeSubmit}
                                onClick={handleCloseModal}
                            >
                                <span>Done & View on Profile</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.modalScrollBody}>
                        {/* Step 1: Trader Identity & Experience */}
                        {currentStep === 1 && (
                            <div className={styles.stepFormWrap}>
                                <div className={styles.fieldGroup}>
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={form.personal.full_name}
                                        onChange={(e) => handleTextChange('personal', 'full_name', e.target.value)}
                                        placeholder="e.g. Alex Morgan"
                                        required
                                    />
                                </div>
                                <div className={`${styles.inputsGrid2} ${styles.gridTopGap4}`}>
                                    <div className={styles.fieldGroup}>
                                        <label>Experience Level</label>
                                        <ProfileCustomSelect
                                            value={form.personal.experience_level}
                                            onChange={(val) => handleTextChange('personal', 'experience_level', val)}
                                            options={EXPERIENCE_LEVELS}
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label>Primary Trading Style</label>
                                        <ProfileCustomSelect
                                            value={form.personal.trading_style}
                                            onChange={(val) => handleTextChange('personal', 'trading_style', val)}
                                            options={TRADING_STYLES}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Capital Allocation & Top-Ups */}
                        {currentStep === 2 && (
                            <div className={styles.stepFormWrap}>
                                <div className={styles.inputsGrid2}>
                                    <div className={styles.fieldGroup}>
                                        <label>Total Trading Capital ($ USD)</label>
                                        <input
                                            type="number"
                                            min="100"
                                            step="100"
                                            value={form.investment.total_investment_capital}
                                            onChange={(e) => handleNumberChange('investment', 'total_investment_capital', e.target.value)}
                                            placeholder="5000"
                                            required
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label>Monthly Top-Up / Deposit ($ USD)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="50"
                                            value={form.investment.monthly_top_up}
                                            onChange={(e) => handleNumberChange('investment', 'monthly_top_up', e.target.value)}
                                            placeholder="500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Risk Profile & Drawdown Bounds */}
                        {currentStep === 3 && (
                            <div className={styles.stepFormWrap}>
                                <div className={styles.fieldGroup}>
                                    <label>Risk Tolerance</label>
                                    <ProfileCustomSelect
                                        value={form.risk.risk_tolerance}
                                        onChange={(val) => handleTextChange('risk', 'risk_tolerance', val)}
                                        options={RISK_TOLERANCES}
                                    />
                                </div>
                                <div className={`${styles.inputsGrid2} ${styles.gridTopGap4}`}>
                                    <div className={styles.fieldGroup}>
                                        <label>Max Acceptable Drawdown</label>
                                        <input
                                            type="text"
                                            value={form.risk.max_acceptable_drawdown}
                                            onChange={(e) => handleTextChange('risk', 'max_acceptable_drawdown', e.target.value)}
                                            placeholder="15%"
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label>Max Risk Per Trade</label>
                                        <input
                                            type="text"
                                            value={form.risk.max_risk_per_trade}
                                            onChange={(e) => handleTextChange('risk', 'max_risk_per_trade', e.target.value)}
                                            placeholder="1-2%"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Financial Goals & Target Horizon */}
                        {currentStep === 4 && (
                            <div className={styles.stepFormWrap}>
                                <div className={styles.inputsGrid2}>
                                    <div className={styles.fieldGroup}>
                                        <label>Primary Objective</label>
                                        <ProfileCustomSelect
                                            value={form.goals.primary_goal}
                                            onChange={(val) => handleTextChange('goals', 'primary_goal', val)}
                                            options={PRIMARY_GOALS}
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label>Monthly Return Target</label>
                                        <input
                                            type="text"
                                            value={form.goals.monthly_return_target}
                                            onChange={(e) => handleTextChange('goals', 'monthly_return_target', e.target.value)}
                                            placeholder="5%"
                                        />
                                    </div>
                                </div>
                                <div className={`${styles.inputsGrid2} ${styles.gridTopGap4}`}>
                                    <div className={styles.fieldGroup}>
                                        <label>Profit Goal ($ USD)</label>
                                        <input
                                            type="number"
                                            min="500"
                                            step="500"
                                            value={form.goals.profit_goal}
                                            onChange={(e) => handleNumberChange('goals', 'profit_goal', e.target.value)}
                                            placeholder="25000"
                                            required
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label>Horizon (Months)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={form.goals.timeframe}
                                            onChange={(e) => handleNumberChange('goals', 'timeframe', e.target.value)}
                                            placeholder="12"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={`${styles.fieldGroup} ${styles.gridTopGap4}`}>
                                    <label>Custom Strategy Mission</label>
                                    <input
                                        type="text"
                                        value={form.goals.describe_goals}
                                        onChange={(e) => handleTextChange('goals', 'describe_goals', e.target.value)}
                                        placeholder="e.g. Build disciplined capital compounding on liquid majors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 5: Preferred Pairs & Market Sessions */}
                        {currentStep === 5 && (
                            <div className={styles.stepFormWrap}>
                                <div className={styles.fieldGroup}>
                                    <label>Preferred Currency Pairs & Commodities</label>
                                    <div className={styles.chipsWrap}>
                                        {AVAILABLE_PAIRS.map((pairObj) => {
                                            const pairId = pairObj.id || pairObj;
                                            const isSelected = form.preferences?.preferred_currency_pairs?.includes(pairId);
                                            return (
                                                <button
                                                    key={pairId}
                                                    type="button"
                                                    className={`${styles.chipPill} ${isSelected ? styles.selected : ''}`}
                                                    onClick={() => togglePair(pairId)}
                                                >
                                                    <span className={styles.chipIcon}>
                                                        <TradingViewPairIcon pair={pairId} size={18} />
                                                    </span>
                                                    <span className={styles.chipSymbol}>{pairId}</span>
                                                    {isSelected ? (
                                                        <span className={styles.chipCheck}>✓</span>
                                                    ) : (
                                                        <span className={styles.chipPlus}>+</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className={`${styles.fieldGroup} ${styles.fieldGroupTopGap10}`}>
                                    <label>Active Trading Sessions</label>
                                    <div className={styles.chipsWrap}>
                                        {AVAILABLE_SESSIONS.map((sessObj) => {
                                            const sessId = sessObj.id || sessObj;
                                            const sessLabel = sessObj.label || sessId;
                                            const isSelected = form.preferences?.preferred_sessions?.includes(sessId);
                                            return (
                                                <button
                                                    key={sessId}
                                                    type="button"
                                                    className={`${styles.chipPill} ${isSelected ? styles.selected : ''}`}
                                                    onClick={() => toggleSession(sessId)}
                                                >
                                                    <span className={styles.chipIcon}>
                                                        <SessionIcon session={sessId} size={18} />
                                                    </span>
                                                    <span className={styles.chipSymbol}>{sessLabel}</span>
                                                    {isSelected ? (
                                                        <span className={styles.chipCheck}>✓</span>
                                                    ) : (
                                                        <span className={styles.chipPlus}>+</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Footer Stepper Controls */}
                        <div className={styles.modalFooterRow}>
                            <div className={styles.footerLeftGroup}>
                                <button
                                    type="button"
                                    className={styles.btnCancel}
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        className={styles.btnBack}
                                        onClick={handlePrevStep}
                                        disabled={submitting}
                                    >
                                        ← Back
                                    </button>
                                )}
                            </div>

                            {currentStep < 5 ? (
                                <button type="button" className={styles.btnAnalyzeSubmit} onClick={handleNextStep}>
                                    <span>Next Step →</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.btnAnalyzeSubmit}
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className={styles.livePulseDot} />
                                            <span>Generating AI Analysis...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
                                                <path d="M19 16L20.2 19.3L23.5 20.5L20.2 21.7L19 25L17.8 21.7L14.5 20.5L17.8 19.3L19 16Z" opacity="0.85" />
                                                <path d="M5 2L5.8 4.2L8 5L5.8 5.8L5 8L4.2 5.8L2 5L4.2 4.2L5 2Z" opacity="0.85" />
                                            </svg>
                                            <span>Generate AI Profile Analysis</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
