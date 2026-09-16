"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star, MapPin, Clock, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

function getToken() {
  if (typeof window === "undefined") return "";
  return document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1] || "";
}

export default function CompanionProfilePage({ params }: { params: { companionId: string } }) {
  const router = useRouter();
  const [companion, setCompanion] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    fetch(`/api/companions/${params.companionId}`)
      .then((r) => { if (r.ok) return r.json(); throw new Error(); })
      .then((data) => { setCompanion(data.profile); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.companionId]);

  const handleBookNow = useCallback(() => {
    const token = getToken();
    if (!token) { toast.error("Please sign in to book"); router.push("/login"); return; }
    const user = companion?.user as Record<string, unknown> | undefined;
    const price = companion?.startingPrice as number | undefined;
    const name = user?.displayName as string | undefined;
    router.push(`/book?companionId=${params.companionId}&name=${encodeURIComponent(name || "Companion")}&rate=${price || 0}`);
  }, [companion, params.companionId, router]);

  const handleSendMessage = useCallback(async () => {
    const token = getToken();
    if (!token) { toast.error("Please sign in to message"); router.push("/login"); return; }
    setMessaging(true);
    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUserId: params.companionId }),
      });
      const data = await res.json();
      if (res.ok || res.status === 201) {
        router.push(`/messages?conv=${data.conversationId}`);
      } else {
        toast.error(data.error || "Failed to start conversation");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setMessaging(false);
    }
  }, [params.companionId, router]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!companion) return <div className="text-center py-20"><p className="text-gray-500">Companion not found</p></div>;

  const user = (companion.user || {}) as Record<string, unknown>;
  const interests = (companion.interests || []) as string[];
  const categories = (companion.categories || []) as string[];
  const languages = (companion.languages || []) as string[];
  const availabilityDays = (companion.availabilityDays || []) as string[];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <div className="w-24 h-24 bg-indigo-200 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                {String(user.displayName || "?")[0].toUpperCase()}
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold">{String(user.displayName || "")}</h1>
                {companion.verificationStatus === "APPROVED" && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-500 mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {String(companion.city || "N/A")}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {user.dateOfBirth ? `Age ${new Date().getFullYear() - new Date(String(user.dateOfBirth)).getFullYear()}` : "Age N/A"}
                </span>
              </div>
              {companion.averageRating && (
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{String(companion.averageRating)}</span>
                  <span className="text-gray-400">({Number(companion.reviewCount) || 0} reviews)</span>
                </div>
              )}
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-600 mb-6">{String(companion.bio || "No bio provided.")}</p>

              {interests.length > 0 && (
                <>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {interests.map((i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">{i}</span>
                    ))}
                  </div>
                </>
              )}

              {categories.length > 0 && (
                <>
                  <h3 className="font-semibold mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((c) => (
                      <span key={c} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">{c}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl border p-6 sticky top-20">
            <div className="text-3xl font-bold mb-1">INR {Number(companion.startingPrice) || 0}</div>
            <div className="text-gray-500 text-sm mb-6">per hour</div>

            <button onClick={handleBookNow}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Book Now
            </button>
            <button onClick={handleSendMessage} disabled={messaging}
              className="w-full mt-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {messaging ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              Send Message
            </button>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <span key={l} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">{l}</span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Availability</h4>
              <p className="text-sm text-gray-500">
                {availabilityDays.length > 0 ? availabilityDays.join(", ") : "Contact for availability"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
