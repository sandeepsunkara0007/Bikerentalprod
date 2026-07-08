import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/")({
  component: HomePage,
});

type Bike = Tables<"bikes">;

// ---------- Bike data from ONN Bikes ----------
const ONN_BIKES: Bike[] = [
  { id: "1", name: "Honda Dream Yuga", type: "Commuter", description: "Fuel-efficient commuter bike, perfect for daily rides", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaDreamYuga.png", price_per_day: 429, available: true, category: "Commuter", engine_capacity: "125cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "2", name: "TVS Jupiter", type: "Scooter", description: "Compact and fuel-efficient scooter for city commutes", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/TVSJupiter2024.png", price_per_day: 559, available: true, category: "Scooter", engine_capacity: "110cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "3", name: "Honda Hornet", type: "Sports", description: "Sporty performance with aggressive styling", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaHornet.png", price_per_day: 889, available: true, category: "Sports", engine_capacity: "160cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "4", name: "Suzuki Access", type: "Scooter", description: "Reliable scooter with great mileage", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/SuzukiAccess.png", price_per_day: 599, available: true, category: "Scooter", engine_capacity: "125cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "5", name: "Honda Shine", type: "Commuter", description: "Best-selling commuter bike with refined engine", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaShine.png", price_per_day: 449, available: true, category: "Commuter", engine_capacity: "125cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "6", name: "Yamaha FZ 250", type: "Sports", description: "Powerful 250cc performance bike", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/YamahaFZ250.png", price_per_day: 889, available: true, category: "Sports", engine_capacity: "250cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "7", name: "Bajaj Pulsar 150", type: "Commuter", description: "Iconic bike with great street presence", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/BajajPulsar150.png", price_per_day: 669, available: true, category: "Commuter", engine_capacity: "150cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "8", name: "Honda Activa 5G", type: "Scooter", description: "India's favorite scooter, now even better", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaActiva5G.png", price_per_day: 559, available: true, category: "Scooter", engine_capacity: "110cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "9", name: "Hero Splendor", type: "Commuter", description: "The most trusted commuter bike in India", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HeroSplender.png", price_per_day: 429, available: true, category: "Commuter", engine_capacity: "100cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "10", name: "Royal Enfield Classic 350", type: "Cruiser", description: "Timeless classic with thumping engine", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/RoyalEnfieldClassic350.png", price_per_day: 1639, available: true, category: "Cruiser", engine_capacity: "350cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "11", name: "KTM Duke 200", type: "Sports", description: "Agile street fighter for thrill seekers", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/KTMDuke200.png", price_per_day: 1319, available: true, category: "Sports", engine_capacity: "200cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "12", name: "Honda Dio", type: "Scooter", description: "Sporty scooter with youthful styling", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/HondaDio.png", price_per_day: 519, available: true, category: "Scooter", engine_capacity: "110cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "13", name: "Royal Enfield Hunter 350", type: "Cruiser", description: "New-age cruiser for urban riding", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/RoyalEnfieldHunter350.png", price_per_day: 1439, available: true, category: "Cruiser", engine_capacity: "350cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "14", name: "TVS Ntorq", type: "Scooter", description: "Feature-packed sporty scooter with Bluetooth", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/TVSNTorq.png", price_per_day: 659, available: true, category: "Scooter", engine_capacity: "125cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "15", name: "Bajaj Pulsar NS 125", type: "Sports", description: "Naked sport bike with muscular looks", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/BajajPulsarNS125.png", price_per_day: 839, available: true, category: "Sports", engine_capacity: "125cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
  { id: "16", name: "Piaggio Vespa", type: "Scooter", description: "Iconic Italian style scooter", image_url: "https://d2w184mfj9gts1.cloudfront.net/BikeImages/V3/PiaggioVespa.png", price_per_day: 599, available: true, category: "Scooter", engine_capacity: "125cc", fuel_type: "Petrol", created_at: "2026-01-01T00:00:00Z" },
];

const testimonials = [
  { name: "Narasimha Swamy", text: "The vehicle was in excellent condition and felt almost new. The entire rental experience was smooth and completely hassle-free. Pickup and drop were well managed by the staff." },
  { name: "Arham Khan", text: "Great service by ONN Bikes from start to finish. The contact person was very helpful and patiently guided me through the booking and pickup process. The bike was clean, well maintained." },
  { name: "Ayush Sharma", text: "A very good app with transparent pricing and a smooth booking experience. The interface is easy to use and all details are clearly mentioned." },
  { name: "Pratik Pagare", text: "The staff was extremely cooperative and professional throughout the process. The vehicle was well maintained and thoroughly inspected before handover." },
  { name: "Rahul Verma", text: "The booking experience was smooth and the bike was delivered on time as promised. The vehicle performance was good and suitable for both short and long rides." },
  { name: "Saurabh Patil", text: "Very convenient rental service with well-maintained bikes. The pickup location was easy to find and the staff explained all rules and bike details clearly." },
];

const faqs = [
  { q: "How can I find ONN Bikes rental stations in Pune?", a: "Getting a bike on rent in Pune is easy with our app or website. Simply select the city, then the area nearest to you, pick your favourite bike and finalise the booking." },
  { q: "What types of two-wheelers are available for rent in Pune?", a: "ONN Bikes offers a range of options, from mopeds like Active and Dio to bikes like Royal Enfield, KTM, and Hornet. Our selection includes scooters, commuter bikes, sports bikes, and luxury cruisers." },
  { q: "Can I rent a bike in Pune for an extended period, like a month?", a: "Definitely! Dive into our monthly subscription plans, where you can choose from a variety of bikes for extended rentals at competitive rates." },
  { q: "How does ONN Bikes ensure rider safety in Pune?", a: "Safety is our top priority. Our bikes undergo rigorous quality checks to meet the highest two-wheeler safety standards. We include helmets with every rental." },
  { q: "Are there options for scooty rentals in Pune?", a: "Yes, ONN Bikes provides a range of two-wheelers for rent in Pune, perfect for commuting, and the booking process is incredibly straightforward." },
];

const trips = [
  { title: "Lonavala & Khandala", distance: "65 km", image: "https://staticimg.onnbikes.com/home/Lonavala.jpg", desc: "The Ride Every Punekar Loves. Roads open up, the air gets cooler, and waterfalls line the highway in monsoon." },
  { title: "Sinhagad Fort", distance: "35 km", image: "https://staticimg.onnbikes.com/home/Lonavala.jpg", desc: "History at the End of a Beautiful Ride. The ghat road is smooth, scenic and full of viewpoints." },
  { title: "Lavasa", distance: "60 km", image: "https://staticimg.onnbikes.com/home/Lonavala.jpg", desc: "A Slow, Peaceful Escape. The ride towards the lake is calm and winding, perfect for those who want to unwind." },
];

// ---------- Animated Counter Hook ----------
function useCountUp(target: number, duration: number = 2000, start: boolean = true) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;
    let current = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);

  return count;
}

// ---------- Bike Quick View Modal ----------
function BikeQuickView({ bike, open, onClose }: { bike: Bike | null; open: boolean; onClose: () => void }) {
  if (!bike) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{bike.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48 h-40 flex items-center justify-center bg-gray-50 rounded-lg">
            <img src={bike.image_url || "/placeholder.svg"} alt={bike.name} className="h-full object-contain" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-400 text-xs">Category</span>
                <p className="font-medium">{(bike as any).category || bike.type}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-400 text-xs">Engine</span>
                <p className="font-medium">{(bike as any).engine_capacity || "-"}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-400 text-xs">Fuel</span>
                <p className="font-medium">{(bike as any).fuel_type || "Petrol"}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-400 text-xs">Price/Day</span>
                <p className="font-bold text-orange-500">₹{Number(bike.price_per_day).toFixed(0)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{bike.description}</p>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm">
                Book Now
              </Button>
              <Button variant="outline" className="flex-1 text-sm">
                Add to Compare
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HomePage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("price-asc");
  const [quickViewBike, setQuickViewBike] = useState<Bike | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [startDate, setStartDate] = useState("2026-07-09");
  const [endDate, setEndDate] = useState("2026-07-10");

  // Booking price estimate
  const daysDiff = Math.max(1, Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  ));
  const avgPrice = bikes.length > 0
    ? bikes.reduce((s, b) => s + Number(b.price_per_day), 0) / bikes.length
    : 0;

  const achievementsRef = useRef<HTMLDivElement>(null);
  const [achievementsVisible, setAchievementsVisible] = useState(false);

  useEffect(() => {
    const el = achievementsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAchievementsVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // Fetch from Supabase, fall back to ONN data
    supabase.from("bikes").select("*").order("price_per_day")
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setBikes(ONN_BIKES as any);
        } else {
          setBikes(data as any);
        }
        setLoading(false);
      });
  }, []);

  const categories = ["All", "Scooter", "Commuter", "Sports", "Cruiser"];

  let filteredBikes = selectedCategory === "All"
    ? bikes
    : bikes.filter(b => (b as any).category === selectedCategory);

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredBikes = filteredBikes.filter(b =>
      b.name.toLowerCase().includes(q) ||
      (b.type || "").toLowerCase().includes(q) ||
      ((b as any).category || "").toLowerCase().includes(q)
    );
  }

  // Sort
  filteredBikes = [...filteredBikes].sort((a, b) => {
    if (sortBy === "price-asc") return Number(a.price_per_day) - Number(b.price_per_day);
    if (sortBy === "price-desc") return Number(b.price_per_day) - Number(a.price_per_day);
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Save Big with Monthly Bookings!
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Bike Rental <br />In <span className="text-orange-500">Pune</span>
              </h1>
              <p className="mt-4 text-gray-600 text-lg max-w-lg">
                Your Bike, Your Way — Bike Rentals with No Complications. Starting at just ₹119/day.
              </p>

              {/* Booking Form with Live Price Estimate */}
              <div className="mt-8 bg-white rounded-xl shadow-lg p-4 md:p-6 border">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="col-span-2 md:col-span-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                    <div className="flex items-center gap-2 mt-1 border rounded-lg px-3 py-2 bg-gray-50">
                      <span>📍</span>
                      <span className="text-sm font-medium text-gray-700">Pune</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Start Time</label>
                    <Input type="time" defaultValue="09:00" className="mt-1 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">End Time</label>
                    <Input type="time" defaultValue="09:00" className="mt-1 text-sm" />
                  </div>

                  {/* Live Price Estimate */}
                  <div className="col-span-2 md:col-span-3 bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Estimated for {daysDiff} day{daysDiff > 1 ? "s" : ""}</span>
                      <span className="text-lg font-bold text-orange-500">
                        ~₹{(avgPrice * daysDiff).toFixed(0)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Avg ₹{avgPrice.toFixed(0)}/day • Free cancellation</div>
                  </div>

                  <div className="col-span-2 md:col-span-3 flex gap-2">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5">
                      Ride Now 🏍️
                    </Button>
                    <Button variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">
                      Doorstep Delivery
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block relative">
              <img
                src="https://staticimg.onnbikes.com/new-images/pune-cover-desktop-v4.svg"
                alt="Bike Rental Pune"
                className="w-full h-auto"
              />
              <div className="absolute -bottom-4 -left-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
                🏆 200k+ Happy Riders
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">Your Bike, Your Way — Bike Rentals with No Complications</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Daily Rentals */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🛵</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Daily Rentals</h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>✓ Flexible pickup and drop off</li>
                    <li>✓ Pay only for hours used</li>
                    <li>✓ Low rates</li>
                    <li>✓ Road side assistance</li>
                  </ul>
                  <Button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white">
                    RENT NOW →
                  </Button>
                </div>
                <div className="hidden sm:block">
                  <img src="https://staticimg.onnbikes.com/new-images/activa-bike.webp" alt="Scooter" className="w-32 h-32 object-contain" />
                </div>
              </div>
            </div>

            {/* Monthly Rentals */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Monthly Rentals</h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>✓ Monthly Rentals at the cost of your EMIs</li>
                    <li>✓ Cancel Anytime</li>
                    <li>✓ Pay monthly as you go</li>
                    <li>✓ Helmets provided • Doorstep delivery</li>
                  </ul>
                  <Button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white">
                    SUBSCRIBE NOW →
                  </Button>
                </div>
                <div className="hidden sm:block">
                  <img src="https://staticimg.onnbikes.com/new-images/himaliyan-bike.webp" alt="Royal Enfield" className="w-36 h-32 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW TO RENT (4 Steps) ===== */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How to Rent a Bike in Pune</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Bike rentals in Pune with ONN are quick, easy, and totally digital. Just follow these four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", icon: "🔍", title: "Choose Your Ride", desc: "View our wide selection of two-wheelers for rent. Choose between scooters, commuters, sports bikes, or cruisers." },
              { step: "2", icon: "📄", title: "Upload Documents", desc: "Simply snap and upload your current driving license and a government-approved ID for verification." },
              { step: "3", icon: "💳", title: "Select Duration & Pay", desc: "Make an instantaneous payment from hourly, daily, weekly, or monthly plans to confirm your booking." },
              { step: "4", icon: "🏍️", title: "Pick Up and Ride", desc: "Go to the closest ONN Station, pick your ride, and start riding. Zero waiting and no stress!" },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MOST RENTED BIKES ===== */}
      <section id="bikes" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Most Rented Bikes in Pune</h2>
            <p className="mt-3 text-gray-500">Choose from our wide range of well-maintained bikes</p>
          </div>

          {/* Search + Sort + Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search bikes (name, type...)"
                className="pl-10 text-sm"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm bg-white text-gray-700"
            >
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>
            <div className="hidden sm:flex flex-wrap gap-2 ml-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden text-sm text-orange-500 font-medium"
            >
              {showMobileFilters ? "Hide filters ▲" : "More filters ▼"}
            </button>
          </div>

          {/* Mobile category filters */}
          {showMobileFilters && (
            <div className="flex flex-wrap gap-2 mb-4 sm:hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setShowMobileFilters(false); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading bikes...</p>
            </div>
          ) : filteredBikes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">😕 No bikes found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search or filter</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-3">{filteredBikes.length} bike{filteredBikes.length !== 1 ? "s" : ""} available</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredBikes.map((bike) => (
                  <div
                    key={bike.id}
                    className="bg-white rounded-xl border hover:shadow-lg transition-all hover:-translate-y-0.5 p-4 flex flex-col cursor-pointer group"
                    onClick={() => { setQuickViewBike(bike); setShowQuickView(true); }}
                  >
                    <div className="h-28 flex items-center justify-center mb-3">
                      <img
                        src={bike.image_url || "/placeholder.svg"}
                        alt={bike.name}
                        className="h-full object-contain transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 truncate group-hover:text-orange-500 transition-colors">
                      {bike.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{(bike as any).category || bike.type}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-xs text-gray-400">4.5</span>
                    </div>
                    <div className="mt-auto pt-3">
                      <p className="text-orange-500 font-bold text-sm">
                        ₹{Number(bike.price_per_day).toFixed(0)}
                        <span className="text-gray-400 font-normal text-xs">/day</span>
                      </p>
                      <Button
                        className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white text-xs py-1.5 h-auto"
                        onClick={e => { e.stopPropagation(); setQuickViewBike(bike); setShowQuickView(true); }}
                      >
                        Quick View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <BikeQuickView bike={quickViewBike} open={showQuickView} onClose={() => setShowQuickView(false)} />
      </section>

      {/* ===== WHY ONN ===== */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why ONN?</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Say goodbye to overpriced rides and wait times, rent a bike in Pune the smart, affordable way.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "💰", title: "Lowest Rental Prices", desc: "Starting from ₹119 per day. No surprise fees. No confusing charges. What you see is what you pay." },
              { icon: "📋", title: "Flexible Rental Plans", desc: "Hourly, daily, weekly, or monthly subscriptions. Choose what works with your lifestyle. No locked-in commitments." },
              { icon: "🛡️", title: "No Ownership Worries", desc: "We handle maintenance, insurance, and upkeep. You just ride. Pay only for the time you actually use." },
              { icon: "📍", title: "Multiple Rental Hubs", desc: "Multiple hubs across the city. Pick the hub nearest to you, grab your bike, and ride. Maximum convenience." },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACHIEVEMENTS (Animated Counters) ===== */}
      <section ref={achievementsRef} className="py-12 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { target: 200, suffix: "k+", label: "Happy Riders" },
              { target: 1, suffix: "M+", label: "Downloads" },
              { target: 5, suffix: "k+", label: "Top Notch Bikes" },
              { target: 2, suffix: "M+", label: "Rides" },
              { target: 20, suffix: "+", label: "Cities" },
            ].map((stat, i) => {
              const DynamicCount = () => {
                const count = useCountUp(stat.target, 2000, achievementsVisible);
                return <>{count}{stat.suffix}</>;
              };
              return (
                <div key={i} className="py-4">
                  <p className="text-3xl md:text-4xl font-bold">
                    <DynamicCount />
                  </p>
                  <p className="text-sm mt-1 text-orange-100">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ONE-DAY TRIPS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">One-Day Bike Trips from Pune</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">Ride Beyond the City — Explore the best of Pune with these one-day bike trips.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {trips.map((trip, i) => (
              <div key={i} className="rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-shadow">
                <img src={trip.image} alt={trip.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-orange-500 font-medium mb-2">
                    <span>📍</span> {trip.distance} from Pune
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{trip.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{trip.desc}</p>
                  <button className="mt-3 text-orange-500 text-sm font-semibold hover:text-orange-600">
                    Read more →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING TABLE ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Monthly Subscription Plans</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">Affordable monthly rentals at the cost of your EMIs</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="p-4 text-left font-semibold">Plan</th>
                  <th className="p-4 text-left font-semibold">Monthly Price</th>
                  <th className="p-4 text-left font-semibold">Benefits</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { plan: "Basic", price: "₹2,500 - ₹3,500", benefits: "Economy and commuter bikes for daily rides, minimal maintenance" },
                  { plan: "Standard", price: "₹3,500 - ₹5,500", benefits: "Premium scooters and commuter bikes with complimentary service check-ups" },
                  { plan: "Premium", price: "₹5,500 - ₹7,500", benefits: "High-end cruisers and sportbikes with exclusive deals" },
                  { plan: "Premium+", price: "₹7,500+", benefits: "Unlimited availability of high-end cruisers and sportbikes" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-orange-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{row.plan}</td>
                    <td className="p-4 text-orange-500 font-bold">{row.price}</td>
                    <td className="p-4 text-sm text-gray-600">{row.benefits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== BIKE TYPES TABLE ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Types of Rental Bikes</h2>
            <p className="mt-3 text-gray-500">Our diverse fleet caters to every preference and budget</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="p-4 text-left font-semibold">Type</th>
                  <th className="p-4 text-left font-semibold">Models</th>
                  <th className="p-4 text-left font-semibold">Daily Rate</th>
                  <th className="p-4 text-left font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { type: "🛵 Scooters", models: "Honda Activa, TVS Jupiter, Suzuki Access", rate: "₹350 - ₹500", best: "City commutes & short trips" },
                  { type: "🏍️ Commuter Bikes", models: "Bajaj Pulsar, Yamaha FZ, Hero Splendor", rate: "₹500 - ₹650", best: "Daily commuting & weekend rides" },
                  { type: "⚡ Sports Bikes", models: "KTM Duke, Honda CBR, Bajaj NS", rate: "₹750 - ₹1,000", best: "Performance & speed enthusiasts" },
                  { type: "🌟 Luxury Cruisers", models: "Royal Enfield Classic, Thunderbird", rate: "₹1,000 - ₹1,500", best: "Long rides & leisure touring" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{row.type}</td>
                    <td className="p-4 text-sm text-gray-600">{row.models}</td>
                    <td className="p-4 text-orange-500 font-bold text-sm">{row.rate}</td>
                    <td className="p-4 text-sm text-gray-500">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== MORE ABOUT ONN ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">More About ONN</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "❓", title: "Why buy, When you can rent?", desc: "No EMIs, no maintenance, no insurance. Just pure riding freedom." },
              { icon: "📖", title: "Easy guide to rent bikes", desc: "Quick, easy, and totally digital. Just 4 simple steps to start riding." },
              { icon: "🚚", title: "Your Ride, Delivered to Your Doorstep", desc: "Doorstep delivery and pickup. We bring the bike to you." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                <button className="text-orange-500 text-sm font-semibold">Know More →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED ON ===== */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-6">Featured On</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["ANI News", "Business Standard", "BW Disrupt", "The News Minute", "VCCircle"].map((pub, i) => (
              <span key={i} className="text-lg font-bold text-gray-400">{pub}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="mt-3 text-gray-500">Real experiences from riders who trust us every day.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="text-orange-400 text-2xl mb-2">"</div>
                <p className="text-sm text-gray-600 leading-relaxed">{t.text}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-xs">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQS ===== */}
      <section id="faqs" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">FAQs</h2>
            <p className="mt-3 text-gray-500">Got questions before you ride? Check out these quick answers.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`transform transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {expandedFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}