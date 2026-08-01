"use server";

import { redirect } from "next/navigation";
import { apiFetchPublic, ApiError } from "@/lib/api";
import type { CategoriaNegocio } from "@/lib/types/dominio";

export type RegistroState = { error?: string };

const CATEGORIAS_VALIDAS: CategoriaNegocio[] = ["KIOSKO_ALMACEN", "FERRETERIA", "FARMACIA"];

export async function registroAction(
  _prev: RegistroState,
  formData: FormData
): Promise<RegistroState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "") as CategoriaNegocio;
  const contrasena = String(formData.get("contrasena") ?? "");

  if (!nombre || !email || !categoria || !contrasena) {
    return { error: "Completá todos los campos." };
  }
  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
    return { error: "Elegí una categoría de negocio válida." };
  }
  if (contrasena.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  try {
    await apiFetchPublic("/api/autenticacion/registro", {
      method: "POST",
      body: { nombre, email, categoria, contrasena },
    });
  } catch (e) {
    return {
      error: e instanceof ApiError ? e.message : "No se pudo completar el registro.",
    };
  }

  redirect("/login?registered=1");
}
