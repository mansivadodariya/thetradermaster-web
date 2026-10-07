import { supabase } from '@/lib/supabaseClient';

/**
 * Checks if the "Under Maintenance Warning" tab/setting is enabled in Supabase `dashboard_tabs` table.
 * Returns true if maintenance mode is ON (is_visible = true), false otherwise.
 */
export async function fetchMaintenanceStatus() {
    if (!supabase) return false;
    try {
        const { data, error } = await supabase
            .from('dashboard_tabs')
            .select('name, is_visible')
            .ilike('name', '%under maintenance warning%')
            .maybeSingle();

        if (error) {
            console.warn('Error fetching maintenance status:', error);
            return false;
        }

        if (!data) return false;
        return Boolean(data.is_visible);
    } catch (err) {
        console.warn('Exception while fetching maintenance status:', err);
        return false;
    }
}
