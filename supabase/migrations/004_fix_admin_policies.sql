-- 004: Fix admin and review policies
--
-- 1. The admin policies in 003 checked auth.jwt() ->> 'role'. That is Postgres's
--    built-in role claim ('anon' or 'authenticated'), never 'admin'. The admin role
--    lives in app_metadata, so the check must read it from there.
-- 2. Users could insert or update their own reviews with status 'approved',
--    skipping moderation. They can now only write reviews with status 'pending'.

-- Helper: true when the logged-in user's app_metadata says they're an admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- HOSPITALS
DROP POLICY IF EXISTS "Admins can insert hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admins can update hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admins can delete hospitals" ON hospitals;

CREATE POLICY "Admins can insert hospitals"
  ON hospitals FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update hospitals"
  ON hospitals FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete hospitals"
  ON hospitals FOR DELETE
  USING (public.is_admin());

-- REVIEWS
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can moderate reviews" ON reviews;

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can moderate reviews"
  ON reviews FOR UPDATE
  USING (public.is_admin());

-- Admins also need to see pending and hidden reviews to moderate them
DROP POLICY IF EXISTS "Admins can read all reviews" ON reviews;
CREATE POLICY "Admins can read all reviews"
  ON reviews FOR SELECT
  USING (public.is_admin());

-- HOSPITAL IMAGES
DROP POLICY IF EXISTS "Admins can manage images" ON hospital_images;

CREATE POLICY "Admins can manage images"
  ON hospital_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());