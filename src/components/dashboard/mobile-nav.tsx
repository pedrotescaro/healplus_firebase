
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

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-64">
           <SheetHeader className="sr-only">
              <SheetTitle>Menu de Navegação</SheetTitle>
              <SheetDescription>
                Navegue pelas seções do dashboard, incluindo anamnese, relatórios e seu perfil.
              </SheetDescription>
            </SheetHeader>
           <AppSidebar onLinkClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL ?? undefined} alt={user?.name ?? "User Avatar"} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/dashboard/profile" passHref>
            <DropdownMenuItem>Perfil</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
