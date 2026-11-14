"use client";

import { useState } from "react";
import { HardHat, Menu } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { SessionUser } from "@/lib/types";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  user: SessionUser;
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <HardHat className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight">Locadora</p>
        <p className="text-xs text-muted-foreground">Gestão de equipamentos</p>
      </div>
    </div>
  );
}

function UserBlock({ user }: { user: SessionUser }) {
  return (
    <div className="space-y-3 border-t pt-4">
      <div className="px-2">
        <p className="truncate text-sm font-medium">{user.nome}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        <Badge variant="secondary" className="mt-2">
          {user.perfil === "ADMIN" ? "Administrador" : "Atendente"}
        </Badge>
      </div>
      <LogoutButton />
    </div>
  );
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r bg-card md:flex md:flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <Brand />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6 p-4">
          <SidebarNav perfil={user.perfil} />
          <UserBlock user={user} />
        </div>
      </aside>

      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Abrir menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-4">
            <Brand />
            <div className="mt-6 flex flex-1 flex-col justify-between gap-6">
              <SidebarNav
                perfil={user.perfil}
                onNavigate={() => setOpen(false)}
              />
              <UserBlock user={user} />
            </div>
          </SheetContent>
        </Sheet>
        <div>
          <p className="text-sm font-semibold">Locadora</p>
          <p className="text-xs text-muted-foreground">Menu</p>
        </div>
      </div>
    </>
  );
}
