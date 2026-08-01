import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchProductosSucursal } from "@/lib/productos";
import { PAGE_SIZE_DEFAULT, PRODUCTOS_DEFAULT_SORT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { SortableHeader, getAriaSort } from "@/components/shared/sortable-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { formatMoney } from "@/lib/utils";
import { EditarProductoDialog } from "./editar-producto-dialog";
import { EliminarProductoButton } from "./eliminar-producto-button";

type Props = {
  params: Promise<{ sucursalId: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
};

export default async function ProductosPage({ params, searchParams }: Props) {
  const { sucursalId } = await params;
  const sp = await searchParams;
  const page = Number(sp.page ?? 0);
  const sort = sp.sort ?? PRODUCTOS_DEFAULT_SORT;

  const data = await fetchProductosSucursal(sucursalId, { page, size: PAGE_SIZE_DEFAULT, sort });

  const buildHref = (nextPage: number, nextSort = sort) =>
    `/sucursal/${sucursalId}/productos?page=${nextPage}&sort=${nextSort}`;
  const buildSortHref = (nextSort: string) => buildHref(0, nextSort);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Productos</h1>
          <p className="text-sm text-neutral-600">
            Productos cargados en esta sucursal ({data.totalElementos} en total).
          </p>
        </div>
        <Button nativeButton={false} render={<Link href={`/sucursal/${sucursalId}/productos/nuevo`} />}>
          <Plus aria-hidden="true" /> Agregar producto
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {data.contenido.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-600">
              Todavía no cargaste productos en esta sucursal.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead aria-sort={getAriaSort("nombre", sort)}>
                    <SortableHeader column="nombre" label="Producto" currentSort={sort} buildHref={buildSortHref} />
                  </TableHead>
                  <TableHead>Código de barras</TableHead>
                  <TableHead className="text-right" aria-sort={getAriaSort("stock", sort)}>
                    <SortableHeader column="stock" label="Stock" currentSort={sort} buildHref={buildSortHref} />
                  </TableHead>
                  <TableHead className="text-right" aria-sort={getAriaSort("precioCompra", sort)}>
                    <SortableHeader column="precioCompra" label="Compra" currentSort={sort} buildHref={buildSortHref} />
                  </TableHead>
                  <TableHead className="text-right" aria-sort={getAriaSort("precioVenta", sort)}>
                    <SortableHeader column="precioVenta" label="Venta" currentSort={sort} buildHref={buildSortHref} />
                  </TableHead>
                  <TableHead className="w-28" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.contenido.map((p) => {
                  const bajoMinimo = p.stock <= p.stockMinimo;
                  return (
                    <TableRow key={p.productoId}>
                      <TableCell className="font-medium">
                        {p.nombre}
                        {p.marca && <span className="ml-1.5 text-xs text-neutral-600">{p.marca}</span>}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-neutral-600">{p.codigoBarras}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {bajoMinimo ? <StatusBadge tone="danger">{p.stock}</StatusBadge> : p.stock}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatMoney(p.precioCompra)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatMoney(p.precioVenta)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <EditarProductoDialog sucursalId={sucursalId} producto={p} />
                          <EliminarProductoButton sucursalId={sucursalId} productoId={p.productoId} nombre={p.nombre} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
