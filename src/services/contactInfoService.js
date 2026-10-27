'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const DEFAULT_CONTACT_INFO = {
    email: {
        platform: 'email',
        label: 'EMAIL',
        value: 'support@thetradermaster.com',
        helper: 'Average response time: < 15 mins',
    },
    phone: {
        platform: 'phone',
        label: 'PHONE',
        value: '+971 56 884 0900',
        helper: 'WhatsApp & Phone Support (24/7)',
    },
    whatsapp: {
        platform: 'whatsapp',
        label: 'WHATSAPP',
        value: '+971 56 884 0900',
        helper: 'WhatsApp & Phone Support (24/7)',
    },
    address: {
        platform: 'address',
        label: 'OFFICE ADDRESS',
        value: 'Dubai, UAE',
        helper: 'Global Financial Intelligence Centre',
    },
};

function parseContactValueAndHelper(rawUrl, defaultHelper) {
    if (!rawUrl || typeof rawUrl !== 'string') {
        return { value: '', helper: defaultHelper };
    }

    const trimmed = rawUrl.trim();
    if (trimmed.includes('|')) {
        const [val, help] = trimmed.split('|');
        return {
            value: (val || '').trim(),
            helper: (help || '').trim() || defaultHelper,
        };
    }

    return {
        value: trimmed,
        helper: defaultHelper,
    };
}

function mapDatabaseRowsToContactInfo(rows) {
    const result = {
        email: { ...DEFAULT_CONTACT_INFO.email },
        phone: { ...DEFAULT_CONTACT_INFO.phone },
        whatsapp: { ...DEFAULT_CONTACT_INFO.whatsapp },
        address: { ...DEFAULT_CONTACT_INFO.address },
    };

    if (!Array.isArray(rows) || rows.length === 0) {
        return result;
    }

    rows.forEach((row) => {
        if (!row || row.is_active === false) return;
        const platform = String(row.platform || '').trim().toLowerCase();

        if (platform === 'email' || platform === 'contact_email') {
            const raw = String(row.url || '').replace(/^mailto:/i, '');
            const parsed = parseContactValueAndHelper(raw, DEFAULT_CONTACT_INFO.email.helper);
            result.email = {
                platform: 'email',
                label: row.label?.trim() || DEFAULT_CONTACT_INFO.email.label,
                value: parsed.value || DEFAULT_CONTACT_INFO.email.value,
                helper: parsed.helper,
            };
        } else if (platform === 'phone' || platform === 'contact_phone') {
            const raw = String(row.url || '').replace(/^tel:/i, '');
            const parsed = parseContactValueAndHelper(raw, DEFAULT_CONTACT_INFO.phone.helper);
            result.phone = {
                platform: 'phone',
                label: row.label?.trim() || DEFAULT_CONTACT_INFO.phone.label,
                value: parsed.value || DEFAULT_CONTACT_INFO.phone.value,
                helper: parsed.helper,
            };
        } else if (platform === 'whatsapp' || platform === 'contact_whatsapp') {
            const raw = String(row.url || '').replace(/^tel:/i, '');
            const parsed = parseContactValueAndHelper(raw, DEFAULT_CONTACT_INFO.whatsapp.helper);
            result.whatsapp = {
                platform: 'whatsapp',
                label: row.label?.trim() || DEFAULT_CONTACT_INFO.whatsapp.label,
                value: parsed.value || DEFAULT_CONTACT_INFO.whatsapp.value,
                helper: parsed.helper,
            };
        } else if (platform === 'address' || platform === 'contact_address' || platform === 'office_address') {
            const raw = String(row.url || '');
            const parsed = parseContactValueAndHelper(raw, DEFAULT_CONTACT_INFO.address.helper);
            result.address = {
                platform: 'address',
                label: row.label?.trim() || DEFAULT_CONTACT_INFO.address.label,
                value: parsed.value || DEFAULT_CONTACT_INFO.address.value,
                helper: parsed.helper,
            };
        }
    });

    return result;
}

export async function fetchContactInfo() {
    if (!supabase) return DEFAULT_CONTACT_INFO;

    try {
        const { data, error } = await supabase
            .from('social_links')
            .select('platform, label, url, is_active, sort_order')
            .in('platform', ['email', 'contact_email', 'phone', 'contact_phone', 'whatsapp', 'contact_whatsapp', 'address', 'contact_address', 'office_address'])
            .eq('is_active', true);

        if (error || !data || data.length === 0) {
            return DEFAULT_CONTACT_INFO;
        }

        return mapDatabaseRowsToContactInfo(data);
    } catch (err) {
        console.warn('Failed to load contact info from Supabase social_links, using defaults:', err);
        return DEFAULT_CONTACT_INFO;
    }
}

export function useContactInfo() {
    const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadInfo = async () => {
            setLoading(true);
            try {
                const data = await fetchContactInfo();
                if (isMounted && data) {
                    setContactInfo(data);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadInfo();

        let channel = null;
        if (supabase) {
            try {
                channel = supabase
                    .channel('public:contact_info_social_links')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'social_links' },
                        () => {
                            loadInfo();
                        }
                    )
                    .subscribe();
            } catch (_) {}
        }

        return () => {
            isMounted = false;
            if (channel && supabase) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    return { contactInfo, loading };
}
