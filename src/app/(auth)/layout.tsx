import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Autenticación",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-brand-700"
          >
            TruckingControl
          </Link>
          <p className="mt-1 text-sm text-slate-500">
            Administración de la flotilla
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}
