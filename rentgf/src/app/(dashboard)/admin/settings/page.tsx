"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";

export default function AdminPlatformSettingsPage() {
  const [settings, setSettings] = useState({
    accessFee: 499,
    currency: "INR",
    platformEnabled: true,
    accessFeeDescription: "One-time platform access fee",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Settings</h1>
      <div className="bg-white rounded-xl border p-6 space-y-6 max-w-2xl">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Platform Access Fee (INR)</label>
          <input
            type="number"
            value={settings.accessFee}
            onChange={(e) => setSettings({ ...settings, accessFee: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Currency</label>
          <input value={settings.currency} disabled className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <input value={settings.accessFeeDescription} onChange={(e) => setSettings({ ...settings, accessFeeDescription: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enabled"
            checked={settings.platformEnabled}
            onChange={(e) => setSettings({ ...settings, platformEnabled: e.target.checked })}
            className="w-5 h-5 accent-indigo-600"
          />
          <label htmlFor="enabled" className="font-medium">Platform Enabled</label>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
