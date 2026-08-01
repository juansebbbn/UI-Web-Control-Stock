import "server-only";
import { apiFetch, ApiError } from "@/lib/api";
import type { PaginaOutput } from "@/lib/types/api";
import type { ProductoSucursal } from "@/lib/types/dominio";

function paginaVacia(page: number, size: number): PaginaOutput<ProductoSucursal> {
  return {
    contenido: [],
    pagina: page,
    tamano: size,
    totalElementos: 0,
    totalPaginas: 0,
    tieneSiguiente: false,
  };
}

/**
 * GET /api/productos/obtener-productos/{sucursalId} — el backend
 * (ServicioProducto.obtenerProductosDeSucursal) lanza un 404 "La sucursal no
 * tiene productos" cuando el inventario está vacío, en vez de devolver una
 * página vacía. La sucursal en sí ya se valida antes de llamar acá (en
 * sucursal/[sucursalId]/layout.tsx contra /api/sucursales/listar), así que a
 * esta altura un 404 solo puede significar "todavía no hay productos" —
 * se trata como una lista vacía real, no como un error de la UI.
 */
export async function fetchProductosSucursal(
  sucursalId: string | number,
  { page = 0, size = 20, sort }: { page?: number; size?: number; sort?: string } = {}
): Promise<PaginaOutput<ProductoSucursal>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (sort) params.set("sort", sort);

  try {
    return await apiFetch<PaginaOutput<ProductoSucursal>>(
      `/api/productos/obtener-productos/${sucursalId}?${params.toString()}`
    );
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return paginaVacia(page, size);
    }
    throw e;
  }
}
