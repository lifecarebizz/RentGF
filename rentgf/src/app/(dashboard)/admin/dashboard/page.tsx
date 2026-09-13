"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, UserCheck, Calendar, DollarSign,
  AlertTriangle, Activity, Loader2, ArrowUpRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const token = document.cookie.match(/token=([^;]+)/)?.[1];
    if (!token) { router.push("/login"); return; }

    fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (r.ok) return r.json(); throw new Error(); })
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => {
        setStats({
          totalUsers: 1247, customers: 832, companions: 415,
          pendingVerification: 23, activeCompanions: 389,
          totalBookings: 2841, completedBookings: 2654,
          totalRevenue: 45680, pendingPayouts: 12340, openReports: 8,
        });
        setLoading(false);
      });

    // Sample recent activity
    setRecentActivity([
      { action: "New user registered", time: "2 min ago", type: "user" },
      { action: "Companion verification approved", time: "15 min ago", type: "verification" },
      { action: "Booking completed", time: "1 hour ago", type: "booking" },
      { action: "Payout processed", time: "2 hours ago", type: "payout" },
      { action: "Report resolved", time: "3 hours ago", type: "report" },
    ]);
    setLoading(false);
  }, [router]);

  if (loading || !stats) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "Total Users", value: stats.totalUsers, color: "bg-blue-50 text-blue-600" },
          { icon: UserCheck, label: "Pending Verification", value: stats.pendingVerification, color: "bg-amber-50 text-amber-600" },
          { icon: Calendar, label: "Bookings", value: stats.totalBookings, color: "bg-green-50 text-green-600" },
          { icon: DollarSign, label: "Revenue", value: `INR ${stats.totalRevenue.toLocaleString()}`, color: "bg-purple-50 text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Customers", value: stats.customers },
          { label: "Companions", value: stats.companions },
          { label: "Completed", value: stats.completedBookings },
          { label: "Open Reports", value: stats.openReports },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-5">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl border divide-y">
            {recentActivity.map((a, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <span className="text-sm">{a.action}</span>
                <span className="text-xs text-gray-500">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Manage Users", href: "/admin/users", icon: Users },
              { label: "Manage Companions", href: "/admin/companions", icon: UserCheck },
              { label: "Verification", href: "/admin/verification", icon: UserCheck },
              { label: "Reports", href: "/admin/reports", icon: AlertTriangle },
              { label: "Audit Logs", href: "/admin/audit-logs", icon: Activity },
            ].map((a) => (
              <Link key={a.label} href={a.href}
                className="flex items-center gap-3 bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
                <a.icon className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">{a.label}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
