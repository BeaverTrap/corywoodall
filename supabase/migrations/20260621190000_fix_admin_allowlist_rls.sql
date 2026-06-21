-- Fix allowlist login check: authenticated users must be able to verify their own entry.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_allowlist
    WHERE lower(email) = lower(coalesce(auth.email(), auth.jwt() ->> 'email', ''))
  );
$$;

CREATE POLICY "Users can verify own allowlist entry"
  ON public.admin_allowlist
  FOR SELECT
  TO authenticated
  USING (
    lower(email) = lower(coalesce(auth.email(), auth.jwt() ->> 'email', ''))
  );
