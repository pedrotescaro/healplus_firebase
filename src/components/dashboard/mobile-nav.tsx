
"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import AppSidebar from "./app-sidebar";
import { useTranslation } from "@/contexts/app-provider";

export default function MobileNav() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/50 mobile-nav-responsive">
         <SheetHeader className="sr-only">
            <SheetTitle>{t.actions}</SheetTitle>
            <SheetDescription>
              {t.dashboardGreeting}
            </SheetDescription>
          </SheetHeader>
         <AppSidebar onLinkClick={() => setIsSheetOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
