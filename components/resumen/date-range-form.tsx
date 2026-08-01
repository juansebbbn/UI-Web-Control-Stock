"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarRange } from "lucide-react";

export function DateRangeForm({ inicioFecha, finFecha }: { inicioFecha: string; finFecha: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSubmit(formData: FormData) {
    const inicio = String(formData.get("inicio") ?? "");
    const fin = String(formData.get("fin") ?? "");
    const params = new URLSearchParams();
    if (inicio) params.set("inicio", inicio);
    if (fin) params.set("fin", fin);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form action={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="inicio" className="text-xs text-neutral-600">
          Desde
        </Label>
        <input
          id="inicio"
          name="inicio"
          type="date"
          defaultValue={inicioFecha}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fin" className="text-xs text-neutral-600">
          Hasta
        </Label>
        <input
          id="fin"
          name="fin"
          type="date"
          defaultValue={finFecha}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <Button type="submit" variant="outline" size="sm">
        <CalendarRange aria-hidden="true" /> Aplicar rango
      </Button>
    </form>
  );
}
