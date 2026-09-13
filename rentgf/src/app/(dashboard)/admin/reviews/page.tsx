"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Loader2, Star, MessageSquare, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function AdminReviewsPage() {
  const { user, loading } = useAuth();
  const [reviews, setReviews] = useState([
    { id: "R1", reviewer: { displayName: "John D." }, reviewee: { displayName: "Comp One" }, rating: 5, comment: "Excellent!", status: "APPROVED" },
    { id: "R2", reviewer: { displayName: "Sara K." }, reviewee: { displayName: "Comp Two" }, rating: 3, comment: "Average experience", status: "PENDING" },
  ]);

  useEffect(() => { if (user) {} }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Review Moderation</h1>
      <div className="space-y-4">
        {reviews.map((r: any) => (
          <div key={r.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.reviewer?.displayName} → {r.reviewee?.displayName}</div>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                  ))}
                </div>
                <p className="text-gray-600 mt-2">{r.comment}</p>
              </div>
              {r.status === "PENDING" && (
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Approve</button>
                  <button className="border px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"><XCircle className="w-4 h-4" /> Reject</button>
                </div>
              )}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
