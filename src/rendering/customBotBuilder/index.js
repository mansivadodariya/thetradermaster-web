'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/toast';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './customBotBuilder.module.scss';
import CommonSectionHeader from '@/components/CommonSectionHeader';
import { CustomBotIcon } from '@/icons/sidebarIcons';
import { useLanguage } from '@/context/LanguageContext';
import StepperHeader from './components/StepperHeader';
import StepBasics from './components/StepBasics';
import StepEntryRules from './components/StepEntryRules';
import StepExitRules from './components/StepExitRules';
import StepRisk from './components/StepRisk';
import StepReview from './components/StepReview';
import StepFooterNav from './components/StepFooterNav';
import { validateEntryCondition, INDICATOR_DEFINITIONS } from './constants';
import { fetchIndicatorsFromSupabase } from '@/lib/indicatorsData';
import { botBuilderApi, normalizeSymbol, normalizeTimeframe } from '@/lib/botBuilderApi';

const INITIAL_FORM_DATA = {
    botName: '',
    description: '',
    tradingPair: 'EUR/USD',
    timeframe: '15m',
    triggerMode: 'ALL',
    direction: 'both',
    initialCapital: 10000,
    entryConditions: [],
    takeProfitPips: '40',
    stopLossPips: '20',
    trailingStop: false,
    trailingDistance: '',
    riskLevel: 'medium',
    lotSize: 0.1,
    maxOpenPositions: 3,
    riskPerTrade: 2,
    maxDailyLoss: 5
};

function validateStep(step, data, t) {
    const errors = {};

    if (step === 1) {
        if (!data.botName || !data.botName.trim()) {
            errors.botName = t ? t('botBuilder.validation.botNameRequired', 'Bot name is required') : 'Bot name is required';
        } else if (data.botName.trim().length < 3) {
            errors.botName = t ? t('botBuilder.validation.botNameMin', 'Bot name must be at least 3 characters') : 'Bot name must be at least 3 characters';
        } else if (data.botName.trim().length > 50) {
            errors.botName = 'Bot name cannot exceed 50 characters';
        }

        if (!data.tradingPair) {
            errors.tradingPair = t ? t('botBuilder.validation.selectPair', 'Please select a trading pair') : 'Please select a trading pair';
        }

        if (!data.timeframe) {
            errors.timeframe = t ? t('botBuilder.validation.selectTimeframe', 'Please select a timeframe') : 'Please select a timeframe';
        }
    }

    if (step === 2) {
        if (!data.entryConditions || data.entryConditions.length === 0) {
            errors.entryConditions = t ? t('botBuilder.validation.addEntryCondition', 'Please add at least one entry condition') : 'Please add at least one entry condition';
        } else {
            for (let i = 0; i < data.entryConditions.length; i++) {
                const condErr = validateEntryCondition(data.entryConditions[i], data.entryConditions, i, t);
                if (condErr) {
                    errors.entryConditions = `Condition #${i + 1}: ${condErr}`;
                    break;
                }
            }
        }
    }

    if (step === 3) {
        if (!data.takeProfitPips || Number(data.takeProfitPips) <= 0) {
            errors.takeProfitPips = t ? t('botBuilder.validation.tpRequired', 'Take Profit (pips) is required') : 'Take Profit must be greater than 0 pips';
        } else if (Number(data.takeProfitPips) > 10000) {
            errors.takeProfitPips = 'Take Profit cannot exceed 10,000 pips';
        }
        if (!data.stopLossPips || Number(data.stopLossPips) <= 0) {
            errors.stopLossPips = t ? t('botBuilder.validation.slRequired', 'Stop Loss (pips) is required') : 'Stop Loss must be greater than 0 pips';
        } else if (Number(data.stopLossPips) > 10000) {
            errors.stopLossPips = 'Stop Loss cannot exceed 10,000 pips';
        }
        if (data.trailingStop) {
            if (!data.trailingDistance || Number(data.trailingDistance) <= 0) {
                errors.trailingDistance = 'Trailing distance must be greater than 0 pips';
            } else if (Number(data.trailingDistance) > 10000) {
                errors.trailingDistance = 'Trailing distance cannot exceed 10,000 pips';
            }
        }
    }

    if (step === 4) {
        if (!data.lotSize || Number(data.lotSize) <= 0) {
            errors.lotSize = 'Lot size must be greater than 0 (e.g. 0.10)';
        } else if (Number(data.lotSize) > 50) {
            errors.lotSize = 'Lot size cannot exceed 50 lots';
        }
        if (!data.maxOpenPositions || Number(data.maxOpenPositions) < 1) {
            errors.maxOpenPositions = 'Max open positions must be at least 1';
        } else if (Number(data.maxOpenPositions) > 50) {
            errors.maxOpenPositions = 'Max open positions cannot exceed 50';
        }
        if (!data.riskPerTrade || Number(data.riskPerTrade) <= 0 || Number(data.riskPerTrade) > 100) {
            errors.riskPerTrade = 'Risk per trade must be between 0.1% and 100%';
        }
        if (!data.maxDailyLoss || Number(data.maxDailyLoss) <= 0 || Number(data.maxDailyLoss) > 100) {
            errors.maxDailyLoss = 'Max daily loss must be between 0.5% and 100%';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

export default function CustomBotBuilderView() {
    const { t } = useLanguage();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [indicators, setIndicators] = useState({});
    const [isSimulating, setIsSimulating] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [simulationResult, setSimulationResult] = useState(null);
    const [savedStrategyId, setSavedStrategyId] = useState(null);

    useEffect(() => {
        let isMounted = true;
        fetchIndicatorsFromSupabase(true).then((data) => {
            if (isMounted && data) {
                setIndicators(data);
            }
        }).catch(() => {});
        return () => { isMounted = false; };
    }, []);

    const isCurrentStepValid = useMemo(() => {
        return validateStep(currentStep, formData, t).isValid;
    }, [currentStep, formData, t]);

    const handleFormChange = (field, value) => {
        let sanitizedValue = value;
        const numericFields = ['takeProfitPips', 'stopLossPips', 'trailingDistance', 'lotSize', 'maxOpenPositions', 'riskPerTrade', 'maxDailyLoss', 'initialCapital'];
        if (numericFields.includes(field) && value !== '' && value !== undefined && value !== null) {
            const num = Number(value);
            if (!isNaN(num)) {
                let maxCap = Infinity;
                if (['takeProfitPips', 'stopLossPips', 'trailingDistance'].includes(field)) maxCap = 10000;
                if (['lotSize', 'maxOpenPositions'].includes(field)) maxCap = 50;
                if (['riskPerTrade', 'maxDailyLoss'].includes(field)) maxCap = 100;
                sanitizedValue = Math.min(maxCap, Math.max(0, num));
            }
        }

        setFormData(prev => ({
            ...prev,
            [field]: sanitizedValue
        }));

        // Reset savedStrategyId if core parameters change so new version is created/updated cleanly
        if (['botName', 'tradingPair', 'timeframe', 'entryConditions', 'takeProfitPips', 'stopLossPips', 'lotSize'].includes(field)) {
            setSimulationResult(null);
        }

        if (errors[field]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handlePrev = () => {
        setErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        const { isValid, errors: validationErrors } = validateStep(currentStep, formData, t);

        if (!isValid) {
            setErrors(validationErrors);
            const firstError = Object.values(validationErrors)[0];
            toast.error(firstError);
            return;
        }

        setErrors({});
        setCurrentStep(prev => Math.min(prev + 1, 5));
    };

    const handleSelectStep = (targetStep) => {
        if (targetStep < currentStep) {
            setErrors({});
            setCurrentStep(targetStep);
            return;
        }

        const { isValid, errors: validationErrors } = validateStep(currentStep, formData, t);
        if (!isValid) {
            setErrors(validationErrors);
            toast.error(Object.values(validationErrors)[0]);
            return;
        }

        setErrors({});
        setCurrentStep(targetStep);
    };

    /**
     * Executes real historical backtest simulation via backend API
     */
    const handleRunBacktest = async () => {
        for (let s = 1; s <= 4; s++) {
            const { isValid, errors: validationErrors } = validateStep(s, formData, t);
            if (!isValid) {
                setCurrentStep(s);
                setErrors(validationErrors);
                toast.error(Object.values(validationErrors)[0]);
                return;
            }
        }

        setIsSimulating(true);
        toast.loading('Validating JSON and initializing backtest simulation...', { id: 'sim-toast' });

        try {
            // First save or ensure strategy is saved to obtain strategy_id
            let activeStrategyId = savedStrategyId;

            if (!activeStrategyId) {
                const saveRes = await botBuilderApi.createStrategy(formData);
                if (!saveRes.success) {
                    throw new Error(saveRes.error || 'Failed to validate and save strategy for backtesting');
                }
                activeStrategyId = saveRes.strategyId || saveRes.data?.strategy_id || saveRes.data?.id;
                setSavedStrategyId(activeStrategyId);
            }

            toast.loading(`Simulating historical trades on ${formData.tradingPair || 'asset'}...`, { id: 'sim-toast' });

            const backtestRes = await botBuilderApi.runBacktest(activeStrategyId);
            if (!backtestRes.success) {
                throw new Error(backtestRes.error || 'Backtest engine simulation failed');
            }

            const winRate = Number(backtestRes.winRate || 0).toFixed(1);
            const trades = backtestRes.trades || 0;
            const pnl = Number(backtestRes.pnl || 0).toFixed(2);
            const pf = Number(backtestRes.profitFactor || 0).toFixed(2);
            const maxDd = Number(backtestRes.maxDrawdown || 0).toFixed(2);

            setSimulationResult({
                strategy_id: activeStrategyId,
                winRate,
                trades,
                pnl,
                profitFactor: pf,
                maxDrawdown: maxDd,
                raw: backtestRes
            });

            toast.success(`Simulation verified: ${winRate}% Win Rate across ${trades} trades (PnL: $${pnl})`, { id: 'sim-toast' });
        } catch (simErr) {
            console.error('Simulation error:', simErr);
            toast.error(simErr.message || 'Simulation failed', { id: 'sim-toast' });
        } finally {
            setIsSimulating(false);
        }
    };

    /**
     * Direct Navigation to Full Backtest Engine with loaded strategy ID
     */
    const handleOpenBacktest = () => {
        const stratId = savedStrategyId || simulationResult?.strategy_id;
        const cleanSymbol = normalizeSymbol(formData.tradingPair || 'EUR/USD');
        const cleanTf = normalizeTimeframe(formData.timeframe || '15min');

        if (typeof window !== 'undefined' && stratId) {
            sessionStorage.setItem('pending_backtest_run', JSON.stringify({
                strategy_id: stratId,
                name: formData.botName || 'Custom Bot Strategy',
                source: 'user_strategies',
                symbol: cleanSymbol,
                interval: cleanTf,
                capital: formData.initialCapital || 10000,
                quantity: formData.lotSize || 0.1
            }));
            window.dispatchEvent(new CustomEvent('page:loading:start'));
            router.push(`/backtest?strategy_id=${encodeURIComponent(stratId)}&name=${encodeURIComponent(formData.botName || '')}&source=user_strategies`);
        } else {
            toast.error('Please run a simulation or deploy the bot first to generate a backtest ID');
        }
    };

    /**
     * Deploys and saves strategy to backend API & user_strategies table
     */
    const handleDeployBot = async () => {
        for (let s = 1; s <= 4; s++) {
            const { isValid, errors: validationErrors } = validateStep(s, formData, t);
            if (!isValid) {
                setCurrentStep(s);
                setErrors(validationErrors);
                toast.error(Object.values(validationErrors)[0]);
                return;
            }
        }

        setIsDeploying(true);
        toast.loading('Deploying bot strategy to database & execution engine...', { id: 'deploy-bot-toast' });

        try {
            // POST /api/v1/bot-builder/strategies with validated BotStrategyCreate payload
            const apiResult = await botBuilderApi.createStrategy(formData);

            if (!apiResult.success) {
                throw new Error(apiResult.error || 'Failed to deploy bot strategy to backend');
            }

            const botId = apiResult?.strategyId || apiResult?.data?.strategy_id || apiResult?.data?.id;
            if (!botId) {
                throw new Error('Backend did not return a valid strategy ID');
            }

            const cleanSym = normalizeSymbol(formData.tradingPair || 'EUR/USD');
            const cleanTf = normalizeTimeframe(formData.timeframe || '15min');

            const newBot = {
                id: botId,
                strategyId: botId,
                name: formData.botName || 'Custom Algo Bot',
                symbol: cleanSym,
                timeframe: cleanTf,
                type: 'Custom Bot',
                creationType: 'custom',
                creation_type: 'custom',
                created_by: 'custom',
                status: 'active',
                winRate: simulationResult?.winRate ? `${simulationResult.winRate}%` : 'Pending Backtest',
                profitFactor: simulationResult?.profitFactor || '1.50',
                totalPnl: simulationResult?.pnl ? `$${simulationResult.pnl}` : '$0.00',
                lotSize: Number(formData.lotSize) || 0.1,
                riskLevel: formData.riskLevel || 'medium',
                takeProfitPips: formData.takeProfitPips,
                stopLossPips: formData.stopLossPips,
                trailingStop: formData.trailingStop,
                trailingDistance: formData.trailingDistance,
                createdAt: new Date().toISOString(),
                rawStrategy: apiResult?.data || null
            };

            try {
                const current = JSON.parse(localStorage.getItem('tradermaster_user_bots') || '[]');
                current.unshift(newBot);
                localStorage.setItem('tradermaster_user_bots', JSON.stringify(current));
            } catch (storageErr) {
                console.warn('LocalStorage save notice:', storageErr);
            }

            // Set pending backtest session storage so the user can backtest immediately
            try {
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('pending_backtest_run', JSON.stringify({
                        strategy_id: botId,
                        name: newBot.name,
                        source: 'user_strategies',
                        symbol: cleanSym,
                        interval: cleanTf,
                        capital: formData.initialCapital || 10000,
                        quantity: newBot.lotSize
                    }));
                    sessionStorage.setItem('myBots_filter', 'custom');
                }
            } catch (_) {}

            toast.success(`Custom Bot "${newBot.name}" deployed and saved to database successfully!`, { id: 'deploy-bot-toast' });

            // Clear the form and reset step
            setFormData(INITIAL_FORM_DATA);
            setCurrentStep(1);
            setErrors({});
            setSavedStrategyId(null);
            setSimulationResult(null);

            setTimeout(() => {
                router.push('/my-bots?filter=custom');
            }, 800);
        } catch (e) {
            console.error('Error deploying bot:', e);
            toast.error(e.message || 'Failed to deploy bot strategy', { id: 'deploy-bot-toast' });
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className={styles.builderContainer}>
            {/* Common Section Header */}
            <CommonSectionHeader
                badge={t('botBuilder.badge', 'TRADERMASTER QUANT SUITE')}
                icon={<CustomBotIcon width={26} height={26} />}
                title={t('nav.customBotBuilder', 'Custom Bot Builder')}
                subtitle={t('botBuilder.subtitle', 'Build custom algorithmic trading bots step-by-step with technical entry signals, exit targets, and risk parameters.')}
            />

            {/* Stepper Header Bar */}
            <StepperHeader
                currentStep={currentStep}
                onSelectStep={handleSelectStep}
            />

            {/* Step Body Content with Smooth Transition */}
            <div className={styles.stepBodyArea}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                    >
                        {currentStep === 1 && (
                            <StepBasics
                                data={formData}
                                errors={errors}
                                onChange={handleFormChange}
                            />
                        )}
                        {currentStep === 2 && (
                            <StepEntryRules
                                data={formData}
                                errors={errors}
                                onChange={handleFormChange}
                                indicators={indicators}
                            />
                        )}
                        {currentStep === 3 && (
                            <StepExitRules
                                data={formData}
                                errors={errors}
                                onChange={handleFormChange}
                            />
                        )}
                        {currentStep === 4 && (
                            <StepRisk
                                data={formData}
                                errors={errors}
                                onChange={handleFormChange}
                            />
                        )}
                        {currentStep === 5 && (
                            <StepReview
                                data={formData}
                                onEditStep={(step) => setCurrentStep(step)}
                                onRunBacktest={handleRunBacktest}
                                onDeployBot={handleDeployBot}
                                isDeploying={isDeploying}
                                isSimulating={isSimulating}
                                simulationResult={simulationResult}
                                onOpenBacktest={handleOpenBacktest}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Step Footer Navigation */}
            <StepFooterNav
                currentStep={currentStep}
                totalSteps={5}
                onPrev={handlePrev}
                onNext={handleNext}
                onDeploy={handleDeployBot}
                isDeploying={isDeploying}
                isNextDisabled={!isCurrentStepValid}
            />
        </div>
    );
}
