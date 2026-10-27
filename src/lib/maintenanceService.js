import { supabase } from './supabaseClient';

let cachedStatus = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10000; // 10 seconds cache to prevent connection thrashing

/**
 * Checks if the platform is currently under maintenance.
 * Reads boolean string ('true' / 'false') from Supabase system_settings in real-time.
 */
export async function getMaintenanceStatus(force = false) {
  const now = Date.now();
  if (!force && cachedStatus && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedStatus;
  }

  const isEnvActive =
    process.env.MAINTENANCE_MODE === 'true' ||
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  let isSupabaseActive = false;

  try {
    if (supabase) {
      const queryPromise = supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Maintenance query timeout')), 2500)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (!error && data && data.value !== undefined && data.value !== null) {
        const raw = String(data.value).trim().toLowerCase();
        // Support direct boolean strings 'true' / 'false' as well as legacy JSON if any
        if (raw === 'true' || raw === '1' || raw === 'on') {
          isSupabaseActive = true;
        } else if (raw.includes('"is_enabled":true') || raw.includes('"is_enabled": true')) {
          isSupabaseActive = true;
        }
      }
    }
  } catch (err) {
    console.warn('[MaintenanceService] Error checking Supabase maintenance status:', err?.message || err);
  }

  const isActive = isEnvActive || isSupabaseActive;

  cachedStatus = {
    isActive,
    isEnvActive,
    isSupabaseActive,
    timestamp: now
  };

  lastFetchTime = now;
  return cachedStatus;
}

