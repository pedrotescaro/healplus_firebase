"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  User,
  X,
  ClipboardList,
  Archive,
  Calendar,
  CopyCheck,
  Users,
  Camera,
  BarChart3,
  ChevronRight,
  Sparkles
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
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/app-provider";

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const names = name.split(' ');
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || "" : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

interface NavItem {
  href: string;
  icon: any;
  label: string;
  badge?: string;
  isActive?: boolean;
}

interface AppSidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export default function AppSidebar({ className, onLinkClick }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const professionalNavItems: NavItem[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.dashboard, isActive: true },
    { href: "/dashboard/anamnesis", icon: ClipboardList, label: t.newAnamnesis, badge: "Novo" },
    { href: "/dashboard/anamnesis-records", icon: Users, label: t.myPatients },
    { href: "/dashboard/agenda", icon: Calendar, label: t.agenda },
    { href: "/dashboard/wound-capture", icon: Camera, label: "Captura de Feridas", badge: "AI" },
    { href: "/dashboard/report", icon: FileText, label: t.generateReport },
    { href: "/dashboard/reports", icon: Archive, label: t.myReports },
    { href: "/dashboard/compare-reports", icon: CopyCheck, label: t.compareReports, badge: "Pro" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/profile", icon: User, label: t.profile },
  ];

  const patientNavItems: NavItem[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.dashboard },
    { href: "/dashboard/reports", icon: Archive, label: t.myReports },
    { href: "/dashboard/profile", icon: User, label: t.profile },
  ];

  const navItems = user?.role === 'professional' ? professionalNavItems : patientNavItems;

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
    <aside className={cn("flex h-full max-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20", className)}>
      {/* Header com Logo e Gradiente */}
      <div className="relative flex h-16 items-center border-b border-border/50 px-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
        <Link href="/dashboard" className="relative flex items-center gap-3 font-bold text-lg group">
          <div className="relative">
            <Logo />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
          </div>
        </Link>
      </div>

      {/* Navegação Principal */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard");
            
            return (
              <TooltipProvider key={item.href}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-12 px-4 group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md",
                        isActive 
                          ? "bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border border-primary/20 shadow-lg" 
                          : "hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30"
                      )}
                      onClick={() => handleLinkClick(item.href)}
                    >
                      {/* Efeito de brilho no hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] group-hover:transition-transform group-hover:duration-1000" />
                      
                      {/* Ícone com animação */}
                      <item.icon className={cn(
                        "mr-3 h-5 w-5 transition-all duration-300",
                        isActive 
                          ? "text-primary scale-110" 
                          : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                      )} />
                      
                      {/* Label */}
                      <span className={cn(
                        "font-medium transition-colors duration-300 flex-1 text-left",
                        isActive 
                          ? "text-primary font-semibold" 
                          : "text-foreground/80 group-hover:text-foreground"
                      )}>
                        {item.label}
                      </span>
                      
                      {/* Badge */}
                      {item.badge && (
                        <div className={cn(
                          "ml-2 text-xs px-2 py-0.5 rounded-full transition-all duration-300 border-0 text-white font-semibold",
                          item.badge === "AI" && "bg-gradient-to-r from-blue-500 to-purple-500",
                          item.badge === "Pro" && "bg-gradient-to-r from-orange-500 to-red-500",
                          item.badge === "Novo" && "bg-gradient-to-r from-green-500 to-emerald-500"
                        )}>
                          {item.badge}
                        </div>
                      )}
                      
                      {/* Indicador de página ativa */}
                      {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-l-full" />
                      )}
                      
                      {/* Seta para itens ativos */}
                      {isActive && (
                        <ChevronRight className="ml-2 h-4 w-4 text-primary animate-pulse" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-popover/95 backdrop-blur-sm border border-border/50">
                    <p className="font-medium">{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </div>

      {/* Footer com Perfil do Usuário */}
      <div className="mt-auto border-t border-border/50 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          {/* Perfil do Usuário */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-card/50 to-card/30 border border-border/30 hover:from-card/70 hover:to-card/50 transition-all duration-300 group cursor-pointer">
            <div className="relative">
              <Avatar className="h-11 w-11 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                <AvatarImage src={user?.photoURL ?? undefined} alt={user?.name ?? "User Avatar"} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role === 'professional' ? 'Profissional' : 'Paciente'}
              </p>
            </div>
            <Sparkles className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors duration-300" />
          </div>

          {/* Botão de Logout */}
          <Button 
            variant="outline" 
            className="w-full h-11 bg-gradient-to-r from-destructive/5 to-destructive/10 border-destructive/20 hover:from-destructive/10 hover:to-destructive/20 hover:border-destructive/30 transition-all duration-300 group" 
            onClick={handleLogout}
          >
            <X className="mr-2 h-4 w-4 text-destructive/70 group-hover:text-destructive transition-colors duration-300" />
            <span className="font-medium text-destructive/80 group-hover:text-destructive transition-colors duration-300">
              {t.logout}
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
}