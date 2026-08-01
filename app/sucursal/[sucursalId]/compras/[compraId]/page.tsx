import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { DTOReposicionOutput } from "@/lib/types/dominio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney, formatDateTime } from "@/lib/utils";

type Props = { params: Promise<{ sucursalId: string; compraId: string }> };

export default async function CompraDetallePage({ params }: Props) {
  const { sucursalId, compraId } = await params;
  const compra = await apiFetch<DTOReposicionOutput>(`/api/inventario/compras/${sucursalId}/${compraId}`);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href={`/sucursal/${sucursalId}/compras`}
          className="mb-2 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft aria-hidden="true" className="size-3.5" /> Volver a compras
        </Link>
        <h1 className="text-2xl font-semibold text-neutral-900">Compra #{compra.id}</h1>
        <p className="text-sm text-neutral-600">{formatDateTime(compra.fechaCreacion)}</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="grid grid-cols-2 gap-3 pt-6 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">Proveedor</p>
            <p className="text-neutral-900">{compra.nombreProveedor ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">N° factura</p>
            <p className="text-neutral-900">{compra.numeroFactura ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

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
                <TableHead className="text-right">Costo unit.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compra.detalles.map((d) => (
                <TableRow key={d.productoId}>
                  <TableCell className="font-medium">{d.nombreProducto}</TableCell>
                  <TableCell className="text-right tabular-nums">{d.cantidad}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(d.costoUnitario)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardContent className="flex justify-end border-t border-neutral-200 py-3">
          <p className="text-sm font-semibold text-neutral-900">
            Total: <span className="tabular-nums">{formatMoney(compra.costoTotal)}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
