"use server";

import { apiFetch, ApiError } from "@/lib/api";

export type PerfilFormState = { error?: string; savedCuit?: string };

export async function completarPerfilAction(_prev: PerfilFormState, formData: FormData): Promise<PerfilFormState> {
  const cuit = String(formData.get("cuit") ?? "").trim();
  if (!cuit) {
    return { error: "El CUIT/CUIL es obligatorio." };
  }

  try {
    await apiFetch("/api/autenticacion/completar-perfil", {
      method: "PATCH",
      body: { cuit },
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "No se pudo guardar el CUIT." };
  }

  return { savedCuit: cuit };
}
