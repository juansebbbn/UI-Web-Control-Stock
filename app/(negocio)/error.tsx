"use client";

import { RouteError } from "@/components/shared/route-error";

export default function NegocioError({ error, reset }: { error: Error; reset: () => void }) {
  return <RouteError error={error} reset={reset} />;
}
