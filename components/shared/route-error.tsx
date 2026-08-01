"use client";

import { useTransition } from "react";
import { AlertCircle, RotateCcw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { logoutAction } from "@/lib/actions/auth";

export function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-danger-bg text-danger">
        <AlertCircle aria-hidden="true" className="size-6" />
      </div>
      <h1 className="text-lg font-semibold text-neutral-900">Ocurrió un error</h1>
      <Card className="w-full shadow-sm">
        <CardContent role="alert" className="pt-6 text-sm text-neutral-600">
          {error.message}
        </CardContent>
      </Card>
      <p className="text-xs text-neutral-600">
        Si el problema persiste, puede que tu sesión haya expirado.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => reset()}>
          <RotateCcw /> Reintentar
        </Button>
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={() => startTransition(() => logoutAction())}
        >
          <LogOut /> Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
