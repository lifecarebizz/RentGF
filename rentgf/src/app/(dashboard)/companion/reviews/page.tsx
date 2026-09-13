"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";

export default function CompanionReviewsPage() {
  const { user, loading } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setReviews([
        { id: "R1", reviewer: { displayName: "John D." }, rating: 5, comment: "Great companion! Very friendly and engaging.", isVerified: true, status: "APPROVED" },
        { id: "R2", reviewer: { displayName: "Sarah M." }, rating: 4, comment: "Enjoyed our time together.", isVerified: true, status: "APPROVED" },
      ]);
    }
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      {reviews.length === 0 ? (
        <div className="text-center py-12"><p className="text-gray-500">No reviews yet</p></div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{r.reviewer?.displayName}</div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{r.comment}</p>
              <div className="flex items-center gap-2 mt-3">
                {r.isVerified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>}
                <span className="text-xs text-gray-400">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
