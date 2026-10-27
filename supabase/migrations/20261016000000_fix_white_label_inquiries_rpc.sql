-- ==============================================================================
-- Migration: Fix white_label_inquiries RPC & RLS Policies
-- Description:
--   1. Ensures table public.white_label_inquiries exists with correct schema.
--   2. Enables Row Level Security (RLS) with INSERT policy for public/anon submissions.
--   3. Replaces submit_white_label_inquiry RPC to properly convert JSONB arrays into
--      PostgreSQL text[] to prevent: "column capabilities is of type text[] but expression is of type jsonb".
-- ==============================================================================

-- 1. Ensure Table Structure
CREATE TABLE IF NOT EXISTS public.white_label_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  company_name text NOT NULL,
  email text NULL,
  phone text NOT NULL,
  country text NOT NULL,
  website text NULL,
  business_type text NOT NULL,
  active_users text NOT NULL,
  capabilities text[] NOT NULL DEFAULT '{}'::text[],
  message text NULL,
  status text NOT NULL DEFAULT 'unread'::text,
  admin_notes text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT white_label_inquiries_pkey PRIMARY KEY (id),
  CONSTRAINT white_label_inquiries_status_check CHECK (
    status = ANY (
      ARRAY[
        'unread'::text,
        'contacted'::text,
        'in_discussion'::text,
        'closed'::text,
        'archived'::text
      ]
    )
  )
);

-- Indexes for Admin Dashboard performance
CREATE INDEX IF NOT EXISTS idx_white_label_inquiries_created_at ON public.white_label_inquiries USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_white_label_inquiries_status ON public.white_label_inquiries USING btree (status);
CREATE INDEX IF NOT EXISTS idx_white_label_inquiries_business_type ON public.white_label_inquiries USING btree (business_type);

-- 2. Row Level Security (RLS) Policies
ALTER TABLE public.white_label_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public / anon users to submit new inquiries
DROP POLICY IF EXISTS "Allow anonymous submission of white label inquiries" ON public.white_label_inquiries;
CREATE POLICY "Allow anonymous submission of white label inquiries"
  ON public.white_label_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role full access for admin backend
DROP POLICY IF EXISTS "Allow service role full access to white label inquiries" ON public.white_label_inquiries;
CREATE POLICY "Allow service role full access to white label inquiries"
  ON public.white_label_inquiries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Stored Procedure / RPC Function with Proper Array Conversion
CREATE OR REPLACE FUNCTION public.submit_white_label_inquiry(
  p_full_name text,
  p_company_name text,
  p_email text,
  p_phone text,
  p_country text,
  p_website text DEFAULT NULL,
  p_business_type text DEFAULT 'Other',
  p_active_users text DEFAULT '1,000 - 10,000',
  p_capabilities jsonb DEFAULT '[]'::jsonb,
  p_message text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_capabilities text[];
  v_new_id uuid;
BEGIN
  -- Safely convert jsonb array into PostgreSQL text[] array
  IF p_capabilities IS NOT NULL AND jsonb_typeof(p_capabilities) = 'array' THEN
    SELECT COALESCE(array_agg(value::text), '{}'::text[])
    INTO v_capabilities
    FROM (
      SELECT jsonb_array_elements_text(p_capabilities) AS value
    ) sub;
  ELSE
    v_capabilities := '{}'::text[];
  END IF;

  INSERT INTO public.white_label_inquiries (
    full_name,
    company_name,
    email,
    phone,
    country,
    website,
    business_type,
    active_users,
    capabilities,
    message,
    status,
    created_at,
    updated_at
  ) VALUES (
    TRIM(p_full_name),
    TRIM(p_company_name),
    TRIM(p_email),
    TRIM(p_phone),
    TRIM(p_country),
    NULLIF(TRIM(p_website), ''),
    p_business_type,
    p_active_users,
    v_capabilities,
    NULLIF(TRIM(p_message), ''),
    'unread',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'id', v_new_id,
    'message', 'White label inquiry submitted successfully'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.submit_white_label_inquiry TO anon, authenticated, service_role;
