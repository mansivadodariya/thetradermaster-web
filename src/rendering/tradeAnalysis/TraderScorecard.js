'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from './TraderScorecard.module.scss';


const CheckCircleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const AlertTriangleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const LightbulbIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </svg>
);

/**
 * 4-Axis Responsive SVG Radar Chart
 */
function CategoryRadarChart({ data }) {
    const { t } = useLanguage();
    // Categories in fixed clockwise order: Top, Right, Bottom, Left
    const size = 300;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 100;

    // Mapping of 4 axes:
    // Index 0 (Top, -90 deg): Profitability
    // Index 1 (Right, 0 deg): Risk Management
    // Index 2 (Bottom, 90 deg): Consistency
    // Index 3 (Left, 180 deg): Discipline
    const categories = [
        { key: 'Profitability', label: t('tradeAnalysis.profitability', 'Profitability'), angle: -Math.PI / 2 },
        { key: 'Risk Management', label: t('tradeAnalysis.riskManagement', 'Risk Management'), angle: 0 },
        { key: 'Consistency', label: t('tradeAnalysis.consistency', 'Consistency'), angle: Math.PI / 2 },
        { key: 'Discipline', label: t('tradeAnalysis.discipline', 'Discipline'), angle: Math.PI }
    ];

    const getScore = (key) => {
        const item = (data || []).find((d) => (d.category || '').toLowerCase() === key.toLowerCase());
        const raw = item ? Number(item.score ?? 75) : 75;
        return Math.min(100, Math.max(10, raw));
    };

    const radarPoints = categories.map((cat) => {
        const score = getScore(cat.key);
        const r = (score / 100) * radius;
        return {
            x: cx + r * Math.cos(cat.angle),
            y: cy + r * Math.sin(cat.angle),
            score,
            label: cat.label
        };
    });

    const polygonPointsStr = radarPoints.map((p) => `${p.x},${p.y}`).join(' ');

    // Concentric grid diamonds (25%, 50%, 75%, 100%)
    const gridLevels = [0.25, 0.5, 0.75, 1.0];

    return (
        <div className={styles.radarChartContainer}>
            <svg viewBox={`0 0 ${size} ${size}`} className={styles.radarSvg}>
                <defs>
                    <radialGradient id="scorecardRadarGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#18C98B" stopOpacity="0.45" />
                        <stop offset="70%" stopColor="#10B981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
                    </radialGradient>
                    <linearGradient id="radarStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Concentric Background Grid Diamonds */}
                {gridLevels.map((lvl) => {
                    const r = lvl * radius;
                    const pts = [
                        `${cx},${cy - r}`,
                        `${cx + r},${cy}`,
                        `${cx},${cy + r}`,
                        `${cx - r},${cy}`
                    ].join(' ');
                    return (
                        <polygon
                            key={lvl}
                            points={pts}
                            className={styles.radarGridPolygon}
                        />
                    );
                })}

                {/* Axis Crosshairs */}
                <line x1={cx} y1={cy - radius} x2={cx} y2={cy + radius} className={styles.radarAxisLine} />
                <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy} className={styles.radarAxisLine} />

                {/* Active Score Polygon with Emerald Fill & Glow */}
                <polygon
                    points={polygonPointsStr}
                    fill="url(#scorecardRadarGlow)"
                    stroke="url(#radarStrokeGrad)"
                    strokeWidth="2.5"
                    filter="url(#glowEffect)"
                    className={styles.scorePolygon}
                />

                {/* Vertex Dots */}
                {radarPoints.map((p, idx) => (
                    <g key={idx}>
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            className={styles.vertexDotOuter}
                        />
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="3"
                            className={styles.vertexDotInner}
                        />
                    </g>
                ))}

                {/* Labels at outer perimeter */}
                <text x={cx} y={cy - radius - 12} textAnchor="middle" className={styles.radarLabel}>
                    {t('tradeAnalysis.profitability', 'Profitability')}
                </text>
                <text x={cx + radius + 10} y={cy + 4} textAnchor="start" className={styles.radarLabel}>
                    {t('tradeAnalysis.riskManagement', 'Risk Management')}
                </text>
                <text x={cx} y={cy + radius + 18} textAnchor="middle" className={styles.radarLabel}>
                    {t('tradeAnalysis.consistency', 'Consistency')}
                </text>
                <text x={cx - radius - 10} y={cy + 4} textAnchor="end" className={styles.radarLabel}>
                    {t('tradeAnalysis.discipline', 'Discipline')}
                </text>
            </svg>
        </div>
    );
}

/**
 * Circular Glowing Score Donut Gauge
 */
function OverallScoreGauge({ score = 78.5, grade = 'B+', tier = 'ADVANCED', description }) {
    const radius = 80;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const clampedScore = Math.min(100, Math.max(0, Number(score) || 0));
    const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

    return (
        <div className={styles.overallGaugeWrapper}>
            <div className={styles.gaugeSvgContainer}>
                <svg viewBox="0 0 200 200" className={styles.gaugeSvg}>
                    <defs>
                        <linearGradient id="gaugeEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#34D399" />
                            <stop offset="50%" stopColor="#18C98B" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Background Track */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke="rgba(24, 201, 139, 0.12)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    {/* Progress Arc */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke="url(#gaugeEmeraldGrad)"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                        transform="rotate(-90 100 100)"
                        filter="url(#gaugeGlow)"
                        className={styles.gaugeProgressArc}
                    />
                </svg>

                {/* Inner Content inside circle */}
                <div className={styles.gaugeInnerContent}>
                    <span className={styles.gradeDisplay}>{grade}</span>
                    <span className={styles.scoreDisplay}>
                        <strong>{typeof score === 'number' ? (Number.isInteger(score) ? score : score.toFixed(1)) : score}</strong>
                        <span className={styles.scoreDenom}>/100</span>
                    </span>
                    <span className={styles.tierDisplay}>{tier}</span>
                </div>
            </div>

            <p className={styles.gaugeDescription}>
                {description || 'Your overall trading grade across all four categories.'}
            </p>
        </div>
    );
}

/**
 * Main Trader Scorecard Component
 */
export default function TraderScorecard({
    scorecardData,
    fileName = 'Client History - MEX Atlantic -Foex.csv',
    totalTrades = 32,
    onDeleteStatement
}) {
    const { t } = useLanguage();

    // Normalize scorecard object from prop
    const scorecard = useMemo(() => {
        if (!scorecardData) return null;

        const sc = scorecardData.scorecard || scorecardData;

        return {
            overall_score: sc.overall_score ?? 78.5,
            grade: sc.grade ?? 'B+',
            tier: sc.tier ?? 'ADVANCED',
            description: sc.description || 'Your overall trading grade across all four categories.',
            profitability: sc.profitability || {
                score: 84.5,
                label: 'Profitability',
                grade: 'A-',
                highlights: [
                    'Solid Profit Factor of 4.60',
                    'Favorable Payoff Ratio of 1.31:1',
                    'Positive trade expectancy of +$16.96 per execution',
                    'Net positive return across executions'
                ],
                penalties: []
            },
            risk_management: sc.risk_management || {
                score: 65,
                label: 'Risk Management',
                grade: 'B-',
                highlights: [
                    'Consistent position sizing across executions',
                    'Worst loss kept well within standard loss parameters'
                ],
                penalties: [
                    'Outlier loss concentration: Top losses account for large portion of drawdowns'
                ]
            },
            consistency: sc.consistency || {
                score: 84.2,
                label: 'Consistency',
                grade: 'A-',
                highlights: [
                    'Two-way profitability across BUY and SELL positions',
                    'High session consistency across trading days'
                ],
                penalties: [
                    'Directional win-rate divergence'
                ]
            },
            discipline: sc.discipline || {
                score: 84,
                label: 'Discipline',
                grade: 'A-',
                highlights: [
                    'Zero revenge trading re-entries detected post-loss',
                    'Controlled trade frequency and execution pacing'
                ],
                penalties: [
                    'FOMO / News chasing: impulsive entries detected',
                    'High late-entry rate after cutoff or late session'
                ]
            },
            radar_data: Array.isArray(sc.radar_data) && sc.radar_data.length > 0
                ? sc.radar_data
                : [
                    { category: 'Profitability', score: sc.profitability?.score ?? 84.5, fullMark: 100 },
                    { category: 'Risk Management', score: sc.risk_management?.score ?? 65, fullMark: 100 },
                    { category: 'Consistency', score: sc.consistency?.score ?? 84.2, fullMark: 100 },
                    { category: 'Discipline', score: sc.discipline?.score ?? 84, fullMark: 100 }
                ],
            actionable_level_up_tips: Array.isArray(sc.actionable_level_up_tips) && sc.actionable_level_up_tips.length > 0
                ? sc.actionable_level_up_tips
                : [
                    'Enforce strict per-trade risk ceilings to eliminate outlier losses.',
                    'Cease new executions after optimal session window to prevent late-session volatility leakage.'
                ]
        };
    }, [scorecardData]);

    if (!scorecard) return null;

    const categoriesList = [
        scorecard.profitability,
        scorecard.risk_management,
        scorecard.consistency,
        scorecard.discipline
    ].filter(Boolean);

    return (
        <div className={styles.scorecardContainer}>
            {/* 1. Header Banner & Tags */}
            <div className={styles.scorecardHeroHeader}>
                <div className={styles.headerTitleRow}>
                    <div className={styles.titleInfo}>
                        <div className={styles.badgePill}>{t('tradeAnalysis.scorecardBadge', 'SCORECARD')}</div>
                        <h2>{t('tradeAnalysis.scorecardTitle', 'Trader Scorecard')}</h2>
                        <p>
                            {t('tradeAnalysis.scorecardDesc', 'A single grade for your trading — built from your profitability, risk control, consistency, and discipline. See exactly what is working and what to fix.')}
                        </p>
                    </div>
                </div>

                <div className={styles.headerStatsPills}>
                    <div className={styles.statPill}>
                        <span className={styles.statPillLabel}>{t('tradeAnalysis.overall', 'OVERALL')}</span>
                        <span className={styles.statPillValue}>
                            {typeof scorecard.overall_score === 'number'
                                ? (Number.isInteger(scorecard.overall_score) ? scorecard.overall_score : scorecard.overall_score.toFixed(1))
                                : scorecard.overall_score}
                            /100
                        </span>
                    </div>
                    <div className={styles.statPill}>
                        <span className={styles.statPillLabel}>{t('tradeAnalysis.grade', 'GRADE')}</span>
                        <span className={styles.statPillValue}>{scorecard.grade}</span>
                    </div>
                    <div className={styles.statPill}>
                        <span className={styles.statPillLabel}>{t('tradeAnalysis.trades', 'TRADES')}</span>
                        <span className={styles.statPillValue}>{totalTrades}</span>
                    </div>
                </div>
            </div>


            {/* 4. Top Two-Column Cards (Overall Gauge + Radar Chart) */}
            <div className={styles.scorecardTopGrid}>
                {/* Left Card: Overall Score */}
                <div className={styles.gaugeCard}>
                    <OverallScoreGauge
                        score={scorecard.overall_score}
                        grade={scorecard.grade}
                        tier={scorecard.tier}
                        description={scorecard.description}
                    />
                </div>

                {/* Right Card: Category Overview Radar */}
                <div className={styles.radarCard}>
                    <div className={styles.cardHeader}>
                        <h3>{t('tradeAnalysis.categoryOverview', 'Category Overview')}</h3>
                    </div>
                    <CategoryRadarChart data={scorecard.radar_data} />
                </div>
            </div>

            {/* 5. Four Category Breakdown Cards */}
            <div className={styles.categoriesGrid}>
                {categoriesList.map((cat, idx) => {
                    const score = Number(cat.score ?? 75);
                    const highlights = Array.isArray(cat.highlights) ? cat.highlights : [];
                    const penalties = Array.isArray(cat.penalties) ? cat.penalties : [];

                    return (
                        <motion.div
                            key={cat.label || idx}
                            className={styles.categoryCard}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: idx * 0.08 }}
                        >
                            {/* Top Card Row */}
                            <div className={styles.catCardTop}>
                                <div className={styles.catTitleCol}>
                                    <h4>{cat.label}</h4>
                                    <div className={styles.catScoreRow}>
                                        <span className={styles.catScoreVal}>
                                            {typeof cat.score === 'number' ? (Number.isInteger(cat.score) ? cat.score : cat.score.toFixed(1)) : cat.score}
                                        </span>
                                        <span className={styles.catScoreDenom}>/100</span>
                                    </div>
                                </div>
                                <span className={styles.catGradeBadge}>{cat.grade || 'A-'}</span>
                            </div>

                            {/* Score Progress Bar */}
                            <div className={styles.progressBarTrack}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                                />
                            </div>

                            {/* Highlights List */}
                            {highlights.length > 0 && (
                                <div className={styles.sectionBlock}>
                                    <span className={styles.blockLabelGreen}>{t('tradeAnalysis.highlights', 'Highlights')}</span>
                                    <ul className={styles.itemsList}>
                                        {highlights.map((h, hIdx) => (
                                            <li key={hIdx} className={styles.highlightItem}>
                                                <CheckCircleIcon />
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Penalties List */}
                            {penalties.length > 0 && (
                                <div className={styles.sectionBlock}>
                                    <span className={styles.blockLabelAmber}>{t('tradeAnalysis.penaltiesRisks', 'Penalties & Risks')}</span>
                                    <ul className={styles.itemsList}>
                                        {penalties.map((p, pIdx) => (
                                            <li key={pIdx} className={styles.penaltyItem}>
                                                <AlertTriangleIcon />
                                                <span>{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* 6. Actionable Level-Up Tips Section */}
            {scorecard.actionable_level_up_tips && scorecard.actionable_level_up_tips.length > 0 && (
                <div className={styles.tipsSectionCard}>
                    <div className={styles.tipsHeader}>
                        <div className={styles.tipsIconCircle}>
                            <LightbulbIcon />
                        </div>
                        <div>
                            <h3>{t('tradeAnalysis.levelUpTips', 'Actionable Level-Up Tips')}</h3>
                            <p>{t('tradeAnalysis.levelUpTipsDesc', 'Concrete steps to raise your trader grade and eliminate volatility leakage')}</p>
                        </div>
                    </div>

                    <div className={styles.tipsList}>
                        {scorecard.actionable_level_up_tips.map((tip, tIdx) => (
                            <div key={tIdx} className={styles.tipCardItem}>
                                <div className={styles.tipNumberBadge}>{tIdx + 1}</div>
                                <p className={styles.tipText}>{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
