-- Enable PostGIS (already enabled via dashboard, but safe to include)
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lga TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  ownership TEXT CHECK (ownership IN ('public', 'private')) DEFAULT 'public',
  specialties TEXT[] DEFAULT '{}',
  visiting_hours TEXT,
  description TEXT,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for radius queries
CREATE INDEX hospitals_location_idx ON hospitals USING GIST(location);