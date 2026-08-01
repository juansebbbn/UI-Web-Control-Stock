import { ResumenPanel } from "@/components/resumen/resumen-panel";
import { resolverRango, fetchResumenDiarioSucursal, fetchRankingsSucursal } from "@/lib/resumen";

type Props = {
  params: Promise<{ sucursalId: string }>;
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

export default async function ResumenSucursalPage({ params, searchParams }: Props) {
  const { sucursalId } = await params;
  const sp = await searchParams;
  const rango = resolverRango(sp);

  const [resumen, rankings] = await Promise.all([
    fetchResumenDiarioSucursal(sucursalId),
    fetchRankingsSucursal(sucursalId, rango, {
      masVendidos: Number(sp.mvPage ?? 0),
      masRentables: Number(sp.mrPage ?? 0),
      ventasPromedioDiarias: Number(sp.vpPage ?? 0),
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Resumen</h1>
        <p className="text-sm text-neutral-600">Actividad de hoy en esta sucursal.</p>
      </div>

      <ResumenPanel
        totalProductosVendidos={resumen.totalProductosVendidos}
        gananciaDiaria={resumen.gananciaDiaria}
        productosBajoStockMinimo={resumen.productosBajoStockMinimo}
        productosPorAgotarse={resumen.productosPorAgotarse}
        rankings={rankings}
        inicioFecha={rango.inicioFecha}
        finFecha={rango.finFecha}
        pathname={`/sucursal/${sucursalId}/resumen`}
        searchParams={sp}
      />
    </div>
  );
}
