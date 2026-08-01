import Link from "next/link";
import { Building2, Settings, BarChart3, ChevronRight, Store } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Sucursal } from "@/lib/types/dominio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NegocioPage() {
  const sucursales = await apiFetch<Sucursal[]>("/api/sucursales/listar");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Seleccioná una sucursal</h1>
        <p className="text-sm text-neutral-600">
          Elegí qué sucursal administrar, o mirá el negocio en conjunto.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Store aria-hidden="true" className="size-4 text-primary" /> Mis sucursales
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {sucursales.length === 0 ? (
            <p className="py-4 text-center text-sm text-neutral-600">
              Todavía no tenés sucursales.{" "}
              <Link href="/negocio/sucursales" className="font-medium text-primary hover:underline">
                Creá la primera
              </Link>
              .
            </p>
          ) : (
            sucursales.map((s) => (
              <Link
                key={s.id}
                href={`/sucursal/${s.id}/resumen`}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-info-bg text-info">
                    <Building2 aria-hidden="true" className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{s.nombre}</p>
                    {s.direccion && <p className="text-xs text-neutral-600">{s.direccion}</p>}
                  </div>
                </div>
                <ChevronRight aria-hidden="true" className="size-4 text-neutral-400" />
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/negocio/sucursales">
          <Card className="h-full justify-center shadow-sm transition-colors hover:bg-neutral-100">
            <CardContent className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                <Settings aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Gestionar sucursales</p>
                <p className="text-xs text-neutral-600">Alta y baja de sucursales</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/negocio/resumen-global">
          <Card className="h-full justify-center shadow-sm transition-colors hover:bg-neutral-100">
            <CardContent className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <BarChart3 aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Resumen de todo el negocio</p>
                <p className="text-xs text-neutral-600">Analítica combinada de todas las sucursales</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
