"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, Clock, AlertCircle, Calendar,
  ChevronRight, Loader2, Star, TrendingUp, Wallet, Edit,
} from "lucide-react";

interface CompanionProfile {
  verificationStatus: string;
  onboardingStep: number;
  isDiscoverable: boolean;
  isPublic: boolean;
  user: { displayName: string; email: string; avatarUrl?: string | null };
  startingPrice: number;
  averageRating: number | null;
  reviewCount: number;
  totalBookings?: number;
  totalEarnings?: number;
}

function getToken() {
  if (typeof window === "undefined") return "";
  return document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1] || "";
}

const ONBOARDING_STEPS = [
  "Basic Info", "Photo", "City", "Languages", "Interests",
  "Categories", "Bio", "Pricing", "Availability", "Verification", "Review", "Submit",
];

export default function CompanionDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CompanionProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }

    fetch("/api/companions/me/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (r.ok) return r.json(); throw new Error(); })
      .then((data) => setProfile(data.profile))
      .catch(() => {
        setProfile({
          verificationStatus: "NOT_SUBMITTED", onboardingStep: 0,
          isDiscoverable: false, isPublic: false,
          user: { displayName: "Your Profile", email: "" },
          startingPrice: 0, averageRating: null, reviewCount: 0,
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (!profile) return null;

  const completion = Math.min(((profile.onboardingStep || 0) / ONBOARDING_STEPS.length) * 100, 100);
  const isProfileComplete = completion >= 100;

  const verificationColor =
    profile.verificationStatus === "APPROVED" ? "text-green-600 bg-green-50" :
    profile.verificationStatus === "PENDING" ? "text-amber-600 bg-amber-50" :
    profile.verificationStatus === "REJECTED" ? "text-red-600 bg-red-50" :
    "text-gray-500 bg-gray-50";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Companion Dashboard</h1>
          <p className="text-gray-500">Manage your profile, bookings, and earnings</p>
        </div>
        {/* Only show "Complete Profile" if not done yet */}
        {!isProfileComplete ? (
          <Link
            href="/companion/onboarding"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Complete Profile
          </Link>
        ) : (
          <Link
            href="/companion/profile"
            className="flex items-center gap-2 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50"
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-green-50">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1 ${verificationColor}`}>
            {profile.verificationStatus.replace("_", " ")}
          </div>
          <div className="text-sm text-gray-500">Verification</div>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-amber-50">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold">{profile.averageRating?.toFixed(1) || "—"}</div>
          <div className="text-sm text-gray-500">Rating ({profile.reviewCount} reviews)</div>
        </div>

        <Link href="/companion/earnings" className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-purple-50">
            <Wallet className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">INR {(profile.totalEarnings || 0).toLocaleString()}</div>
          <div className="text-sm text-gray-500">Total Earnings</div>
        </Link>

        <Link href="/companion/bookings" className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-blue-50">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{profile.totalBookings || 0}</div>
          <div className="text-sm text-gray-500">Total Bookings</div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Profile Progress</h2>
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Onboarding Progress</span>
              <span className={`text-sm font-medium ${isProfileComplete ? "text-green-600" : "text-gray-500"}`}>
                {isProfileComplete ? "Complete!" : `${Math.round(completion)}%`}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isProfileComplete ? "bg-green-500" : "bg-indigo-600"}`}
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {ONBOARDING_STEPS.map((step, i) => {
                const completed = i < profile.onboardingStep;
                const current = i === profile.onboardingStep;
                return (
                  <span
                    key={step}
                    className={`px-2 py-1 rounded text-xs ${
                      completed ? "bg-green-100 text-green-700" :
                      current ? "bg-indigo-100 text-indigo-700" :
                      "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {completed ? "✓ " : ""}{step}
                  </span>
                );
              })}
            </div>
            {!isProfileComplete && (
              <Link
                href="/companion/onboarding"
                className="mt-4 block text-center bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Continue Onboarding →
              </Link>
            )}
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
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow"
              >
                <a.icon className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Status Card */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Verification Status</h2>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            {profile.verificationStatus === "APPROVED" ? (
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            ) : profile.verificationStatus === "PENDING" ? (
              <Clock className="w-8 h-8 text-amber-500 flex-shrink-0" />
            ) : profile.verificationStatus === "REJECTED" ? (
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-gray-400 flex-shrink-0" />
            )}
            <div>
              <div className="font-medium">{profile.verificationStatus.replace("_", " ")}</div>
              <div className="text-sm text-gray-500">
                {profile.verificationStatus === "APPROVED"
                  ? "Your profile is verified and visible to customers."
                  : profile.verificationStatus === "PENDING"
                  ? "Your verification is under review. We'll notify you soon."
                  : profile.verificationStatus === "REJECTED"
                  ? "Verification was rejected. Please re-submit your documents."
                  : "Complete onboarding and submit verification documents to get approved."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
