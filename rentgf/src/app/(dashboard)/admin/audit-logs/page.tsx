"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Loader2, Star, User } from "lucide-react";

export default function AdminAuditLogsPage() {
  const { user, loading } = useAuth();
  const [logs, setLogs] = useState([
    { id: "AL1", admin: { displayName: "Admin" }, action: "APPROVE_VERIFICATION", targetType: "COMPANION", targetId: "C1", createdAt: "2025-01-15T10:00:00Z" },
    { id: "AL2", admin: { displayName: "Admin" }, action: "UPDATE_USER_STATUS", targetType: "USER", targetId: "U1", createdAt: "2025-01-15T09:30:00Z" },
    { id: "AL3", admin: { displayName: "Admin" }, action: "PROCESS_PAYOUT", targetType: "PAYOUT", targetId: "P1", createdAt: "2025-01-14T14:00:00Z" },
  ]);

  useEffect(() => { if (user) {} }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Action</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Admin</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Target</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l: any) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-3"><span className="font-mono text-sm">{l.action}</span></td>
                <td className="px-4 py-3 flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> {l.admin?.displayName}</td>
                <td className="px-4 py-3 text-sm">{l.targetType} / {l.targetId}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
