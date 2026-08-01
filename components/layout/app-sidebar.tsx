"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Package,
  ArrowLeftRight,
  Receipt,
  LifeBuoy,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SucursalSwitcher } from "@/components/layout/sucursal-switcher";
import { UserNav } from "@/components/layout/user-nav";
import type { Sucursal } from "@/lib/types/dominio";

const NAV_ITEMS = [
  { href: "resumen", label: "Resumen", icon: LayoutDashboard },
  { href: "ventas", label: "Ventas", icon: ShoppingCart },
  { href: "compras", label: "Compras", icon: Truck },
  { href: "productos", label: "Productos", icon: Package },
  { href: "transferencias", label: "Transferencias", icon: ArrowLeftRight },
  { href: "facturacion", label: "Facturación", icon: Receipt },
  { href: "soporte", label: "Soporte", icon: LifeBuoy },
] as const;

export function AppSidebar({
  sucursales,
  actual,
  email,
}: {
  sucursales: Sucursal[];
  actual: Sucursal;
  email: string;
}) {
  const pathname = usePathname();
  const base = `/sucursal/${actual.id}`;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SucursalSwitcher sucursales={sucursales} actual={actual} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const href = `${base}/${item.href}`;
                const isActive = pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton isActive={isActive} tooltip={item.label} render={<Link href={href} />}>
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserNav email={email} miCuentaHref={`${base}/mi-cuenta`} />
      </SidebarFooter>
    </Sidebar>
  );
}
