'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useCreateTradeAnalysisStore } from './useTradeAnalysisStore';
import { useCreateAiAssistantStore } from './useAiAssistantStore';
import { useCreateTradeSnapStore } from './useTradeSnapStore';
import { useCreateAiStrategyStore } from './useAiStrategyStore';

const ToolStateContext = createContext(null);

export function ToolStateProvider({ children }) {
    const tradeAnalysis = useCreateTradeAnalysisStore();
    const aiAssistant = useCreateAiAssistantStore();
    const tradeSnap = useCreateTradeSnapStore();
    const aiStrategy = useCreateAiStrategyStore();

    const value = useMemo(() => ({
        tradeAnalysis,
        aiAssistant,
        tradeSnap,
        aiStrategy
    }), [tradeAnalysis, aiAssistant, tradeSnap, aiStrategy]);

    return (
        <ToolStateContext.Provider value={value}>
            {children}
        </ToolStateContext.Provider>
    );
}

export function useToolState() {
    const context = useContext(ToolStateContext);
    if (!context) {
        throw new Error('useToolState must be used within a ToolStateProvider');
    }
    return context;
}

export function useTradeAnalysisStore() {
    const context = useContext(ToolStateContext);
    if (!context) {
        throw new Error('useTradeAnalysisStore must be used within a ToolStateProvider');
    }
    return context.tradeAnalysis;
}

export function useAiAssistantStore() {
    const context = useContext(ToolStateContext);
    if (!context) {
        throw new Error('useAiAssistantStore must be used within a ToolStateProvider');
    }
    return context.aiAssistant;
}

export function useTradeSnapStore() {
    const context = useContext(ToolStateContext);
    if (!context) {
        throw new Error('useTradeSnapStore must be used within a ToolStateProvider');
    }
    return context.tradeSnap;
}

export function useAiStrategyStore() {
    const context = useContext(ToolStateContext);
    if (!context) {
        throw new Error('useAiStrategyStore must be used within a ToolStateProvider');
    }
    return context.aiStrategy;
}
