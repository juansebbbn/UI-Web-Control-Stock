# Design System — Control de Stock

Este es un sistema de back-office: lo va a usar el mismo empleado varias horas
por día, tomando decisiones rápidas sobre ventas, stock y facturación. La
prioridad es **legibilidad de datos y velocidad de acción**, no impacto visual.
Todo lo que sigue está implementado como tokens vivos en `app/globals.css`
(bloques `@theme`, `:root`, `.dark`), no es solo documentación.

## 1. Paleta de colores y modo

**Modo por defecto: claro, cálido (no blanco puro).** Para pantallas cargadas
de tablas y colores semánticos (stock bajo, error, pendiente), el contraste
sobre un fondo casi-blanco es más legible y menos fatigante en turnos largos
que sobre fondo oscuro, donde los colores de estado saturados "vibran". El
modo oscuro está resuelto vía clase `.dark` (togglable con `next-themes`, ya
instalado), pero no es el foco de esta iteración.

| Token | Hex (claro) | Uso |
|---|---|---|
| `--primary` | `#1E5FBF` | Acción principal: "Nueva factura", "Agregar producto", nav activo, links, foco |
| `--primary-hover` | `#184C99` | Hover/activo de botones primarios |
| `--teal` | `#0F766E` | Acciones secundarias con identidad propia: "Registrar compra", "Transferir" |
| `--neutral-50` | `#FAFAF9` | Fondo de la app |
| `--neutral-100` | `#F2F1EF` | Zebra de tablas, secciones sutiles |
| `--neutral-200` | `#E7E5E1` | Bordes, separadores |
| `--neutral-400` | `#A8A29A` | Placeholder, disabled |
| `--neutral-600` | `#5C5850` | Texto secundario |
| `--neutral-900` | `#211F1A` | Texto principal (negro cálido, no `#000`) |

**Colores semánticos** (stock y facturación):

| Estado | Texto | Fondo (badge) |
|---|---|---|
| Éxito / stock OK / entregada | `#15803D` | `#EAF6EC` |
| Advertencia / por agotarse | `#B45309` | `#FDF3E3` |
| Error / stock crítico / anulada | `#B91C1C` | `#FCEAEA` |
| Info / pendiente de facturar | `#1E5FBF` | `#E9F1FC` |

Los tonos de texto están a una oscuridad "700"-equivalente para que el badge
use texto oscuro sobre fondo tenue (más legible y menos "alarma constante" que
blanco sobre color saturado).

## 2. Tipografía y jerarquía

**Geist Sans** (vía `next/font/google`) como fuente única de UI — tiene
figuras tabulares reales, ideal para alinear columnas de números y montos.
**Geist Mono** solo para códigos de barra / IDs. No se suma Inter ni ninguna
otra familia: cero costo de migración, cumple el requisito de legibilidad
numérica sin dependencias nuevas.

| Elemento | Clases |
|---|---|
| Título de página (`h1`) | `text-2xl font-semibold` |
| Título de sección (`h2`) | `text-lg font-semibold` |
| Encabezado de columna | `text-xs font-medium uppercase tracking-wide text-neutral-600` |
| Cuerpo / celda de tabla | `text-sm` (+ `tabular-nums` si es numérica/fecha/moneda) |
| Número grande de KPI | `text-3xl font-bold tabular-nums` |
| Etiqueta de formulario | `text-sm font-medium` |

## 3. Componentes clave

- **Tablas**: bordes solo en header y pie de fila (sin grid completo), zebra
  `even:bg-neutral-100/50`, hover `hover:bg-neutral-100`, columnas numéricas
  alineadas a la derecha con `tabular-nums`, estado como badge `rounded-full`.
- **KPI cards**: `bg-card border border-border rounded-xl shadow-sm p-5`,
  elevación sutil — es un dashboard denso, no una landing.
- **Botones**: primario sólido (`bg-primary` → `bg-primary-hover`),
  destructivo (`bg-destructive/10 text-destructive`, ver `button.tsx`),
  `rounded-lg`, foco `ring-2 ring-ring/50`.
- **Inputs**: `border-input rounded-lg`, foco con anillo de `--ring` (mapeado
  al primario), error con `border-destructive` + texto de ayuda debajo.
- **Modales/paneles**: `Dialog`/`AlertDialog` de shadcn reservados para
  confirmaciones (eliminar, anular) y ediciones de un solo campo; cualquier
  flujo multi-campo (alta de producto, registrar venta/compra) es una ruta
  propia, no un modal — así queda enlazable y más simple con Server Actions.

## 4. Espaciado, bordes y sombras

- **Radio**: `--radius-sm` 6px, `--radius-lg` 10px (default: botones/inputs),
  `--radius-xl` 14px (cards/dialogs). Suave pero no infantil — nunca full-pill
  salvo badges.
- **Sombra**: `shadow-sm` en reposo (cards), `shadow-md` en popovers/menús,
  `shadow-lg` en diálogos.
- **Densidad**: por defecto "cómoda" (filas de tabla `py-3`). Una variante
  compacta queda documentada para una futura iteración, no se construyó un
  toggle de UI en esta pasada.

## 5. Elemento firma

El acento **teal (`#0F766E`)** es la decisión distintiva del sistema: no es
un color decorativo, está reservado exclusivamente para las acciones que
mueven stock físico entre estados (Registrar compra, Transferir), mientras
que el **azul primario** queda para navegación y acciones de gestión
(crear, facturar, guardar). Esta separación de dos familias de acción por
color —nunca decorativa, siempre semántica— es lo que hace que la interfaz
se lea como un sistema propio y no como un dashboard genérico con un único
acento. Se usa como máximo un acento por vista (nunca azul y teal
compitiendo por atención en la misma pantalla).

## 6. Principios de UX visual

- Una sola acción primaria visualmente dominante por pantalla (el botón
  `primary`); todo lo demás usa `outline`/`ghost`/`secondary` para no competir.
- Los datos densos (tablas, rankings) se apoyan en tipografía y espaciado
  para jerarquía, no en color — el color se reserva para estado semántico.
- Las advertencias de reglas de negocio no obvias (p. ej. "editar el nombre
  afecta el catálogo global") se muestran como texto inline no bloqueante,
  nunca como un modal que interrumpe el flujo.
