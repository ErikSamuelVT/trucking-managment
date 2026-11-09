import type { Metadata } from "next";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@/components/ui";
import { requireSession } from "@/modules/auth/lib/session";
import { UnidadesClient } from "@/modules/unidades/components/unidades-client";
import { listarUnidades } from "@/modules/unidades/services/unidad.service";

export const metadata: Metadata = {
  title: "Unidades",
};

export default function UnidadesPage() {
  return (
    <Suspense fallback={<UnidadesSkeleton />}>
      <UnidadesContent />
    </Suspense>
  );
}

async function UnidadesContent() {
  await requireSession();

  const unidades = await listarUnidades();

  return <UnidadesClient initialData={unidades} />;
}

function UnidadesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-56 w-full" />
      </CardContent>
    </Card>
  );
}
