/**
 * Bot Formatting and Normalization Helpers
 */

export const parseWinRateFromStrategy = (item) => {
    if (!item) return '0.0%';
    if (item.win_rate_percentage !== undefined && item.win_rate_percentage !== null && !isNaN(Number(item.win_rate_percentage))) {
        return `${Number(item.win_rate_percentage).toFixed(1)}%`;
    }
    if (item.win_rate !== undefined && item.win_rate !== null && item.win_rate !== '') {
        if (typeof item.win_rate === 'string' && item.win_rate.includes('%')) {
            return item.win_rate;
        }
        if (!isNaN(Number(item.win_rate))) {
            const val = Number(item.win_rate);
            return val > 0 && val <= 1 ? `${(val * 100).toFixed(1)}%` : `${val.toFixed(1)}%`;
        }
    }
    if (item.winRate !== undefined && item.winRate !== null && item.winRate !== '') {
        if (typeof item.winRate === 'string' && item.winRate.includes('%')) {
            return item.winRate;
        }
        if (!isNaN(Number(item.winRate))) {
            const val = Number(item.winRate);
            return val > 0 && val <= 1 ? `${(val * 100).toFixed(1)}%` : `${val.toFixed(1)}%`;
        }
    }
    if (item.winrate !== undefined && item.winrate !== null && item.winrate !== '') {
        if (typeof item.winrate === 'string' && item.winrate.includes('%')) {
            return item.winrate;
        }
        if (!isNaN(Number(item.winrate))) {
            const val = Number(item.winrate);
            return val > 0 && val <= 1 ? `${(val * 100).toFixed(1)}%` : `${val.toFixed(1)}%`;
        }
    }
    if ((item.wins !== undefined && item.wins !== null) || (item.total_trades || item.trades)) {
        const wins = Number(item.wins) || 0;
        const total = Number(item.total_trades || item.trades || (wins + (Number(item.losses) || 0))) || 0;
        return total > 0 ? `${((wins / total) * 100).toFixed(1)}%` : '0.0%';
    }
    return '0.0%';
};

export const parsePnlFromStrategy = (item) => {
    if (!item) return '+$0.00';
    if (item.pnl !== undefined && item.pnl !== null && !isNaN(Number(item.pnl))) {
        const val = Number(item.pnl);
        return val >= 0 ? `+$${val.toFixed(2)}` : `-$${Math.abs(val).toFixed(2)}`;
    }
    if (item.total_pnl !== undefined && item.total_pnl !== null && item.total_pnl !== '') {
        if (typeof item.total_pnl === 'string' && (item.total_pnl.includes('$') || item.total_pnl.includes('+') || item.total_pnl.includes('-'))) {
            return item.total_pnl;
        }
        if (!isNaN(Number(item.total_pnl))) {
            const val = Number(item.total_pnl);
            return val >= 0 ? `+$${val.toFixed(2)}` : `-$${Math.abs(val).toFixed(2)}`;
        }
    }
    if (item.totalPnl !== undefined && item.totalPnl !== null && item.totalPnl !== '') {
        if (typeof item.totalPnl === 'string' && (item.totalPnl.includes('$') || item.totalPnl.includes('+') || item.totalPnl.includes('-'))) {
            return item.totalPnl;
        }
        if (!isNaN(Number(item.totalPnl))) {
            const val = Number(item.totalPnl);
            return val >= 0 ? `+$${val.toFixed(2)}` : `-$${Math.abs(val).toFixed(2)}`;
        }
    }
    return '+$0.00';
};

export const parseProfitFactorFromStrategy = (item) => {
    if (!item) return '1.00';
    if (item.profit_factor !== undefined && item.profit_factor !== null && !isNaN(Number(item.profit_factor))) {
        return Number(item.profit_factor).toFixed(2);
    }
    if (item.profitFactor !== undefined && item.profitFactor !== null && !isNaN(Number(item.profitFactor))) {
        return Number(item.profitFactor).toFixed(2);
    }
    return '1.00';
};

export const parseCreationType = (item) => {
    if (!item) return 'ai';
    const cType = item.creation_type || item.creationType || item.created_by || item.builder_type || item.source_type;
    if (cType) {
        const lower = String(cType).toLowerCase();
        if (lower.includes('manual') || lower.includes('custom') || lower.includes('rule')) {
            return 'manual';
        }
        if (lower.includes('ai') || lower.includes('advisor') || lower.includes('copilot') || lower.includes('chat')) {
            return 'ai';
        }
    }
    const typeStr = String(item.type || item.strategy_type || item.category || '').toLowerCase();
    if (typeStr.includes('custom') || typeStr.includes('manual')) {
        return 'manual';
    }
    return 'ai';
};

export const mapStrategyToBot = (item, idx) => {
    const id = item.strategy_id || item.id || `strat_${idx}_${Date.now()}`;
    const name = item.strategy_name || item.name || `AI Strategy #${idx + 1}`;
    const symbol = item.symbol || (Array.isArray(item.stock_name) ? item.stock_name[0] : item.stock_name) || 'BTCUSD';
    const timeframe = item.timeframe || item.interval || '15min';
    const type = item.strategy_type
        ? item.strategy_type.replace(/_/g, ' ').toUpperCase()
        : (item.pattern || item.category || 'AI GENERATED');
    const direction = item.direction || (item.entry_type === 1 ? 'Short' : 'Long');
    const isActive = item.is_active !== undefined ? Boolean(item.is_active) : true;
    const sl = item.sl || (item.stoploss_pips ? `${item.stoploss_pips} pips` : null) || '50.0 pts';
    const tp = item.tp || (item.target_pips ? `${item.target_pips} pips` : null) || '50.0 pts';
    const riskReward = item.risk_reward || '1:1.0';
    const lots = item.lots || item.quantity || 0.01;
    const pattern = item.pattern || item.entry_pattern || '';
    const description = item.description || item.trade_reasoning?.rationale || 'Algorithmic quantitative strategy.';
    const createdAt = item.created_at || item.updated_at || '';
    const creationType = parseCreationType(item);

    const winRate = parseWinRateFromStrategy(item);
    const totalPnl = parsePnlFromStrategy(item);
    const profitFactor = parseProfitFactorFromStrategy(item);

    return {
        id,
        strategyId: item.strategy_id || item.id,
        name,
        symbol,
        timeframe,
        type,
        direction,
        status: isActive ? 'active' : 'paused',
        sl,
        tp,
        riskReward,
        lots,
        pattern,
        description,
        createdAt,
        creationType,
        creation_type: creationType,
        winRate,
        profitFactor,
        totalPnl,
        rawStrategy: item,
        source: 'api'
    };
};
