-- ==============================================================================
-- Migration: Add AI Bot Builder to Dashboard Tabs
-- ==============================================================================

INSERT INTO public.dashboard_tabs (name, is_visible)
VALUES 
    ('AI Bot Builder', true),
    ('Strategy Studio', true)
ON CONFLICT (name) 
DO UPDATE SET 
    is_visible = EXCLUDED.is_visible;

DELETE FROM public.dashboard_tabs WHERE name = 'Custom Bot Builder';
