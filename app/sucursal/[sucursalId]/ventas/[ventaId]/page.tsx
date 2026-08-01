import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { DTOVentaOutput } from "@/lib/types/dominio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatMoney, formatDateTime } from "@/lib/utils";
import { AnularVentaButton } from "../anular-venta-button";

type Props = {
  params: Promise<{ sucursalId: string; ventaId: string }>;
};

export default async function VentaDetallePage({ params }: Props) {
  const { sucursalId, ventaId } = await params;
  const venta = await apiFetch<DTOVentaOutput>(`/api/inventario/ventas/${sucursalId}/${ventaId}`);

  const puedeAnular = !venta.anulada && venta.estadoFacturacion !== "FACTURADA";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href={`/sucursal/${sucursalId}/ventas`}
          className="mb-2 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft aria-hidden="true" className="size-3.5" /> Volver a ventas
        </Link>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Venta #{venta.id}</h1>
            <p className="text-sm text-neutral-600">{formatDateTime(venta.fechaCreacion)}</p>
          </div>
          {puedeAnular && <AnularVentaButton sucursalId={sucursalId} ventaId={venta.id} />}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {venta.anulada ? (
          <StatusBadge tone="danger">Anulada el {venta.fechaAnulacion && formatDateTime(venta.fechaAnulacion)}</StatusBadge>
        ) : venta.estadoFacturacion === "FACTURADA" ? (
          <StatusBadge tone="success">Facturada{venta.cae ? ` · CAE ${venta.cae}` : ""}</StatusBadge>
        ) : venta.estadoFacturacion === "ERROR" ? (
          <StatusBadge tone="danger">Error de facturación</StatusBadge>
        ) : (
          <StatusBadge tone="info">Pendiente de facturar</StatusBadge>
        )}
        <StatusBadge tone="neutral">{venta.metodoPago}</StatusBadge>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Productos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio unit.</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venta.detalles.map((d) => (
                <TableRow key={d.productoId}>
                  <TableCell className="font-medium">{d.nombreProducto}</TableCell>
                  <TableCell className="text-right tabular-nums">{d.cantidad}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(d.precioUnitario)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(d.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardContent className="flex justify-end border-t border-neutral-200 py-3">
          <p className="text-sm font-semibold text-neutral-900">
            Total: <span className="tabular-nums">{formatMoney(venta.montoTotal)}</span>
          </p>
        </CardContent>
      </Card>

      {venta.cliente && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Nombre / razón social" value={venta.cliente.nombreRazonSocial} />
            <Info label="Documento" value={`${venta.cliente.tipoDocumento} ${venta.cliente.numeroDocumento}`} />
            <Info label="Condición IVA" value={venta.cliente.condicionIva} />
            {venta.cliente.direccion && <Info label="Dirección" value={venta.cliente.direccion} />}
            {venta.cliente.ciudad && <Info label="Ciudad" value={venta.cliente.ciudad} />}
            {venta.cliente.provincia && <Info label="Provincia" value={venta.cliente.provincia} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">{label}</p>
      <p className="text-neutral-900">{value}</p>
    </div>
  );
}
