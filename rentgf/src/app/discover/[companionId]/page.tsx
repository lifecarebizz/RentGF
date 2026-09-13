"use client";

import { useState, useEffect } from "react";
import { Loader2, Star, MapPin, Clock } from "lucide-react";

export default function CompanionProfilePage({ params }: { params: { companionId: string } }) {
  const [companion, setCompanion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/companions/${params.companionId}`)
      .then((r) => { if (r.ok) return r.json(); throw new Error(); })
      .then((data) => { setCompanion(data.profile); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.companionId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!companion) return <div className="text-center py-20"><p className="text-gray-500">Companion not found</p></div>;

  const user = companion.user || {};

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">{user.displayName}</span>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                {companion.verificationStatus === "APPROVED" && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-500 mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {companion.city || "N/A"}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Age {user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : "N/A"}</span>
              </div>
              {companion.averageRating && (
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{companion.averageRating}</span>
                  <span className="text-gray-400">({companion.reviewCount || 0} reviews)</span>
                </div>
              )}
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-600 mb-6">{companion.bio || "No bio provided."}</p>

              {companion.interests.length > 0 && (
                <>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {companion.interests.map((i: string) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">{i}</span>
                    ))}
                  </div>
                </>
              )}

              {companion.categories.length > 0 && (
                <>
                  <h3 className="font-semibold mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {companion.categories.map((c: string) => (
                      <span key={c} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">{c}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl border p-6 sticky top-20">
            <div className="text-3xl font-bold mb-1">INR {companion.startingPrice || 0}</div>
            <div className="text-gray-500 text-sm mb-6">per hour</div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Platform Access</span>
                <span>INR 499</span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Book Now
            </button>
            <button className="w-full mt-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Send Message
            </button>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {(companion.languages || []).map((l: string) => (
                  <span key={l} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">{l}</span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Availability</h4>
              <p className="text-sm text-gray-500">
                {companion.availabilityDays?.length > 0 ? companion.availabilityDays.join(", ") : "Contact for availability"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
