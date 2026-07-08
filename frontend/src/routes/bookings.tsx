import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/bookings")({
  component: BookingsPage,
});

interface Booking {
  id: string;
  bike_id: string;
  bike_name?: string;
  bike_image?: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
}

function BookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }

    supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching bookings:", error);
          setBookings([]);
        } else {
          setBookings(data || []);
        }
        setLoading(false);
      });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
      <p className="text-gray-500 mb-8">View and manage your bike rental bookings</p>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No bookings yet</p>
            <Link to="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Browse Bikes</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Booking #{booking.id.slice(0, 8)}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                        booking.status === "active" ? "bg-blue-100 text-blue-700" :
                        booking.status === "completed" ? "bg-gray-100 text-gray-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-orange-500 font-bold">₹{Number(booking.total_price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
