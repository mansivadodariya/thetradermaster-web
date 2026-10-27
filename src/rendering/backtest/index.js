'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './backtest.module.scss';
import studioStyles from '../strategyStudio/styles/strategyStudio.module.scss';
import BackgroundCyberWaves from '../strategyStudio/components/BackgroundCyberWaves';
import StudioToolbar from '../strategyStudio/components/StudioToolbar';
import BacktestResultsView from '../strategyStudio/components/BacktestResultsView';
import SimulationProgressLoader from '../strategyStudio/components/SimulationProgressLoader';
import {
    AiBotSparkIcon,
    SlidersTuneIcon,
    ShieldCheckIcon,
    RocketRunIcon
} from '../strategyStudio/components/StudioIcons';
import { toast } from '@/components/toast';
import { strategyStudioApi } from '../strategyStudio/utils/strategyApi';
import { parseRoundTrips } from '../strategyStudio/utils/backtestEngine';
import {
    saveBacktestResponse,
    loadBacktestResponse,
    LATEST_BACKTEST_KEY
} from './utils/backtestPersistence';

const normalizeInterval = (tf) => {
    if (!tf) return '15min';
    const s = String(tf).toLowerCase().trim();
    if (s === '5m' || s === '5min' || s === 'm5') return '5min';
    if (s === '15m' || s === '15min' || s === 'm15') return '15min';
    if (s === '30m' || s === '30min' || s === 'm30') return '30min';
    if (s === '1h' || s === '60m' || s === '60min' || s === 'h1') return '60min';
    if (s === '1d' || s === '1day' || s === 'd1' || s === 'daily') return '1day';
    return s.includes('min') ? s : `${s}min`;
};

const normalizeSymbol = (sym) => {
    if (!sym) return 'XAUUSD';
    if (Array.isArray(sym)) return sym[0] || 'XAUUSD';
    return String(sym).toUpperCase().replace('/', '').trim();
};

export default function BacktestPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Strategy Parameters (Toolbar & Execution)
    const [symbol, setSymbol] = useState('XAUUSD');
    const [interval, setInterval] = useState('15min');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [capital, setCapital] = useState(10000);
    const [quantity, setQuantity] = useState(0.01);

    // Active Strategy Meta & Header Title
    const [strategyName, setStrategyName] = useState('');
    const [strategyOrigin, setStrategyOrigin] = useState('');
    const [activeStrategyInfo, setActiveStrategyInfo] = useState(null);

    // Backtest Simulation Results
    const [simulationLoading, setSimulationLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [roundTrips, setRoundTrips] = useState([]);
    const [executedParams, setExecutedParams] = useState(null);

    const hasInitiatedRun = useRef(false);

    // Initialize default date ranges
    useEffect(() => {
        const today = new Date();
        const yest = new Date(today);
        yest.setDate(yest.getDate() - 1);
        const sixtyDaysAgo = new Date(today);
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 61);

        setFromDate(sixtyDaysAgo.toISOString().split('T')[0]);
        setToDate(yest.toISOString().split('T')[0]);
    }, []);

    const handleToast = useCallback((msg) => {
        toast.success(msg, {
            style: {
                background: '#0D1424',
                color: '#18C98B',
                border: '1px solid rgba(24, 201, 139, 0.3)'
            }
        });
    }, []);

    const handleErrorToast = useCallback((msg) => {
        toast.error(msg, {
            style: {
                background: '#0D1424',
                color: '#F43F5E',
                border: '1px solid rgba(244, 63, 94, 0.3)'
            }
        });
    }, []);

    /**
     * Rehydrate state from cached backtest payload
     */
    const applyCachedData = useCallback((cached) => {
        if (!cached || !cached.results) return;
        setResults(cached.results);
        setRoundTrips(Array.isArray(cached.roundTrips) ? cached.roundTrips : []);
        setExecutedParams(cached.executedParams || {
            symbol: cached.symbol || symbol,
            interval: cached.interval || interval,
            capital: cached.capital || capital,
            quantity: cached.quantity || quantity,
            fromDate: cached.fromDate || fromDate,
            toDate: cached.toDate || toDate
        });
        if (cached.strategyName) setStrategyName(cached.strategyName);
        if (cached.source || cached.strategyOrigin) {
            const src = cached.source || cached.strategyOrigin;
            if (src === 'user_strategies' || src === 'my-bots' || src === 'my_bots') {
                setStrategyOrigin('my-bots');
            } else if (src === 'trading_strategies' || src === 'predefined_strategies' || src === 'predefined') {
                setStrategyOrigin('predefined');
            } else {
                setStrategyOrigin(src);
            }
        }
        if (cached.activeStrategyInfo) setActiveStrategyInfo(cached.activeStrategyInfo);
        if (cached.symbol) setSymbol(cached.symbol);
        if (cached.interval) setInterval(cached.interval);
        if (cached.capital) setCapital(cached.capital);
        if (cached.quantity) setQuantity(cached.quantity);
        if (cached.fromDate) setFromDate(cached.fromDate);
        if (cached.toDate) setToDate(cached.toDate);
        setSimulationLoading(false);
    }, [symbol, interval, capital, quantity, fromDate, toDate]);

    /**
     * Execute Run Backtest by Strategy ID (POST /backtest/v1/interactive-run)
     */
    const executeRunById = useCallback(async (stratMeta) => {
        if (!stratMeta?.strategy_id) return;
        setSimulationLoading(true);

        const cap = parseFloat(stratMeta.capital || capital) || 10000;
        const qty = parseFloat(stratMeta.quantity || quantity) || 0.01;
        const sym = stratMeta.symbol || symbol;
        const intv = stratMeta.interval || interval;
        const fromD = stratMeta.fromDate || fromDate;
        const toD = stratMeta.toDate || toDate;

        try {
            const res = await strategyStudioApi.runBacktestById({
                strategy_id: stratMeta.strategy_id,
                symbol: sym,
                stock_name: [sym],
                interval: intv,
                from_date: fromD,
                to_date: toD,
                inital_capital: cap,
                capital: cap,
                quantity: qty,
            });

            if (res && res.success && res.data) {
                const stockRes = Array.isArray(res.data) ? res.data[0] : res.data;
                const trips = parseRoundTrips(stockRes, cap, qty);

                setResults(stockRes);
                setRoundTrips(trips);
                const execParams = {
                    symbol: sym,
                    interval: intv,
                    capital: cap,
                    quantity: qty,
                    fromDate: fromD,
                    toDate: toD
                };
                setExecutedParams(execParams);

                // Sync header toolbar values if returned in strategy response
                if (res.strategy) {
                    const s = res.strategy;
                    if (s.name || s.strategy_name || s.title) {
                        setStrategyName(s.name || s.strategy_name || s.title);
                    }
                }

                // Cache successful response to storage so refresh and tab switch reuse previous data
                saveBacktestResponse({
                    strategy_id: stratMeta.strategy_id,
                    source: stratMeta.source || strategyOrigin,
                    strategyName: stratMeta.name || strategyName || res.strategy?.name || res.strategy?.strategy_name || '',
                    activeStrategyInfo: stratMeta,
                    results: stockRes,
                    roundTrips: trips,
                    executedParams: execParams,
                    strategy: res.strategy || null,
                    symbol: sym,
                    interval: intv,
                    capital: cap,
                    quantity: qty,
                    fromDate: fromD,
                    toDate: toD
                });

                handleToast('Backtest simulation complete!');
            } else {
                setResults(null);
                setRoundTrips([]);
                handleErrorToast(res?.error || 'No backtest output returned from engine.');
            }
        } catch (err) {
            console.error('Error in executeRunById:', err);
            setResults(null);
            setRoundTrips([]);
            handleErrorToast('Simulation execution error.');
        } finally {
            setSimulationLoading(false);
        }
    }, [symbol, interval, capital, quantity, fromDate, toDate, strategyName, strategyOrigin, handleToast, handleErrorToast]);

    /**
     * Check incoming strategy payload from sessionStorage or query params on load
     */
    useEffect(() => {
        if (hasInitiatedRun.current) return;

        let stratId = searchParams?.get('strategy_id') || searchParams?.get('id');
        let stratSource = searchParams?.get('source') || searchParams?.get('from');
        let pendingData = null;

        try {
            if (typeof window !== 'undefined') {
                const raw = sessionStorage.getItem('pending_backtest_run');
                if (raw) {
                    pendingData = JSON.parse(raw);
                }
            }
        } catch (_) {}

        if (pendingData) {
            stratId = stratId || pendingData.strategy_id || pendingData.id;
            stratSource = stratSource || pendingData.source;
        }

        const rawName = pendingData?.name || pendingData?.strategy_name || pendingData?.raw_strategy?.name || pendingData?.raw_strategy?.strategy_name || searchParams?.get('name') || searchParams?.get('strategy_name') || '';
        if (rawName) setStrategyName(rawName);

        if (stratSource === 'user_strategies' || stratSource === 'my-bots' || stratSource === 'my_bots') {
            setStrategyOrigin('my-bots');
        } else if (stratSource === 'trading_strategies' || stratSource === 'predefined_strategies' || stratSource === 'predefined') {
            setStrategyOrigin('predefined');
        } else if (stratSource) {
            setStrategyOrigin(stratSource);
        }

        if (stratId) {
            hasInitiatedRun.current = true;
            const sym = normalizeSymbol(pendingData?.symbol || searchParams?.get('symbol') || symbol);
            const tf = normalizeInterval(pendingData?.interval || pendingData?.timeframe || searchParams?.get('interval') || interval);
            const cap = Number(pendingData?.capital || searchParams?.get('capital')) || capital;
            const qty = parseFloat(pendingData?.quantity || pendingData?.lots || searchParams?.get('quantity')) || quantity;
            const fromD = pendingData?.from_date || pendingData?.fromDate || searchParams?.get('from_date') || fromDate;
            const toD = pendingData?.to_date || pendingData?.toDate || searchParams?.get('to_date') || toDate;

            setSymbol(sym);
            setInterval(tf);
            setCapital(cap);
            setQuantity(qty);
            if (fromD) setFromDate(fromD);
            if (toD) setToDate(toD);

            const stratMeta = {
                strategy_id: stratId,
                source: stratSource === 'user_strategies' ? 'user_strategies' : 'trading_strategies',
                symbol: sym,
                interval: tf,
                capital: cap,
                quantity: qty,
                fromDate: fromD,
                toDate: toD,
                name: rawName,
                rawStrategy: pendingData?.raw_strategy || null
            };
            setActiveStrategyInfo(stratMeta);

            // Check if we already have cached data from a previous run for this strategy
            const cachedResult = loadBacktestResponse(stratId);

            if (cachedResult && cachedResult.results) {
                // If previous response exists, load it immediately without re-running backtest API
                applyCachedData(cachedResult);
            } else {
                // First time run: execute POST /backtest/v1/interactive-run
                executeRunById(stratMeta);
            }
        } else {
            // No strategy ID in URL/pending data: restore latest backtest session if available
            const cachedLatest = loadBacktestResponse();
            if (cachedLatest && cachedLatest.results) {
                applyCachedData(cachedLatest);
            }
        }
    }, [searchParams, executeRunById, applyCachedData, symbol, interval, capital, quantity, fromDate, toDate]);

    // Preserve and sync backtest response on browser tab change and cross-tab storage events
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const stratId = searchParams?.get('strategy_id') || searchParams?.get('id') || activeStrategyInfo?.strategy_id;
                const cached = loadBacktestResponse(stratId);
                if (cached && cached.results && !results) {
                    applyCachedData(cached);
                }
            }
        };

        const handleStorageChange = (e) => {
            if (e.key === LATEST_BACKTEST_KEY && e.newValue) {
                try {
                    const updated = JSON.parse(e.newValue);
                    if (updated && updated.results) {
                        const stratId = searchParams?.get('strategy_id') || searchParams?.get('id') || activeStrategyInfo?.strategy_id;
                        if (!stratId || updated.strategy_id === stratId) {
                            applyCachedData(updated);
                        }
                    }
                } catch (_) {}
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('storage', handleStorageChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [searchParams, activeStrategyInfo, results, applyCachedData]);

    const handleBackNavigation = () => {
        if (strategyOrigin === 'my-bots' || searchParams?.get('source') === 'user_strategies') {
            router.push('/my-bots');
        } else if (strategyOrigin === 'predefined' || searchParams?.get('source') === 'trading_strategies') {
            router.push('/predefined-strategies');
        } else {
            if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
            } else {
                router.push('/predefined-strategies');
            }
        }
    };

    const backButtonLabel = useMemo(() => {
        if (strategyOrigin === 'my-bots' || searchParams?.get('source') === 'user_strategies') {
            return 'Back';
        }
        if (strategyOrigin === 'predefined' || searchParams?.get('source') === 'trading_strategies') {
            return 'Back';
        }
        return 'Back';
    }, [strategyOrigin, searchParams]);

    /**
     * Execute Backtest Simulation manually from Toolbar
     */
    const handleRunBacktest = async () => {
        if (activeStrategyInfo?.strategy_id) {
            await executeRunById({
                ...activeStrategyInfo,
                symbol,
                interval,
                capital,
                quantity,
                fromDate,
                toDate
            });
            return;
        }

        setSimulationLoading(true);

        try {
            const entryConditions = {
                entry_start_time: '00:00',
                entry_end_time: '23:45',
                condition_type: 'all',
                rules: [
                    {
                        indicator1: { name: 'ema', parameters: { length: 20 } },
                        operator: 'crossover',
                        indicator2: { name: 'ema', parameters: { length: 50 } }
                    }
                ]
            };

            const exitConditions = {
                target: 50,
                target_type: 'points',
                stoploss: 25,
                stoploss_type: 'points',
                condition_type: 'all',
                rules: []
            };

            const payload = {
                stock_name: [symbol || 'XAUUSD'],
                from_date: fromDate || '2024-01-01',
                to_date: toDate || '2024-03-01',
                interval: interval || '15min',
                is_mis: true,
                entry_type: 0,
                quantity: parseFloat(quantity) || 0.01,
                inital_capital: parseFloat(capital) || 10000,
                data_provider: 'DB',
                include_plot: true,
                entry_conditions: entryConditions,
                exit_conditions: exitConditions
            };

            const res = await strategyStudioApi.runBacktest(payload);

            if (res.success && res.data && (Array.isArray(res.data) ? res.data.length > 0 : !!res.data)) {
                const stockRes = Array.isArray(res.data) ? res.data[0] : res.data;
                const trips = parseRoundTrips(stockRes, parseFloat(capital) || 10000, parseFloat(quantity) || 0.01);
                const execParams = {
                    symbol: symbol || 'XAUUSD',
                    interval: interval || '15min',
                    capital: parseFloat(capital) || 10000,
                    quantity: parseFloat(quantity) || 0.01,
                    fromDate: fromDate || '2024-01-01',
                    toDate: toDate || '2024-03-01'
                };
                setResults(stockRes);
                setRoundTrips(trips);
                setExecutedParams(execParams);

                saveBacktestResponse({
                    strategy_id: null,
                    source: strategyOrigin || 'custom',
                    strategyName: strategyName || 'Algorithmic Strategy Backtest',
                    activeStrategyInfo: null,
                    results: stockRes,
                    roundTrips: trips,
                    executedParams: execParams,
                    symbol: execParams.symbol,
                    interval: execParams.interval,
                    capital: execParams.capital,
                    quantity: execParams.quantity,
                    fromDate: execParams.fromDate,
                    toDate: execParams.toDate
                });

                handleToast('Backtest simulation complete!');
            } else {
                setResults(null);
                setRoundTrips([]);
                handleToast(res.error || 'No trade signals found for the chosen parameters.');
            }
        } catch (err) {
            handleToast('Simulation execution error.');
        } finally {
            setSimulationLoading(false);
        }
    };

    return (
        <div className={styles.backtestContainer} data-lenis-prevent="true">
            <div className={styles.backtestInner}>
                <div className={styles.backtestPanel}>
                    {/* Background Cyber Waves */}
                    <BackgroundCyberWaves />

                    {/* Contextual Top Navigation & Strategy Header Bar */}
                    <div className={styles.backtestTopNav}>
                        <div className={styles.navLeftSection}>
                            <button
                                type="button"
                                className={styles.backBtn}
                                onClick={handleBackNavigation}
                                title={backButtonLabel}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                <span>{backButtonLabel}</span>
                            </button>

                            <div className={styles.navDivider} aria-hidden="true" />

                            <div className={styles.strategyInfoBlock}>
                                <div className={styles.titleRowWrap}>
                                    <h1 className={styles.headerStrategyTitle}>
                                        {strategyName || (activeStrategyInfo?.strategy_id ? 'Active Strategy Backtest' : 'Algorithmic Strategy Backtester')}
                                    </h1>
                                    <span className={styles.strategyOriginTag}>
                                        <span className={styles.originDot} />
                                        {strategyOrigin === 'my-bots' ? 'My Bot Strategy' : 'Predefined Model'}
                                    </span>
                                </div>
                                <div className={styles.metaChipsRow}>
                                    <span className={styles.metaChip}>
                                        <span className={styles.chipKey}>PAIR</span>
                                        <strong className={styles.chipVal}>{executedParams?.symbol ?? symbol}</strong>
                                    </span>
                                    <span className={styles.metaChip}>
                                        <span className={styles.chipKey}>INTERVAL</span>
                                        <strong className={styles.chipVal}>{executedParams?.interval ?? interval}</strong>
                                    </span>
                                    <span className={styles.metaChip}>
                                        <span className={styles.chipKey}>CAPITAL</span>
                                        <strong className={styles.chipVal}>${Number(executedParams?.capital ?? capital).toLocaleString()}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.navRightSection}>
                            <div className={styles.statusLivePill}>
                                <span className={styles.liveDot} />
                                <span>{simulationLoading ? 'Simulating Engine...' : results ? 'Simulation Completed' : 'Engine Ready'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Parameter Command Toolbar */}
                    <StudioToolbar
                        symbol={symbol}
                        setSymbol={setSymbol}
                        interval={interval}
                        setInterval={setInterval}
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                        capital={capital}
                        setCapital={setCapital}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        onRunBacktest={handleRunBacktest}
                        loading={simulationLoading}
                    />

                    {/* Main Content Area */}
                    <div className={styles.contentArea}>
                        {simulationLoading ? (
                            <div className={studioStyles.loadingOverlay}>
                                <SimulationProgressLoader symbol={symbol} interval={interval} />
                            </div>
                        ) : results ? (
                            <BacktestResultsView
                                results={results}
                                roundTrips={roundTrips}
                                initialCapital={parseFloat(executedParams?.capital ?? capital) || 10000}
                                symbol={executedParams?.symbol ?? symbol}
                                interval={executedParams?.interval ?? interval}
                                quantity={parseFloat(executedParams?.quantity ?? quantity) || 0.01}
                            />
                        ) : (
                            /* Empty State Screen */
                            <div className={studioStyles.emptyState}>
                                <div className={studioStyles.emptyIllustration}>
                                    <AiBotSparkIcon size={44} color="#18C98B" />
                                </div>
                                <h2>Algorithmic Strategy Backtester</h2>
                                <p>
                                    Configure your trading parameters in the toolbar above and click &quot;Run Backtest&quot; to simulate. Inspect performance curves, win rates, and individual round-trip trades.
                                </p>
                                <div className={studioStyles.flowSteps}>
                                    <div className={studioStyles.stepBox}>
                                        <div className={studioStyles.stepIconWrap}>
                                            <SlidersTuneIcon size={16} color="#18C98B" />
                                        </div>
                                        <h4>Configure Parameters</h4>
                                        <p>Set symbol, timeframe, date range, capital and quantity above.</p>
                                    </div>
                                    <div className={studioStyles.stepBox}>
                                        <div className={studioStyles.stepIconWrap}>
                                            <ShieldCheckIcon size={16} color="#18C98B" />
                                        </div>
                                        <h4>Validate & Inspect</h4>
                                        <p>Review entry rules, stop loss, and target conditions.</p>
                                    </div>
                                    <div className={studioStyles.stepBox}>
                                        <div className={studioStyles.stepIconWrap}>
                                            <RocketRunIcon size={16} color="#18C98B" />
                                        </div>
                                        <h4>Simulate & Audit</h4>
                                        <p>Run backtest across historical candles with 1-click execution.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
