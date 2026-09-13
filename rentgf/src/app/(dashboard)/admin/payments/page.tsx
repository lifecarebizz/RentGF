"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Loader2, CreditCard, DollarSign, TrendingUp } from "lucide-react";

export default function AdminPaymentsPage() {
  const { user, loading } = useAuth();
  const [payments, setPayments] = useState([
    { id: "PAY1", orderId: "ORD-001", amount: 1499, finalAmount: 1499, status: "SUCCESS", paymentMethod: "UPI", createdAt: "2025-01-15" },
    { id: "PAY2", orderId: "ORD-002", amount: 1998, finalAmount: 1798, status: "SUCCESS", paymentMethod: "Card", createdAt: "2025-01-16" },
  ]);

  useEffect(() => { if (user) {/* data pre-populated */} }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const total = payments.filter((p: any) => p.status === "SUCCESS").reduce((s: number, p: any) => s + p.finalAmount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: CreditCard, label: "Total Revenue", value: `INR ${total.toLocaleString()}`, color: "bg-green-50 text-green-600" },
          { icon: DollarSign, label: "Pending", value: "INR 1,998", color: "bg-amber-50 text-amber-600" },
          { icon: TrendingUp, label: "Transactions", value: payments.length.toString(), color: "bg-blue-50 text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Order</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Method</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 font-mono text-sm">{p.orderId}</td>
                <td className="px-4 py-3">INR {p.finalAmount}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{p.status}</span></td>
                <td className="px-4 py-3">{p.paymentMethod}</td>
                <td className="px-4 py-3">{p.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
