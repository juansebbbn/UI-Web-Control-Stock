import Link from "next/link";
import { ChevronLeft, Building2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Sucursal } from "@/lib/types/dominio";
import { Card, CardContent } from "@/components/ui/card";
import { CrearSucursalDialog } from "./crear-sucursal-dialog";
import { EliminarSucursalButton } from "./eliminar-sucursal-button";

export default async function SucursalesPage() {
  const sucursales = await apiFetch<Sucursal[]>("/api/sucursales/listar");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <Link
          href="/negocio"
          className="mb-2 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft aria-hidden="true" className="size-3.5" /> Volver
        </Link>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Sucursales</h1>
            <p className="text-sm text-neutral-600">Alta y baja de sucursales de tu negocio.</p>
          </div>
          <CrearSucursalDialog />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="flex flex-col divide-y divide-neutral-200 p-0">
          {sucursales.length === 0 ? (
            <p className="p-6 text-center text-sm text-neutral-600">
              Todavía no tenés sucursales creadas.
            </p>
          ) : (
            sucursales.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-info-bg text-info">
                    <Building2 aria-hidden="true" className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{s.nombre}</p>
                    {s.direccion && <p className="text-xs text-neutral-600">{s.direccion}</p>}
                  </div>
                </div>
                <EliminarSucursalButton sucursalId={s.id} nombre={s.nombre} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
