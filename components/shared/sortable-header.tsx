import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Para el `aria-sort` del `<TableHead>` que envuelve a este componente. */
export function getAriaSort(column: string, currentSort: string): "ascending" | "descending" | "none" {
  const [currentColumn, currentDir] = currentSort.split(",");
  if (currentColumn !== column) return "none";
  return currentDir === "asc" ? "ascending" : "descending";
}

export function SortableHeader({
  column,
  label,
  currentSort,
  buildHref,
}: {
  column: string;
  label: string;
  currentSort: string;
  buildHref: (sort: string) => string;
}) {
  const [currentColumn, currentDir] = currentSort.split(",");
  const isActive = currentColumn === column;
  const nextDir = isActive && currentDir === "asc" ? "desc" : "asc";
  const Icon = !isActive ? ArrowUpDown : currentDir === "asc" ? ArrowUp : ArrowDown;

  return (
    <Link
      href={buildHref(`${column},${nextDir}`)}
      className={cn(
        "inline-flex items-center gap-1 hover:text-neutral-900",
        isActive && "font-medium text-neutral-900"
      )}
    >
      {label}
      <Icon aria-hidden="true" className={cn("size-3", !isActive && "text-neutral-400")} />
    </Link>
  );
}
