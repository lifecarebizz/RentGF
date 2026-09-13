"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, UserCheck, AlertCircle } from "lucide-react";

export default function AdminVerificationPage() {
  const { user, loading } = useAuth();
  const [pending, setPending] = useState([
    { id: "V1", companion: { user: { displayName: "Comp Two" } }, documents: ["ID Proof", "Selfie"] },
    { id: "V2", companion: { user: { displayName: "Comp Four" } }, documents: ["ID Proof"] },
  ]);

  useEffect(() => {
    // Data is pre-populated for demo
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Verification Queue</h1>
      <div className="space-y-4">
        {pending.map((v) => (
          <div key={v.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">{v.companion?.user?.displayName}</div>
                  <div className="text-sm text-gray-500">{v.documents.length} documents</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1">
                  <UserCheck className="w-4 h-4" /> Approve
                </button>
                <button className="border px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {v.documents.map((d: string) => (
                <span key={d} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{d}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
