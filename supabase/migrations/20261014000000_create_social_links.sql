-- Migration to create social_links table
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT UNIQUE NOT NULL,      -- e.g. 'discord', 'youtube', 'facebook', 'instagram', 'telegram', 'x'
    label TEXT NOT NULL,                 -- Display label, e.g. 'Discord', 'YouTube', etc.
    url TEXT NOT NULL,                   -- Destination link
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- 1. RLS Policy: Anyone can read active social links
DROP POLICY IF EXISTS "Allow public read access to active social links" ON public.social_links;
CREATE POLICY "Allow public read access to active social links" 
    ON public.social_links
    FOR SELECT 
    USING (is_active = true);

-- 2. RLS Policy: Allow all operations for authenticated / admin users
DROP POLICY IF EXISTS "Allow admin full access to social links" ON public.social_links;
CREATE POLICY "Allow admin full access to social links" 
    ON public.social_links
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Insert Seed Data (official TraderMaster links)
INSERT INTO public.social_links (platform, label, url, sort_order, is_active)
VALUES 
    ('x', 'X / Twitter', 'https://x.com/thetradermaster', 1, true),
    ('telegram', 'Telegram', 'https://t.me/thetradermaster', 2, true),
    ('youtube', 'YouTube', 'https://www.youtube.com/@thetradermaster', 3, true),
    ('instagram', 'Instagram', 'https://www.instagram.com/thetradermaster', 4, true),
    ('facebook', 'Facebook', 'https://www.facebook.com/profile.php?id=61594721187286', 5, true),
    ('discord', 'Discord', 'https://discord.gg/uPTwM59wY', 6, true)
ON CONFLICT (platform) 
DO UPDATE SET 
    url = EXCLUDED.url,
    label = EXCLUDED.label,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = now();

--------------------------------------------------------------------------------
-- RPC FUNCTIONS
--------------------------------------------------------------------------------

-- 1. RPC to get only active social links (for frontend footer / webapp)
CREATE OR REPLACE FUNCTION public.get_active_social_links()
RETURNS SETOF public.social_links
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT * 
    FROM public.social_links 
    WHERE is_active = true
    ORDER BY sort_order ASC;
$$;

-- 2. RPC to get all social links (for admin panel list)
CREATE OR REPLACE FUNCTION public.get_all_social_links_admin()
RETURNS SETOF public.social_links
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT * 
    FROM public.social_links
    ORDER BY sort_order ASC;
$$;

-- 3. RPC to upsert a social link (for admin panel create/edit)
CREATE OR REPLACE FUNCTION public.upsert_social_link(
    p_platform TEXT,
    p_label TEXT,
    p_url TEXT,
    p_is_active BOOLEAN,
    p_sort_order INTEGER
)
RETURNS public.social_links
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_link public.social_links;
BEGIN
    INSERT INTO public.social_links (platform, label, url, is_active, sort_order, updated_at)
    VALUES (p_platform, p_label, p_url, p_is_active, p_sort_order, now())
    ON CONFLICT (platform)
    DO UPDATE SET
        label = EXCLUDED.label,
        url = EXCLUDED.url,
        is_active = EXCLUDED.is_active,
        sort_order = EXCLUDED.sort_order,
        updated_at = now()
    RETURNING * INTO v_link;

    RETURN v_link;
END;
$$;

-- 4. RPC to toggle active status (for admin panel quick switch)
CREATE OR REPLACE FUNCTION public.toggle_social_link_status(
    p_platform TEXT,
    p_is_active BOOLEAN
)
RETURNS public.social_links
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_link public.social_links;
BEGIN
    UPDATE public.social_links
    SET is_active = p_is_active,
        updated_at = now()
    WHERE platform = p_platform
    RETURNING * INTO v_link;

    RETURN v_link;
END;
$$;
