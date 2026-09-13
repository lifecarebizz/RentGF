"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("loading");
  const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") || "" : "";

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        setStatus(res.ok ? "success" : "error");
      } catch {
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };
    if (token) verify();
    else setStatus("error");
  }, [token]);

  return (
    <div className="max-w-md mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
        {loading && (
          <><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Verifying your email...</p></>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
            <p className="text-gray-500 mb-6">Your email has been verified successfully.</p>
            <Link href="/login" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700">
              Sign In
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-gray-500 mb-6">The verification link is invalid or expired.</p>
            <Link href="/forgot-password" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700">
              Request New Link
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
