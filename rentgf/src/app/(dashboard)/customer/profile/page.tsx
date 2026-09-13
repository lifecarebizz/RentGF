"use client";

import { useState, useEffect } from "react";
import { Loader2, User, Star, Calendar } from "lucide-react";

export default function CustomerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.match(/token=([^;]+)/)?.[1];
    if (!token) return;
    fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setUser(data.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.displayName}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <input defaultValue={user.fullName} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Display Name</label>
            <input defaultValue={user.displayName} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
            <input defaultValue={user.phone || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
            <input defaultValue={user.city || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <button className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700">Save Changes</button>
      </div>

      <div className="mt-6 bg-white rounded-2xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Account Info</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{user.email}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Role</span><span>{user.role}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Access Granted</span><span>{user.accessGranted ? "Yes" : "No"}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Member Since</span><span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span></div>
        </div>
      </div>
    </div>
  );
}
