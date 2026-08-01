"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export type SucursalFormState = { error?: string };

export async function crearSucursalAction(
  _prev: SucursalFormState,
  formData: FormData
): Promise<SucursalFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();

  if (!nombre) {
    return { error: "El nombre es obligatorio." };
  }

  try {
    await apiFetch("/api/sucursales/crear", {
      method: "POST",
      body: { nombre, direccion: direccion || null },
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "No se pudo crear la sucursal." };
  }

  revalidatePath("/negocio/sucursales");
  revalidatePath("/negocio");
  return {};
}

export async function eliminarSucursalAction(sucursalId: number): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/sucursales/eliminar/${sucursalId}`, { method: "DELETE" });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "No se pudo eliminar la sucursal." };
  }

  revalidatePath("/negocio/sucursales");
  revalidatePath("/negocio");
  return {};
}
