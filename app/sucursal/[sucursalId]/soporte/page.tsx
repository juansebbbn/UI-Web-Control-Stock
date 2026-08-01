import { LifeBuoy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SoportePage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Soporte</h1>
        <p className="text-sm text-neutral-600">¿Necesitás ayuda?</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-info-bg text-info">
            <LifeBuoy aria-hidden="true" className="size-6" />
          </div>
          <p className="text-sm text-neutral-600">Esta sección todavía está en construcción.</p>
        </CardContent>
      </Card>
    </div>
  );
}
