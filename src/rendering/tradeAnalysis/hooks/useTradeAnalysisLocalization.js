'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translateResponseText } from '@/lib/translateService';
import { matchDynamicTradeAnalysisText, TRADE_ANALYSIS_DICTIONARY } from '../utils/tradeAnalysisTranslations';

// Global in-memory cache across tab switches
const dynamicTextCache = new Map();

/**
 * Custom hook to localize all dynamic AI response strings in Trade Analysis
 * Automatically translates arrays and nested insight objects when site language !== 'en'.
 */
export function useTradeAnalysisLocalization({
    quickAnalysis = {},
    timeInsights = {},
    entryAnalysis = null,
} = {}) {
    const { language = 'en' } = useLanguage();
    const [cacheVersion, setCacheVersion] = useState(0);
    const inFlightRequests = useRef(new Set());

    // Synchronous translator for a single string
    const translateText = useCallback(
        (text) => {
            if (!text || typeof text !== 'string') return text;
            const trimmed = text.trim();
            if (!trimmed || language === 'en') return trimmed;

            const cacheKey = `${language}:${trimmed}`;
            if (dynamicTextCache.has(cacheKey)) {
                return dynamicTextCache.get(cacheKey);
            }

            // Check pattern matcher & dictionary
            const patternMatch = matchDynamicTradeAnalysisText(trimmed, language);
            if (patternMatch) {
                dynamicTextCache.set(cacheKey, patternMatch);
                return patternMatch;
            }

            // Queue async translation if not already in flight
            if (!inFlightRequests.current.has(cacheKey)) {
                inFlightRequests.current.add(cacheKey);
                translateResponseText(trimmed, language)
                    .then((translated) => {
                        if (translated && translated !== trimmed) {
                            dynamicTextCache.set(cacheKey, translated);
                            setCacheVersion((v) => v + 1);
                        }
                    })
                    .catch((err) => {
                        console.warn('Translation failed for trade analysis text:', err);
                    })
                    .finally(() => {
                        inFlightRequests.current.delete(cacheKey);
                    });
            }

            return trimmed;
        },
        [language]
    );

    // Eagerly pre-translate all dynamic text fields on language change
    useEffect(() => {
        if (!language || language === 'en') return;

        const textsToTranslate = [];

        // 1. quickAnalysis
        if (Array.isArray(quickAnalysis?.good)) {
            textsToTranslate.push(...quickAnalysis.good);
        }
        if (Array.isArray(quickAnalysis?.needs_attention)) {
            textsToTranslate.push(...quickAnalysis.needs_attention);
        }
        if (quickAnalysis?.overall_explanation) {
            textsToTranslate.push(quickAnalysis.overall_explanation);
        }
        if (quickAnalysis?.key_takeaway) {
            textsToTranslate.push(quickAnalysis.key_takeaway);
        }

        // 2. timeInsights
        if (timeInsights?.fact_loss_distribution) {
            textsToTranslate.push(timeInsights.fact_loss_distribution);
        }
        if (timeInsights?.peak_frequency_time) {
            textsToTranslate.push(timeInsights.peak_frequency_time);
        }
        if (timeInsights?.cutoff_recommendation) {
            textsToTranslate.push(timeInsights.cutoff_recommendation);
        }

        // 3. entryAnalysis
        if (entryAnalysis) {
            if (entryAnalysis.best_setup_condition) textsToTranslate.push(entryAnalysis.best_setup_condition);
            if (entryAnalysis.assessment) textsToTranslate.push(entryAnalysis.assessment);
            if (entryAnalysis.volatility_performance) textsToTranslate.push(entryAnalysis.volatility_performance);
            if (entryAnalysis.news_event_summary) textsToTranslate.push(entryAnalysis.news_event_summary);
            if (Array.isArray(entryAnalysis.entry_strengths)) textsToTranslate.push(...entryAnalysis.entry_strengths);
            if (Array.isArray(entryAnalysis.entry_risks)) textsToTranslate.push(...entryAnalysis.entry_risks);
        }

        // Queue all texts
        let needsUpdate = false;
        textsToTranslate.forEach((txt) => {
            if (!txt || typeof txt !== 'string') return;
            const trimmed = txt.trim();
            const cacheKey = `${language}:${trimmed}`;
            if (!dynamicTextCache.has(cacheKey)) {
                const match = matchDynamicTradeAnalysisText(trimmed, language);
                if (match) {
                    dynamicTextCache.set(cacheKey, match);
                    needsUpdate = true;
                } else if (!inFlightRequests.current.has(cacheKey)) {
                    inFlightRequests.current.add(cacheKey);
                    translateResponseText(trimmed, language)
                        .then((translated) => {
                            if (translated && translated !== trimmed) {
                                dynamicTextCache.set(cacheKey, translated);
                                setCacheVersion((v) => v + 1);
                            }
                        })
                        .catch(() => {})
                        .finally(() => {
                            inFlightRequests.current.delete(cacheKey);
                        });
                }
            }
        });

        if (needsUpdate) {
            setCacheVersion((v) => v + 1);
        }
    }, [language, quickAnalysis, timeInsights, entryAnalysis]);

    // Localized quickAnalysis object
    const localizedQuickAnalysis = useMemo(() => {
        if (!quickAnalysis || language === 'en') return quickAnalysis;

        return {
            ...quickAnalysis,
            good: Array.isArray(quickAnalysis.good)
                ? quickAnalysis.good.map(translateText)
                : quickAnalysis.good,
            needs_attention: Array.isArray(quickAnalysis.needs_attention)
                ? quickAnalysis.needs_attention.map(translateText)
                : quickAnalysis.needs_attention,
            overall_explanation: quickAnalysis.overall_explanation
                ? translateText(quickAnalysis.overall_explanation)
                : quickAnalysis.overall_explanation,
            key_takeaway: quickAnalysis.key_takeaway
                ? translateText(quickAnalysis.key_takeaway)
                : quickAnalysis.key_takeaway,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quickAnalysis, language, translateText, cacheVersion]);

    // Localized timeInsights object
    const localizedTimeInsights = useMemo(() => {
        if (!timeInsights || language === 'en') return timeInsights;

        return {
            ...timeInsights,
            fact_loss_distribution: timeInsights.fact_loss_distribution
                ? translateText(timeInsights.fact_loss_distribution)
                : timeInsights.fact_loss_distribution,
            peak_frequency_time: timeInsights.peak_frequency_time
                ? translateText(timeInsights.peak_frequency_time)
                : timeInsights.peak_frequency_time,
            cutoff_recommendation: timeInsights.cutoff_recommendation
                ? translateText(timeInsights.cutoff_recommendation)
                : timeInsights.cutoff_recommendation,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeInsights, language, translateText, cacheVersion]);

    // Localized entryAnalysis object
    const localizedEntryAnalysis = useMemo(() => {
        if (!entryAnalysis || language === 'en') return entryAnalysis;

        return {
            ...entryAnalysis,
            best_setup_condition: entryAnalysis.best_setup_condition
                ? translateText(entryAnalysis.best_setup_condition)
                : entryAnalysis.best_setup_condition,
            assessment: entryAnalysis.assessment
                ? translateText(entryAnalysis.assessment)
                : entryAnalysis.assessment,
            volatility_performance: entryAnalysis.volatility_performance
                ? translateText(entryAnalysis.volatility_performance)
                : entryAnalysis.volatility_performance,
            news_event_summary: entryAnalysis.news_event_summary
                ? translateText(entryAnalysis.news_event_summary)
                : entryAnalysis.news_event_summary,
            entry_strengths: Array.isArray(entryAnalysis.entry_strengths)
                ? entryAnalysis.entry_strengths.map(translateText)
                : entryAnalysis.entry_strengths,
            entry_risks: Array.isArray(entryAnalysis.entry_risks)
                ? entryAnalysis.entry_risks.map(translateText)
                : entryAnalysis.entry_risks,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entryAnalysis, language, translateText, cacheVersion]);

    return {
        translateText,
        localizedQuickAnalysis,
        localizedTimeInsights,
        localizedEntryAnalysis,
    };
}

export default useTradeAnalysisLocalization;
