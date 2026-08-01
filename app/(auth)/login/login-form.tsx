"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormMessage } from "@/components/shared/form-message";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ next, registered }: { next?: string; registered?: boolean }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next ?? ""} />

          {registered && !state.error && (
            <FormMessage success="Cuenta creada. Iniciá sesión para continuar." />
          )}
          <FormMessage error={state.error} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contrasena">Contraseña</Label>
            <Input
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <SubmitButton className="mt-2 w-full" pendingLabel="Ingresando...">
            Ingresar
          </SubmitButton>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-600">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="font-medium text-primary hover:underline">
            Registrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
