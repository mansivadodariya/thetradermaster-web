-- ==============================================================================
-- Migration: Add Notifications to dashboard_tabs for dynamic Admin Panel control
-- ==============================================================================

-- 1. Ensure 'Notifications' tab exists in public.dashboard_tabs
INSERT INTO public.dashboard_tabs (name, is_visible, is_active, display_order)
VALUES ('Notifications', true, true, 15)
ON CONFLICT (name) 
DO UPDATE SET 
    is_visible = EXCLUDED.is_visible,
    is_active = EXCLUDED.is_active;

-- Optional helper query to turn off notifications:
-- UPDATE public.dashboard_tabs SET is_visible = false WHERE name = 'Notifications';

-- Optional helper query to turn on notifications:
-- UPDATE public.dashboard_tabs SET is_visible = true WHERE name = 'Notifications';
