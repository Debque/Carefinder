CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  content TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'hidden')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hospital_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);