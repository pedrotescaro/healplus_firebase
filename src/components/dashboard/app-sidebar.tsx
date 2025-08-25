
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
  CalendarDays,
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
import { cn } from "@/lib/utils";

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
  { href: "/dashboard/agenda", icon: CalendarDays, label: "Agenda" },
  { href: "/dashboard/report", icon: FileText, label: "Gerar Relatório" },
  { href: "/dashboard/compare", icon: GitCompareArrows, label: "Comparar Imagens" },
  { href: "/dashboard/profile", icon: User, label: "Perfil" },
];

interface AppSidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export default function AppSidebar({ className, onLinkClick }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (onLinkClick) onLinkClick();
    await logout();
    router.push("/login");
  };
  
  const handleLinkClick = (href: string) => {
    if (onLinkClick) onLinkClick();
    router.push(href);
  }

  return (
    <aside className={cn("flex h-full max-h-screen flex-col gap-2", className)}>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo />
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
          {navItems.map((item) => (
             <Button
                key={item.href}
                variant={pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard") ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleLinkClick(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="mb-4 flex items-center gap-3">
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
