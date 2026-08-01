"use server";

import { redirect } from "next/navigation";
import { apiFetchPublic, ApiError } from "@/lib/api";
import { setSession } from "@/lib/session";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const contrasena = String(formData.get("contrasena") ?? "");
  const next = String(formData.get("next") ?? "") || "/negocio";

  if (!email || !contrasena) {
    return { error: "Completá email y contraseña." };
  }

  let datos: { email: string; token: string };
  try {
    datos = await apiFetchPublic<{ email: string; token: string }>("/api/autenticacion/login", {
      method: "POST",
      body: { email, contrasena },
    });
  } catch (e) {
    return {
      error: e instanceof ApiError ? e.message : "No se pudo iniciar sesión.",
    };
  }

  await setSession(datos.token, { email: datos.email });
  redirect(next);
}
