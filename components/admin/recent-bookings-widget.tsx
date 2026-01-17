"use client";

import { useEffect, useState } from "react";
import { getBookings } from "@/app/admin/bookings/actions";
import { format } from "date-fns";
import { User, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  created_at: string;
  name: string;
  package_name: string;
  status: string;
}

export function RecentBookingsWidget() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const data = await getBookings();
      if (data) {
        setBookings(data.slice(0, 5)); // Take top 5
      }
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading)
    return <div className="h-64 bg-muted/30 rounded-xl animate-pulse" />;

  return (
    <div className="bg-card border rounded-xl shadow-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif font-bold text-lg">Recent Requests</h3>
        <Link
          href="/admin/bookings"
          className="text-xs font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{booking.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {booking.package_name} •{" "}
                  {format(new Date(booking.created_at), "MMM d")}
                </p>
              </div>
              <div className="text-xs">
                {booking.status === "pending" ? (
                  <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> {booking.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
