"use client";

import { useState, useTransition } from "react";
import { Ban } from "lucide-react";
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
import { anularVentaAction } from "./actions";

export function AnularVentaButton({ sucursalId, ventaId }: { sucursalId: string; ventaId: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await anularVentaAction(sucursalId, ventaId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Venta anulada. El stock vendido fue repuesto.");
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <Ban aria-hidden="true" /> Anular venta
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anular venta</AlertDialogTitle>
          <AlertDialogDescription>
            Se repondrá el stock de los productos vendidos. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Anulando..." : "Anular venta"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
