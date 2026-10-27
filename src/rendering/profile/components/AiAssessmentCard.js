'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../profile.module.scss';

/**
 * Parses the API response data from latest_analysis / analysis
 */
function parseAnalysisPayload(analysis) {
    if (!analysis) return null;

    // Handle nested object structure from backend (wrapped in data / latest_analysis / analysis)
    let raw = analysis;
    if (raw.data && typeof raw.data === 'object') {
        raw = raw.data;
    }
    if (raw.latest_analysis && typeof raw.latest_analysis === 'object') {
        raw = raw.latest_analysis;
    } else if (raw.analysis && typeof raw.analysis === 'object') {
        raw = raw.analysis;
    } else if (raw.assessment && typeof raw.assessment === 'object') {
        raw = raw.assessment;
    }

    if (typeof raw === 'string') {
        const paragraphs = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
        if (paragraphs.length === 0) return null;
        return {
            title: "TraderMaster's Assessment",
            personaTitle: null,
            executiveSummary: null,
            paragraphs,
            flaggedNote: null,
            strategy: null,
            riskFramework: null,
            strategySetup: null,
            strengths: [],
            blindspots: [],
            roadmap: []
        };
    }

    if (typeof raw !== 'object') return null;

    const TraderMaster = raw.tradermaster_assessment || raw.assessment_data || {};
    const text = TraderMaster.assessment_text ||
        TraderMaster.assessment ||
        raw.assessment_text ||
        raw.assessment ||
        raw.response ||
        raw.ai_response ||
        raw.analysis_text ||
        raw.content ||
        raw.text ||
        raw.message ||
        '';

    const paragraphs = text
        ? (typeof text === 'string' ? text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : Array.isArray(text) ? text : [])
        : (Array.isArray(raw.paragraphs) ? raw.paragraphs : []);

    const executiveSummary = raw.executive_summary || TraderMaster.executive_summary || raw.summary || null;

    const flaggedNote = TraderMaster.target_flag_note ||
        raw.flagged_note ||
        raw.target_flag_note ||
        (TraderMaster.ai_adjusted_monthly_target ? `AI-Adjusted Target: ${TraderMaster.ai_adjusted_monthly_target} monthly for sustainable compounding.` : null);

    const strategy = raw.suggested_strategy || raw.strategy || TraderMaster.suggested_strategy || null;
    const riskFramework = raw.risk_framework || raw.risk_management || TraderMaster.risk_framework || null;
    const strengths = Array.isArray(raw.strengths) ? raw.strengths : (Array.isArray(TraderMaster.strengths) ? TraderMaster.strengths : []);
    const blindspots = Array.isArray(raw.blindspots) ? raw.blindspots : (Array.isArray(TraderMaster.blindspots) ? TraderMaster.blindspots : []);
    const roadmap = Array.isArray(raw.roadmap_30_day) ? raw.roadmap_30_day : (Array.isArray(raw.roadmap) ? raw.roadmap : (Array.isArray(TraderMaster.roadmap) ? TraderMaster.roadmap : []));

    // If no text or structured content is found, return null so empty card doesn't show
    if (paragraphs.length === 0 && !executiveSummary && !strategy && !riskFramework && strengths.length === 0 && blindspots.length === 0 && roadmap.length === 0 && !flaggedNote) {
        return null;
    }

    return {
        title: raw.title || TraderMaster.title || "TraderMaster's Assessment",
        personaTitle: raw.persona_title || TraderMaster.persona_title || null,
        executiveSummary,
        paragraphs,
        flaggedNote,
        strategy,
        riskFramework,
        strategySetup: raw.strategy_setup || TraderMaster.strategy_setup || null,
        strengths,
        blindspots,
        roadmap
    };
}

export default function AiAssessmentCard({
    analysis,
    className = ''
}) {
    const { t } = useLanguage();
    const data = parseAnalysisPayload(analysis);
    if (!data) return null;

    const {
        title,
        personaTitle,
        executiveSummary,
        paragraphs,
        flaggedNote,
        strategy,
        riskFramework,
        strategySetup,
        strengths,
        blindspots,
        roadmap
    } = data;

    return (
        <div className={`${styles.aiAssessmentSection} ${className}`}>
            {/* Header with AI Sparkle Icon & Persona Badge */}
            <div className={styles.aiAssessmentHeader}>
                <div className={styles.aiAssessmentTitle}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00F2FE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="#00F2FE" />
                        <path d="M5 3v4" stroke="#00F2FE" strokeWidth="2"/>
                        <path d="M3 5h4" stroke="#00F2FE" strokeWidth="2"/>
                        <path d="M19 17v4" stroke="#00F2FE" strokeWidth="2"/>
                        <path d="M17 19h4" stroke="#00F2FE" strokeWidth="2"/>
                    </svg>
                    <div>
                        <h3>{title}</h3>
                        {personaTitle && (
                            <span className={styles.personaBadge}>{personaTitle}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Executive Summary */}
            {executiveSummary && (
                <div className={styles.executiveSummaryCard}>
                    <p>{executiveSummary}</p>
                </div>
            )}

            {/* Assessment Paragraphs */}
            {paragraphs.length > 0 && (
                <div className={styles.aiAssessmentBody}>
                    {paragraphs.map((para, index) => (
                        <p key={index}>{para}</p>
                    ))}
                </div>
            )}

            {/* Flagged Advisory Callout Box */}
            {flaggedNote && (
                <div className={styles.aiFlaggedAlertBox}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span>{flaggedNote}</span>
                </div>
            )}

            {/* Risk Management Framework */}
            {riskFramework && (
                <div className={styles.assessmentSubsection}>
                    <div className={styles.subsectionTitle}>
                        <span className={styles.accentDot} />
                        <h4>{t('profile.riskFramework', 'Risk Management Framework')}</h4>
                    </div>
                    <div className={styles.riskMetricsGrid4}>
                        {riskFramework.recommended_position_sizing && (
                            <div className={styles.riskMetricTile}>
                                <span className={styles.riskMetricLabel}>Position Sizing</span>
                                <span className={styles.riskMetricVal}>{riskFramework.recommended_position_sizing}</span>
                            </div>
                        )}
                        {riskFramework.max_daily_loss && (
                            <div className={styles.riskMetricTile}>
                                <span className={styles.riskMetricLabel}>Max Daily Loss</span>
                                <span className={styles.riskMetricVal} style={{ color: '#EF4444' }}>{riskFramework.max_daily_loss}</span>
                            </div>
                        )}
                        {riskFramework.recommended_risk_reward && (
                            <div className={styles.riskMetricTile}>
                                <span className={styles.riskMetricLabel}>Risk : Reward</span>
                                <span className={styles.riskMetricVal} style={{ color: '#18C98B' }}>{riskFramework.recommended_risk_reward}</span>
                            </div>
                        )}
                        {riskFramework.max_open_positions && (
                            <div className={styles.riskMetricTile}>
                                <span className={styles.riskMetricLabel}>Max Open Trades</span>
                                <span className={styles.riskMetricVal}>{riskFramework.max_open_positions}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Suggested Strategy Breakdown */}
            {strategy && (
                <div className={styles.assessmentSubsection}>
                    <div className={styles.subsectionTitle}>
                        <span className={styles.accentDot} />
                        <h4>Suggested Strategy: {strategy.strategy_title}</h4>
                    </div>

                    <div className={styles.strategyDetailsGrid}>
                        {Array.isArray(strategy.indicators_to_focus_on) && strategy.indicators_to_focus_on.length > 0 && (
                            <div className={styles.strategyDetailBox}>
                                <h5>Indicators & Confluence to Focus On:</h5>
                                <ul>
                                    {strategy.indicators_to_focus_on.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {Array.isArray(strategy.bot_configuration) && strategy.bot_configuration.length > 0 && (
                            <div className={styles.strategyDetailBox}>
                                <h5>TraderMaster Bot & Signal Configuration:</h5>
                                <ul>
                                    {strategy.bot_configuration.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {Array.isArray(strategy.lot_sizing_guidance) && strategy.lot_sizing_guidance.length > 0 && (
                            <div className={styles.strategyDetailBox}>
                                <h5>Lot Sizing & Exposure Guidance:</h5>
                                <ul>
                                    {strategy.lot_sizing_guidance.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {Array.isArray(strategy.session_timing) && strategy.session_timing.length > 0 && (
                            <div className={styles.strategyDetailBox}>
                                <h5>Session Timing & News Safeguards:</h5>
                                <ul>
                                    {strategy.session_timing.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Strengths & Blindspots */}
            {(strengths.length > 0 || blindspots.length > 0) && (
                <div className={styles.assessmentSubsection}>
                    <div className={styles.strengthsBlindspotsGrid}>
                        {strengths.length > 0 && (
                            <div className={styles.insightsCard}>
                                <div className={styles.insightsHead} style={{ color: '#18C98B' }}>
                                    <span>✓</span>
                                    <h5>Key Strengths</h5>
                                </div>
                                <ul>
                                    {strengths.map((s, idx) => (
                                        <li key={idx}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {blindspots.length > 0 && (
                            <div className={styles.insightsCard}>
                                <div className={styles.insightsHead} style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                    <h5>Potential Blindspots & Risks</h5>
                                </div>
                                <ul>
                                    {blindspots.map((b, idx) => (
                                        <li key={idx}>{b}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 30-Day Roadmap */}
            {roadmap.length > 0 && (
                <div className={styles.assessmentSubsection}>
                    <div className={styles.subsectionTitle}>
                        <span className={styles.accentDot} />
                        <h4>30-Day Execution Roadmap</h4>
                    </div>
                    <div className={styles.roadmapList}>
                        {roadmap.map((step, idx) => (
                            <div key={idx} className={styles.roadmapItem}>
                                <span className={styles.roadmapIndex}>0{idx + 1}</span>
                                <p>{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
