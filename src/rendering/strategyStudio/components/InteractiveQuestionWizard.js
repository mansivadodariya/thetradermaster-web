'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import { RightArrowSelectedIcon, SendPaperAirplaneIcon } from './StudioIcons';
import { getTradingOptionDescription } from '../utils/chatUiHelpers';

// ─── Static 7-question onboarding wizard (MT5 strategy builder) ───────────────
const STATIC_STRATEGY_QUESTIONS = [
    {
        question_id: 'asset_symbol',
        question_number: 1,
        total_questions: 7,
        question_title: 'Asset / Symbol',
        question: 'Which MT5 pair or metal do you trade?',
        description: 'Select from verified MT5 pairs or Gold (XAUUSD):',
        options: [
            { label: 'Gold (XAUUSD)', value: 'XAUUSD', description: 'Safe-haven metal — high volatility, tight MT5 spreads', mapping: { stock_name: ['XAUUSD'] } },
            { label: 'EURUSD', value: 'EURUSD', description: 'Most liquid Forex pair — ideal for scalping & intraday', mapping: { stock_name: ['EURUSD'] } },
            { label: 'GBPUSD', value: 'GBPUSD', description: 'Cable — strong trending pair with clean breakout swings', mapping: { stock_name: ['GBPUSD'] } },
            { label: 'GBPJPY', value: 'GBPJPY', description: 'High-volatility cross — great for momentum & breakouts', mapping: { stock_name: ['GBPJPY'] } },
            { label: 'EURJPY', value: 'EURJPY', description: 'Euro-Yen cross — smooth trend flow with institutional liquidity', mapping: { stock_name: ['EURJPY'] } },
            { label: 'USDCAD', value: 'USDCAD', description: 'Commodity-linked pair — oil-correlated price action', mapping: { stock_name: ['USDCAD'] } },
        ]
    },
    {
        question_id: 'timeframe',
        question_number: 2,
        total_questions: 7,
        question_title: 'Timeframe',
        question: 'What chart timeframe should the bot analyze?',
        description: 'Timeframe strictly divisible by 5m matching your execution style:',
        options: [
            { label: '5min (Scalping)', value: '5min', description: 'High-frequency entries — requires tight risk management', mapping: { interval: '5min' } },
            { label: '15min (Intraday)', value: '15min', description: 'Balanced signals — most popular for day traders', mapping: { interval: '15min' } },
            { label: '30min (Short Swing)', value: '30min', description: 'Less noise — high probability intraday setups', mapping: { interval: '30min' } },
            { label: '1hour (Trend Swing)', value: '1hour', description: 'Strong trend confirmation — fewer but higher quality setups', mapping: { interval: '1hour' } },
            { label: '4hour (Positional)', value: '4hour', description: 'Multi-day trend positions — institutional-grade clarity', mapping: { interval: '4hour' } },
        ]
    },
    {
        question_id: 'trade_direction',
        question_number: 3,
        total_questions: 7,
        question_title: 'Trade Direction',
        question: 'What is your trade direction / bias?',
        description: 'Select directional bias or allow algorithmic trading in both directions:',
        options: [
            { label: 'Buy / Long Only', value: 'Buy Only', description: 'Only enter bullish setups (entry_type: 0)', mapping: { entry_type: 0 } },
            { label: 'Sell / Short Only', value: 'Sell Only', description: 'Only enter bearish setups (entry_type: 1)', mapping: { entry_type: 1 } },
            { label: 'Both (Long & Short)', value: 'Both (Long & Short)', description: 'Capture bullish and bearish trend opportunities', mapping: { entry_type: null } },
        ]
    },
    {
        question_id: 'entry_strategy',
        question_number: 4,
        total_questions: 7,
        question_title: 'Entry Strategy',
        question: 'Which indicator signal triggers market entry?',
        description: 'Technical rule that calculates automated market entries:',
        options: [
            {
                label: 'EMA 9 / 21 Crossover',
                value: 'EMA 9/21 Crossover',
                description: 'Fast EMA crosses slow EMA — classic trend momentum entry',
                mapping: { entry_conditions: { rules: [{ indicator1: 'ema-9', operator: 'crossover', indicator2: 'ema-21' }] } }
            },
            {
                label: 'EMA 20 / 50 Trend Cross',
                value: 'EMA 20/50 Trend Cross',
                description: 'Medium-term crossover — filters out lower timeframe chop',
                mapping: { entry_conditions: { rules: [{ indicator1: 'ema-20', operator: 'crossover', indicator2: 'ema-50' }] } }
            },
            {
                label: 'RSI Oversold Bounce (< 30)',
                value: 'RSI Oversold Bounce',
                description: 'Enter long when RSI recovers from oversold extremes',
                mapping: { entry_conditions: { rules: [{ indicator1: 'rsi-14', operator: '<', value: 30 }] } }
            },
            {
                label: 'Supertrend Flip (10, 3)',
                value: 'Supertrend Flip',
                description: 'Supertrend direction reversal — reliable trend-following filter',
                mapping: { entry_conditions: { rules: [{ indicator1: 'supertrend-10-3', operator: 'flip', value: 'bullish' }] } }
            },
            {
                label: 'MACD Signal Cross (12, 26, 9)',
                value: 'MACD Signal Cross',
                description: 'MACD line crosses signal line — momentum confirmation',
                mapping: { entry_conditions: { rules: [{ indicator1: 'macd-12-26', operator: 'crossover', indicator2: 'macd-signal-9' }] } }
            },
        ]
    },
    {
        question_id: 'stop_loss',
        question_number: 5,
        total_questions: 7,
        question_title: 'Stop Loss',
        question: 'How do you want to protect downside risk?',
        description: 'Select stop loss methodology to cap drawdown on every position:',
        options: [
            { label: '25 Pips (250 Points)', value: '25 Pips (250 Points) SL', description: 'Standard protection — ideal for 15min and 30min charts', mapping: { exit_conditions: { stoploss: 250, stoploss_type: 'points' } } },
            { label: '50 Pips (500 Points)', value: '50 Pips (500 Points) SL', description: 'Wider risk buffer — gives trades room to breathe', mapping: { exit_conditions: { stoploss: 500, stoploss_type: 'points' } } },
            { label: '1.5x ATR Dynamic SL', value: '1.5x ATR Dynamic SL', description: 'Volatility-adaptive — adjusts SL dynamically per bar ATR', mapping: { exit_conditions: { stoploss: 1.5, stoploss_type: 'atr', atr_length: 14 } } },
            { label: '15 Pips Tight SL (150 Points)', value: '15 Pips Tight SL (150 Points)', description: 'Scalper-grade — minimum risk with tight invalidation', mapping: { exit_conditions: { stoploss: 150, stoploss_type: 'points' } } },
        ]
    },
    {
        question_id: 'take_profit',
        question_number: 6,
        total_questions: 7,
        question_title: 'Take Profit',
        question: 'Where do you want to exit with profit?',
        description: 'Select target profit goal or follow price with trailing stoploss:',
        options: [
            { label: '1:2 RR (50 Pips / 500 Points)', value: '1:2 RR (500 Points) TP', description: 'Risk-to-reward 1:2 — statistically sound positive expectancy', mapping: { exit_conditions: { target: 500, target_type: 'points', trailing_stoploss: false } } },
            { label: '1:3 RR (75 Pips / 750 Points)', value: '1:3 RR (750 Points) TP', description: 'Risk-to-reward 1:3 — high reward, fewer winning trades needed', mapping: { exit_conditions: { target: 750, target_type: 'points', trailing_stoploss: false } } },
            { label: '100 Pips Runner (1000 Points)', value: '100 Pips Runner (1000 Points) TP', description: 'Full trend expansion — captures multi-hundred point moves', mapping: { exit_conditions: { target: 1000, target_type: 'points', trailing_stoploss: false } } },
            { label: 'Trailing Stop (Follow Trend)', value: 'Trailing Stop', description: 'Lock in gains as price advances — never give back profit', mapping: { exit_conditions: { trailing_stoploss: true } } },
        ]
    },
    {
        question_id: 'lot_sizing',
        question_number: 7,
        total_questions: 7,
        question_title: 'Lot Sizing',
        question: 'What MT5 volume / lot size per trade?',
        description: 'Configure initial capital & position volume size for backtests & MT5 execution:',
        options: [
            { label: '0.01 Lots (Micro - Recommended)', value: '0.01 Lots', description: '$10k capital, 0.01 micro lots — optimal risk management', mapping: { quantity: 0.01, sizing_mode: 'lots', inital_capital: 10000.0 } },
            { label: '0.05 Lots (Balanced)', value: '0.05 Lots', description: '$10k capital, 0.05 lots — balanced volume for growing accounts', mapping: { quantity: 0.05, sizing_mode: 'lots', inital_capital: 10000.0 } },
            { label: '0.10 Lots (Mini Lot)', value: '0.10 Lots', description: '$10k capital, 0.10 mini lots — active day trading sizing', mapping: { quantity: 0.10, sizing_mode: 'lots', inital_capital: 10000.0 } },
            { label: '1.00 Standard Lot', value: '1.00 Standard Lot', description: '$10k capital, 1.00 standard lot — maximum execution volume', mapping: { quantity: 1.00, sizing_mode: 'lots', inital_capital: 10000.0 } },
        ]
    },
];

const KNOWN_WIZARD_STEPS = {
    instrument: {
        title: 'Which trading pair would you like to use for this strategy?',
        description: 'Select from our 6 verified institutional Forex pairs or Gold (XAUUSD):',
        stepNumber: 1,
        totalSteps: 5,
        hasCustom: false,
    },
    pair: {
        title: 'Which trading pair would you like to use for this strategy?',
        description: 'Select from our 6 verified institutional Forex pairs or Gold (XAUUSD):',
        stepNumber: 1,
        totalSteps: 5,
        hasCustom: false,
    },
    timeframe: {
        title: 'Which chart timeframe would you like to trade on?',
        description: 'Chart candle interval for crossover calculation and backtesting.',
        stepNumber: 2,
        totalSteps: 5,
        hasCustom: false,
    },
    condition: {
        title: 'Which crossover condition would you like to execute?',
        description: 'Select the signal trigger condition for trade entry.',
        stepNumber: 3,
        totalSteps: 5,
        hasCustom: true,
    },
    direction: {
        title: 'Which crossover condition would you like to execute?',
        description: 'Select the signal trigger condition for trade entry.',
        stepNumber: 3,
        totalSteps: 5,
        hasCustom: true,
    },
    fast_period: {
        title: 'What period do you want for your Fast EMA?',
        description: 'Fast EMA period (e.g. 5 for scalping or 9 for standard momentum).',
        stepNumber: 4,
        totalSteps: 5,
        hasCustom: true,
    },
    slow_period: {
        title: 'What period do you want for your Slow EMA?',
        description: 'Slow EMA period (e.g. 20/21 for momentum or 200 for institutional trend).',
        stepNumber: 5,
        totalSteps: 5,
        hasCustom: true,
    },
};

function extractQuestionTitle(aiMsg) {
    if (!aiMsg) return 'Select an option:';
    if (aiMsg.question) return aiMsg.question;
    if (aiMsg.question_title) return aiMsg.question_title;

    const stepKey = (aiMsg.step || aiMsg.asking_for || '').toLowerCase().trim();
    if (KNOWN_WIZARD_STEPS[stepKey]?.title) {
        return KNOWN_WIZARD_STEPS[stepKey].title;
    }

    const text = (aiMsg.text || aiMsg.reply || '').trim();
    if (text) {
        const qMatches = text.match(/([^.?!:\n]+\?)/g);
        if (qMatches && qMatches.length > 0) {
            return qMatches[qMatches.length - 1].trim();
        }
        const sentences = text.split(/(?<=[.!\n])\s+/);
        const cta = sentences.find((s) => /please select|select|choose|pick|configure/i.test(s));
        if (cta) return cta.trim();
        if (sentences.length > 0) return sentences[sentences.length - 1].trim();
    }

    if (aiMsg.asking_for) return `Please select ${aiMsg.asking_for}:`;
    if (aiMsg.step_name) return `Configure ${aiMsg.step_name}:`;
    return 'Select an option:';
}

function extractQuestionDescription(aiMsg) {
    if (aiMsg?.question_description) return aiMsg.question_description;
    if (aiMsg?.description) return aiMsg.description;
    const stepKey = (aiMsg?.step || aiMsg?.asking_for || '').toLowerCase().trim();
    if (KNOWN_WIZARD_STEPS[stepKey]?.description) {
        return KNOWN_WIZARD_STEPS[stepKey].description;
    }
    return '';
}

function formatWizardOption(opt, stepKey) {
    let val = typeof opt === 'string' ? opt : (opt.value || opt.label || opt.title || '');
    let lbl = typeof opt === 'string' ? opt : (opt.label || opt.title || opt.value || '');
    if (stepKey === 'timeframe' && (lbl.toLowerCase() === '1hour' || lbl.toLowerCase() === '1h')) {
        lbl = '60min';
    }
    return {
        label: lbl,
        description: (typeof opt === 'object' && opt.description) ? opt.description : getTradingOptionDescription(val, lbl),
        value: val,
        is_custom: Boolean(typeof opt === 'object' && opt.is_custom)
    };
}

export default function InteractiveQuestionWizard({
    latestAiMessage,
    messages = [],
    onComplete,
    onDismiss,
    loading
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
    const [inlineAnswer, setInlineAnswer] = useState('');
    const [collectedAnswers, setCollectedAnswers] = useState([]);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const isSubmittingRef = useRef(false);

    // Collect all questions that the user has already answered in the chat session
    const previouslyAnsweredSet = useMemo(() => {
        const set = new Set();
        (messages || []).forEach((msg) => {
            if (msg.role === 'user') {
                if (msg.qaList && Array.isArray(msg.qaList)) {
                    msg.qaList.forEach((qa) => {
                        if (qa.question_id) set.add(qa.question_id.toLowerCase().trim());
                        if (qa.question) set.add(qa.question.toLowerCase().trim());
                    });
                }
                if (typeof msg.text === 'string' && msg.text.includes('?')) {
                    const lines = msg.text.split('\n');
                    lines.forEach((line) => {
                        if (line.includes('?')) {
                            set.add(line.toLowerCase().trim());
                        }
                    });
                }
            }
        });
        if (latestAiMessage?.answered_questions && Array.isArray(latestAiMessage.answered_questions)) {
            latestAiMessage.answered_questions.forEach((q) => {
                if (typeof q === 'string') set.add(q.toLowerCase().trim());
                else if (q?.question_id) set.add(q.question_id.toLowerCase().trim());
                else if (q?.question) set.add(q.question.toLowerCase().trim());
            });
        }
        return set;
    }, [messages, latestAiMessage]);

    // Parse questions list from AI message — never show questions if strategy is complete or fulfilled
    const questionsList = useMemo(() => {
        const strat = latestAiMessage?.strategy || {};
        const isReadyToProceed = Boolean(
            !latestAiMessage ||
            latestAiMessage?.complete === true ||
            String(latestAiMessage?.complete) === 'true' ||
            latestAiMessage?.json_fulfilled === true ||
            String(latestAiMessage?.json_fulfilled) === 'true' ||
            latestAiMessage?.is_complete === true ||
            latestAiMessage?.ready_for_backtest === true ||
            latestAiMessage?.ready_to_proceed === true ||
            latestAiMessage?.asking_for === 'none' ||
            latestAiMessage?.step === 'none' ||
            (
                Boolean(strat?.stock_name?.[0]) &&
                Boolean(strat?.interval) &&
                Boolean(strat?.from_date && strat?.to_date) &&
                (strat?.entry_conditions?.rules?.length || 0) > 0 &&
                (strat?.exit_conditions?.target != null || strat?.exit_conditions?.stoploss != null || (strat?.exit_conditions?.rules?.length || 0) > 0)
            )
        );
        if (isReadyToProceed) return [];
        if (latestAiMessage?.isError) return [];

        const stepKey = (latestAiMessage?.step || latestAiMessage?.asking_for || '').toLowerCase().trim();
        // Do not ask duplicate questions for parameters already locked in the strategy
        if ((stepKey === 'timeframe' || stepKey === 'interval') && strat?.interval) {
            return [];
        }
        if ((stepKey === 'pair' || stepKey === 'instrument' || stepKey === 'symbol') && Array.isArray(strat?.stock_name) && strat.stock_name.length > 0) {
            return [];
        }
        if ((stepKey === 'period' || stepKey === 'duration') && strat?.from_date && strat?.to_date) {
            return [];
        }

        let raw = [];

        // 1. AI-provided questions take priority
        if (latestAiMessage?.questions && Array.isArray(latestAiMessage.questions) && latestAiMessage.questions.length > 0) {
            raw = latestAiMessage.questions.map((q) => ({
                ...q,
                options: (q.options || []).map((opt) => {
                    const val = typeof opt === 'string' ? opt : (opt.value || opt.label || '');
                    const lbl = typeof opt === 'string' ? opt : (opt.label || opt.title || opt.value || '');
                    return {
                        label: lbl,
                        value: val,
                        description: (typeof opt === 'object' && opt.description) ? opt.description : getTradingOptionDescription(val, lbl),
                        is_custom: Boolean(typeof opt === 'object' && opt.is_custom)
                    };
                })
            }));
        } else if (latestAiMessage?.current_question) {
            const cq = latestAiMessage.current_question;
            raw = [{
                ...cq,
                options: (cq.options || []).map((opt) => {
                    const val = typeof opt === 'string' ? opt : (opt.value || opt.label || '');
                    const lbl = typeof opt === 'string' ? opt : (opt.label || opt.title || opt.value || '');
                    return {
                        label: lbl,
                        value: val,
                        description: (typeof opt === 'object' && opt.description) ? opt.description : getTradingOptionDescription(val, lbl),
                        is_custom: Boolean(typeof opt === 'object' && opt.is_custom)
                    };
                })
            }];
        } else if (latestAiMessage?.options && Array.isArray(latestAiMessage.options) && latestAiMessage.options.length > 0) {
            const knownStep = KNOWN_WIZARD_STEPS[stepKey];
            const title = extractQuestionTitle(latestAiMessage);
            const desc = extractQuestionDescription(latestAiMessage);
            raw = [{
                question_id: latestAiMessage.question_id || (stepKey ? stepKey : `q_${latestAiMessage.step || 1}`),
                question_number: knownStep?.stepNumber || 1,
                total_questions: knownStep?.totalSteps || 1,
                has_custom: knownStep?.hasCustom ?? false,
                question: title,
                question_title: title,
                description: desc,
                options: latestAiMessage.options.map((opt) => formatWizardOption(opt, stepKey))
            }];
        } else if ((latestAiMessage?.cta_buttons || latestAiMessage?.ctaButtons)) {
            const ctas = latestAiMessage.cta_buttons || latestAiMessage.ctaButtons;
            if (Array.isArray(ctas) && ctas.length > 0) {
                const stepKey = (latestAiMessage.step || latestAiMessage.asking_for || '').toLowerCase().trim();
                const knownStep = KNOWN_WIZARD_STEPS[stepKey];
                const qTitle = extractQuestionTitle(latestAiMessage);
                const qDesc = extractQuestionDescription(latestAiMessage);
                raw = [{
                    question_id: latestAiMessage.question_id || (stepKey ? stepKey : `q_${latestAiMessage.step || 1}`),
                    question_number: knownStep?.stepNumber || 1,
                    total_questions: knownStep?.totalSteps || 1,
                    has_custom: knownStep?.hasCustom ?? false,
                    question: qTitle,
                    question_title: qTitle,
                    description: qDesc,
                    options: ctas.map((c) => formatWizardOption(c, stepKey))
                }];
            }
        } else if (latestAiMessage?.suggestions && Array.isArray(latestAiMessage.suggestions) && latestAiMessage.suggestions.length > 0) {
            raw = [{
                question_id: 'quick_actions',
                question_number: 1,
                total_questions: 1,
                question: 'Select a recommended strategy direction:',
                question_title: 'Select a recommended strategy direction:',
                description: 'Choose one of our optimized algorithmic parameters:',
                options: latestAiMessage.suggestions.map((sug) => {
                    const clean = sug.replace(/^[\p{Emoji}\s]+/u, '').trim();
                    return {
                        label: clean,
                        description: clean.toLowerCase().includes('backtest')
                            ? 'Simulate strategy performance across historical candles.'
                            : 'Calibrate parameters for higher statistical edge.',
                        value: clean
                    };
                })
            }];
        }

        // 2. When AI provides no options or questions, strictly return empty list (no popup)
        if (raw.length === 0) {
            return [];
        }

        // When AI explicitly provides options or questions for the active turn, always present them
        return raw;
    }, [latestAiMessage, previouslyAnsweredSet]);

    // Reset when a brand new AI message arrives with questions
    useEffect(() => {
        const initialIdx = typeof latestAiMessage?.current_question_index === 'number'
            ? Math.max(0, Math.min(latestAiMessage.current_question_index, Math.max(0, questionsList.length - 1)))
            : 0;
        setCurrentIndex(initialIdx);
        setSelectedOptionIndex(0);
        setInlineAnswer('');
        setCollectedAnswers([]);
        isSubmittingRef.current = false;
    }, [latestAiMessage, questionsList.length]);

    const parsePositiveNum = (val) => {
        if (typeof val === 'number' && !isNaN(val) && val > 0) return val;
        if (typeof val === 'string') {
            const parsed = parseInt(val, 10);
            if (!isNaN(parsed) && parsed > 0) return parsed;
            const match = val.match(/\b(\d+)\b/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (!isNaN(num) && num > 0) return num;
            }
        }
        return null;
    };

    const textStepMatch = typeof latestAiMessage?.text === 'string'
        ? latestAiMessage.text.match(/Step\s*(\d+)(?:\s*(?:of|\/)\s*(\d+))?/i)
        : null;

    const safeCurrentIndex = Math.min(Math.max(0, currentIndex), Math.max(0, questionsList.length - 1));
    const activeQuestion = questionsList[safeCurrentIndex] || questionsList[0] || null;

    const stepKey = (latestAiMessage?.step || latestAiMessage?.asking_for || activeQuestion?.question_id || '').toLowerCase().trim();
    const knownStep = KNOWN_WIZARD_STEPS[stepKey];

    const totalQuestions = Math.max(
        1,
        parsePositiveNum(latestAiMessage?.total_questions)
            || parsePositiveNum(latestAiMessage?.total_steps)
            || (textStepMatch && textStepMatch[2] ? parseInt(textStepMatch[2], 10) : null)
            || parsePositiveNum(activeQuestion?.total_questions)
            || (knownStep ? knownStep.totalSteps : null)
            || (questionsList.length > 1 ? questionsList.length : null)
            || 5
    );

    const rawStep = activeQuestion?.question_number
        ?? latestAiMessage?.step_number
        ?? latestAiMessage?.question_number
        ?? (parsePositiveNum(latestAiMessage?.step) ? latestAiMessage.step : null)
        ?? (textStepMatch ? parseInt(textStepMatch[1], 10) : null)
        ?? (knownStep ? knownStep.stepNumber : null)
        ?? (safeCurrentIndex + 1);

    const parsedStep = parsePositiveNum(rawStep) || (safeCurrentIndex + 1);
    const displayStepNumber = Math.min(Math.max(1, parsedStep), totalQuestions);

    const activeOptions = useMemo(() => {
        if (!activeQuestion || !activeQuestion.options || !Array.isArray(activeQuestion.options)) {
            return [];
        }
        let list = activeQuestion.options.map((opt) =>
            typeof opt === 'string'
                ? { label: opt, description: '', value: opt }
                : {
                    label: opt.label || opt.title || opt.value || '',
                    description: opt.description || opt.desc || '',
                    value: opt.value || opt.label || opt.title || '',
                    is_custom: Boolean(opt.is_custom)
                }
        );

        const isTimeframeQuestion = Boolean(
            (activeQuestion.question_id || '').toLowerCase().includes('timeframe') ||
            (activeQuestion.question_id || '').toLowerCase().includes('interval') ||
            (activeQuestion.question || '').toLowerCase().includes('timeframe') ||
            (activeQuestion.question_title || '').toLowerCase().includes('timeframe') ||
            (latestAiMessage?.step || '').toLowerCase() === 'timeframe' ||
            (latestAiMessage?.asking_for || '').toLowerCase() === 'timeframe'
        );

        if (isTimeframeQuestion) {
            // Strictly exclude any Custom option for timeframe as requested
            return list.filter((opt) => {
                const lbl = (opt.label || '').toLowerCase().trim();
                const val = (opt.value || '').toLowerCase().trim();
                return lbl !== 'custom' && val !== 'custom' && !opt.is_custom;
            });
        }

        const hasCustomOption = list.some(
            (opt) =>
                opt.is_custom ||
                opt.label?.toLowerCase().trim() === 'custom' ||
                opt.value?.toLowerCase().trim() === 'custom'
        );
        if (activeQuestion.has_custom && !hasCustomOption) {
            list.push({
                label: 'Custom',
                description: 'Describe your own',
                value: 'custom',
                is_custom: true
            });
        }

        return list;
    }, [activeQuestion, latestAiMessage]);

    const selectedOption = activeOptions[selectedOptionIndex] || null;
    const isCustomSelected = Boolean(
        selectedOption &&
        (selectedOption.is_custom ||
            selectedOption.value === 'custom' ||
            selectedOption.label?.toLowerCase().trim() === 'custom' ||
            selectedOption.label?.toLowerCase().startsWith('custom'))
    );

    // Auto-focus container or custom input
    useEffect(() => {
        if (isCustomSelected) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 60);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                containerRef.current?.focus();
            }, 60);
            return () => clearTimeout(timer);
        }
    }, [isCustomSelected, currentIndex, selectedOptionIndex]);

    const strat = latestAiMessage?.strategy || {};
    const isStrategyCompletedOrFulfilled = Boolean(
        !latestAiMessage ||
        latestAiMessage?.complete === true ||
        String(latestAiMessage?.complete) === 'true' ||
        latestAiMessage?.json_fulfilled === true ||
        String(latestAiMessage?.json_fulfilled) === 'true' ||
        latestAiMessage?.is_complete === true ||
        latestAiMessage?.ready_for_backtest === true ||
        latestAiMessage?.ready_to_proceed === true ||
        latestAiMessage?.asking_for === 'none' ||
        latestAiMessage?.step === 'none' ||
        (
            Boolean(strat?.stock_name?.[0]) &&
            Boolean(strat?.interval) &&
            Boolean(strat?.from_date && strat?.to_date) &&
            (strat?.entry_conditions?.rules?.length || 0) > 0 &&
            (strat?.exit_conditions?.target != null || strat?.exit_conditions?.stoploss != null || (strat?.exit_conditions?.rules?.length || 0) > 0)
        )
    );

    const activeStepKey = (activeQuestion?.step || activeQuestion?.asking_for || latestAiMessage?.step || latestAiMessage?.asking_for || '').toLowerCase().trim();
    const isRedundantQuestion = Boolean(
        ((activeStepKey === 'pair' || activeStepKey === 'instrument') && strat?.stock_name?.[0]) ||
        ((activeStepKey === 'timeframe' || activeStepKey === 'interval') && strat?.interval) ||
        ((activeStepKey === 'period' || activeStepKey === 'duration') && strat?.from_date && strat?.to_date)
    );

    if (isStrategyCompletedOrFulfilled || isRedundantQuestion || !activeQuestion || activeOptions.length === 0 || loading || latestAiMessage?.isError) {
        return null;
    }

    const handleAnswerSubmit = (value, label = '') => {
        const answerText = value || label;
        if (!answerText) return;

        const newAnswerItem = {
            question_id: activeQuestion.question_id || `q_${currentIndex}`,
            question: activeQuestion.question || activeQuestion.question_title || 'Question',
            answer: answerText,
            label: label || answerText
        };

        const updatedAnswers = [...collectedAnswers, newAnswerItem];
        setCollectedAnswers(updatedAnswers);

        // Check if there are more questions in the flow
        if (currentIndex + 1 < questionsList.length) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOptionIndex(0);
            setInlineAnswer('');
            isSubmittingRef.current = false;
        } else {
            // All questions answered — compile clean summary containing only user selections/inputs
            const formattedSummary = updatedAnswers
                .map((item) => item.label || item.answer)
                .join(', ');

            onComplete(formattedSummary, updatedAnswers);
            setCurrentIndex(0);
            setCollectedAnswers([]);
            // Keep locked until new AI response arrives
            isSubmittingRef.current = true;
        }
    };

    const handleOptionClick = (choice, cIdx) => {
        if (isSubmittingRef.current || loading) return;
        setSelectedOptionIndex(cIdx);
        const isCustom = Boolean(
            choice.is_custom ||
            choice.value === 'custom' ||
            choice.label?.toLowerCase().trim() === 'custom' ||
            choice.label?.toLowerCase().startsWith('custom')
        );

        if (isCustom) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 60);
        } else {
            isSubmittingRef.current = true;
            // Visually show option selected with arrow before submitting
            setTimeout(() => {
                handleAnswerSubmit(choice.value, choice.label);
            }, 180);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeOptions.length > 0) {
                setSelectedOptionIndex((prev) => (prev + 1) % activeOptions.length);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeOptions.length > 0) {
                setSelectedOptionIndex((prev) => (prev - 1 + activeOptions.length) % activeOptions.length);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (isSubmittingRef.current || loading) return;
            if (inlineAnswer.trim()) {
                isSubmittingRef.current = true;
                handleAnswerSubmit(inlineAnswer.trim(), inlineAnswer.trim());
            } else if (selectedOption) {
                if (isCustomSelected) {
                    inputRef.current?.focus();
                } else {
                    isSubmittingRef.current = true;
                    handleAnswerSubmit(selectedOption.value, selectedOption.label);
                }
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            if (onDismiss) onDismiss();
        }
    };

    if (isStrategyCompletedOrFulfilled || !activeQuestion || questionsList.length === 0 || activeOptions.length === 0) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={styles.interactiveOptionBox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            style={{ outline: 'none' }}
            role="region"
            aria-label="Strategy Questions Wizard"
        >
            {/* Header: Keyboard Navigation Shortcuts (Left) + Step Counter Badge (Right) */}
            <div className={styles.optionBoxHeaderRow}>
                <div className={styles.optionBoxHintsRow}>
                    <span className={styles.hint}>
                        <kbd>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="18 15 12 9 6 15" />
                            </svg>
                        </kbd>
                        <kbd>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </kbd>
                        <span>to navigate</span>
                    </span>
                    <span className={styles.hint}>
                        <kbd>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 10 4 15 9 20" />
                                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                            </svg>
                        </kbd>
                        <span>to select</span>
                    </span>
                    <span className={styles.hint}>
                        <kbd>esc</kbd>
                        <span>to close</span>
                    </span>
                </div>
                <div className={styles.stepCounterBadge}>
                    <span>{displayStepNumber}/{totalQuestions}</span>
                </div>
            </div>

            {/* User-facing Question */}
            <div className={styles.optionBoxQuestion}>
                {activeQuestion.question || activeQuestion.question_title}
            </div>

            {/* Optional Question Context / Description */}
            {activeQuestion.description && (
                <div className={styles.optionBoxDescription}>
                    {activeQuestion.description}
                </div>
            )}

            {/* Selectable Option Choices List */}
            <div className={styles.optionChoicesList}>
                {activeOptions.map((choice, cIdx) => {
                    const isSelected = selectedOptionIndex === cIdx;
                    return (
                        <button
                            key={cIdx}
                            type="button"
                            disabled={loading}
                            className={`${styles.optionChoiceItem} ${isSelected ? styles.selectedOption : ''}`}
                            onClick={() => handleOptionClick(choice, cIdx)}
                        >
                            <span className={`${styles.selectedArrowPrefix} ${isSelected ? styles.visibleArrow : styles.placeholderArrow}`}>
                                <RightArrowSelectedIcon size={14} color="#18C98B" />
                            </span>
                            <div className={styles.choiceTextContainer}>
                                <span className={styles.choiceTitle}>{choice.label}</span>
                                {choice.description && (
                                    <span className={styles.choiceDesc}>{choice.description}</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Bottom Row: Type Custom Answer + Send Airplane Icon — ONLY DISPLAYED WHEN CUSTOM IS SELECTED */}
            {isCustomSelected && (
                <div className={styles.optionInlineInputWrap}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your answer..."
                        value={inlineAnswer}
                        onChange={(e) => setInlineAnswer(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && inlineAnswer.trim()) {
                                e.preventDefault();
                                handleAnswerSubmit(inlineAnswer.trim(), inlineAnswer.trim());
                            }
                        }}
                    />
                    <button
                        type="button"
                        className={styles.inlineSendBtn}
                        onClick={() => {
                            if (inlineAnswer.trim()) {
                                handleAnswerSubmit(inlineAnswer.trim(), inlineAnswer.trim());
                            }
                        }}
                        disabled={!inlineAnswer.trim()}
                        title="Submit Answer"
                    >
                        <SendPaperAirplaneIcon size={14} color="#18C98B" />
                    </button>
                </div>
            )}
        </div>
    );
}
