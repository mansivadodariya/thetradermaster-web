'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const SOCIAL_PLATFORM_META = {
    x: {
        platform: 'x',
        label: 'X / Twitter',
        defaultUrl: 'https://x.com/ChronosX_Official',
        icon: '/assets/icons/twitter.svg',
        brandColor: '#0F1419',
        darkColor: '#FFFFFF',
        lightColor: '#0F1419',
        hoverBg: 'rgba(15, 20, 25, 0.08)',
        glow: 'rgba(0, 0, 0, 0.25)',
    },
    telegram: {
        platform: 'telegram',
        label: 'Telegram',
        defaultUrl: 'https://t.me/chronosxofficial',
        icon: '/assets/icons/telegram.svg',
        brandColor: '#24A1DE',
        darkColor: '#24A1DE',
        lightColor: '#24A1DE',
        hoverBg: 'rgba(36, 161, 222, 0.12)',
        glow: 'rgba(36, 161, 222, 0.45)',
    },
    youtube: {
        platform: 'youtube',
        label: 'YouTube',
        defaultUrl: 'https://www.youtube.com/@Chronosx_Official',
        icon: '/assets/icons/youtube.svg',
        brandColor: '#FF0000',
        darkColor: '#FF0000',
        lightColor: '#FF0000',
        hoverBg: 'rgba(255, 0, 0, 0.12)',
        glow: 'rgba(255, 0, 0, 0.45)',
    },
    instagram: {
        platform: 'instagram',
        label: 'Instagram',
        defaultUrl: 'https://www.instagram.com/chronosx_official/',
        icon: '/assets/icons/instagram.svg',
        brandColor: '#E1306C',
        darkColor: '#E1306C',
        lightColor: '#E1306C',
        gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        hoverBg: 'rgba(225, 48, 108, 0.12)',
        glow: 'rgba(225, 48, 108, 0.45)',
    },
    facebook: {
        platform: 'facebook',
        label: 'Facebook',
        defaultUrl: 'https://www.facebook.com/profile.php?id=61594721187286',
        icon: '/assets/icons/facebook.svg',
        brandColor: '#1877F2',
        darkColor: '#1877F2',
        lightColor: '#1877F2',
        hoverBg: 'rgba(24, 119, 242, 0.12)',
        glow: 'rgba(24, 119, 242, 0.45)',
    },
    discord: {
        platform: 'discord',
        label: 'Discord',
        defaultUrl: 'https://discord.gg/uPTwM59wY',
        icon: '/assets/icons/discord.svg',
        brandColor: '#5865F2',
        darkColor: '#5865F2',
        lightColor: '#5865F2',
        hoverBg: 'rgba(88, 101, 242, 0.12)',
        glow: 'rgba(88, 101, 242, 0.45)',
    },
};

export const DEFAULT_SOCIAL_LINKS = [
    { ...SOCIAL_PLATFORM_META.x, href: SOCIAL_PLATFORM_META.x.defaultUrl },
    { ...SOCIAL_PLATFORM_META.telegram, href: SOCIAL_PLATFORM_META.telegram.defaultUrl },
    { ...SOCIAL_PLATFORM_META.youtube, href: SOCIAL_PLATFORM_META.youtube.defaultUrl },
    { ...SOCIAL_PLATFORM_META.instagram, href: SOCIAL_PLATFORM_META.instagram.defaultUrl },
    { ...SOCIAL_PLATFORM_META.facebook, href: SOCIAL_PLATFORM_META.facebook.defaultUrl },
    { ...SOCIAL_PLATFORM_META.discord, href: SOCIAL_PLATFORM_META.discord.defaultUrl },
];

export const NON_SOCIAL_PLATFORMS = new Set([
    'email',
    'contact_email',
    'support_email',
    'phone',
    'contact_phone',
    'whatsapp',
    'contact_whatsapp',
    'tel',
    'address',
    'contact_address',
    'office_address',
    'location',
]);

function mapDatabaseRowsToSocialLinks(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
        return DEFAULT_SOCIAL_LINKS;
    }

    const mapped = rows
        .filter((row) => {
            if (!row || row.is_active === false) return false;
            const key = String(row.platform || '').trim().toLowerCase();
            if (!key || NON_SOCIAL_PLATFORMS.has(key)) return false;
            const url = String(row.url || '').trim().toLowerCase();
            if (url.startsWith('mailto:') || url.startsWith('tel:')) return false;
            // Only allow valid social platforms
            return Boolean(SOCIAL_PLATFORM_META[key]);
        })
        .map((row) => {
            const key = String(row.platform || '').trim().toLowerCase();
            const meta = SOCIAL_PLATFORM_META[key];

            return {
                ...meta,
                label: row.label || meta.label,
                href: row.url || meta.defaultUrl,
                sortOrder: row.sort_order ?? 0,
            };
        });

    return mapped.length > 0 ? mapped : DEFAULT_SOCIAL_LINKS;
}

export async function fetchActiveSocialLinks() {
    if (!supabase) return DEFAULT_SOCIAL_LINKS;
    try {
        const { data, error } = await supabase
            .from('social_links')
            .select('platform, label, url, is_active, sort_order')
            .eq('is_active', true)
            .not('platform', 'in', '("email","contact_email","support_email","phone","contact_phone","tel","address","contact_address","office_address","location")')
            .order('sort_order', { ascending: true });

        if (error || !data || data.length === 0) {
            return DEFAULT_SOCIAL_LINKS;
        }
        return mapDatabaseRowsToSocialLinks(data);
    } catch (err) {
        console.warn('Failed to load social links from Supabase, using defaults:', err);
        return DEFAULT_SOCIAL_LINKS;
    }
}

export function useSocialLinks() {
    const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadLinks = async () => {
            setLoading(true);
            try {
                const data = await fetchActiveSocialLinks();
                if (isMounted && Array.isArray(data) && data.length > 0) {
                    setSocialLinks(data);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadLinks();

        // Optional realtime subscription when Supabase is available
        let channel = null;
        if (supabase) {
            try {
                channel = supabase
                    .channel('public:social_links')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'social_links' },
                        () => {
                            loadLinks();
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

    return { socialLinks, loading };
}
