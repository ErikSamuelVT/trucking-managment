import { Suspense, type ReactNode } from "react";

import { Button } from "@/components/ui";
import { cerrarSesion } from "@/modules/auth/actions/sesion.actions";
import { requireSession } from "@/modules/auth/lib/session";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-slate-50">
      <Suspense fallback={<DashboardShellSkeleton />}>
        <DashboardShell>{children}</DashboardShell>
      </Suspense>
    </div>
  );
}

async function DashboardShell({ children }: { children: ReactNode }) {
  await requireSession();

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight text-brand-700">
              TruckingControl
            </p>
            <p className="text-xs text-slate-500">Administración de flotilla</p>
          </div>

          <form action={cerrarSesion}>
            <Button type="submit" variant="outline" size="sm">
              Cerrar sesión
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </>
  );
}

function DashboardShellSkeleton() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </>
  );
}
