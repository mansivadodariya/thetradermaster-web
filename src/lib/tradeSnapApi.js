import { extractAvailableCredits, notifyCreditsUpdated, refreshCreditsFromServer } from '@/lib/credits';
import { tryRefreshToken, clearAuthAndRedirect, getActiveRefreshPromise } from '@/lib/api';

function getAccessToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
}

/**
 * Normalize one trade record to the shape used by AnalysisResultItem (webapp parity).
 */
export function normalizeTradeRecord(trade, fallbackParent = {}) {
    if (!trade || typeof trade !== 'object') return null;
    if (trade.error) return trade;

    // Parse stringified content if present
    let contentObj = null;
    if (typeof trade.content === 'string') {
        try {
            contentObj = JSON.parse(trade.content);
        } catch {
            contentObj = null;
        }
    } else if (trade.content && typeof trade.content === 'object') {
        contentObj = trade.content;
    }

    const contentData = contentObj?.data || contentObj;
    const vision =
        trade.vision_analysis ||
        contentData?.vision_analysis ||
        trade.data?.vision_analysis ||
        fallbackParent.vision_analysis ||
        fallbackParent.data?.vision_analysis ||
        {};
    const analysis =
        trade.analysis ||
        contentData?.analysis ||
        trade.data?.analysis ||
        fallbackParent.analysis ||
        fallbackParent.data?.analysis ||
        {};

    let targets =
        trade.targets ??
        trade.Targets ??
        vision.targets ??
        vision.Targets ??
        analysis.trade_decision?.take_profit_targets ??
        fallbackParent.targets ??
        {};

    const rawTargets =
        trade['Target(s)'] ??
        trade['targets(s)'] ??
        trade['Targets(s)'] ??
        vision['Target(s)'] ??
        vision['targets(s)'] ??
        vision['Targets(s)'];

    if (typeof rawTargets === 'string') {
        const parts = rawTargets.split(',').map(s => s.trim());
        targets = {};
        parts.forEach((part, index) => {
            const split = part.split(':').map(s => s.trim());
            if (split.length === 2) {
                targets[split[0].toLowerCase()] = split[1];
            } else {
                targets[`tp${index + 1}`] = part;
            }
        });
    } else if (rawTargets && typeof rawTargets === 'object') {
        targets = rawTargets;
    }

    const symbol =
        trade.symbol ??
        trade.Symbol ??
        trade.pair ??
        vision.symbol ??
        vision.detected_pair ??
        vision.pair ??
        contentData?.pair ??
        analysis.symbol ??
        fallbackParent.symbol ??
        'Unknown';

    const tradeCall =
        trade.trade_call ??
        trade.tradeCall ??
        trade['Trade Call'] ??
        vision.trade_call ??
        vision['Trade Call'] ??
        analysis.trade_decision?.action ??
        analysis.market_assessment?.verdict ??
        fallbackParent.trade_call ??
        '—';

    const tradeType =
        trade.Trade ??
        trade.trade ??
        trade['Horizon'] ??
        vision.Trade ??
        vision.trade ??
        fallbackParent.Trade ??
        fallbackParent.trade ??
        'INTRADAY';

    const timeframe =
        trade.timeframe ??
        trade.Timeframe ??
        vision.timeframe ??
        vision.detected_timeframe ??
        contentData?.timeframe ??
        analysis.timeframe ??
        fallbackParent.timeframe ??
        '—';

    const confidence =
        trade.confidence ??
        trade.Confidence ??
        trade['Confidence'] ??
        vision.confidence ??
        vision.Confidence ??
        analysis.market_assessment?.confidence ??
        analysis.technical_score?.confidence ??
        fallbackParent.confidence ??
        '0%';

    const entry =
        trade.entry ??
        trade.Entry ??
        trade['Entry Zone'] ??
        vision.entry ??
        vision['Entry Zone'] ??
        vision.trader_actionable_zones?.entry_zone?.level_range ??
        analysis.trade_decision?.entry_zone?.entry_price ??
        fallbackParent.entry ??
        '—';

    const stopLoss =
        trade.stop_loss ??
        trade.Stop_loss ??
        trade.stopLoss ??
        trade['Stop-Loss'] ??
        vision.stop_loss ??
        vision['Stop-Loss'] ??
        vision.trader_actionable_zones?.stop_loss_zone?.level ??
        analysis.trade_decision?.stop_loss?.price ??
        fallbackParent.stop_loss ??
        '—';

    const riskReward =
        trade.risk_reward ??
        trade.Risk_reward ??
        trade['R:R'] ??
        vision.risk_reward ??
        vision['R:R'] ??
        analysis.trade_decision?.risk_reward_ratio ??
        fallbackParent.risk_reward ??
        '—';

    const rationale =
        trade.rationale ??
        trade.Rationale ??
        trade['Rationale'] ??
        vision.rationale ??
        vision['Rationale'] ??
        vision.overall_summary ??
        analysis.trade_decision?.rationale ??
        analysis.ai_summary?.headline ??
        fallbackParent.rationale ??
        '';

    const supportPrice =
        trade.Support_price ??
        trade.support_price ??
        vision.Support_price ??
        vision.support_price ??
        analysis.levels?.nearest_support ??
        analysis.pivot_points?.standard?.S1 ??
        fallbackParent.support_price ??
        fallbackParent.Support_price ??
        '—';

    const resistancePrice =
        trade.Resistance_price ??
        trade.resistance_price ??
        vision.Resistance_price ??
        vision.resistance_price ??
        analysis.levels?.nearest_resistance ??
        analysis.pivot_points?.standard?.R1 ??
        fallbackParent.resistance_price ??
        fallbackParent.Resistance_price ??
        '—';

    const currentPrice =
        trade.Current_price ??
        trade.current_price ??
        vision.Current_price ??
        vision.current_price ??
        analysis.current_price ??
        analysis.analysis_results?.price ??
        fallbackParent.current_price ??
        fallbackParent.Current_price ??
        '—';

    return {
        ...fallbackParent,
        ...trade,
        data: contentData || trade.data,
        vision_analysis: (vision && Object.keys(vision).length > 0) ? vision : trade.vision_analysis,
        analysis: (analysis && Object.keys(analysis).length > 0) ? analysis : trade.analysis,
        symbol,
        trade_call: tradeCall,
        Trade: tradeType,
        timeframe,
        confidence,
        entry,
        stop_loss: stopLoss,
        risk_reward: riskReward,
        rationale,
        targets,
        Support_price: supportPrice,
        Resistance_price: resistancePrice,
        Current_price: currentPrice,
    };
}

function unwrapAnalysisPayload(raw) {
    if (!raw || typeof raw !== 'object') return raw;
    if (Array.isArray(raw)) return raw;

    if (raw.Response && (typeof raw.Response === 'object' || Array.isArray(raw.Response))) {
        return raw.Response;
    }

    if (raw.response && (typeof raw.response === 'object' || Array.isArray(raw.response))) {
        return raw.response;
    }

    if (raw.data && typeof raw.data === 'object') {
        if (Array.isArray(raw.data)) return raw.data;
        if (raw.data.vision_analysis || raw.data.analysis || raw.data.pair || raw.data.symbol) {
            return {
                ...(raw.data.vision_analysis || {}),
                ...raw.data,
                analysis: raw.data.analysis || raw.analysis,
                vision_analysis: raw.data.vision_analysis || raw.vision_analysis,
            };
        }
    }

    return raw;
}

/**
 * Extract trade analysis from API / history payloads (supports ai_response, Response, etc.).
 * @returns {object[]}
 */
export function extractTradesFromPayload(payload) {
    if (!payload) return [];

    if (Array.isArray(payload)) {
        return payload.map(item => normalizeTradeRecord(item)).filter(Boolean);
    }

    if (typeof payload === 'string') {
        try {
            payload = JSON.parse(payload);
        } catch {
            return [];
        }
    }

    // If payload has a stringified content property (e.g. backend history row)
    let parsedContent = null;
    if (typeof payload.content === 'string') {
        try {
            parsedContent = JSON.parse(payload.content);
        } catch {
            parsedContent = null;
        }
    } else if (payload.content && typeof payload.content === 'object') {
        parsedContent = payload.content;
    }

    // Check if this payload is a direct database record with trade fields or content
    if (
        payload.symbol ||
        payload.trade_call ||
        payload.entry ||
        payload.stop_loss ||
        payload.targets ||
        payload.confidence ||
        payload.rationale ||
        parsedContent
    ) {
        const normalized = normalizeTradeRecord(payload);
        return normalized ? [normalized] : [];
    }

    let raw =
        payload.ai_response ??
        payload.aiResponse ??
        payload.Response ??
        payload.response ??
        payload.analysis ??
        payload.result ??
        payload.data ??
        payload;

    if (typeof raw === 'string') {
        try {
            raw = JSON.parse(raw);
        } catch {
            return [];
        }
    }

    raw = unwrapAnalysisPayload(raw);

    if (Array.isArray(raw)) {
        return raw.map(item => normalizeTradeRecord(item, payload)).filter(Boolean);
    }

    const normalized = normalizeTradeRecord(raw, payload);
    return normalized ? [normalized] : [];
}

const TRADE_SNAP_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * @param {Blob[]} fileBlobs - one for single mode, two for multi-timeframe
 * @param {string} [userId]
 */
export async function analyzeTradeScreenshots(fileBlobs, userId, _isRetry = false) {
    const activeRefresh = getActiveRefreshPromise();
    if (activeRefresh) {
        try {
            await activeRefresh;
        } catch (_) {}
    }

    let token = getAccessToken();
    if (!token) {
        token = await tryRefreshToken();
    }
    if (!token) throw new Error('Not authenticated. Please log in again.');

    const formData = new FormData();

    fileBlobs.forEach((blob, index) => {
        const name = fileBlobs.length > 1 ? `screenshot${index + 1}.png` : 'screenshot.png';
        formData.append('files', blob, name);
        if (index === 0) {
            formData.append('image', blob, name);
        }
    });

    const storedId =
        userId ||
        (typeof window !== 'undefined' ? localStorage.getItem('user_id') : null);
    if (storedId) {
        formData.append('user_id', storedId);
    }

    const timeoutMs = 75000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeoutMs);

    let res;
    try {
        try {
            res = await fetch(`${TRADE_SNAP_BASE}/api/v1/ai-snap`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: formData,
                signal: controller.signal,
            });

            // Fallback to /api/v1/analyze if /api/v1/ai-snap returns 404
            if (res.status === 404) {
                res = await fetch(`${TRADE_SNAP_BASE}/api/v1/analyze`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: formData,
                    signal: controller.signal,
                });
            }
        } catch (fetchErr) {
            if (fetchErr.name === 'AbortError' || controller.signal.aborted) {
                throw new Error('Analysis timed out after 75s. Server is under high load. Please retry.');
            }
            res = await fetch(`${TRADE_SNAP_BASE}/api/v1/analyze`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: formData,
                signal: controller.signal,
            });
        }
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError' || controller.signal.aborted) {
            throw new Error('Analysis timed out after 75s. Server is under high load. Please retry.');
        }
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const isAuthError = res.status === 401 || res.status === 403 ||
            (typeof data?.detail === 'string' && data.detail.toLowerCase().includes('token'));

        if (isAuthError && !_isRetry) {
            const newToken = await tryRefreshToken();
            if (newToken) {
                return analyzeTradeScreenshots(fileBlobs, userId, true);
            }
        }

        if (isAuthError) {
            clearAuthAndRedirect();
            const err = new Error('Session expired. Please log in again.');
            err.status = 401;
            throw err;
        }

        const err = new Error(data?.detail?.message || data?.message || data?.detail || 'Analysis request failed');
        err.detail = data?.detail;
        err.status = res.status;
        throw err;
    }

    if (data.user_id && typeof window !== 'undefined' && !localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', data.user_id);
    }

    const trades = extractTradesFromPayload(data);
    const ai_response = trades.length === 1 ? trades[0] : trades.length > 1 ? trades : null;

    const credits = extractAvailableCredits(data);
    if (credits !== null) {
        notifyCreditsUpdated(credits);
    } else {
        refreshCreditsFromServer();
    }

    return { ...data, ai_response };
}

export async function dataUrlToBlob(dataUrl) {
    const res = await fetch(dataUrl);
    return res.blob();
}

export function notifyBrowserTradeSnapReady(title = 'AI Chart Scanner', body = 'Your AI technical analysis & trade setup is ready!') {
    if (typeof window === 'undefined') return;
    try {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: '/favicon.ico',
            });
        }
    } catch (_) {}
}
