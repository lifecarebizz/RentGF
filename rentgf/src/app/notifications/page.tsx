"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Loader2, CheckCheck, Calendar, MessageSquare, Star, Shield } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function getToken() {
  if (typeof window === "undefined") return "";
  return document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1] || "";
}

const typeIcon: Record<string, React.ReactNode> = {
  BOOKING: <Calendar className="w-5 h-5 text-blue-500" />,
  MESSAGE: <MessageSquare className="w-5 h-5 text-green-500" />,
  REVIEW: <Star className="w-5 h-5 text-amber-500" />,
  VERIFICATION: <Shield className="w-5 h-5 text-purple-500" />,
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    fetch("/api/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const markAllRead = async () => {
    const token = getToken();
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* ignore */ }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className="text-gray-500">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-4 p-4 rounded-xl border transition-colors ${
                n.isRead ? "bg-white" : "bg-indigo-50 border-indigo-100"
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full border flex items-center justify-center">
                {typeIcon[n.type] ?? <Bell className="w-5 h-5 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${n.isRead ? "text-gray-700" : "text-gray-900"}`}>{n.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString("en-IN", {
                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
              {!n.isRead && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-600 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
