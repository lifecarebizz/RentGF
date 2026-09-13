"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Calendar, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react";

export default function CompanionBookingsPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Sample data since API might not have bookings yet
      setBookings([
        { id: "B1", customer: { displayName: "John D." }, bookingDate: "2025-01-20", startTime: "14:00", durationMinutes: 60, status: "CONFIRMED", finalPrice: 1499 },
        { id: "B2", customer: { displayName: "Sarah M." }, bookingDate: "2025-01-22", startTime: "10:00", durationMinutes: 120, status: "PENDING", finalPrice: 1998 },
      ]);
    }
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Booking Requests</h1>
      <div className="space-y-3">
        {bookings.map((b: any) => (
          <div key={b.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{b.customer?.displayName}</div>
                <div className="text-sm text-gray-500">{b.bookingDate} at {b.startTime} • {b.durationMinutes / 60}hr</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.status === "CONFIRMED" ? "bg-green-100 text-green-700" : b.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                {b.status}
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Accept</button>
              <button className="border px-4 py-2 rounded-lg text-sm font-medium">Reject</button>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-gray-500 text-center py-8">No bookings yet</p>}
      </div>
    </div>
  );
}
