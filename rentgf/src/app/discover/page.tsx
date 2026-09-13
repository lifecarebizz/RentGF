"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, Star, MapPin, ShoppingBag, Heart, MessageSquare } from "lucide-react";

export default function DiscoverPage() {
  const router = useRouter();
  const [companions, setCompanions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [meta, setMeta] = useState<any>({ cities: [], categories: [], interests: [] });

  useEffect(() => {
    fetch("/api/meta").then((r) => r.json()).then(setMeta).catch(() => {});
    loadCompanions();
  }, []);

  const loadCompanions = async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discover?q=${q}&limit=20`);
      const data = await res.json();
      setCompanions(data.companions || []);
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Discover Companions</h1>
        <p className="text-gray-500">Find verified companions for social activities</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, interest..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); loadCompanions(e.target.value); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-sm text-gray-500">Filter by:</span>
          {(meta.cities || []).slice(0, 5).map((c: any) => (
            <button key={c.id} onClick={() => {}} className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition-colors">{c.name}</button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : companions.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No companions found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companions.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">{c.user?.displayName}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{c.user?.displayName}</h3>
                  {c.verificationStatus === "APPROVED" && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" /> {c.city || "Unknown"}
                </div>
                {c.averageRating && (
                  <div className="flex items-center gap-1 text-sm mb-3">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{c.averageRating}</span>
                    <span className="text-gray-400">({c.reviewCount || 0} reviews)</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(c.interests || []).slice(0, 3).map((i: string) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{i}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">INR {c.startingPrice || 0}/hr</span>
                  <Link href={`/discover/${c.user?.id}`} className="text-indigo-600 text-sm font-medium hover:underline">View Profile</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
