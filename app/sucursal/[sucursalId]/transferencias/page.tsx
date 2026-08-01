import { apiFetch } from "@/lib/api";
import { fetchProductosSucursal } from "@/lib/productos";
import type { PaginaOutput } from "@/lib/types/api";
import type { Sucursal, TransferenciaHistorial } from "@/lib/types/dominio";
import { PAGE_SIZE_TRANSFERENCIAS, TRANSFERENCIAS_DEFAULT_SORT } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { formatDateTime } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { TransferirStockForm } from "./transferir-stock-form";

type Props = {
  params: Promise<{ sucursalId: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function TransferenciasPage({ params, searchParams }: Props) {
  const { sucursalId } = await params;
  const sp = await searchParams;
  const page = Number(sp.page ?? 0);

  const [sucursales, productos, historial] = await Promise.all([
    apiFetch<Sucursal[]>("/api/sucursales/listar"),
    fetchProductosSucursal(sucursalId, { size: 200, sort: "stock,asc" }),
    apiFetch<PaginaOutput<TransferenciaHistorial>>(
      `/api/transferencias/${sucursalId}?page=${page}&size=${PAGE_SIZE_TRANSFERENCIAS}&sort=${TRANSFERENCIAS_DEFAULT_SORT}`
    ),
  ]);

  const nombrePorId = new Map(sucursales.map((s) => [s.id, s.nombre]));
  const otrasSucursales = sucursales.filter((s) => String(s.id) !== sucursalId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Transferencias entre sucursales</h1>
        <p className="text-sm text-neutral-600">Movés stock directamente entre tus sucursales, sin pasar por venta ni compra.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Nueva transferencia</CardTitle>
        </CardHeader>
        <CardContent>
          <TransferirStockForm
            sucursalId={sucursalId}
            otrasSucursales={otrasSucursales}
            productos={productos.contenido.map((p) => ({
              productoId: p.productoId,
              nombre: p.nombre,
              stockDisponible: p.stock,
            }))}
          />
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold text-neutral-900">Últimas transferencias</h2>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {historial.contenido.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-600">Todavía no hay transferencias registradas para esta sucursal.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.contenido.map((t) => {
                  const esSaliente = String(t.sucursalOrigenId) === sucursalId;
                  const otraSucursal = esSaliente ? nombrePorId.get(t.sucursalDestinoId) : nombrePorId.get(t.sucursalOrigenId);
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="tabular-nums text-neutral-600">{formatDateTime(t.fechaCreacion)}</TableCell>
                      <TableCell>
                        {esSaliente ? (
                          <StatusBadge tone="warning">
                            <ArrowUpRight aria-hidden="true" className="size-3" /> Hacia {otraSucursal ?? "—"}
                          </StatusBadge>
                        ) : (
                          <StatusBadge tone="success">
                            <ArrowDownLeft aria-hidden="true" className="size-3" /> Desde {otraSucursal ?? "—"}
                          </StatusBadge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{t.nombreProducto}</TableCell>
                      <TableCell className="text-right tabular-nums">{t.cantidad}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PaginationBar
        page={historial.pagina}
        totalPaginas={historial.totalPaginas}
        tieneSiguiente={historial.tieneSiguiente}
        buildHref={(p) => `/sucursal/${sucursalId}/transferencias?page=${p}`}
      />
    </div>
  );
}
