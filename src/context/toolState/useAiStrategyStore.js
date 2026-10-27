'use client';

import { useState, useCallback, useEffect } from 'react';
import { MOCK_LIVE_DATA, MOCK_STRATEGY_SIGNAL, MOCK_SCANNER_DATA } from '@/rendering/aiStrategy/strategyUtils';

const STRAT_KEYS = {
    SYMBOL: 'chronosx_aistrat_symbol',
    STRAT_ID: 'chronosx_aistrat_id',
    TIMEFRAME: 'chronosx_aistrat_tf',
    STRAT_SYMBOL: 'chronosx_aistrat_strat_symbol',
    ANALYSIS: 'chronosx_aistrat_analysis'
};

export function useCreateAiStrategyStore() {
    const [selectedSymbol, setSelectedSymbolState] = useState('XAU/USD');
    const [selectedSymbolPriceInfo, setSelectedSymbolPriceInfo] = useState(null);
    const [selectedStrategyId, setSelectedStrategyIdState] = useState('');
    const [activeAnalysis, setActiveAnalysis] = useState(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const [globalTimeframe, setGlobalTimeframeState] = useState('1h');
    const [selectedStrategySymbol, setSelectedStrategySymbolState] = useState('XAUUSD');
    const [activeSignals, setActiveSignals] = useState({});
    const [strategyAnalysis, setStrategyAnalysisState] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    // Rehydrate persisted strategy state on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const sym = localStorage.getItem(STRAT_KEYS.SYMBOL);
            if (sym) setSelectedSymbolState(sym);

            const stratId = localStorage.getItem(STRAT_KEYS.STRAT_ID);
            if (stratId) setSelectedStrategyIdState(stratId);

            const tf = localStorage.getItem(STRAT_KEYS.TIMEFRAME);
            if (tf) setGlobalTimeframeState(tf);

            const stratSym = localStorage.getItem(STRAT_KEYS.STRAT_SYMBOL);
            if (stratSym) setSelectedStrategySymbolState(stratSym);

            const savedAnalysis = localStorage.getItem(STRAT_KEYS.ANALYSIS);
            if (savedAnalysis) {
                const parsed = JSON.parse(savedAnalysis);
                if (parsed) setStrategyAnalysisState(parsed);
            }
        } catch (err) {
            console.warn('Could not rehydrate AI strategy from localStorage:', err);
        }
    }, []);

    const setSelectedSymbol = useCallback((sym) => {
        setSelectedSymbolState(sym);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STRAT_KEYS.SYMBOL, sym);
            } catch (e) {}
        }
    }, []);

    const setSelectedStrategyId = useCallback((id) => {
        setSelectedStrategyIdState(id);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STRAT_KEYS.STRAT_ID, id);
            } catch (e) {}
        }
    }, []);

    const setGlobalTimeframe = useCallback((tf) => {
        setGlobalTimeframeState(tf);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STRAT_KEYS.TIMEFRAME, tf);
            } catch (e) {}
        }
    }, []);

    const setSelectedStrategySymbol = useCallback((sym) => {
        setSelectedStrategySymbolState(sym);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STRAT_KEYS.STRAT_SYMBOL, sym);
            } catch (e) {}
        }
    }, []);

    const setStrategyAnalysis = useCallback((analysis) => {
        setStrategyAnalysisState(analysis);
        if (typeof window !== 'undefined') {
            try {
                if (analysis) {
                    localStorage.setItem(STRAT_KEYS.ANALYSIS, JSON.stringify(analysis));
                } else {
                    localStorage.removeItem(STRAT_KEYS.ANALYSIS);
                }
            } catch (e) {}
        }
    }, []);

    const [logs, setLogs] = useState([
        { id: 'init', time: new Date().toLocaleTimeString(), text: 'Terminal initialized. Booting streams for 6 pairs...', isSystem: true }
    ]);

    const [liveData, setLiveData] = useState(MOCK_LIVE_DATA);
    const [scannerData, setScannerData] = useState(MOCK_SCANNER_DATA);
    const [scannerLoading, setScannerLoading] = useState(false);
    const [strategySignal, setStrategySignal] = useState(MOCK_STRATEGY_SIGNAL);

    const addLog = useCallback((message, isSystem = false) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => {
            const nextLogs = [
                ...prev,
                { id: Math.random().toString(), time: timestamp, text: message, isSystem }
            ];
            if (nextLogs.length > 80) {
                return nextLogs.slice(nextLogs.length - 80);
            }
            return nextLogs;
        });
    }, []);

    const clearLogs = useCallback(() => {
        setLogs([{ id: 'clear', time: new Date().toLocaleTimeString(), text: 'Log cleared.', isSystem: true }]);
    }, []);

    const handleHourlyRefresh = useCallback(() => {
        setRefreshCounter(prev => prev + 1);
        addLog('Triggering automatic hourly refresh at HH:01:00...', true);
    }, [addLog]);

    return {
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
    };
}
