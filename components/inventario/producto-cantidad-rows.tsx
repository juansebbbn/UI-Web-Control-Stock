"use client";

import { useId, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type ProductoOpcion = {
  productoId: number;
  nombre: string;
  stockDisponible?: number;
};

/**
 * Filas dinámicas de {producto, cantidad} para los movimientos de inventario
 * (compras/transferencias). Serializa el mapa como un input hidden en JSON,
 * que el Server Action correspondiente parsea de vuelta a Record<string, number>.
 */
export function ProductoCantidadRows({
  productos,
  fieldName = "cantidadesPorProducto",
}: {
  productos: ProductoOpcion[];
  fieldName?: string;
}) {
  const uid = useId();
  const [rows, setRows] = useState<{ key: string; productoId: string; cantidad: string }[]>([
    { key: `${uid}-0`, productoId: "", cantidad: "1" },
  ]);

  const mapa = Object.fromEntries(
    rows.filter((r) => r.productoId && Number(r.cantidad) > 0).map((r) => [r.productoId, Number(r.cantidad)])
  );

  function addRow() {
    setRows((prev) => [...prev, { key: `${uid}-${prev.length}-${Date.now()}`, productoId: "", cantidad: "1" }]);
  }
  function removeRow(key: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  }
  function updateRow(key: string, patch: Partial<{ productoId: string; cantidad: string }>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={fieldName} value={JSON.stringify(mapa)} />
      {productos.length === 0 ? (
        <p className="text-sm text-neutral-600">No hay productos disponibles.</p>
      ) : (
        rows.map((row) => {
          const elegidosEnOtrasFilas = rows.filter((r) => r.key !== row.key).map((r) => r.productoId);
          const opciones = productos.filter(
            (p) => !elegidosEnOtrasFilas.includes(String(p.productoId)) || String(p.productoId) === row.productoId
          );
          return (
            <div key={row.key} className="flex items-center gap-2">
              <Select value={row.productoId} onValueChange={(value) => updateRow(row.key, { productoId: value ?? "" })}>
                <SelectTrigger aria-label="Producto" className="w-full">
                  <SelectValue placeholder="Elegí un producto" />
                </SelectTrigger>
                <SelectContent>
                  {opciones.map((p) => (
                    <SelectItem key={p.productoId} value={String(p.productoId)}>
                      {p.nombre}
                      {p.stockDisponible !== undefined ? ` (stock: ${p.stockDisponible})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={1}
                step={1}
                aria-label="Cantidad"
                className="w-24 shrink-0"
                value={row.cantidad}
                onChange={(e) => updateRow(row.key, { cantidad: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                onClick={() => removeRow(row.key)}
                disabled={rows.length === 1}
                aria-label="Quitar producto"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          );
        })
      )}
      <Button type="button" variant="outline" size="sm" onClick={addRow} className="self-start">
        <Plus aria-hidden="true" /> Agregar producto
      </Button>
    </div>
  );
}
