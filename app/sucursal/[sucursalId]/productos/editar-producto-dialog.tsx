"use client";

import { useActionState, useState } from "react";
import { Pencil, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormMessage } from "@/components/shared/form-message";
import { useCloseOnSuccess } from "@/lib/use-close-on-success";
import type { ProductoSucursal } from "@/lib/types/dominio";
import { actualizarProductoAction, type ProductoFormState } from "./actions";

const initialState: ProductoFormState = {};

export function EditarProductoDialog({ sucursalId, producto }: { sucursalId: string; producto: ProductoSucursal }) {
  const [open, setOpen] = useState(false);
  const action = actualizarProductoAction.bind(null, sucursalId, producto.productoId);
  const [state, formAction] = useActionState(action, initialState);
  useCloseOnSuccess(state, open, setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="icon-sm"
        className="border-primary text-primary hover:bg-info-bg"
        onClick={() => setOpen(true)}
        aria-label={`Editar ${producto.nombre}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Pencil aria-hidden="true" />
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>Código de barras: {producto.codigoBarras}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <FormMessage error={state.error} />

          <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-bg px-3 py-2 text-xs text-warning">
            <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Editar nombre o marca afecta el catálogo global y puede modificar este producto en otras
              sucursales.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" defaultValue={producto.nombre} required />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" name="marca" defaultValue={producto.marca ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" min={0} step={1} defaultValue={producto.stock} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stockMinimo">Stock mínimo</Label>
              <Input
                id="stockMinimo"
                name="stockMinimo"
                type="number"
                min={0}
                step={1}
                defaultValue={producto.stockMinimo}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="precioCompra">Precio de compra</Label>
              <Input
                id="precioCompra"
                name="precioCompra"
                type="number"
                min={0.01}
                step={0.01}
                defaultValue={producto.precioCompra}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="precioVenta">Precio de venta</Label>
              <Input
                id="precioVenta"
                name="precioVenta"
                type="number"
                min={0.01}
                step={0.01}
                defaultValue={producto.precioVenta}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <SubmitButton pendingLabel="Guardando...">Guardar cambios</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
