"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormMessage } from "@/components/shared/form-message";
import { ProductoCantidadRows, type ProductoOpcion } from "@/components/inventario/producto-cantidad-rows";
import { registrarCompraAction, type CompraFormState } from "./actions";

const initialState: CompraFormState = {};

export function RegistrarCompraForm({ sucursalId, productos }: { sucursalId: string; productos: ProductoOpcion[] }) {
  const action = registrarCompraAction.bind(null, sucursalId);
  const [state, formAction] = useActionState(action, initialState);
  const [prevState, setPrevState] = useState(state);
  const [resetKey, setResetKey] = useState(0);

  if (state !== prevState) {
    setPrevState(state);
    if (!state.error) setResetKey((k) => k + 1);
  }

  return (
    <form key={resetKey} action={formAction} className="flex flex-col gap-5">
      <FormMessage error={state.error} success={resetKey > 0 ? "Compra registrada." : undefined} />

      <div>
        <Label className="mb-2 block">Productos</Label>
        <ProductoCantidadRows productos={productos} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nombreProveedor">Proveedor (opcional)</Label>
          <Input id="nombreProveedor" name="nombreProveedor" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="numeroFactura">N° de factura (opcional)</Label>
          <Input id="numeroFactura" name="numeroFactura" />
        </div>
      </div>

      <SubmitButton className="self-start" pendingLabel="Registrando...">
        Registrar compra
      </SubmitButton>
    </form>
  );
}
