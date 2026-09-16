"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Calendar, Heart, Shield, ArrowRight, Star, MapPin, ChevronRight } from "lucide-react";
import Logo from "@/components/common/Logo";

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

export default function HomePage() {
  const [featured, setFeatured] = useState<Companion[]>([]);

  useEffect(() => {
    fetch("/api/discover?limit=6&featured=true")
      .then((r) => r.json())
      .then((d) => setFeatured(d.companions || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-3xl p-8 sm:p-14 text-white mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" white href="" />
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-4 text-sm">
            18+ Non-Sexual Companionship Marketplace
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Find Quality Companionship</h1>
          <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Connect with verified companions for conversation, dining, events, sightseeing, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors"
            >
              Explore Companions <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="bg-white/10 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors text-center"
            >
              Join as Companion
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Search, title: "Discover", desc: "Find companions in your city by interests and categories" },
          { icon: Calendar, title: "Book", desc: "Simple booking with clear pricing and availability" },
          { icon: Heart, title: "Favorites", desc: "Save favorite companions for quick access" },
          { icon: Shield, title: "Verified", desc: "All companions go through thorough verification" },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl border p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <f.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Companions */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Featured Companions</h2>
              <p className="text-gray-500 text-sm mt-1">Top-rated, verified companions near you</p>
            </div>
            <Link
              href="/discover"
              className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden relative">
                  {c.user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.user.avatarUrl}
                      alt={c.user.displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-3xl font-bold text-indigo-600">
                      {c.user?.displayName?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  {c.verificationStatus === "APPROVED" && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-medium">
                      Verified
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{c.user?.displayName}</h3>
                  </div>
                  {c.city && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" /> {c.city}
                    </div>
                  )}
                  {c.averageRating && (
                    <div className="flex items-center gap-1 text-sm mb-3">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium">{c.averageRating}</span>
                      <span className="text-gray-400">({c.reviewCount || 0})</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(c.interests || []).slice(0, 3).map((i: string) => (
                      <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">{i}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
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
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-12 text-center">
        <h2 className="text-2xl font-bold mb-3">Become a Companion</h2>
        <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
          Earn money on your own schedule by offering companionship services. Join hundreds of verified companions.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* 18+ Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <Shield className="w-6 h-6 text-amber-600 mx-auto mb-2" />
        <p className="font-medium text-amber-800">18+ Only</p>
        <p className="text-sm text-amber-600 mt-1">
          RentGF is strictly for adults 18 years and older. All interactions must be non-sexual and lawful.
        </p>
      </div>
    </div>
  );
}
