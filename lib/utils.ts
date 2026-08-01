import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

export function formatMoney(value: number): string {
  return currencyFormatter.format(value);
}

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "long" });

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

const numberFormatter = new Intl.NumberFormat("es-AR");

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** yyyy-MM-ddTHH:mm:ss — formato ISO-8601 sin offset que espera DTORangoFechas del backend. */
export function toBackendIsoDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/** Pagina en memoria un array ya cargado por completo (para listados que el backend no pagina). */
export function paginateArray<T>(items: T[], page: number, size: number) {
  const totalElementos = items.length;
  const totalPaginas = Math.max(1, Math.ceil(totalElementos / size));
  const start = page * size;
  return {
    contenido: items.slice(start, start + size),
    pagina: page,
    totalPaginas,
    tieneSiguiente: start + size < totalElementos,
  };
}

/** Arma un href a `pathname` combinando los searchParams actuales con overrides (undefined elimina la clave). */
export function buildSearchHref(
  pathname: string,
  current: Record<string, string | undefined>,
  overrides: Record<string, string | number | undefined>
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...current, ...overrides })) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
