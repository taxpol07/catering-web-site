"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingPage } from "@/components/ui/LoadingSpinner";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdminUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdminUser)) {
      router.replace("/admin/login");
    }
  }, [user, loading, isAdminUser, router]);

  if (loading) return <LoadingPage />;
  if (!user || !isAdminUser) return <LoadingPage />;

  return <>{children}</>;
}
