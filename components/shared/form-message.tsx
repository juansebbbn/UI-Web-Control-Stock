import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormMessage({
  error,
  success,
}: {
  error?: string | null;
  success?: string | null;
}) {
  if (!error && !success) return null;

  const isError = Boolean(error);

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
        isError
          ? "border-danger/30 bg-danger-bg text-danger"
          : "border-success/30 bg-success-bg text-success"
      )}
    >
      {isError ? (
        <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{error ?? success}</span>
    </div>
  );
}
