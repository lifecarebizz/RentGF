"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Loader2, UserCheck, Search } from "lucide-react";

export default function AdminCompanionsPage() {
  const { user, loading } = useAuth();
  const [companions, setCompanions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setCompanions([
        { id: "C1", user: { displayName: "Comp One" }, verificationStatus: "APPROVED", isDiscoverable: true, city: "Bangalore", startingPrice: 1000 },
        { id: "C2", user: { displayName: "Comp Two" }, verificationStatus: "PENDING", isDiscoverable: false, city: "Mumbai", startingPrice: 1500 },
        { id: "C3", user: { displayName: "Comp Three" }, verificationStatus: "APPROVED", isDiscoverable: true, city: "Delhi", startingPrice: 800 },
      ]);
    }
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Companions</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Companion</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">City</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Price</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Verification</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companions.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3">{c.user?.displayName}</td>
                <td className="px-4 py-3">{c.city || "-"}</td>
                <td className="px-4 py-3">INR {c.startingPrice || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.verificationStatus === "APPROVED" ? "bg-green-100 text-green-700" : c.verificationStatus === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{c.verificationStatus}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-indigo-600 hover:underline text-sm flex items-center gap-1"><UserCheck className="w-4 h-4" /> Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
