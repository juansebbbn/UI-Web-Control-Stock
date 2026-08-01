"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  pendingLabel,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={cn(className)}
      {...props}
    >
      {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
      {pending ? (pendingLabel ?? children) : children}
    </Button>
  );
}
