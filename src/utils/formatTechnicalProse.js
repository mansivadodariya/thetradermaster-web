/**
 * formatTechnicalProse.js
 * 
 * Transforms raw backend technical indicator JSON payloads into
 * institutional, human-readable executive market briefings.
 */

export function isTechnicalJsonPayload(obj) {
    if (!obj || typeof obj !== 'object') return false;
    return Boolean(
        obj.mt5_analysis ||
        obj.trade_decision ||
        obj.technical_score ||
        obj.ai_summary ||
        obj.analysis_results ||
        obj.voting_scores ||
        obj.SMA_20 ||
        obj.EMA_20 ||
        obj.pivot_points ||
        obj.momentum_indicators ||
        obj.volatility_indicators
    );
}

export function formatTechnicalProse(input, defaultSymbol = 'XAU/USD') {
    if (!input) return '';

    let data = input;
    if (typeof input === 'string') {
        const trimmed = input.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            try {
                data = JSON.parse(trimmed);
            } catch {
                return input;
            }
        } else {
            return input;
        }
    }

    if (!data || typeof data !== 'object') return typeof input === 'string' ? input : '';

    // If it is vision analysis with prose summary
    if (data.overall_summary && typeof data.overall_summary === 'string') {
        return data.overall_summary;
    }

    if (!isTechnicalJsonPayload(data)) {
        return typeof input === 'string' ? input : '';
    }

    const mt5 = data.mt5_analysis || data;
    const decision = mt5.trade_decision || data.trade_decision || {};
    const techScore = mt5.technical_score || data.technical_score || {};
    const aiSummary = mt5.ai_summary || data.ai_summary || {};
    const analysis = data.analysis_results || mt5.analysis_results || {};
    const assessment = analysis.market_assessment || {};
    const trendAnalysis = mt5.trend_analysis || data.trend_analysis || {};
    const volumeAnalysis = mt5.volume_analysis || data.volume_analysis || {};
    const voting = data.voting_scores || mt5.voting_scores || {};
    const pivots = data.pivot_points?.standard || mt5.pivot_points?.standard || {};
    const currentPrice = analysis.price || data.current_price || data.value || null;
    const sym = analysis.symbol || data.symbol || defaultSymbol;

    const action = decision.action || data.action || assessment.verdict || 'NEUTRAL';
    const signalType = decision.signal_type || assessment.verdict || '';
    const conviction = decision.conviction || assessment.confidence || techScore.confidence || '';
    const scoreVal = techScore.total !== undefined ? `${techScore.total}/${techScore.max || 100}` : (voting.overall_score !== undefined ? `${voting.overall_score}/10` : '');
    const scoreLabel = techScore.label || (scoreVal ? 'Technical Score' : '');

    const lines = [];

    // 1. Header & Headline
    lines.push(`### Executive Trade Overview: ${sym}`);

    const headline = aiSummary.headline || decision.rationale || assessment.rationale || '';
    if (headline) {
        lines.push(`> **${headline}**\n`);
    }

    // 2. Primary Signal & Score
    const signalTokens = [];
    if (action) signalTokens.push(`**Signal**: \`${action}\``);
    if (signalType) signalTokens.push(`**Bias**: **${signalType}**`);
    if (conviction) signalTokens.push(`**Conviction**: **${conviction}**`);
    if (scoreVal) signalTokens.push(`**Score**: **${scoreVal}** ${scoreLabel ? `(${scoreLabel})` : ''}`);
    if (currentPrice) {
        const numPrice = Number(currentPrice);
        const formattedPrice = !isNaN(numPrice) ? `$${numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${currentPrice}`;
        signalTokens.push(`**Price**: **${formattedPrice}**`);
    }
    if (signalTokens.length > 0) {
        lines.push(`- ${signalTokens.join(' · ')}`);
    }

    // 3. Execution & Risk Parameters
    const execTokens = [];
    if (decision.entry_zone?.min_price && decision.entry_zone?.max_price) {
        execTokens.push(`**Entry Zone**: \`${decision.entry_zone.min_price} – ${decision.entry_zone.max_price}\``);
    }
    if (decision.stop_loss?.price) {
        const slReason = decision.stop_loss.invalidation_reason ? ` *(${decision.stop_loss.invalidation_reason})*` : '';
        execTokens.push(`**Stop Loss**: \`${decision.stop_loss.price}\`${slReason}`);
    }
    if (decision.risk_reward_ratio) {
        execTokens.push(`**R:R**: **${decision.risk_reward_ratio}**`);
    }
    if (Array.isArray(decision.take_profit_targets) && decision.take_profit_targets.length > 0) {
        const tpStr = decision.take_profit_targets.map((tp, idx) => {
            const key = `tp${idx + 1}`;
            const target = tp[key] || tp;
            return target.price ? `TP${idx + 1}: \`${target.price}\`` : '';
        }).filter(Boolean).join(' · ');
        if (tpStr) execTokens.push(`**Targets**: ${tpStr}`);
    }
    if (execTokens.length > 0) {
        lines.push(`- ${execTokens.join(' | ')}`);
    }

    // 4. Technical Structure & Order Flow
    const techBullets = [];
    const trendText = aiSummary.trend || trendAnalysis.strength || trendAnalysis.direction || '';
    const momentumText = aiSummary.momentum || assessment.momentum || '';
    const volumeText = aiSummary.volume || (volumeAnalysis.pressure ? `${volumeAnalysis.pressure.buy_pct}% Buy / ${volumeAnalysis.pressure.sell_pct}% Sell` : '');

    if (trendText) techBullets.push(`**Trend**: ${trendText}`);
    if (momentumText) techBullets.push(`**Momentum**: ${momentumText}`);
    if (volumeText) techBullets.push(`**Order Flow**: ${volumeText}`);
    if (techBullets.length > 0) {
        lines.push(`- ${techBullets.join(' | ')}`);
    }

    // 5. Critical Levels & Pivots
    const levelsText = aiSummary.levels || '';
    if (levelsText) {
        lines.push(`- **Key Levels**: ${levelsText}`);
    } else if (pivots.P) {
        const s = pivots.S1 || pivots.S2;
        const r = pivots.R1 || pivots.R2;
        lines.push(`- **Pivot Levels**: Pivot: \`${pivots.P}\`${s ? ` · Support: \`${s}\`` : ''}${r ? ` · Resistance: \`${r}\`` : ''}`);
    }

    // 6. Risk Level
    if (aiSummary.risk_level) {
        lines.push(`- **Risk Level**: **${String(aiSummary.risk_level).toUpperCase()}**`);
    }

    return lines.join('\n');
}

export default formatTechnicalProse;
