import { toast } from '@/components/toast';
import { renderRadarSvgHtml, renderCandlestickSvgHtml } from './pdfChartGenerators';

/**
 * Universal White-Theme PDF Exporter for TraderMaster AI Assistant
 * Exports any chat message (Vision Analysis, Deep Analysis, Markdown, or Technical Advice)
 * strictly formatted in institutional white-theme with cover header, proper margins, and zero line cutting.
 */
export async function exportAssistantMessageToPdf(msg, defaultPair = 'XAU/USD', sourceDomElement = null) {
    if (!msg) return;

    try {
        toast('Generating institutional white-theme PDF report...');

        // Dynamically import html2pdf and logo helper
        const html2pdf = (await import('html2pdf.js')).default;
        const { getPdfLogoDataUrl } = await import('@/lib/pdfLogoHelper');
        const logoDataUrl = getPdfLogoDataUrl(false);

        // Resolve authentic instrument symbol
        const promptText = String(msg.user_prompt || msg.prompt || msg.question || msg.userMsgText || '').toUpperCase();
        const promptMatch = promptText.match(/\b(XAUUSD|XAU\/USD|GOLD|EURUSD|EUR\/USD|GBPUSD|GBP\/USD|USDJPY|USD\/JPY|AUDUSD|AUD\/USD|USDCAD|USD\/CAD|USDCHF|USD\/CHF|NZDUSD|NZD\/USD|GBPJPY|GBP\/JPY|EURJPY|EUR\/JPY|EURGBP|EUR\/GBP|BTCUSD|BTC\/USD|ETHUSD|ETH\/USD|US30|NAS100)\b/i);

        let pair = 'XAU/USD';
        if (promptMatch) {
            let sym = promptMatch[1].toUpperCase().replace('GOLD', 'XAU/USD');
            if (sym.length === 6 && !sym.includes('/')) sym = `${sym.slice(0, 3)}/${sym.slice(3)}`;
            pair = sym;
        } else if (defaultPair && defaultPair !== 'No Pair' && defaultPair !== 'NO_PAIR' && defaultPair !== 'MARKET' && defaultPair !== 'none') {
            pair = defaultPair;
        } else if (msg.pair && msg.pair !== 'No Pair' && msg.pair !== 'NO_PAIR') {
            pair = msg.pair;
        } else {
            const contentText = String(msg.content || msg.fullReport || msg.textSummary || '').toUpperCase();
            const contentMatch = contentText.match(/\b(XAUUSD|XAU\/USD|GOLD|EURUSD|EUR\/USD|GBPUSD|GBP\/USD|USDJPY|USD\/JPY|AUDUSD|AUD\/USD|USDCAD|USD\/CAD|USDCHF|USD\/CHF|NZDUSD|NZD\/USD|GBPJPY|GBP\/JPY|EURJPY|EUR\/JPY|EURGBP|EUR\/GBP|BTCUSD|BTC\/USD|ETHUSD|ETH\/USD|US30|NAS100)\b/i);
            if (contentMatch) {
                let sym = contentMatch[1].toUpperCase().replace('GOLD', 'XAU/USD');
                if (sym.length === 6 && !sym.includes('/')) sym = `${sym.slice(0, 3)}/${sym.slice(3)}`;
                pair = sym;
            } else if (/\b(?:41[0-9]{2}|42[0-9]{2}|27[0-9]{2}|26[0-9]{2})\b/.test(contentText)) {
                pair = 'XAU/USD';
            } else if (msg.detected_pair && msg.detected_pair !== 'No Pair') {
                let sym = msg.detected_pair.toUpperCase();
                if (sym.length === 6 && !sym.includes('/')) sym = `${sym.slice(0, 3)}/${sym.slice(3)}`;
                pair = sym;
            } else {
                pair = 'XAU/USD';
            }
        }

        const cleanPair = String(pair).replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'XAUUSD';
        const dateStr = new Date().toISOString().split('T')[0];
        const timeStr = new Date().toLocaleTimeString();

        // Helper: format markdown inline
        function parseInline(text) {
            if (!text) return '';
            return String(text)
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/__(.*?)__/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code style="background: #F1F5F9; color: #0F172A; padding: 1px 4px; border-radius: 3px; font-size: 10px;">$1</code>');
        }

        // Helper: format full markdown with tables, widgets, and heading protections
        function formatMarkdownToHtml(markdown) {
            if (!markdown) return '';
            const rawLines = String(markdown).split('\n');
            const lines = [];

            for (let i = 0; i < rawLines.length; i++) {
                let line = rawLines[i];
                const trimmed = line.trim();

                // If table row, preserve as is
                if ((trimmed.startsWith('|') && trimmed.endsWith('|')) || /^\|?[\s-:]+(\|[\s-:]+)+\|?$/.test(trimmed)) {
                    lines.push(line);
                    continue;
                }

                if (/^[-*+•]\s*$/.test(trimmed) || /^(\*\*|\*|__|_)\s*$/.test(trimmed) || /^[–—]\s*$/.test(trimmed)) continue;

                // 3. For normal lines, normalize inline section headers only when separated by pipes, punctuation, or newlines
                line = line
                    // Pipe-separated bias tokens: e.g. "Intraday Bias: Bearish | Swing Bias: Bearish | Conviction: Moderate"
                    .replace(/\s*\|\s*(\*{0,2}(?:Intraday Bias|Swing Bias|Conviction|Forecast Horizon|Trade Thesis):\s*)/gi, '\n- $1')
                    // Separate "Final Bias:" onto a new paragraph when preceded by sentence-ending punctuation or double-asterisk
                    .replace(/(?<=[.:!]\s*|\n|\*\*)\s*(?:\*{0,2}Final Bias:?\*{0,2})\s*/gi, '\n\n**Final Bias:**\n')
                    // Separate "Trade Thesis:" onto a new paragraph when preceded by sentence-ending punctuation
                    .replace(/(?<=[.:!]\s*|\n)\s*(?:\*{0,2}Trade Thesis:?\*{0,2})\s*/gi, '\n\n**Trade Thesis:** ')
                    // Standalone "Forecast Horizon:" metric onto a bullet
                    .replace(/(?<=[.:!|\n]\s*|\*\*)\s*[-*•]?\s*(?:\*{0,2}Forecast Horizon:?\*{0,2})\s*/gi, '\n- Forecast Horizon: ')
                    // Standalone "Conviction:" rating onto a bullet (only when preceded by pipe, punctuation, or start of line)
                    .replace(/(?<=[.:!|\n]\s*)\s*[-*•]?\s*(?:\*{0,2}Conviction:?\*{0,2})\s*(High|Moderate|Low|Strong|Weak|\d+)/gi, '\n- Conviction: $1')
                    // Standalone "Intraday Bias:" or "Swing Bias:" onto a bullet
                    .replace(/(?<=[.:!|\n]\s*)\s*[-*•]?\s*(?:\*{0,2}Intraday Bias:?\*{0,2})\s*/gi, '\n- Intraday Bias: ')
                    .replace(/(?<=[.:!|\n]\s*)\s*[-*•]?\s*(?:\*{0,2}Swing Bias:?\*{0,2})\s*/gi, '\n- Swing Bias: ');

                const subLines = line.split('\n');
                for (const sub of subLines) {
                    const subTrimmed = sub.trim();
                    if (/^[-*+•]\s*$/.test(subTrimmed) || /^(\*\*|\*|__|_)\s*$/.test(subTrimmed)) continue;

                    let cleanedSub = sub
                        .replace(/\s+\*{2,}$/, '')
                        .replace(/^-\s+\*{2,}\s+/, '- ')
                        .replace(/\*\*\s*\*\*/g, ' ')
                        .replace(/\*{4,}/g, '**');

                    const bulletMatch = cleanedSub.match(/^([ \t]*[-*•]\s*)\*{0,2}([A-Za-z0-9\s()/-]+:)\*{0,2}\s*(.*?)$/);
                    if (bulletMatch) {
                        const prefix = bulletMatch[1];
                        const key = bulletMatch[2].trim();
                        let val = bulletMatch[3].trim();

                        val = val
                            .replace(/^\*{1,2}\s*/, '')
                            .replace(/\s*\*{1,2}$/, '')
                            .replace(/\*\*\s*\*\*/g, '')
                            .trim();

                        cleanedSub = `${prefix}**${key}** ${val}`;
                    }

                    lines.push(cleanedSub);
                }
            }

            const result = [];
            let inTable = false;
            let tableRows = [];

            const flushTable = () => {
                if (!tableRows.length) return;
                let html = '<div class="pdfBlock" style="page-break-inside: avoid; break-inside: avoid; margin: 10px 0 14px 0;"><table class="pdfTable" style="width: 100%; border-collapse: collapse; font-size: 10px;"><thead><tr>';
                const headerCols = tableRows[0];
                headerCols.forEach(col => {
                    html += `<th style="background: #F8FAFC; color: #0F172A; font-weight: 700; text-align: left; padding: 7px 10px; border: 1px solid #CBD5E1; font-size: 10px;">${parseInline(col.trim())}</th>`;
                });
                html += '</tr></thead><tbody>';

                for (let i = 1; i < tableRows.length; i++) {
                    html += '<tr>';
                    tableRows[i].forEach(col => {
                        html += `<td style="padding: 6px 10px; border: 1px solid #E2E8F0; color: #334155; font-size: 10px;">${parseInline(col.trim())}</td>`;
                    });
                    html += '</tr>';
                }
                html += '</tbody></table></div>';
                result.push(html);
                tableRows = [];
                inTable = false;
            };

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();

                // Check for embedded widget shortcodes e.g. [WIDGET:SENTIMENT_RADAR:XAUUSD] or [WIDGET:CANDLESTICK:XAUUSD]
                const widgetMatch = line.match(/\[WIDGET:([A-Z_]+)(?::([A-Z0-9/_-]+))?\]/i);
                if (widgetMatch) {
                    if (inTable) flushTable();
                    const widgetType = widgetMatch[1].toUpperCase();
                    const widgetSym = widgetMatch[2] || pair || 'XAUUSD';
                    if (widgetType === 'SENTIMENT_RADAR' || widgetType === 'RADAR') {
                        result.push(renderRadarSvgHtml(widgetSym, msg.visualData, sourceDomElement, pair));
                    } else if (widgetType === 'CANDLESTICK') {
                        result.push(renderCandlestickSvgHtml(widgetSym, msg.visualData, sourceDomElement, pair));
                    }
                    continue;
                }

                // Table row: | col1 | col2 |
                if (line.startsWith('|') && line.endsWith('|')) {
                    if (/^\|[\s-:]+(\|[\s-:]+)+\|$/.test(line)) {
                        continue;
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

                // Headings
                if (line.startsWith('#### ')) {
                    result.push(`<h5 class="pdfBlock" style="font-size: 11px; font-weight: 800; color: #0F172A; margin: 10px 0 3px 0; text-transform: uppercase; page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid;">${parseInline(line.slice(5))}</h5>`);
                    continue;
                }
                if (line.startsWith('### ')) {
                    result.push(`<h4 class="pdfBlock" style="font-size: 12.5px; font-weight: 800; color: #0F172A; margin: 14px 0 5px 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 3px; page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid;">${parseInline(line.slice(4))}</h4>`);
                    continue;
                }
                if (line.startsWith('## ')) {
                    result.push(`<h3 class="pdfBlock" style="font-size: 13.5px; font-weight: 800; color: #0F172A; margin: 16px 0 6px 0; page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid;">${parseInline(line.slice(3))}</h3>`);
                    continue;
                }
                if (line.startsWith('#')) {
                    const cleanTitle = line.replace(/^#+\s*/, '');
                    result.push(`<h4 class="pdfBlock" style="font-size: 12px; font-weight: 800; color: #059669; margin: 10px 0 3px 0; text-transform: uppercase; page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid;">${parseInline(cleanTitle)}</h4>`);
                    continue;
                }

                // Bullet points
                if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
                    const bulletText = line.slice(2).trim();
                    if (!bulletText) continue;
                    result.push(`<div class="pdfBlock" style="display: flex; gap: 6px; margin-bottom: 4px; font-size: 10.5px; line-height: 1.5; color: #334155; page-break-inside: avoid; break-inside: avoid;"><span style="color: #10B981; font-weight: 800; flex-shrink: 0;">•</span><span>${parseInline(bulletText)}</span></div>`);
                    continue;
                }
                if (/^[-*+•]\s*$/.test(line)) {
                    continue;
                }

                // Normal paragraph
                result.push(`<p class="pdfBlock" style="font-size: 10.5px; line-height: 1.55; color: #334155; margin: 3px 0; page-break-inside: avoid; break-inside: avoid;">${parseInline(line)}</p>`);
            }

            if (inTable) {
                flushTable();
            }

            return result.join('\n');
        }

        // Helper: format arbitrary nested objects or values cleanly without raw JSON leaks
        function formatReadableValue(val) {
            if (val === null || val === undefined || val === '') return '';
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                return parseInline(String(val));
            }
            if (Array.isArray(val)) {
                if (val.length === 0) return '';
                return `
                    <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
                        ${val.map(item => {
                            if (typeof item === 'object' && item !== null) {
                                return `
                                    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 4px; padding: 4px 8px; margin-bottom: 2px;">
                                        ${Object.entries(item).map(([k, v]) => {
                                            if (/^\d+$/.test(k)) return `<div style="font-size: 10px; line-height: 1.4; color: #334155;">${formatReadableValue(v)}</div>`;
                                            return `
                                                <div style="font-size: 10px; line-height: 1.4; color: #334155;">
                                                    <strong style="color: #0F172A; text-transform: capitalize;">${k.replace(/_/g, ' ')}:</strong> ${formatReadableValue(v)}
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                `;
                            }
                            return `<div style="font-size: 10px; color: #334155;">• ${parseInline(String(item))}</div>`;
                        }).join('')}
                    </div>
                `;
            }
            if (typeof val === 'object') {
                return `
                    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 4px; padding: 4px 8px; margin-top: 2px;">
                        ${Object.entries(val).map(([k, v]) => {
                            if (/^\d+$/.test(k)) return `<div style="font-size: 10px; line-height: 1.4; color: #334155; margin-bottom: 2px;">${formatReadableValue(v)}</div>`;
                            return `
                                <div style="font-size: 10px; line-height: 1.4; color: #334155; margin-bottom: 2px;">
                                    <strong style="color: #0F172A; text-transform: capitalize;">${k.replace(/_/g, ' ')}:</strong> ${formatReadableValue(v)}
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }
            return parseInline(String(val));
        }

        // Parse Vision Analysis Sections if present
        let sections = msg.chart_sections || null;
        if (!sections && typeof msg.content === 'string') {
            try {
                const jsonMatch = msg.content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    sections = parsed.chart_sections || parsed;
                }
            } catch (_) {}
        }

        const isVisionAnalysis = Boolean(
            msg.response_format === 'vision_analysis' ||
            msg.chat_type === 'With_Image' ||
            (sections && typeof sections === 'object' && (
                sections.overall_trend ||
                sections.market_structure ||
                sections.support_and_resistance ||
                sections.supply_and_demand_zones ||
                sections.trader_actionable_zones ||
                sections.volatility_and_price_behavior ||
                sections.session_behavior ||
                sections.market_mood ||
                sections.candlestick_behavior ||
                sections.chart_patterns
            ))
        );

        // Helper: Render Vision Section Card with rich custom layout
        function renderVisionSectionCard(title, sectionKey, content) {
            if (!content) return '';
            let bodyHtml = '';

            if (typeof content === 'string') {
                bodyHtml = `<div style="font-size: 10px; color: #334155; line-height: 1.5;">${parseInline(content)}</div>`;
            } else if (typeof content === 'object') {
                // Section-specific customized formatting
                if (sectionKey === 'overall_trend') {
                    const trend = content.trend_type || 'Ranging';
                    const strength = content.trend_strength || '';
                    const desc = content.description || '';
                    const obs = content.key_observation || '';
                    bodyHtml = `
                        <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                            <span style="background: #ECFDF5; border: 1px solid #10B981; color: #065F46; font-size: 9.5px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${trend}</span>
                            ${strength ? `<span style="background: #F1F5F9; border: 1px solid #CBD5E1; color: #475569; font-size: 9.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Strength: ${strength}</span>` : ''}
                        </div>
                        ${desc ? `<div style="font-size: 10px; color: #334155; line-height: 1.45; margin-bottom: 4px;">${parseInline(desc)}</div>` : ''}
                        ${obs ? `<div style="font-size: 9.5px; color: #1E293B; background: #FFFFFF; border-left: 2px solid #10B981; padding: 3px 6px; margin-top: 4px;"><strong>Observation:</strong> ${parseInline(obs)}</div>` : ''}
                    `;
                } else if (sectionKey === 'market_structure') {
                    const state = content.structure_state || '';
                    const swing = content.swing_sequence || {};
                    const high = swing.recent_swing_high || content.recent_swing_high || '';
                    const low = swing.recent_swing_low || content.recent_swing_low || '';
                    const pattern = swing.higher_high_lower_high_pattern || content.pattern || '';
                    const desc = content.description || '';
                    bodyHtml = `
                        ${state ? `<div style="margin-bottom: 6px;"><span style="background: #FEF3C7; border: 1px solid #F59E0B; color: #92400E; font-size: 9.5px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">${state}</span></div>` : ''}
                        ${(high || low) ? `
                            <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                                ${high ? `<div style="flex: 1; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 4px; padding: 3px 6px; font-size: 9.5px; color: #991B1B;"><strong>Swing High:</strong> ${high}</div>` : ''}
                                ${low ? `<div style="flex: 1; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 4px; padding: 3px 6px; font-size: 9.5px; color: #065F46;"><strong>Swing Low:</strong> ${low}</div>` : ''}
                            </div>
                        ` : ''}
                        ${pattern ? `<div style="font-size: 9.5px; color: #334155; margin-bottom: 3px;"><strong>Pattern:</strong> ${parseInline(pattern)}</div>` : ''}
                        ${desc ? `<div style="font-size: 10px; color: #334155; line-height: 1.45;">${parseInline(desc)}</div>` : ''}
                    `;
                } else if (sectionKey === 'support_and_resistance') {
                    const supports = content.support_levels || [];
                    const resistances = content.resistance_levels || [];
                    bodyHtml = `
                        ${supports.length ? `
                            <div style="margin-bottom: 6px;">
                                <div style="font-size: 9.5px; font-weight: 800; color: #065F46; text-transform: uppercase; margin-bottom: 3px;">Support Levels</div>
                                ${supports.map(s => `
                                    <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 4px; padding: 4px 6px; margin-bottom: 3px; font-size: 9.5px;">
                                        <div style="display: flex; justify-content: space-between; font-weight: 700; color: #166534;">
                                            <span>${s.level_description || s.price || s.level || 'Support'}</span>
                                            <span style="font-size: 8.5px; text-transform: uppercase; opacity: 0.85;">${s.behavior_type || s.confidence || ''}</span>
                                        </div>
                                        ${s.interaction_history ? `<div style="color: #374151; margin-top: 2px;">${parseInline(s.interaction_history)}</div>` : ''}
                                        ${s.observations ? `<div style="color: #4B5563; font-style: italic;">${parseInline(s.observations)}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${resistances.length ? `
                            <div>
                                <div style="font-size: 9.5px; font-weight: 800; color: #991B1B; text-transform: uppercase; margin-bottom: 3px;">Resistance Levels</div>
                                ${resistances.map(r => `
                                    <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 4px; padding: 4px 6px; margin-bottom: 3px; font-size: 9.5px;">
                                        <div style="display: flex; justify-content: space-between; font-weight: 700; color: #991B1B;">
                                            <span>${r.level_description || r.price || r.level || 'Resistance'}</span>
                                            <span style="font-size: 8.5px; text-transform: uppercase; opacity: 0.85;">${r.behavior_type || r.confidence || ''}</span>
                                        </div>
                                        ${r.interaction_history ? `<div style="color: #374151; margin-top: 2px;">${parseInline(r.interaction_history)}</div>` : ''}
                                        ${r.observations ? `<div style="color: #4B5563; font-style: italic;">${parseInline(r.observations)}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    `;
                } else if (sectionKey === 'supply_and_demand_zones') {
                    const supply = content.supply_zones || [];
                    const demand = content.demand_zones || [];
                    const gaps = content.top_fair_value_gaps || [];
                    bodyHtml = `
                        ${supply.length ? `
                            <div style="margin-bottom: 5px;">
                                <div style="font-size: 9.5px; font-weight: 800; color: #991B1B; text-transform: uppercase; margin-bottom: 2px;">Supply Zones</div>
                                ${supply.map(z => `
                                    <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 4px; padding: 3px 6px; margin-bottom: 3px; font-size: 9.5px; color: #991B1B;">
                                        <strong>${z.zone_boundary || z.zone || 'Zone'}:</strong> ${parseInline(z.rejection_evidence || z.status || '')}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${demand.length ? `
                            <div style="margin-bottom: 5px;">
                                <div style="font-size: 9.5px; font-weight: 800; color: #065F46; text-transform: uppercase; margin-bottom: 2px;">Demand Zones</div>
                                ${demand.map(z => `
                                    <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 4px; padding: 3px 6px; margin-bottom: 3px; font-size: 9.5px; color: #065F46;">
                                        <strong>${z.zone_boundary || z.zone || 'Zone'}:</strong> ${parseInline(z.acceptance_evidence || z.status || '')}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${gaps.length ? `
                            <div>
                                <div style="font-size: 9.5px; font-weight: 800; color: #4338CA; text-transform: uppercase; margin-bottom: 2px;">Fair Value Gaps (FVG)</div>
                                ${gaps.map(g => `<div style="font-size: 9.5px; color: #374151;">• ${formatReadableValue(g)}</div>`).join('')}
                            </div>
                        ` : ''}
                    `;
                } else if (sectionKey === 'trader_actionable_zones') {
                    const entry = content.entry_zones || {};
                    const sl = content.stop_loss_zone || {};
                    const t1 = content.target_1_or_target_2 || content.targets || {};
                    bodyHtml = `
                        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 4px; padding: 6px; font-size: 9.5px; line-height: 1.45;">
                            ${entry.level_range || entry.level ? `<div style="color: #0F172A; margin-bottom: 2px;"><strong style="color: #059669;">Entry Zone:</strong> ${entry.level_range || entry.level} ${entry.trigger_condition ? `(${entry.trigger_condition})` : ''}</div>` : ''}
                            ${sl.level || sl.level_range ? `<div style="color: #0F172A; margin-bottom: 2px;"><strong style="color: #DC2626;">Stop Loss:</strong> ${sl.level || sl.level_range} ${sl.invalidation_reason ? `— ${sl.invalidation_reason}` : ''}</div>` : ''}
                            ${t1.level_range || t1.level ? `<div style="color: #0F172A;"><strong style="color: #2563EB;">Target:</strong> ${t1.level_range || t1.level} ${t1.target_type ? `(${t1.target_type})` : ''}</div>` : ''}
                            ${!entry.level_range && !sl.level && !t1.level ? formatReadableValue(content) : ''}
                        </div>
                    `;
                } else {
                    // Universal object or array formatter for volatility, mood, candlesticks, patterns, session
                    if (Array.isArray(content)) {
                        bodyHtml = content.map(item => formatReadableValue(item)).join('');
                    } else {
                        const rows = [];
                        Object.entries(content).forEach(([k, v]) => {
                            if (v === null || v === undefined || v === '') return;
                            if (/^\d+$/.test(k)) {
                                rows.push(`
                                    <div style="margin-bottom: 4px;">
                                        ${formatReadableValue(v)}
                                    </div>
                                `);
                                return;
                            }
                            const label = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            rows.push(`
                                <div style="margin-bottom: 4px;">
                                    <span style="font-size: 9px; font-weight: 800; color: #475569; text-transform: uppercase;">${label}:</span>
                                    <div style="margin-top: 1px; font-size: 9.5px; color: #1E293B; line-height: 1.4;">
                                        ${formatReadableValue(v)}
                                    </div>
                                </div>
                            `);
                        });
                        bodyHtml = rows.join('');
                    }
                }
            }

            return `
                <div class="pdfSectionCard" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="font-size: 10.5px; font-weight: 800; color: #0F172A; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
                        <span style="color: #10B981; font-size: 11px;">◆</span>
                        <span>${title}</span>
                    </div>
                    ${bodyHtml}
                </div>
            `;
        }

        // Build main content
        const reportType = isVisionAnalysis ? 'Technical Vision & Price Action Audit' : 'AI Copilot Market Advisory';
        const contentText = msg.fullReport || msg.content || '';

        let mainBodyContent = '';
        if (isVisionAnalysis && sections) {
            mainBodyContent = `
                <!-- EXECUTIVE SUMMARY -->
                ${(sections.overall_summary || msg.textSummary) ? `
                <div class="pdfSectionCard" style="background: #F0FDF4; border: 1.5px solid #10B981; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 11px; font-weight: 800; color: #065F46; text-transform: uppercase; letter-spacing: 0.3px;">Executive Analysis Summary</span>
                        <span style="background: #10B981; color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 6px; border-radius: 3px;">VERIFIED</span>
                    </div>
                    <div style="font-size: 10.5px; color: #064E3B; line-height: 1.55;">${parseInline(sections.overall_summary || msg.textSummary)}</div>
                </div>
                ` : ''}

                <!-- FLOWABLE SECTION CARDS (FLAT ROWS FOR ACCURATE PDF PAGINATION) -->
                <div class="pdfVisionRow" style="display: flex; gap: 8px; width: 100%; margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="flex: 1 1 0; min-width: 0; width: calc(50% - 4px); box-sizing: border-box;">${renderVisionSectionCard('Overall Trend', 'overall_trend', sections.overall_trend)}</div>
                    <div style="flex: 1 1 0; min-width: 0; width: calc(50% - 4px); box-sizing: border-box;">${renderVisionSectionCard('Market Structure', 'market_structure', sections.market_structure)}</div>
                </div>
                <div class="pdfVisionRow" style="display: flex; gap: 8px; width: 100%; margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="flex: 1 1 0; min-width: 0; width: calc(50% - 4px); box-sizing: border-box;">${renderVisionSectionCard('Support & Resistance', 'support_and_resistance', sections.support_and_resistance)}</div>
                    <div style="flex: 1 1 0; min-width: 0; width: calc(50% - 4px); box-sizing: border-box;">${renderVisionSectionCard('Supply & Demand Zones', 'supply_and_demand_zones', sections.supply_and_demand_zones)}</div>
                </div>
                <div class="pdfVisionRow" style="width: 100%; margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
                    ${renderVisionSectionCard('Trader Actionable Zones (Trade Plan)', 'trader_actionable_zones', sections.trader_actionable_zones)}
                </div>
                <div class="pdfVisionRow" style="display: flex; gap: 8px; width: 100%; margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="flex: 1 1 0; min-width: 0; width: calc(50% - 4px); box-sizing: border-box;">${renderVisionSectionCard('Volatility & Price Behavior', 'volatility_and_price_behavior', sections.volatility_and_price_behavior)}</div>
                    <div style="flex: 1 1 0; min-width: 0; width: calc(50% - 4px); box-sizing: border-box;">${renderVisionSectionCard('Session Behavior', 'session_behavior', sections.session_behavior)}</div>
                </div>
                <div class="pdfVisionRow" style="display: flex; gap: 8px; width: 100%; margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="flex: 1 1 0; min-width: 0; width: calc(50% - 4px); box-sizing: border-box;">${renderVisionSectionCard('Market Mood & Sentiment', 'market_mood', sections.market_mood)}</div>
                    <div style="flex: 1 1 0; min-width: 0; width: calc(50% - 4px); box-sizing: border-box;">${renderVisionSectionCard('Candlestick Behavior', 'candlestick_behavior', sections.candlestick_behavior)}</div>
                </div>
                <div class="pdfVisionRow" style="width: 100%; margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
                    ${renderVisionSectionCard('Chart Patterns & Structural Formations', 'chart_patterns', sections.chart_patterns)}
                </div>
            `;
        } else {
            mainBodyContent = `
                <div class="pdfSectionCard" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid; width: 100%; box-sizing: border-box;">
                    <div class="pdfNarrativeText">${formatMarkdownToHtml(contentText)}</div>
                </div>
            `;
        }

        // Build container
        const exportContainer = document.createElement('div');
        exportContainer.className = 'aiAssistantPdfReport';
        exportContainer.style.cssText = `
            width: 720px;
            max-width: 720px;
            background-color: #FFFFFF;
            color: #0F172A;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            padding: 10px 12px;
            box-sizing: border-box;
            margin: 0 auto;
            overflow: hidden;
        `;

        exportContainer.innerHTML = `
            <style>
                .aiAssistantPdfReport,
                .aiAssistantPdfReport * {
                    box-sizing: border-box;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    color: #0F172A;
                }
                .aiAssistantPdfReport .pdfSectionCard,
                .aiAssistantPdfReport .pdfVisionRow,
                .aiAssistantPdfReport .pdfBlock {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
            </style>

            <!-- INSTITUTIONAL COVER HEADER -->
            <div class="pdfBlock" style="border-bottom: 2px solid #0F172A; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; page-break-inside: avoid; break-inside: avoid; width: 100%;">
                <div>
                    <div style="margin-bottom: 6px;">
                        <img src="${logoDataUrl || "/assets/logo/logo.svg"}" alt="TraderMaster" style="height: 28px; width: auto; max-width: 150px; object-fit: contain; display: block;" />
                    </div>
                    <div style="font-size: 15px; font-weight: 900; color: #0F172A; margin: 0; letter-spacing: -0.3px;">${reportType}</div>
                    <div style="font-size: 9.5px; color: #64748B; margin-top: 2px;">
                        Instrument: <strong style="color: #0F172A;">${pair}</strong> • Audit Date: <strong style="color: #0F172A;">${dateStr} ${timeStr}</strong>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="background: #F0FDF4; border: 1px solid #10B981; color: #047857; font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                        INSTITUTIONAL GRADE
                    </div>
                    <div style="font-size: 8px; color: #94A3B8; margin-top: 3px; font-weight: 600;">CONFIDENTIAL AUDIT</div>
                </div>
            </div>

            <!-- MAIN BODY -->
            ${mainBodyContent}

            <!-- FOOTER -->
            <div class="pdfBlock" style="border-top: 1px solid #E2E8F0; padding-top: 8px; margin-top: 10px; display: flex; justify-content: space-between; font-size: 8px; color: #94A3B8; page-break-inside: avoid; break-inside: avoid; width: 100%;">
                <span>TraderMaster Quantitative AI Engine • Execution Reference Only</span>
                <span>Institutional Audit • Continuous Stream</span>
            </div>
        `;

        const opt = {
            margin: [6, 6, 6, 6],
            filename: `TraderMaster_AI_Assistant_${cleanPair}_${dateStr}.pdf`,
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
                mode: ['css', 'legacy'],
                avoid: ['.pdfBlock', '.pdfSectionCard', '.pdfVisionRow']
            }
        };

        await html2pdf().set(opt).from(exportContainer).save();
        toast.success('AI Assistant PDF report downloaded successfully!');
    } catch (err) {
        console.error('Failed to export AI assistant PDF:', err);
        toast.error('Failed to generate PDF report. Please try again.');
    }
}
