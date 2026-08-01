import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaginationBar({
  page,
  totalPaginas,
  tieneSiguiente,
  buildHref,
}: {
  page: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
  buildHref: (page: number) => string;
}) {
  if (totalPaginas <= 1) return null;
  const hasPrev = page > 0;
  const linkClass = buttonVariants({ variant: "outline", size: "sm" });
  const disabledClass = cn(linkClass, "pointer-events-none opacity-50");

  return (
    <div className="flex items-center justify-between gap-4 pt-3">
      <p className="text-sm text-neutral-600">
        Página {page + 1} de {totalPaginas}
      </p>
      <div className="flex gap-2">
        {hasPrev ? (
          <Link href={buildHref(page - 1)} className={linkClass}>
            <ChevronLeft aria-hidden="true" className="size-3.5" /> Anterior
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled="true">
            <ChevronLeft aria-hidden="true" className="size-3.5" /> Anterior
          </span>
        )}
        {tieneSiguiente ? (
          <Link href={buildHref(page + 1)} className={linkClass}>
            Siguiente <ChevronRight aria-hidden="true" className="size-3.5" />
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled="true">
            Siguiente <ChevronRight aria-hidden="true" className="size-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
