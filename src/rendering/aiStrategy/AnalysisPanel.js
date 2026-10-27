'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './aiStrategy.module.scss';
import { useLanguage } from '@/context/LanguageContext';
import { getScoreColor } from '@/icons/analysisIcons';
import { AnalysisSkeleton, AnalysisErrorState } from './components/AnalysisSkeleton';
import TechnicalScoreSection from './components/TechnicalScoreSection';
import TrendSection from './components/TrendSection';
import MomentumSection from './components/MomentumSection';
import StructureSection from './components/StructureSection';
import AiIntelligenceSummarySection from './components/AiIntelligenceSummarySection';

export default function AnalysisPanel({ symbol, strategyId, activeAnalysis, onAnalysisLoaded }) {
    const { language, t } = useLanguage();
    const [analysis, setAnalysis] = useState(activeAnalysis || null);
    const [loading, setLoading] = useState(!activeAnalysis);
    const [error, setError] = useState(null);
    const activeReqRef = useRef(0);

    // Fetch analysis data from REST endpoint with multi-tier fallback
    const fetchAnalysisData = async () => {
        if (!symbol) return;
        const reqId = ++activeReqRef.current;
        setLoading(true);
        setError(null);

        const cleanSymbol = symbol.replace('/', '').toUpperCase();
        const langParam = language || 'en';
        const queryParams = new URLSearchParams({ symbol: cleanSymbol, lang: langParam });
        if (strategyId) queryParams.set('strategy_id', strategyId);

        const getBackendBase = () => {
            if (process.env.NEXT_PUBLIC_BACKEND_URL) {
                return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, '');
            }
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WS_LIVE_URL;
            if (wsUrl) {
                try {
                    const parsed = new URL(wsUrl);
                    const proto = parsed.protocol === 'wss:' ? 'https:' : 'http:';
                    return `${proto}//${parsed.host}`;
                } catch (_) {}
            }
            return '';
        };

        const getWsHttpBase = () => {
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WS_LIVE_URL;
            if (wsUrl) {
                try {
                    const parsed = new URL(wsUrl);
                    const proto = parsed.protocol === 'wss:' ? 'https:' : 'http:';
                    return `${proto}//${parsed.host}`;
                } catch (_) {}
            }
            return null;
        };

        const primaryBase = getBackendBase();
        const fallbackBase = getWsHttpBase() || primaryBase;

        let data = null;
        let lastErr = null;

        // 1. Try Primary Backend
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(`${primaryBase}/api/v1/chart/analysis?${queryParams.toString()}`, {
                signal: controller.signal,
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': langParam,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                data = await res.json();
            }
        } catch (err) {
            console.warn('Primary analysis fetch failed, trying next source:', err);
            lastErr = err;
        }

        // 2. Try Internal Next.js API Route Proxy (avoids any browser network blocks)
        if (!data || !data.success) {
            try {
                const res = await fetch(`/api/v1/chart/analysis?${queryParams.toString()}`);
                if (res.ok) {
                    data = await res.json();
                }
            } catch (err) {
                console.warn('Proxy analysis fetch failed:', err);
            }
        }

        // 3. Try Fallback Public API
        if (!data || !data.success) {
            try {
                const res = await fetch(`${fallbackBase}/api/v1/chart/analysis?${queryParams.toString()}`, {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': langParam,
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                if (res.ok) {
                    data = await res.json();
                }
            } catch (err) {
                console.error('Fallback analysis fetch failed:', err);
                lastErr = err;
            }
        }

        // Only update state if this is still the active request
        if (reqId !== activeReqRef.current) return;

        if (data && (data.success || data.analysis)) {
            const analysisResult = data.analysis || data;
            setAnalysis(analysisResult);
            if (onAnalysisLoaded) {
                onAnalysisLoaded(analysisResult);
            }
        } else {
            setError(lastErr ? lastErr.message : 'Analysis fetch unsuccessful');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAnalysisData();
    }, [symbol, strategyId, language]);

    if (loading && !analysis) {
        return <AnalysisSkeleton />;
    }

    if (error && !analysis) {
        return <AnalysisErrorState symbol={symbol} onRetry={fetchAnalysisData} />;
    }

    if (!analysis) {
        return <AnalysisSkeleton />;
    }

    const {
        technical_score = {},
        ai_summary = {},
        evidence = {},
        levels = {},
        trend_indicators = {},
        momentum_indicators = {},
        pivot_points = {},
        trend_analysis = {},
        momentum = {},
    } = analysis;

    const scoreColor = getScoreColor(technical_score.label);

    return (
        <div className={styles.analysisPanel}>
            {/* 1. MASTER TECHNICAL SCORE (Speedometer + Overview Pillars) */}
            <TechnicalScoreSection
                technicalScore={technical_score}
            />

            {/* 2. TREND SECTION (Trend Speedometer + All SMA/EMA Data + Trend Evidence Together) */}
            <TrendSection
                trendIndicators={trend_indicators}
                trendAnalysis={trend_analysis}
                evidence={evidence.trend}
                trendScore={technical_score?.breakdown?.trend?.score || 25}
                maxScore={technical_score?.breakdown?.trend?.max || 25}
            />

            {/* 3. MOMENTUM SECTION (Visual Sliders + All Momentum Indicators + Momentum Evidence Together) */}
            <MomentumSection
                momentumIndicators={momentum_indicators}
                momentumAnalysis={momentum}
                evidence={evidence.momentum}
                momentumScore={technical_score?.breakdown?.momentum?.score || 25}
                maxScore={technical_score?.breakdown?.momentum?.max || 25}
            />

            {/* 4. MARKET STRUCTURE SECTION (Support/Resistance levels, Highs/Lows, Pivot Points) */}
            <StructureSection
                levels={levels}
                pivotPoints={pivot_points}
                evidence={evidence.structure}
                structureScore={technical_score?.breakdown?.structure?.score || 25}
                maxScore={technical_score?.breakdown?.structure?.max || 25}
            />

            {/* 5. AI INTELLIGENCE SUMMARY & CONFLUENCE */}
            <AiIntelligenceSummarySection
                aiSummary={ai_summary}
                evidence={evidence}
                technicalScore={technical_score}
                scoreColor={scoreColor}
                t={t}
            />
        </div>
    );
}
