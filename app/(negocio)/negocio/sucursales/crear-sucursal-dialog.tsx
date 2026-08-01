"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
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
import { crearSucursalAction, type SucursalFormState } from "./actions";

const initialState: SucursalFormState = {};

export function CrearSucursalDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(crearSucursalAction, initialState);
  useCloseOnSuccess(state, open, setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <Plus aria-hidden="true" /> Nueva sucursal
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva sucursal</DialogTitle>
          <DialogDescription>Agregá una sucursal a tu negocio.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <FormMessage error={state.error} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" required autoFocus />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="direccion">Dirección (opcional)</Label>
            <Input id="direccion" name="direccion" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <SubmitButton pendingLabel="Creando...">Crear sucursal</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
