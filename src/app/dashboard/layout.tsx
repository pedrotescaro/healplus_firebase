"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import AppSidebar from "@/components/dashboard/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex items-start space-x-4 p-4">
            <Skeleton className="h-screen w-64" />
            <div className="space-y-2 w-[calc(100vw-20rem)]">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-[calc(100vh-5rem)] w-full" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-background/95 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
