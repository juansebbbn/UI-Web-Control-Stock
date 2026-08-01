export const PAGE_SIZE_DEFAULT = 10;
export const PAGE_SIZE_TRANSFERENCIAS = 20;

// El sort por defecto de /api/productos/obtener-productos/{sucursalId} es
// "nombre", que rompe con 500 porque ese campo vive en Producto, no en
// ProductoSucursal (ver ControladorProducto / ServicioProducto en el backend).
// Nunca usar "nombre" como default acá.
export const PRODUCTOS_DEFAULT_SORT = "stock,asc";

export const VENTAS_DEFAULT_SORT = "fechaCreacion,desc";
export const COMPRAS_DEFAULT_SORT = "fechaCreacion,desc";
export const TRANSFERENCIAS_DEFAULT_SORT = "fechaCreacion,desc";

export const METODOS_PAGO_SUGERIDOS = [
  "EFECTIVO",
  "TARJETA_DEBITO",
  "TARJETA_CREDITO",
  "TRANSFERENCIA",
  "MERCADO_PAGO",
] as const;

export const CATEGORIAS_NEGOCIO = [
  { value: "KIOSKO_ALMACEN", label: "Kiosko / Almacén" },
  { value: "FERRETERIA", label: "Ferretería" },
  { value: "FARMACIA", label: "Farmacia" },
] as const;

export const TIPOS_DOCUMENTO_CLIENTE = [
  { value: "CUIT", label: "CUIT" },
  { value: "CUIL", label: "CUIL" },
  { value: "DNI", label: "DNI" },
  { value: "CONSUMIDOR_FINAL", label: "Consumidor final" },
] as const;

export const CONDICIONES_IVA = [
  { value: "RESPONSABLE_INSCRIPTO", label: "Responsable inscripto" },
  { value: "MONOTRIBUTISTA", label: "Monotributista" },
  { value: "CONSUMIDOR_FINAL", label: "Consumidor final" },
  { value: "EXENTO", label: "Exento" },
] as const;
