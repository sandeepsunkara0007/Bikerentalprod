-- Quick connectivity check table
-- Run this in Supabase SQL Editor (or via Supabase CLI migrations)
CREATE TABLE IF NOT EXISTS public.connection_check (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.connection_check ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read rows (safe for simple connectivity checks)
DROP POLICY IF EXISTS "Anyone can view connection_check" ON public.connection_check;
CREATE POLICY "Anyone can view connection_check"
  ON public.connection_check
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own check rows
DROP POLICY IF EXISTS "Authenticated users can insert connection_check" ON public.connection_check;
CREATE POLICY "Authenticated users can insert connection_check"
  ON public.connection_check
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
