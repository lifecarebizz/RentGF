"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Loader2, MapPin, Star, Trash2 } from "lucide-react";

interface Favorite {
  id: string;
  companion: {
    id: string;
    user: { id: string; displayName: string; avatarUrl?: string | null };
    city?: string;
    averageRating?: number;
    reviewCount?: number;
    startingPrice?: number;
    verificationStatus?: string;
    interests?: string[];
  };
}

function getToken() {
  if (typeof window === "undefined") return "";
  return document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1] || "";
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    fetch("/api/favorites", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setFavorites(d.favorites || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const removeFavorite = async (favoriteId: string) => {
    const token = getToken();
    try {
      await fetch(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    } catch { /* ignore */ }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Favorites</h1>
        <p className="text-gray-500">Companions you've saved for quick access</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">Save companions you like to find them easily</p>
          <Link href="/discover" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700">
            Discover Companions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const c = fav.companion;
            return (
              <div key={fav.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-44 bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
                  {c.user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.user.avatarUrl} alt={c.user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-indigo-200 flex items-center justify-center text-2xl font-bold text-indigo-600">
                        {c.user?.displayName?.[0]?.toUpperCase() || "?"}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{c.user?.displayName}</h3>
                  {c.city && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <MapPin className="w-3.5 h-3.5" /> {c.city}
                    </div>
                  )}
                  {c.averageRating && (
                    <div className="flex items-center gap-1 text-sm mb-3">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{c.averageRating}</span>
                      <span className="text-gray-400">({c.reviewCount || 0})</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-semibold text-sm">INR {c.startingPrice || 0}/hr</span>
                    <Link
                      href={`/discover/${c.user?.id}`}
                      className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-700"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
