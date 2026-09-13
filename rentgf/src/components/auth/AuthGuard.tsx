"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user) {
        const role = (session.user as any).role;
        if (role === "ADMIN") router.push("/admin/dashboard");
        else if (role === "COMPANION") router.push("/companion/dashboard");
        else router.push("/customer/dashboard");
      }
    }
    if (status === "unauthenticated") {
      // Not redirected - let them see the page
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
