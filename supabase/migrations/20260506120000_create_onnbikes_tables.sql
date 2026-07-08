-- ONN Bikes - Rental Stations, Inventory, and Enhanced Booking tables
-- Inspired by ZeptoClone's DarkStore architecture

-- ============================================
-- RENTAL STATIONS (like DarkStores in ZeptoClone)
-- ============================================
CREATE TABLE IF NOT EXISTS public.rental_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  city TEXT NOT NULL DEFAULT 'Pune',
  is_active BOOLEAN NOT NULL DEFAULT true,
  opening_time TEXT DEFAULT '06:00',
  closing_time TEXT DEFAULT '22:00',
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rental_stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rental stations"
  ON public.rental_stations FOR SELECT USING (true);

-- ============================================
-- BIKE INVENTORY (tracks stock per station, like ZeptoClone's stock map)
-- ============================================
CREATE TABLE IF NOT EXISTS public.bike_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES public.rental_stations(id) ON DELETE CASCADE,
  bike_id UUID NOT NULL REFERENCES public.bikes(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(station_id, bike_id)
);

ALTER TABLE public.bike_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bike inventory"
  ON public.bike_inventory FOR SELECT USING (true);

-- Only authenticated users can update inventory (admin operations)
CREATE POLICY "Authenticated users can update inventory"
  ON public.bike_inventory FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- BOOKING ITEMS (individual bike lines per booking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  bike_id UUID NOT NULL REFERENCES public.bikes(id) ON DELETE CASCADE,
  station_id UUID REFERENCES public.rental_stations(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_per_day NUMERIC(10,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0
);

ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own booking items"
  ON public.booking_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
  );

-- ============================================
-- BOOKING DELIVERY PARTNERS (for doorstep delivery)
-- ============================================
CREATE TABLE IF NOT EXISTS public.booking_delivery_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  partner_phone TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_delivery_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own delivery partners"
  ON public.booking_delivery_partners FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
  );

-- ============================================
-- ADD NEW COLUMNS TO EXISTING BOOKINGS TABLE
-- ============================================
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS user_name TEXT,
  ADD COLUMN IF NOT EXISTS user_latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS user_longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS delivery_type TEXT DEFAULT 'pickup',
  ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- ============================================
-- ADD CATEGORY & DETAIL COLUMNS TO BIKES TABLE
-- ============================================
ALTER TABLE public.bikes
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS engine_capacity TEXT,
  ADD COLUMN IF NOT EXISTS fuel_type TEXT;

-- ============================================
-- SEED DATA: Rental Stations in Pune
-- ============================================
INSERT INTO public.rental_stations (name, address, latitude, longitude, city, phone_number) VALUES
  ('ONN Station - Kothrud', 'Near Kothrud Bus Stand, Karve Road, Kothrud, Pune - 411038', 18.5074, 73.8077, 'Pune', '+918432780780'),
  ('ONN Station - Hinjewadi', 'Phase 1, Hinjewadi Rajiv Gandhi Infotech Park, Pune - 411057', 18.5913, 73.7389, 'Pune', '+918432780781'),
  ('ONN Station - Baner', 'Baner Road, Near D-Mart, Baner, Pune - 411045', 18.5587, 73.7869, 'Pune', '+918432780782'),
  ('ONN Station - Viman Nagar', 'Near Phoenix Marketcity, Viman Nagar, Pune - 411014', 18.5656, 73.9148, 'Pune', '+918432780783'),
  ('ONN Station - Shivajinagar', 'FC Road, Near Deccan Gymkhana, Shivajinagar, Pune - 411004', 18.5289, 73.8428, 'Pune', '+918432780784'),
  ('ONN Station - Magarpatta', 'Magarpatta City, Hadapsar, Pune - 411013', 18.5143, 73.9248, 'Pune', '+918432780785'),
  ('ONN Station - Pimpri', 'Near Pimpri Chowk, Pune - 411018', 18.6298, 73.8137, 'Pune', '+918432780786'),
  ('ONN Station - Wakad', 'Wakad Road, Near Datta Mandir, Pune - 411057', 18.5995, 73.7622, 'Pune', '+918432780787')
ON CONFLICT DO NOTHING;
