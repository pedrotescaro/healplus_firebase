
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
          <Button variant="outline" size="icon" className="shrink-0 hover:bg-primary/10 border-primary/20 hover:border-primary/30 transition-all duration-300">
            <Menu className="h-4 w-4 text-primary" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-72 sm:w-80 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/50">
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
          <Button variant="secondary" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-300 ring-2 ring-primary/10 hover:ring-primary/20">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
              <AvatarImage src={user?.photoURL ?? undefined} alt={user?.name ?? "User Avatar"} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-xs">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
          <DropdownMenuLabel className="font-semibold text-foreground">{t.profileTitle}</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border/50" />
          <Link href="/dashboard/profile" passHref>
            <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-200">{t.profile}</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem onClick={() => logout()} className="hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors duration-200">
            {t.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
