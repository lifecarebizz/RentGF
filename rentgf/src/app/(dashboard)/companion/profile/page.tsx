"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Star, Heart, Calendar, CheckCircle } from "lucide-react";

export default function CompanionProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetch("/api/companions/me/profile", { headers: { Authorization: `Bearer ${document.cookie.match(/token=([^;]+)/)?.[1]}` } })
        .then((r) => { if (r.ok) return r.json(); throw new Error(); })
        .then((data) => setProfile(data.profile))
        .catch(() => {
          setProfile({
            verificationStatus: "NOT_SUBMITTED", onboardingStep: 0,
            isDiscoverable: false, city: "", startingPrice: 0,
            averageRating: null, reviewCount: 0,
            user: { displayName: user?.displayName, email: user?.email },
            languages: [], interests: [], categories: [], bio: "", availabilityDays: [], availabilityTimes: [],
          });
        });
    }
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!profile) return null;

  const completion = Math.min(((profile.onboardingStep || 0) / 12) * 100, 100);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{profile.user?.displayName}</h2>
            <p className="text-gray-500">{profile.user?.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.verificationStatus === "APPROVED" ? "bg-green-100 text-green-700" : profile.verificationStatus === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
            {profile.verificationStatus.replace("_", " ")}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Profile Completion</span>
            <span>{Math.round(completion)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${completion}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
            <input defaultValue={profile.city || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Starting Price (per hour)</label>
            <input type="number" defaultValue={profile.startingPrice || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Bio</label>
            <textarea defaultValue={profile.bio || ""} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Star, label: "Rating", value: profile.averageRating || "N/A" },
          { icon: Heart, label: "Favorites Count", value: "—" },
          { icon: Calendar, label: "Bookings", value: "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-5 text-center">
            <s.icon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
