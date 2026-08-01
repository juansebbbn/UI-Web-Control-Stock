import "server-only";
import { apiFetch } from "@/lib/api";
import type { PaginaOutput } from "@/lib/types/api";
import type { DTOResumenDiario, DTOResumenGlobal, RankingItem } from "@/lib/types/dominio";

export type RangoResuelto = {
  /** yyyy-MM-dd, para prellenar los inputs de fecha */
  inicioFecha: string;
  finFecha: string;
  /** yyyy-MM-ddTHH:mm:ss, formato que exige DTORangoFechas */
  inicioIso: string;
  finIso: string;
};

/** Resuelve el rango de fechas de los searchParams, con default de últimos 30 días. */
export function resolverRango(sp: { inicio?: string; fin?: string }): RangoResuelto {
  const hoy = new Date();
  const hace30 = new Date();
  hace30.setDate(hoy.getDate() - 30);

  const inicioFecha = sp.inicio || hace30.toISOString().slice(0, 10);
  const finFecha = sp.fin || hoy.toISOString().slice(0, 10);

  return {
    inicioFecha,
    finFecha,
    inicioIso: `${inicioFecha}T00:00:00`,
    finIso: `${finFecha}T23:59:59`,
  };
}

export type Rankings = {
  masVendidos: PaginaOutput<RankingItem>;
  masRentables: PaginaOutput<RankingItem>;
  ventasPromedioDiarias: PaginaOutput<RankingItem>;
};

/** Página (0-based) solicitada para cada uno de los 3 rankings; default 0. */
export type RankingsPages = {
  masVendidos?: number;
  masRentables?: number;
  ventasPromedioDiarias?: number;
};

function fetchRanking(
  path: string,
  inicioIso: string,
  finIso: string,
  page: number
): Promise<PaginaOutput<RankingItem>> {
  return apiFetch<PaginaOutput<RankingItem>>(`${path}?page=${page}`, {
    method: "POST",
    body: { inicio: inicioIso, fin: finIso },
  });
}

export async function fetchRankingsSucursal(
  sucursalId: number | string,
  rango: RangoResuelto,
  pages: RankingsPages = {}
): Promise<Rankings> {
  const base = `/api/analisis-datos/sucursal/${sucursalId}`;
  const [masVendidos, masRentables, ventasPromedioDiarias] = await Promise.all([
    fetchRanking(`${base}/mas-vendidos`, rango.inicioIso, rango.finIso, pages.masVendidos ?? 0),
    fetchRanking(`${base}/mas-rentables`, rango.inicioIso, rango.finIso, pages.masRentables ?? 0),
    fetchRanking(
      `${base}/ventas-promedio-diarias`,
      rango.inicioIso,
      rango.finIso,
      pages.ventasPromedioDiarias ?? 0
    ),
  ]);
  return { masVendidos, masRentables, ventasPromedioDiarias };
}

export async function fetchRankingsGlobal(rango: RangoResuelto, pages: RankingsPages = {}): Promise<Rankings> {
  const base = "/api/analisis-datos/global";
  const [masVendidos, masRentables, ventasPromedioDiarias] = await Promise.all([
    fetchRanking(`${base}/mas-vendidos`, rango.inicioIso, rango.finIso, pages.masVendidos ?? 0),
    fetchRanking(`${base}/mas-rentables`, rango.inicioIso, rango.finIso, pages.masRentables ?? 0),
    fetchRanking(
      `${base}/ventas-promedio-diarias`,
      rango.inicioIso,
      rango.finIso,
      pages.ventasPromedioDiarias ?? 0
    ),
  ]);
  return { masVendidos, masRentables, ventasPromedioDiarias };
}

export async function fetchResumenDiarioSucursal(sucursalId: number | string): Promise<DTOResumenDiario> {
  return apiFetch<DTOResumenDiario>(`/api/analisis-datos/sucursal/${sucursalId}/resumen-diario`);
}

export async function fetchResumenGlobal(): Promise<DTOResumenGlobal> {
  return apiFetch<DTOResumenGlobal>("/api/analisis-datos/global/resumen");
}
