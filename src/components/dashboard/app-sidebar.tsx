"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useMemo, useCallback } from "react";
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

const AppSidebar = memo(function AppSidebar({ className, onLinkClick }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  // Memoizar itens de navegação para evitar recriação desnecessária
  const professionalNavItems: NavItem[] = useMemo(() => [
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
  ], [t]);

  const patientNavItems: NavItem[] = useMemo(() => [
    { href: "/dashboard", icon: LayoutDashboard, label: t.dashboard },
    { href: "/dashboard/reports", icon: Archive, label: t.myReports },
    { href: "/dashboard/profile", icon: User, label: t.profile },
  ], [t]);

  const navItems = useMemo(() => 
    user?.role === 'professional' ? professionalNavItems : patientNavItems,
    [user?.role, professionalNavItems, patientNavItems]
  );

  const handleLogout = useCallback(async () => {
    if (onLinkClick) onLinkClick();
    await logout();
    router.push("/login");
  }, [onLinkClick, logout, router]);
  
  const handleLinkClick = useCallback((href: string) => {
    if (onLinkClick) onLinkClick();
    router.push(href);
  }, [onLinkClick, router]);

  return (
    <aside className={cn(
      "flex h-full max-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20",
      "w-full transition-all duration-300",
      "border-r border-border/50 shadow-lg shadow-primary/5",
      // Fixed width based on font scale
      "sidebar-responsive",
      className
    )}>
      {/* Header com Logo e Gradiente */}
      <div className="relative flex items-center border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm"
           style={{ height: `calc(4rem * var(--font-scale, 1))`, paddingLeft: `calc(1rem * var(--font-scale, 1))`, paddingRight: `calc(1rem * var(--font-scale, 1))` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <Link href="/dashboard" className="relative flex items-center group w-full"
               style={{ gap: `calc(0.5rem * var(--font-scale, 1))` }}>
          <div className="relative">
            <Logo />
          </div>
        </Link>
      </div>

      {/* Navegação Principal */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
           style={{ paddingLeft: `calc(0.5rem * var(--font-scale, 1))`, paddingRight: `calc(0.5rem * var(--font-scale, 1))`, paddingTop: `calc(1rem * var(--font-scale, 1))`, paddingBottom: `calc(1rem * var(--font-scale, 1))` }}>
        <nav style={{ gap: `calc(0.25rem * var(--font-scale, 1))` }} className="flex flex-col">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard");
            
            return (
              <TooltipProvider key={item.href}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md rounded-lg",
                        "font-medium",
                        isActive 
                          ? "bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border border-primary/20 shadow-lg shadow-primary/10" 
                          : "hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 hover:shadow-sm"
                      )}
                      style={{ 
                        height: `calc(2.5rem * var(--font-scale, 1))`, 
                        paddingLeft: `calc(0.75rem * var(--font-scale, 1))`, 
                        paddingRight: `calc(0.75rem * var(--font-scale, 1))` 
                      }}
                      onClick={() => handleLinkClick(item.href)}
                    >
                      {/* Efeito de brilho no hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] group-hover:transition-transform group-hover:duration-1000" />
                      
                      {/* Ícone com animação */}
                      <item.icon className={cn(
                        "transition-all duration-300 flex-shrink-0",
                        isActive 
                          ? "text-primary scale-110" 
                          : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                      )} 
                      style={{ 
                        marginRight: `calc(0.5rem * var(--font-scale, 1))`,
                        width: `calc(1rem * var(--font-scale, 1))`,
                        height: `calc(1rem * var(--font-scale, 1))`
                      }} />
                      
                      {/* Label */}
                      <span className={cn(
                        "font-medium transition-colors duration-300 flex-1 text-left truncate",
                        isActive 
                          ? "text-primary font-semibold" 
                          : "text-foreground/80 group-hover:text-foreground"
                      )}>
                        {item.label}
                      </span>
                      
                      {/* Badge */}
                      {item.badge && (
                        <div className={cn(
                          "rounded-full transition-all duration-300 border-0 text-white font-semibold flex-shrink-0",
                          item.badge === "AI" && "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25",
                          item.badge === "Pro" && "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/25",
                          item.badge === "Novo" && "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25"
                        )}
                        style={{
                          marginLeft: `calc(0.25rem * var(--font-scale, 1))`,
                          paddingLeft: `calc(0.375rem * var(--font-scale, 1))`,
                          paddingRight: `calc(0.375rem * var(--font-scale, 1))`,
                          paddingTop: `calc(0.125rem * var(--font-scale, 1))`,
                          paddingBottom: `calc(0.125rem * var(--font-scale, 1))`,
                          fontSize: `calc(0.75rem * var(--font-scale, 1))`,
                          lineHeight: 1
                        }}>
                          {item.badge}
                        </div>
                      )}
                      
                      {/* Indicador de página ativa */}
                      {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-primary to-primary/60 rounded-l-full"
                             style={{ width: `calc(0.25rem * var(--font-scale, 1))`, height: `calc(2rem * var(--font-scale, 1))` }} />
                      )}
                      
                      {/* Seta para itens ativos */}
                      {isActive && (
                        <ChevronRight className="text-primary animate-pulse"
                                     style={{ marginLeft: `calc(0.5rem * var(--font-scale, 1))`, width: `calc(1rem * var(--font-scale, 1))`, height: `calc(1rem * var(--font-scale, 1))` }} />
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
        <div style={{ padding: `calc(0.75rem * var(--font-scale, 1))`, gap: `calc(0.75rem * var(--font-scale, 1))` }} className="flex flex-col">
          {/* Perfil do Usuário */}
          <div className="flex items-center rounded-lg bg-gradient-to-r from-card/50 to-card/30 border border-border/30 hover:from-card/70 hover:to-card/50 transition-all duration-300 group cursor-pointer"
               style={{ gap: `calc(0.5rem * var(--font-scale, 1))`, padding: `calc(0.5rem * var(--font-scale, 1))` }}>
            <div className="relative">
              <Avatar className="ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                      style={{ width: `calc(2.5rem * var(--font-scale, 1))`, height: `calc(2.5rem * var(--font-scale, 1))` }}>
                <AvatarImage src={user?.photoURL ?? undefined} alt={user?.name ?? "User Avatar"} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold"
                                style={{ fontSize: `calc(0.75rem * var(--font-scale, 1))` }}>
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute rounded-full border-2 border-background flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500"
                   style={{ 
                     bottom: `calc(-0.125rem * var(--font-scale, 1))`, 
                     right: `calc(-0.125rem * var(--font-scale, 1))`,
                     width: `calc(0.75rem * var(--font-scale, 1))`,
                     height: `calc(0.75rem * var(--font-scale, 1))`
                   }}>
                <div className="bg-white rounded-full animate-pulse"
                     style={{ 
                       width: `calc(0.375rem * var(--font-scale, 1))`,
                       height: `calc(0.375rem * var(--font-scale, 1))`
                     }} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300"
                 style={{ fontSize: `calc(0.75rem * var(--font-scale, 1))` }}>
                {user?.name}
              </p>
              <p className="text-muted-foreground truncate"
                 style={{ fontSize: `calc(0.75rem * var(--font-scale, 1))` }}>
                {user?.role === 'professional' ? 'Profissional' : 'Paciente'}
              </p>
            </div>
            <Sparkles className="text-primary/60 group-hover:text-primary transition-colors duration-300 flex-shrink-0"
                      style={{ width: `calc(1rem * var(--font-scale, 1))`, height: `calc(1rem * var(--font-scale, 1))` }} />
          </div>

          {/* Botão de Logout */}
          <Button 
            variant="outline" 
            className="w-full bg-gradient-to-r from-destructive/5 to-destructive/10 border-destructive/20 hover:from-destructive/10 hover:to-destructive/20 hover:border-destructive/30 transition-all duration-300 group rounded-lg" 
            style={{ height: `calc(2.25rem * var(--font-scale, 1))` }}
            onClick={handleLogout}
          >
            <X className="text-destructive/70 group-hover:text-destructive transition-colors duration-300 flex-shrink-0"
               style={{ 
                 marginRight: `calc(0.375rem * var(--font-scale, 1))`,
                 width: `calc(1rem * var(--font-scale, 1))`,
                 height: `calc(1rem * var(--font-scale, 1))`
               }} />
            <span className="font-medium text-destructive/80 group-hover:text-destructive transition-colors duration-300"
                  style={{ fontSize: `calc(0.75rem * var(--font-scale, 1))` }}>
              {t.logout}
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
});

export default AppSidebar;