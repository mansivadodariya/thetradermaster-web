'use client';

import { useState, useCallback } from 'react';
import { toast } from '@/components/toast';
import { formatCurrency } from '@/icons/tradeAnalysisIcons';

export function useTradeAnalysisExport() {
    const [isExporting, setIsExporting] = useState(false);

    const exportToPdf = useCallback(async ({
        fileDetails,
        scorecardData,
        summary,
        trades,
        brokerMeta,
        quickAnalysis,
        timeInsights,
        entryAnalysis,
        dynamicReportMarkdown,
        netProfitVal,
        winRateVal,
        profitFactor,
        payoffRatio,
        largestWin,
        largestLoss,
        avgWinningTrade,
        avgLosingTrade,
        totalTradesCount,
        avgHoldingTime,
        reqBreakevenWinRate,
        avgProfitPerTrade
    }) => {
        if (isExporting) return;

        try {
            setIsExporting(true);
            const fileName = fileDetails?.name || 'Trading_Statement';
            const cleanName = fileName.replace(/[^A-Za-z0-9_-]/g, '_');
            const dateStr = new Date().toISOString().split('T')[0];
            toast('Generating institutional PDF report in clean white theme...');

            // Dynamically import html2pdf and logo helper
            const html2pdf = (await import('html2pdf.js')).default;
            const { getPdfLogoDataUrl } = await import('@/lib/pdfLogoHelper');
            const logoDataUrl = await getPdfLogoDataUrl(false);

            // Helper: parse markdown text into rich formatted HTML with clean tables & bold tags
            function formatMarkdownToHtml(markdown) {
                if (!markdown) return '';
                const lines = markdown.split('\n');
                const result = [];
                let inTable = false;
                let tableRows = [];

                const flushTable = () => {
                    if (!tableRows.length) return;
                    let html = '<table class="pdfTable" style="margin: 10px 0 14px 0; width: 100%;"><thead><tr>';
                    const headerCols = tableRows[0];
                    headerCols.forEach(col => {
                        html += `<th>${parseInline(col.trim())}</th>`;
                    });
                    html += '</tr></thead><tbody>';

                    for (let i = 1; i < tableRows.length; i++) {
                        html += '<tr>';
                        tableRows[i].forEach(col => {
                            html += `<td>${parseInline(col.trim())}</td>`;
                        });
                        html += '</tr>';
                    }
                    html += '</tbody></table>';
                    result.push(html);
                    tableRows = [];
                    inTable = false;
                };

                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i].trim();

                    // Table row: | col1 | col2 |
                    if (line.startsWith('|') && line.endsWith('|')) {
                        if (/^\|[\s-:]+(\|[\s-:]+)+\|$/.test(line)) {
                            continue; // Skip markdown separator line
                        }
                        const cols = line.slice(1, -1).split('|');
                        tableRows.push(cols);
                        inTable = true;
                        continue;
                    } else if (inTable) {
                        flushTable();
                    }

                    if (!line) {
                        result.push('<div style="height: 6px;"></div>');
                        continue;
                    }

                    // Headings (prevent page breaks immediately after headings)
                    if (line.startsWith('#### ')) {
                        result.push(`<h5 class="pdfBlock" style="font-size: 11px; font-weight: 800; color: #0F172A; margin: 8px 0 3px 0; text-transform: uppercase; page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid;">${parseInline(line.slice(5))}</h5>`);
                        continue;
                    }
                    if (line.startsWith('### ')) {
                        result.push(`<h4 class="pdfBlock" style="font-size: 12.5px; font-weight: 800; color: #0F172A; margin: 12px 0 5px 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 3px; page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid;">${parseInline(line.slice(4))}</h4>`);
                        continue;
                    }
                    if (line.startsWith('## ')) {
                        result.push(`<h3 class="pdfBlock" style="font-size: 13.5px; font-weight: 800; color: #0F172A; margin: 14px 0 6px 0; page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid;">${parseInline(line.slice(3))}</h3>`);
                        continue;
                    }
                    if (line.startsWith('#')) {
                        const cleanTitle = line.replace(/^#+\s*/, '');
                        result.push(`<h4 class="pdfBlock" style="font-size: 12px; font-weight: 800; color: #059669; margin: 8px 0 3px 0; text-transform: uppercase; page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid;">${parseInline(cleanTitle)}</h4>`);
                        continue;
                    }

                    // Bullet points
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                        result.push(`<div class="pdfBlock" style="display: flex; gap: 6px; margin-bottom: 4px; font-size: 11px; line-height: 1.5; color: #334155; page-break-inside: avoid; break-inside: avoid;"><span style="color: #10B981; font-weight: 800; flex-shrink: 0;">•</span><span>${parseInline(line.slice(2))}</span></div>`);
                        continue;
                    }

                    // Normal paragraph
                    result.push(`<p class="pdfBlock" style="font-size: 11px; line-height: 1.55; color: #334155; margin: 3px 0; page-break-inside: avoid; break-inside: avoid;">${parseInline(line)}</p>`);
                }

                if (inTable) {
                    flushTable();
                }

                return result.join('\n');
            }

            function parseInline(text) {
                if (!text) return '';
                return text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/__(.*?)__/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code style="background: #F1F5F9; padding: 1px 4px; border-radius: 3px; font-size: 10px;">$1</code>');
            }

            // Helper: generate 4-Axis Diamond Radar Chart SVG for PDF
            function generateRadarSvg(radarData) {
                const vbWidth = 300;
                const vbHeight = 175;
                const cx = 150;
                const cy = 88;
                const radius = 45;

                const categories = [
                    { key: 'Profitability', label: 'Profitability', angle: -Math.PI / 2 },
                    { key: 'Risk Management', label: 'Risk Management', angle: 0 },
                    { key: 'Consistency', label: 'Consistency', angle: Math.PI / 2 },
                    { key: 'Discipline', label: 'Discipline', angle: Math.PI }
                ];

                const getScore = (key) => {
                    const item = (radarData || []).find((d) => (d.category || '').toLowerCase().includes(key.toLowerCase().split(' ')[0]));
                    const raw = item ? Number(item.score ?? 75) : 75;
                    return Math.min(100, Math.max(15, raw));
                };

                const points = categories.map((cat) => {
                    const score = getScore(cat.key);
                    const r = (score / 100) * radius;
                    return {
                        x: Number((cx + r * Math.cos(cat.angle)).toFixed(1)),
                        y: Number((cy + r * Math.sin(cat.angle)).toFixed(1)),
                        score,
                        label: cat.label
                    };
                });

                const polygonPointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');
                const gridLevels = [0.33, 0.66, 1.0];

                const gridPolygons = gridLevels.map((lvl) => {
                    const r = lvl * radius;
                    const pts = [
                        `${cx},${cy - r}`,
                        `${cx + r},${cy}`,
                        `${cx},${cy + r}`,
                        `${cx - r},${cy}`
                    ].join(' ');
                    return `<polygon points="${pts}" fill="none" stroke="#E2E8F0" stroke-width="1" />`;
                }).join('');

                const vertexCircles = points.map((p) => {
                    return `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#10B981" stroke="#FFFFFF" stroke-width="1.5" />`;
                }).join('');

                return `
                    <svg viewBox="0 0 ${vbWidth} ${vbHeight}" width="100%" height="${vbHeight}" style="display: block; max-width: ${vbWidth}px; margin: 0 auto; overflow: visible;">
                        <defs>
                            <radialGradient id="pdfRadarGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#10B981" stop-opacity="0.35" />
                                <stop offset="100%" stop-color="#059669" stop-opacity="0.12" />
                            </radialGradient>
                        </defs>
                        ${gridPolygons}
                        <line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy + radius}" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="2,2" />
                        <line x1="${cx - radius}" y1="${cy}" x2="${cx + radius}" y2="${cy}" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="2,2" />
                        <polygon points="${polygonPointsStr}" fill="url(#pdfRadarGlow)" stroke="#10B981" stroke-width="2" />
                        ${vertexCircles}
                        <text x="${cx}" y="${cy - radius - 8}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#475569">Profitability</text>
                        <text x="${cx + radius + 7}" y="${cy + 3.5}" text-anchor="start" font-size="9.5" font-weight="700" fill="#475569">Risk Management</text>
                        <text x="${cx}" y="${cy + radius + 15}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#475569">Consistency</text>
                        <text x="${cx - radius - 7}" y="${cy + 3.5}" text-anchor="end" font-size="9.5" font-weight="700" fill="#475569">Discipline</text>
                    </svg>
                `;
            }

            // Helper: generate Circular Score Gauge SVG for PDF
            function generateScoreGaugeSvg(scoreVal, gradeStr, tierStr) {
                const size = 140;
                const radius = 48;
                const strokeWidth = 9;
                const circumference = 2 * Math.PI * radius;
                const clampedScore = Math.min(100, Math.max(0, Number(scoreVal) || 0));
                const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

                return `
                    <div style="position: relative; width: ${size}px; height: ${size}px; margin: 0 auto;">
                        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="display: block;">
                            <defs>
                                <linearGradient id="pdfGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#34D399" />
                                    <stop offset="100%" stop-color="#059669" />
                                </linearGradient>
                            </defs>
                            <circle cx="70" cy="70" r="${radius}" stroke="#E2E8F0" stroke-width="${strokeWidth}" fill="none" />
                            <circle cx="70" cy="70" r="${radius}" stroke="url(#pdfGaugeGrad)" stroke-width="${strokeWidth}" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" fill="none" transform="rotate(-90 70 70)" />
                        </svg>
                        <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                            <span style="font-size: 22px; font-weight: 900; color: #059669; line-height: 1;">${gradeStr}</span>
                            <span style="font-size: 11px; font-weight: 800; color: #0F172A; margin-top: 3px;">
                                ${typeof scoreVal === 'number' ? (Number.isInteger(scoreVal) ? scoreVal : scoreVal.toFixed(1)) : scoreVal}
                                <span style="font-size: 9px; color: #64748B;">/100</span>
                            </span>
                            <span style="font-size: 8px; font-weight: 800; color: #059669; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 2px;">${tierStr}</span>
                        </div>
                    </div>
                `;
            }

            // Build a clean, self-contained, institutional white-theme HTML document for export
            const exportContainer = document.createElement('div');
            exportContainer.className = 'tradeAnalysisPdfReport';
            exportContainer.style.cssText = `
                width: 700px;
                max-width: 700px;
                background-color: #FFFFFF;
                color: #0F172A;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                padding: 16px 20px;
                box-sizing: border-box;
                margin: 0 auto;
            `;

            const pf = Number(profitFactor) || 1.0;
            const wr = Number(winRateVal) || 0;
            const score = scorecardData?.overall_score ?? 80;
            const grade = scorecardData?.grade ?? 'A-';
            const tier = scorecardData?.tier ?? 'MASTER';

            const radarData = scorecardData?.radar_data || [
                { category: 'Profitability', score: scorecardData?.profitability?.score ?? 84 },
                { category: 'Risk Management', score: scorecardData?.risk_management?.score ?? 82 },
                { category: 'Consistency', score: scorecardData?.consistency?.score ?? 80 },
                { category: 'Discipline', score: scorecardData?.discipline?.score ?? 84 }
            ];

            exportContainer.innerHTML = `
                <style>
                    .tradeAnalysisPdfReport * {
                        box-sizing: border-box;
                        color: #0F172A;
                    }
                    .pdfHeaderBox {
                        border-bottom: 2px solid #E2E8F0;
                        padding-bottom: 12px;
                        margin-bottom: 14px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .pdfTitle {
                        font-size: 18px;
                        font-weight: 800;
                        color: #0F172A;
                        margin: 0 0 3px 0;
                        letter-spacing: -0.2px;
                    }
                    .pdfSub {
                        font-size: 11px;
                        color: #64748B;
                        margin: 0;
                    }
                    .pdfBadge {
                        background: #F0FDF4;
                        border: 1px solid #10B981;
                        color: #047857;
                        font-size: 10px;
                        font-weight: 700;
                        padding: 4px 8px;
                        border-radius: 4px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        flex-shrink: 0;
                    }
                    .pdfSectionCard {
                        background: #FFFFFF;
                        border: 1px solid #E2E8F0;
                        border-radius: 8px;
                        padding: 14px 16px;
                        margin-bottom: 14px;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .pdfSectionTitle {
                        font-size: 12px;
                        font-weight: 800;
                        color: #0F172A;
                        margin: 0 0 10px 0;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border-bottom: 1px solid #F1F5F9;
                        padding-bottom: 5px;
                    }
                    .pdfScoreHero {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background: #F8FAFC;
                        border: 1px solid #E2E8F0;
                        border-radius: 6px;
                        padding: 10px 14px;
                        margin-bottom: 12px;
                    }
                    .pdfGrid2 {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                    }
                    .pdfGrid4 {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 8px;
                    }
                    .pdfStatBox {
                        background: #F8FAFC;
                        border: 1px solid #E2E8F0;
                        border-radius: 6px;
                        padding: 8px 10px;
                    }
                    .pdfStatLabel {
                        font-size: 9px;
                        font-weight: 700;
                        color: #64748B;
                        text-transform: uppercase;
                        margin-bottom: 3px;
                    }
                    .pdfStatVal {
                        font-size: 15px;
                        font-weight: 800;
                        color: #0F172A;
                    }
                    .pdfPositive { color: #059669; }
                    .pdfNegative { color: #DC2626; }
                    .pdfPillarCard {
                        background: #F8FAFC;
                        border: 1px solid #E2E8F0;
                        border-radius: 6px;
                        padding: 10px 12px;
                    }
                    .pdfPillarHeader {
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px;
                        font-weight: 800;
                        margin-bottom: 6px;
                    }
                    .pdfPillarList {
                        margin: 0;
                        padding-left: 14px;
                        font-size: 10.5px;
                        color: #334155;
                        line-height: 1.45;
                    }
                    .pdfTable {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 10.5px;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .pdfTable th {
                        background: #F1F5F9;
                        color: #475569;
                        font-weight: 700;
                        text-align: left;
                        padding: 6px 8px;
                        border: 1px solid #CBD5E1;
                    }
                    .pdfTable td {
                        padding: 5px 8px;
                        border: 1px solid #E2E8F0;
                        color: #1E293B;
                    }
                    .pdfNarrativeText {
                        font-size: 11px;
                        color: #334155;
                        line-height: 1.55;
                    }
                    .tradeAnalysisPdfReport p,
                    .tradeAnalysisPdfReport li,
                    .tradeAnalysisPdfReport tr,
                    .tradeAnalysisPdfReport h1,
                    .tradeAnalysisPdfReport h2,
                    .tradeAnalysisPdfReport h3,
                    .tradeAnalysisPdfReport h4,
                    .tradeAnalysisPdfReport h5,
                    .tradeAnalysisPdfReport h6,
                    .tradeAnalysisPdfReport .pdfBlock,
                    .tradeAnalysisPdfReport .pdfPillarCard,
                    .tradeAnalysisPdfReport .pdfStatBox {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                </style>

                <!-- HEADER -->
                <div class="pdfHeaderBox" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 14px; width: 100%; box-sizing: border-box; page-break-inside: avoid; break-inside: avoid;">
                    <div>
                        <div style="margin-bottom: 6px;">
                            <img src="${logoDataUrl || '/assets/logo/darklogo.png'}" alt="ChronosX" style="height: 28px; width: auto; max-width: 150px; object-fit: contain; display: block;" />
                        </div>
                        <div class="pdfTitle" style="font-size: 15px; font-weight: 800; color: #0F172A; margin: 0 0 3px 0;">Statement Audit & Behavioral Quant Report</div>
                        <div class="pdfSub" style="font-size: 10px; color: #64748B; margin: 0;">Statement: <strong>${fileName}</strong> • Uploaded: ${dateStr} • Trades: <strong>${totalTradesCount}</strong></div>
                    </div>
                    <div style="text-align: right;">
                        <div class="pdfBadge">STATEMENT AUDIT</div>
                        <div style="font-size: 8.5px; color: #94A3B8; margin-top: 4px; font-weight: 600;">INSTITUTIONAL QUANT REPORT</div>
                    </div>
                </div>

                <!-- TAB 1: TRADER SCORECARD & BEHAVIORAL QUANT PROFILE -->
                <div class="pdfSectionCard">
                    <div class="pdfSectionTitle">1. Trader Scorecard & Behavioral Quant Profile</div>
                    
                    <!-- 2-GRAPH HERO ROW (MATCHING UI SCORECARD) -->
                    <div style="display: grid; grid-template-columns: 1fr 1.35fr; gap: 14px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 14px; margin-bottom: 12px; align-items: center; page-break-inside: avoid; break-inside: avoid;">
                        <!-- Graph 1: Circular Overall Score Donut Gauge -->
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                            <div style="font-size: 10.5px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 6px;">Overall Trading Grade</div>
                            ${generateScoreGaugeSvg(score, grade, tier)}
                            <div style="font-size: 9.5px; color: #64748B; margin-top: 6px;">Your overall trading grade across all four categories.</div>
                        </div>

                        <!-- Graph 2: 4-Axis Category Radar Chart -->
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                            <div style="font-size: 10.5px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 4px;">Category Overview (Quant Radar)</div>
                            ${generateRadarSvg(radarData)}
                        </div>
                    </div>

                    <!-- 4 PILLARS (WITH HIGHLIGHTS & PENALTIES) -->
                    <div class="pdfGrid2">
                        ${[
                            { key: 'profitability', data: scorecardData?.profitability, fallbackScore: 84.5, fallbackGrade: 'A-', label: 'Profitability' },
                            { key: 'risk_management', data: scorecardData?.risk_management, fallbackScore: 65, fallbackGrade: 'B-', label: 'Risk Management' },
                            { key: 'consistency', data: scorecardData?.consistency, fallbackScore: 84.2, fallbackGrade: 'A-', label: 'Consistency' },
                            { key: 'discipline', data: scorecardData?.discipline, fallbackScore: 84, fallbackGrade: 'A-', label: 'Discipline' }
                        ].map(({ data: pData, fallbackScore, fallbackGrade, label }) => {
                            const pScore = pData?.score ?? fallbackScore;
                            const pGrade = pData?.grade ?? fallbackGrade;
                            const highlights = Array.isArray(pData?.highlights) ? pData.highlights : [];
                            const penalties = Array.isArray(pData?.penalties) ? pData.penalties : [];

                            return `
                                <div class="pdfPillarCard">
                                    <div class="pdfPillarHeader">
                                        <span>${label.toUpperCase()} (${typeof pScore === 'number' ? (Number.isInteger(pScore) ? pScore : pScore.toFixed(1)) : pScore}/100)</span>
                                        <span class="pdfPositive">GRADE ${pGrade}</span>
                                    </div>
                                    <div style="height: 3px; background: #E2E8F0; border-radius: 2px; margin-bottom: 8px; overflow: hidden;">
                                        <div style="height: 100%; width: ${Math.min(100, Math.max(5, Number(pScore) || 75))}%; background: #10B981;"></div>
                                    </div>
                                    ${highlights.length > 0 ? `
                                        <div style="font-size: 8.5px; font-weight: 800; color: #059669; text-transform: uppercase; margin-bottom: 2px;">Highlights</div>
                                        <ul class="pdfPillarList" style="margin-bottom: ${penalties.length > 0 ? '6px' : '0'};">
                                            ${highlights.map(h => `<li>${parseInline(h)}</li>`).join('')}
                                        </ul>
                                    ` : ''}
                                    ${penalties.length > 0 ? `
                                        <div style="font-size: 8.5px; font-weight: 800; color: #D97706; text-transform: uppercase; margin-top: 4px; margin-bottom: 2px;">Penalties & Risks</div>
                                        <ul class="pdfPillarList" style="color: #9A3412;">
                                            ${penalties.map(p => `<li style="color: #B45309;">${parseInline(p)}</li>`).join('')}
                                        </ul>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- ACTIONABLE LEVEL-UP TIPS -->
                    ${Array.isArray(scorecardData?.actionable_level_up_tips) && scorecardData.actionable_level_up_tips.length > 0 ? `
                    <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; padding: 10px 12px; margin-top: 12px; page-break-inside: avoid; break-inside: avoid;">
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                            <span style="font-size: 11px; font-weight: 800; color: #065F46; text-transform: uppercase;">Actionable Level-Up Tips</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            ${scorecardData.actionable_level_up_tips.map((tip, idx) => `
                                <div style="display: flex; gap: 8px; align-items: flex-start; font-size: 10.5px; color: #064E3B; line-height: 1.45;">
                                    <span style="background: #10B981; color: #FFFFFF; font-size: 9px; font-weight: 800; border-radius: 50%; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;">${idx + 1}</span>
                                    <span>${parseInline(tip)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- TAB 2: OVERVIEW & EXECUTION ANALYTICS -->
                <div class="pdfSectionCard" style="page-break-before: always; break-before: page; margin-top: 14px;">
                    <div class="pdfSectionTitle">2. Overview & Execution Analytics</div>
                    
                    <div style="font-size: 10.5px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 6px;">Core Quantitative Metrics</div>
                    <div class="pdfGrid4" style="margin-bottom: 12px;">
                        <div class="pdfStatBox">
                            <div class="pdfStatLabel">Net P&L</div>
                            <div class="pdfStatVal ${netProfitVal >= 0 ? 'pdfPositive' : 'pdfNegative'}">${formatCurrency(netProfitVal)}</div>
                        </div>
                        <div class="pdfStatBox">
                            <div class="pdfStatLabel">Win Rate</div>
                            <div class="pdfStatVal pdfPositive">${winRateVal.toFixed(1)}%</div>
                        </div>
                        <div class="pdfStatBox">
                            <div class="pdfStatLabel">Profit Factor</div>
                            <div class="pdfStatVal">${pf.toFixed(2)}</div>
                        </div>
                        <div class="pdfStatBox">
                            <div class="pdfStatLabel">Payoff Ratio</div>
                            <div class="pdfStatVal">${payoffRatio}</div>
                        </div>
                        <div class="pdfStatBox">
                            <div class="pdfStatLabel">Largest Win</div>
                            <div class="pdfStatVal pdfPositive">${formatCurrency(largestWin)}</div>
                        </div>
                        <div class="pdfStatBox">
                            <div class="pdfStatLabel">Largest Loss</div>
                            <div class="pdfStatVal pdfNegative">${formatCurrency(largestLoss)}</div>
                        </div>
                        <div class="pdfStatBox">
                            <div class="pdfStatLabel">Avg Win</div>
                            <div class="pdfStatVal pdfPositive">${formatCurrency(avgWinningTrade)}</div>
                        </div>
                        <div class="pdfStatBox">
                            <div class="pdfStatLabel">Avg Loss</div>
                            <div class="pdfStatVal pdfNegative">${formatCurrency(avgLosingTrade)}</div>
                        </div>
                    </div>

                    <!-- AI Entry & Execution Quality Analysis Card -->
                    ${entryAnalysis ? `
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 11px; font-weight: 800; color: #0F172A; text-transform: uppercase;">AI Entry & Execution Quality</span>
                            ${entryAnalysis.quality_rating ? `<span style="background: #ECFDF5; border: 1px solid #10B981; color: #047857; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 3px;">${entryAnalysis.quality_rating} EXECUTION</span>` : ''}
                        </div>
                        <div class="pdfGrid4" style="margin-bottom: 8px;">
                            <div class="pdfStatBox">
                                <div class="pdfStatLabel">Optimal Window</div>
                                <div class="pdfStatVal" style="font-size: 11.5px;">${entryAnalysis.optimal_entry_window || 'Session Open'}</div>
                            </div>
                            <div class="pdfStatBox">
                                <div class="pdfStatLabel">Late Entry Rate</div>
                                <div class="pdfStatVal ${Number(entryAnalysis.late_entry_percentage) > 30 ? 'pdfNegative' : 'pdfPositive'}" style="font-size: 13px;">${entryAnalysis.late_entry_percentage ?? 0}%</div>
                            </div>
                            <div class="pdfStatBox">
                                <div class="pdfStatLabel">Chasing Trades</div>
                                <div class="pdfStatVal ${Number(entryAnalysis.possible_chasing_trades) > 0 ? 'pdfNegative' : 'pdfPositive'}" style="font-size: 13px;">${entryAnalysis.possible_chasing_trades ?? 0}</div>
                            </div>
                            <div class="pdfStatBox">
                                <div class="pdfStatLabel">Rapid Re-entries</div>
                                <div class="pdfStatVal ${Number(entryAnalysis.rapid_reentry_trades) > 0 ? 'pdfNegative' : 'pdfPositive'}" style="font-size: 13px;">${entryAnalysis.rapid_reentry_trades ?? 0}</div>
                            </div>
                        </div>
                        ${entryAnalysis.assessment ? `<div style="font-size: 10.5px; color: #334155; line-height: 1.5; background: #FFFFFF; border: 1px solid #E2E8F0; padding: 6px 8px; border-radius: 4px;"><strong>Assessment:</strong> ${parseInline(entryAnalysis.assessment)}</div>` : ''}
                    </div>
                    ` : ''}

                    <!-- Session Timing & Cutoff Dynamics Card -->
                    ${(timeInsights?.fact_loss_distribution || timeInsights?.cutoff_recommendation || timeInsights?.peak_frequency_time) ? `
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px 12px; page-break-inside: avoid; break-inside: avoid;">
                        <div style="font-size: 11px; font-weight: 800; color: #0F172A; text-transform: uppercase; margin-bottom: 6px;">Session Timing & Cutoff Dynamics</div>
                        ${timeInsights.fact_loss_distribution ? `<div style="font-size: 10.5px; color: #334155; margin-bottom: 4px;"><strong>Loss Distribution:</strong> ${parseInline(timeInsights.fact_loss_distribution)}</div>` : ''}
                        ${timeInsights.peak_frequency_time ? `<div style="font-size: 10.5px; color: #334155; margin-bottom: 4px;"><strong>Peak Activity:</strong> ${parseInline(timeInsights.peak_frequency_time)}</div>` : ''}
                        ${timeInsights.cutoff_recommendation ? `<div style="font-size: 10.5px; color: #047857; background: #ECFDF5; border: 1px solid #A7F3D0; padding: 5px 8px; border-radius: 4px; margin-top: 4px;"><strong>Cutoff Rule:</strong> ${parseInline(timeInsights.cutoff_recommendation)}</div>` : ''}
                    </div>
                    ` : ''}
                </div>

                <!-- TAB 3: AI NARRATIVE REPORT & DEEP-DIVE AUDIT -->
                <div class="pdfSectionCard" style="page-break-before: always; break-before: page; margin-top: 14px;">
                    <div class="pdfSectionTitle">3. AI Narrative Report & Deep-Dive Audit</div>
                    <div class="pdfNarrativeText">${formatMarkdownToHtml(dynamicReportMarkdown || '')}</div>
                </div>

                <!-- TAB 4: TRADE LEDGER (ALL EXECUTIONS) -->
                ${trades && trades.length > 0 ? `
                <div class="pdfSectionCard" style="page-break-before: always; break-before: page; margin-top: 14px;">
                    <div class="pdfSectionTitle">4. Executed Trades Ledger (${trades.length} Executions)</div>
                    <table class="pdfTable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Symbol</th>
                                <th>Side</th>
                                <th>Open Time</th>
                                <th>Close Time</th>
                                <th>Size</th>
                                <th>P&L</th>
                                <th>Outcome</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${trades.map((t, idx) => {
                                const pnlNum = Number(t.pnl || 0);
                                const isWin = pnlNum > 0 || (t.outcome || '').toUpperCase() === 'WIN';
                                return `
                                <tr style="page-break-inside: avoid; break-inside: avoid;">
                                    <td>${idx + 1}</td>
                                    <td><strong>${t.symbol || 'N/A'}</strong></td>
                                    <td>${(t.side || 'BUY').toUpperCase()}</td>
                                    <td>${t.open_time || t.time || '-'}</td>
                                    <td>${t.close_time || '-'}</td>
                                    <td>${t.size || t.volume || '1.0'}</td>
                                    <td class="${isWin ? 'pdfPositive' : 'pdfNegative'}"><strong>${formatCurrency(pnlNum)}</strong></td>
                                    <td><span style="font-weight: 700; color: ${isWin ? '#059669' : '#DC2626'};">${isWin ? 'WIN' : 'LOSS'}</span></td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}
            `;

            const opt = {
                margin: [6, 6, 6, 6],
                filename: `ChronosX_Statement_Analysis_${cleanName}_${dateStr}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#FFFFFF',
                    scrollX: 0,
                    scrollY: 0,
                    logging: false,
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy'],
                    avoid: ['.pdfBlock', 'p', 'tr', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.pdfScoreHero', '.pdfStatBox', '.pdfPillarCard']
                }
            };

            await html2pdf().set(opt).from(exportContainer).save();
            toast.success('Trade Analysis PDF report downloaded successfully!');
        } catch (err) {
            console.error('Failed to export trade analysis PDF:', err);
            toast.error('Failed to generate PDF report. Please try again.');
        } finally {
            setIsExporting(false);
        }
    }, [isExporting]);

    return { exportToPdf, isExporting };
}
