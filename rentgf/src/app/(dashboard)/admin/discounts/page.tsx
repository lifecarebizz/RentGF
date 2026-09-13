"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([
    { id: "D1", code: "WELCOME20", type: "PERCENTAGE", value: 20, startDate: "2025-01-01", endDate: "2025-12-31", isActive: true, marketingLabel: "Welcome Discount", promoMessage: "20% off your first booking!", usedCount: 45, maxUses: 100 },
  ]);

  const handleAdd = () => {
    setDiscounts([...discounts, { id: `D${discounts.length + 1}`, code: "", type: "PERCENTAGE", value: 0, startDate: "", endDate: "", isActive: false, marketingLabel: "", promoMessage: "", usedCount: 0, maxUses: undefined }]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Discounts</h1>
        <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Discount
        </button>
      </div>
      <div className="space-y-4">
        {discounts.map((d: any) => (
          <div key={d.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-medium">{d.code || "New discount"}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {d.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500">Type</label>
                <div className="font-medium">{d.type}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Value</label>
                <div className="font-medium">{d.value}{d.type === "PERCENTAGE" ? "%" : "INR"}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Used</label>
                <div className="font-medium">{d.usedCount}/{d.maxUses || "∞"}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Expires</label>
                <div className="font-medium">{d.endDate || "No expiry"}</div>
              </div>
            </div>
            {d.marketingLabel && <p className="text-sm text-gray-500 mt-2">{d.marketingLabel}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
