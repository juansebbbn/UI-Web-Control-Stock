"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormMessage } from "@/components/shared/form-message";
import { CATEGORIAS_NEGOCIO } from "@/lib/constants";
import { registroAction, type RegistroState } from "./actions";

const initialState: RegistroState = {};

export function RegistroForm() {
  const [state, formAction] = useActionState(registroAction, initialState);
  const [categoria, setCategoria] = useState<string>("");

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="categoria" value={categoria} />

          <FormMessage error={state.error} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nombre">Nombre del negocio</Label>
            <Input id="nombre" name="nombre" autoComplete="organization" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="categoria-trigger">Categoría</Label>
            <Select value={categoria} onValueChange={(value) => setCategoria(value ?? "")}>
              <SelectTrigger id="categoria-trigger" className="w-full">
                <SelectValue placeholder="Elegí una categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS_NEGOCIO.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contrasena">Contraseña</Label>
            <Input
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              aria-describedby="contrasena-hint"
            />
            <p id="contrasena-hint" className="text-xs text-neutral-600">
              Mínimo 8 caracteres.
            </p>
          </div>

          <SubmitButton className="mt-2 w-full" pendingLabel="Creando cuenta...">
            Crear cuenta
          </SubmitButton>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-600">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Ingresá
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
