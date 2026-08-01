import { Construction } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { PaginaOutput } from "@/lib/types/api";
import type { DTOVentaOutput } from "@/lib/types/dominio";
import { PAGE_SIZE_DEFAULT, VENTAS_DEFAULT_SORT } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatMoney, formatDateTime } from "@/lib/utils";

type Props = { params: Promise<{ sucursalId: string }> };

export default async function FacturacionPage({ params }: Props) {
  const { sucursalId } = await params;

  const data = await apiFetch<PaginaOutput<DTOVentaOutput>>(
    `/api/inventario/ventas/${sucursalId}?page=0&size=${PAGE_SIZE_DEFAULT}&sort=${VENTAS_DEFAULT_SORT}`
  );
  const pendientes = data.contenido.filter((v) => !v.anulada && v.estadoFacturacion !== "FACTURADA");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Facturación</h1>
        <p className="text-sm text-neutral-600">Seleccioná ventas para facturar.</p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-info/30 bg-info-bg px-3 py-2 text-sm text-info">
        <Construction aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>
          La integración de facturación electrónica todavía está en desarrollo en el backend. Por ahora
          podés ver qué ventas están pendientes de facturar; la acción de facturar se habilita cuando esté
          disponible.
        </span>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {pendientes.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-600">
              No hay ventas pendientes de facturar en la página más reciente.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Método de pago</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendientes.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="tabular-nums text-neutral-600">{formatDateTime(v.fechaCreacion)}</TableCell>
                    <TableCell>{v.metodoPago}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{formatMoney(v.montoTotal)}</TableCell>
                    <TableCell>
                      <StatusBadge tone="info">Pendiente</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Button disabled variant="outline" size="sm">
                        Facturar · Próximamente
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
