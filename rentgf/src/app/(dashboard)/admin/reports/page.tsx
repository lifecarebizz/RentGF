"use client";

import { useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([
    { id: "REP1", reporter: { displayName: "User A" }, reported: { displayName: "Comp X" }, category: "HARASSMENT", description: "Inappropriate behavior", status: "OPEN" },
    { id: "REP2", reporter: { displayName: "User B" }, reported: { displayName: "Comp Y" }, category: "SCAM_FRAUD", description: "Suspicious activity", status: "UNDER_REVIEW" },
  ]);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleResolve = async (id: string, action: string) => {
    setProcessing(id);
    setTimeout(() => {
      setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: action === "BLOCK" ? "ACTION_TAKEN" : "RESOLVED" } : r));
      setProcessing(null);
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="space-y-4">
        {reports.map((r: any) => (
          <div key={r.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">{r.category}</span>
                <p className="text-sm text-gray-500 mt-1">{r.reporter?.displayName} reported {r.reported?.displayName}</p>
                <p className="text-sm mt-1">{r.description}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === "OPEN" ? "bg-red-100 text-red-700" : r.status === "UNDER_REVIEW" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{r.status}</span>
            </div>
            {r.status !== "RESOLVED" && r.status !== "ACTION_TAKEN" && (
              <div className="flex gap-2">
                <button onClick={() => handleResolve(r.id, "WARN")} disabled={processing === r.id} className="border px-3 py-1.5 rounded-lg text-sm">Warn</button>
                <button onClick={() => handleResolve(r.id, "SUSPEND")} disabled={processing === r.id} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm">Suspend</button>
                <button onClick={() => handleResolve(r.id, "BLOCK")} disabled={processing === r.id} className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                  {processing === r.id && <Loader2 className="w-4 h-4 animate-spin" />} Block
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
