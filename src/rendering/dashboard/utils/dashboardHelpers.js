import { getStoredUser } from '@/lib/authSession';

export function getUserNameFromLocalStorage() {
    const parsed = getStoredUser();
    if (!parsed) return 'Trader';
    const name = [parsed.first_name, parsed.last_name].filter(Boolean).join(' ');
    return name || parsed.email || 'Trader';
}

export function timeAgo(dateLike) {
    const d = dateLike ? new Date(dateLike) : null;
    if (!d || Number.isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');

    return `${day} ${monthName} ${year}, ${hours}:${minutes} ${ampm}`;
}

export function extractCleanText(val) {
    if (!val) return '';
    if (typeof val === 'object') {
        return val.short_response || val.shortResponse || val.text || val.response || val.summary || val.content || val.message || '';
    }
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
                const parsed = JSON.parse(trimmed);
                if (parsed && typeof parsed === 'object') {
                    return parsed.short_response || parsed.shortResponse || parsed.text || parsed.response || parsed.summary || parsed.content || (Array.isArray(parsed) ? parsed[0]?.response || parsed[0]?.text || '' : '') || trimmed;
                }
            } catch {
                // Not standard JSON
            }
        }
        return trimmed
            .replace(/^\{\s*"(?:short_response|shortResponse|text|response|summary|content)":\s*"/i, '')
            .replace(/"\s*\}$/, '')
            .replace(/\\"/g, '"');
    }
    return String(val || '');
}

export function formatSummary(input) {
    if (!input) return '';
    let text = extractCleanText(input);

    try {
        let decoded = text.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
            return String.fromCharCode(parseInt(grp, 16));
        });

        decoded = decoded.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        let formatted = decoded.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        if (formatted.startsWith('- ')) {
            formatted = '• ' + formatted.substring(2);
        } else if (formatted.startsWith('-\t')) {
            formatted = '• ' + formatted.substring(2);
        }

        formatted = formatted.replace(/\n-\s*/g, '<br />• ');
        formatted = formatted.replace(/\n•\s*/g, '<br />• ');
        formatted = formatted.replace(/\n/g, '<br />');

        return formatted;
    } catch (e) {
        return text;
    }
}

export async function exportDashboardPdf({ name, stats }) {
    try {
        const jspdfModule = await import('jspdf');
        const jsPDF = jspdfModule.default || jspdfModule.jsPDF;
        const doc = new jsPDF();

        // Dark base background
        doc.setFillColor(18, 21, 20);
        doc.rect(0, 0, 210, 297, 'F');

        // Header: Embed Site Logo instead of plain text name
        const { getPdfLogoDataUrl } = await import('@/lib/pdfLogoHelper');
        const logoData = await getPdfLogoDataUrl(true);
        if (logoData) {
            try {
                doc.addImage(logoData, 'PNG', 15, 12, 44, 11);
            } catch (_) {
                doc.setTextColor(24, 201, 139);
                doc.setFontSize(22);
                doc.setFont('helvetica', 'bold');
                doc.text('CHRONOSX', 15, 20);
            }
        } else {
            doc.setTextColor(24, 201, 139);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('CHRONOSX', 15, 20);
        }

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('AI Telemetry & Usage Report', 15, 30);

        doc.setFontSize(10);
        doc.setTextColor(180, 180, 180);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated for: ${name || 'Trader'}`, 15, 38);
        doc.text(`Timestamp: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, 44);

        // Divider
        doc.setDrawColor(24, 201, 139);
        doc.setLineWidth(0.5);
        doc.line(15, 48, 195, 48);

        // Metrics Cards
        let y = 58;
        const items = [
            { label: 'AI Chart Scans Performed', value: String(stats?.total_analysis_history ?? 0), desc: 'Automated pattern recognition & OCR scans' },
            { label: 'AI Market Assistant Sessions', value: String(stats?.total_chat_history ?? 0), desc: '24/7 neural market & trade assistant' },
            { label: 'Available AI Credits', value: String(stats?.available_credits ?? 0), desc: 'Ready for real-time AI strategy execution' },
            { label: 'Withdrawable Balance', value: String(stats?.wallet?.withdrawable_balance ?? stats?.withdrawable_balance ?? 0), desc: 'Affiliate earnings available for withdrawal' },
        ];

        items.forEach((item) => {
            doc.setFillColor(28, 33, 31);
            doc.roundedRect(15, y, 180, 32, 3, 3, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text(item.label, 22, y + 12);

            doc.setTextColor(160, 160, 160);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(item.desc, 22, y + 22);

            doc.setTextColor(24, 201, 139);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(item.value, 185, y + 18, { align: 'right' });

            y += 38;
        });

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text('ChronosX AI Quantitative Intelligence Platform • Confidential Export', 105, 285, { align: 'center' });

        doc.save(`ChronosX_AI_Telemetry_${(name || 'Trader').replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
        console.error('Failed to export PDF report:', err);
    }
}

export function formatRecentActivityItem(item) {
    if (!item) return { title: 'Recent Item', description: '', signal: null };

    let rawTitle = item.title || item.pair || item.symbol || 'Recent Item';
    let cleanTitle = extractCleanText(rawTitle);

    // If item has timeframe and not already present in cleanTitle
    if (item.timeframe && !cleanTitle.toUpperCase().includes(item.timeframe.toUpperCase())) {
        cleanTitle = `${cleanTitle} ${item.timeframe}`;
    }

    // Detect Signal (BUY / SELL / HOLD / STRONG BUY / STRONG SELL)
    let signal = null;
    const rawSignal = String(item.action || item.signal || item.direction || '').trim().toUpperCase();
    if (['BUY', 'SELL', 'HOLD', 'STRONG BUY', 'STRONG SELL'].includes(rawSignal)) {
        signal = rawSignal;
    }

    let rawSummary = String(item.description || item.desc || item.summary || item.response || '').trim();
    let cleanSummary = extractCleanText(rawSummary);

    // Check if summary itself is a signal like "SELL"
    const summaryUpper = cleanSummary.trim().toUpperCase();
    if (!signal && ['BUY', 'SELL', 'HOLD', 'STRONG BUY', 'STRONG SELL'].includes(summaryUpper)) {
        signal = summaryUpper;
        cleanSummary = '';
    } else if (summaryUpper.startsWith('SELL') || summaryUpper.startsWith('BUY')) {
        if (!signal) {
            signal = summaryUpper.startsWith('SELL') ? 'SELL' : 'BUY';
        }
    }

    // Clean summary from HTML/markdown tags
    cleanSummary = cleanSummary
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\*\*/g, '')
        .replace(/^[•\-\*]\s*/, '')
        .replace(/\s+/g, ' ')
        .trim();

    // If description is empty or identical to signal, synthesize a professional telemetry description
    let description = cleanSummary;
    const isAnalysisType = item.type === 'analysis' || item.type === 'blog';
    if (!description || description.toUpperCase() === signal) {
        if (signal === 'SELL' || signal === 'STRONG SELL') {
            description = isAnalysisType
                ? `AI chart scanner identified a SELL order flow setup on ${cleanTitle}.`
                : `AI market assistant identified a SELL order flow setup on ${cleanTitle}.`;
        } else if (signal === 'BUY' || signal === 'STRONG BUY') {
            description = isAnalysisType
                ? `AI chart scanner identified a BUY order flow setup on ${cleanTitle}.`
                : `AI market assistant identified a BUY order flow setup on ${cleanTitle}.`;
        } else if (isAnalysisType) {
            description = `Chart pattern analysis & OCR structural breakdown recorded for ${cleanTitle}.`;
        } else {
            description = `Technical analysis telemetry and setup parameters recorded.`;
        }
    }

    return {
        title: cleanTitle,
        description,
        signal
    };
}

