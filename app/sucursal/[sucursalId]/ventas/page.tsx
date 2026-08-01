import { apiFetch } from "@/lib/api";
import type { PaginaOutput } from "@/lib/types/api";
import type { DTOVentaOutput } from "@/lib/types/dominio";
import { PAGE_SIZE_DEFAULT, VENTAS_DEFAULT_SORT } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { SortableHeader } from "@/components/shared/sortable-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { VentasTable } from "./ventas-table";

type Props = {
  params: Promise<{ sucursalId: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
};

export default async function VentasPage({ params, searchParams }: Props) {
  const { sucursalId } = await params;
  const sp = await searchParams;
  const page = Number(sp.page ?? 0);
  const sort = sp.sort ?? VENTAS_DEFAULT_SORT;

  const data = await apiFetch<PaginaOutput<DTOVentaOutput>>(
    `/api/inventario/ventas/${sucursalId}?page=${page}&size=${PAGE_SIZE_DEFAULT}&sort=${sort}`
  );

  const buildHref = (nextPage: number, nextSort = sort) => `/sucursal/${sucursalId}/ventas?page=${nextPage}&sort=${nextSort}`;
  const buildSortHref = (nextSort: string) => buildHref(0, nextSort);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Ventas</h1>
          <p className="text-sm text-neutral-600">{data.totalElementos} ventas registradas en esta sucursal.</p>
        </div>
        <div className="flex gap-3 text-sm">
          <SortableHeader column="fechaCreacion" label="Ordenar por fecha" currentSort={sort} buildHref={buildSortHref} />
          <SortableHeader column="montoTotal" label="Ordenar por total" currentSort={sort} buildHref={buildSortHref} />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          {data.contenido.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-600">Todavía no hay ventas registradas en esta sucursal.</p>
          ) : (
            <VentasTable sucursalId={sucursalId} ventas={data.contenido} />
          )}
        </CardContent>
      </Card>

      <PaginationBar
        page={data.pagina}
        totalPaginas={data.totalPaginas}
        tieneSiguiente={data.tieneSiguiente}
        buildHref={(p) => buildHref(p)}
      />
    </div>
  );
}
