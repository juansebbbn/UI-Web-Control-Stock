# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

The project runs **Next.js 16.2.12** with **React 19.2.4** — versions newer than your training data. The one breaking change you will hit immediately: **`middleware.ts` is renamed `proxy.ts`**, and the exported function is `proxy` (or a default export), not `middleware`. This repo's root `proxy.ts` handles session-cookie-based route protection — see below.

## Commands

```bash
npm run dev     # start dev server (Next.js, Turbopack)
npm run build   # production build
npm run start   # run production build
npm run lint    # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

No test suite is configured. Type-check with `npx tsc --noEmit` if needed (no dedicated script exists).

There is no `.env` committed — the only runtime env var read in code is `BACKEND_URL` (defaults to `http://localhost:8080`), see `lib/api.ts`.

## Architecture

This is a **Next.js App Router frontend for a separate Spring Boot backend** (`../backend` in this recreation, not part of this repo). The frontend holds no business logic or database access — it's a thin server-rendered layer that calls backend REST endpoints and renders the results. Nearly everything is a Server Component or Server Action; there is very little client-side state.

### Request flow

1. **`proxy.ts`** (repo root) gate-keeps every route: unauthenticated requests to non-public paths redirect to `/login`; authenticated requests to `/login` or `/registro` redirect to `/negocio`. It only checks for the presence of the `cs_session` cookie — it does not validate the JWT.
2. **`lib/session.ts`** reads/writes two httpOnly cookies (`cs_session` = JWT, `cs_user` = JSON user info). `getSession()` is safe in Server Components; `setSession()`/`clearSession()` can only be called from Server Actions/Route Handlers (`next/headers` cookie-mutation rule).
3. **`lib/api.ts`** is the single HTTP client to the backend. `apiFetch<T>()` (authenticated) pulls the JWT from `getSession()` and attaches `Authorization: Bearer`; `apiFetchPublic<T>()` (login/registro, no session yet) does not. Both:
   - wrap the request body as `{ contenido: body }` unless `raw: true` is passed,
   - unwrap the backend's `ApiSalida<T>` envelope (`{ estado, mensaje, datos }`, see `lib/types/api.ts`),
   - throw `ApiError(status, message)` on non-2xx or `estado === "ERROR"`.
   - Both are marked `import "server-only"` — never import `lib/api.ts` or `lib/session.ts` from a Client Component.

### Route structure (`app/`)

- **`app/(auth)/`** — `/login`, `/registro`, público, layout propio (sin sidebar/gating de sesión más allá de `proxy.ts`).
- **`app/(negocio)/negocio/`** — páginas a nivel negocio (listado de sucursales, resumen global) bajo un layout con sesión validada y un header simple.
- **`app/sucursal/[sucursalId]/`** — la app scopeada a una sucursal (productos, ventas, compras, transferencias, facturación, resumen, mi-cuenta, soporte). Su `layout.tsx` re-chequea la sesión, trae el listado de sucursales, hace `notFound()` si `sucursalId` no es una a la que el usuario tiene acceso, y envuelve el contenido en `SidebarProvider`/`AppSidebar`.
- Route params y `cookies()` son async en esta versión de Next.js — siempre `await params` / `await cookies()`.

### Mutaciones: Server Actions, no API routes

Cada feature en `app/sucursal/[sucursalId]/<feature>/` tiene su propio `actions.ts` (`"use server"`):
- Parseo manual de `FormData` + validación, devolviendo `{ error?: string }` (se usa con `useActionState`/`useFormStatus` vía `components/shared/submit-button.tsx` y `components/shared/form-message.tsx`).
- Captura `ApiError` de `lib/api.ts` y muestra `e.message` en el form; fallback genérico si no.
- Al tener éxito: `revalidatePath(...)` de la ruta de listado, y luego `redirect()` (alta) o `{}` (edición in-place / diálogo).
- No hay Route Handlers (`app/api/**/route.ts`): todo llamado al backend ocurre server-side, vía Server Components (GET) o Server Actions (mutaciones).

### Tipos (`lib/types/`)

`lib/types/dominio.ts` mirrorea los DTOs/enums del backend **1:1** — no inventar campos/valores que no existan en el backend real. `lib/types/api.ts` tiene los tipos genéricos del sobre (`ApiSalida<T>`, `PaginaOutput<T>`). Al agregar un tipo para un endpoint nuevo, calcar el DTO del backend exactamente en vez de adivinar/simplificar — revisar `lib/constants.ts` para quirks conocidos del backend (p. ej. el comentario sobre el sort por defecto que devuelve 500 en un endpoint real).

### Sistema de UI

- Los componentes shadcn/ui viven en `components/ui/` (`components.json`: estilo `base-nova`, color base `neutral`, RSC habilitado, íconos `lucide`). Los compuestos propios del dominio viven en `components/{inventario,layout,resumen,shared}/`.
- **`DESIGN_SYSTEM.md`** es la fuente de verdad para tokens de color, tipografía y convenciones de componentes (tablas, KPI cards, botones, espaciado/radio) — documenta tokens vivos en `app/globals.css` (`@theme`, `:root`, `.dark`), no es solo prosa. Leerlo antes de estilar UI nueva: es un back-office denso (tema claro cálido por defecto, `tabular-nums` en columnas numéricas, colores semánticos de estado reservados a estado real no decoración, flujos multi-campo son rutas propias en vez de modales).
- Alias de path (`tsconfig.json` / `components.json`): `@/*` → raíz del repo, `@/components`, `@/lib`, `@/hooks`, `@/components/ui`.
