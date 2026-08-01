import { useState } from "react";

/**
 * Cierra un Dialog/AlertDialog controlado cuando un useActionState termina en
 * éxito (sin error). Compara identidad de referencia contra el estado previo
 * durante el render (no en un efecto) — el patrón que React recomienda para
 * "ajustar estado cuando cambia algo", evitando un round-trip de renders extra.
 */
export function useCloseOnSuccess<S extends { error?: string }>(
  state: S,
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const [prevState, setPrevState] = useState(state);

  if (state !== prevState) {
    setPrevState(state);
    if (open && !state.error) {
      setOpen(false);
    }
  }
}
