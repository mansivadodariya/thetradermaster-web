'use client';

import { useState, useCallback } from 'react';
import { toast } from '@/components/toast';

export function useTradeSnapExport() {
    const [isExporting, setIsExporting] = useState(false);

    const exportToPdf = useCallback(async (element, symbol = 'MARKET', timeframe = 'M15') => {
        if (isExporting) return;
        if (!element) {
            toast.error('Unable to find report to download.');
            return;
        }

        try {
            setIsExporting(true);
            const cleanSymbol = String(symbol || 'MARKET').replace(/[^A-Z0-9]/gi, '').toUpperCase() || 'CHART_SCAN';
            const cleanTf = String(timeframe || 'M15').replace(/[^A-Z0-9]/gi, '').toUpperCase();
            const dateStr = new Date().toISOString().split('T')[0];
            toast(`Generating PDF report for ${cleanSymbol}...`);

            // Dynamically import html2pdf and logo
            const html2pdf = (await import('html2pdf.js')).default;
            const { getPdfLogoDataUrl } = await import('@/lib/pdfLogoHelper');
            const logoDataUrl = await getPdfLogoDataUrl(false);

            const opt = {
                margin: [6, 6, 6, 6],
                filename: `TraderMaster_Chart_Scan_${cleanSymbol}_${cleanTf}_${dateStr}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#FFFFFF',
                    scrollX: 0,
                    scrollY: 0,
                    logging: false,
                    onclone: (clonedDoc, clonedElement) => {
                        // html2canvas internal clone - Isolated completely from live DOM
                        // Live UI, document.body, and screen recording stream are NEVER modified
                        if (!clonedDoc) return;

                        // 1. Force light theme variables in cloned document ONLY
                        if (clonedDoc.documentElement) {
                            clonedDoc.documentElement.classList.add('light');
                            clonedDoc.documentElement.setAttribute('data-theme', 'light');
                            clonedDoc.documentElement.style.backgroundColor = '#FFFFFF';
                            clonedDoc.documentElement.style.color = '#0F172A';
                        }
                        if (clonedDoc.body) {
                            clonedDoc.body.classList.add('light', 'pdfExportLight');
                            clonedDoc.body.style.backgroundColor = '#FFFFFF';
                            clonedDoc.body.style.color = '#0F172A';
                        }

                        // 2. Add PDF export classes to target in the clone
                        const target = clonedElement || clonedDoc.body;
                        if (target && target.classList) {
                            target.classList.add('pdfExportLight', 'pdfExportContainer');

                            // Prepend institutional branded header with site logo
                            let existingHeader = target.querySelector('.pdfScanBrandedHeader');
                            if (!existingHeader) {
                                const brandedHeader = clonedDoc.createElement('div');
                                brandedHeader.className = 'pdfScanBrandedHeader';
                                brandedHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 14px; width: 100%; box-sizing: border-box; page-break-inside: avoid; break-inside: avoid;';
                                brandedHeader.innerHTML = `
                                    <div>
                                        <img src="${logoDataUrl || "/assets/logo/logo.svg"}" alt="TraderMaster" style="height: 28px; width: auto; max-width: 150px; object-fit: contain; display: block; margin-bottom: 4px;" />
                                        <div style="font-size: 14px; font-weight: 800; color: #0F172A; margin: 0;">AI Neural Chart Vision & Pattern Scan</div>
                                        <div style="font-size: 10px; color: #64748B; margin-top: 2px;">Instrument: <strong style="color: #0F172A;">${cleanSymbol}</strong> (${cleanTf}) • Generated: ${dateStr}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="background: #F0FDF4; border: 1px solid #10B981; color: #047857; font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                                            CHART SCAN AUDIT
                                        </div>
                                        <div style="font-size: 8px; color: #94A3B8; margin-top: 3px; font-weight: 600;">CONFIDENTIAL REPORT</div>
                                    </div>
                                `;
                                target.insertBefore(brandedHeader, target.firstChild);
                            }
                        }

                        // 3. Hide interactive buttons (Download, Retry, Close) in the clone
                        clonedDoc.querySelectorAll('button, [class*="DownloadBtn"], [class*="modalClose"]').forEach((btn) => {
                            const text = (btn.textContent || '').toLowerCase();
                            if (
                                text.includes('download') ||
                                text.includes('export') ||
                                text.includes('retry') ||
                                btn.classList.contains('headerDownloadBtn') ||
                                btn.classList.contains('modalDownloadBtn') ||
                                btn.classList.contains('modalClose')
                            ) {
                                btn.style.display = 'none';
                            }
                        });

                        // 4. Hide tab rows and expand all 4 breakdown tables in the clone with pure block layout
                        clonedDoc.querySelectorAll('.tabNavRow, [class*="tabNavRow"]').forEach((el) => {
                            el.style.display = 'none';
                        });
                        clonedDoc.querySelectorAll('[class*="indicatorPivotSection"] > [class*="tabContentCard"]').forEach((el) => {
                            el.style.display = 'none';
                        });
                        clonedDoc.querySelectorAll('.pdfFullBreakdown, [class*="pdfFullBreakdown"]').forEach((el) => {
                            el.style.setProperty('display', 'block', 'important');
                            el.style.setProperty('width', '100%', 'important');
                            el.style.setProperty('margin-top', '14px', 'important');
                        });

                        // 5. Ensure no scrollbars or clipped heights in the clone
                        clonedDoc.querySelectorAll('[class*="resultsPanel"], [class*="resultsBody"], [class*="analysesListContainer"]').forEach((el) => {
                            el.style.maxHeight = 'none';
                            el.style.overflow = 'visible';
                            el.style.background = '#FFFFFF';
                        });

                        // 6. Force Speedometer needle and pivot dot to high-contrast dark color in the cloned PDF
                        clonedDoc.querySelectorAll('[class*="gaugeNeedleLine"], line[y2="-64"]').forEach((line) => {
                            line.setAttribute('stroke', '#0F172A');
                            line.style.setProperty('stroke', '#0F172A', 'important');
                            line.style.filter = 'drop-shadow(0 0 2px rgba(15, 23, 42, 0.3))';
                        });
                        clonedDoc.querySelectorAll('[class*="gaugeNeedleTip"], polygon[points*="-65"]').forEach((poly) => {
                            poly.setAttribute('fill', '#0F172A');
                            poly.style.setProperty('fill', '#0F172A', 'important');
                        });
                        clonedDoc.querySelectorAll('[class*="gaugePivotDot"]').forEach((dot) => {
                            dot.setAttribute('fill', '#0F172A');
                            dot.style.setProperty('fill', '#0F172A', 'important');
                        });
                        clonedDoc.querySelectorAll('[class*="gaugeNeedleGroup"]').forEach((g) => {
                            g.style.color = '#0F172A';
                        });
                        // 7. Inject dedicated print/PDF page-break styles into cloned document
                        const styleEl = clonedDoc.createElement('style');
                        styleEl.innerHTML = `
                            @media all {
                                tr {
                                    page-break-inside: avoid;
                                    break-inside: avoid;
                                    break-inside: avoid-page;
                                    display: table-row;
                                }
                                td, th {
                                    page-break-inside: avoid;
                                    break-inside: avoid;
                                    break-inside: avoid-page;
                                }
                                table, .breakdownTable, [class*="breakdownTable"], .tabContentCard, [class*="tabContentCard"], .tableWrapper, [class*="tableWrapper"] {
                                    page-break-inside: avoid;
                                    break-inside: avoid;
                                    break-inside: avoid-page;
                                    border-collapse: collapse;
                                }
                                thead {
                                    page-break-inside: avoid;
                                    break-inside: avoid;
                                    page-break-after: avoid;
                                    break-after: avoid;
                                    break-after: avoid-page;
                                    display: table-header-group;
                                }
                                tbody {
                                    display: table-row-group;
                                }
                                .pdfBreakdownBlock, [class*="pdfBreakdownBlock"] {
                                    page-break-inside: avoid;
                                    break-inside: avoid;
                                    break-inside: avoid-page;
                                    display: block;
                                    width: 100%;
                                    margin-bottom: 20px;
                                }
                                .pdfSubHeading, [class*="pdfSubHeading"] {
                                    page-break-after: avoid;
                                    break-after: avoid;
                                    break-after: avoid-page;
                                    page-break-inside: avoid;
                                    break-inside: avoid;
                                    break-inside: avoid-page;
                                    margin-top: 4px;
                                    margin-bottom: 10px;
                                }
                                h1, h2, h3, h4, .sectionHeaderRow, [class*="sectionHeaderRow"] {
                                    page-break-after: avoid;
                                    break-after: avoid;
                                    break-after: avoid-page;
                                    page-break-inside: avoid;
                                    break-inside: avoid;
                                    break-inside: avoid-page;
                                    margin-bottom: 16px;
                                }
                                .technicalGaugeCard, [class*="technicalGaugeCard"],
                                .bullBearHero, [class*="bullBearHero"],
                                .heroBanner, [class*="heroBanner"],
                                .tradeSignalSetupCard, [class*="tradeSignalSetupCard"],
                                .patternsCard, [class*="patternsCard"],
                                .riskFlagsCard, [class*="riskFlagsCard"],
                                .summaryHeaderGrid, [class*="summaryHeaderGrid"] {
                                    page-break-inside: avoid;
                                    break-inside: avoid;
                                    break-inside: avoid-page;
                                }
                                .indicatorPivotSection, [class*="indicatorPivotSection"] {
                                    page-break-before: always;
                                    break-before: page;
                                    break-before: always;
                                    page-break-inside: auto;
                                    break-inside: auto;
                                    overflow: visible;
                                    max-height: none;
                                    height: auto;
                                }
                                .pdfFullBreakdown, [class*="pdfFullBreakdown"] {
                                    display: block;
                                    width: 100%;
                                    page-break-inside: auto;
                                    break-inside: auto;
                                    overflow: visible;
                                    max-height: none;
                                    height: auto;
                                }
                            }
                        `;
                        clonedDoc.head.appendChild(styleEl);

                        // 8. Explicitly apply inline avoid & break-before rules
                        clonedDoc.querySelectorAll('.indicatorPivotSection, [class*="indicatorPivotSection"]').forEach((el) => {
                            el.style.setProperty('page-break-before', 'always');
                            el.style.setProperty('break-before', 'page');
                        });
                        clonedDoc.querySelectorAll('tr, th, td, table, thead, [class*="breakdownTable"], [class*="tabContentCard"], [class*="tableWrapper"]').forEach((row) => {
                            row.style.setProperty('page-break-inside', 'avoid');
                            row.style.setProperty('break-inside', 'avoid');
                            row.style.setProperty('break-inside', 'avoid-page');
                        });
                        clonedDoc.querySelectorAll('.pdfBreakdownBlock, [class*="pdfBreakdownBlock"]').forEach((block) => {
                            block.style.setProperty('page-break-inside', 'avoid');
                            block.style.setProperty('break-inside', 'avoid');
                            block.style.setProperty('break-inside', 'avoid-page');
                            block.style.setProperty('display', 'block');
                            block.style.setProperty('width', '100%');
                        });
                        clonedDoc.querySelectorAll('.pdfSubHeading, [class*="pdfSubHeading"], .sectionHeaderRow, [class*="sectionHeaderRow"]').forEach((hdr) => {
                            hdr.style.setProperty('page-break-after', 'avoid');
                            hdr.style.setProperty('break-after', 'avoid');
                            hdr.style.setProperty('break-after', 'avoid-page');
                        });
                    }
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy'],
                    before: [
                        '.indicatorPivotSection',
                        '[class*="indicatorPivotSection"]'
                    ],
                    avoid: [
                        'tr',
                        'th',
                        'td',
                        'table',
                        'thead',
                        '.breakdownTable',
                        '[class*="breakdownTable"]',
                        '.pdfBreakdownBlock',
                        '[class*="pdfBreakdownBlock"]',
                        '.tabContentCard',
                        '[class*="tabContentCard"]',
                        '.sectionHeaderRow',
                        '[class*="sectionHeaderRow"]',
                        '.pdfSubHeading',
                        '[class*="pdfSubHeading"]',
                        '.technicalGaugeCard',
                        '[class*="technicalGaugeCard"]',
                        '.tradeSignalSetupCard',
                        '[class*="tradeSignalSetupCard"]',
                        '.patternsCard',
                        '[class*="patternsCard"]',
                        '.riskFlagsCard',
                        '[class*="riskFlagsCard"]',
                        '.bullBearHero',
                        '[class*="bullBearHero"]',
                        '.heroBanner',
                        '[class*="heroBanner"]',
                        '.summaryHeaderGrid',
                        '[class*="summaryHeaderGrid"]',
                        'svg',
                        'canvas',
                        'figure'
                    ]
                }
            };

            await html2pdf().set(opt).from(element).save();
            toast.success('AI Chart Scan Report downloaded successfully!');
        } catch (err) {
            console.error('PDF export failed:', err);
            toast.error('Failed to generate PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    }, [isExporting]);

    return { exportToPdf, isExporting };
}
