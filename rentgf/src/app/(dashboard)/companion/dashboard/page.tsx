"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, CheckCircle, Clock, AlertCircle, Calendar,
  ChevronRight, Loader2, Star, TrendingUp, Wallet,
} from "lucide-react";

export default function CompanionDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.match(/token=([^;]+)/)?.[1];
    if (!token) { router.push("/login"); return; }

    fetch("/api/companions/me/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (r.ok) return r.json(); throw new Error(); })
      .then((data) => { setProfile(data.profile); setLoading(false); })
      .catch(() => {
        // Create a default profile entry for new companions
        setProfile({
          verificationStatus: "NOT_SUBMITTED", onboardingStep: 0,
          isDiscoverable: false, isPublic: false,
          user: { displayName: "Your Profile", email: "" },
          startingPrice: 0, averageRating: null, reviewCount: 0,
        });
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!profile) return null;

  const completion = Math.min(((profile.onboardingStep || 0) / 12) * 100, 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Companion Dashboard</h1>
          <p className="text-gray-500">Manage your profile, bookings, and earnings</p>
        </div>
        <Link href="/companion/onboarding"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          Complete Profile
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: CheckCircle, label: "Verification", value: profile.verificationStatus, color: "bg-green-50 text-green-600" },
          { icon: Star, label: "Rating", value: profile.averageRating || "N/A", color: "bg-amber-50 text-amber-600" },
          { icon: Wallet, label: "Earnings", value: "See Earnings", color: "bg-purple-50 text-purple-600" },
          { icon: TrendingUp, label: "Bookings", value: profile.reviewCount || 0, color: "bg-blue-50 text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Profile Progress</h2>
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Onboarding Progress</span>
              <span className="text-sm text-gray-500">{Math.round(completion)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${completion}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Basic Info", "Photo", "City", "Languages", "Interests", "Categories", "Bio", "Pricing", "Availability", "Verification", "Review", "Submit"].map((step, i) => {
                const completed = i < profile.onboardingStep;
                return (
                  <span key={step} className={`px-2 py-1 rounded text-xs ${completed ? "bg-green-100 text-green-700" : i === profile.onboardingStep ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`}>
                    {completed ? "✓ " : ""}{step}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "My Bookings", href: "/companion/bookings", icon: Calendar },
              { label: "Earnings", href: "/companion/earnings", icon: Wallet },
              { label: "Reviews", href: "/companion/reviews", icon: Star },
              { label: "Payouts", href: "/companion/payouts", icon: Wallet },
            ].map((a) => (
              <Link key={a.label} href={a.href}
                className="flex items-center gap-3 bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
                <a.icon className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Verification Status</h2>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            {profile.verificationStatus === "APPROVED" ? <CheckCircle className="w-8 h-8 text-green-500" /> :
             profile.verificationStatus === "PENDING" ? <Clock className="w-8 h-8 text-amber-500" /> :
             profile.verificationStatus === "REJECTED" ? <AlertCircle className="w-8 h-8 text-red-500" /> :
             <AlertCircle className="w-8 h-8 text-gray-400" />}
            <div>
              <div className="font-medium">{profile.verificationStatus.replace("_", " ")}</div>
              <div className="text-sm text-gray-500">Complete onboarding and submit verification documents to get approved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
