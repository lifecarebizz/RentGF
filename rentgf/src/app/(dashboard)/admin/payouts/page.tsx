"use client";

import { useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([
    { id: "P1", companion: { user: { displayName: "Comp One" } }, amount: 1349, status: "COMPLETED", requestedDate: "2025-01-15", processedDate: "2025-01-17", adminNotes: "Processed via bank transfer" },
    { id: "P2", companion: { user: { displayName: "Comp Three" } }, amount: 1798, status: "PENDING", requestedDate: "2025-01-20", processedDate: null, adminNotes: "" },
  ]);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleProcess = async (id: string) => {
    setProcessing(id);
    setTimeout(() => {
      setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: "COMPLETED", processedDate: new Date().toISOString().split("T")[0] } : p));
      setProcessing(null);
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payout Management</h1>
      <div className="space-y-4">
        {payouts.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.companion?.user?.displayName}</div>
                <div className="text-sm text-gray-500">Requested: {p.requestedDate}</div>
                <div className="text-2xl font-bold mt-1">INR {p.amount}</div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                {p.status === "PENDING" && (
                  <button onClick={() => handleProcess(p.id)} disabled={processing === p.id}
                    className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1">
                    {processing === p.id && <Loader2 className="w-4 h-4 animate-spin" />}
                    {processing === p.id ? "Processing..." : "Process"}
                  </button>
                )}
              </div>
            </div>
            {p.adminNotes && <p className="text-sm text-gray-500 mt-3">Note: {p.adminNotes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
