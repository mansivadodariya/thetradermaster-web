-- ==============================================================================
-- Migration: Update Dashboard Tabs Table with Standardized Tool Names
-- ==============================================================================

-- 1. Ensure table exists
CREATE TABLE IF NOT EXISTS public.dashboard_tabs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT true
);

-- 2. Clean up old/deprecated tab names
DELETE FROM public.dashboard_tabs
WHERE name IN (
    'AI Trade',
    'AI Chat',
    'AI Strategy',
    'AI Trade Analysis',
    'Trade Analysis',
    'Trade Snap',
    'AI Assistant'
);

-- 3. Upsert the canonical set of 12 standard dashboard tabs
INSERT INTO public.dashboard_tabs (name, is_visible)
VALUES 
    ('Dashboard', true),
    ('AI Chart Scanner', true),
    ('AI Trade Audit', true),
    ('AI Market Assistant', true),
    ('Strategy Hub', true),
    ('Live Market Scanner', true),
    ('Economic Calendar', true),
    ('Forex Calculator', true),
    ('Market News', true),
    ('Credit History', true),
    ('Subscription Plans', true),
    ('Broker', true),
    ('Profile', true)
ON CONFLICT (name) 
DO UPDATE SET 
    is_visible = EXCLUDED.is_visible;

-- 4. Recreate/Verify get_visible_dashboard_tabs RPC
CREATE OR REPLACE FUNCTION public.get_visible_dashboard_tabs()
RETURNS SETOF public.dashboard_tabs
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT * 
    FROM public.dashboard_tabs 
    WHERE is_visible = true;
$$;
