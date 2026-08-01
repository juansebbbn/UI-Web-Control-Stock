"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";

export type ProductoFormState = { error?: string };

function parseProductoFields(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const marca = String(formData.get("marca") ?? "").trim();
  const stock = Number(formData.get("stock"));
  const precioCompra = Number(formData.get("precioCompra"));
  const precioVenta = Number(formData.get("precioVenta"));
  const stockMinimo = Number(formData.get("stockMinimo"));

  if ([stock, precioCompra, precioVenta, stockMinimo].some((n) => Number.isNaN(n))) {
    return { error: "Revisá los valores numéricos ingresados." } as const;
  }
  if (stock < 0 || stockMinimo < 0) {
    return { error: "El stock y el stock mínimo no pueden ser negativos." } as const;
  }
  if (precioCompra <= 0 || precioVenta <= 0) {
    return { error: "Los precios deben ser mayores a 0." } as const;
  }

  return { nombre, marca: marca || null, stock, precioCompra, precioVenta, stockMinimo } as const;
}

export async function crearProductoAction(
  sucursalId: string,
  _prev: ProductoFormState,
  formData: FormData
): Promise<ProductoFormState> {
  const codigoBarras = String(formData.get("codigoBarras") ?? "").trim();
  const fields = parseProductoFields(formData);
  if ("error" in fields) return fields;
  if (!codigoBarras || !fields.nombre) {
    return { error: "Código de barras y nombre son obligatorios." };
  }

  try {
    await apiFetch(`/api/productos/${sucursalId}/crear`, {
      method: "POST",
      body: { codigoBarras, ...fields },
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "No se pudo crear el producto." };
  }

  revalidatePath(`/sucursal/${sucursalId}/productos`);
  redirect(`/sucursal/${sucursalId}/productos`);
}

export async function actualizarProductoAction(
  sucursalId: string,
  productoId: number,
  _prev: ProductoFormState,
  formData: FormData
): Promise<ProductoFormState> {
  const fields = parseProductoFields(formData);
  if ("error" in fields) return fields;
  if (!fields.nombre) return { error: "El nombre es obligatorio." };

  try {
    await apiFetch(`/api/productos/actualizar/${sucursalId}/${productoId}`, {
      method: "PATCH",
      body: fields,
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "No se pudo actualizar el producto." };
  }

  revalidatePath(`/sucursal/${sucursalId}/productos`);
  return {};
}

export async function eliminarProductoAction(sucursalId: string, productoId: number): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/productos/eliminar/${sucursalId}/${productoId}`, { method: "DELETE" });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "No se pudo eliminar el producto." };
  }

  revalidatePath(`/sucursal/${sucursalId}/productos`);
  return {};
}
