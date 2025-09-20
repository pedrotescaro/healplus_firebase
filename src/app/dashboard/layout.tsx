
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
    <div className="flex min-h-screen w-full">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block border-r bg-card shadow-lg shadow-primary/5 sidebar-responsive">
        <AppSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex-1">
        {/* Mobile Header */}
        <header className="flex items-center border-b bg-card/50 backdrop-blur-sm md:hidden shadow-sm"
                style={{ 
                  height: `calc(3.5rem * var(--font-scale, 1))`, 
                  gap: `calc(1rem * var(--font-scale, 1))`,
                  paddingLeft: `calc(1rem * var(--font-scale, 1))`,
                  paddingRight: `calc(1rem * var(--font-scale, 1))`
                }}>
          <MobileNav />
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background/95 via-background to-muted/5"
              style={{ padding: `calc(1rem * var(--font-scale, 1))` }}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Cat Support */}
        {user.role === 'professional' && <CatSupport currentPage={pathname} />}
      </div>
    </div>
  );
}
