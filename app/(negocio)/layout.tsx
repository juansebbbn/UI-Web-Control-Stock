import { redirect } from "next/navigation";
import Link from "next/link";
import { Package2 } from "lucide-react";
import { getSession } from "@/lib/session";
import { UserNav } from "@/components/layout/user-nav";

export default async function NegocioLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50">
      <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-card px-4 sm:px-6">
        <Link href="/negocio" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package2 aria-hidden="true" className="size-4" />
          </div>
          <span className="text-sm font-semibold text-neutral-900">Control de Stock</span>
        </Link>
        <div className="w-56">
          <UserNav email={session.user.email} />
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
