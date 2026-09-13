"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Heart, Calendar, MessageSquare, Bell, Settings,
  ChevronRight, Search, Loader2, Star, ShoppingBag,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ bookings: 0, favorites: 0, messages: 0, payments: 0 });

  useEffect(() => {
    const token = document.cookie.match(/token=([^;]+)/)?.[1];
    if (!token) { router.push("/login"); return; }

    fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setUser(data.user); setLoading(false); })
      .catch(() => router.push("/login"));

    // Stats would come from API
    setStats({ bookings: 3, favorites: 5, messages: 2, payments: 1 });
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.displayName}</h1>
          <p className="text-gray-500">Manage your account, bookings, and more</p>
        </div>
        <Link href="/customer/profile" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Calendar, label: "Bookings", value: stats.bookings, color: "bg-blue-50 text-blue-600" },
          { icon: Heart, label: "Favorites", value: stats.favorites, color: "bg-pink-50 text-pink-600" },
          { icon: MessageSquare, label: "Messages", value: stats.messages, color: "bg-green-50 text-green-600" },
          { icon: ShoppingBag, label: "Payments", value: stats.payments, color: "bg-purple-50 text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{stats[s.label.toLowerCase() as keyof typeof stats]}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Discover Companions", href: "/discover", icon: Search },
              { label: "My Bookings", href: "/bookings", icon: Calendar },
              { label: "Favorites", href: "/favorites", icon: Heart },
              { label: "Messages", href: "/messages", icon: MessageSquare },
            ].map((a) => (
              <Link key={a.label} href={a.href}
                className="flex items-center gap-4 bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <a.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <div className="font-medium">{user.displayName}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <hr />
            <Link href="/customer/settings" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Settings className="w-4 h-4" /> Account Settings
            </Link>
            <Link href="/customer/notifications" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Bell className="w-4 h-4" /> Notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
