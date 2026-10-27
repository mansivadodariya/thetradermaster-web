import { parseChatMessage } from '@/utils/chatParser';
import { formatTechnicalProse, isTechnicalJsonPayload } from '@/utils/formatTechnicalProse';
import { normalizeMarkdownParagraphs } from '../components/MarkdownWidgetRenderer';

export const parseAssistantResponse = (raw) => {
    let envelope = raw?.data || raw;

    // Check if envelope has chats array (new With_Image / structured response format)
    let chatItem = null;
    if (envelope && Array.isArray(envelope.chats) && envelope.chats.length > 0) {
        chatItem = envelope.chats[envelope.chats.length - 1]; // latest chat item
    } else if (raw && Array.isArray(raw.chats) && raw.chats.length > 0) {
        chatItem = raw.chats[raw.chats.length - 1];
    }

    let payload = chatItem ? chatItem.response : (envelope?.response ?? envelope?.message ?? envelope?.answer ?? envelope);
    const imageUrl = chatItem?.image_url || envelope?.image_url || null;
    const chatType = chatItem?.chat_type || envelope?.chat_type || null;

    let rawText = '';
    let rawFullReport = chatItem?.full_report || envelope?.full_report || null;

    if (typeof payload === 'string') {
        rawText = payload;
    } else if (payload && typeof payload === 'object') {
        rawText = payload.response || payload.message || payload.answer || payload.output || payload.text || payload.full_report || payload.short_response || payload.shortResponse || '';
        rawFullReport = payload.full_report || payload.fullReport || rawFullReport;
    }

    const parsed = parseChatMessage(rawText, rawFullReport);

    let shortContent = parsed.fallbackText || rawText || (typeof payload === 'string' ? payload : (payload?.response || payload?.text || payload?.short_response || ''));
    let fullReport = rawFullReport;

    const visualData = (payload && typeof payload === 'object') ? (payload.visual_data || payload.visualData || envelope?.visual_data || null) : null;
    let detected_pair = (payload && typeof payload === 'object') ? (payload.detected_pair || payload.detectedPair || envelope?.detected_pair || null) : null;
    let detected_timeframe = (payload && typeof payload === 'object') ? (payload.detected_timeframe || payload.detectedTimeframe || envelope?.detected_timeframe || null) : null;
    let is_valid_chart = (payload && typeof payload === 'object') ? (payload.is_valid_chart ?? payload.isValidChart ?? envelope?.is_valid_chart ?? true) : true;
    let image_warning = (payload && typeof payload === 'object') ? (payload.image_warning || envelope?.image_warning || null) : null;
    let chart_sections = (payload && typeof payload === 'object') ? (payload.chart_sections || payload.chartSections || envelope?.chart_sections || null) : null;
    let response_format = (payload && typeof payload === 'object') ? (payload.response_format || payload.responseFormat || envelope?.response_format || null) : null;
    let disclaimer_header = parsed.disclaimerHeader || null;
    let disclaimer_footer = parsed.disclaimerFooter || null;

    if (parsed.jsonData) {
        const isVision = Boolean(
            parsed.jsonData.overall_trend ||
            parsed.jsonData.market_structure ||
            parsed.jsonData.chart_sections ||
            parsed.jsonData.is_valid_chart !== undefined
        );

        if (isVision) {
            chart_sections = parsed.jsonData.chart_sections || parsed.jsonData;
            response_format = 'vision_analysis';
            if (!detected_pair && parsed.jsonData.detected_pair) detected_pair = parsed.jsonData.detected_pair;
            if (!detected_timeframe && parsed.jsonData.detected_timeframe) detected_timeframe = parsed.jsonData.detected_timeframe;
            if (parsed.jsonData.is_valid_chart !== undefined) is_valid_chart = parsed.jsonData.is_valid_chart;
            if (!image_warning && parsed.jsonData.image_warning) image_warning = parsed.jsonData.image_warning;
            if (!shortContent && parsed.jsonData.overall_summary) {
                shortContent = parsed.jsonData.overall_summary;
            }
        } else if (isTechnicalJsonPayload(parsed.jsonData)) {
            if (!detected_pair && (parsed.jsonData.symbol || parsed.jsonData.analysis_results?.symbol)) {
                detected_pair = parsed.jsonData.symbol || parsed.jsonData.analysis_results?.symbol;
            }
            shortContent = formatTechnicalProse(parsed.jsonData, detected_pair);
            if (fullReport) {
                response_format = 'deep_analysis';
            }
        }
    }

    // Check if payload itself is the chart report object
    if (payload && typeof payload === 'object' && !chart_sections && (payload.overall_trend || payload.market_structure || payload.support_and_resistance || payload.supply_and_demand_zones || payload.trader_actionable_zones)) {
        chart_sections = payload;
        response_format = 'vision_analysis';
    }

    if (chatType === 'With_Image' && !response_format) {
        response_format = 'vision_analysis';
    }

    if (fullReport && !response_format) {
        response_format = 'deep_analysis';
    }

    if (!image_warning && is_valid_chart === false) {
        image_warning = 'Image not clear or valid chart header missing. Please upload a clear chart screenshot.';
    }

    if (fullReport && shortContent && fullReport.trim() === shortContent.trim()) {
        shortContent = "";
    }

    // Ensure shortContent is never a raw JSON dump
    if (!shortContent) {
        if (isTechnicalJsonPayload(payload)) {
            shortContent = formatTechnicalProse(payload, detected_pair);
        } else if (typeof payload === 'string' && payload.trim().startsWith('{')) {
            try {
                const parsedP = JSON.parse(payload);
                if (isTechnicalJsonPayload(parsedP)) {
                    shortContent = formatTechnicalProse(parsedP, detected_pair);
                }
            } catch (_) {}
        }
    } else if (typeof shortContent === 'string' && shortContent.trim().startsWith('{') && shortContent.trim().endsWith('}')) {
        try {
            const parsedS = JSON.parse(shortContent);
            if (isTechnicalJsonPayload(parsedS)) {
                shortContent = formatTechnicalProse(parsedS, detected_pair);
            }
        } catch (_) {}
    }

    const finalShortContent = shortContent || (typeof payload === 'string' && !payload.trim().startsWith('{') ? payload : '');
    const cleanShortContent = finalShortContent ? normalizeMarkdownParagraphs(finalShortContent) : '';
    const cleanFullReport = fullReport ? normalizeMarkdownParagraphs(fullReport) : null;

    return {
        shortContent: cleanShortContent,
        fullReport: cleanFullReport,
        visualData,
        detected_pair,
        detected_timeframe,
        is_valid_chart,
        image_warning,
        chart_sections,
        response_format,
        image_url: imageUrl,
        chat_type: chatType,
        disclaimer_header,
        disclaimer_footer
    };
};

export const buildAssistantMessage = (parsed) => ({
    role: 'assistant',
    content: parsed.shortContent,
    fullReport: parsed.fullReport,
    visualData: parsed.visualData,
    response_format: parsed.response_format,
    detected_pair: parsed.detected_pair,
    detected_timeframe: parsed.detected_timeframe,
    chart_sections: parsed.chart_sections,
    image_warning: parsed.image_warning,
    image_url: parsed.image_url,
    chat_type: parsed.chat_type
});
