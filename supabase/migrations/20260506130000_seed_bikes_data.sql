-- Seed data: Bikes (ONN Bikes fleet)
-- Run this in Supabase SQL Editor after running the schema migration

-- Clear existing bikes first (if any)
TRUNCATE TABLE public.bike_inventory CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.bikes CASCADE;

-- Insert bikes
INSERT INTO public.bikes (id, name, type, description, image_url, price_per_day, category, engine_capacity, fuel_type) VALUES
  (gen_random_uuid(), 'Honda Dream Yuga', 'Commuter', 'Fuel-efficient commuter bike, perfect for daily rides', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaDreamYuga.png', 429, 'Commuter', '125cc', 'Petrol'),
  (gen_random_uuid(), 'TVS Jupiter', 'Scooter', 'Compact and fuel-efficient scooter for city commutes', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/TVSJupiter2024.png', 559, 'Scooter', '110cc', 'Petrol'),
  (gen_random_uuid(), 'Honda Hornet', 'Sports', 'Sporty performance with aggressive styling', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaHornet.png', 889, 'Sports', '160cc', 'Petrol'),
  (gen_random_uuid(), 'Suzuki Access', 'Scooter', 'Reliable scooter with great mileage', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/SuzukiAccess.png', 599, 'Scooter', '125cc', 'Petrol'),
  (gen_random_uuid(), 'Honda Shine', 'Commuter', 'Best-selling commuter bike with refined engine', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaShine.png', 449, 'Commuter', '125cc', 'Petrol'),
  (gen_random_uuid(), 'Yamaha FZ 250', 'Sports', 'Powerful 250cc performance bike', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/YamahaFZ250.png', 889, 'Sports', '250cc', 'Petrol'),
  (gen_random_uuid(), 'Bajaj CT 100', 'Commuter', 'Economical commuter bike for daily use', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/BajajCT100.png', 409, 'Commuter', '100cc', 'Petrol'),
  (gen_random_uuid(), 'Bajaj Pulsar 180', 'Commuter', 'Powerful commuter with sporty DNA', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/BajajPulsar180.png', 889, 'Commuter', '180cc', 'Petrol'),
  (gen_random_uuid(), 'Honda Activa 5G', 'Scooter', 'Indias favorite scooter, now even better', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaActiva5G.png', 559, 'Scooter', '110cc', 'Petrol'),
  (gen_random_uuid(), 'Hero HF Deluxe', 'Commuter', 'No-nonsense commuter workhorse', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HeroHFDeluxe.png', 409, 'Commuter', '100cc', 'Petrol'),
  (gen_random_uuid(), 'Bajaj Pulsar 150', 'Commuter', 'Iconic bike with great street presence', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/BajajPulsar150.png', 669, 'Commuter', '150cc', 'Petrol'),
  (gen_random_uuid(), 'Hero Splendor', 'Commuter', 'The most trusted commuter bike in India', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HeroSplender.png', 429, 'Commuter', '100cc', 'Petrol'),
  (gen_random_uuid(), 'Yamaha FZ', 'Sports', 'Popular streetfighter motorcycle', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/YamahaFZ.png', 779, 'Sports', '150cc', 'Petrol'),
  (gen_random_uuid(), 'Honda Dio', 'Scooter', 'Sporty scooter with youthful styling', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaDio.png', 519, 'Scooter', '110cc', 'Petrol'),
  (gen_random_uuid(), 'Bajaj Pulsar 220', 'Sports', 'Top-end performance sports bike', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/BajajPulsar220.png', 779, 'Sports', '220cc', 'Petrol'),
  (gen_random_uuid(), 'Honda Navi', 'Scooter', 'Fun and quirky mini-scooter', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaNavi.png', 419, 'Scooter', '110cc', 'Petrol'),
  (gen_random_uuid(), 'TVS Ntorq', 'Scooter', 'Feature-packed sporty scooter with Bluetooth', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/TVSNTorq.png', 659, 'Scooter', '125cc', 'Petrol'),
  (gen_random_uuid(), 'Suzuki Gixxer 150', 'Sports', 'Aggressive styling meets performance', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/SuzukiGixxer150.png', 779, 'Sports', '150cc', 'Petrol'),
  (gen_random_uuid(), 'Honda Unicorn', 'Commuter', 'Refined commuter with smooth engine', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaUnicorn.png', 549, 'Commuter', '160cc', 'Petrol'),
  (gen_random_uuid(), 'Royal Enfield Hunter 350', 'Cruiser', 'New-age cruiser for urban riding', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/RoyalEnfieldHunter350.png', 1439, 'Cruiser', '350cc', 'Petrol'),
  (gen_random_uuid(), 'Royal Enfield Classic 350', 'Cruiser', 'Timeless classic with thumping engine', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/RoyalEnfieldClassic350.png', 1639, 'Cruiser', '350cc', 'Petrol'),
  (gen_random_uuid(), 'KTM Duke 200', 'Sports', 'Agile street fighter for thrill seekers', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/KTMDuke200.png', 1319, 'Sports', '200cc', 'Petrol'),
  (gen_random_uuid(), 'TVS Ronin', 'Cruiser', 'Modern retro-styled cruiser', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/TVSRonin.png', 1399, 'Cruiser', '250cc', 'Petrol'),
  (gen_random_uuid(), 'Bajaj Avenger 220 Cruise', 'Cruiser', 'Classic cruiser for relaxed riding', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/BajajAvengerCruise220.png', 829, 'Cruiser', '220cc', 'Petrol'),
  (gen_random_uuid(), 'Honda Activa 6G', 'Scooter', 'Latest generation of Indias favorite scooter', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaActiva6G.png', 609, 'Scooter', '110cc', 'Petrol'),
  (gen_random_uuid(), 'Piaggio Vespa', 'Scooter', 'Iconic Italian style scooter', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/PiaggioVespa.png', 599, 'Scooter', '125cc', 'Petrol'),
  (gen_random_uuid(), 'Bajaj Pulsar NS 125', 'Sports', 'Naked sport bike with muscular looks', 'https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/BajajPulsarNS125.png', 839, 'Sports', '125cc', 'Petrol');

-- Now seed bike inventory (assign bikes to rental stations with stock quantities)
-- We need to look up the bike and station IDs. Using a cross-join approach.

-- Helper: Insert inventory for a station
-- Station 1 (Kothrud): All-round inventory
INSERT INTO public.bike_inventory (station_id, bike_id, quantity)
SELECT rs.id, b.id,
  CASE b.category
    WHEN 'Scooter' THEN 5
    WHEN 'Commuter' THEN 4
    WHEN 'Sports' THEN 2
    WHEN 'Cruiser' THEN 1
  END
FROM public.rental_stations rs
CROSS JOIN public.bikes b
WHERE rs.name = 'ONN Station - Kothrud';

-- Station 2 (Hinjewadi): More commuters and scooters for IT park crowd
INSERT INTO public.bike_inventory (station_id, bike_id, quantity)
SELECT rs.id, b.id,
  CASE
    WHEN b.category = 'Scooter' THEN 6
    WHEN b.category = 'Commuter' THEN 5
    WHEN b.category = 'Sports' THEN 1
    WHEN b.category = 'Cruiser' THEN 1
  END
FROM public.rental_stations rs
CROSS JOIN public.bikes b
WHERE rs.name = 'ONN Station - Hinjewadi';

-- Station 3 (Baner): Balanced mix
INSERT INTO public.bike_inventory (station_id, bike_id, quantity)
SELECT rs.id, b.id,
  CASE b.category
    WHEN 'Scooter' THEN 4
    WHEN 'Commuter' THEN 3
    WHEN 'Sports' THEN 3
    WHEN 'Cruiser' THEN 2
  END
FROM public.rental_stations rs
CROSS JOIN public.bikes b
WHERE rs.name = 'ONN Station - Baner';

-- Station 4 (Viman Nagar): Premium area, more cruisers and sports
INSERT INTO public.bike_inventory (station_id, bike_id, quantity)
SELECT rs.id, b.id,
  CASE b.category
    WHEN 'Scooter' THEN 3
    WHEN 'Commuter' THEN 2
    WHEN 'Sports' THEN 4
    WHEN 'Cruiser' THEN 3
  END
FROM public.rental_stations rs
CROSS JOIN public.bikes b
WHERE rs.name = 'ONN Station - Viman Nagar';

-- Station 5 (Shivajinagar): City center, mostly scooters
INSERT INTO public.bike_inventory (station_id, bike_id, quantity)
SELECT rs.id, b.id,
  CASE b.category
    WHEN 'Scooter' THEN 5
    WHEN 'Commuter' THEN 3
    WHEN 'Sports' THEN 1
    WHEN 'Cruiser' THEN 0
  END
FROM public.rental_stations rs
CROSS JOIN public.bikes b
WHERE rs.name = 'ONN Station - Shivajinagar';

-- Station 6 (Magarpatta): IT hub, mix of scooters and commuters
INSERT INTO public.bike_inventory (station_id, bike_id, quantity)
SELECT rs.id, b.id,
  CASE b.category
    WHEN 'Scooter' THEN 4
    WHEN 'Commuter' THEN 4
    WHEN 'Sports' THEN 2
    WHEN 'Cruiser' THEN 1
  END
FROM public.rental_stations rs
CROSS JOIN public.bikes b
WHERE rs.name = 'ONN Station - Magarpatta';
