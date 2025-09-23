
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import AppSidebar from "@/components/dashboard/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import MobileNav from "@/components/dashboard/mobile-nav";
import { CatSupport } from "@/components/dashboard/cat-support";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useTranslation } from "@/contexts/app-provider";

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const names = name.split(' ');
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || "" : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

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
        {/* Header for both Mobile and Desktop */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <MobileNav />
          <div className="flex w-full items-center justify-end gap-4">
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                   <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL ?? undefined} alt={user?.name ?? "User Avatar"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard/profile" passHref>
                  <DropdownMenuItem>{t.profile}</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout().then(() => router.push('/login'))}>
                  {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
