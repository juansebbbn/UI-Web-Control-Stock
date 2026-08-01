import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ResumenPanel } from "@/components/resumen/resumen-panel";
import { resolverRango, fetchResumenGlobal, fetchRankingsGlobal } from "@/lib/resumen";

type Props = {
  searchParams: Promise<{
    inicio?: string;
    fin?: string;
    mvPage?: string;
    mrPage?: string;
    vpPage?: string;
    stockPage?: string;
    agotarsePage?: string;
  }>;
};

export default async function ResumenGlobalPage({ searchParams }: Props) {
  const sp = await searchParams;
  const rango = resolverRango(sp);

  const [resumen, rankings] = await Promise.all([
    fetchResumenGlobal(),
    fetchRankingsGlobal(rango, {
      masVendidos: Number(sp.mvPage ?? 0),
      masRentables: Number(sp.mrPage ?? 0),
      ventasPromedioDiarias: Number(sp.vpPage ?? 0),
    }),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Link
          href="/negocio"
          className="mb-2 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft aria-hidden="true" className="size-3.5" /> Volver
        </Link>
        <h1 className="text-2xl font-semibold text-neutral-900">Resumen de todo el negocio</h1>
        <p className="text-sm text-neutral-600">Analítica combinada entre todas tus sucursales.</p>
      </div>

      <ResumenPanel
        totalProductosVendidos={resumen.totalProductosVendidos}
        gananciaDiaria={resumen.gananciaDiaria}
        productosBajoStockMinimo={resumen.productosBajoStockMinimo}
        productosPorAgotarse={resumen.productosPorAgotarse}
        rankings={rankings}
        inicioFecha={rango.inicioFecha}
        finFecha={rango.finFecha}
        pathname="/negocio/resumen-global"
        searchParams={sp}
      />
    </div>
  );
}
