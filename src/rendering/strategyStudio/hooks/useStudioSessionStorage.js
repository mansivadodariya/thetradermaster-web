import { useEffect } from 'react';
import { saveStudioSession, loadStudioSession, clearStudioSession } from '../utils/sessionPersistence';
import { normalizeInterval, normalizeSymbol } from '../utils/paramExtractor';

export default function useStudioSessionStorage({
    currentSessionId,
    setCurrentSessionId,
    messages,
    setMessages,
    currentDraft,
    setCurrentDraft,
    currentStrategy,
    setCurrentStrategy,
    results,
    setResults,
    roundTrips,
    setRoundTrips,
    executedParams,
    setExecutedParams,
    symbol,
    setSymbol,
    interval,
    setInterval,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    capital,
    setCapital,
    quantity,
    setQuantity,
    marketMode,
    setMarketMode,
    setChatInput,
    setIsBacktestPanelOpen,
    setGeneratingStrategy,
    setAdvisorLoading,
    setSimulationLoading,
    syncToolbarFromStrategy
}) {
    // Initialize session ID and date ranges or restore from localStorage on mount
    useEffect(() => {
        // 0. Check if forced new clean chat requested (e.g. from Launch AI Builder button)
        let isForceNew = false;
        try {
            if (typeof window !== 'undefined') {
                const sp = new URLSearchParams(window.location.search);
                if (sp.get('new') === 'true' || sp.get('new') === '1' || sessionStorage.getItem('strategy_studio_force_new') === 'true') {
                    isForceNew = true;
                    sessionStorage.removeItem('strategy_studio_force_new');
                    if (window.history?.replaceState) window.history.replaceState({}, '', window.location.pathname);
                }
            }
        } catch (_) {}

        if (isForceNew) {
            clearStudioSession();
            setCurrentDraft(null);
            setCurrentStrategy(null);
            setResults(null);
            setRoundTrips([]);
            setExecutedParams(null);
            setChatInput('');
            setIsBacktestPanelOpen(false);
            setGeneratingStrategy(false);
            setAdvisorLoading(false);
            setSimulationLoading(false);
            setMessages([]);

            const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
                ? crypto.randomUUID()
                : 'sess_' + Math.random().toString(36).substring(2, 9);
            setCurrentSessionId(newId);

            const yest = new Date(), sixtyAgo = new Date();
            yest.setDate(yest.getDate() - 1);
            sixtyAgo.setDate(sixtyAgo.getDate() - 61);
            setFromDate(sixtyAgo.toISOString().split('T')[0]);
            setToDate(yest.toISOString().split('T')[0]);
            return;
        }

        // 1. Check if strategy was selected from My Bots dashboard or Predefined Strategies
        let incomingStrategy = null;
        try {
            if (typeof window !== 'undefined') {
                const saved = sessionStorage.getItem('active_selected_strategy');
                if (saved) {
                    incomingStrategy = JSON.parse(saved);
                    sessionStorage.removeItem('active_selected_strategy');
                }
            }
        } catch (_) { }

        if (incomingStrategy) {
            clearStudioSession();
            setCurrentDraft(null);
            setResults(null);
            setRoundTrips([]);
            setExecutedParams(null);
            setChatInput('');
            setIsBacktestPanelOpen(false);
            setGeneratingStrategy(false);
            setAdvisorLoading(false);
            setSimulationLoading(false);

            const strat = incomingStrategy.config || incomingStrategy.blueprint || incomingStrategy;
            setCurrentStrategy(strat);
            syncToolbarFromStrategy(strat);
            const name = incomingStrategy.strategy_name || incomingStrategy.name || 'AI Strategy';
            const sym = normalizeSymbol(incomingStrategy.symbol || incomingStrategy.stock_name) || 'BTCUSD';
            const tf = normalizeInterval(incomingStrategy.timeframe || incomingStrategy.interval) || '15min';
            const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
                ? crypto.randomUUID()
                : 'sess_' + Math.random().toString(36).substring(2, 9);
            setCurrentSessionId(newId);
            const initialMessages = [
                {
                    role: 'ai',
                    text: `Loaded quantitative strategy **"${name}"** on **${sym} (${tf})**.\n\n` +
                        (incomingStrategy.trade_reasoning?.rationale ? `> **Rationale:** ${incomingStrategy.trade_reasoning.rationale}\n\n` : '') +
                        `Parameters and indicator rules have been calibrated. You can ask me to refine any parameters, or click **"Run Backtest"** to simulate historical performance.`
                }
            ];
            setMessages(initialMessages);
            saveStudioSession({
                sessionId: newId,
                messages: initialMessages,
                currentDraft: null,
                currentStrategy: strat,
                results: null,
                roundTrips: [],
                executedParams: null,
                symbol: sym,
                interval: tf
            });
            return;
        }

        // 2. Try restoring existing ongoing Bot conversation and parameters from localStorage
        const cachedSession = loadStudioSession();
        if (cachedSession && cachedSession.sessionId) {
            setCurrentSessionId(cachedSession.sessionId);
            if (Array.isArray(cachedSession.messages) && cachedSession.messages.length > 0) {
                setMessages(cachedSession.messages.map((m) => ({ ...m, fromHistory: true })));
            }
            const cs = cachedSession;
            if (cs.currentDraft) setCurrentDraft(cs.currentDraft);
            if (cs.currentStrategy) setCurrentStrategy(cs.currentStrategy);
            if (cs.results) setResults(cs.results);
            if (Array.isArray(cs.roundTrips)) setRoundTrips(cs.roundTrips);
            if (cs.executedParams) setExecutedParams(cs.executedParams);
            if (cs.symbol) setSymbol(cs.symbol);
            if (cs.interval) setInterval(cs.interval);
            if (cs.capital) setCapital(cs.capital);
            if (cs.quantity) setQuantity(cs.quantity);
            if (cs.marketMode) setMarketMode(cs.marketMode);
            if (cs.fromDate) setFromDate(cs.fromDate);
            if (cs.toDate) setToDate(cs.toDate);
        } else {
            const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
                ? crypto.randomUUID()
                : 'sess_' + Math.random().toString(36).substring(2, 9);
            setCurrentSessionId(newId);

            // Default 60-day window ending yesterday
            const yest = new Date(), sixtyAgo = new Date();
            yest.setDate(yest.getDate() - 1);
            sixtyAgo.setDate(sixtyAgo.getDate() - 61);
            setFromDate(sixtyAgo.toISOString().split('T')[0]);
            setToDate(yest.toISOString().split('T')[0]);
        }
    }, [syncToolbarFromStrategy, setCurrentSessionId]);

    // Automatically persist Bot chat session to localStorage whenever state updates
    useEffect(() => {
        if (!currentSessionId) return;
        saveStudioSession({
            sessionId: currentSessionId,
            messages,
            currentDraft,
            currentStrategy,
            results,
            roundTrips,
            executedParams,
            symbol,
            interval,
            fromDate,
            toDate,
            capital,
            quantity,
            marketMode
        });
    }, [
        currentSessionId, messages, currentDraft, currentStrategy, results,
        roundTrips, executedParams, symbol, interval, fromDate, toDate, capital, quantity, marketMode
    ]);
}
