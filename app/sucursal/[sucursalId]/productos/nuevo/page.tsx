import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { fetchProductosSucursal } from "@/lib/productos";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NuevoProductoForm } from "./nuevo-producto-form";

type Props = { params: Promise<{ sucursalId: string }> };

export default async function NuevoProductoPage({ params }: Props) {
  const { sucursalId } = await params;

  // Traemos una página grande de lo ya cargado en esta sucursal para mostrarlo
  // como referencia antes del alta, y para el chequeo de duplicados en el cliente.
  const data = await fetchProductosSucursal(sucursalId, { size: 100, sort: "stock,asc" });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <Link
          href={`/sucursal/${sucursalId}/productos`}
          className="mb-2 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft aria-hidden="true" className="size-3.5" /> Volver a productos
        </Link>
        <h1 className="text-2xl font-semibold text-neutral-900">Agregar producto</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <NuevoProductoForm sucursalId={sucursalId} productosExistentes={data.contenido} />
          </CardContent>
        </Card>

        <Card className="min-w-0 shadow-sm">
          <CardContent className="pt-6">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">Productos ya cargados en esta sucursal</h2>
            {data.contenido.length === 0 ? (
              <p className="text-sm text-neutral-600">Todavía no hay productos cargados acá.</p>
            ) : (
              <div className="max-h-[28rem] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.contenido.map((p) => (
                      <TableRow key={p.productoId}>
                        <TableCell className="font-medium">{p.nombre}</TableCell>
                        <TableCell className="font-mono text-xs text-neutral-600">{p.codigoBarras}</TableCell>
                        <TableCell className="text-right tabular-nums">{p.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
