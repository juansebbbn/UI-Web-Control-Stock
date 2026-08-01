"use client";

import Link from "next/link";
import { Building2, Check, ChevronsUpDown, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Sucursal } from "@/lib/types/dominio";

export function SucursalSwitcher({ sucursales, actual }: { sucursales: Sucursal[]; actual: Sucursal }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={actual.nombre}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring/50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 aria-hidden="true" className="size-4" />
        </div>
        <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
          <p className="truncate text-sm font-medium text-sidebar-foreground">{actual.nombre}</p>
          <p className="truncate text-xs text-sidebar-foreground/60">Sucursal actual</p>
        </div>
        <ChevronsUpDown
          aria-hidden="true"
          className="size-4 shrink-0 text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Cambiar de sucursal</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sucursales.map((s) => (
            <DropdownMenuItem
              key={s.id}
              render={<Link href={`/sucursal/${s.id}/resumen`} aria-current={s.id === actual.id ? "true" : undefined} />}
            >
              <Building2 aria-hidden="true" className="size-4" />
              <span className="flex-1 truncate">{s.nombre}</span>
              {s.id === actual.id && <Check aria-hidden="true" className="size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/negocio" />}>
          <Settings2 aria-hidden="true" className="size-4" /> Gestionar sucursales
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
