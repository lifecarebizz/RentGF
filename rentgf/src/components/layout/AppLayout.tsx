"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Heart,
  Calendar,
  MessageSquare,
  User,
  Settings,
  Bell,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Search, label: "Discover" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
  { href: "/bookings", icon: Calendar, label: "Bookings" },
  { href: "/messages", icon: MessageSquare, label: "Messages" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const match = document.cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64").toString());
        setUser(payload);
      } catch {}
    } else {
      setUser(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/notifications/unread`, {
        headers: { Authorization: `Bearer ${document.cookie.match(/token=([^;]+)/)?.[1]}` },
      })
        .then((r) => r.json())
        .then((data) => setUnread(data.unreadCount || 0))
        .catch(() => {});
    }
  }, [user?.id, pathname]);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    setUser(null);
    router.push("/");
  };

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") || pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/verify-email");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RentGF</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname?.startsWith(item.href) ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                )}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link href="/notifications" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Bell className="w-5 h-5" />
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </Link>
                  <Link href={`/${user.role === "ADMIN" ? "admin" : user.role === "COMPANION" ? "companion" : "customer"}/dashboard`}>
                    <img src={user.avatarUrl || "/avatar-placeholder.png"} alt="Profile" className="w-8 h-8 rounded-full" />
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                    Logout
                  </button>
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-gray-600">
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Login
                  </Link>
                  <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium",
                  pathname?.startsWith(item.href) ? "bg-indigo-50 text-indigo-700" : "text-gray-600"
                )}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>

      <footer className="border-t bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">RentGF</span>
              </div>
              <p className="text-sm text-gray-500">
                18+ companionship marketplace. Strictly non-sexual social activities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/discover" className="block hover:text-gray-700">Discover</Link>
                <Link href="/cities" className="block hover:text-gray-700">Cities</Link>
                <Link href="/categories" className="block hover:text-gray-700">Categories</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/legal/terms" className="block hover:text-gray-700">Terms of Service</Link>
                <Link href="/legal/privacy" className="block hover:text-gray-700">Privacy Policy</Link>
                <Link href="/legal/safety" className="block hover:text-gray-700">Safety Guidelines</Link>
                <Link href="/legal/18plus" className="block hover:text-gray-700">18+ Policy</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/legal/contact" className="block hover:text-gray-700">Contact Us</Link>
                <Link href="/legal/community" className="block hover:text-gray-700">Community Guidelines</Link>
                <Link href="/legal/refund" className="block hover:text-gray-700">Refund Policy</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} RentGF. All rights reserved. 18+ Only. Non-sexual companionship.
          </div>
        </div>
      </footer>
    </div>
  );
}
