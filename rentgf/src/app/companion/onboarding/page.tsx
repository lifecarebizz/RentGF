"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Camera, MapPin, Globe, MessageCircle, DollarSign, Calendar, FileCheck, CheckCircle } from "lucide-react";

const steps = [
  { label: "Basic Info", icon: User },
  { label: "Photo", icon: Camera },
  { label: "City", icon: MapPin },
  { label: "Languages", icon: Globe },
  { label: "Interests", icon: MessageCircle },
  { label: "Categories", icon: MessageCircle },
  { label: "Bio", icon: MessageCircle },
  { label: "Pricing", icon: DollarSign },
  { label: "Availability", icon: Calendar },
  { label: "Verification", icon: FileCheck },
  { label: "Review", icon: CheckCircle },
  { label: "Submit", icon: CheckCircle },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step >= steps.length - 1) {
      router.push("/companion/dashboard");
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Companion Onboarding</h1>
        <span className="text-sm text-gray-500">{step + 1} of {steps.length}</span>
      </div>

      <div className="mb-8">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-indigo-600 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <div key={s.label} className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${i < step ? "bg-green-100 text-green-700" : i === step ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`}>
              {i < step ? "✓ " : ""} {s.label}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-8">
        {(() => {
          const StepIcon = steps[step].icon;
          return (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <StepIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold">{steps[step].label}</h2>
            </div>
          );
        })()}

        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Full Name" className="px-4 py-2.5 border border-gray-300 rounded-lg" />
              <input placeholder="Display Name" className="px-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>
            <input placeholder="Phone Number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg">
              <option>Select City</option>
              <option>Bangalore</option><option>Mumbai</option><option>Delhi</option>
              <option>Hyderabad</option><option>Chennai</option><option>Pune</option>
            </select>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <input placeholder="Languages (comma separated)" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <input placeholder="Interests (comma separated)" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <input placeholder="Categories (comma separated)" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
        )}
        {step === 6 && (
          <div className="space-y-4">
            <textarea placeholder="Tell people about yourself..." rows={6} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
        )}
        {step === 7 && (
          <div className="space-y-4">
            <label className="text-sm font-medium">Starting Price (per hour)</label>
            <input type="number" placeholder="500" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
        )}
        {step === 8 && (
          <div className="space-y-4">
            <input placeholder="Available Days (e.g., Monday, Wednesday)" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
            <input placeholder="Available Times (e.g., 10am-8pm)" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
        )}
        {step === 9 && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="font-medium mb-2">Submit Verification</p>
            <p className="text-sm text-gray-500">Submit documents after completing onboarding.</p>
          </div>
        )}
        {step === 10 && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-medium mb-2">Review Your Profile</p>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="border px-4 py-2.5 rounded-lg">Back</button>
          )}
          <button onClick={handleNext} className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 ml-auto">
            {step >= steps.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
