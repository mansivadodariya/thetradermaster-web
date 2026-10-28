'use client';

import CommonSectionHeader from '@/components/CommonSectionHeader';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './aiStrategy.module.scss';
import Loader from '@/components/loader';
import { getStoredUserId } from '@/lib/authSession';
import { toast } from '@/components/toast';
import dynamic from 'next/dynamic';
import StrategyDropdown from './StrategyDropdown';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { unifiedSocket, cleanPairSymbol, normalizeTimeframe } from '@/lib/unifiedSocket';
import {
    pairs,
    formatPairCurrency,
    getMockInitialData,
    getMockStrategySignal,
    formatCurrency,
    formatVolume,
    MOCK_LIVE_DATA,
    MOCK_STRATEGY_SIGNAL,
    MOCK_SCANNER_DATA
} from './strategyUtils';
import {
    RadarIcon,
    ArrowRightIcon,
    VolumeIcon,
    RiskRewardIcon
} from '@/icons/aiStrategyIcons';

import LiveAnalysisView from './components/LiveAnalysisView';
import StrategyExecutionView from './components/StrategyExecutionView';
import StrategyCategoryTabs from './components/StrategyCategoryTabs';
import { useAiStrategyStore } from '@/context/toolState';
import { fetchChartStrategies } from '@/services/chartStrategiesService';

export default function AiStrategy({ initialTab = 'live' }) {
    const { t } = useLanguage();
    const activeTab = initialTab;
    const router = useRouter();
    const [symbol, setSymbol] = useState('XAUUSD');
    const [symbolInput, setSymbolInput] = useState('XAUUSD');
    const [timeframe, setTimeframe] = useState('1h'); // '5m', '15m', '1h', '1d'

    // Store state variables (persisted across route navigation)
    const {
        selectedSymbol,
        setSelectedSymbol,
        selectedSymbolPriceInfo,
        setSelectedSymbolPriceInfo,
        selectedStrategyId,
        setSelectedStrategyId,
        activeAnalysis,
        setActiveAnalysis,
        refreshCounter,
        setRefreshCounter,
        globalTimeframe,
        setGlobalTimeframe,
        selectedStrategySymbol,
        setSelectedStrategySymbol,
        activeSignals,
        setActiveSignals,
        strategyAnalysis,
        setStrategyAnalysis,
        analysisLoading,
        setAnalysisLoading,
        logs,
        setLogs,
        addLog,
        clearLogs,
        handleHourlyRefresh,
        liveData,
        setLiveData,
        scannerData,
        setScannerData,
        scannerLoading,
        setScannerLoading,
        strategySignal,
        setStrategySignal
    } = useAiStrategyStore();

    const [wsStatus, setWsStatus] = useState('disconnected'); // 'connected' | 'connecting' | 'disconnected'
    const [showPairSelector, setShowPairSelector] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [mounted, setMounted] = useState(false);
    const [strategies, setStrategies] = useState([]);

    useEffect(() => {
        let isCancelled = false;
        async function loadStrategies() {
            const list = await fetchChartStrategies();
            if (isCancelled) return;
            setStrategies(list);
            if (!selectedStrategyId && list.length > 0) {
                setSelectedStrategyId(list[0].id || list[0].strategy_id);
            }
        }
        loadStrategies();
        return () => { isCancelled = true; };
    }, [selectedStrategyId, setSelectedStrategyId]);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const savedSymbol = sessionStorage.getItem('selectedStrategySymbol');
            if (savedSymbol) {
                setSelectedSymbol(savedSymbol);
                sessionStorage.removeItem('selectedStrategySymbol');
            }
        }
    }, [setSelectedSymbol]);

    useEffect(() => {
        setSelectedSymbolPriceInfo(null);
    }, [selectedSymbol, setSelectedSymbolPriceInfo]);

    const handleSetGlobalTimeframe = (tf) => {
        setGlobalTimeframe(tf);
        addLog(`Switched global timeframe to ${tf}`, true);
    };

    // Live Candle Data (XAUUSD strategy tab)
    const [candleStartTimes, setCandleStartTimes] = useState({
        "5m": MOCK_LIVE_DATA["5m"].time,
        "15m": MOCK_LIVE_DATA["15m"].time,
        "1h": MOCK_LIVE_DATA["1h"].time,
        "1d": MOCK_LIVE_DATA["1d"].time
    });
    const [countdownTexts, setCountdownTexts] = useState({ "5m": "-:-", "15m": "-:-", "1h": "-:-", "1d": "-:-" });
    const [priceTickColor, setPriceTickColor] = useState('normal'); // 'up' | 'down' | 'normal'
    const [lastPrices, setLastPrices] = useState({ "5m": 0, "15m": 0, "1h": 0, "1d": 0 });

    // Logger Helper for strategy tab
    const addStrategyLog = (message, isSystem = false) => {
        console.log(`[WebSocket Strategy] ${isSystem ? 'SYSTEM: ' : ''}${message}`);
    };

    // Connection & Message Management for Strategy Tab (Unified MT5 Live WebSocket)
    useEffect(() => {
        if (activeTab !== 'strategy') return;

        const currentSym = cleanPairSymbol(selectedStrategySymbol || selectedSymbol || 'XAUUSD');

        // 1. Connection Status Tracking
        const unsubStatus = unifiedSocket.subscribeStatus((status) => {
            setWsStatus(status);
            if (status === 'connected') {
                addStrategyLog('Connected successfully to Live Market WebSocket!', true);
            } else if (status === 'connecting') {
                addStrategyLog('Connecting to Live Market WebSocket...', true);
            } else {
                addStrategyLog('Connection lost. Reconnecting in 3 seconds...', true);
            }
        });

        // 2. Candle & Dynamic Indicator Stream
        const unsubCandles = unifiedSocket.subscribeCandles((candleData, fullPayload) => {
            if (!candleData) return;
            const currentTf = normalizeTimeframe(globalTimeframe || 'H1');
            const currentPrice = parseFloat(candleData.close);

            if (!isNaN(currentPrice)) {
                setLastPrices((prev) => {
                    const prevPrice = prev[currentTf] || 0;
                    if (prevPrice > 0 && currentPrice !== prevPrice) {
                        setPriceTickColor(currentPrice > prevPrice ? 'up' : 'down');
                    }
                    return { ...prev, [currentTf]: currentPrice };
                });
            }

            if (fullPayload?.strategy) {
                setStrategySignal((prev) => ({ ...prev, ...fullPayload.strategy }));
            }
            if (fullPayload?.strategy_signal) {
                setStrategySignal(fullPayload.strategy_signal);
            }
        }, currentSym, globalTimeframe);

        // 3. Price Tick Stream
        const unsubPrice = unifiedSocket.subscribePrice((priceObj) => {
            if (!priceObj) return;
            const currentTf = normalizeTimeframe(globalTimeframe || 'H1');
            const p = parseFloat(priceObj.price);
            if (!isNaN(p)) {
                setLastPrices((prev) => {
                    const prevPrice = prev[currentTf] || 0;
                    if (prevPrice > 0 && p !== prevPrice) {
                        setPriceTickColor(p > prevPrice ? 'up' : 'down');
                    }
                    return { ...prev, [currentTf]: p };
                });
            }
        }, currentSym);

        // 4. Strategy Setups and Signals
        const unsubStrategy = unifiedSocket.subscribeStrategy((payload) => {
            try {
                if (payload.type === 'initial_strategy_state' && Array.isArray(payload.active_setups)) {
                    addStrategyLog(`Received initial strategy state with ${payload.active_setups.length} setups`);
                    const newSigs = {};
                    payload.active_setups.forEach((setup) => {
                        if (setup.symbol) {
                            const sName = setup.symbol.replace("/", "").toUpperCase();
                            newSigs[sName] = setup;
                        }
                    });
                    setActiveSignals(newSigs);

                    const keys = Object.keys(newSigs);
                    if (keys.length > 0 && !newSigs["XAUUSD"]) {
                        setSelectedStrategySymbol(keys[0]);
                    }
                } else if (payload.symbol && payload.signal) {
                    const sName = payload.symbol.replace("/", "").toUpperCase();
                    addStrategyLog(`Received strategy update for ${sName}`);
                    setActiveSignals((prev) => ({
                        ...prev,
                        [sName]: {
                            ...prev[sName],
                            ...payload,
                        },
                    }));
                } else if (payload.strategy_signal) {
                    const sig = payload.strategy_signal;
                    const sName = (sig.symbol || payload.symbol || currentSym || '').replace("/", "").toUpperCase();
                    if (sName) {
                        addStrategyLog(`Received strategy alert for ${sName}`);
                        setActiveSignals((prev) => ({
                            ...prev,
                            [sName]: {
                                ...prev[sName],
                                symbol: sig.symbol || payload.symbol || currentSym,
                                signal: { ...sig },
                            },
                        }));
                    }
                }
            } catch (e) {
                console.error("Error processing websocket payload:", e);
            }
        }, currentSym, selectedStrategyId);

        return () => {
            unsubStatus();
            unsubCandles();
            unsubPrice();
            unsubStrategy();
        };
    }, [activeTab, selectedStrategySymbol, selectedSymbol, globalTimeframe, selectedStrategyId]);

    // REST Polling for Scanner Metrics (runs only on Strategy tab)
    const fetchScannerData = async (targetSymbol, targetTf) => {
        try {
            setScannerLoading(true);
            let displayTf = targetTf.toUpperCase();
            
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
            const url = `${backendUrl}/api/v1/scanner/run-all?symbol=${targetSymbol}&timeframe=${displayTf}`;
            
            const res = await fetch(url);
            if (!res.ok) throw new Error("Network status invalid");
            const data = await res.json();
            if (data.success) {
                setScannerData(data);
            }
        } catch (err) {
            console.warn("Failed fetching scanner results:", err.message);
        } finally {
            setScannerLoading(false);
        }
    };

    // Fetch detailed technical analysis for selected pair on Strategy tab
    const fetchStrategyAnalysis = async (targetSymbol) => {
        if (!targetSymbol) return;
        const cleanSym = targetSymbol.replace("/", "").toUpperCase();
        try {
            setAnalysisLoading(true);
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
            const url = `${backendUrl}/api/v1/chart/analysis?symbol=${cleanSym}`;
            
            const res = await fetch(url, {
                headers: {
                    'accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            if (!res.ok) throw new Error("Network status invalid");
            const data = await res.json();
            if (data.success && data.analysis) {
                setStrategyAnalysis(data.analysis);
            }
        } catch (err) {
            console.warn("Failed fetching strategy analysis:", err.message);
        } finally {
            setAnalysisLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'strategy' && selectedStrategySymbol) {
            fetchStrategyAnalysis(selectedStrategySymbol);
        }
    }, [activeTab, selectedStrategySymbol]);

    // Ticks countdown timer logic
    useEffect(() => {
        if (activeTab !== 'strategy') return;
        const durations = {
            "5m": 300,
            "15m": 900,
            "1h": 3600,
            "1d": 86400
        };

        const updateCountdowns = () => {
            const now = Math.floor(Date.now() / 1000);
            const nextTexts = {};

            for (const tf in candleStartTimes) {
                const startTime = candleStartTimes[tf];
                if (!startTime) {
                    nextTexts[tf] = "-:-";
                    continue;
                }

                const duration = durations[tf];
                const elapsed = now - startTime;
                let remaining = duration - elapsed;
                if (remaining < 0) remaining = 0;

                if (remaining >= 86400) {
                    const days = Math.floor(remaining / 86400);
                    const hours = Math.floor((remaining % 86400) / 3600);
                    nextTexts[tf] = `${days}d ${hours}h`;
                } else if (remaining >= 3600) {
                    const hours = Math.floor(remaining / 3600);
                    const minutes = Math.floor((remaining % 3600) / 60);
                    nextTexts[tf] = `${hours}h ${minutes}m`;
                } else {
                    const minutes = Math.floor(remaining / 60);
                    const seconds = remaining % 60;
                    nextTexts[tf] = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }
            setCountdownTexts(nextTexts);
        };

        const timer = setInterval(updateCountdowns, 1000);
        return () => clearInterval(timer);
    }, [activeTab, candleStartTimes]);

    // Reset price change color flash after a delay
    useEffect(() => {
        if (priceTickColor !== 'normal') {
            const timer = setTimeout(() => setPriceTickColor('normal'), 600);
            return () => clearTimeout(timer);
        }
    }, [priceTickColor]);

    // Handler to subscribe to new symbol
    const handleSubscribe = (e) => {
        e.preventDefault();
        const inputVal = symbolInput.trim().toUpperCase();
        if (!inputVal) return;

        addStrategyLog(`Subscribing to symbol: ${inputVal}`, true);
        setSymbol(inputVal);

        if (activeTab === 'strategy') {
            setSelectedStrategySymbol(inputVal);
            if (!activeSignals[inputVal]) {
                setActiveSignals(prev => ({
                    ...prev,
                    [inputVal]: {
                        symbol: inputVal,
                        strategy_name: 'EMA Pullback',
                        signal: {
                            active: false,
                            message: `Monitoring live strategy feed for ${inputVal}. Awaiting next signal trigger.`
                        }
                    }
                }));
            }
        } else {
            setLiveData(null);
            setStrategySignal(null);
            setScannerData(null);
            setCandleStartTimes({ "5m": 0, "15m": 0, "1h": 0, "1d": 0 });
            setLastPrices({ "5m": 0, "15m": 0, "1h": 0, "1d": 0 });
        }
        
        toast.success(`Subscribed to ${inputVal}`);
    };

    const handleCardClick = (sym) => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('selectedStrategySymbol', sym);
        }
        router.push('/signal-terminal');
    };

    // Parse strength and details from REST scanner output
    const scannerSummary = useMemo(() => {
        if (!scannerData || !scannerData.analysis_summary) return null;
        return scannerData.analysis_summary[symbol] || null;
    }, [scannerData, symbol]);

    const strengthPercentage = useMemo(() => {
        if (!scannerSummary) return 50;
        const score = scannerSummary.strength_score || 0;
        return Math.round(((score + 5) / 10) * 100);
    }, [scannerSummary]);

    const signalPills = useMemo(() => {
        if (!scannerData || !scannerData.scanner_results) return [];
        const items = [];
        for (const scannerName in scannerData.scanner_results) {
            const matches = scannerData.scanner_results[scannerName];
            if (Array.isArray(matches)) {
                matches.forEach((m) => {
                    let typeClass = styles.neutralBadge;
                    if (scannerName.includes("breakout")) typeClass = styles.breakoutBadge;
                    else if (scannerName.includes("momentum")) typeClass = styles.momentumBadge;
                    else if (scannerName.includes("rsi")) typeClass = styles.rsiBadge;
                    else if (scannerName.includes("volume") || scannerName.includes("vol")) typeClass = styles.volumeBadge;
                    else if (scannerName.includes("gap") || scannerName.includes("structure")) typeClass = styles.gapBadge;

                    items.push({
                        id: `${scannerName}-${m.detail}`,
                        name: scannerName.replace(/_/g, ' ').toUpperCase(),
                        detail: m.detail,
                        className: typeClass
                    });
                });
            }
        }
        return items;
    }, [scannerData]);

    const candle = useMemo(() => {
        if (!liveData) return null;
        return liveData[timeframe] || null;
    }, [liveData, timeframe]);

    const priceChangeInfo = useMemo(() => {
        if (!candle) return { val: 0, pct: 0, class: 'neutral' };
        const val = candle.close - candle.open;
        const pct = candle.open > 0 ? (val / candle.open) * 100 : 0;
        return {
            val,
            pct,
            class: val >= 0 ? styles.positive : styles.negative
        };
    }, [candle]);

    // Active setup calculation for the selected symbol on strategy tab
    const activeSetup = activeSignals[selectedStrategySymbol] || (Object.keys(activeSignals).length > 0 ? Object.values(activeSignals)[0] : null);

    // Calculate dynamic signal data or fallback using REST analysis details
    const activeSignal = useMemo(() => {
        if (activeSetup?.signal?.active) {
            return activeSetup.signal;
        }

        if (strategyAnalysis) {
            const currentPrice = strategyAnalysis.current_price || 0;
            const techScore = strategyAnalysis.technical_score || {};
            const directionLabel = techScore.label || '';
            
            let direction = 'HOLD';
            if (directionLabel.toLowerCase().includes('bullish') || directionLabel.toLowerCase().includes('buy')) {
                direction = 'BUY';
            } else if (directionLabel.toLowerCase().includes('bearish') || directionLabel.toLowerCase().includes('sell')) {
                direction = 'SELL';
            }
            
            const isBuy = direction === 'BUY';
            const isSell = direction === 'SELL';
            
            // Calculate a reasonable pip/point spread based on symbol to compute SL/TP
            const currentSym = activeSetup?.symbol || selectedStrategySymbol;
            const isJpy = currentSym.endsWith("JPY");
            const isGold = currentSym.includes("XAU") || currentSym.includes("GOLD");
            const defaultSpread = isGold ? 15.00 : isJpy ? 0.40 : 0.0025;
            
            const levels = strategyAnalysis.levels || {};
            let sl = levels.nearest_support || (isBuy ? (currentPrice - defaultSpread) : (currentPrice + defaultSpread));
            let tp1 = levels.nearest_resistance || (isBuy ? (currentPrice + defaultSpread) : (currentPrice - defaultSpread));
            
            // Ensure proper SL/TP logic based on direction
            if (isBuy) {
                if (sl >= currentPrice) sl = currentPrice - defaultSpread;
                if (tp1 <= currentPrice) tp1 = currentPrice + defaultSpread;
            } else if (isSell) {
                if (sl <= currentPrice) sl = currentPrice + defaultSpread;
                if (tp1 >= currentPrice) tp1 = currentPrice - defaultSpread;
            }
            
            const riskAmt = Math.abs(currentPrice - sl);
            const tp2 = isBuy ? (currentPrice + riskAmt * 2.5) : (currentPrice - riskAmt * 2.5);
            
            let rsiVal = 50;
            const momInd = strategyAnalysis.momentum_indicators || {};
            if (momInd.RSI && typeof momInd.RSI.value === 'number') {
                rsiVal = momInd.RSI.value;
            } else if (momInd.rsi && typeof momInd.rsi.value === 'number') {
                rsiVal = momInd.rsi.value;
            }

            const aiSum = strategyAnalysis.ai_summary || {};
            const reasoning = aiSum.headline || 
                `Dynamic technical indicators suggest a ${directionLabel.toLowerCase()} bias for ${currentSym} on the H1 timeframe. Price stands at ${currentPrice} with the RSI at ${rsiVal.toFixed(1)}.`;

            return {
                active: direction !== 'HOLD',
                direction,
                entry: currentPrice,
                sl,
                tp1,
                tp2,
                timestamp: Math.floor(Date.now() / 1000),
                confidence: techScore.confidence || techScore.total || 60,
                rvol: aiSum.volume || '1.1x',
                risk_reward: isBuy ? '1:1.5' : isSell ? '1:1.5' : '—',
                rsi: rsiVal,
                scanners_count: Object.keys(strategyAnalysis.trend_indicators || {}).length || 3,
                reasoning,
                isFallback: true
            };
        }

        return { active: false };
    }, [activeSetup, strategyAnalysis, selectedStrategySymbol]);

    const strategyActive = activeSetup !== null || strategyAnalysis !== null;
    const strategyDirection = activeSignal?.direction || 'HOLD';
    const confidenceVal = activeSignal?.confidence || 0;
    
    // Circular progress stroke calculations
    const circumference = 188.495;
    const dashoffset = circumference - (confidenceVal / 100) * circumference;

    return (
        <div className={styles.aiStrategyWrapper}>
            {/* Page Title */}
            <CommonSectionHeader
                badge={activeTab === 'live' ? t('aiStrategy.liveAnalysisBadge', 'TRADERMASTER LIVE ANALYSIS FEED') : t('aiStrategy.algorithmicSuiteBadge', 'TRADERMASTER ALGORITHMIC SUITE')}
                badgeIcon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                }
                title={activeTab === 'live' ? t('aiStrategy.liveAnalysisFeedTitle', 'Live Analysis Feed') : t('aiStrategy.title', 'AI Strategy')}
                subtitle={
                    activeTab === 'live' 
                        ? t('aiStrategy.liveAnalysisFeedSubtitle', 'Real-Time FX Live Grid providing instant market feeds and strategy indicators.')
                        : t('aiStrategy.subtitle', 'Real-time technical metrics, scanner signals, and AI Expert Advisor strategies streamed from MetaTrader 5.')
                }
                isCard={true}
                rightAction={
                    activeTab === 'live' ? (
                        <div className={styles.headerDropdownCorner}>
                            <StrategyDropdown 
                                strategies={strategies}
                                selectedStrategyId={selectedStrategyId}
                                onSelect={setSelectedStrategyId} 
                            />
                        </div>
                    ) : null
                }
            />

            {/* Filter by Category / Strategy Tabs */}
            <StrategyCategoryTabs
                strategies={strategies}
                selectedStrategyId={selectedStrategyId}
                onSelectStrategyId={setSelectedStrategyId}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            <div className={styles.contentBody}>
                <AnimatePresence mode="wait">
                    {activeTab === 'live' ? (
                        <motion.div 
                            key="live-tab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={styles.liveTabContainer}
                        >
                            <LiveAnalysisView
                                selectedSymbol={selectedSymbol}
                                setSelectedSymbol={setSelectedSymbol}
                                globalTimeframe={globalTimeframe}
                                addLog={addLog}
                                activeAnalysis={activeAnalysis}
                                setActiveAnalysis={setActiveAnalysis}
                                selectedSymbolPriceInfo={selectedSymbolPriceInfo}
                                setSelectedSymbolPriceInfo={setSelectedSymbolPriceInfo}
                                selectedStrategyId={selectedStrategyId}
                                handleHourlyRefresh={handleHourlyRefresh}
                                refreshCounter={refreshCounter}
                            />
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="strategy-tab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={styles.tabContent}
                        >
                            <StrategyExecutionView
                                selectedStrategyId={selectedStrategyId}
                                strategies={strategies}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
