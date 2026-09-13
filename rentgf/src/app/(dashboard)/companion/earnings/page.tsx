"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Loader2, Wallet, ArrowUpRight } from "lucide-react";

export default function CompanionEarningsPage() {
  const { user, loading } = useAuth();
  const [earnings, setEarnings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setEarnings([
        { bookingId: "B1", bookingAmount: 1499, platformCommission: 150, companionEarnings: 1349, payoutStatus: "COMPLETED" },
        { bookingId: "B2", bookingAmount: 1998, platformCommission: 200, companionEarnings: 1798, payoutStatus: "PENDING" },
      ]);
    }
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const total = earnings.reduce((sum, e) => sum + e.companionEarnings, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Earnings</h1>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-6">
        <div className="text-sm opacity-80">Total Earnings</div>
        <div className="text-3xl font-bold">INR {total.toLocaleString()}</div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Booking</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Commission</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">You Earn</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((e: any) => (
              <tr key={e.bookingId} className="border-t">
                <td className="px-4 py-3">{e.bookingId}</td>
                <td className="px-4 py-3">INR {e.bookingAmount}</td>
                <td className="px-4 py-3">INR {e.platformCommission}</td>
                <td className="px-4 py-3 font-medium">INR {e.companionEarnings}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${e.payoutStatus === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{e.payoutStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
