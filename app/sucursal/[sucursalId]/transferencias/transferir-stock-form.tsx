"use client";

import { useActionState, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormMessage } from "@/components/shared/form-message";
import { ProductoCantidadRows, type ProductoOpcion } from "@/components/inventario/producto-cantidad-rows";
import type { Sucursal } from "@/lib/types/dominio";
import { crearTransferenciaAction, type TransferenciaFormState } from "./actions";

const initialState: TransferenciaFormState = {};

export function TransferirStockForm({
  sucursalId,
  otrasSucursales,
  productos,
}: {
  sucursalId: string;
  otrasSucursales: Sucursal[];
  productos: ProductoOpcion[];
}) {
  const action = crearTransferenciaAction.bind(null, sucursalId);
  const [state, formAction] = useActionState(action, initialState);
  const [prevState, setPrevState] = useState(state);
  const [resetKey, setResetKey] = useState(0);
  const [destino, setDestino] = useState("");

  if (state !== prevState) {
    setPrevState(state);
    if (!state.error) setResetKey((k) => k + 1);
  }

  if (otrasSucursales.length === 0) {
    return <p className="text-sm text-neutral-600">Necesitás al menos otra sucursal para poder transferir stock.</p>;
  }

  return (
    <form key={resetKey} action={formAction} className="flex flex-col gap-5">
      <FormMessage error={state.error} success={resetKey > 0 ? "Transferencia realizada." : undefined} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sucursalDestinoId">Sucursal de destino</Label>
        <input type="hidden" name="sucursalDestinoId" value={destino} />
        <Select value={destino} onValueChange={(v) => setDestino(v ?? "")}>
          <SelectTrigger id="sucursalDestinoId" className="w-full">
            <SelectValue placeholder="Elegí la sucursal de destino" />
          </SelectTrigger>
          <SelectContent>
            {otrasSucursales.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Productos a transferir</Label>
        <p className="mb-2 text-xs text-neutral-600">
          Solo se pueden transferir productos que ya estén cargados en ambas sucursales.
        </p>
        <ProductoCantidadRows productos={productos} />
      </div>

      <SubmitButton className="self-start" pendingLabel="Transfiriendo...">
        Transferir stock
      </SubmitButton>
    </form>
  );
}
