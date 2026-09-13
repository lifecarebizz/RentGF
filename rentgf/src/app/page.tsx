"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, Calendar, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { getCookie, setCookie } from "cookies-next";

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setCookie("token", data.token, { maxAge: 60 * 60 * 24 * 30 });
        setUser(data.user);
        if (data.user.role === "ADMIN") router.push("/admin/dashboard");
        else if (data.user.role === "COMPANION") router.push("/companion/dashboard");
        else router.push("/customer/dashboard");
      }
    } catch {}
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-3xl p-8 sm:p-12 text-white mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6 text-sm">
            <Sparkles className="w-4 h-4" />
            18+ Non-Sexual Companionship Marketplace
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Find Quality Companionship</h1>
          <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Connect with verified companions for conversation, dining, events, sightseeing, and more.
          </p>
          {user ? (
            <Link href="/discover" className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors">
              Explore <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link href="/register" className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors text-center">
                Get Started
              </Link>
              <Link href="/login" className="bg-white/10 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors text-center">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Login Form */}
      {!user && (
        <section className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Quick Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input name="email" type="email" required placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <input name="password" type="password" required placeholder="Your password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Sign In
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              New here? <Link href="/register" className="text-indigo-600 font-medium">Create an account</Link>
            </p>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Search, title: "Discover", desc: "Find companions in your city by interests and categories" },
          { icon: Calendar, title: "Book", desc: "Simple booking with clear pricing and availability" },
          { icon: Heart, title: "Favorites", desc: "Save favorite companions for quick access" },
          { icon: Shield, title: "Verified", desc: "All companions go through thorough verification" },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl border p-6 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <f.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
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
