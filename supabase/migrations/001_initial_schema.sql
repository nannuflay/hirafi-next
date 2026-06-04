-- ─── ENUMS ───────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('client', 'vendor');

CREATE TYPE service_category AS ENUM (
  'transport',
  'appliance_repair',
  'plumbing',
  'electricity',
  'carpentry',
  'painting',
  'cleaning',
  'other'
);

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

-- ─── TABLES ──────────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  city        TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vendor_services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category    service_category NOT NULL,
  bio         TEXT,
  rate        NUMERIC(10, 2),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (vendor_id)
);

CREATE TABLE availabilities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  available_date  DATE NOT NULL,
  is_booked       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (vendor_id, available_date)
);

CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  availability_id UUID REFERENCES availabilities(id) ON DELETE SET NULL,
  booking_date    DATE NOT NULL,
  status          booking_status NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (client_id, vendor_id)
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availabilities  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites       ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Owner update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- vendor_services
CREATE POLICY "Public read" ON vendor_services FOR SELECT USING (true);
CREATE POLICY "Vendor insert" ON vendor_services FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Vendor update" ON vendor_services FOR UPDATE USING (auth.uid() = vendor_id);
CREATE POLICY "Vendor delete" ON vendor_services FOR DELETE USING (auth.uid() = vendor_id);

-- availabilities
CREATE POLICY "Public read" ON availabilities FOR SELECT USING (true);
CREATE POLICY "Vendor insert" ON availabilities FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Vendor update" ON availabilities FOR UPDATE USING (auth.uid() = vendor_id);
CREATE POLICY "Vendor delete" ON availabilities FOR DELETE USING (auth.uid() = vendor_id);

-- bookings
CREATE POLICY "Parties read" ON bookings FOR SELECT USING (
  auth.uid() = client_id OR auth.uid() = vendor_id
);
CREATE POLICY "Client insert" ON bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Vendor update" ON bookings FOR UPDATE USING (auth.uid() = vendor_id);

-- favorites
CREATE POLICY "Owner all" ON favorites USING (auth.uid() = client_id);
