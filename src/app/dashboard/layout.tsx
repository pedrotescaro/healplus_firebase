
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
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr] lg:grid-cols-[288px_1fr] xl:grid-cols-[320px_1fr]">
      <div className="hidden border-r bg-card md:block shadow-lg shadow-primary/5">
        <AppSidebar />
      </div>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 md:hidden shadow-sm">
          <MobileNav />
        </header>
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background/95 via-background to-muted/5 p-3 sm:p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        {user.role === 'professional' && <CatSupport currentPage={pathname} />}
      </div>
    </div>
  );
}
