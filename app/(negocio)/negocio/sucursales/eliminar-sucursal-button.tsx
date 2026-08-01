"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { eliminarSucursalAction } from "./actions";

export function EliminarSucursalButton({ sucursalId, nombre }: { sucursalId: number; nombre: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await eliminarSucursalAction(sucursalId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Sucursal "${nombre}" eliminada.`);
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="destructive"
        size="icon-sm"
        onClick={() => setOpen(true)}
        aria-label={`Eliminar ${nombre}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Trash2 aria-hidden="true" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar sucursal</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que querés eliminar &quot;{nombre}&quot;? Esta acción no se puede deshacer desde
            la interfaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
