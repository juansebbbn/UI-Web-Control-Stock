import { AlertTriangle, TrendingDown, TrendingUp, Wallet, PackageSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { DateRangeForm } from "@/components/resumen/date-range-form";
import { formatMoney, formatNumber, paginateArray, buildSearchHref } from "@/lib/utils";
import { PAGE_SIZE_DEFAULT } from "@/lib/constants";
import type { RankingItem } from "@/lib/types/dominio";
import type { PaginaOutput } from "@/lib/types/api";
import type { Rankings } from "@/lib/resumen";

export type StockBajoRow = {
  nombreProducto: string;
  stockActual: number;
  stockMinimo: number;
  nombreSucursal?: string;
};

export type PorAgotarseRow = {
  nombreProducto: string;
  ventasPromedioDiarias: number;
  diasStockRestante: number;
  nombreSucursal?: string;
};

export function ResumenPanel({
  totalProductosVendidos,
  gananciaDiaria,
  productosBajoStockMinimo,
  productosPorAgotarse,
  rankings,
  inicioFecha,
  finFecha,
  pathname,
  searchParams,
}: {
  totalProductosVendidos: number;
  gananciaDiaria: number;
  productosBajoStockMinimo: StockBajoRow[];
  productosPorAgotarse: PorAgotarseRow[];
  rankings: Rankings;
  inicioFecha: string;
  finFecha: string;
  pathname: string;
  searchParams: Record<string, string | undefined>;
}) {
  const mostrarSucursal =
    productosBajoStockMinimo.some((p) => p.nombreSucursal) ||
    productosPorAgotarse.some((p) => p.nombreSucursal);

  const buildHref = (overrides: Record<string, string | number | undefined>) =>
    buildSearchHref(pathname, searchParams, overrides);

  const stockPage = Number(searchParams.stockPage ?? 0);
  const agotarsePage = Number(searchParams.agotarsePage ?? 0);
  const stockPagina = paginateArray(productosBajoStockMinimo, stockPage, PAGE_SIZE_DEFAULT);
  const agotarsePagina = paginateArray(productosPorAgotarse, agotarsePage, PAGE_SIZE_DEFAULT);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard label="Productos vendidos hoy" value={formatNumber(totalProductosVendidos)} icon={TrendingUp} tone="success" />
        <KpiCard label="Ganancia de hoy" value={formatMoney(gananciaDiaria)} icon={Wallet} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="min-w-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle aria-hidden="true" className="size-4 text-danger" /> Stock bajo el mínimo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productosBajoStockMinimo.length === 0 ? (
              <p className="text-sm text-neutral-600">Ningún producto está bajo su stock mínimo.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      {mostrarSucursal && <TableHead>Sucursal</TableHead>}
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Mínimo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockPagina.contenido.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{p.nombreProducto}</TableCell>
                        {mostrarSucursal && <TableCell className="text-neutral-600">{p.nombreSucursal}</TableCell>}
                        <TableCell className="text-right tabular-nums">
                          <StatusBadge tone="danger">{p.stockActual}</StatusBadge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-neutral-600">{p.stockMinimo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationBar
                  page={stockPagina.pagina}
                  totalPaginas={stockPagina.totalPaginas}
                  tieneSiguiente={stockPagina.tieneSiguiente}
                  buildHref={(p) => buildHref({ stockPage: p })}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingDown aria-hidden="true" className="size-4 text-warning" /> Por agotarse pronto
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productosPorAgotarse.length === 0 ? (
              <p className="text-sm text-neutral-600">No hay productos por agotarse en el corto plazo.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      {mostrarSucursal && <TableHead>Sucursal</TableHead>}
                      <TableHead className="text-right">Ventas/día</TableHead>
                      <TableHead className="text-right">Días de stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agotarsePagina.contenido.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{p.nombreProducto}</TableCell>
                        {mostrarSucursal && <TableCell className="text-neutral-600">{p.nombreSucursal}</TableCell>}
                        <TableCell className="text-right tabular-nums">{p.ventasPromedioDiarias.toFixed(1)}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          <StatusBadge tone="warning">{p.diasStockRestante.toFixed(1)}d</StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationBar
                  page={agotarsePagina.pagina}
                  totalPaginas={agotarsePagina.totalPaginas}
                  tieneSiguiente={agotarsePagina.tieneSiguiente}
                  buildHref={(p) => buildHref({ agotarsePage: p })}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-col gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <PackageSearch aria-hidden="true" className="size-4 text-primary" /> Rankings de productos
          </CardTitle>
          <DateRangeForm inicioFecha={inicioFecha} finFecha={finFecha} />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mas-vendidos">
            <TabsList>
              <TabsTrigger value="mas-vendidos">Más vendidos</TabsTrigger>
              <TabsTrigger value="mas-rentables">Más rentables</TabsTrigger>
              <TabsTrigger value="ventas-promedio">Ventas promedio/día</TabsTrigger>
            </TabsList>
            <TabsContent value="mas-vendidos" className="pt-4">
              <RankingTable pagina={rankings.masVendidos} valorLabel="Unidades" buildHref={(p) => buildHref({ mvPage: p })} />
            </TabsContent>
            <TabsContent value="mas-rentables" className="pt-4">
              <RankingTable
                pagina={rankings.masRentables}
                valorLabel="Ganancia"
                money
                buildHref={(p) => buildHref({ mrPage: p })}
              />
            </TabsContent>
            <TabsContent value="ventas-promedio" className="pt-4">
              <RankingTable
                pagina={rankings.ventasPromedioDiarias}
                valorLabel="Prom. diario"
                buildHref={(p) => buildHref({ vpPage: p })}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function RankingTable({
  pagina,
  valorLabel,
  money,
  buildHref,
}: {
  pagina: PaginaOutput<RankingItem>;
  valorLabel: string;
  money?: boolean;
  buildHref: (page: number) => string;
}) {
  if (pagina.contenido.length === 0) {
    return <p className="text-sm text-neutral-600">Sin datos para el rango seleccionado.</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">{valorLabel}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagina.contenido.map((item, i) => (
            <TableRow key={item.nombre + i}>
              <TableCell className="text-neutral-400">{pagina.pagina * pagina.tamano + i + 1}</TableCell>
              <TableCell className="font-medium">{item.nombre}</TableCell>
              <TableCell className="text-right tabular-nums">
                {money ? formatMoney(item.valor) : formatNumber(item.valor)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationBar page={pagina.pagina} totalPaginas={pagina.totalPaginas} tieneSiguiente={pagina.tieneSiguiente} buildHref={buildHref} />
    </>
  );
}
