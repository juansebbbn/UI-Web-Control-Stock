"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export type CompraFormState = { error?: string };

export async function registrarCompraAction(
  sucursalId: string,
  _prev: CompraFormState,
  formData: FormData
): Promise<CompraFormState> {
  const cantidadesRaw = String(formData.get("cantidadesPorProducto") ?? "{}");
  const nombreProveedor = String(formData.get("nombreProveedor") ?? "").trim();
  const numeroFactura = String(formData.get("numeroFactura") ?? "").trim();

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
    await apiFetch("/api/inventario/manual", {
      method: "POST",
      body: {
        sucursalId: Number(sucursalId),
        tipoTransaccion: "COMPRA",
        movimiento: { cantidadesPorProducto },
        infoProveedor:
          nombreProveedor || numeroFactura
            ? { nombreProveedor: nombreProveedor || null, numeroFactura: numeroFactura || null }
            : null,
      },
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "No se pudo registrar la compra." };
  }

  revalidatePath(`/sucursal/${sucursalId}/compras`);
  revalidatePath(`/sucursal/${sucursalId}/productos`);
  return {};
}
