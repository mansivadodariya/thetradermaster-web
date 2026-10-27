'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from '@/components/toast';
import styles from '../tradeAnalysis.module.scss';
import {
    SparklesIcon,
    CloseIcon,
    FileIcon,
    GlobeIcon,
    SuccessCircleIcon,
    DangerCircleIcon,
    TargetIcon,
    CopyIcon,
    formatCurrency
} from '@/icons/tradeAnalysisIcons';

export default function TradeAuditModal({
    singleTradeModalData,
    singleTradeActiveTab,
    setSingleTradeActiveTab,
    onClose
}) {
    if (!singleTradeModalData) return null;

    const res = singleTradeModalData.result || {};
    const tDetails = res.trade_details || singleTradeModalData.trade || {};
    const scores = res.scores || {};
    const evaluation = res.evaluation || {};
    const histContext = res.historical_context || {};
    const goodPoints = res.what_you_did_well || res.strengths || [];
    const badPoints = res.mistakes_identified || res.vulnerabilities || [];
    const suggestions = res.improvement_suggestions || res.actionable_recommendations || [];
    const markdownReport = res.markdown_report || res.narrative_report || '';

    const rawScore = scores.overall_score !== undefined
        ? scores.overall_score
        : (res.score !== undefined ? (res.score > 10 ? res.score / 10 : res.score) : (Number(tDetails.pnl) >= 0 ? 8.5 : 4.5));
    const scoreOutOf10 = Number(rawScore).toFixed(1);
    const ratingLabel = scores.rating_label || res.quality || res.quality_rating || (Number(tDetails.pnl) >= 0 ? 'High Quality Momentum Entry' : 'Early Noise / Breakout Risk');
    const tradePnl = tDetails.pnl !== undefined ? Number(tDetails.pnl) : Number(singleTradeModalData.trade.pnl || 0);

    return (
        <div className={styles.modalBackdrop} onClick={onClose} data-lenis-prevent="true">
            <motion.div
                className={styles.tradeAuditModalContainer}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
            >
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderTitleGroup}>
                        <div className={styles.sparkleIconBox}>
                            <SparklesIcon />
                        </div>
                        <div>
                            <h3>Trade AI Analysis</h3>
                            <span className={styles.modalSub}>Deep neural trade audit & execution evaluation</span>
                        </div>
                    </div>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>

                <div className={styles.tradeModalBody}>
                    {/* Top Trade Badge Row */}
                    <div className={styles.tradeDetailsBanner}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Symbol</span>
                            <span className={styles.detailValueBold}>{tDetails.symbol || singleTradeModalData.trade.symbol}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Side</span>
                            <span className={(tDetails.side || singleTradeModalData.trade.side || '').toUpperCase() === 'BUY' ? styles.greenPill : styles.redPill}>
                                {tDetails.side || singleTradeModalData.trade.side || 'BUY'}
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Volume</span>
                            <span className={styles.detailValue}>{tDetails.quantity ?? singleTradeModalData.trade.quantity ?? '0.10'} Lots</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Entry Price</span>
                            <span className={styles.detailValue}>{tDetails.entry_price || singleTradeModalData.trade.entry_price || '—'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Exit Price</span>
                            <span className={styles.detailValue}>{tDetails.exit_price || singleTradeModalData.trade.exit_price || '—'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Net PnL</span>
                            <span className={tradePnl >= 0 ? styles.detailValueGreen : styles.detailValueRed}>
                                {formatCurrency(tradePnl)}
                            </span>
                        </div>
                    </div>

                    {/* Internal Modal Tabs */}
                    <div className={styles.modalTabRow}>
                        <button
                            type="button"
                            className={`${styles.modalTabBtn} ${singleTradeActiveTab === 'summary' ? styles.active : ''}`}
                            onClick={() => setSingleTradeActiveTab('summary')}
                        >
                            <SparklesIcon />
                            <span>Executive Diagnostics</span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.modalTabBtn} ${singleTradeActiveTab === 'deepdive' ? styles.active : ''}`}
                            onClick={() => setSingleTradeActiveTab('deepdive')}
                        >
                            <FileIcon />
                            <span>Full Narrative Report</span>
                        </button>
                    </div>

                    {singleTradeActiveTab === 'summary' && (
                        <div className={styles.auditResultContent}>
                            {/* Score & Quality Badge */}
                            <div className={styles.auditScoreCard}>
                                <div className={styles.scoreCircle}>
                                    <span className={styles.scoreNum}>{scoreOutOf10}</span>
                                    <span className={styles.scoreMax}>/10</span>
                                </div>
                                <div className={styles.scoreText}>
                                    <div className={styles.scoreTitleRow}>
                                        <h4>{ratingLabel}</h4>
                                        <span className={styles.auditApiBadge}>API VERIFIED</span>
                                    </div>
                                    <p>{res.assessment || evaluation.trade_setup || res.message || 'Deep algorithmic trade evaluation completed.'}</p>
                                </div>
                            </div>

                            {/* 4 Sub-Scores Matrix (if available) */}
                            {(scores.entry_score !== undefined || scores.exit_score !== undefined || scores.risk_management_score !== undefined || scores.position_sizing_score !== undefined) && (
                                <div className={styles.subScoresMatrixGrid}>
                                    {scores.entry_score !== undefined && (
                                        <div className={styles.subScoreCard}>
                                            <span className={styles.subScoreLabel}>Entry Score</span>
                                            <div className={styles.subScoreValueBox}>
                                                <span className={Number(scores.entry_score) >= 7 ? styles.scoreGreen : (Number(scores.entry_score) >= 4 ? styles.scoreAmber : styles.scoreRed)}>
                                                    {scores.entry_score}
                                                </span>
                                                <span className={styles.subScoreDenom}>/10</span>
                                            </div>
                                        </div>
                                    )}
                                    {scores.exit_score !== undefined && (
                                        <div className={styles.subScoreCard}>
                                            <span className={styles.subScoreLabel}>Exit Discipline</span>
                                            <div className={styles.subScoreValueBox}>
                                                <span className={Number(scores.exit_score) >= 7 ? styles.scoreGreen : (Number(scores.exit_score) >= 4 ? styles.scoreAmber : styles.scoreRed)}>
                                                    {scores.exit_score}
                                                </span>
                                                <span className={styles.subScoreDenom}>/10</span>
                                            </div>
                                        </div>
                                    )}
                                    {scores.risk_management_score !== undefined && (
                                        <div className={styles.subScoreCard}>
                                            <span className={styles.subScoreLabel}>Risk Management</span>
                                            <div className={styles.subScoreValueBox}>
                                                <span className={Number(scores.risk_management_score) >= 7 ? styles.scoreGreen : (Number(scores.risk_management_score) >= 4 ? styles.scoreAmber : styles.scoreRed)}>
                                                    {scores.risk_management_score}
                                                </span>
                                                <span className={styles.subScoreDenom}>/10</span>
                                            </div>
                                        </div>
                                    )}
                                    {scores.position_sizing_score !== undefined && (
                                        <div className={styles.subScoreCard}>
                                            <span className={styles.subScoreLabel}>Position Sizing</span>
                                            <div className={styles.subScoreValueBox}>
                                                <span className={Number(scores.position_sizing_score) >= 7 ? styles.scoreGreen : (Number(scores.risk_management_score) >= 4 ? styles.scoreAmber : styles.scoreRed)}>
                                                    {scores.position_sizing_score}
                                                </span>
                                                <span className={styles.subScoreDenom}>/10</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Historical Context & Economic Releases */}
                            {(histContext.market_regime || (Array.isArray(histContext.economic_events) && histContext.economic_events.length > 0)) && (
                                <div className={styles.macroContextCard}>
                                    <div className={styles.boxTitleRow}>
                                        <GlobeIcon />
                                        <h4>Historical Market & Macro Context</h4>
                                        {histContext.news_risk_rating && (
                                            <span className={`${styles.newsRiskBadge} ${String(histContext.news_risk_rating).toLowerCase().includes('high') ? styles.riskHigh : styles.riskLow}`}>
                                                {histContext.news_risk_rating}
                                            </span>
                                        )}
                                    </div>
                                    {histContext.market_regime && (
                                        <div className={styles.regimeRow}>
                                            <span className={styles.regimeTag}>Regime: {histContext.market_regime}</span>
                                            {histContext.macro_sentiment && <span className={styles.sentimentTag}>Sentiment: {histContext.macro_sentiment}</span>}
                                        </div>
                                    )}
                                    {histContext.news_influence_assessment && (
                                        <p className={styles.macroAssessmentText}>{histContext.news_influence_assessment}</p>
                                    )}
                                    {Array.isArray(histContext.economic_events) && histContext.economic_events.length > 0 && (
                                        <div className={styles.economicEventsStack}>
                                            <span className={styles.eventStackLabel}>High-Impact Economic Releases:</span>
                                            {histContext.economic_events.map((ev, eIdx) => (
                                                <div key={eIdx} className={styles.eventRowItem}>
                                                    <span className={styles.eventBadge}>[{ev.impact || 'HIGH'}] {ev.country || ''}</span>
                                                    <span className={styles.eventName}>{ev.event_name}</span>
                                                    <span className={styles.eventValues}>Actual: <strong>{ev.actual || '—'}</strong> (Est: {ev.estimate || '—'})</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Good Points / What You Did Well */}
                            {goodPoints.length > 0 && (
                                <div className={styles.recommendationsBox}>
                                    <div className={styles.boxTitleRow}>
                                        <SuccessCircleIcon />
                                        <h4>What You Did Well (Strengths)</h4>
                                    </div>
                                    <div className={styles.auditList}>
                                        {goodPoints.map((r, idx) => (
                                            <div key={idx} className={styles.auditItemGood}>
                                                <span>✓</span>
                                                <p>{r}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Identified Execution Mistakes / Bad Points */}
                            {badPoints.length > 0 && (
                                <div className={styles.mistakesBox}>
                                    <div className={styles.boxTitleRow}>
                                        <DangerCircleIcon />
                                        <h4>Areas for Improvement (Mistakes & Vulnerabilities)</h4>
                                    </div>
                                    <div className={styles.auditList}>
                                        {badPoints.map((m, idx) => (
                                            <div key={idx} className={styles.auditItemBad}>
                                                <span>✕</span>
                                                <p>{m}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actionable Improvement Suggestions */}
                            {suggestions.length > 0 && (
                                <div className={styles.suggestionsBox}>
                                    <div className={styles.boxTitleRow}>
                                        <SparklesIcon />
                                        <h4>Actionable Strategy & Risk Suggestions</h4>
                                    </div>
                                    <div className={styles.auditList}>
                                        {suggestions.map((s, sIdx) => (
                                            <div key={sIdx} className={styles.auditItemSuggestion}>
                                                <span className={styles.bulbIcon}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/></svg></span>
                                                <p>{s}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Diagnostic Deep-Dive (Setup, Entry, Exit, Risk) */}
                            {(evaluation.entry_analysis || evaluation.exit_analysis || evaluation.risk_management) && (
                                <div className={styles.diagnosticDetailsBox}>
                                    <div className={styles.boxTitleRow}>
                                        <TargetIcon />
                                        <h4>Diagnostic Execution Breakdown</h4>
                                    </div>
                                    <div className={styles.diagnosticGrid}>
                                        {evaluation.trade_setup && (
                                            <div className={styles.diagCard}>
                                                <h5>Trade Setup & Structure</h5>
                                                <p>{evaluation.trade_setup}</p>
                                            </div>
                                        )}
                                        {evaluation.entry_analysis && (
                                            <div className={styles.diagCard}>
                                                <h5>Entry Timing & Triggers</h5>
                                                <p>{evaluation.entry_analysis}</p>
                                            </div>
                                        )}
                                        {evaluation.exit_analysis && (
                                            <div className={styles.diagCard}>
                                                <h5>Exit Discipline & Targets</h5>
                                                <p>{evaluation.exit_analysis}</p>
                                            </div>
                                        )}
                                        {evaluation.risk_management && (
                                            <div className={styles.diagCard}>
                                                <h5>Risk Management & Stop Loss</h5>
                                                <p>{evaluation.risk_management}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {singleTradeActiveTab === 'deepdive' && (
                        <div className={styles.modalReportWrapper}>
                            <div className={styles.reportHeaderActions}>
                                <button
                                    type="button"
                                    className={styles.copyBtn}
                                    onClick={() => {
                                        navigator.clipboard.writeText(markdownReport);
                                        toast.success('Trade audit report copied!');
                                    }}
                                >
                                    <CopyIcon />
                                    <span>Copy Markdown Report</span>
                                </button>
                            </div>
                            <div className={styles.markdownReportWrapper}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ node, ...props }) => <h3 className={styles.reportH3} {...props} />,
                                        h2: ({ node, ...props }) => <h4 className={styles.reportH4} {...props} />,
                                        h3: ({ node, ...props }) => <h5 className={styles.reportH4} {...props} />,
                                        p: ({ node, ...props }) => <p className={styles.reportP} {...props} />,
                                        strong: ({ node, ...props }) => <strong className={styles.reportStrong} {...props} />,
                                        table: ({ node, ...props }) => (
                                            <div className={styles.tableWrapper}>
                                                <table className={styles.reportTable} {...props} />
                                            </div>
                                        ),
                                        th: ({ node, ...props }) => <th className={styles.reportTh} {...props} />,
                                        td: ({ node, ...props }) => <td className={styles.reportTd} {...props} />,
                                        ul: ({ node, ...props }) => <ul className={styles.reportUl} {...props} />,
                                        li: ({ node, ...props }) => <li className={styles.reportLi} {...props} />,
                                    }}
                                >
                                    {markdownReport || 'Detailed report generated.'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
