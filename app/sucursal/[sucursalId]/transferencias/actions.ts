"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export type TransferenciaFormState = { error?: string };

export async function crearTransferenciaAction(
  sucursalId: string,
  _prev: TransferenciaFormState,
  formData: FormData
): Promise<TransferenciaFormState> {
  const sucursalDestinoId = String(formData.get("sucursalDestinoId") ?? "");
  const cantidadesRaw = String(formData.get("cantidadesPorProducto") ?? "{}");

  if (!sucursalDestinoId) {
    return { error: "Elegí una sucursal de destino." };
  }

  let cantidadesPorProducto: Record<string, number>;
  try {
    cantidadesPorProducto = JSON.parse(cantidadesRaw);
  } catch {
    return { error: "Datos de productos inválidos." };
  }

  const entries = Object.entries(cantidadesPorProducto);
  if (entries.length === 0) {
    return { error: "Agregá al menos un producto." };
  }
  if (entries.some(([, cantidad]) => !Number.isInteger(cantidad) || cantidad <= 0)) {
    return { error: "Las cantidades deben ser números enteros positivos." };
  }

  try {
    await apiFetch("/api/transferencias", {
      method: "POST",
      body: {
        sucursalOrigenId: Number(sucursalId),
        sucursalDestinoId: Number(sucursalDestinoId),
        cantidadesPorProducto,
      },
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "No se pudo transferir el stock." };
  }

  revalidatePath(`/sucursal/${sucursalId}/transferencias`);
  revalidatePath(`/sucursal/${sucursalId}/productos`);
  return {};
}
