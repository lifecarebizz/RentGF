"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function CompanionDashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.match(/token=([^;]+)/)?.[1];
    if (!token) return;
    fetch("/api/companions/me/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (r.ok) return r.json(); throw new Error(); })
      .then((data) => { setUser(data.profile?.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <nav className="bg-white border-b mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {[
              { href: "/companion/dashboard", label: "Dashboard" },
              { href: "/companion/onboarding", label: "Onboarding" },
              { href: "/companion/profile", label: "Profile" },
              { href: "/companion/bookings", label: "Bookings" },
              { href: "/companion/earnings", label: "Earnings" },
            ].map((item) => (
              <a key={item.href} href={item.href} className={`px-3 py-3 text-sm font-medium border-b-2 ${window.location.pathname === item.href ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
