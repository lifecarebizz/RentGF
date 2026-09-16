"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, Star, MapPin, Heart, SlidersHorizontal, X } from "lucide-react";

interface Companion {
  id: string;
  user: { id: string; displayName: string; avatarUrl?: string | null };
  city?: string;
  averageRating?: number;
  reviewCount?: number;
  interests?: string[];
  startingPrice?: number;
  verificationStatus?: string;
}

interface Meta {
  cities: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  interests: string[];
}

export default function DiscoverPage() {
  const router = useRouter();
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [meta, setMeta] = useState<Meta>({ cities: [], categories: [], interests: [] });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadCompanions = useCallback(async (q = "", city = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (q) params.set("q", q);
      if (city) params.set("city", city);
      const res = await fetch(`/api/discover?${params.toString()}`);
      const data = await res.json();
      setCompanions(data.companions || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/api/meta").then((r) => r.json()).then(setMeta).catch(() => {});
    loadCompanions();
  }, [loadCompanions]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadCompanions(value, selectedCity);
    }, 400);
  };

  const handleCityFilter = (cityName: string) => {
    const newCity = selectedCity === cityName ? "" : cityName;
    setSelectedCity(newCity);
    loadCompanions(searchQuery, newCity);
  };

  const clearFilters = () => {
    setSelectedCity("");
    setSearchQuery("");
    loadCompanions("", "");
  };

  const toggleFavorite = (companionUserId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(companionUserId)) next.delete(companionUserId);
      else next.add(companionUserId);
      return next;
    });
  };

  const hasFilters = selectedCity || searchQuery;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Discover Companions</h1>
        <p className="text-gray-500">Find verified companions for social activities</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, interest..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 text-gray-600"
            >
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {meta.cities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <SlidersHorizontal className="w-4 h-4" /> City:
            </span>
            {meta.cities.slice(0, 8).map((c) => (
              <button
                key={c.id}
                onClick={() => handleCityFilter(c.name)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCity === c.name
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          {companions.length} companion{companions.length !== 1 ? "s" : ""} found
          {selectedCity ? ` in ${selectedCity}` : ""}
        </p>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : companions.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No companions found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-indigo-600 text-sm font-medium hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companions.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Photo */}
              <div className="h-52 bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
                {c.user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.user.avatarUrl}
                    alt={c.user.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-3xl font-bold text-indigo-600">
                      {c.user?.displayName?.[0]?.toUpperCase() || "?"}
                    </div>
                  </div>
                )}
                {/* Verified badge */}
                {c.verificationStatus === "APPROVED" && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-medium">
                    Verified
                  </span>
                )}
                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(c.user?.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                  aria-label="Toggle favorite"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      favorites.has(c.user?.id) ? "fill-red-500 text-red-500" : "text-gray-500"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold">{c.user?.displayName}</h3>
                  {c.averageRating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium">{c.averageRating}</span>
                      <span className="text-gray-400 text-xs">({c.reviewCount || 0})</span>
                    </div>
                  )}
                </div>
                {c.city && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <MapPin className="w-3.5 h-3.5" /> {c.city}
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(c.interests || []).slice(0, 3).map((i: string) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                      {i}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-semibold text-gray-900">INR {c.startingPrice || 0}/hr</span>
                  <Link
                    href={`/discover/${c.user?.id}`}
                    className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
