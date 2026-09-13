"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Loader2, Bell, Shield, User, CreditCard, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerSettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "security", label: "Security", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "billing", label: "Billing", icon: CreditCard },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === tab.id ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border p-6">
            {activeTab === "profile" && (
              <div className="space-y-4">
                <h2 className="font-semibold">Edit Profile</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Display Name</label>
                    <input defaultValue={user.displayName} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                    <input defaultValue={user.fullName} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                  <input defaultValue={user.phone || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                  <input defaultValue={user.city || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Save Changes</button>
              </div>
            )}
            {activeTab === "security" && (
              <div className="space-y-4">
                <h2 className="font-semibold">Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Current Password</label>
                    <input type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
                    <input type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Update Password</button>
                </div>
              </div>
            )}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h2 className="font-semibold">Notifications</h2>
                {["Booking updates", "Messages", "Payment confirmations", "Security alerts"].map((n) => (
                  <div key={n} className="flex items-center justify-between">
                    <span>{n}</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
                  </div>
                ))}
              </div>
            )}
            {activeTab === "billing" && (
              <div className="space-y-4">
                <h2 className="font-semibold">Billing</h2>
                <p className="text-gray-500">Platform access: ₹499 (one-time)</p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">Access fee is managed by platform settings.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
