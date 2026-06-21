-- Site-wide editable content (homepage, articles index, SEO)

CREATE TABLE public.site_sections (
  key text PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site sections"
  ON public.site_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins manage site sections"
  ON public.site_sections FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON public.site_sections TO anon, authenticated;
GRANT ALL ON public.site_sections TO authenticated;
