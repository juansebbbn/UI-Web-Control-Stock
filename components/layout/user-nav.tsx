"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutAction } from "@/lib/actions/auth";

export function UserNav({
  email,
  miCuentaHref,
}: {
  email: string;
  /** Si no se pasa (p.ej. header a nivel negocio, sin sucursal en contexto), el email no es clickeable. */
  miCuentaHref?: string;
}) {
  const initial = email.charAt(0).toUpperCase();

  const identidad = (
    <>
      <Avatar className="size-7 shrink-0">
        <AvatarFallback className="bg-primary text-xs text-primary-foreground">
          {initial}
        </AvatarFallback>
      </Avatar>
      <span className="flex-1 truncate text-sm font-medium text-neutral-900 group-data-[collapsible=icon]:hidden">
        {email}
      </span>
    </>
  );

  return (
    <div className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">
      {miCuentaHref ? (
        <Link
          href={miCuentaHref}
          title={email}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-ring/50 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-0"
        >
          {identidad}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-0">
          {identidad}
        </div>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-neutral-600 hover:text-danger"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        onClick={() => {
          void logoutAction();
        }}
      >
        <LogOut aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}
