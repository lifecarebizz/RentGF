"use client";

import { useState } from "react";
import { Loader2, Star, Calendar, Clock, Users } from "lucide-react";

export default function BookingFlowPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); setStep(6); }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book a Companion</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {["Date", "Time", "Details", "Review", "Payment", "Confirm"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i + 1 <= step ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i + 1 <= step ? "font-medium text-indigo-600" : "text-gray-400"}`}>{s}</span>
            {i < 5 && <div className={`h-0.5 flex-1 ${i + 1 < step ? "bg-indigo-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {done ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-green-700 mb-2">Booking Confirmed!</h2>
          <p className="text-green-600">Your companion has been notified. Check your bookings for details.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Select Date</h3>
              <input type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              <button onClick={() => setStep(2)} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">Next</button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Select Time & Duration</h3>
              <input type="time" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg">
                <option>1 hour</option>
                <option>2 hours</option>
                <option>3 hours</option>
                <option>Half day</option>
              </select>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 border py-2.5 rounded-lg">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">Next</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Activity & Notes</h3>
              <input type="text" placeholder="Activity type (optional)" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              <textarea placeholder="Additional notes (optional)" rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 border py-2.5 rounded-lg">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">Next</button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Review Booking</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Date</span><span>TBD</span></div>
                <div className="flex justify-between"><span>Duration</span><span>1 hour</span></div>
                <div className="flex justify-between"><span>Price</span><span>INR 1,499</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>INR 1,998</span></div>
              </div>
              <p className="text-xs text-gray-500">Prices shown are for reference only. Final prices are confirmed server-side.</p>
              <div className="flex gap-2">
                <button onClick={() => setStep(3)} className="flex-1 border py-2.5 rounded-lg">Back</button>
                <button onClick={() => setStep(5)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">Next</button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Complete Payment</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                Payment processing will be handled securely. No card details are stored on our end.
              </div>
              <button onClick={handleConfirm} disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Processing..." : "Pay INR 1,998"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
