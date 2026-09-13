"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Loader2, User, ChevronRight } from "lucide-react";

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setUsers([
        { id: "1", email: "customer1@example.com", displayName: "User One", role: "CUSTOMER", status: "ACTIVE" },
        { id: "2", email: "customer2@example.com", displayName: "User Two", role: "CUSTOMER", status: "ACTIVE" },
        { id: "3", email: "companion1@example.com", displayName: "Comp One", role: "COMPANION", status: "ACTIVE" },
        { id: "4", email: "companion2@example.com", displayName: "Comp Two", role: "COMPANION", status: "PENDING" },
      ]);
    }
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">User</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Role</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  {u.displayName}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{u.role}</span></td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === "ACTIVE" ? "bg-green-100 text-green-700" : u.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{u.status}</span>
                </td>
                <td className="px-4 py-3"><button className="text-indigo-600 hover:underline text-sm">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
