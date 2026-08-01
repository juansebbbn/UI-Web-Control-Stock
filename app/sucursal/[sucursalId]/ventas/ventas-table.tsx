"use client";

import { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatMoney, formatDateTime } from "@/lib/utils";
import type { DTOVentaOutput } from "@/lib/types/dominio";

export function VentasTable({ sucursalId, ventas }: { sucursalId: string; ventas: DTOVentaOutput[] }) {
  const [filtro, setFiltro] = useState<"todas" | "facturadas" | "no-facturadas">("todas");

  const filtradas = ventas.filter((v) => {
    if (filtro === "facturadas") return v.estadoFacturacion === "FACTURADA";
    if (filtro === "no-facturadas") return v.estadoFacturacion !== "FACTURADA";
    return true;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <Tabs value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="facturadas">Facturadas</TabsTrigger>
            <TabsTrigger value="no-facturadas">No facturadas</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs text-neutral-600">El filtro aplica a los resultados de esta página.</p>
      </div>

      {filtradas.length === 0 ? (
        <p className="p-8 text-center text-sm text-neutral-600">No hay ventas que coincidan con el filtro en esta página.</p>
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
            {filtradas.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="tabular-nums text-neutral-600">{formatDateTime(v.fechaCreacion)}</TableCell>
                <TableCell>{v.metodoPago}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">{formatMoney(v.montoTotal)}</TableCell>
                <TableCell>
                  {v.anulada ? (
                    <StatusBadge tone="danger">Anulada</StatusBadge>
                  ) : v.estadoFacturacion === "FACTURADA" ? (
                    <StatusBadge tone="success">Facturada</StatusBadge>
                  ) : v.estadoFacturacion === "ERROR" ? (
                    <StatusBadge tone="danger">Error de facturación</StatusBadge>
                  ) : (
                    <StatusBadge tone="info">Pendiente</StatusBadge>
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/sucursal/${sucursalId}/ventas/${v.id}`} className="text-sm font-medium text-primary hover:underline">
                    Ver detalle
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
