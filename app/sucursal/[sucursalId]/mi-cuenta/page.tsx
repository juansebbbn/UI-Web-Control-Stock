import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerfilForm } from "./perfil-form";

export default async function MiCuentaPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Mi cuenta</h1>
        <p className="text-sm text-neutral-600">Datos de tu cuenta de usuario.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Datos de acceso</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-info-bg text-info">
            <Mail aria-hidden="true" className="size-4" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">Email</p>
            <p className="text-sm font-medium text-neutral-900">{session.user.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Completar perfil fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <PerfilForm />
        </CardContent>
      </Card>
    </div>
  );
}
