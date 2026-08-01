import { Package2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Package2 aria-hidden="true" className="size-6" />
          </div>
          <h1 className="text-lg font-semibold text-neutral-900">Control de Stock</h1>
          <p className="text-sm text-neutral-600">
            Gestión de inventario, ventas y facturación multi-sucursal
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
