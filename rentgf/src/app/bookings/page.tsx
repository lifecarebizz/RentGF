"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Loader2, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";

interface Booking {
  id: string;
  bookingDate: string;
  startTime: string;
  durationMinutes: number;
  activityType?: string;
  status: string;
  totalAmount: number;
  companion?: { user: { displayName: string; avatarUrl?: string | null } };
}

function getToken() {
  if (typeof window === "undefined") return "";
  return document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1] || "";
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: <Clock className="w-4 h-4" /> },
  CONFIRMED: { label: "Confirmed", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
  COMPLETED: { label: "Completed", color: "bg-blue-100 text-blue-700", icon: <CheckCircle className="w-4 h-4" /> },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: <XCircle className="w-4 h-4" /> },
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    fetch("/api/bookings", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-gray-500">View and manage all your companion bookings</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s === "ALL" ? "All" : (statusConfig[s]?.label ?? s)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
          <p className="text-gray-500 mb-4">Book a companion to get started</p>
          <Link href="/discover" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700">
            Discover Companions
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const cfg = statusConfig[b.status] ?? { label: b.status, color: "bg-gray-100 text-gray-600", icon: null };
            return (
              <div key={b.id} className="bg-white rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
                    {b.companion?.user?.displayName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{b.companion?.user?.displayName || "Companion"}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(b.bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {" · "}{b.durationMinutes} mins
                      {b.activityType ? ` · ${b.activityType}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <span className="font-semibold text-gray-700">INR {b.totalAmount}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
