import { Suspense, type ReactNode } from "react";

import {
  DashboardMobileNav,
  DashboardNav,
} from "@/components/layout/dashboard-nav";
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
        <DashboardMobileNav />

        <div className="mx-auto hidden w-full max-w-6xl flex-wrap items-center gap-4 px-4 py-3 md:flex md:gap-8">
          <div className="min-w-0">
            <p className="truncate text-xl font-bold tracking-tight text-brand-700">
              TruckingControl
            </p>
          </div>

          <div className="min-w-0 flex-1 overflow-x-auto">
            <DashboardNav />
          </div>

          <form action={cerrarSesion} className="shrink-0 md:mr-4">
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
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-3 md:hidden">
          <div className="absolute left-4 h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mx-auto hidden w-full max-w-6xl flex-wrap items-center gap-4 px-4 py-3 md:flex md:gap-8">
          <div className="flex flex-col gap-1.5">
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-9 w-24 shrink-0 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
          <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-100 md:mr-4" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </>
  );
}
