"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Calendar, Clock, FileText, CheckCircle, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string };
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const STEPS = ["Date", "Time", "Details", "Review", "Payment", "Done"];

export default function BookingFlowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companionId = searchParams.get("companionId") || "";
  const companionName = searchParams.get("name") || "Companion";
  const hourlyRate = Number(searchParams.get("rate") || 0);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [activityType, setActivityType] = useState("");
  const [messageNote, setMessageNote] = useState("");

  const [bookingId, setBookingId] = useState("");
  const [razorpayOrderId, setRazorpayOrderId] = useState("");
  const [amount, setAmount] = useState(0);

  const totalPrice = Math.round(hourlyRate * (duration / 60));
  const token = typeof window !== "undefined" ? document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1] : "";

  const createBooking = useCallback(async () => {
    setLoading(true);
    try {
      const startDateTime = new Date(`${bookingDate}T${startTime}:00`).toISOString();
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ companionId, bookingDate, startTime: startDateTime, durationMinutes: duration, activityType, message: messageNote }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Booking failed"); return; }
      setBookingId(data.booking.id);
      setRazorpayOrderId(data.razorpayOrderId);
      setAmount(data.amount);
      setStep(5);
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }, [bookingDate, startTime, duration, activityType, messageNote, companionId, token]);

  const loadRazorpay = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const openRazorpay = useCallback(async () => {
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error("Payment service failed to load. Refresh and try again."); return; }
    setLoading(true);
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount,
      currency: "INR",
      name: "RentGF",
      description: `Booking with ${companionName}`,
      order_id: razorpayOrderId,
      handler: async (response: RazorpayResponse) => {
        try {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            setStep(6);
          } else {
            toast.error(verifyData.error || "Payment verification failed");
          }
        } catch {
          toast.error("Verification failed. Contact support.");
        } finally {
          setLoading(false);
        }
      },
      prefill: { name: "", email: "" },
      theme: { color: "#4f46e5" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [amount, razorpayOrderId, companionName, token, bookingId, loadRazorpay]);

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Book {companionName}</h1>
      <p className="text-gray-500 mb-6">INR {hourlyRate}/hr</p>

      {/* Steps indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${ i + 1 <= step ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500" }`}>
              {i + 1 < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${ i + 1 <= step ? "font-medium text-indigo-600" : "text-gray-400" }`}>{s}</span>
            {i < 5 && <div className={`h-0.5 w-6 ${ i + 1 < step ? "bg-indigo-600" : "bg-gray-200" }`} />}
          </div>
        ))}
      </div>

      {step === 6 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-700 mb-2">Booking Confirmed!</h2>
          <p className="text-green-600 mb-6">Your companion has been notified. Check your email for confirmation.</p>
          <button onClick={() => router.push("/customer/dashboard")} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700">
            View My Bookings
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Calendar className="w-5 h-5 text-indigo-600" /> Select Date
              </div>
              <input type="date" min={minDate} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              <button disabled={!bookingDate} onClick={() => setStep(2)}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50">Next</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Clock className="w-5 h-5 text-indigo-600" /> Time &amp; Duration
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Start Time</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Duration</label>
                <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option value={60}>1 hour — INR {hourlyRate}</option>
                  <option value={120}>2 hours — INR {hourlyRate * 2}</option>
                  <option value={180}>3 hours — INR {hourlyRate * 3}</option>
                  <option value={240}>Half day (4 hrs) — INR {hourlyRate * 4}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 border py-2.5 rounded-lg">Back</button>
                <button disabled={!startTime} onClick={() => setStep(3)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                <FileText className="w-5 h-5 text-indigo-600" /> Activity Details
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Activity Type (optional)</label>
                <input type="text" placeholder="e.g. Dinner, Movie, Sightseeing" value={activityType} onChange={(e) => setActivityType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Notes for companion (optional)</label>
                <textarea rows={3} placeholder="Any special requests or info..." value={messageNote} onChange={(e) => setMessageNote(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 border py-2.5 rounded-lg">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">Next</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Review Your Booking</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Companion</span><span className="font-medium">{companionName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{new Date(bookingDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{startTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{duration} minutes</span></div>
                {activityType && <div className="flex justify-between"><span className="text-gray-500">Activity</span><span className="font-medium">{activityType}</span></div>}
                <div className="border-t pt-3 flex justify-between font-semibold text-base"><span>Total</span><span>INR {totalPrice}</span></div>
              </div>
              <p className="text-xs text-gray-400">Final price confirmed server-side at time of booking.</p>
              <div className="flex gap-2">
                <button onClick={() => setStep(3)} className="flex-1 border py-2.5 rounded-lg">Back</button>
                <button onClick={createBooking} disabled={loading} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Creating..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                <CreditCard className="w-5 h-5 text-indigo-600" /> Complete Payment
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-indigo-700">INR {totalPrice}</p>
                <p className="text-sm text-indigo-500 mt-1">Secure payment via Razorpay</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                Your payment is processed securely. No card details stored on our servers.
              </div>
              <button onClick={openRazorpay} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Pay INR {totalPrice}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
