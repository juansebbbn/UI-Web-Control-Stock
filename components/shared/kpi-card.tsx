import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start justify-between gap-3 pt-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-600">
            {label}
          </span>
          <span className="text-3xl font-bold tabular-nums text-neutral-900">{value}</span>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              tone === "neutral" && "bg-info-bg text-info",
              tone === "success" && "bg-success-bg text-success",
              tone === "warning" && "bg-warning-bg text-warning",
              tone === "danger" && "bg-danger-bg text-danger"
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
