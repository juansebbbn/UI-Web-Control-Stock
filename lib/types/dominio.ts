// Tipos que reflejan 1:1 los DTOs y entidades reales del backend
// (backend/src/main/java/.../core/dto y .../entities/enums).
// No inventar campos/valores que no existan en esas fuentes.

export type CategoriaNegocio = "KIOSKO_ALMACEN" | "FERRETERIA" | "FARMACIA";

export type TipoTransaccion = "COMPRA" | "VENTA" | "AJUSTE";

export type TipoDocumentoCliente = "CUIT" | "CUIL" | "DNI" | "CONSUMIDOR_FINAL";

export type CondicionIva =
  | "RESPONSABLE_INSCRIPTO"
  | "MONOTRIBUTISTA"
  | "CONSUMIDOR_FINAL"
  | "EXENTO";

// PENDIENTE / FACTURADA / ERROR — no hay controller de facturación aún,
// así que en la práctica solo se observa PENDIENTE.
export type EstadoFacturacion = "PENDIENTE" | "FACTURADA" | "ERROR";

export type TipoNotificacion = "SUGERENCIA_REABASTECIMIENTO" | "STOCK_CRITICO";

// metodoPago y tipoComprobante NO son enums en el backend (son String/Integer
// libres, sin validación de valores permitidos) — se ofrecen opciones
// sugeridas en la UI pero el tipo se mantiene abierto.
export type MetodoPago = string;

export type AtributosPersonalizados = Record<string, unknown>;

// --- Sucursales (DTOInfoSucursal / DTOCreacionSucursal) ---

export type Sucursal = {
  id: number;
  nombre: string;
  direccion: string | null;
};

export type CrearSucursalInput = {
  nombre: string;
  direccion?: string | null;
};

// --- Productos (DTOInfoProducto / DTOCreacionProducto / DTOActualizacionProducto) ---

export type ProductoSucursal = {
  productoId: number;
  codigoBarras: string;
  nombre: string;
  marca: string | null;
  stock: number;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  atributosPersonalizados: AtributosPersonalizados | null;
};

export type CrearProductoInput = {
  codigoBarras: string;
  nombre: string;
  marca?: string | null;
  stock: number;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  atributosPersonalizados?: AtributosPersonalizados | null;
};

export type ActualizarProductoInput = Partial<{
  nombre: string;
  marca: string | null;
  stock: number;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  atributosPersonalizados: AtributosPersonalizados | null;
}>;

// --- Inventario: ventas / compras ---

// DTOInfoCliente (input)
export type InfoClienteInput = {
  metodoPago: MetodoPago;
  tipoComprobante: number;
  tipoDocumento: TipoDocumentoCliente;
  numeroDocumento: string;
  nombreRazonSocial: string;
  condicionIva: CondicionIva;
  direccion?: string | null;
  ciudad?: string | null;
  provincia?: string | null;
};

// DTOInfoProveedor (input)
export type InfoProveedorInput = {
  nombreProveedor?: string | null;
  numeroFactura?: string | null;
};

// DTOMovimientoInventario / DTORegistrarMovimientoRequest (input)
export type RegistrarMovimientoInput = {
  sucursalId: number;
  tipoTransaccion: TipoTransaccion;
  movimiento: {
    // productoId -> cantidad (BigDecimal en el backend; la UI solo envía enteros positivos)
    cantidadesPorProducto: Record<string, number>;
  };
  infoCliente?: InfoClienteInput | null;
  infoProveedor?: InfoProveedorInput | null;
};

// DTOInstantaneaClienteOutput
export type InstantaneaClienteOutput = {
  tipoDocumento: TipoDocumentoCliente;
  numeroDocumento: string;
  nombreRazonSocial: string;
  condicionIva: CondicionIva;
  direccion: string | null;
  ciudad: string | null;
  provincia: string | null;
};

// DTODetalleVentaOutput
export type DetalleVentaOutput = {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

// DTOVentaOutput
export type DTOVentaOutput = {
  id: number;
  sucursalId: number;
  fechaCreacion: string;
  montoTotal: number;
  metodoPago: MetodoPago;
  tipoComprobante: number;
  estadoFacturacion: EstadoFacturacion;
  cae: string | null;
  anulada: boolean;
  fechaAnulacion: string | null;
  cliente: InstantaneaClienteOutput | null;
  detalles: DetalleVentaOutput[];
};

// DTODetalleReposicionOutput
export type DetalleReposicionOutput = {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  costoUnitario: number;
};

// DTOReposicionOutput
export type DTOReposicionOutput = {
  id: number;
  sucursalId: number;
  fechaCreacion: string;
  nombreProveedor: string | null;
  numeroFactura: string | null;
  costoTotal: number;
  detalles: DetalleReposicionOutput[];
};

// DTOResultadoMovimientoStock (respuesta de /api/inventario/manual)
export type MovimientoInventarioResultado = {
  productoId: number;
  nombreProducto: string;
  tipoTransaccion: TipoTransaccion;
  monto: number;
  stockRestante: number;
};

// --- Transferencias ---

// DTOTransferenciaStockRequest (input)
export type TransferenciaStockInput = {
  sucursalOrigenId: number;
  sucursalDestinoId: number;
  cantidadesPorProducto: Record<string, number>;
};

// DTOResultadoTransferenciaStock (respuesta de POST /api/transferencias)
export type TransferenciaResultado = {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  stockRestanteOrigen: number;
  stockRestanteDestino: number;
};

// DTOTransferenciaOutput (historial)
export type TransferenciaHistorial = {
  id: number;
  fechaCreacion: string;
  sucursalOrigenId: number;
  sucursalDestinoId: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
};

// --- Notificaciones ---

// DTONotificacionOutput
export type Notificacion = {
  id: number;
  mensaje: string;
  productoId: number;
  fechaCreacion: string;
  entregada: boolean;
};

// --- Análisis de datos ---

// DTORangoFechas (input) — ISO-8601 yyyy-MM-ddTHH:mm:ss
export type RangoFechasInput = {
  inicio: string;
  fin: string;
};

// DTOAnalisisProductoBigDecimal
export type RankingItem = {
  nombre: string;
  valor: number;
};

// DTOResumenDiario.ProductoBajoStockMinimo
export type ProductoBajoStockMinimo = {
  nombreProducto: string;
  stockActual: number;
  stockMinimo: number;
};

// DTOResumenDiario.ProductoPorAgotarse
export type ProductoPorAgotarse = {
  nombreProducto: string;
  ventasPromedioDiarias: number;
  diasStockRestante: number;
};

// DTOResumenDiario (por sucursal)
export type DTOResumenDiario = {
  totalProductosVendidos: number;
  gananciaDiaria: number;
  productosBajoStockMinimo: ProductoBajoStockMinimo[];
  productosPorAgotarse: ProductoPorAgotarse[];
};

// DTOResumenGlobal.ProductoBajoStockMinimo (con sucursal)
export type ProductoBajoStockMinimoGlobal = {
  sucursalId: number;
  nombreSucursal: string;
  nombreProducto: string;
  stockActual: number;
  stockMinimo: number;
};

// DTOResumenGlobal.ProductoPorAgotarse (con sucursal)
export type ProductoPorAgotarseGlobal = {
  sucursalId: number;
  nombreSucursal: string;
  nombreProducto: string;
  ventasPromedioDiarias: number;
  diasStockRestante: number;
};

// DTOResumenGlobal
export type DTOResumenGlobal = {
  totalProductosVendidos: number;
  gananciaDiaria: number;
  productosBajoStockMinimo: ProductoBajoStockMinimoGlobal[];
  productosPorAgotarse: ProductoPorAgotarseGlobal[];
};

// --- Autenticación ---

export type CompletarPerfilInput = {
  cuit: string;
};
