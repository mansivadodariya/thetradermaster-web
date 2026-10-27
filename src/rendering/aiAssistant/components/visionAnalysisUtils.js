import React from 'react';
import styles from '../aiAssistant.module.scss';
import {
    TrendIcon,
    StructureIcon,
    LevelsIcon,
    ZonesIcon,
    TargetIcon,
    VolatilityIcon,
    ClockIcon,
    SentimentIcon,
    CandlestickIcon,
    PatternsIcon,
} from '@/icons/visionIcons';

/**
 * Helper function to extract JSON object from backend text string
 * Handles strings with disclaimer headers, embedded JSON, and disclaimer footers.
 * @param {string|object} rawText
 * @returns {object|null}
 */
export function parseAnalysisReport(rawText) {
    if (!rawText) return null;
    if (typeof rawText === 'object') return rawText;
    try {
        if (typeof rawText === 'string') {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
    } catch (err) {
        console.error("Failed to parse chart report JSON:", err);
    }
    return null;
}

// Status Badge Component with theme styling
export function VisionBadge({ text, color = "amber" }) {
    if (!text) return null;
    const colorClass = 
        color === "green" ? styles.badgeGreen :
        color === "red" ? styles.badgeRed :
        color === "blue" ? styles.badgeBlue :
        color === "slate" ? styles.badgeSlate :
        styles.badgeAmber;

    return (
        <span className={`${styles.visionBadge} ${colorClass}`}>
            {text}
        </span>
    );
}

// 10 Collapsible Accordion Sections Configuration with pure SVG icons
export const ACCORDION_SECTIONS = [
    { key: "overall_trend", translationKey: "overallTrend", title: "Overall Trend", Icon: TrendIcon },
    { key: "market_structure", translationKey: "marketStructure", title: "Market Structure", Icon: StructureIcon },
    { key: "support_and_resistance", translationKey: "supportResistance", title: "Support & Resistance Levels", Icon: LevelsIcon },
    { key: "supply_and_demand_zones", translationKey: "supplyDemand", title: "Supply & Demand Zones", Icon: ZonesIcon },
    { key: "trader_actionable_zones", translationKey: "actionableZones", title: "Trader Actionable Zones", Icon: TargetIcon },
    { key: "volatility_and_price_behavior", translationKey: "volatilityBehavior", title: "Volatility & Price Behavior", Icon: VolatilityIcon },
    { key: "session_behavior", translationKey: "sessionBehavior", title: "Session Behavior", Icon: ClockIcon },
    { key: "market_mood", translationKey: "marketMood", title: "Market Mood", Icon: SentimentIcon },
    { key: "candlestick_behavior", translationKey: "candlestickBehavior", title: "Candlestick Behavior", Icon: CandlestickIcon },
    { key: "chart_patterns", translationKey: "chartPatterns", title: "Chart Patterns", Icon: PatternsIcon }
];
