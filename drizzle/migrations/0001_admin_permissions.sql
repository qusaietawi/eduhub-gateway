-- Granular admin permission areas
CREATE TYPE public.admin_permission AS ENUM ('content', 'submissions', 'settings');

CREATE TABLE public.user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  permission public.admin_permission NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, permission)
);

GRANT SELECT ON public.user_permissions TO authenticated;
GRANT ALL ON public.user_permissions TO service_role;

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission public.admin_permission)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
      OR EXISTS (
        SELECT 1 FROM public.user_permissions
        WHERE user_id = _user_id AND permission = _permission
      )
$$;

CREATE OR REPLACE FUNCTION public.can_manage(_permission public.admin_permission)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_permission(auth.uid(), _permission)
$$;

CREATE POLICY "own permissions readable" ON public.user_permissions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Content area: services, features, blog, gallery, faqs
CREATE POLICY "content editors manage services" ON public.services
  FOR ALL TO authenticated USING (public.can_manage('content')) WITH CHECK (public.can_manage('content'));
CREATE POLICY "content editors manage features" ON public.features
  FOR ALL TO authenticated USING (public.can_manage('content')) WITH CHECK (public.can_manage('content'));
CREATE POLICY "content editors manage posts" ON public.blog_posts
  FOR ALL TO authenticated USING (public.can_manage('content')) WITH CHECK (public.can_manage('content'));
CREATE POLICY "content editors manage categories" ON public.blog_categories
  FOR ALL TO authenticated USING (public.can_manage('content')) WITH CHECK (public.can_manage('content'));
CREATE POLICY "content editors manage albums" ON public.albums
  FOR ALL TO authenticated USING (public.can_manage('content')) WITH CHECK (public.can_manage('content'));
CREATE POLICY "content editors manage album images" ON public.album_images
  FOR ALL TO authenticated USING (public.can_manage('content')) WITH CHECK (public.can_manage('content'));
CREATE POLICY "content editors manage faqs" ON public.faqs
  FOR ALL TO authenticated USING (public.can_manage('content')) WITH CHECK (public.can_manage('content'));

-- Settings area: static pages and team
CREATE POLICY "settings managers manage pages" ON public.site_pages
  FOR ALL TO authenticated USING (public.can_manage('settings')) WITH CHECK (public.can_manage('settings'));
CREATE POLICY "settings managers manage team" ON public.team_members
  FOR ALL TO authenticated USING (public.can_manage('settings')) WITH CHECK (public.can_manage('settings'));

-- Submissions area: contact messages and subscribers
CREATE POLICY "submissions managers read messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.can_manage('submissions'));
CREATE POLICY "submissions managers update messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (public.can_manage('submissions')) WITH CHECK (public.can_manage('submissions'));
CREATE POLICY "submissions managers delete messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.can_manage('submissions'));
CREATE POLICY "submissions managers read subscribers" ON public.subscribers
  FOR SELECT TO authenticated USING (public.can_manage('submissions'));
CREATE POLICY "submissions managers delete subscribers" ON public.subscribers
  FOR DELETE TO authenticated USING (public.can_manage('submissions'));