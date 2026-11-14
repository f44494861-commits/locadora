import {
  CalendarDays,
  LayoutDashboard,
  Package,
  Receipt,
  ShoppingCart,
  Users,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { Perfil } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/locacoes", label: "Locações", icon: ShoppingCart },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/estoque", label: "Estoque", icon: Package },
  { href: "/financeiro", label: "Financeiro", icon: Receipt },
  { href: "/usuarios", label: "Usuários", icon: UserCog, adminOnly: true },
];

export function getNavItemsForPerfil(perfil: Perfil) {
  return NAV_ITEMS.filter((item) => !item.adminOnly || perfil === "ADMIN");
}
