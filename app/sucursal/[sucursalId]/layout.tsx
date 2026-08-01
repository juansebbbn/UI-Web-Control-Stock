import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { apiFetch } from "@/lib/api";
import type { Sucursal } from "@/lib/types/dominio";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";

type Props = {
  children: React.ReactNode;
  params: Promise<{ sucursalId: string }>;
};

export default async function SucursalLayout({ children, params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { sucursalId } = await params;
  const sucursales = await apiFetch<Sucursal[]>("/api/sucursales/listar");
  const actual = sucursales.find((s) => String(s.id) === sucursalId);

  if (!actual) notFound();

  return (
    <SidebarProvider>
      <AppSidebar sucursales={sucursales} actual={actual} email={session.user.email} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-neutral-200 bg-card px-4">
          <SidebarTrigger aria-label="Alternar barra lateral" />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium text-neutral-900">{actual.nombre}</span>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
