import { redirect } from "next/navigation";

type Props = { params: Promise<{ sucursalId: string }> };

export default async function SucursalIndexPage({ params }: Props) {
  const { sucursalId } = await params;
  redirect(`/sucursal/${sucursalId}/resumen`);
}
