'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from '../aiSnapDashboard.module.scss';
import AnalysisSummaryHeader from './AnalysisSummaryHeader';
import TechnicalScoreGauge from './TechnicalScoreGauge';
import BullBearBanner from './BullBearBanner';
import TradeSignalSetupCard from './TradeSignalSetupCard';
import LiveIndicatorsGrid from './LiveIndicatorsGrid';
import PatternsKeyLevelsCard from './PatternsKeyLevelsCard';
import RiskFlagsStack from './RiskFlagsStack';
import IndicatorPivotTabs from './IndicatorPivotTabs';
import TimeframeSelectionModal from './TimeframeSelectionModal';
import { useTradeSnapExport } from '../hooks/useTradeSnapExport';

export default function AiSnapDashboard({ analysisData, rawData }) {
    const dashboardRef = useRef(null);
    const { exportToPdf, isExporting } = useTradeSnapExport();

    // Support both new AI Snap schema (analysis) and legacy normalizeTradeRecord schema
    const rawPayload = analysisData || rawData;
    const analysis = analysisData?.analysis || analysisData || rawData?.analysis || rawData;

    const [selectedTimeframe, setSelectedTimeframe] = useState(
        analysis?.timeframe || analysis?.Timeframe || analysis?.data?.timeframe || '15M'
    );
    const [timeframeModalOpen, setTimeframeModalOpen] = useState(false);

    // Auto-trigger condition specified in Section 2:
    // When timeframe_detected === false or timeframe is null, open popup modal automatically
    useEffect(() => {
        if (!rawPayload && !analysis) return;
        const isDetected = rawPayload?.timeframe_detected ?? rawPayload?.data?.timeframe_detected ?? true;
        const currentTf = analysis?.timeframe || analysis?.Timeframe || analysis?.data?.timeframe;
        if (isDetected === false || !currentTf || currentTf === 'null') {
            setTimeframeModalOpen(true);
        }
    }, [rawPayload, analysis]);

    if (!analysisData && !rawData) return null;

    const symbol = analysis.symbol || analysis.Symbol || rawPayload.symbol || analysis.data?.pair || 'XAUUSD';
    const timeframe = selectedTimeframe || rawPayload.timeframe || 'M15';
    const currentPrice = analysis.current_price ?? analysis.Current_price ?? analysis.analysis_results?.price ?? rawPayload.current_price ?? rawPayload.Current_price ?? '—';
    const volume = analysis.analysis_results?.volume || rawPayload.volume || '—';
    const change = analysis.analysis_results?.change || rawPayload.change || '0.00%';
    const isChartValid = analysis.data?.is_valid_chart ?? rawPayload.is_valid_chart ?? true;

    const technicalScore = analysis.technical_score || {
        total: parseInt(analysis.confidence || rawPayload.confidence || 75, 10),
        max: 100,
        label: (analysis.trade_call || rawPayload.trade_call || 'BUY').toUpperCase().includes('BUY') ? 'STRONG BULLISH' : 'STRONG BEARISH',
        confidence: analysis.confidence || rawPayload.confidence || '75%'
    };

    const marketAssessment = analysis.market_assessment || {
        verdict: (analysis.trade_call || rawPayload.trade_call || 'BUY').toUpperCase().includes('BUY') ? 'Bullish' : 'Bearish',
        confidence: analysis.confidence || rawPayload.confidence || '75%',
        momentum: 'Neutral',
        strength: 'Moderate'
    };

    const tradeDecision = analysis.trade_decision || {
        action: analysis.trade_call || rawPayload.trade_call || 'BUY',
        signal_type: analysis.trade_call || rawPayload.trade_call || 'BUY',
        conviction: analysis.confidence || rawPayload.confidence || '75%',
        entry_zone: {
            entry_price: analysis.entry || rawPayload.entry || '—',
            execution_type: 'Vision AI & Technical Confluence'
        },
        stop_loss: {
            price: analysis.stop_loss || rawPayload.stop_loss || '—',
            invalidation_reason: 'Structure protection level'
        },
        take_profit_targets: analysis.targets || rawPayload.targets || {
            tp1: '—',
            tp2: '—',
            tp3: '—'
        },
        risk_reward_ratio: analysis.risk_reward || rawPayload.risk_reward || '1:2',
        rationale: analysis.rationale || rawPayload.rationale || ''
    };

    const liveIndicators = analysis.live_indicators || rawPayload.live_indicators;
    
    const rawPatternsList = analysis.patterns_detected?.chart_patterns 
        || analysis.chart_patterns 
        || analysis.patterns 
        || rawPayload.chart_patterns 
        || rawPayload.patterns 
        || (analysis.pattern ? [{ name: analysis.pattern, confidence: parseInt(analysis.confidence || 65, 10) }] : [])
        || (rawPayload.pattern ? [{ name: rawPayload.pattern, confidence: parseInt(rawPayload.confidence || 65, 10) }] : []);

    const defaultPatterns = Array.isArray(rawPatternsList) && rawPatternsList.length > 0 
        ? rawPatternsList 
        : [
            {
                name: (analysis.trade_call || rawPayload.trade_call || 'BUY').toUpperCase().includes('BUY')
                    ? "Bull Flag / Accumulation Breakout"
                    : "Bearish Channel / Distribution Breakdown",
                confidence: parseInt(analysis.confidence || rawPayload.confidence || 65, 10)
            }
        ];

    const patternsDetected = {
        support_levels: (analysis.patterns_detected?.support_levels && analysis.patterns_detected.support_levels.length > 0)
            ? analysis.patterns_detected.support_levels
            : [(analysis.Support_price || rawPayload.Support_price || '4276.00')],
        resistance_levels: (analysis.patterns_detected?.resistance_levels && analysis.patterns_detected.resistance_levels.length > 0)
            ? analysis.patterns_detected.resistance_levels
            : [(analysis.Resistance_price || rawPayload.Resistance_price || '4286.00')],
        chart_patterns: defaultPatterns
    };

    const riskFlags = analysis.risk_flags || [];

    const trendIndicators = analysis.trend_indicators || rawPayload.trend_indicators;
    const momentumIndicators = analysis.momentum_indicators || rawPayload.momentum_indicators;
    const volatilityIndicators = analysis.volatility_indicators || rawPayload.volatility_indicators;
    const pivotPoints = analysis.pivot_points || rawPayload.pivot_points;

    const handleDownloadPdf = () => {
        exportToPdf(dashboardRef.current, symbol, timeframe);
    };

    return (
        <div className={styles.dashboardWrapper} ref={dashboardRef}>
            {/* Top Split Row: Section D (Summary) + Section A (Speedometer Technical Score Gauge) */}
            <div className={styles.topSplitRow}>
                <AnalysisSummaryHeader
                    symbol={symbol}
                    timeframe={timeframe}
                    currentPrice={currentPrice}
                    volume={volume}
                    change={change}
                    isChartValid={isChartValid}
                    onOpenTimeframeModal={() => setTimeframeModalOpen(true)}
                    onDownloadPdf={handleDownloadPdf}
                    isExporting={isExporting}
                />
                <TechnicalScoreGauge
                    technicalScore={technicalScore}
                    marketAssessment={marketAssessment}
                />
            </div>

            {/* Section B: Dynamic Animated Bull & Bear Running Hero Banner */}
            <BullBearBanner
                tradeDecision={tradeDecision}
                technicalScore={technicalScore}
                marketAssessment={marketAssessment}
            />

            {/* Section C: Actionable Buy / Sell Trade Signal Setup Card */}
            <TradeSignalSetupCard
                tradeDecision={tradeDecision}
            />

            {/* Section E: Market Assessment & Live Indicators */}
            <LiveIndicatorsGrid
                liveIndicators={liveIndicators}
                marketAssessment={marketAssessment}
            />

            {/* Section F: Patterns & Key Levels Card */}
            <PatternsKeyLevelsCard
                patternsDetected={patternsDetected}
            />

            {/* Section G: Risk Flags Warning Stack */}
            <RiskFlagsStack
                riskFlags={riskFlags}
            />

            {/* Section H: Multi-Indicator & Pivot Breakdown Accordion / Tabs */}
            <IndicatorPivotTabs
                trendIndicators={trendIndicators}
                momentumIndicators={momentumIndicators}
                volatilityIndicators={volatilityIndicators}
                pivotPoints={pivotPoints}
            />

            {/* Timeframe Selection Popup Modal (Triggered automatically when timeframe_detected === false) */}
            <TimeframeSelectionModal
                open={timeframeModalOpen}
                onClose={() => setTimeframeModalOpen(false)}
                onSelectTimeframe={(newTf) => setSelectedTimeframe(newTf)}
                timeframeOptions={rawPayload?.timeframe_options}
            />
        </div>
    );
}
