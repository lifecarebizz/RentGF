"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Download, FileText } from "lucide-react";

export default function CompanionPayoutsPage() {
  const { user, loading } = useAuth();
  const [payouts, setPayouts] = useState([
    { id: "P1", amount: 1349, status: "COMPLETED", requestedDate: "2025-01-15", processedDate: "2025-01-17", reference: "PAY-001" },
    { id: "P2", amount: 1798, status: "PENDING", requestedDate: "2025-01-20", processedDate: null, reference: null },
  ]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payouts</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
          <Download className="w-4 h-4" /> Request Payout
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Requested</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Processed</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Reference</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3 font-medium">INR {p.amount}</td>
                <td className="px-4 py-3">{p.requestedDate}</td>
                <td className="px-4 py-3">{p.processedDate || "-"}</td>
                <td className="px-4 py-3">{p.reference || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "COMPLETED" ? "bg-green-100 text-green-700" : p.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
