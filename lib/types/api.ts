export type EstadoApi = "SUCCESS" | "ERROR";

export type ApiSalida<T> = {
  estado: EstadoApi;
  mensaje: string;
  datos: T | null;
};

export type PaginaOutput<T> = {
  contenido: T[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
};
