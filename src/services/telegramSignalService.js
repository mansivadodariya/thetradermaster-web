import { telegramSignalApi } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';

const DEFAULT_TELEGRAM_URL = 'https://t.me/TraderMaster_Signals';

/**
 * Fetch the public Telegram bot config.
 * Queries Supabase social_links first for dynamic admin configuration,
 * then merges with backend Telegram bot config.
 * Returns { enabled, bot_username, channel_url }.
 */
export async function fetchTelegramConfig() {
    let channelUrl = DEFAULT_TELEGRAM_URL;
    let botUsername = 'TraderMasterSignalBot';
    let enabled = true;

    // 1. Fetch dynamic link from Supabase social_links table
    if (supabase) {
        try {
            const { data } = await supabase
                .from('social_links')
                .select('platform, url, is_active')
                .in('platform', ['telegram_signals', 'telegram_channel', 'telegram'])
                .eq('is_active', true);

            if (Array.isArray(data) && data.length > 0) {
                // Priority: telegram_signals > telegram_channel > telegram
                const match = data.find((r) => r.platform === 'telegram_signals') ||
                              data.find((r) => r.platform === 'telegram_channel') ||
                              data.find((r) => r.platform === 'telegram');
                if (match?.url && typeof match.url === 'string') {
                    channelUrl = match.url.trim();
                }
            }
        } catch (err) {
            console.warn('Failed to load Telegram channel URL from Supabase:', err);
        }
    }

    // 2. Query bot API for runtime bot metadata
    try {
        const res = await telegramSignalApi.getConfig();
        if (res?.data) {
            enabled = res.data.enabled !== false;
            if (res.data.bot_username) botUsername = res.data.bot_username;
            if (res.data.channel_url) channelUrl = res.data.channel_url;
        }
    } catch {
        // Fall back gracefully to Supabase / default values
    }

    return {
        enabled,
        bot_username: botUsername,
        channel_url: channelUrl
    };
}

/**
 * Fetch the authed user's connection status + subscribed symbols.
 * Returns a normalised status object.
 */
export async function fetchTelegramStatus() {
    try {
        const res = await telegramSignalApi.getStatus();
        const d = res?.data ?? {};
        return {
            is_connected: Boolean(d.is_connected),
            telegram_chat_id: d.telegram_chat_id ?? null,
            telegram_username: d.telegram_username ?? null,
            auth_method: d.auth_method ?? null,
            subscribed_symbols: Array.isArray(d.subscribed_symbols) ? d.subscribed_symbols : [],
            subscribed_strategies: Array.isArray(d.subscribed_strategies) ? d.subscribed_strategies : [],
        };
    } catch {
        return {
            is_connected: false,
            telegram_chat_id: null,
            telegram_username: null,
            auth_method: null,
            subscribed_symbols: [],
            subscribed_strategies: [],
        };
    }
}

/**
 * Toggle a symbol/strategy subscription.
 *
 * Returns:
 *   { ok: true, data } on success
 *   { ok: false, requireConnection: true, symbol, strategy_id } when the user hasn't connected Telegram yet
 *   { ok: false, error: string } on any other failure
 */
export async function toggleNotifyMe({ symbol, strategy_id, is_active }) {
    try {
        const res = await telegramSignalApi.toggle({ symbol, strategy_id, is_active });
        return { ok: true, data: res?.data ?? {} };
    } catch (err) {
        // 400 with require_connection flag
        const detail = err?.detail ?? err?.data?.detail ?? {};
        if (detail?.require_connection) {
            return {
                ok: false,
                requireConnection: true,
                symbol: detail.symbol ?? symbol,
                strategy_id: detail.strategy_id ?? strategy_id,
            };
        }
        return { ok: false, error: err?.message ?? 'Failed to toggle notification.' };
    }
}

/**
 * Generate a fresh deep-link + OTP token for the Connect Telegram modal.
 * Returns the `data` payload on success, or throws.
 */
export async function generateConnectToken({ symbol, strategy_id }) {
    const res = await telegramSignalApi.connectToken({ symbol, strategy_id });
    return res?.data ?? {};
}

/**
 * Manual OTP fallback verification.
 */
export async function manualVerifyOtp({ otp_code, chat_id, telegram_username }) {
    const res = await telegramSignalApi.manualVerify({ otp_code, chat_id, telegram_username });
    return res;
}

/**
 * Disconnect / unlink the Telegram account.
 */
export async function disconnectTelegram() {
    const res = await telegramSignalApi.disconnect();
    return res;
}
