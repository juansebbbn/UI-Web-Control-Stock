"use client";

import { useActionState } from "react";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormMessage } from "@/components/shared/form-message";
import { completarPerfilAction, type PerfilFormState } from "./actions";

const initialState: PerfilFormState = {};

export function PerfilForm() {
  const [state, formAction] = useActionState(completarPerfilAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage error={state.error} success={state.savedCuit ? `CUIT/CUIL guardado: ${state.savedCuit}` : undefined} />

      <div className="flex items-start gap-2 rounded-lg border border-info/30 bg-info-bg px-3 py-2 text-xs text-info">
        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        <span id="cuit-hint">
          El CUIT/CUIL no se puede consultar luego de guardarlo desde esta pantalla; esta confirmación
          solo indica que el envío se realizó correctamente.
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cuit">CUIT / CUIL</Label>
        <Input id="cuit" name="cuit" placeholder="20-12345678-9" required aria-describedby="cuit-hint" />
      </div>

      <SubmitButton className="self-start" pendingLabel="Guardando...">
        Guardar
      </SubmitButton>
    </form>
  );
}
