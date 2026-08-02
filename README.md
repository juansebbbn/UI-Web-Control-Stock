# Control de Stock — Frontend

Frontend Next.js (App Router) para el backend de gestión de inventario
multi-sucursal. No tiene lógica de negocio ni base de datos propia: es una
capa server-rendered que llama al backend REST y renderiza el resultado.

Ver también: [`../PROGRESO.md`](../PROGRESO.md) (historial de desarrollo),
[`../DEPLOY.md`](../DEPLOY.md) (despliegue), [`../EXPOSICION.md`](../EXPOSICION.md),
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) (tokens y convenciones de UI) y
[`CLAUDE.md`](./CLAUDE.md) / [`AGENTS.md`](./AGENTS.md) (notas de arquitectura para agentes).

## Stack

- Next.js 16 (App Router) + React 19, casi todo Server Components
- Tailwind CSS 4 + shadcn/ui (`components.json`: estilo `base-nova`)
- TypeScript, ESLint (flat config)
- Autenticación por cookie httpOnly (`cs_session` = JWT, `cs_user`), sin estado en el cliente

## Requisitos

- Node.js 22+
- El backend (`../server`) corriendo — por defecto en `http://localhost:8080`

## Comandos

```bash
npm install
npm run dev     # servidor de desarrollo (Turbopack), http://localhost:3000
npm run build   # build de producción
npm run start   # correr el build de producción
npm run lint    # eslint
npx tsc --noEmit  # type-check (no hay script dedicado)
```

No hay suite de tests configurada en este repo (la verificación end-to-end
con Playwright se hizo manualmente durante el desarrollo, ver `../PROGRESO.md`).

## Configuración

No hay `.env` commiteado. La única variable de entorno leída en código es:

| Variable | Obligatoria | Default | Notas |
|---|---|---|---|
| `BACKEND_URL` | No en local / sí en prod | `http://localhost:8080` | Se lee en `lib/api.ts` (`import "server-only"`, nunca llega al navegador) |

## Estructura

```
app/
├── (auth)/                        # /login, /registro — público
├── (negocio)/negocio/             # listado de sucursales, resumen global
└── sucursal/[sucursalId]/         # app scopeada a una sucursal:
    ├── productos/ ventas/ compras/
    ├── transferencias/ facturacion/
    └── resumen/ mi-cuenta/ soporte/
components/
├── ui/                             # shadcn/ui
└── {inventario,layout,resumen,shared}/  # compuestos propios del dominio
lib/
├── api.ts                          # cliente HTTP único al backend
├── session.ts                      # lectura/escritura de cookies de sesión
└── types/                          # DTOs (mirror 1:1 del backend)
proxy.ts                            # gatekeeper de rutas (reemplaza a middleware.ts)
```

## Arquitectura, en breve

- **`proxy.ts`** protege cada ruta según la presencia de la cookie `cs_session`
  (no valida el JWT en sí).
- **`lib/api.ts`** es el único cliente HTTP al backend: adjunta el JWT,
  desenvuelve el sobre `{ estado, mensaje, datos }` y lanza `ApiError` en errores.
- **Mutaciones vía Server Actions** (`actions.ts` con `"use server"` en cada
  feature), no hay Route Handlers ni API routes propias.
- Detalle completo de convenciones y decisiones en [`CLAUDE.md`](./CLAUDE.md).

## Pendiente / limitaciones conocidas

- Alta de venta desde la UI no implementada (solo ver/anular); el backend sí la soporta.
