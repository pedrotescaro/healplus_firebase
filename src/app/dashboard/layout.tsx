
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import AppSidebar from "@/components/dashboard/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import MobileNav from "@/components/dashboard/mobile-nav";
import { CatSupport } from "@/components/dashboard/cat-support";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex items-start space-x-4 p-4 w-full">
            <Skeleton className="hidden h-screen w-64 sm:block" />
            <div className="space-y-2 w-full">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-[calc(100vh-5rem)] w-full" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <AppSidebar />
      </div>
      <div className="flex flex-col min-h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 md:hidden">
          <MobileNav />
        </header>
        <main className="flex-1 overflow-auto bg-background/95 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        {user.role === 'professional' && <CatSupport currentPage={pathname} />}
      </div>
    </div>
  );
}
