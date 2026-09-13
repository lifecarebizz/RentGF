"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";

export default function AdminContentPage() {
  const [faqs, setFaqs] = useState([
    { id: "F1", question: "How do I register?", answer: "Click Sign Up and fill in your details. You must be 18+." },
    { id: "F2", question: "What is the platform fee?", answer: "The platform access fee is ₹499 (one-time)." },
    { id: "F3", question: "How do I contact support?", answer: "Use the contact page or email support@rentgf.com" },
  ]);

  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Management (FAQs)</h1>
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.id} className="bg-white rounded-xl border p-5">
            {editing === f.id ? (
              <div className="space-y-3">
                <input defaultValue={f.question} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                <textarea defaultValue={f.answer} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                <div className="flex gap-2">
                  <button onClick={() => setEditing(null)} className="border px-4 py-2 rounded-lg">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />} <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium mb-1">{f.question}</h3>
                  <p className="text-sm text-gray-500">{f.answer}</p>
                </div>
                <button onClick={() => setEditing(f.id)} className="text-indigo-600 hover:underline text-sm">Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
