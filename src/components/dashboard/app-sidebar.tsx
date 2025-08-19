
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  GitCompareArrows,
  User,
  LogOut,
  ClipboardList,
  Archive,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "../logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const names = name.split(' ');
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || "" : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
}


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/anamnesis", icon: ClipboardList, label: "Nova Anamnese" },
  { href: "/dashboard/anamnesis-records", icon: Archive, label: "Minhas Fichas" },
  { href: "/dashboard/report", icon: FileText, label: "Gerar Relatório" },
  { href: "/dashboard/compare", icon: GitCompareArrows, label: "Comparar Imagens" },
  { href: "/dashboard/profile", icon: User, label: "Perfil" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-card p-4 sm:flex">
      <div className="mb-8">
        <Logo />
      </div>
      <nav className="flex-1 space-y-2">
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <Button
                    variant={pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <div className="mt-auto">
        <div className="mb-4 border-t pt-4 flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user?.photoURL ?? undefined} alt={user?.name ?? "User Avatar"} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
