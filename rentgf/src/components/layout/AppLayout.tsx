"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";
import {
  Home, Search, Heart, Calendar, MessageSquare, Bell, Menu, X, FileText,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Search, label: "Discover" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
  { href: "/bookings", icon: Calendar, label: "Bookings" },
  { href: "/messages", icon: MessageSquare, label: "Messages" },
];

const legalLinks = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/safety", label: "Safety Guidelines" },
  { href: "/legal/community", label: "Community Guidelines" },
  { href: "/legal/refund", label: "Refund Policy" },
  { href: "/legal/cancellation", label: "Cancellation Policy" },
  { href: "/legal/18plus", label: "18+ Policy" },
  { href: "/legal/contact", label: "Contact Us" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<Record<string, string> | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const match = document.cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64").toString());
        setUser(payload);
      } catch { /* ignore */ }
    } else {
      setUser(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (user?.id) {
      const token = document.cookie.match(/token=([^;]+)/)?.[1];
      fetch("/api/notifications/unread", { headers: { Authorization: `Bearer ${token}` } })
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

  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"]
    .some((p) => pathname?.startsWith(p));

  if (isAuthPage) return <>{children}</>;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
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
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </Link>
                  <Link href={`/${user.role === "ADMIN" ? "admin" : user.role === "COMPANION" ? "companion" : "customer"}/dashboard`}>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {user.displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-gray-600">
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
                  <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                    Sign Up
                  </Link>
                  {/* Hamburger for guests on mobile too */}
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-gray-600">
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <Logo size="sm" />
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="p-4 flex flex-col gap-1">
              {/* Main nav */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                    isActive(item.href) ? "bg-indigo-50 text-indigo-700" : "text-gray-600"
                  )}
                >
                  <item.icon className="w-4 h-4" />{item.label}
                </Link>
              ))}

              <hr className="my-3" />

              {/* Legal links */}
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Legal & Support</p>
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 shrink-0" />{link.label}
                </Link>
              ))}

              {user && (
                <>
                  <hr className="my-3" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 flex-1 py-2">
                <item.icon className={cn("w-5 h-5 transition-colors", active ? "text-indigo-600" : "text-gray-400")} />
                <span className={cn("text-xs transition-colors", active ? "text-indigo-600 font-medium" : "text-gray-400")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <Link href="/notifications" className="flex flex-col items-center gap-0.5 flex-1 py-2 relative">
            <Bell className={cn("w-5 h-5 transition-colors", isActive("/notifications") ? "text-indigo-600" : "text-gray-400")} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
            <span className={cn("text-xs", isActive("/notifications") ? "text-indigo-600 font-medium" : "text-gray-400")}>
              Alerts
            </span>
          </Link>
        </nav>
      )}

      {/* Footer — shown on all screen sizes */}
      <footer className="border-t bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <Logo size="md" className="mb-3" />
              <p className="text-sm text-gray-500 leading-relaxed">
                18+ companionship marketplace. Strictly non-sexual social activities only.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Platform</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/discover" className="block hover:text-indigo-600 transition-colors">Discover</Link>
                <Link href="/cities" className="block hover:text-indigo-600 transition-colors">Cities</Link>
                <Link href="/categories" className="block hover:text-indigo-600 transition-colors">Categories</Link>
                <Link href="/register" className="block hover:text-indigo-600 transition-colors">Become a Companion</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/legal/privacy" className="block hover:text-indigo-600 transition-colors">Privacy Policy</Link>
                <Link href="/legal/terms" className="block hover:text-indigo-600 transition-colors">Terms of Service</Link>
                <Link href="/legal/safety" className="block hover:text-indigo-600 transition-colors">Safety Guidelines</Link>
                <Link href="/legal/18plus" className="block hover:text-indigo-600 transition-colors">18+ Policy</Link>
                <Link href="/legal/non-sexual" className="block hover:text-indigo-600 transition-colors">Non-Sexual Policy</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/legal/contact" className="block hover:text-indigo-600 transition-colors">Contact Us</Link>
                <Link href="/legal/community" className="block hover:text-indigo-600 transition-colors">Community Guidelines</Link>
                <Link href="/legal/refund" className="block hover:text-indigo-600 transition-colors">Refund Policy</Link>
                <Link href="/legal/cancellation" className="block hover:text-indigo-600 transition-colors">Cancellation Policy</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
            <span>&copy; {new Date().getFullYear()} RentGF. All rights reserved.</span>
            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full">
              18+ Only &middot; Non-Sexual Companionship
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
