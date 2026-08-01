import "server-only";
import { getSession } from "@/lib/session";
import type { ApiSalida } from "@/lib/types/api";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE";

type ApiOptions = {
  method?: ApiMethod;
  /** Se envuelve automáticamente como { contenido: body } salvo que raw sea true. */
  body?: unknown;
  raw?: boolean;
  cache?: RequestCache;
};

/**
 * Cliente único para hablar con el backend Spring Boot desde el servidor
 * (Server Components / Server Actions). Adjunta el JWT de la sesión actual
 * como Bearer y desenvuelve el sobre ApiSalida<T>, lanzando ApiError en
 * estado ERROR o status no-2xx.
 */
export async function apiFetch<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const session = await getSession();

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body:
      opts.body !== undefined
        ? JSON.stringify(opts.raw ? opts.body : { contenido: opts.body })
        : undefined,
    cache: opts.cache ?? "no-store",
  });

  const json = (await res.json().catch(() => null)) as ApiSalida<T> | null;

  if (!res.ok || !json || json.estado === "ERROR") {
    throw new ApiError(res.status, json?.mensaje ?? `Error ${res.status}`);
  }

  return json.datos as T;
}

/** Variante para login/registro: todavía no hay sesión, así que nunca se adjunta Bearer. */
export async function apiFetchPublic<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: opts.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    body:
      opts.body !== undefined
        ? JSON.stringify(opts.raw ? opts.body : { contenido: opts.body })
        : undefined,
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as ApiSalida<T> | null;

  if (!res.ok || !json || json.estado === "ERROR") {
    throw new ApiError(res.status, json?.mensaje ?? `Error ${res.status}`);
  }

  return json.datos as T;
}
