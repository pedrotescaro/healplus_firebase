
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AppSidebar from "./app-sidebar";
import { useTranslation } from "@/contexts/app-provider";

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const names = name.split(' ');
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || "" : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export default function MobileNav() {
  const { user, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 hover:bg-primary/10 border-primary/20 hover:border-primary/30 transition-all duration-300"
                  style={{ width: `calc(2.5rem * var(--font-scale, 1))`, height: `calc(2.5rem * var(--font-scale, 1))` }}>
            <Menu className="text-primary" style={{ width: `calc(1rem * var(--font-scale, 1))`, height: `calc(1rem * var(--font-scale, 1))` }} />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/50"
                      style={{ width: `calc(18rem * var(--font-scale, 1))` }}>
           <SheetHeader className="sr-only">
              <SheetTitle>{t.actions}</SheetTitle>
              <SheetDescription>
                {t.dashboardGreeting}
              </SheetDescription>
            </SheetHeader>
           <AppSidebar onLinkClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-300 ring-2 ring-primary/10 hover:ring-primary/20"
                  style={{ width: `calc(2.5rem * var(--font-scale, 1))`, height: `calc(2.5rem * var(--font-scale, 1))` }}>
            <Avatar style={{ width: `calc(1.75rem * var(--font-scale, 1))`, height: `calc(1.75rem * var(--font-scale, 1))` }}>
              <AvatarImage src={user?.photoURL ?? undefined} alt={user?.name ?? "User Avatar"} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold"
                              style={{ fontSize: `calc(0.75rem * var(--font-scale, 1))` }}>
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg"
                             style={{ width: `calc(14rem * var(--font-scale, 1))` }}>
          <DropdownMenuLabel className="font-semibold text-foreground"
                             style={{ fontSize: `calc(0.875rem * var(--font-scale, 1))` }}>{t.profileTitle}</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border/50" />
          <Link href="/dashboard/profile" passHref>
            <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-200"
                              style={{ fontSize: `calc(0.875rem * var(--font-scale, 1))` }}>{t.profile}</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem onClick={() => logout()} className="hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors duration-200"
                            style={{ fontSize: `calc(0.875rem * var(--font-scale, 1))` }}>
            {t.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
