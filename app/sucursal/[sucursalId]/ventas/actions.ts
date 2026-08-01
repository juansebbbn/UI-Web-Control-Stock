"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export async function anularVentaAction(sucursalId: string, ventaId: number): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/inventario/ventas/${sucursalId}/${ventaId}/anular`, {
      method: "PATCH",
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "No se pudo anular la venta." };
  }

  revalidatePath(`/sucursal/${sucursalId}/ventas`);
  revalidatePath(`/sucursal/${sucursalId}/ventas/${ventaId}`);
  return {};
}
