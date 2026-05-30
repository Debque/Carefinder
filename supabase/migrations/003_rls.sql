-- HOSPITALS: anyone can read, only admins can write
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read hospitals"
  ON hospitals FOR SELECT USING (true);

CREATE POLICY "Admins can insert hospitals"
  ON hospitals FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update hospitals"
  ON hospitals FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete hospitals"
  ON hospitals FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- REVIEWS: public can read approved, users manage own, admins moderate
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved reviews"
  ON reviews FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can moderate reviews"
  ON reviews FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- HOSPITAL IMAGES
ALTER TABLE hospital_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read images"
  ON hospital_images FOR SELECT USING (true);

CREATE POLICY "Admins can manage images"
  ON hospital_images FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');