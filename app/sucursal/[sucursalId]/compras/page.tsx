import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { fetchProductosSucursal } from "@/lib/productos";
import type { PaginaOutput } from "@/lib/types/api";
import type { DTOReposicionOutput } from "@/lib/types/dominio";
import { PAGE_SIZE_DEFAULT, COMPRAS_DEFAULT_SORT } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableHeader } from "@/components/shared/sortable-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { formatMoney, formatDateTime } from "@/lib/utils";
import { RegistrarCompraForm } from "./registrar-compra-form";

type Props = {
  params: Promise<{ sucursalId: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
};

export default async function ComprasPage({ params, searchParams }: Props) {
  const { sucursalId } = await params;
  const sp = await searchParams;
  const page = Number(sp.page ?? 0);
  const sort = sp.sort ?? COMPRAS_DEFAULT_SORT;

  const [historial, productos] = await Promise.all([
    apiFetch<PaginaOutput<DTOReposicionOutput>>(
      `/api/inventario/compras/${sucursalId}?page=${page}&size=${PAGE_SIZE_DEFAULT}&sort=${sort}`
    ),
    fetchProductosSucursal(sucursalId, { size: 200, sort: "stock,asc" }),
  ]);

  const buildHref = (nextPage: number, nextSort = sort) => `/sucursal/${sucursalId}/compras?page=${nextPage}&sort=${nextSort}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Compras</h1>
        <p className="text-sm text-neutral-600">Registrá reposiciones de stock y consultá el historial.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Registrar compra</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrarCompraForm
            sucursalId={sucursalId}
            productos={productos.contenido.map((p) => ({
              productoId: p.productoId,
              nombre: p.nombre,
              stockDisponible: p.stock,
            }))}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-neutral-900">Historial</h2>
        <div className="flex gap-3 text-sm">
          <SortableHeader column="fechaCreacion" label="Ordenar por fecha" currentSort={sort} buildHref={(s) => buildHref(0, s)} />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {historial.contenido.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-600">Todavía no hay compras registradas en esta sucursal.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>N° factura</TableHead>
                  <TableHead className="text-right">Costo total</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.contenido.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="tabular-nums text-neutral-600">{formatDateTime(c.fechaCreacion)}</TableCell>
                    <TableCell>{c.nombreProveedor ?? "—"}</TableCell>
                    <TableCell>{c.numeroFactura ?? "—"}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{formatMoney(c.costoTotal)}</TableCell>
                    <TableCell>
                      <Link href={`/sucursal/${sucursalId}/compras/${c.id}`} className="text-sm font-medium text-primary hover:underline">
                        Ver detalle
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PaginationBar
        page={historial.pagina}
        totalPaginas={historial.totalPaginas}
        tieneSiguiente={historial.tieneSiguiente}
        buildHref={(p) => buildHref(p)}
      />
    </div>
  );
}
