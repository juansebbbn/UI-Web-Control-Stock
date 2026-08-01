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
import { eliminarProductoAction } from "./actions";

export function EliminarProductoButton({
  sucursalId,
  productoId,
  nombre,
}: {
  sucursalId: string;
  productoId: number;
  nombre: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await eliminarProductoAction(sucursalId, productoId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`"${nombre}" eliminado de esta sucursal.`);
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
          <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que querés eliminar &quot;{nombre}&quot; de esta sucursal? El producto sigue existiendo
            en el catálogo general y en otras sucursales.
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
