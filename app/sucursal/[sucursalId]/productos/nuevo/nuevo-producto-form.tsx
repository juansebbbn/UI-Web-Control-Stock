"use client";

import { useActionState, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { crearProductoAction, type ProductoFormState } from "../actions";
import type { ProductoSucursal } from "@/lib/types/dominio";

const initialState: ProductoFormState = {};

export function NuevoProductoForm({
  sucursalId,
  productosExistentes,
}: {
  sucursalId: string;
  productosExistentes: ProductoSucursal[];
}) {
  const router = useRouter();
  const action = crearProductoAction.bind(null, sucursalId);
  const [state, formAction] = useActionState(action, initialState);
  const [codigoBarras, setCodigoBarras] = useState("");

  const codigosExistentes = useMemo(
    () => new Set(productosExistentes.map((p) => p.codigoBarras)),
    [productosExistentes]
  );
  const yaExiste = codigoBarras.trim().length > 0 && codigosExistentes.has(codigoBarras.trim());

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormMessage error={state.error} />

      <div className="flex items-start gap-2 rounded-lg border border-info/30 bg-info-bg px-3 py-2 text-xs text-info">
        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        <span id="codigoBarras-hint">
          El catálogo de productos es compartido entre todas las sucursales. Si el código de barras ya
          existe en el catálogo general, se reutilizará el nombre y marca ya guardados.
        </span>
      </div>

      {yaExiste && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-bg px-3 py-2 text-xs text-warning"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>Ya tenés un producto con este código de barras cargado en esta sucursal.</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="codigoBarras">Código de barras</Label>
        <Input
          id="codigoBarras"
          name="codigoBarras"
          required
          autoFocus
          aria-describedby="codigoBarras-hint"
          aria-invalid={yaExiste}
          value={codigoBarras}
          onChange={(e) => setCodigoBarras(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" required />
        </div>
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor="marca">Marca (opcional)</Label>
          <Input id="marca" name="marca" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stock">Stock inicial</Label>
          <Input id="stock" name="stock" type="number" min={0} step={1} defaultValue={0} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stockMinimo">Stock mínimo</Label>
          <Input id="stockMinimo" name="stockMinimo" type="number" min={0} step={1} defaultValue={0} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="precioCompra">Precio de compra</Label>
          <Input id="precioCompra" name="precioCompra" type="number" min={0.01} step={0.01} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="precioVenta">Precio de venta</Label>
          <Input id="precioVenta" name="precioVenta" type="number" min={0.01} step={0.01} required />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <SubmitButton pendingLabel="Creando...">Crear producto</SubmitButton>
      </div>
    </form>
  );
}
