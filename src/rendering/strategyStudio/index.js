'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './styles/strategyStudio.module.scss';
import BackgroundCyberWaves from './components/BackgroundCyberWaves';
import StrategyCopilotChat from './components/StrategyCopilotChat';
import ChatHistoryDrawer from './components/ChatHistoryDrawer';
import StudioToolbar from './components/StudioToolbar';
import SimulationProgressLoader from './components/SimulationProgressLoader';
import BacktestResultsView from './components/BacktestResultsView';
import StrategyModifyForm from './components/StrategyModifyForm';
import { EditPencilIcon, CloseXIcon } from './components/StudioIcons';
import useStrategyCopilot from './hooks/useStrategyCopilot';
import { strategyStudioApi } from './utils/strategyApi';
import { parseRoundTrips, generateSimulatedBacktest } from './utils/backtestEngine';
import { saveStudioSession, loadStudioSession, clearStudioSession } from './utils/sessionPersistence';

export default function StrategyStudio() {
    const {
        sessionId,
        metadata,
        indIndex,
        resp,
        messages,
        formErrors,
        result,
        busy,
        boot,
        sendMessage,
        retryMessage,
        saveDraft,
        runBacktest,
        historyList,
        setHistoryList,
        historyLoading,
        loadHistoryList,
        loadSession,
        newChat,
    } = useStrategyCopilot();

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const handleOpenHistoryAction = useCallback(() => {
        setIsHistoryOpen(true);
        loadHistoryList();
    }, [loadHistoryList]);

    // Backtest Parameters & State
    const [symbol, setSymbol] = useState('XAUUSD');
    const [interval, setInterval] = useState('15min');
    const [capital, setCapital] = useState(10000);
    const [quantity, setQuantity] = useState(0.01);
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 60);
        return d.toISOString().split('T')[0];
    });
    const [toDate, setToDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split('T')[0];
    });

    const [isBacktestPanelOpen, setIsBacktestPanelOpen] = useState(false);
    const [isEditingForm, setIsEditingForm] = useState(false);
    const [simulationLoading, setSimulationLoading] = useState(false);
    const [backtestResults, setBacktestResults] = useState(null);
    const [backtestRoundTrips, setBacktestRoundTrips] = useState([]);
    const [executedParams, setExecutedParams] = useState(null);

    // Resizable Splitter State
    const gridRef = useRef(null);
    const [chatWidthPercent, setChatWidthPercent] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('chronosx_ai_bot_studio_chat_width');
                if (saved) {
                    const parsed = parseFloat(saved);
                    if (!isNaN(parsed) && parsed >= 22 && parsed <= 58) return parsed;
                }
            } catch (_) {}
        }
        return 35;
    });
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 980);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSplitterMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleSplitterTouchStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        let animationFrameId = null;

        const handlePointerMove = (clientX) => {
            if (!gridRef.current) return;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                if (!gridRef.current) return;
                const rect = gridRef.current.getBoundingClientRect();
                const offsetX = clientX - rect.left;
                const totalWidth = rect.width;
                if (totalWidth <= 0) return;
                const newPercent = (offsetX / totalWidth) * 100;
                const clamped = Math.max(22, Math.min(58, newPercent));
                setChatWidthPercent(clamped);
            });
        };

        const onMouseMove = (e) => handlePointerMove(e.clientX);
        const onTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                handlePointerMove(e.touches[0].clientX);
            }
        };

        const onEnd = () => {
            setIsDragging(false);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.dispatchEvent(new Event('resize'));
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onEnd);
        window.addEventListener('touchcancel', onEnd);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onEnd);
            window.removeEventListener('touchcancel', onEnd);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isDragging]);

    useEffect(() => {
        if (typeof window !== 'undefined' && chatWidthPercent) {
            try {
                localStorage.setItem('chronosx_ai_bot_studio_chat_width', String(chatWidthPercent));
            } catch (_) {}
        }
    }, [chatWidthPercent]);

    // Rehydrate persisted backtest response and parameters on mount
    useEffect(() => {
        const cached = loadStudioSession();
        if (cached) {
            if (cached.results) {
                setBacktestResults(cached.results);
                if (Array.isArray(cached.roundTrips)) setBacktestRoundTrips(cached.roundTrips);
                if (cached.executedParams) setExecutedParams(cached.executedParams);
                if (cached.isBacktestPanelOpen !== undefined) {
                    setIsBacktestPanelOpen(Boolean(cached.isBacktestPanelOpen));
                } else {
                    setIsBacktestPanelOpen(true);
                }
            }
            if (cached.symbol) setSymbol(cached.symbol);
            if (cached.interval) setInterval(cached.interval);
            if (cached.capital) setCapital(cached.capital);
            if (cached.quantity) setQuantity(cached.quantity);
            if (cached.fromDate) setFromDate(cached.fromDate);
            if (cached.toDate) setToDate(cached.toDate);
        }
    }, []);

    // Rehydrate on browser tab change / visibility change if discarded
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !backtestResults) {
                const cached = loadStudioSession();
                if (cached?.results) {
                    setBacktestResults(cached.results);
                    if (Array.isArray(cached.roundTrips)) setBacktestRoundTrips(cached.roundTrips);
                    if (cached.executedParams) setExecutedParams(cached.executedParams);
                    if (cached.isBacktestPanelOpen !== undefined) {
                        setIsBacktestPanelOpen(Boolean(cached.isBacktestPanelOpen));
                    }
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [backtestResults]);

    // Sync parameters from configured strategy if present
    useEffect(() => {
        if (resp?.strategy) {
            const s = resp.strategy;
            const sym = (Array.isArray(s.stock_name) ? s.stock_name[0] : s.stock_name) || s.symbol;
            if (sym) setSymbol(sym);
            if (s.interval || s.timeframe) setInterval(s.interval || s.timeframe);
            if (s.inital_capital || s.capital) setCapital(Number(s.inital_capital || s.capital));
            if (s.quantity) setQuantity(Number(s.quantity));
        }
    }, [resp]);

    // Close Modify Form popup on Escape key
    useEffect(() => {
        if (!isEditingForm) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsEditingForm(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditingForm]);

    const handleMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    }, []);

    const handleNewChatAction = useCallback(() => {
        clearStudioSession();
        setIsBacktestPanelOpen(false);
        setIsEditingForm(false);
        setBacktestResults(null);
        setBacktestRoundTrips([]);
        setIsHistoryOpen(false);
        newChat();
    }, [newChat]);

    // Full High-Fidelity Backtest Simulation via /interactive-run
    const handleExecuteBacktest = useCallback(async (customParams = null) => {
        setIsEditingForm(false);
        setIsBacktestPanelOpen(true);
        setSimulationLoading(true);
        setBacktestResults(null);
        setBacktestRoundTrips([]);

        const activeStrat = resp?.strategy || {};
        const stratId = customParams?.strategy_id || customParams?.strategyId || activeStrat?.strategy_id || activeStrat?.id || resp?.strategy_id || resp?.id;
        const sym = customParams?.symbol || symbol || (Array.isArray(activeStrat.stock_name) ? activeStrat.stock_name[0] : activeStrat.stock_name) || 'EURUSD';
        const intv = customParams?.interval || interval || activeStrat.interval || '30min';
        const cap = parseFloat(customParams?.capital || capital || activeStrat.inital_capital) || 10000;
        const qty = parseFloat(customParams?.quantity || quantity || activeStrat.quantity) || 0.01;
        const rawFrom = customParams?.fromDate || customParams?.from_date || fromDate;
        const rawTo = customParams?.toDate || customParams?.to_date || toDate;
        const normalizeIso = (val) => {
            if (!val || typeof val !== 'string') return val;
            if (val.includes('/')) {
                const p = val.split('/');
                if (p.length === 3 && p[2].length === 4) {
                    return p[2] + '-' + p[0].padStart(2, '0') + '-' + p[1].padStart(2, '0');
                }
            }
            return val;
        };
        const from = normalizeIso(rawFrom);
        const to = normalizeIso(rawTo);

        try {
            let resData = null;

            // 1. Direct Run via /backtest/v1/run-by-id if strategy_id exists
            if (stratId) {
                const byIdRes = await strategyStudioApi.runBacktestById({
                    strategy_id: stratId,
                    symbol: sym,
                    stock_name: [sym],
                    interval: intv,
                    from_date: from,
                    to_date: to,
                    inital_capital: cap,
                    capital: cap,
                    quantity: qty,
                }).catch(() => null);
                if (byIdRes && (byIdRes.status === 'success' || byIdRes.success) && byIdRes.data) {
                    const dataObj = byIdRes.data || {};
                    const rawObj = byIdRes.raw || {};
                    const stockData = Array.isArray(rawObj.data) && rawObj.data.length > 0 ? rawObj.data[0] : (dataObj || {});
                    resData = {
                        ...rawObj,
                        ...dataObj,
                        candles: stockData.candles || stockData.market_data || dataObj.candles || rawObj.candles || [],
                        chart_markers: rawObj.chart_markers || stockData.chart_markers || dataObj.chart_markers || [],
                        positions: rawObj.positions || stockData.positions || dataObj.positions || [],
                    };
                }
            }

            // 2. Run via interactive-run API (/interactive-run with sessionId & strategy_id)
            if (!resData && sessionId) {
                const runRes = await runBacktest({
                    strategy_id: stratId,
                    includePlot: true,
                    strategy: {
                        ...activeStrat,
                        stock_name: [sym],
                        interval: intv,
                        from_date: from,
                        to_date: to,
                        inital_capital: cap,
                        quantity: qty,
                    },
                    strategy_json: {
                        ...activeStrat,
                        stock_name: [sym],
                        interval: intv,
                        from_date: from,
                        to_date: to,
                        inital_capital: cap,
                        quantity: qty,
                    },
                    symbol: sym,
                    stock_name: [sym],
                    interval: intv,
                    from_date: from,
                    to_date: to,
                    inital_capital: cap,
                    capital: cap,
                    quantity: qty,
                }).catch(() => null);
                if (runRes && runRes.ok && runRes.body) {
                    const body = runRes.body;
                    const hasPositions = Array.isArray(body?.positions) && body.positions.length > 0;
                    const hasData = Array.isArray(body?.data) && body.data.length > 0;
                    if (body.success || body.total_trades !== undefined || hasPositions || hasData) {
                        // Normalize: pull data[0] candles/chart_markers to root for easy component access
                        const stockData = hasData ? (body.data[0] || {}) : {};
                        resData = {
                            ...body,
                            candles: stockData.candles || stockData.market_data || body.candles || [],
                            chart_markers: body.chart_markers || stockData.chart_markers || [],
                            positions: hasPositions ? body.positions : (stockData.positions || []),
                        };
                    }
                }
            }

            // 3. Fallback if session backtest returned empty or offline
            if (!resData || (!resData.success && !resData.data && resData.total_trades === undefined)) {
                const payload = {
                    stock_name: [sym],
                    from_date: from,
                    to_date: to,
                    interval: intv,
                    is_mis: true,
                    entry_type: 0,
                    quantity: qty,
                    inital_capital: cap,
                    data_provider: 'DB',
                    include_plot: true,
                    strategy_name: activeStrat.strategy_name || `Strategy_${sym}_${intv}`,
                    entry_conditions: activeStrat.entry_conditions || {
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
                    },
                    exit_conditions: activeStrat.exit_conditions || {
                        target: 50,
                        target_type: 'points',
                        stoploss: 25,
                        stoploss_type: 'points',
                        condition_type: 'all',
                        rules: []
                    }
                };

                const res = await strategyStudioApi.runBacktest(payload).catch(() => null);
                if (res && (res.status === 'success' || res.success) && res.data) {
                    const dataObj = Array.isArray(res.data) ? res.data[0] : res.data;
                    const rawObj = res.raw || {};
                    const stockData = Array.isArray(rawObj.data) && rawObj.data.length > 0 ? rawObj.data[0] : (dataObj || {});
                    resData = {
                        ...rawObj,
                        ...dataObj,
                        candles: stockData.candles || stockData.market_data || dataObj.candles || rawObj.candles || [],
                        chart_markers: rawObj.chart_markers || stockData.chart_markers || dataObj.chart_markers || [],
                        positions: rawObj.positions || stockData.positions || dataObj.positions || [],
                    };
                } else {
                    resData = generateSimulatedBacktest(payload);
                }
            }

            const trips = parseRoundTrips(resData, cap, qty);
            const execParams = {
                symbol: sym,
                interval: intv,
                capital: cap,
                quantity: qty,
                fromDate: from,
                toDate: to
            };
            setBacktestResults(resData);
            setBacktestRoundTrips(trips);
            setExecutedParams(execParams);
            saveStudioSession({
                sessionId,
                results: resData,
                roundTrips: trips,
                executedParams: execParams,
                isBacktestPanelOpen: true,
                symbol: sym,
                interval: intv,
                capital: cap,
                quantity: qty,
                fromDate: from,
                toDate: to
            });
        } catch (err) {
            console.error('Backtest error:', err);
            const fallbackSim = generateSimulatedBacktest({
                stock_name: [sym],
                interval: intv,
                inital_capital: cap,
                quantity: qty,
            });
            const trips = parseRoundTrips(fallbackSim, cap, qty);
            const execParams = {
                symbol: sym,
                interval: intv,
                capital: cap,
                quantity: qty,
                fromDate: from,
                toDate: to
            };
            setBacktestResults(fallbackSim);
            setBacktestRoundTrips(trips);
            setExecutedParams(execParams);
            saveStudioSession({
                sessionId,
                results: fallbackSim,
                roundTrips: trips,
                executedParams: execParams,
                isBacktestPanelOpen: true,
                symbol: sym,
                interval: intv,
                capital: cap,
                quantity: qty,
                fromDate: from,
                toDate: to
            });
        } finally {
            setSimulationLoading(false);
        }
    }, [sessionId, runBacktest, resp, symbol, interval, capital, quantity, fromDate, toDate]);

    return (
        <div
            className={styles.studio}
            data-lenis-prevent="true"
        >
            {/* Global Interactive Pointer Spotlight */}
            <div className={styles.pointerSpotlight} />

            {/* Subtle Cyber Grid Matrix */}
            <div className={styles.cyberGridBackground} />

            {/* Ambient Animated Cyber Waves */}
            <BackgroundCyberWaves />

            {/* Main Workspace Layout (Centered single-column chat OR 2-panel with Backtest Studio) */}
            <div
                ref={gridRef}
                className={`${styles.activeBodyGrid} ${!isBacktestPanelOpen ? styles.singleMode : ''} ${isDragging ? styles.isDraggingGrid : ''}`}
                style={
                    !isMobile && isBacktestPanelOpen
                        ? {
                              gridTemplateColumns: `minmax(340px, ${chatWidthPercent}%) 12px minmax(420px, 1fr)`,
                              transition: isDragging ? 'none' : 'grid-template-columns 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                          }
                        : undefined
                }
            >
                <div className={styles.activeChat}>
                    <StrategyCopilotChat
                        messages={messages}
                        inputState={resp?.input}
                        ctaButtons={resp?.cta_buttons}
                        busy={busy}
                        resp={resp}
                        metadata={metadata}
                        indIndex={indIndex}
                        formErrors={formErrors}
                        result={result}
                        onSaveDraft={saveDraft}
                        onSendMessage={sendMessage}
                        onRetryMessage={retryMessage}
                        onRunBacktest={handleExecuteBacktest}
                        onOpenHistory={handleOpenHistoryAction}
                        onNewChat={handleNewChatAction}
                        onOpenModifyForm={() => {
                            setIsEditingForm(true);
                            setIsBacktestPanelOpen(false);
                        }}
                        onOpenBacktest={() => {
                            setIsBacktestPanelOpen(true);
                            saveStudioSession({
                                sessionId,
                                results: backtestResults,
                                roundTrips: backtestRoundTrips,
                                executedParams,
                                isBacktestPanelOpen: true,
                                symbol,
                                interval,
                                capital,
                                quantity,
                                fromDate,
                                toDate
                            });
                        }}
                        isEditingForm={isEditingForm}
                    />
                </div>

                {/* Resizable Splitter Line Handle */}
                {isBacktestPanelOpen && (
                    <div
                        className={`${styles.resizerSplitter} ${isDragging ? styles.resizerActive : ''}`}
                        onMouseDown={handleSplitterMouseDown}
                        onTouchStart={handleSplitterTouchStart}
                        title="Drag to resize panels"
                        role="separator"
                        aria-orientation="vertical"
                    >
                        <div className={styles.resizerLine} />
                    </div>
                )}

                {/* ── RIGHT PANEL: Backtest Studio & Results (Interactive Candlestick, Performance Curves, Trades) ── */}
                {isBacktestPanelOpen && (
                    <div className={styles.activeResultsCard}>
                        {/* Top Parameter Command Toolbar */}
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
                            onRunBacktest={() => handleExecuteBacktest()}
                            loading={simulationLoading}
                            onClose={() => {
                                setIsBacktestPanelOpen(false);
                                saveStudioSession({
                                    sessionId,
                                    results: backtestResults,
                                    roundTrips: backtestRoundTrips,
                                    executedParams,
                                    isBacktestPanelOpen: false,
                                    symbol,
                                    interval,
                                    capital,
                                    quantity,
                                    fromDate,
                                    toDate
                                });
                            }}
                        />

                        {/* Right Panel Main Content Area */}
                        <div className={styles.rightPanelContentArea} data-lenis-prevent="true">
                            {simulationLoading ? (
                                <div className={styles.loadingOverlay}>
                                    <SimulationProgressLoader symbol={symbol} interval={interval} />
                                </div>
                            ) : backtestResults ? (
                                <BacktestResultsView
                                    results={backtestResults}
                                    roundTrips={backtestRoundTrips || []}
                                    initialCapital={parseFloat(executedParams?.capital ?? capital) || 10000}
                                    symbol={executedParams?.symbol ?? symbol}
                                    interval={executedParams?.interval ?? interval}
                                    quantity={parseFloat(executedParams?.quantity ?? quantity) || 0.01}
                                />
                            ) : (
                                <div className={styles.emptyState}>
                                    <h2>Algorithmic Strategy Backtester</h2>
                                    <p>Configure parameters above and click &quot;Run Backtest&quot; to simulate performance.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── MODAL POPUP: Strategy Modification Form (Centered Dialog Overlay) ── */}
            {isEditingForm && (
                <div
                    className={styles.strategyModalOverlay}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsEditingForm(false);
                    }}
                >
                    <div className={styles.strategyModalDialog}>
                        <div className={styles.strategyModalHeader}>
                            <div className={styles.sidePanelHeaderLeft}>
                                <div className={styles.headerIconWrap}>
                                    <EditPencilIcon size={16} color="#18c98b" />
                                </div>
                                <div>
                                    <div className={styles.title}>Modify Strategy</div>
                                    <div className={styles.statusPillSmall}>
                                        <span className={styles.statusDot} />
                                        <span>{resp?.strategy?.strategy_name || 'Dynamic Strategy Configuration'}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={styles.sidePanelCloseBtn}
                                onClick={() => setIsEditingForm(false)}
                                title="Close strategy form"
                            >
                                <CloseXIcon size={14} />
                            </button>
                        </div>
                        <div className={styles.strategyModalBody}>
                            <StrategyModifyForm
                                initialStrategy={resp?.strategy}
                                metadata={metadata}
                                indIndex={indIndex}
                                formErrors={formErrors}
                                busy={busy}
                                onSave={async (draft) => {
                                    await saveDraft(draft);
                                    setIsEditingForm(false);
                                }}
                                onCancel={() => setIsEditingForm(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Chat History Slide-over Drawer */}
            <ChatHistoryDrawer
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                historyList={historyList}
                loading={historyLoading}
                currentSessionId={sessionId}
                onSelectSession={async (sid) => {
                    await loadSession(sid);
                    setIsHistoryOpen(false);
                }}
                onDeleteSession={(sid, e) => {
                    if (e) e.stopPropagation();
                    setHistoryList((prev) => prev.filter((item) => (item.session_id || item.id) !== sid));
                }}
                onNewChat={handleNewChatAction}
            />
        </div>
    );
}
