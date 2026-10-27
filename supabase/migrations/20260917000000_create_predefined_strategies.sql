-- ==============================================================================
-- Supabase RPC Function: get_predefined_strategy_cards
-- Table public.predefined_strategies already exists.
-- This function formats and aggregates the strategy rows into UI card properties.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_predefined_strategy_cards(
    p_symbol text DEFAULT NULL,
    p_timeframe text DEFAULT NULL,
    p_limit int DEFAULT 50
)
RETURNS TABLE (
    id uuid,
    strategy_name text,
    symbol text,
    timeframe text,
    category text,
    rank int,
    traders_count int,
    active_count int,
    risk_level text,
    timeframes jsonb,
    description text,
    total_pips numeric,
    win_rate numeric,
    wins int,
    losses int,
    avg_pips numeric,
    avg_confidence numeric,
    pair_breakdown jsonb,
    raw_strategy_json jsonb,
    created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH ranked_strategies AS (
        SELECT 
            ps.id,
            ps.strategy_name::text,
            ps.symbol::text,
            ps.timeframe::text,
            COALESCE(
                ps.raw_strategy_json->>'category', 
                ps.backtest_config->>'category', 
                'Institutional'
            )::text AS category,
            ROW_NUMBER() OVER (
                ORDER BY 
                    COALESCE((ps.overall_results->>'total_pips')::numeric, (ps.overall_results->>'pips')::numeric, 0) DESC,
                    COALESCE((ps.overall_results->>'win_rate')::numeric, (ps.overall_results->>'winrate')::numeric, 0) DESC
            )::int AS rank,
            COALESCE(
                (ps.raw_strategy_json->>'traders_count')::int, 
                (ps.backtest_config->>'traders_count')::int, 
                20
            )::int AS traders_count,
            COALESCE(
                (ps.raw_strategy_json->>'active_count')::int, 
                (ps.backtest_config->>'active_count')::int, 
                17
            )::int AS active_count,
            COALESCE(
                ps.raw_strategy_json->>'risk_level', 
                ps.backtest_config->>'risk_level', 
                'Conservative'
            )::text AS risk_level,
            COALESCE(
                ps.raw_strategy_json->'timeframes',
                ps.backtest_config->'timeframes',
                jsonb_build_array(UPPER(ps.timeframe))
            ) AS timeframes,
            COALESCE(
                ps.raw_strategy_json->>'description',
                ps.backtest_config->>'description',
                ps.strategy_name || ' algorithmic execution on ' || ps.symbol || ' (' || UPPER(ps.timeframe) || ') with institutional risk management.'
            )::text AS description,
            COALESCE(
                (ps.overall_results->>'total_pips')::numeric,
                (ps.overall_results->>'pips')::numeric,
                0.0
            ) AS total_pips,
            COALESCE(
                (ps.overall_results->>'win_rate')::numeric,
                (ps.overall_results->>'winrate')::numeric,
                0.0
            ) AS win_rate,
            COALESCE((ps.overall_results->>'wins')::int, 0) AS wins,
            COALESCE((ps.overall_results->>'losses')::int, 0) AS losses,
            COALESCE((ps.overall_results->>'avg_pips')::numeric, 0.0) AS avg_pips,
            COALESCE((ps.overall_results->>'avg_confidence')::numeric, (ps.overall_results->>'confidence')::numeric, 70.0) AS avg_confidence,
            COALESCE(
                ps.overall_results->'pair_breakdown', 
                ps.overall_results->'pairs',
                '[]'::jsonb
            ) AS pair_breakdown,
            ps.raw_strategy_json,
            ps.created_at
        FROM public.predefined_strategies ps
        WHERE 
            (p_symbol IS NULL OR ps.symbol ILIKE '%' || p_symbol || '%')
            AND (p_timeframe IS NULL OR ps.timeframe ILIKE '%' || p_timeframe || '%')
    )
    SELECT * FROM ranked_strategies
    ORDER BY rank ASC
    LIMIT p_limit;
END;
$$;

-- Grant execution permissions on RPC function
GRANT EXECUTE ON FUNCTION public.get_predefined_strategy_cards TO anon, authenticated, service_role;

-- Grant table access permissions and configure Row Level Security (RLS)
GRANT SELECT ON TABLE public.predefined_strategies TO anon, authenticated, service_role;

ALTER TABLE public.predefined_strategies ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'predefined_strategies' 
        AND policyname = 'Allow read access to predefined_strategies for all users'
    ) THEN
        CREATE POLICY "Allow read access to predefined_strategies for all users"
        ON public.predefined_strategies
        FOR SELECT
        TO anon, authenticated, service_role
        USING (true);
    END IF;
END $$;

-- Register tab permission in public.dashboard_tabs if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'dashboard_tabs'
    ) THEN
        INSERT INTO public.dashboard_tabs (name, is_visible)
        VALUES 
            ('Predefined Strategies', true),
            ('Signal Terminal', true),
            ('Strategy Signal', true),
            ('AI Trading Signal', true)
        ON CONFLICT (name) 
        DO UPDATE SET is_visible = EXCLUDED.is_visible;
    END IF;
END $$;

